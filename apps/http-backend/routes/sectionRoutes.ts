import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import { createSection, getAllSections } from "../controllers";

const sectionRoutes = express.Router({ mergeParams: true });

sectionRoutes.use(authMiddleware, requireOrganizationRole(Role.ADMIN));

sectionRoutes.post("/sections", createSection);

sectionRoutes.get("/sections", getAllSections);

export default sectionRoutes;
