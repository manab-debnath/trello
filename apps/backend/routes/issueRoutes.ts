import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import { createNewIssue } from "../controllers";

const issueRouter = express.Router({ mergeParams: true });

issueRouter.use(authMiddleware);

issueRouter.post(
  "/create-issue",
  requireOrganizationRole(Role.ADMIN),
  createNewIssue,
);

export default issueRouter;
