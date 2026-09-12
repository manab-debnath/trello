import type { Request, Response } from "express";
import { logger } from "..";
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

export { createNewIssue, deleteIssue };
