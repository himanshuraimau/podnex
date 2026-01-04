import { api } from "./client";
import type { ApiResponse } from "../types";

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<ApiResponse> {
  return api.get("/api/health");
}

/**
 * Get current user session
 */
export async function getCurrentSession() {
  return api.get("/api/auth/session");
}

// Add more API methods as needed
export const healthApi = {
  check: checkHealth,
};
