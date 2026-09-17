import express from "express";
import { authMiddleware } from "../middlewares";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers";

const commentRouter = express.Router({ mergeParams: true });

commentRouter.use(authMiddleware);

commentRouter.post("/comments", createComment);
commentRouter.get("/comments", getAllComments);
commentRouter.patch("/comments/:commentID", updateComment);
commentRouter.delete("/comments/:commentID", deleteComment);

export default commentRouter;
