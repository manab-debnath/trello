import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import { createNewIssue, deleteIssue } from "../controllers";

const issueRouter = express.Router({ mergeParams: true });

issueRouter.use(authMiddleware);

issueRouter.post(
  "/create-issue",
  requireOrganizationRole(Role.ADMIN),
  createNewIssue,
);

issueRouter.delete(
  "/delete-issue/:issueID",
  requireOrganizationRole(Role.ADMIN),
  deleteIssue,
);

export default issueRouter;
