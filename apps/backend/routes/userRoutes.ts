import express from "express";
import { authMiddleware } from "../middlewares";
import { changeEmail, changePassword, changeUserInfo, deleteAccount } from "../controllers";

const userRouter = express.Router();

userRouter.get("/profile", authMiddleware, (req, res) => {
  const user = req.user;

  res.json(user);
})

userRouter.patch("/update-profile", authMiddleware, changeUserInfo)

userRouter.patch("/change-email", authMiddleware, changeEmail)

userRouter.patch("/change-password", authMiddleware, changePassword)

userRouter.delete("/delete-account", authMiddleware, deleteAccount)

export default userRouter;
