import { prisma } from "db/client";
import type { Request, Response } from "express";
import { logger } from "..";

const getAllBoards = async (req: Request, res: Response) => {
  const { orgID } = req.params;

  try {
    const boards = await prisma.board.findMany({
      where: {
        organizationID: orgID as string,
      },
      omit: {
        organizationID: true,
      },
    });
    return res
      .status(200)
      .json({ message: "Boards retrieved successfully", boards });
  } catch (error) {
    logger.error({ error }, "Error retrieving boards");
    res.status(500).json({ message: "Internal server error" });
  }
};

const createBoard = async (req: Request, res: Response) => {
  const { orgID } = req.params;
  const { title } = req.body;

  try {
    const board = await prisma.board.create({
      data: {
        title,
        organizationID: orgID as string,
      },
    });
    return res
      .status(201)
      .json({ message: "Board created successfully", board });
  } catch (error) {
    logger.error({ error }, "Error creating board");
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBoard = async (req: Request, res: Response) => {
  const { boardID } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const board = await prisma.board.update({
      where: {
        id: boardID as string,
      },
      data: {
        title,
      },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    return res
      .status(200)
      .json({ message: "Board updated successfully", board });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    logger.error({ error }, "Error updating board");

    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllBoards, createBoard, updateBoard };
