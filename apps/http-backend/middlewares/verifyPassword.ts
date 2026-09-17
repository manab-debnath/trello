import type { NextFunction, Request, Response } from "express";
import { auth } from "../config/auth";
import { fromNodeHeaders } from "better-auth/node";
import { logger } from "..";

const verifyPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    await auth.api.verifyPassword({
      body: {
        password
      },
      headers: fromNodeHeaders(req.headers)
    })

    next();
  } catch (error) {
    logger.error({
      userId: req.user?.id,
      error,
    }, "Password verification failed");

    return res.status(401).json({
      message: "Invalid password",
    });
  }
};

export default verifyPassword;
