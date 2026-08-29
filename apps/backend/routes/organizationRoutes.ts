import express from "express";
import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
} from "../controllers";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";

const organizationRouter = express.Router();

organizationRouter.post(
  "/create-organization",
  authMiddleware,
  createOrganization,
);

organizationRouter.get("/all", authMiddleware, getAllOrganizations);

organizationRouter.get(
  "/organization/:id",
  authMiddleware,
  requireOrganizationRole(Role.ADMIN, Role.MEMBER),
  getOrganizationById,
);

export default organizationRouter;
