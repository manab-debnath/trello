import express from "express";
import { authMiddleware, requireOrganizationRole } from "../middlewares";
import { Role } from "db/types";
import {
  createBoard,
  deleteBoard,
  getAllBoards,
  getBoard,
  updateBoard,
} from "../controllers";

const boardRoutes = express.Router({ mergeParams: true });

boardRoutes.use(authMiddleware);

boardRoutes.get(
  "/boards",
  requireOrganizationRole(Role.MEMBER, Role.ADMIN),
  getAllBoards,
);

boardRoutes.get(
  "/boards/:boardID",
  requireOrganizationRole(Role.MEMBER, Role.ADMIN),
  getBoard,
);

// Only admins can create, update, and delete boards
boardRoutes.use(requireOrganizationRole(Role.ADMIN));

boardRoutes.post("/create-board", createBoard);

boardRoutes.patch("/boards/update-board/:boardID", updateBoard);

boardRoutes.delete("/boards/delete-board/:boardID", deleteBoard);

export default boardRoutes;
