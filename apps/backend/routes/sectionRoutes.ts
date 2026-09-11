import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import { createSection } from "../controllers";

const sectionRoutes = express.Router({ mergeParams: true });

sectionRoutes.use(authMiddleware, requireOrganizationRole(Role.ADMIN));

sectionRoutes.post("/create-section", createSection);

export default sectionRoutes;
