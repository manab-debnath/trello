import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import {
  assignIssueToUser,
  createNewIssue,
  deleteIssue,
  getIssue,
  getIssues,
  removeUserFromAssignedIssue,
  updateIssue,
} from "../controllers";

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

issueRouter.patch(
  "/update-issue/:issueID",
  requireOrganizationRole(Role.ADMIN),
  updateIssue,
);

issueRouter.post(
  "/issues/:issueID/assignees",
  requireOrganizationRole(Role.ADMIN),
  assignIssueToUser,
);

issueRouter.delete(
  "/issues/:issueID/assignees",
  requireOrganizationRole(Role.ADMIN),
  removeUserFromAssignedIssue,
);

issueRouter.use(requireOrganizationRole(Role.ADMIN, Role.MEMBER));

issueRouter.get("/get-issues", getIssues);

issueRouter.get("/issue/:issueID", getIssue);

export default issueRouter;
