import "dotenv/config"
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {prisma} from "db/client"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
      enabled: true,
  },
  baseURL: "http://localhost:8000",
});
