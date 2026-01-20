import { checkoutHandler, CustomerPortal, Webhooks } from '@dodopayments/express';
import DodoPayments from 'dodopayments';
import { prisma } from '@repo/database';
import type { SubscriptionPlan } from '@repo/database';

// Lazy-load Dodo Payments client to ensure env vars are loaded
let _dodoClient: DodoPayments | null = null;
function getDodoClient() {
    if (!_dodoClient && process.env.DODO_PAYMENTS_API_KEY) {
        const apiKey = process.env.DODO_PAYMENTS_API_KEY;
        const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode';

        console.log('🔑 Initializing Dodo client with:');
        console.log('   API Key (first 20 chars):', apiKey.substring(0, 20) + '...');
        console.log('   Environment:', environment);

        _dodoClient = new DodoPayments({
            bearerToken: apiKey,
            environment: environment,
        });
    }
    return _dodoClient;
}

// Plan to Dodo Product ID mapping - function to load env vars at runtime
function getPlanProductId(plan: SubscriptionPlan): string {
    const mapping: Record<SubscriptionPlan, string> = {
        FREE: '',
        STARTER: process.env.DODO_PRODUCT_STARTER || '',
        PRO: process.env.DODO_PRODUCT_PRO || '',
        BUSINESS: process.env.DODO_PRODUCT_BUSINESS || '',
    };
    console.log(`🔍 Getting product ID for ${plan}:`, mapping[plan], 'from env:', process.env.DODO_PRODUCT_STARTER);
    return mapping[plan];
}

export class DodoPaymentsService {
    /**
     * Create a checkout session for plan upgrade
     */
    static async createCheckoutSession(
        userId: string,
        plan: SubscriptionPlan,
        billingCycle: 'monthly' | 'yearly' = 'monthly'
    ) {
        const dodoClient = getDodoClient();
        if (!dodoClient) {
            throw new Error('Dodo Payments is not configured. Please add DODO_PAYMENTS_API_KEY to your .env file.');
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const productId = getPlanProductId(plan);
        if (!productId) {
            throw new Error(`No product configured for plan: ${plan}`);
        }

        // Create checkout session using Dodo SDK
        const session = await dodoClient.checkoutSessions.create({
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1,
                },
            ],
            customer: {
                email: user.email,
                name: user.name || user.email,
            },
            return_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing/success`,
            metadata: {
                user_id: userId,
                plan: plan,
                billing_cycle: billingCycle,
            },
        });

        return {
            sessionId: session.session_id,
            checkoutUrl: session.checkout_url,
        };
    }

    /**
     * Create customer portal session
     */
    static async createPortalSession(userId: string) {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription?.dodoCustomerId) {
            throw new Error('No Dodo customer ID found');
        }

        // Customer portal is handled by the Express adapter
        // This method is for additional logic if needed
        return {
            customerId: subscription.dodoCustomerId,
        };
    }

    /**
     * Handle subscription activated webhook
     */
    static async handleSubscriptionActive(payload: any) {
        const { customer_id, subscription_id, metadata, current_period_end } = payload.data || payload;
        const userId = metadata?.user_id;
        const plan = metadata?.plan as SubscriptionPlan;

        if (!userId || !plan) {
            console.error('Missing user_id or plan in webhook metadata');
            return;
        }

        // Update subscription in database
        await prisma.subscription.update({
            where: { userId },
            data: {
                plan,
                dodoCustomerId: customer_id,
                dodoSubscriptionId: subscription_id,
                status: 'ACTIVE',
                currentPeriodEnd: current_period_end ? new Date(current_period_end) : undefined,
                cancelAtPeriodEnd: false,
            },
        });

        console.log(`✅ Subscription activated for user ${userId}: ${plan}`);
    }

    /**
     * Handle subscription renewed webhook
     */
    static async handleSubscriptionRenewed(payload: any) {
        const { subscription_id, current_period_end } = payload.data || payload;

        await prisma.subscription.updateMany({
            where: { dodoSubscriptionId: subscription_id },
            data: {
                currentPeriodEnd: current_period_end ? new Date(current_period_end) : undefined,
                currentPodcastCount: 0, // Reset usage on renewal
                currentMinutesUsed: 0,
            },
        });

        console.log(`✅ Subscription renewed: ${subscription_id}`);
    }

    /**
     * Handle subscription cancelled webhook
     */
    static async handleSubscriptionCancelled(payload: any) {
        const { subscription_id } = payload.data || payload;

        await prisma.subscription.updateMany({
            where: { dodoSubscriptionId: subscription_id },
            data: {
                status: 'CANCELED', // Fixed: use CANCELED not CANCELLED
                cancelAtPeriodEnd: true,
            },
        });

        console.log(`⚠️ Subscription cancelled: ${subscription_id}`);
    }

    /**
     * Handle subscription failed webhook
     */
    static async handleSubscriptionFailed(payload: any) {
        const { subscription_id } = payload.data || payload;

        await prisma.subscription.updateMany({
            where: { dodoSubscriptionId: subscription_id },
            data: {
                status: 'PAST_DUE',
            },
        });

        console.log(`❌ Subscription payment failed: ${subscription_id}`);
    }

    /**
     * Handle payment succeeded webhook
     */
    static async handlePaymentSucceeded(payload: any) {
        const { customer_id, amount, currency } = payload.data || payload;

        console.log(`✅ Payment succeeded: ${customer_id} - ${amount} ${currency}`);

        // You can track payment history here if needed
    }

    /**
     * Get customer by user ID
     */
    static async getCustomer(userId: string) {
        const dodoClient = getDodoClient();
        if (!dodoClient) {
            return null;
        }

        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription?.dodoCustomerId) {
            return null;
        }

        try {
            const customer = await dodoClient.customers.retrieve(subscription.dodoCustomerId);
            return customer;
        } catch (error) {
            console.error('Error fetching customer:', error);
            return null;
        }
    }

    /**
     * Cancel subscription
     */
    static async cancelSubscription(userId: string) {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription?.dodoSubscriptionId) {
            throw new Error('No active subscription found');
        }

        // Note: Dodo SDK doesn't have a direct cancel method
        // Mark as cancelled locally, actual cancellation happens via customer portal
        await prisma.subscription.update({
            where: { userId },
            data: {
                cancelAtPeriodEnd: true,
            },
        });

        return { success: true };
    }
}
