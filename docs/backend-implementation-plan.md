# 🎙️ PodNex Backend Implementation Plan

**Production-Grade SaaS Podcast Generation Platform**

---

## 📋 Overview

Transform the prototype (`podnex-proto`) into a production-ready backend API with user authentication, subscription management, usage tracking, and scalable podcast generation.

**Current State:** Prototype with API key auth and basic MongoDB storage  
**Target State:** Full-featured SaaS backend with user management, billing, and enterprise features

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Web App)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     API Gateway (Express)                    │
│  - Rate Limiting  - CORS  - Authentication  - Validation    │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│  Auth Routes   │  │   Podcast   │  │  User/Settings  │
│  (Better Auth) │  │   Routes    │  │     Routes      │
└────────────────┘  └──────┬──────┘  └─────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌─────▼──────┐  ┌───────▼────────┐
│  Job Queue     │  │  Database  │  │  File Storage  │
│  (BullMQ/Redis)│  │ (Postgres) │  │  (S3/R2)       │
└────────┬───────┘  └────────────┘  └────────────────┘
         │
┌────────▼────────┐
│  Job Processor  │
│  - Script Gen   │
│  - TTS          │
│  - Audio Combo  │
│  - S3 Upload    │
│  - Webhooks     │
└─────────────────┘
```

---

## 📦 Database Schema Extensions

### Existing Tables (from Prisma)
- ✅ User
- ✅ Session
- ✅ Account
- ✅ Verification

### New Tables to Add

#### 1. **Podcast** (Main Entity)
```prisma
model Podcast {
  id              String          @id @default(cuid())
  userId          String
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Content
  title           String?         // Optional user-provided title
  noteId          String?         // Reference to user's note/document
  noteContent     String          @db.Text
  duration        PodcastDuration @default(SHORT) // SHORT or LONG
  
  // Generation metadata
  status          PodcastStatus   @default(QUEUED)
  progress        Int             @default(0) // 0-100
  currentStep     String?
  
  // Results
  audioUrl        String?
  audioDuration   Int?            // in seconds
  audioSize       Int?            // in bytes
  transcript      Json?           // TranscriptSegment[]
  
  // Voice settings
  hostVoice       String          @default("host")
  guestVoice      String          @default("guest")
  ttsProvider     String          @default("unreal")
  
  // Timestamps
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  startedAt       DateTime?
  completedAt     DateTime?
  
  // Error handling
  error           String?
  retryCount      Int             @default(0)
  
  // Soft delete
  deletedAt       DateTime?
  
  // Relations
  jobs            PodcastJob[]
  
  @@index([userId, createdAt])
  @@index([status])
}

enum PodcastDuration {
  SHORT  // 3-5 minutes
  LONG   // 8-10 minutes
}

enum PodcastStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}
```

#### 2. **PodcastJob** (Job Queue Tracking)
```prisma
model PodcastJob {
  id          String        @id @default(cuid())
  jobId       String        @unique // External job queue ID
  podcastId   String
  podcast     Podcast       @relation(fields: [podcastId], references: [id], onDelete: Cascade)
  
  status      JobStatus     @default(QUEUED)
  progress    Int           @default(0)
  currentStep String?
  
  // Job metadata
  attempts    Int           @default(0)
  priority    Int           @default(0)
  
  // Timestamps
  createdAt   DateTime      @default(now())
  startedAt   DateTime?
  completedAt DateTime?
  
  // Error tracking
  error       String?
  stackTrace  String?       @db.Text
  
  @@index([status])
  @@index([createdAt])
}

enum JobStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}
```

#### 3. **Subscription** (Billing)
```prisma
model Subscription {
  id                String              @id @default(cuid())
  userId            String              @unique
  user              User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Plan details
  plan              SubscriptionPlan    @default(FREE)
  status            SubscriptionStatus  @default(ACTIVE)
  
  // Billing (Dodo Payments)
  dodoCustomerId        String?         @unique
  dodoSubscriptionId    String?         @unique
  dodoProductId         String?
  
  // Limits
  monthlyPodcastLimit   Int             @default(5)
  monthlyMinutesLimit   Int             @default(25) // Total audio minutes
  
  // Usage tracking (resets monthly)
  currentPodcastCount   Int             @default(0)
  currentMinutesUsed    Int             @default(0)
  usageResetDate        DateTime
  
  // Timestamps
  currentPeriodStart    DateTime        @default(now())
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean         @default(false)
  cancelledAt           DateTime?
  
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt
  
  // Relations
  usageHistory          UsageRecord[]
}

