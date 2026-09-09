import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import { getAllBoards } from "../controllers";

const boardRoutes = express.Router();

boardRoutes.use(authMiddleware);

boardRoutes.get(
  "/boards",
  requireOrganizationRole(Role.MEMBER, Role.ADMIN),
  getAllBoards,
);

boardRoutes.use(requireOrganizationRole(Role.ADMIN));

export default boardRoutes;
