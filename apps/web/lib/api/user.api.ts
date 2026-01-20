import { api } from "./client";
import type {
    User,
    Subscription,
    UsageData,
    UpdateProfileDto,
    ApiResponse,
} from "../types";

export const userApi = {
    /**
     * Get user profile
     */
    getProfile: async () => {
        const response = await api.get<ApiResponse<User>>("/api/v1/user/profile");
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: UpdateProfileDto) => {
        const response = await api.patch<ApiResponse<User>>(
            "/api/v1/user/profile",
            data
        );
        return response.data;
    },

    /**
     * Get subscription details
     */
    getSubscription: async () => {
        const response = await api.get<ApiResponse<Subscription>>(
            "/api/v1/user/subscription"
        );
        return response.data;
    },

    /**
     * Get usage statistics
     */
    getUsage: async () => {
        const response = await api.get<ApiResponse<UsageData>>("/api/v1/user/usage");
        return response.data;
    },

    /**
     * Delete user account
     */
    deleteAccount: async () => {
        await api.delete("/api/v1/user/account");
    },
};
