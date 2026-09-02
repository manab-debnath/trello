import "dotenv/config";
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "db/client";
import { logger } from "..";
import type { EmailHeader } from "types";
import { emailQueue } from "queue/email-queue";

const emailFrom = process.env.EMAIL_FROM || "manab_debnath@nextstudio.tech";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendOnSignUp: true,
    autoSignIn: false,

    sendResetPassword: async ({ user, url, token }) => {
      const emailHeader: EmailHeader = {
        to: user.email,
        from: emailFrom,
        subject: "Reset your Trello password",
      };
      await emailQueue.add("RESETPASSWORD", { emailHeader, user, url });
    },

    onPasswordReset: async ({ user }) => {
      logger.info(`Password reset successfully for user ${user.id}`);
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const emailHeader: EmailHeader = {
        to: user.email,
        from: emailFrom,
        subject: "Verify your Trello email",
      };
      await emailQueue.add("EMAILVERIFICATION", { emailHeader, user, url });
    },

    afterEmailVerification: async (user) => {
      logger.info(`Email verified for ${user.email}`);
    },
  },
  baseURL: "http://localhost:8000",
});
