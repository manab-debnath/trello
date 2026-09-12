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
        sectionID: true,
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

export { createNewIssue, deleteIssue, getIssues };
