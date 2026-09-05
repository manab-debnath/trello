import { prisma } from "db/client";
import type { Request, Response } from "express";
import { Role } from "../../../packages/db/generated/prisma/enums";
import { logger } from "..";
import { emailQueue } from "queue/email-queue";
import type { EmailHeader } from "types";
import crypto from "node:crypto";
import Redis from "ioredis";

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
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Organization ID is required" });
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id: id,
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
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Organization ID is required" });
  }

  try {
    const organization = await prisma.organization.delete({
      where: {
        id: id,
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

const sendInvitation = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  const adminUser = req.user;

  if (!id) {
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
    const redis = new Redis();
    const token = crypto.randomBytes(32).toString("hex");

    if (!user) {
      sendInvitationToUser = await prisma.pendingMember.create({
        data: {
          email: email,
          organizationID: id,
        },
      });

      logger.info("User does not exist, creating pending member");
    } else {
      sendInvitationToUser = await prisma.organizationUser.create({
        data: {
          userID: user.id,
          organizationID: id,
        },
      });
      logger.info("User already exists, adding to organization");
    }

    await redis.set(
      `invitation:${token}`,
      JSON.stringify({
        email,
        organizationID: id,
      }),
      "EX",
      60 * 60 * 24 * 7,
    );

    const organization = await prisma.organization.findUnique({
      where: {
        id: id,
      },
    });

    // Send Email Logic
    const emailHeader: EmailHeader = {
      to: email,
      from: adminUser?.email as string,
      subject: "Invitation to join organization",
    };
    await emailQueue.add("SENDINVITATION", {
      type: "SENDINVITATION",
      emailHeader,
      user,
      organization,
      url: process.env.BETTER_AUTH_URL + `/invite?token=${token}`,
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

export {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  deleteOrganizationById,
  sendInvitation,
};
