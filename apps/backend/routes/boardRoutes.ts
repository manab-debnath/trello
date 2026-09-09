import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import { createBoard, getAllBoards } from "../controllers";

const boardRoutes = express.Router({ mergeParams: true });

boardRoutes.use(authMiddleware);

boardRoutes.get(
  "/boards",
  requireOrganizationRole(Role.MEMBER, Role.ADMIN),
  getAllBoards,
);

// Only admins can create, update, and delete boards
boardRoutes.use(requireOrganizationRole(Role.ADMIN));

boardRoutes.post("/create-board", createBoard);

export default boardRoutes;
