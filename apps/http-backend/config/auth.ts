import "dotenv/config";
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "db/client";
import { logger } from "../logger";
import type { EmailHeader } from "types";
import { emailQueue } from "queue/email-queue";
import { APIError } from "better-auth/api";
import { createAuthMiddleware } from "better-auth/api";

const emailFrom = process.env.EMAIL_FROM || "manab_debnath@nextstudio.tech";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = ctx.body?.email;

        if (email) {
          // 2. Query your database directly via your Prisma Client to check for existence
          const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          // 3. Force stop the process and reply with a true 409 Conflict error
          if (existingUser) {
            // Task: Send an email to the owner of this account to notify them of the duplicate registration
            throw new APIError("CONFLICT", {
              code: "USER_ALREADY_EXISTS",
            });
          }
        }
      }
    }),
  },
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
        from: process.env.EMAIL_FROM as string,
        subject: "Verify your Trello email",
      };
      await emailQueue.add("EMAILVERIFICATION", {
        type: "EMAILVERIFICATION",
        emailHeader,
        user,
        url,
      });
    },

    afterEmailVerification: async (user) => {
      logger.info(`Email verified for ${user.email}`);
    },
  },
  baseURL: "http://localhost:8000",
});
