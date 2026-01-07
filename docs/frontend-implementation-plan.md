# 🎨 PodNex Frontend Implementation Plan

**Production-Grade SaaS Dashboard & User Experience**

---

## 📋 Overview

Build a comprehensive, user-friendly dashboard for podcast creation, management, and analytics. The frontend will provide an intuitive interface for users to create podcasts, monitor generation progress, manage subscriptions, and access advanced features.

**Current State:** Landing page and auth pages  
**Target State:** Full-featured dashboard with real-time updates, analytics, and subscription management

---

## 🏗️ Application Structure

```
apps/web/
├── app/
│   ├── (auth)/                    # Auth group (public)
│   │   ├── signin/
│   │   └── signup/
│   ├── (marketing)/               # Marketing group (public)
│   │   ├── page.tsx              # Landing page ✅
│   │   ├── pricing/
│   │   ├── docs/
│   │   └── blog/
│   ├── (dashboard)/              # Dashboard group (protected)
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── dashboard/            # Main dashboard
│   │   ├── podcasts/             # Podcast management
│   │   │   ├── page.tsx          # List view
│   │   │   ├── new/              # Create new
│   │   │   └── [id]/             # Detail view
│   │   ├── analytics/            # Usage analytics
│   │   ├── settings/             # User settings
│   │   │   ├── profile/
│   │   │   ├── subscription/
│   │   │   ├── api-keys/
│   │   │   └── webhooks/
│   │   └── admin/                # Admin panel (admin only)
│   └── api/                      # API routes (Next.js)
│       └── webhooks/
│           └── stripe/
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── StatsCard.tsx
│   │   └── RecentPodcasts.tsx
│   ├── podcasts/
│   │   ├── PodcastCard.tsx
│   │   ├── PodcastList.tsx
│   │   ├── PodcastPlayer.tsx
│   │   ├── CreatePodcastDialog.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── TranscriptViewer.tsx
│   ├── settings/
│   │   ├── ProfileForm.tsx
│   │   ├── SubscriptionCard.tsx
│   │   ├── ApiKeyManager.tsx
│   │   └── WebhookManager.tsx
│   ├── analytics/
│   │   ├── UsageChart.tsx
│   │   ├── UsageTable.tsx
│   │   └── PodcastStats.tsx
│   └── ui/                       # shadcn/ui components ✅
└── lib/
    ├── api/                      # API client functions
    ├── hooks/                    # Custom React hooks
    ├── utils/                    # Utility functions
    └── types/                    # TypeScript types
```

---

## 🎨 Key Pages & Features

### 1. 🏠 Dashboard Home (`/dashboard`)

**Purpose:** Overview of user's podcast activity and quick actions

