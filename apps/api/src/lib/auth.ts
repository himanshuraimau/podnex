import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/database";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
});
