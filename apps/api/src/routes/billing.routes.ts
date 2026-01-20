import { Router } from 'express';
import { checkoutHandler, CustomerPortal, Webhooks } from '@dodopayments/express';
import { requireAuth, type AuthRequest } from '../middleware/auth.middleware.js';
import { DodoPaymentsService } from '../services/dodo-payments.service.js';
import { AppError } from '../middleware/error.middleware.js';

const router = Router();

// Only register Dodo routes if API key is configured
if (process.env.DODO_PAYMENTS_API_KEY) {
    // Checkout handler - Create checkout session
    router.post(
        '/checkout',
        requireAuth,
        checkoutHandler({
            bearerToken: process.env.DODO_PAYMENTS_API_KEY,
            returnUrl: process.env.DODO_PAYMENTS_RETURN_URL || `${process.env.FRONTEND_URL}/dashboard/settings/billing/success`,
            environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode',
            type: 'session', // Using checkout sessions for better control
        })
    );

    // Customer Portal handler - Manage subscription
    router.get(
        '/portal',
        requireAuth,
        CustomerPortal({
            bearerToken: process.env.DODO_PAYMENTS_API_KEY,
            environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode',
        })
    );
}

// Debug: Check webhook key
console.log('🔍 Checking webhook key at module load:');
console.log('   DODO_PAYMENTS_WEBHOOK_KEY exists:', !!process.env.DODO_PAYMENTS_WEBHOOK_KEY);
console.log('   DODO_PAYMENTS_WEBHOOK_KEY length:', process.env.DODO_PAYMENTS_WEBHOOK_KEY?.length || 0);
console.log('   DODO_PAYMENTS_WEBHOOK_KEY (first 10 chars):', process.env.DODO_PAYMENTS_WEBHOOK_KEY?.substring(0, 10) || 'NOT SET');

// Only register webhook if webhook key is configured
if (process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
    router.post(
        '/webhook',
        Webhooks({
            webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,

            // Handle all events
            onPayload: async (payload) => {
                console.log('📨 Webhook received:', payload.type);
            },

            // Payment events
            onPaymentSucceeded: async (payload) => {
                await DodoPaymentsService.handlePaymentSucceeded(payload);
            },

            onPaymentFailed: async (payload) => {
                console.error('❌ Payment failed:', payload);
            },

            // Subscription events
            onSubscriptionActive: async (payload) => {
                await DodoPaymentsService.handleSubscriptionActive(payload);
            },

            onSubscriptionRenewed: async (payload) => {
                await DodoPaymentsService.handleSubscriptionRenewed(payload);
            },

            onSubscriptionCancelled: async (payload) => {
                await DodoPaymentsService.handleSubscriptionCancelled(payload);
            },

            onSubscriptionFailed: async (payload) => {
                await DodoPaymentsService.handleSubscriptionFailed(payload);
            },

            onSubscriptionExpired: async (payload) => {
                console.log('⏰ Subscription expired:', payload.data);
            },

            onSubscriptionPlanChanged: async (payload) => {
                console.log('🔄 Subscription plan changed:', payload.data);
            },

            // Refund events
            onRefundSucceeded: async (payload) => {
                console.log('💰 Refund succeeded:', payload);
            },

            onRefundFailed: async (payload) => {
                console.error('❌ Refund failed:', payload);
            },
        })
    );
} else {
    // Placeholder webhook endpoint when not configured
    router.post('/webhook', (req, res) => {
        console.warn('⚠️ Webhook received but DODO_PAYMENTS_WEBHOOK_KEY is not configured');
        res.status(200).json({ received: true, message: 'Webhook key not configured' });
    });
}

// Custom endpoint to create checkout session with plan selection
router.post('/create-checkout', requireAuth, async (req: AuthRequest, res, next) => {
    try {
        const { plan, billingCycle } = req.body;

        if (!plan) {
            throw new AppError(400, 'Plan is required');
        }

        const result = await DodoPaymentsService.createCheckoutSession(
            req.user!.id,
            plan,
            billingCycle || 'monthly'
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// Get current subscription details
router.get('/subscription', requireAuth, async (req: AuthRequest, res, next) => {
    try {
        const customer = await DodoPaymentsService.getCustomer(req.user!.id);

        res.json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
});

// Cancel subscription
router.post('/cancel', requireAuth, async (req: AuthRequest, res, next) => {
    try {
        const result = await DodoPaymentsService.cancelSubscription(req.user!.id);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
