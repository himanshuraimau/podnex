import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import type { UpdateProfileDto } from "../types";
import { toast } from "sonner";

// Query keys
export const userKeys = {
    all: ["user"] as const,
    profile: () => [...userKeys.all, "profile"] as const,
    subscription: () => [...userKeys.all, "subscription"] as const,
    usage: () => [...userKeys.all, "usage"] as const,
};

/**
 * Hook to fetch user profile
 */
export function useProfile() {
    return useQuery({
        queryKey: userKeys.profile(),
        queryFn: () => userApi.getProfile(),
    });
}

/**
 * Hook to fetch subscription details
 */
export function useSubscription() {
    return useQuery({
        queryKey: userKeys.subscription(),
        queryFn: () => userApi.getSubscription(),
    });
}

/**
 * Hook to fetch usage statistics
 */
export function useUsage() {
    return useQuery({
        queryKey: userKeys.usage(),
        queryFn: () => userApi.getUsage(),
    });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileDto) => userApi.updateProfile(data),
        onSuccess: (updatedUser) => {
            // Update the profile in the cache
            queryClient.setQueryData(userKeys.profile(), updatedUser);
            toast.success("Profile updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update profile");
        },
    });
}

/**
 * Hook to delete user account
 */
export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => userApi.deleteAccount(),
        onSuccess: () => {
            // Clear all cached data
            queryClient.clear();
            toast.success("Account deleted successfully");
            // Redirect to home page will be handled by the component
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete account");
        },
    });
}
