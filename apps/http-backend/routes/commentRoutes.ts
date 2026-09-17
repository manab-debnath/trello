import express from "express";
import { authMiddleware } from "../middlewares";
import { createComment, getAllComments, updateComment } from "../controllers";

const commentRouter = express.Router({ mergeParams: true });

commentRouter.use(authMiddleware);

commentRouter.post("/comments", createComment);
commentRouter.get("/comments", getAllComments);
commentRouter.patch("/comments/:commentID", updateComment);

export default commentRouter;
