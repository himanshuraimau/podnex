export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  expiresAt: string;
  token: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
  message?: string;
}

export interface UpdateProfileDto {
  name?: string;
  image?: string;
}

export type SubscriptionPlan = 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'PAUSED';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  podcastsLimit: number;
  minutesLimit: number;
  currentPodcasts: number;
  currentMinutes: number;
  periodStart: string;
  periodEnd: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageData {
  totalPodcasts: number;
  totalMinutes: number;
  thisMonthPodcasts: number;
  thisMonthMinutes: number;
  subscription: Subscription;
}
