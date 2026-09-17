import type { Request, Response } from "express";
import { logger } from "..";
import { prisma } from "db/client";

const createComment = async (
  req: Request<{ orgID: string; issueID: string }>,
  res: Response,
) => {
  const { orgID, issueID } = req.params;
  const { content, parentID } = req.body;

  if (!orgID || !issueID) {
    return res.status(400).json({ message: "Invalid URL parameters" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    if (parentID) {
      // parentID must be a valid comment ID
      // parent comment must belong to the same issue
      const parentComment = await prisma.comment.findUnique({
        where: {
          id: parentID,
          issueID,
        },
      });

      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        issueID,
        userID: req.user.id,
        parentID: parentID ?? null,
      },
    });

    return res
      .status(201)
      .json({ message: "Comment created successfully", comment });
  } catch (error) {
    logger.error({ error }, "Failed to create comment");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createComment };
