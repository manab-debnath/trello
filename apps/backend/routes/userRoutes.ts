import express from "express";
import { authMiddleware } from "../middlewares";
import { changeEmail, changePassword, changeUserInfo, deleteAccount } from "../controllers";

const userRouter = express.Router();

userRouter.get("/profile", authMiddleware, (req, res) => {
  const user = req.user;

  res.json(user);
})

userRouter.patch("/update-profile", authMiddleware, changeUserInfo)

export default userRouter;
