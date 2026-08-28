import "dotenv/config";
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "db/client";
import { sendResendEmail } from "./resend";
import { logger } from "..";

const emailFrom = process.env.EMAIL_FROM || "manab_debnath@nextstudio.tech";

export interface EmailHeader {
  to: string;
  from: string;
  subject: string;
  buttonText: string;
  receiverName: string;
}

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
        buttonText: "Reset Password",
        receiverName: user.name,
      };
      await sendResendEmail(emailHeader, url, "RESETPASSWORD");
      console.log({ token });
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
        buttonText: "Verify Email Address",
        receiverName: user.name,
      };
      await sendResendEmail(emailHeader, url, "EMAILVERIFICATION");
    },

    afterEmailVerification: async (user) => {
      logger.info(`Email verified for ${user.email}`);
    },
  },
  baseURL: "http://localhost:8000",
});
