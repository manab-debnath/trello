import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import { createNewIssue, deleteIssue, getIssues } from "../controllers";

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

issueRouter.use(requireOrganizationRole(Role.ADMIN, Role.MEMBER));

issueRouter.get("/get-issues", getIssues);

export default issueRouter;
