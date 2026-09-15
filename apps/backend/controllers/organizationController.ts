import { prisma } from "db/client";
import type { Request, Response } from "express";
import { Role } from "../../../packages/db/generated/prisma/enums";
import { logger, redis } from "..";
import { emailQueue } from "queue/email-queue";
import type { EmailHeader } from "types";
import crypto from "node:crypto";

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

const getOrganizationById = async (
  req: Request<{ orgID: string }>,
  res: Response,
) => {
  const { orgID } = req.params;

  if (!orgID) {
    return res.status(400).json({ message: "Organization ID is required" });
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id: orgID,
      },
      select: {
        id: true,
        name: true,
        description: true,
        organization_users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    logger.info("Organization retrieved successfully");
    return res.status(200).json(organization);
  } catch (error) {
    logger.error({ error }, "Error getting organization");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOrganizationById = async (
  req: Request<{ orgID: string }>,
  res: Response,
) => {
  const { orgID } = req.params;

  if (!orgID) {
    return res.status(400).json({ message: "Organization ID is required" });
  }

  try {
    const organization = await prisma.organization.delete({
      where: {
        id: orgID,
      },
    });

    logger.info("Organization deleted successfully");
    return res
      .status(200)
      .json({ message: "Organization deleted successfully", organization });
  } catch (error) {
    logger.error({ error }, "Error deleting organization");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sendInvitation = async (
  req: Request<{ orgID: string }>,
  res: Response,
) => {
  const { orgID } = req.params;
  const { email } = req.body;
  const adminUser = req.user;

  if (!orgID) {
    return res.status(400).json({ message: "Organization ID is required" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    let sendInvitationToUser;
    const token = crypto.randomBytes(32).toString("hex");

    if (!user) {
      sendInvitationToUser = await prisma.pendingMember.create({
        data: {
          email: email,
          organizationID: orgID,
        },
      });

      logger.info("User does not exist, creating pending member");
    } else {
      sendInvitationToUser = await prisma.organizationUser.create({
        data: {
          userID: user.id,
          organizationID: orgID,
        },
      });
      logger.info("User already exists, adding to organization");
    }

    // if redis key is changed, then it needs to be changed in userController as well
    await redis.set(
      `invitation:${token}`,
      JSON.stringify({
        email,
        organizationID: orgID,
        createdAT: new Date().toISOString(),
      }),
      "EX",
      60 * 60 * 24 * 7,
    );

    const organization = await prisma.organization.findUnique({
      where: {
        id: orgID,
      },
    });

    // Send Email Logic
    const emailHeader: EmailHeader = {
      to: email,
      from: process.env.EMAIL_FROM as string,
      subject: "Invitation to join organization",
    };
    const url = process.env.BETTER_AUTH_URL + `/invite?token=${token}`;

    await emailQueue.add("SENDINVITATION", {
      type: "SENDINVITATION",
      emailHeader,
      user: user ?? null,
      organization,
      url,
    });

    // WebSocket Logic

    return res
      .status(201)
      .json({ message: "Invitation sent successfully", sendInvitationToUser });
  } catch (error) {
    logger.error({ error }, "Error sending invitation");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const removeUserFromOrganization = async (
  req: Request<{ orgID: string }>,
  res: Response,
) => {
  const { orgID } = req.params;
  const { userIDs } = req.body; 

  if (!Array.isArray(userIDs) || userIDs.length === 0) {
    return res.status(400).json({ message: "No users to remove" });
  }

  if (userIDs.includes(req.user.id)) {
    return res.status(400).json({ message: "You cannot remove yourself" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const organizationUser = await tx.organizationUser.findMany({
        where: {
          organizationID: orgID,
          userID: {
            in: userIDs,
          },
        },
        select: {
          userID: true,
        },
      });

      if (userIDs.length !== organizationUser.length) {
        throw new Error("Some users were not found");
      }

      return await tx.organizationUser.deleteMany({
        where: {
          organizationID: orgID,
          userID: {
            in: userIDs,
          },
        },
      });
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "No users found to remove" });
    }

    return res
      .status(200)
      .json({ message: "Users removed successfully", count: result.count });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Some users were not found"
    ) {
      return res.status(404).json({ message: error.message });
    }

    logger.error({ error }, "Error removing user from organization");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const leaveOrganization = async (
  req: Request<{ orgID: string }>,
  res: Response,
) => {
  const { orgID } = req.params;

  if (!orgID) {
    return res.status(400).json({
      message: "Organization ID is required",
    });
  }

  try {
    const organizationUser = await prisma.organizationUser.findUnique({
      where: {
        userID_organizationID: {
          userID: req.user.id,
          organizationID: orgID,
        },
      },
    });

    if (!organizationUser) {
      return res.status(404).json({
        message: "User not found in organization",
      });
    }

    if (organizationUser.role === Role.ADMIN) {
      return res.status(403).json({
        message: "Cannot leave organization as admin",
      });
    }

    await prisma.organizationUser.delete({
      where: {
        userID_organizationID: {
          userID: req.user.id as string,
          organizationID: orgID,
        },
      },
    });

    return res.status(200).json({
      message: "User left organization successfully",
    });
  } catch (error) {
    logger.error({ error }, "Error leaving organization");

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  deleteOrganizationById,
  sendInvitation,
  removeUserFromOrganization,
  leaveOrganization,
};
