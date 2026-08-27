import "dotenv/config"
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {prisma} from "db/client"
import { sendEmailVerification } from "./resend";
import { logger } from "..";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendOnSignUp: true,
    autoSignIn: false
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerification(user, url)
    },

    afterEmailVerification: async (user) => {
      logger.info(`Email verified for ${user.email}`);
      },
  },
  baseURL: "http://localhost:8000",
});
