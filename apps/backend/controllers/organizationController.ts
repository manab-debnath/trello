import { prisma } from "db/client";
import type { Request, Response } from "express";
import { Role } from "../../../packages/db/generated/prisma/enums";
import { logger } from "..";

const createOrganization = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name,
          description,
        },
      });
      const organizationUser = await tx.organizationUser.create({
        data: {
          role: Role.ADMIN,
          accepted: true,
          userID: user.id,
          organizationID: organization.id,
        },
      });

      return { organization, organizationUser };
    });

    logger.info("Organization created successfully");
    return res.status(201).json(result);
  } catch (error) {
    logger.error({ error }, "Error creating organization");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllOrganizations = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const organizations = await prisma.organizationUser.findMany({
      where: {
        userID: user.id,
      },
      select: {
        id: true,
        role: true,
        accepted: true,
        organization: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    logger.info("Organizations retrieved successfully");
    return res.status(200).json(organizations);
  } catch (error) {
    logger.error({ error }, "Error getting organizations");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createOrganization, getAllOrganizations };
