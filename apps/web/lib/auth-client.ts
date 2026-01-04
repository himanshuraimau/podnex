import { createAuthClient } from "better-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
});

// Export auth methods
export const { signIn, signUp, signOut, useSession } = authClient;

// Helper to get session data
export async function getSession() {
  try {
    const session = await authClient.getSession();
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}
