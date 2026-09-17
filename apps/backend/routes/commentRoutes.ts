import express from "express";
import { authMiddleware } from "../middlewares";
import { createComment } from "../controllers";

const commentRouter = express.Router({ mergeParams: true });

commentRouter.use(authMiddleware);

commentRouter.post("/comments", createComment);

export default commentRouter;
