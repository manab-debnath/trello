import type { Request, Response } from "express";
import { logger, redis } from "..";
import { prisma } from "db/client";

const createNewIssue = async (
  req: Request<{ orgID: string; boardID: string }>,
  res: Response,
) => {
  const { orgID, boardID } = req.params;
  const { title, description, sectionID } = req.body;

  if (!boardID) {
    return res.status(400).json({ message: "boardID is required" });
  }

  if (!title || !description || !sectionID) {
    return res
      .status(400)
      .json({ message: "Please provide title, description, and sectionID" });
  }

  try {
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        boardId: boardID,
        sectionID,
      },
    });

    return res
      .status(201)
      .json({ message: "Issue created successfully", issue });
  } catch (error) {
    logger.error({ error }, "Failed to create new issue");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteIssue = async (
  req: Request<{ orgID: string; boardID: string; issueID: string }>,
  res: Response,
) => {
  const { boardID, issueID } = req.params;

  if (!issueID || !boardID) {
    return res
      .status(400)
      .json({ message: "issueID and boardID are required" });
  }

  try {
    const issue = await prisma.issue.delete({
      where: {
        id: issueID,
        boardId: boardID,
      },
    });

    return res
      .status(200)
      .json({ message: "Issue deleted successfully", issue });
  } catch (error) {
    logger.error({ error }, "Failed to delete issue");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateIssue = async (
  req: Request<{ orgID: string; boardID: string; issueID: string }>,
  res: Response,
) => {
  const { boardID, issueID } = req.params;
  const { title, description, sectionID } = req.body;

  if (!issueID || !boardID) {
    return res
      .status(400)
      .json({ message: "issueID and boardID are required" });
  }

  if (!title && !description && !sectionID) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updatedIssue = await prisma.issue.update({
      where: {
        id: issueID,
        boardId: boardID,
      },
      data: {
        title,
        description,
        sectionID,
      },
      omit: {
        boardId: true,
      },
    });

    const cachedIssue = await redis.get(`issue:${issueID}`);
    if (cachedIssue) {
      await redis.del(`issue:${issueID}`);
    }

    return res
      .status(200)
      .json({ message: "Issue updated successfully", updatedIssue });
  } catch (error) {
    logger.error({ error }, "Failed to update issue");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getIssues = async (req: Request<{ boardID: string }>, res: Response) => {
  const { boardID } = req.params;

  if (!boardID) {
    return res.status(400).json({ message: "boardID is required" });
  }

  // pagination
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  if (
    !Number.isInteger(page) ||
    page <= 0 ||
    !Number.isInteger(limit) ||
    limit <= 0 ||
    limit > 100
  ) {
    return res.status(400).json({
      message: "Invalid pagination number",
    });
  }

  try {
    // Get cached issues
    const cacheKey = `issues:${boardID}:${page}:${limit}`;
    const cachedIssues = await redis.get(cacheKey);

    if (cachedIssues) {
      return res.status(200).json({
        message: "Issues retrieved successfully",
        issues: JSON.parse(cachedIssues),
      });
    }

    const skip = (page - 1) * limit;

    const issues = await prisma.issue.findMany({
      where: {
        boardId: boardID,
      },
      omit: {
        boardId: true,
      },
      skip: skip,
      take: limit,
    });

    // Set issues in cache for 20 seconds
    await redis.set(cacheKey, JSON.stringify(issues), "EX", 20);

    return res
      .status(200)
      .json({ message: "Issues retrieved successfully", issues });
  } catch (error) {
    logger.error({ error }, "Failed to get issues");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getIssue = async (req: Request<{ issueID: string }>, res: Response) => {
  const { issueID } = req.params;

  if (!issueID) {
    return res.status(400).json({ message: "issueID is required" });
  }

  try {
    // get issue from cache
    const cacheKey = `issue:${issueID}`;
    const cachedIssue = await redis.get(cacheKey);

    if (cachedIssue) {
      return res.status(200).json({
        message: "Issue retrieved successfully",
        issue: JSON.parse(cachedIssue),
      });
    }

    const issue = await prisma.issue.findUnique({
      where: {
        id: issueID,
      },
      omit: {
        boardId: true,
      },
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // set cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(issue), "EX", 60 * 5);

    return res
      .status(200)
      .json({ message: "Issue retrieved successfully", issue });
  } catch (error) {
    logger.error({ error }, "Failed to get issue");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const assignIssueToUser = async (
  req: Request<{ orgID: string; issueID: string }>,
  res: Response,
) => {
  const { orgID, issueID } = req.params;
  const { userIDs } = req.body;

  if (!issueID) {
    return res.status(400).json({ message: "issueID are required" });
  }

  if (!Array.isArray(userIDs) || userIDs.length === 0) {
    return res.status(400).json({ message: "userIDs are required" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const organizationUser = await tx.organizationUser.findMany({
        where: {
          organizationID: orgID,
          userID: {
            in: userIDs,
          },
        },
        select: { userID: true },
      });

      if (userIDs.length !== organizationUser.length) {
        throw new Error("Some users are not part of the organization");
      }

      const assignUser = await prisma.issueUser.createMany({
        data: userIDs.map((userID: string) => ({
          issueID,
          userID,
        })),
        skipDuplicates: true,
      });

      return assignUser;
    });

    return res
      .status(200)
      .json({ message: "Users assigned successfully", result });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Some users are not part of the organization"
    ) {
      return res.status(400).json({ message: error.message });
    }
    logger.error({ error }, "Failed to assign user to issue");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createNewIssue,
  deleteIssue,
  updateIssue,
  getIssues,
  getIssue,
  assignIssueToUser,
};
