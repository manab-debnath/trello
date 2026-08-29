import express from "express";
import { createOrganization, getAllOrganizations } from "../controllers";
import { authMiddleware } from "../middlewares";

const organizationRouter = express.Router();

organizationRouter.post(
  "/create-organization",
  authMiddleware,
  createOrganization,
);

organizationRouter.get("/all", authMiddleware, getAllOrganizations)

export default organizationRouter;
