import type { Request, Response } from "express";
import { auth } from "../config/auth";
import { fromNodeHeaders } from "better-auth/node";
import { logger } from "..";
import { prisma } from "db/client";

const changeUserInfo = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = req.user;

  if(!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if(!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  if(name === user.name) {
    return res.status(400).json({ message: "Name is the same as the current name" });
  }

  try {
    const updateUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        name
      }
    })

    logger.info(`Updated user ${user.id}`)
    res.json(updateUser);
  } catch (error) {
    if(error instanceof Error) {
      logger.error({error}, `Error updating user ${user.id}`);
    } else {
      logger.error(`Error updating user ${user.id}`);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};



export {
  changeUserInfo,
};
