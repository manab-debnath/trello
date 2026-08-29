import express from "express";
import { createOrganization } from "../controllers";
import { authMiddleware } from "../middlewares";

const organizationRouter = express.Router();

organizationRouter.post(
  "/create-organization",
  authMiddleware,
  createOrganization,
);

export default organizationRouter;
