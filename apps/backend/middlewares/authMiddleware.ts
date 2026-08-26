import type { NextFunction, Request, Response } from "express";
import { auth } from "../config/auth";
import { fromNodeHeaders } from "better-auth/node";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    })

    if(!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = session.user;
    req.session = session;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default requireAuth;
