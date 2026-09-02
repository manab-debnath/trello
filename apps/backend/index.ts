import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./config/auth";
import { organizationRouter, userRouter } from "./routes";
import { createHttpLogger, createLogger } from "logger";

const app = express();
const port = 8000;

export const logger = createLogger("backend");
const httpLogger = createHttpLogger(logger);

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

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    health: "OK",
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

app.use("/api/user", userRouter);
app.use("/api/organizations", organizationRouter);

app.listen(port, () => {
  console.log(`Trello app listening on port ${port}`);
});
