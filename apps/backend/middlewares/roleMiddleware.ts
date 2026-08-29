import type { NextFunction, Request, Response } from "express";
import type { Role } from "db/types";
import { prisma } from "db/client";
import { logger } from "..";

const requireOrganizationRole = (...roles: Role[]) => {
  return async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const userID = req.user?.id;
    const organizationID = req.params.id;

    if (!organizationID) {
      return res.status(400).json({
        message: "Organization ID is required",
      });
    }

    try {
      const organizationUser = await prisma.organizationUser.findUnique({
        where: {
          userID_organizationID: {
            userID,
            organizationID,
          },
        },
      });

      if (!organizationUser) {
        logger.info("User is not a member of this organization");
        return res
          .status(403)
          .json({ message: "User is not a member of this organization" });
      }

      if (!organizationUser.accepted) {
        logger.info("User has not accepted the organization invitation");
        return res.status(403).json({
          message: "User has not accepted the organization invitation",
        });
      }

      if (!roles.includes(organizationUser.role)) {
        logger.info("User does not have the required role");
        return res
          .status(403)
          .json({ message: "User does not have the required role" });
      }

      next();
    } catch (error) {
      logger.error({ error }, "Unexpected error occurred");
      return res.status(500).json({ message: "Unexpected error occurred" });
    }
  };
};

export default requireOrganizationRole;
