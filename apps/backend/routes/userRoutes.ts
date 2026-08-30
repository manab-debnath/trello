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

// We will hit this route after reseting password using better auth feature
// and get the token from the frontend url
userRouter.post("/reset-password", resetPassword);

userRouter.use(authMiddleware);

userRouter.get("/profile", (req, res) => {
  const user = req.user;

  res.json(user);
});

userRouter.patch("/update-profile", changeUserInfo);

userRouter.patch("/change-email", changeEmail);

userRouter.patch("/change-password", changePassword);

userRouter.delete("/delete-account", deleteAccount);

userRouter.post("/sign-out", signOut);

// Click Forgot Password -> Send reset link to email -> User clicks link -> Redirect to reset password page
userRouter.post("/forgot-password", forgotPassword);

export default userRouter;