enum SubscriptionPlan {
  FREE       // 5 podcasts/month, 25 mins
  STARTER    // 50 podcasts/month, 250 mins
  PRO        // 200 podcasts/month, 1000 mins
  BUSINESS   // Unlimited
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  TRIALING
  INCOMPLETE
}
```

#### 4. **UsageRecord** (Analytics)
```prisma
model UsageRecord {
  id              String        @id @default(cuid())
  userId          String
  subscriptionId  String
  subscription    Subscription  @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  
  // Usage details
  podcastId       String?
  duration        Int           // seconds of audio generated
  credits         Int           @default(1) // podcasts count
  
  // Timestamps
  recordedAt      DateTime      @default(now())
  billingMonth    String        // "2026-01" for aggregation
  
  @@index([userId, billingMonth])
  @@index([recordedAt])
}
```

#### 5. **ApiKey** (For API access)
```prisma
model ApiKey {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name        String    // User-friendly name
  key         String    @unique // hashed API key
  prefix      String    // First 8 chars for display (pk_live_xxxxx)
  
  // Permissions
  scopes      String[]  @default(["podcast:create", "podcast:read"])
  
  // Status
  active      Boolean   @default(true)
  lastUsedAt  DateTime?
  usageCount  Int       @default(0)
  
  // Rate limiting
  rateLimit   Int       @default(60) // requests per hour
  
  // Timestamps
  createdAt   DateTime  @default(now())
  expiresAt   DateTime?
  
  @@index([userId])
  @@index([key])
}
```

#### 6. **Webhook** (Event notifications)
```prisma
model Webhook {
  id          String          @id @default(cuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  url         String
  events      WebhookEvent[]
  secret      String          // For signature verification
  
  active      Boolean         @default(true)
  
  // Stats
  successCount    Int         @default(0)
  failureCount    Int         @default(0)
  lastTriggeredAt DateTime?
  
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  // Relations
  deliveries  WebhookDelivery[]
  
  @@index([userId])
}

enum WebhookEvent {
  PODCAST_CREATED
  PODCAST_PROCESSING
  PODCAST_COMPLETED
  PODCAST_FAILED
}

model WebhookDelivery {
  id          String    @id @default(cuid())
  webhookId   String
  webhook     Webhook   @relation(fields: [webhookId], references: [id], onDelete: Cascade)
  
  event       WebhookEvent
  payload     Json
  
  status      Int       // HTTP status code
  response    String?   @db.Text
  attempts    Int       @default(1)
  
  createdAt   DateTime  @default(now())
  deliveredAt DateTime?
  
  @@index([webhookId, createdAt])
}
```

---

## 🛣️ API Routes Structure

### `/api/auth/*` (Better Auth)
Already implemented - handles all authentication flows

### `/api/v1/podcasts`

#### `POST /api/v1/podcasts`
Create and queue a new podcast generation job
```typescript
Request Body:
{
  noteContent: string;      // Required: The content to convert
  duration: "short" | "long";
  title?: string;           // Optional: User-provided title
  noteId?: string;          // Optional: Reference to user's note
  hostVoice?: string;       // Optional: Voice ID for host
  guestVoice?: string;      // Optional: Voice ID for guest
  webhookUrl?: string;      // Optional: Custom webhook for this job
}

Response:
{
  success: true;
  podcast: {
    id: string;
    status: "queued";
    progress: 0;
    jobId: string;
    estimatedTime: number;  // seconds
    createdAt: string;
  }
}
```

#### `GET /api/v1/podcasts`
List user's podcasts with pagination and filtering
```typescript
Query Params:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- status: "queued" | "processing" | "completed" | "failed"
- sort: "createdAt" | "updatedAt" | "duration"
- order: "asc" | "desc"

Response:
{
  success: true;
  podcasts: Podcast[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
```

#### `GET /api/v1/podcasts/:id`
Get detailed podcast information

#### `DELETE /api/v1/podcasts/:id`
Soft delete a podcast (mark as deleted, cleanup async)

#### `POST /api/v1/podcasts/:id/retry`
Retry a failed podcast generation

#### `GET /api/v1/podcasts/:id/status`
Get real-time status (for polling)

#### `GET /api/v1/podcasts/:id/transcript`
Get formatted transcript with timestamps

#### `GET /api/v1/podcasts/:id/download`
Generate signed S3 URL for audio download

### `/api/v1/user`

#### `GET /api/v1/user/profile`
Get user profile with subscription info

#### `PATCH /api/v1/user/profile`
Update user profile

#### `GET /api/v1/user/subscription`
Get subscription details and usage

#### `POST /api/v1/user/subscription/upgrade`
Upgrade subscription (Dodo Payments integration)

#### `DELETE /api/v1/user/subscription`
Cancel subscription

#### `GET /api/v1/user/usage`
Get usage statistics and history
```typescript
Query: month?: string (YYYY-MM)
Response:
{
  currentPeriod: {
    podcastsUsed: number;
    podcastsLimit: number;
    minutesUsed: number;
    minutesLimit: number;
    resetDate: string;
  },
  history: UsageRecord[];
}
```

### `/api/v1/api-keys`

#### `GET /api/v1/api-keys`
List all API keys (masked)

#### `POST /api/v1/api-keys`
Create new API key
```typescript
Request:
{
  name: string;
  scopes?: string[];
  expiresAt?: string;
  rateLimit?: number;
}

Response:
{
  success: true;
  key: string;  // ONLY SHOWN ONCE!
  prefix: string;
  createdAt: string;
}
```

#### `DELETE /api/v1/api-keys/:id`
Revoke API key

#### `PATCH /api/v1/api-keys/:id`
Update API key (name, scopes, rate limit)

### `/api/v1/webhooks`

#### `GET /api/v1/webhooks`
List all webhooks

#### `POST /api/v1/webhooks`
Create webhook endpoint

#### `PATCH /api/v1/webhooks/:id`
Update webhook

#### `DELETE /api/v1/webhooks/:id`
Delete webhook

#### `GET /api/v1/webhooks/:id/deliveries`
Get webhook delivery logs

#### `POST /api/v1/webhooks/:id/test`
Send test webhook event

### `/api/v1/admin` (Admin only)

#### `GET /api/v1/admin/stats`
Platform statistics

#### `GET /api/v1/admin/users`
List all users

#### `GET /api/v1/admin/jobs`
Monitor job queue

---

## 🔧 Core Services Implementation

### 1. **Podcast Service** (`src/services/podcast.service.ts`)
```typescript
class PodcastService {
  async create(userId: string, data: CreatePodcastDto): Promise<Podcast>
  async findById(id: string, userId: string): Promise<Podcast>
  async findByUser(userId: string, options: ListOptions): Promise<PaginatedResult<Podcast>>
  async update(id: string, userId: string, data: UpdatePodcastDto): Promise<Podcast>
  async delete(id: string, userId: string): Promise<void>
  async retry(id: string, userId: string): Promise<Podcast>
  async getStatus(id: string, userId: string): Promise<PodcastStatus>
  async generateDownloadUrl(id: string, userId: string): Promise<string>
}
```

### 2. **Job Queue Service** (`src/services/queue.service.ts`)
**Technology:** BullMQ + Redis (replace in-memory queue)

```typescript
class QueueService {
  async addPodcastJob(podcast: Podcast): Promise<Job>
  async getJob(jobId: string): Promise<Job>
  async getJobStatus(jobId: string): Promise<JobStatus>
  async cancelJob(jobId: string): Promise<void>
  async retryJob(jobId: string): Promise<void>
  async getQueueStats(): Promise<QueueStats>
  async cleanCompletedJobs(age: number): Promise<void>
}
```

**Job Processor** (`src/workers/podcast.worker.ts`)
```typescript
async function processPodcastJob(job: Job<PodcastJobData>) {
  // 1. Update status to processing (0%)
  await updateProgress(job, 0, 'Starting generation');
  
  // 2. Generate script (0-25%)
  const script = await generateScript(job.data);
  await updateProgress(job, 25, 'Script generated');
  
  // 3. Generate audio segments (25-60%)
  const audioSegments = await generateAudio(script);
  await updateProgress(job, 60, 'Audio generated');
  
  // 4. Combine audio (60-80%)
  const finalAudio = await combineAudio(audioSegments);
  await updateProgress(job, 80, 'Audio combined');
  
  // 5. Upload to S3 (80-95%)
  const audioUrl = await uploadToS3(finalAudio);
  await updateProgress(job, 95, 'Uploading');
  
  // 6. Update database (95-100%)
  await savePodcast(job.data.podcastId, audioUrl, transcript);
  await updateProgress(job, 100, 'Completed');
  
  // 7. Send webhook
  await sendWebhook(job.data.userId, 'podcast.completed', { podcastId });
  
  // 8. Track usage
  await trackUsage(job.data.userId, audioDuration);
}
```

### 3. **Subscription Service** (`src/services/subscription.service.ts`)
```typescript
class SubscriptionService {
  async getSubscription(userId: string): Promise<Subscription>
  async checkLimits(userId: string): Promise<{ allowed: boolean; reason?: string }>
  async trackUsage(userId: string, minutes: number): Promise<void>
  async resetMonthlyUsage(): Promise<void> // Cron job
  async upgrade(userId: string, plan: SubscriptionPlan): Promise<Subscription>
  async cancel(userId: string): Promise<void>
  async syncWithDodoPayments(userId: string): Promise<void> // Sync subscription status
}
```

### 4. **Dodo Payments Service** (`src/services/dodo-payments.service.ts`)

**Installation:**
```bash
npm install @dodopayments/express
```

**Implementation:**
```typescript
import { checkoutHandler, CustomerPortal, Webhooks } from '@dodopayments/express';
import type { WebhookPayload } from '@dodopayments/express';

class DodoPaymentsService {
  private apiKey: string;
  private webhookKey: string;
  private environment: 'test_mode' | 'live_mode';
  private returnUrl: string;
  
  constructor() {
    this.apiKey = process.env.DODO_PAYMENTS_API_KEY!;
    this.webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY!;
    this.environment = process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode';
    this.returnUrl = process.env.DODO_PAYMENTS_RETURN_URL!;
  }
  
  // Create checkout session for subscription upgrade
  async createCheckoutSession(
    userId: string, 
    plan: SubscriptionPlan
  ): Promise<{ checkoutUrl: string }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    
    const productId = this.getProductIdForPlan(plan);
    
    // Using checkout sessions (recommended)
    const response = await fetch('https://api.dodopayments.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_cart: [{
          product_id: productId,
          quantity: 1
        }],
        customer: {
          email: user.email,
          name: user.name
        },
        return_url: this.returnUrl,
        metadata: {
          userId,
          plan
        }
      })
    });
    
    const data = await response.json();
    return { checkoutUrl: data.checkout_url };
  }
  
  // Get customer portal URL
  async getCustomerPortalUrl(dodoCustomerId: string): Promise<string> {
    const response = await fetch(
      `https://api.dodopayments.com/v1/customer-portal?customer_id=${dodoCustomerId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      }
    );
    
    const data = await response.json();
    return data.portal_url;
  }
  
  // Handle webhook events
  async handleWebhook(payload: WebhookPayload): Promise<void> {
    switch (payload.event_type) {
      case 'subscription.active':
        await this.handleSubscriptionActive(payload);
        break;
      case 'subscription.renewed':
        await this.handleSubscriptionRenewed(payload);
        break;
      case 'subscription.cancelled':
        await this.handleSubscriptionCancelled(payload);
        break;
      case 'subscription.failed':
        await this.handleSubscriptionFailed(payload);
        break;
      case 'subscription.expired':
        await this.handleSubscriptionExpired(payload);
        break;
      case 'payment.succeeded':
        await this.handlePaymentSucceeded(payload);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(payload);
        break;
      default:
        console.log(`Unhandled webhook event: ${payload.event_type}`);
    }
  }
  
  private async handleSubscriptionActive(payload: WebhookPayload) {
    const { customer_id, subscription_id, metadata } = payload.data;
    const userId = metadata?.userId;
    
    if (!userId) {
      console.error('No userId in webhook metadata');
      return;
    }
    
    const plan = this.getPlanFromProductId(payload.data.product_id);
    const limits = this.getLimitsForPlan(plan);
    
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        dodoCustomerId: customer_id,
        dodoSubscriptionId: subscription_id,
        plan,
        status: 'ACTIVE',
        monthlyPodcastLimit: limits.podcasts,
        monthlyMinutesLimit: limits.minutes,
        currentPeriodStart: new Date(),
        currentPeriodEnd: this.getNextBillingDate(),
        usageResetDate: this.getNextBillingDate(),
      },
      update: {
        dodoSubscriptionId: subscription_id,
        plan,
        status: 'ACTIVE',
        monthlyPodcastLimit: limits.podcasts,
        monthlyMinutesLimit: limits.minutes,
      }
    });
  }
  
  private async handleSubscriptionCancelled(payload: WebhookPayload) {
    const subscription_id = payload.data.subscription_id;
    
    await prisma.subscription.update({
      where: { dodoSubscriptionId: subscription_id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelAtPeriodEnd: true,
      }
    });
  }
  
  private async handleSubscriptionFailed(payload: WebhookPayload) {
    const subscription_id = payload.data.subscription_id;
    
    await prisma.subscription.update({
      where: { dodoSubscriptionId: subscription_id },
      data: { status: 'PAST_DUE' }
    });
  }
  
  private async handlePaymentSucceeded(payload: WebhookPayload) {
    // Log successful payment, send receipt email, etc.
    console.log('Payment succeeded:', payload.data);
  }
  
  private async handlePaymentFailed(payload: WebhookPayload) {
    // Notify user of failed payment
    console.error('Payment failed:', payload.data);
  }
  
  // Utility methods
  private getProductIdForPlan(plan: SubscriptionPlan): string {
    const mapping = {
      STARTER: process.env.DODO_PRODUCT_ID_STARTER!,
      PRO: process.env.DODO_PRODUCT_ID_PRO!,
      BUSINESS: process.env.DODO_PRODUCT_ID_BUSINESS!,
    };
    return mapping[plan] || '';
  }
  
  private getPlanFromProductId(productId: string): SubscriptionPlan {
    if (productId === process.env.DODO_PRODUCT_ID_STARTER) return 'STARTER';
    if (productId === process.env.DODO_PRODUCT_ID_PRO) return 'PRO';
    if (productId === process.env.DODO_PRODUCT_ID_BUSINESS) return 'BUSINESS';
    return 'FREE';
  }
  
  private getLimitsForPlan(plan: SubscriptionPlan) {
    const limits = {
      FREE: { podcasts: 5, minutes: 25 },
      STARTER: { podcasts: 50, minutes: 250 },
      PRO: { podcasts: 200, minutes: 1000 },
      BUSINESS: { podcasts: 999999, minutes: 999999 },
    };
    return limits[plan];
  }
  
  private getNextBillingDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }
}

export const dodoPaymentsService = new DodoPaymentsService();
```

**Express Route Handlers:**
```typescript
// src/routes/billing.routes.ts
import { Router } from 'express';
import { checkoutHandler, CustomerPortal, Webhooks } from '@dodopayments/express';
import { dodoPaymentsService } from '../services/dodo-payments.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Checkout - Create session for subscription upgrade
router.post('/billing/checkout', requireAuth, async (req, res) => {
  try {
    const { plan } = req.body;
    const { checkoutUrl } = await dodoPaymentsService.createCheckoutSession(
      req.user.id,
      plan
    );
    res.json({ success: true, checkoutUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer Portal - Manage subscription
router.get('/billing/portal', requireAuth, async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!subscription?.dodoCustomerId) {
      return res.status(404).json({ error: 'No subscription found' });
    }
    
    const portalUrl = await dodoPaymentsService.getCustomerPortalUrl(
      subscription.dodoCustomerId
    );
    
    res.json({ success: true, portalUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhooks - Handle Dodo Payments events
router.post('/billing/webhooks', Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
  onPayload: async (payload) => {
    await dodoPaymentsService.handleWebhook(payload);
  },
  onSubscriptionActive: async (payload) => {
    console.log('Subscription activated:', payload);
  },
  onSubscriptionCancelled: async (payload) => {
    console.log('Subscription cancelled:', payload);
  },
  onPaymentSucceeded: async (payload) => {
    console.log('Payment succeeded:', payload);
  },
  onPaymentFailed: async (payload) => {
    console.error('Payment failed:', payload);
  },
}));

export default router;
```

### 5. **Storage Service** (`src/services/storage.service.ts`)
**Abstraction layer for S3/Cloudflare R2**

```typescript
class StorageService {
  async upload(buffer: Buffer, key: string, metadata?: object): Promise<string>
  async getSignedUrl(key: string, expiresIn: number): Promise<string>
  async delete(key: string): Promise<void>
  async getMetadata(key: string): Promise<object>
  async listObjects(prefix: string): Promise<string[]>
}
```

### 6. **Webhook Service** (`src/services/webhook.service.ts`)
```typescript
class WebhookService {
  async create(userId: string, data: CreateWebhookDto): Promise<Webhook>
  async sendEvent(userId: string, event: WebhookEvent, payload: object): Promise<void>
  async retry(deliveryId: string): Promise<void>
  async verify(signature: string, body: string, secret: string): Promise<boolean>
}
```

---

## 🔒 Middleware & Security

### 1. **Authentication Middleware** (`src/middleware/auth.middleware.ts`)
```typescript
// Session-based auth for web
export async function requireAuth(req, res, next) {
  const session = await getSession(req);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  req.user = session.user;
  next();
}

// API key auth for programmatic access
export async function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const key = await ApiKey.findOne({ key: hash(apiKey), active: true });
  if (!key) return res.status(401).json({ error: 'Invalid API key' });
  await key.incrementUsage();
  req.user = await User.findById(key.userId);
  req.apiKey = key;
  next();
}
```

### 2. **Rate Limiting** (`src/middleware/rate-limit.middleware.ts`)
```typescript
// Per-user rate limiting
export const userRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15min
  keyGenerator: (req) => req.user.id,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: res.getHeader('Retry-After')
    });
  }
});

// Per-API-key rate limiting
export const apiKeyRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => req.apiKey?.rateLimit || 60,
  keyGenerator: (req) => req.apiKey.id,
});
```

### 3. **Subscription Check** (`src/middleware/subscription.middleware.ts`)
```typescript
export async function checkSubscriptionLimits(req, res, next) {
  const subscription = await SubscriptionService.getSubscription(req.user.id);
  const limits = await SubscriptionService.checkLimits(req.user.id);
  
  if (!limits.allowed) {
    return res.status(403).json({
      error: 'Subscription limit reached',
      reason: limits.reason,
      subscription: {
        plan: subscription.plan,
        usage: subscription.currentPodcastCount,
        limit: subscription.monthlyPodcastLimit,
        resetDate: subscription.usageResetDate
      }
    });
  }
  
  next();
}
```

### 4. **Validation Middleware** (Already exists)
Enhance with more validators for podcast creation

---

## 📊 Background Jobs & Cron

### 1. **Usage Reset Job** (Monthly - 1st of each month)
```typescript
// Reset all users' monthly usage counters
cron.schedule('0 0 1 * *', async () => {
  await SubscriptionService.resetMonthlyUsage();
});
```

### 2. **Cleanup Job** (Daily)
```typescript
// Delete old completed jobs, expired files, etc.
cron.schedule('0 2 * * *', async () => {
  await cleanupOldJobs(7); // 7 days old
  await cleanupDeletedPodcasts(30); // 30 days soft-deleted
  await cleanupExpiredApiKeys();
});
```

### 3. **Webhook Retry Job** (Every 5 minutes)
```typescript
// Retry failed webhook deliveries
cron.schedule('*/5 * * * *', async () => {
  await retryFailedWebhooks();
});
```

### 4. **Metrics Collection** (Hourly)
```typescript
// Collect platform metrics
cron.schedule('0 * * * *', async () => {
  await collectMetrics();
});
```

---

## 🧪 Testing Strategy

### 1. **Unit Tests**
- All services in isolation
- Utility functions
- Validators

### 2. **Integration Tests**
- API endpoints with test database
- Queue processing
- Webhook delivery

### 3. **E2E Tests**
- Full podcast generation flow
- Subscription upgrades
- Usage limit enforcement

---

## 📈 Monitoring & Observability

### 1. **Logging**
- Winston or Pino for structured logging
- Log levels: error, warn, info, debug
- Include request IDs for tracing

### 2. **Metrics**
- Prometheus + Grafana
- Track: API latency, job queue depth, success rates, error rates

### 3. **Error Tracking**
- Sentry for error tracking
- Alert on critical errors

### 4. **Health Checks**
- `/api/health` - API server
- `/api/health/db` - Database connection
- `/api/health/redis` - Redis connection
- `/api/health/s3` - S3 connectivity

---

## 🚀 Deployment Checklist

- [ ] Environment variables properly configured
- [ ] Database migrations run
- [ ] Redis/BullMQ configured
- [ ] S3/R2 bucket created with proper CORS
- [ ] Dodo Payments webhooks configured at `https://api.podnex.com/api/v1/billing/webhooks`
- [ ] Dodo Payments products created for each plan (FREE, STARTER, PRO, BUSINESS)
- [ ] Dodo Payments test mode verified before going live
- [ ] Rate limiting enabled
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented
- [ ] CDN configured for audio files
- [ ] SSL certificates configured
- [ ] CORS properly configured
- [ ] Documentation updated

