import express from "express";
import {
	createOrganization,
	deleteOrganizationById,
	getAllOrganizations,
	getOrganizationById,
	sendInvitation,
} from "../controllers";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";

const organizationRouter = express.Router();

organizationRouter.use(authMiddleware);

organizationRouter.post("/create-organization", createOrganization);

organizationRouter.get("/all", getAllOrganizations);

organizationRouter.get(
	"/organization/:orgID",
	requireOrganizationRole(Role.ADMIN, Role.MEMBER),
	getOrganizationById,
);

organizationRouter.delete(
	"/organization/:orgID",
	requireOrganizationRole(Role.ADMIN),
	deleteOrganizationById,
);

organizationRouter.post(
	"/invite/:orgID",
	requireOrganizationRole(Role.ADMIN),
	sendInvitation,
);

export default organizationRouter;
