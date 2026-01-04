# Frontend Project Structure

## Directory Organization

```
apps/web/
├── app/
│   ├── page.tsx              # Landing page
│   ├── signin/
│   │   └── page.tsx          # Sign in page
│   ├── signup/
│   │   └── page.tsx          # Sign up page
│   └── dashboard/
│       └── page.tsx          # Protected dashboard
├── lib/
│   ├── index.ts              # Main exports
│   ├── auth-client.ts        # Better Auth client
│   ├── api/
│   │   ├── index.ts          # API exports
│   │   ├── client.ts         # Base API client
│   │   └── health.api.ts     # Health check API
│   └── types/
│       ├── index.ts          # Type exports
│       ├── auth.types.ts     # Auth types
│       └── api.types.ts      # API types
├── components/
├── .env.local                # Environment variables
└── package.json
```

## Key Features

### ✅ Centralized API Client
- Single source of truth for API calls
- Automatic error handling
- Type-safe responses

### ✅ Modular Structure
- Organized by feature/domain
- Clear separation of concerns
- Easy to maintain and extend

### ✅ Type Safety
- TypeScript types for all API responses
- Proper error types
- Type inference

### ✅ Clean Imports
```typescript
// ✅ Good - centralized
import { api, handleApiError } from '@/lib/api';
import { authClient } from '@/lib/auth-client';

// ❌ Bad - scattered
import { authClient } from '@/lib/auth-client';
// Error handling inline everywhere
```

## Usage Examples

### Making API Calls
```typescript
import { api, handleApiError } from '@/lib/api';

async function fetchData() {
  try {
    const data = await api.get('/api/users');
    return data;
  } catch (error) {
    const message = handleApiError(error);
    console.error(message);
  }
}
```

### Using Auth
```typescript
import { authClient, useSession } from '@/lib/auth-client';

function Component() {
  const { data: session } = useSession();
  
  const handleSignOut = async () => {
    await authClient.signOut();
  };
}
```
