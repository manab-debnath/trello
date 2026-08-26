import express from "express";
import { authMiddleware } from "../middlewares";

const userRouter = express.Router();

  
userRouter.get("/profile", authMiddleware, (req, res) => {
  const user = req.user;

  res.json(user);
})


export default userRouter;