---

## 📚 Environment Variables

```env
# Server
NODE_ENV=production
PORT=3001
API_VERSION=v1

# Database
DATABASE_URL=postgresql://...

# Redis (for BullMQ)
REDIS_URL=redis://...

# Better Auth
BETTER_AUTH_URL=https://api.podnex.com
BETTER_AUTH_SECRET=xxx
FRONTEND_URL=https://podnex.com

# AI Services
OPENAI_API_KEY=xxx
UNREAL_SPEECH_API_KEY=xxx

# Storage (S3/R2)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
S3_BUCKET_NAME=podnex-audio
S3_CDN_URL=https://cdn.podnex.com

# Dodo Payments
DODO_PAYMENTS_API_KEY=your-api-key
DODO_PAYMENTS_WEBHOOK_KEY=your-webhook-secret
DODO_PAYMENTS_ENVIRONMENT=test_mode # or live_mode
DODO_PAYMENTS_RETURN_URL=https://podnex.com/billing/success
DODO_PRODUCT_ID_STARTER=pdt_xxx
DODO_PRODUCT_ID_PRO=pdt_xxx
DODO_PRODUCT_ID_BUSINESS=pdt_xxx

# Monitoring
SENTRY_DSN=xxx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🎯 Implementation Priority

### Phase 1: Core API (Week 1-2)
1. ✅ Set up project structure
2. ✅ Implement database schema
3. ✅ Create podcast CRUD routes
4. ✅ Integrate job queue (BullMQ)
5. ✅ Port generation logic from prototype

### Phase 2: User Management (Week 2-3)
1. ✅ Subscription service
2. ✅ Usage tracking
3. ✅ API key management
4. ✅ Dodo Payments integration

### Phase 3: Advanced Features (Week 3-4)
1. ✅ Webhook system
2. ✅ Real-time status updates
3. ✅ Advanced analytics
4. ✅ Admin dashboard API

### Phase 4: Production Ready (Week 4-5)
1. ✅ Rate limiting
2. ✅ Monitoring and logging
3. ✅ Error handling
4. ✅ Testing suite
5. ✅ Documentation
6. ✅ Deployment automation

---

## 🔗 Integration Points

### With Frontend
- WebSocket/SSE for real-time progress
- REST API for all CRUD operations
- Webhook callbacks for async notifications

### With External Services
- Dodo Payments for billing
- OpenAI for script generation
- Unreal Speech for TTS
- S3/R2 for file storage
- Redis for job queue
- Sentry for error tracking

---

**Last Updated:** January 7, 2026
