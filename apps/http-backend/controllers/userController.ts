import type { Request, Response } from "express";
import { auth } from "../config/auth";
import { fromNodeHeaders } from "better-auth/node";
import { logger, redis } from "../app";
import { prisma } from "db/client";

const changeUserInfo = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (name === user.name) {
    return res
      .status(400)
      .json({ message: "Name is the same as the current name" });
  }

  try {
    const updateUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
      },
    });

    logger.info(`Updated user ${user.id}`);
    res.json(updateUser);
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error }, `Error updating user ${user.id}`);
    } else {
      logger.error(`Error updating user ${user.id}`);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const changeEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    await auth.api.changeEmail({
      body: {
        newEmail: email,
      },
      headers: fromNodeHeaders(req.headers),
    });

    logger.info(`Change email for user ${req.user.id}`);
    return res.json({ message: "Verification link sent" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error }, "Error changing email");
    } else {
      logger.error("Unknown error while changing email");
    }

    return res.status(500).json({
      message: "Failed to update email",
    });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  const userId = req.user.id;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    logger.info(`Deleted account for user ${userId}`);
    return res.json({ message: "Account deleted" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error }, `Error deleting account for user ${userId}`);
    } else {
      logger.error(`Error deleting account for user ${userId}`);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { newPassword, currentPassword } = req.body;

  if (!newPassword || !currentPassword) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
      headers: fromNodeHeaders(req.headers),
    });

    logger.info(`Changed password for user ${req.user.id}`);
    return res.json({ message: "Password changed, user logged out" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        { error },
        `Error while changing password for user ${req.user.id}`,
      );
    } else {
      logger.error(`Error while changing password for user ${req.user.id}`);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
    await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
    });
    logger.info(`Signed out user ${req.user.id}`);
    return res.json({ message: "Signed out successfully" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error }, `Error while signing out user ${req.user.id}`);
    } else {
      logger.error(`Error while signing out user ${req.user.id}`);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const email = req.user.email;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "http://localhost:8000/reset-password", // call /reset-password api
      },
    });

    logger.info(`Password reset link sent to ${email}`);
    return res.json({
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    logger.error({ error }, "Error requesting password reset");

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    await auth.api.resetPassword({
      body: {
        token,
        newPassword,
      },
    });

    logger.info(`Password reset successfully`);
    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error }, `Error while resetting password`);
    } else {
      logger.error(`Error while resetting password`);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const acceptInvitation = async (req: Request, res: Response) => {
  const { token } = req.params;
  const user = req.user;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Get invitation from Redis
    const data = await redis.get(`invitation:${token}`);
    if (!data) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const invitationData = JSON.parse(data as string);

    // Verify invitation belongs to authenticated user
    if (user.email !== invitationData.email) {
      return res.status(403).json({ message: "User does not match" });
    }

    // Check whether user is already a member
    const existingOrganizationUser = await prisma.organizationUser.findUnique({
      where: {
        userID_organizationID: {
          userID: user.id as string,
          organizationID: invitationData.organizationID,
        },
      },
    });

    if (existingOrganizationUser) {
      await prisma.organizationUser.update({
        where: {
          userID_organizationID: {
            userID: user.id as string,
            organizationID: invitationData.organizationID,
          },
        },
        data: {
          accepted: true,
        },
      });
    }
    // User isn't a member yet
    else {
      await prisma.$transaction(async (tx) => {
        const pendingMember = await tx.pendingMember.findUnique({
          where: {
            email: user.email,
            organizationID: invitationData.organizationID,
          },
        });

        if (!pendingMember) {
          throw new Error("Invalid Invitation");
        }

        await tx.organizationUser.create({
          data: {
            userID: user.id as string,
            organizationID: invitationData.organizationID,
            accepted: true,
          },
        });

        await tx.pendingMember.delete({
          where: {
            email: user.email,
            organizationID: invitationData.organizationID,
          },
        });

        return true;
      });
    }

    // Remove invitation token only after DB transaction succeeds
    await redis.del(`invitation:${token}`);

    return res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid invitation") {
      return res.status(404).json({
        message: error.message,
      });
    }

    logger.error({ error }, "Error accepting invitation");

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const rejectInvitation = async (req: Request, res: Response) => {
  const { token } = req.params;
  const user = req.user;

  if (!token) {
    return res.status(400).json({
      message: "Token is required",
    });
  }

  try {
    // Get invitation from Redis
    const data = await redis.get(`invitation:${token}`);
    if (!data) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const invitationData = JSON.parse(data as string);

    // Verify invitation belongs to authenticated user
    if (user.email !== invitationData.email) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check whether user is already a member
    const existingOrganizationUser = await prisma.organizationUser.findUnique({
      where: {
        userID_organizationID: {
          userID: user.id as string,
          organizationID: invitationData.organizationID,
        },
      },
    });

    // User already had an organization user entry
    if (existingOrganizationUser) {
      await prisma.organizationUser.delete({
        where: {
          userID_organizationID: {
            userID: user.id as string,
            organizationID: invitationData.organizationID,
          },
        },
      });
    } else {
      // User wasn't a member
      await prisma.pendingMember.delete({
        where: {
          email: user.email,
          organizationID: invitationData.organizationID,
        },
      });
    }

    // Remove invitation token
    await redis.del(`invitation:${token}`);

    return res.status(200).json({
      message: "Invitation rejected successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        message: error.message,
      });
    }

    logger.error({ error }, "Error rejecting invitation");

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  changeUserInfo,
  changeEmail,
  deleteAccount,
  changePassword,
  signOut,
  forgotPassword,
  resetPassword,
  acceptInvitation,
  rejectInvitation,
};
