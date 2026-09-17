import { IssueStatus } from "db/types";
import type { Request, Response } from "express";
import { logger, redis } from "..";
import { prisma } from "db/client";
import { Prisma } from "../../../packages/db/generated/prisma/client";

const isIssueStatus = (value: unknown): value is IssueStatus => {
  return Object.values(IssueStatus).includes(value as IssueStatus);
};

const createSection = async (
  req: Request<{ boardID: string }>,
  res: Response,
) => {
  const { boardID } = req.params;
  const { status } = req.body;

  if (!boardID) {
    return res.status(400).json({ message: "boardID is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "Invalid issue status" });
  }
  if (!isIssueStatus(status.toUpperCase())) {
    return res.status(400).json({ message: "Invalid issue status" });
  }

  try {
    const section = await prisma.section.create({
      data: {
        boardId: boardID,
        status: status.toUpperCase(),
      },
      omit: {
        boardId: true,
      },
    });

    return res
      .status(201)
      .json({ message: "Section created successfully", section });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message: "A section with this status already exists on this board",
      });
    }

    logger.error({ error }, "Failed to create section");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllSections = async (
  req: Request<{ boardID: string }>,
  res: Response,
) => {
  const { boardID } = req.params;

  if (!boardID) {
    return res.status(400).json({ message: "boardID is required" });
  }

  const cacheKey = `section:${boardID}`;
  
  const cacheData = await redis.get(cacheKey);
  if (cacheData) {
    const { sections } = JSON.parse(cacheData);
    return res.status(200).json({
      message: "Sections retrieved successfully",
      sections,
    });
  }

  try {
    const sections = await prisma.section.findMany({
      where: {
        boardId: boardID,
      },
      omit: {
        boardId: true,
      },
    });

    await redis.set(
      cacheKey,
      JSON.stringify({ sections, createdAt: new Date().toISOString() }),
    );

    return res
      .status(200)
      .json({ message: "Sections retrieved successfully", sections });
  } catch (error) {
    logger.error({ error }, "Failed to retrieve sections");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createSection, getAllSections };
