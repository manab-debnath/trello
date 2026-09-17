import express from "express";
import { authMiddleware } from "../middlewares";
import { createComment, getAllComments } from "../controllers";

const commentRouter = express.Router({ mergeParams: true });

commentRouter.use(authMiddleware);

commentRouter.post("/comments", createComment);
commentRouter.get("/comments", getAllComments);

export default commentRouter;
