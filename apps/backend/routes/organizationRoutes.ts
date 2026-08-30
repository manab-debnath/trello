import express from "express";
import {
  createOrganization,
  deleteOrganizationById,
  getAllOrganizations,
  getOrganizationById,
} from "../controllers";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";

const organizationRouter = express.Router();

organizationRouter.use(authMiddleware);

organizationRouter.post("/create-organization", createOrganization);

organizationRouter.get("/all", getAllOrganizations);

organizationRouter.get(
  "/organization/:id",
  requireOrganizationRole(Role.ADMIN, Role.MEMBER),
  getOrganizationById,
);

organizationRouter.delete(
  "/organization/:id",
  requireOrganizationRole(Role.ADMIN),
  deleteOrganizationById,
);

export default organizationRouter;
