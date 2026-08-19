import "dotenv/config"
import express from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./config/auth";

const app = express();
const port = 8000;

// Configure CORS middleware
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    health: "OK",
  });
});

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});
