import express from "express";
import {
	createOrganization,
	deleteOrganizationById,
	getAllOrganizations,
	getOrganizationById,
  updateOrganizationById,
	leaveOrganization,
	removeUserFromOrganization,
	sendInvitation,
} from "../controllers";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";

const organizationRouter = express.Router();

organizationRouter.use(authMiddleware);

organizationRouter.post("/", createOrganization);

organizationRouter.get("/", getAllOrganizations);

organizationRouter.get(
	"/:orgID",
	requireOrganizationRole(Role.ADMIN, Role.MEMBER),
	getOrganizationById,
);

organizationRouter.patch(
	"/:orgID",
	requireOrganizationRole(Role.ADMIN),
	updateOrganizationById,
);

organizationRouter.delete(
	"/:orgID",
	requireOrganizationRole(Role.ADMIN),
	deleteOrganizationById,
);

organizationRouter.post(
	"/:orgID/invite",
	requireOrganizationRole(Role.ADMIN),
	sendInvitation,
);

organizationRouter.delete(
	"/:orgID/members",
	requireOrganizationRole(Role.ADMIN),
	removeUserFromOrganization,
);

organizationRouter.delete(
	"/:orgID/members/:userID",
	requireOrganizationRole(Role.ADMIN, Role.MEMBER),
	leaveOrganization,
);

export default organizationRouter;
