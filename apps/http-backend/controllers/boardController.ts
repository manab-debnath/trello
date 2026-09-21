import { prisma } from "db/client";
import type { Request, Response } from "express";
import { logger } from "../app";

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

const getBoard = async (req: Request, res: Response) => {
  const { boardID } = req.params;

  try {
    const board = await prisma.board.findUnique({
      where: {
        id: boardID as string,
      },
      select: {
        id: true,
        title: true,
        issues: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!board) return res.status(404).json({ message: "Board not found" });

    return res
      .status(200)
      .json({ message: "Board retrieved successfully", board });
  } catch (error) {
    logger.error({ error }, "Error retrieving board");
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
      omit: {
        organizationID: true,
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

const deleteBoard = async (req: Request, res: Response) => {
  const { boardID } = req.params;

  try {
    const board = await prisma.board.findUnique({
      where: {
        id: boardID as string,
      },
      select: {
        issues: true,
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.issues && board.issues.length > 0) {
      return res.status(400).json({ message: "Board has issues" });
    } else {
      await prisma.board.delete({
        where: {
          id: boardID as string,
        },
      });
    }

    return res
      .status(200)
      .json({ message: "Board deleted successfully", board });
  } catch (error) {
    logger.error({ error }, "Error deleting board");

    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllBoards, createBoard, updateBoard, getBoard, deleteBoard };