**Components:**
- Welcome section with user's name
- Quick stats cards (Total Podcasts, Minutes Generated, This Month's Usage)
- Usage meter (visual progress bar showing plan limits)
- Quick action button: "Create New Podcast"
- Recent podcasts grid (last 6 podcasts)
- Activity feed (recent generation, completions, failures)

**Key Features:**
```typescript
// Stats Display
interface DashboardStats {
  totalPodcasts: number;
  totalMinutes: number;
  thisMonthPodcasts: number;
  thisMonthMinutes: number;
  planLimit: number;
  planName: string;
}

// Quick Actions
- Create New Podcast (primary CTA)
- View All Podcasts
- Upgrade Plan (if near limit)
```

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Sidebar   │  Main Content                              │
│            │                                             │
│  Dashboard │  Welcome back, John! 👋                    │
│  Podcasts  │                                             │
│  Analytics │  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  Settings  │  │   50    │ │  250min │ │  15/50  │      │
│            │  │Podcasts │ │Generated│ │This Mo. │      │
│            │  └─────────┘ └─────────┘ └─────────┘      │
│            │                                             │
│            │  [████████░░] 15/50 podcasts used          │
│            │                                             │
│            │  Recent Podcasts                            │
│            │  ┌────────┐ ┌────────┐ ┌────────┐         │
│            │  │ [img]  │ │ [img]  │ │ [img]  │         │
│            │  │ Title  │ │ Title  │ │ Title  │         │
│            │  └────────┘ └────────┘ └────────┘         │
└─────────────────────────────────────────────────────────┘
```

---

### 2. 🎙️ Podcasts Page (`/dashboard/podcasts`)

**Purpose:** View, filter, search, and manage all podcasts

**Components:**
- Search bar with filters
- View toggle (Grid / List / Table)
- Status filters (All, Processing, Completed, Failed)
- Sort options (Date, Duration, Status)
- Pagination
- Empty state (when no podcasts)

**Podcast Card Features:**
- Thumbnail/cover image (generated or default)
- Title (auto-generated or user-provided)
- Status badge (Queued, Processing, Completed, Failed)
- Duration
- Created date
- Actions menu:
  - Play/Download
  - View Details
  - View Transcript
  - Retry (if failed)
  - Delete

**Real-time Updates:**
```typescript
// Use WebSocket or polling for live status updates
const usePodcastStatus = (podcastId: string) => {
  const [status, setStatus] = useState<PodcastStatus>();
  
  useEffect(() => {
    // Poll every 2 seconds while processing
    const interval = setInterval(async () => {
      const data = await api.podcasts.getStatus(podcastId);
      setStatus(data);
      if (data.status !== 'processing') {
        clearInterval(interval);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [podcastId]);
  
  return status;
};
```

**List View:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Search...] [Filter: All ▾] [Sort: Recent ▾] [+ New]       │
├─────────────────────────────────────────────────────────────┤
│ ○ Introduction to AI          Completed    5:32    Jan 5   │
│ ● Machine Learning Basics     Processing   --:--   Jan 7   │
│   └─ [████████░░░░] 65% - Generating audio                 │
│ ○ Deep Learning Guide         Completed    8:15    Jan 4   │
│ ✕ Failed Generation           Failed       --:--   Jan 3   │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. ➕ Create Podcast Page (`/dashboard/podcasts/new`)

**Purpose:** Multi-step form to create a new podcast

**Step 1: Content Input**
- Large textarea for note content
- Character counter
- AI suggestions for improvement (optional)
- Paste from clipboard button
- Upload .txt file option

**Step 2: Configuration**
- Duration selector: Short (3-5 min) / Long (8-10 min)
- Title (optional)
- Voice selection (if multiple available):
  - Host voice preview
  - Guest voice preview
- Advanced settings (collapsible):
  - Custom webhook URL
  - Note ID reference

**Step 3: Review & Create**
- Content preview
- Estimated duration
- Credit cost (e.g., "This will use 1 podcast credit")
- Create button

**Form Validation:**
```typescript
const createPodcastSchema = z.object({
  noteContent: z.string()
    .min(100, "Content must be at least 100 characters")
    .max(10000, "Content too long (max 10,000 characters)"),
  duration: z.enum(["short", "long"]),
  title: z.string().max(100).optional(),
  hostVoice: z.string().optional(),
  guestVoice: z.string().optional(),
});
```

**Success Flow:**
```
Create → Show success toast → Redirect to podcast detail page
         → Start polling for status updates
```

---

### 4. 🔍 Podcast Detail Page (`/dashboard/podcasts/[id]`)

**Purpose:** Detailed view of a single podcast with player and transcript

**Sections:**

#### Header
- Title (editable inline)
- Status badge
- Action buttons: Share, Download, Delete

#### Audio Player
- Custom-styled audio player with:
  - Play/pause
  - Timeline scrubber
  - Volume control
  - Playback speed (0.5x, 1x, 1.5x, 2x)
  - Download button

#### Generation Progress (if processing)
- Progress bar with percentage
- Current step (e.g., "Generating audio...")
- Elapsed time
- Estimated time remaining
- Cancel button

#### Transcript
- Interactive transcript with timestamps
- Click timestamp to jump to that point in audio
- Search within transcript
- Export transcript (TXT, SRT, VTT)
- Copy to clipboard
- Speaker labels (Host/Guest) with different colors

#### Metadata
- Created date
- Duration
- File size
- TTS provider used
- Voice IDs

**Layout:**
```
┌───────────────────────────────────────────────────────┐
│  ← Back to Podcasts            [Share] [Download] [×] │
├───────────────────────────────────────────────────────┤
│                                                        │
│  Introduction to Artificial Intelligence              │
│  ● Completed • 5:32 • Jan 5, 2026                    │
│                                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │  ▶  ━━━━━━━━●━━━━━━━  2:45 / 5:32    🔊  1x   │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│  Transcript                              [Export ▾]   │
│  ┌────────────────────────────────────────────────┐  │
│  │ 0:00  HOST:   Welcome to today's episode...    │  │
│  │ 0:15  GUEST:  Thanks for having me...          │  │
│  │ 0:32  HOST:   Let's dive into the topic...     │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

---

### 5. 📊 Analytics Page (`/dashboard/analytics`)

**Purpose:** Visual insights into usage patterns and statistics

**Sections:**

#### Overview Cards
- Total podcasts generated
- Total minutes created
- Average duration
- Success rate

#### Usage Chart
- Monthly podcast generation (bar chart)
- Minutes used over time (line chart)
- Filter by time range (Last 7 days, 30 days, 3 months, All time)

#### Plan Usage
- Current billing period
- Podcasts used vs. limit
- Minutes used vs. limit
- Days until reset

#### Podcast Statistics
- Most common duration (short vs. long)
- Average generation time
- Peak usage hours (heatmap)

#### Recent Activity Table
- Date, Podcast Title, Duration, Status
- Export as CSV

**Visualizations:**
```typescript
// Use recharts or chart.js
import { LineChart, BarChart, PieChart } from 'recharts';

// Sample data structure
interface UsageData {
  date: string;
  podcasts: number;
  minutes: number;
}
```

---

### 6. ⚙️ Settings Pages

#### 6.1 Profile (`/dashboard/settings/profile`)
- Name
- Email
- Avatar upload
- Password change
- Account deletion (with confirmation)

#### 6.2 Subscription (`/dashboard/settings/subscription`)
- Current plan details
- Usage summary
- Plan comparison table
- Upgrade/downgrade buttons
- Billing history
- Invoice downloads
- Cancel subscription (with retention flow)

**Plan Comparison:**
```
┌─────────────────────────────────────────────────────────┐
│  Your Current Plan: Starter                             │
│  ● 15/50 podcasts used this month                       │
│  ● Resets on February 1, 2026                           │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   FREE   │  │ STARTER  │  │   PRO    │             │
│  │   $0/mo  │  │ $29/mo ✓ │  │  $99/mo  │             │
│  ├──────────┤  ├──────────┤  ├──────────┤             │
│  │ 5 pods   │  │ 50 pods  │  │ 200 pods │             │
│  │ 25 mins  │  │ 250 mins │  │1000 mins │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  [  Start  ]  [  Current ]  [ Upgrade ]                │
└─────────────────────────────────────────────────────────┘
```

#### 6.3 API Keys (`/dashboard/settings/api-keys`)
- List of API keys (masked: `pk_live_xxxxxx...xx123`)
- Create new key dialog:
  - Name
  - Scopes (checkboxes)
  - Expiration date (optional)
  - Rate limit
- Copy key (shown only once!)
- Last used date
- Usage count
- Revoke button

**Security Warning:**
```
⚠️  API keys grant full access to your account.
    Keep them secure and never share them publicly.
```

#### 6.4 Webhooks (`/dashboard/settings/webhooks`)
- List of webhook endpoints
- Create webhook dialog:
  - URL
  - Events to subscribe to (checkboxes)
  - Secret (auto-generated)
- Test webhook button
- View delivery logs
- Success/failure statistics
- Pause/activate toggle

---

### 7. 👨‍💼 Admin Panel (`/dashboard/admin`)

**Access:** Admin users only

#### 7.1 Platform Overview
- Total users
- Total podcasts
- Revenue (Stripe)
- Active subscriptions

#### 7.2 User Management
- Search users
- View user details
- Impersonate user (for support)
- Suspend/unsuspend account

#### 7.3 Job Monitor
- Active jobs
- Queue depth
- Failed jobs with retry button
- System health

#### 7.4 System Settings
- Feature flags
- Maintenance mode
- Rate limit adjustments

---

## 🎨 UI/UX Principles

### Design System (Current Implementation)

**Colors:** Dark, elegant palette with warm accents
- **Background:** `hsl(0 0% 2%)` - Deep black
- **Foreground:** `hsl(40 10% 94%)` - Warm off-white
- **Card/Surface:** `hsl(0 0% 4%)` - Slightly elevated dark
- **Primary:** `hsl(40 10% 94%)` - Warm white (for CTAs)
- **Secondary:** `hsl(220 10% 12%)` - Dark blue-gray
- **Muted:** `hsl(220 8% 18%)` - Muted dark
- **Muted Foreground:** `hsl(220 8% 55%)` - Gray text
- **Accent:** `hsl(220 10% 8%)` - Accent dark
- **Border:** `hsl(220 8% 15%)` - Subtle borders
- **Destructive:** `hsl(0 62% 50%)` - Red for errors
- **Slate:** `hsl(220 8% 45%)` - Custom gray
- **Slate Light:** `hsl(220 8% 65%)` - Light gray accent

**Typography:**
- **Headings:** `Cormorant Garamond` (serif, elegant) - weights: 300, 400, 500, 600, 700
- **Body:** `Inter` (sans-serif, clean) - weights: 300, 400, 500, 600
- **Font Variables:** `--font-serif` and `--font-sans`

**Special Effects:**
- **Grain Overlay:** Subtle texture (opacity: 0.03) for sophistication
- **Text Gradient:** Linear gradient from warm white to gray
- **Border Gradient:** Subtle gradient borders
- **Transitions:** Smooth cubic-bezier(0.16, 1, 0.3, 1) animations

**Spacing:** 8px base unit (4, 8, 16, 24, 32, 48, 64)

### Components (shadcn/ui)
Already set up ✅ with custom dark theme. Key components to use:
- Button (with primary/secondary variants using current color scheme)
- Card (using `--card` background)
- Dialog (with grain overlay)
- Form (React Hook Form integration)
- Input (with `--input` border color)
- Select
- Tabs
- Toast (sonner for notifications)
- Progress (for podcast generation status)
- Badge (for status indicators)
- Table
- Avatar
- Dropdown Menu

**Design Guidelines:**
- Use `font-serif` (Cormorant Garamond) for all headings (h1-h6)
- Use `font-sans` (Inter) for body text and UI elements
- Apply grain overlay to maintain visual consistency
- Use `text-gradient` class for special emphasis
- Border radius: `--radius` (0.25rem by default)
- Smooth transitions: `transition-smooth` or `transition-fast`

### Responsiveness
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar on mobile
- Stack cards vertically on small screens

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation
- Focus indicators
- Screen reader support
- Color contrast ratios (WCAG AA)

---

## 🔧 Technical Implementation

### State Management

#### 1. Server State (React Query / TanStack Query)
```typescript
// API queries
const { data: podcasts, isLoading } = useQuery({
  queryKey: ['podcasts', { page, status, sort }],
  queryFn: () => api.podcasts.list({ page, status, sort }),
  refetchInterval: (data) => 
    data?.some(p => p.status === 'processing') ? 2000 : false,
});

// Mutations
const createPodcast = useMutation({
  mutationFn: api.podcasts.create,
  onSuccess: () => {
    queryClient.invalidateQueries(['podcasts']);
    toast.success('Podcast created!');
    router.push('/dashboard/podcasts');
  },
});
```

#### 2. Client State (Zustand)
```typescript
// Global UI state
interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

### API Client

```typescript
// lib/api/client.ts
class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;
  
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      credentials: 'include', // Include auth cookies
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.message, response.status);
    }
    
    return response.json();
  }
  
  // Podcasts
  podcasts = {
    list: (params: ListParams) => 
      this.request<PaginatedResponse<Podcast>>(`/api/v1/podcasts?${qs.stringify(params)}`),
    
    get: (id: string) => 
      this.request<Podcast>(`/api/v1/podcasts/${id}`),
    
    create: (data: CreatePodcastDto) => 
      this.request<Podcast>('/api/v1/podcasts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) => 
      this.request<void>(`/api/v1/podcasts/${id}`, { method: 'DELETE' }),
    
    retry: (id: string) => 
      this.request<Podcast>(`/api/v1/podcasts/${id}/retry`, { method: 'POST' }),
    
    getStatus: (id: string) => 
      this.request<PodcastStatus>(`/api/v1/podcasts/${id}/status`),
  };
  
  // User
  user = {
    getProfile: () => this.request<User>('/api/v1/user/profile'),
    updateProfile: (data: UpdateProfileDto) => 
      this.request<User>('/api/v1/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    getSubscription: () => 
      this.request<Subscription>('/api/v1/user/subscription'),
    getUsage: (month?: string) => 
      this.request<UsageData>(`/api/v1/user/usage${month ? `?month=${month}` : ''}`),
  };
  
  // Similar for apiKeys, webhooks, etc.
}

export const api = new ApiClient();
```

### Real-time Updates

#### Option 1: Polling (Simple)
```typescript
const usePodcastPolling = (podcastId: string) => {
  return useQuery({
    queryKey: ['podcast', podcastId],
    queryFn: () => api.podcasts.get(podcastId),
    refetchInterval: (data) => 
      data?.status === 'processing' ? 2000 : false, // Poll every 2s
    enabled: !!podcastId,
  });
};
```

#### Option 2: Server-Sent Events (Better)
```typescript
const usePodcastSSE = (podcastId: string) => {
  const [status, setStatus] = useState<PodcastStatus>();
  
  useEffect(() => {
    const eventSource = new EventSource(
      `${API_URL}/api/v1/podcasts/${podcastId}/stream`
    );
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data);
    };
    
    return () => eventSource.close();
  }, [podcastId]);
  
  return status;
};
```

### Form Handling (React Hook Form + Zod)
```typescript
const CreatePodcastForm = () => {
  const form = useForm<CreatePodcastDto>({
    resolver: zodResolver(createPodcastSchema),
    defaultValues: {
      noteContent: '',
      duration: 'short',
    },
  });
  
  const createMutation = useMutation({
    mutationFn: api.podcasts.create,
  });
  
  const onSubmit = (data: CreatePodcastDto) => {
    createMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="noteContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create Podcast'}
        </Button>
      </form>
    </Form>
  );
};
```

---

## 🎯 User Flows

### 1. New User Onboarding
```
Sign up → Email verification → Welcome tour → Create first podcast
   ↓
Dashboard with tutorial tooltips → Explain features → Create first podcast
   ↓
Show progress in real-time → Completed! → "Great job! Here's your podcast"
   ↓
Prompt to explore features (API keys, webhooks, etc.)
```

### 2. Create Podcast Flow
```
Dashboard → Click "Create New" → Enter content → Configure settings
   ↓
Review & confirm → Processing screen (live progress) → Complete!
   ↓
Auto-redirect to podcast detail → Play immediately → Share options
```

### 3. Upgrade Flow
```
Near limit warning → "Upgrade to continue" CTA → Plan comparison
   ↓
Select plan → Stripe checkout → Success → Immediate limit increase
   ↓
Return to dashboard with celebration animation
```

### 4. API Integration Flow
```
Settings → API Keys → Create new key → Copy key (show once warning)
   ↓
View documentation → Code examples → Test with curl
   ↓
Setup webhook → Test webhook → See delivery logs
```

---

## 🚀 Performance Optimizations

### 1. Code Splitting
```typescript
// Lazy load heavy components
const AudioPlayer = dynamic(() => import('@/components/AudioPlayer'), {
  loading: () => <Skeleton className="h-20" />,
  ssr: false,
});

const AnalyticsCharts = dynamic(() => import('@/components/AnalyticsCharts'), {
  loading: () => <Spinner />,
});
```

### 2. Image Optimization
```typescript
import Image from 'next/image';

// Use Next.js Image component
<Image
  src="/podcast-cover.jpg"
  alt="Podcast cover"
  width={300}
  height={300}
  placeholder="blur"
/>
```

### 3. Caching Strategy
```typescript
// React Query config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### 4. Optimistic Updates
```typescript
const deletePodcast = useMutation({
  mutationFn: api.podcasts.delete,
  onMutate: async (id) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['podcasts']);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['podcasts']);
    
    // Optimistically update
    queryClient.setQueryData(['podcasts'], (old: Podcast[]) =>
      old.filter((p) => p.id !== id)
    );
    
    return { previous };
  },
  onError: (err, id, context) => {
    // Rollback on error
    queryClient.setQueryData(['podcasts'], context?.previous);
  },
});
```

---

## 🧪 Testing Strategy

### 1. Unit Tests (Vitest)
- Utility functions
- API client
- Custom hooks

### 2. Component Tests (Testing Library)
- Form validation
- Button interactions
- Conditional rendering

### 3. E2E Tests (Playwright)
- Complete user flows
- Authentication
- Podcast creation
- Payment flow

---

## 📱 Progressive Web App (PWA)

Add PWA capabilities:
- Install prompt
- Offline support (show cached podcasts)
- Background sync
- Push notifications (when podcast completes)

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // ... config
});
```

---

## 🎯 Implementation Priority

### Phase 1: Core Dashboard (Week 1-2)
1. ✅ Dashboard layout with sidebar
2. ✅ Dashboard home page
3. ✅ Podcasts list page
4. ✅ Create podcast form
5. ✅ Podcast detail page with player

### Phase 2: Real-time & Polish (Week 2-3)
1. ✅ Real-time progress updates
2. ✅ Audio player with controls
3. ✅ Transcript viewer
4. ✅ Toast notifications
5. ✅ Error states and loading states

### Phase 3: Settings & Account (Week 3)
1. ✅ Profile settings
2. ✅ Subscription management
3. ✅ Stripe integration
4. ✅ API key management
5. ✅ Webhook management

### Phase 4: Analytics & Admin (Week 4)
1. ✅ Analytics dashboard
2. ✅ Usage charts
3. ✅ Admin panel
4. ✅ System monitoring

### Phase 5: Polish & Deploy (Week 5)
1. ✅ Responsive design testing
2. ✅ Accessibility audit
3. ✅ Performance optimization
4. ✅ SEO optimization
5. ✅ PWA setup
6. ✅ Production deployment

---

## 🎨 Design Resources

### Inspiration
- Linear (clean, minimal design)
- Vercel Dashboard (excellent UX)
- Stripe Dashboard (billing/usage)
- Resend (API key management)
- Supabase (admin panel)

### Assets Needed
- Logo (SVG)
- Favicon
- Default podcast cover images
- Illustration for empty states
- Loading animations (Lottie)

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "sonner": "^1.3.0",
    "@stripe/stripe-js": "^2.4.0"
  }
}
```

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables set in Vercel dashboard
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.podnex.com
NEXT_PUBLIC_APP_URL=https://podnex.com
# Dodo Payments (if needed on frontend)
NEXT_PUBLIC_DODO_ENVIRONMENT=live_mode
```

---

## ✅ Launch Checklist

- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] Loading states for all async operations
- [ ] Error boundaries implemented
- [ ] Form validation working
- [ ] Real-time updates working
- [ ] Audio player tested in all browsers
- [ ] Stripe payment flow tested
- [ ] API error handling
- [ ] 404 and error pages styled
- [ ] SEO meta tags added
- [ ] Analytics tracking (Google Analytics/Plausible)
- [ ] Legal pages (Terms, Privacy, Cookies)
- [ ] Help documentation
- [ ] Performance score > 90 (Lighthouse)
- [ ] Accessibility score > 90 (Lighthouse)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

---

**Last Updated:** January 7, 2026
