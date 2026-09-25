import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./config/auth";
import {
  boardRouter,
  commentRouter,
  issueRouter,
  organizationRouter,
  sectionRoutes,
  userRouter,
} from "./routes";
import Redis from "ioredis";

const app = express();
export const redis = new Redis(process.env.REDIS_URL as string);

// Configure CORS middleware
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
// app.use(httpLogger)
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Trello App",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    dynamic: true,
  });
});

app.get("/reset-password", (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "No token provided",
    });
  }

  res.status(200).json({
    success: true,
    message: "You password has been reset",
    token: token,
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/organizations/:orgID", boardRouter);
app.use("/api/v1/organizations/:orgID/boards/:boardID", sectionRoutes);
app.use("/api/v1/organizations/:orgID/boards/:boardID", issueRouter);
app.use(
  "/api/organizations/:orgID/boards/:boardID/issues/:issueID",
  commentRouter,
);

export default app;
