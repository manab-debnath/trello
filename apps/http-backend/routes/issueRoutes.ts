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
  "/issues",
  requireOrganizationRole(Role.ADMIN),
  createNewIssue,
);

issueRouter.delete(
  "/issues/:issueID",
  requireOrganizationRole(Role.ADMIN),
  deleteIssue,
);

issueRouter.patch(
  "/issues/:issueID",
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

issueRouter.get("/issues", getIssues);

issueRouter.get("/issues/:issueID", getIssue);

export default issueRouter;
