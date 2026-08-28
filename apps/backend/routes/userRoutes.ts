import express from "express";
import { authMiddleware } from "../middlewares";
import {
  changeEmail,
  changePassword,
  changeUserInfo,
  deleteAccount,
  forgotPassword,
  resetPassword,
  signOut,
} from "../controllers";

const userRouter = express.Router();

userRouter.get("/profile", authMiddleware, (req, res) => {
  const user = req.user;

  res.json(user);
});

userRouter.patch("/update-profile", authMiddleware, changeUserInfo);

userRouter.patch("/change-email", authMiddleware, changeEmail);

userRouter.patch("/change-password", authMiddleware, changePassword);

userRouter.delete("/delete-account", authMiddleware, deleteAccount);

userRouter.post("/sign-out", authMiddleware, signOut);

// Click Forgot Password -> Send reset link to email -> User clicks link -> Redirect to reset password page
userRouter.post("/forgot-password", authMiddleware, forgotPassword);

// We will hit this route after reseting password using better auth feature
// and get the token from the frontend url
userRouter.post("/reset-password", resetPassword);

export default userRouter;
