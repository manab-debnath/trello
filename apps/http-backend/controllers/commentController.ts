import type { Request, Response } from "express";
import { logger, redis } from "..";
import { prisma } from "db/client";
import type { Comment } from "db/types";

const QUERY_KEY = "comments";

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

const getAllComments = async (
  req: Request<{ orgID: string; issueID: string }>,
  res: Response,
) => {
  const { orgID, issueID } = req.params;

  if (!orgID || !issueID) {
    return res.status(400).json({ message: "Invalid URL parameters" });
  }

  try {
    // fetch comments from cache
    const cache = await redis.get(QUERY_KEY);
    if (cache) {
      const cachedComments = JSON.parse(cache);
      return res.status(200).json({
        message: "Comments retrieved successfully",
        comments: cachedComments,
      });
    }

    const comments = await prisma.comment.findMany({
      where: {
        issueID,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const commentTree = buildCommentTree(comments);

    // add comments to cache
    await redis.set(
      QUERY_KEY,
      JSON.stringify({ comments: commentTree, createdAt: new Date() }),
      "EX",
      60 * 60 * 24 * 7,
    );

    return res.status(200).json({
      message: "Comments retrieved successfully",
      comments: commentTree,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get comments");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateComment = async (
  req: Request<{ orgID: string; issueID: string; commentID: string }>,
  res: Response,
) => {
  const { orgID, issueID, commentID } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentID, issueID },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    } else {
      if (comment.user.id !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentID, issueID },
      data: { content },
    });

    // delete comment cache
    await redis.del(QUERY_KEY);

    return res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    logger.error({ error }, "Failed to update comment");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteComment = async (
  req: Request<{ orgID: string; issueID: string; commentID: string }>,
  res: Response,
) => {
  const { orgID, issueID, commentID } = req.params;

  if (!orgID || !issueID || !commentID) {
    return res.status(400).json({ message: "Invalid URL parameters" });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentID, issueID },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    } else {
      if (comment.user.id !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }

    await prisma.comment.delete({
      where: { id: commentID, issueID },
    });

    // delete comment from cache
    await redis.del(QUERY_KEY);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.error({ error }, "Failed to delete comment");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const buildCommentTree = (comments: Comment[]) => {
  const commentMap = new Map();

  for (const comment of comments) {
    commentMap.set(comment.id, {
      ...comment,
      replies: [],
    });
  }

  const rootComments = [];

  for (const comment of comments) {
    const current = commentMap.get(comment.id);

    if (current.parentID) {
      const parent = commentMap.get(current.parentID);

      if (parent) {
        parent.replies.push(current);
      }
    } else {
      rootComments.push(current);
    }
  }

  return rootComments;
};

export { createComment, getAllComments, updateComment, deleteComment };
