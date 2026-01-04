# Better Auth with Google OAuth - Turborepo Guide

Complete guide for integrating Better Auth with Google sign-in in a Turborepo monorepo with Express backend and Next.js frontend.

## Project Structure
```
my-turborepo/
├── apps/
│   ├── backend/          # Express server
│   └── web/              # Next.js frontend
├── packages/
│   └── database/         # Shared Prisma/database
├── package.json
└── pnpm-workspace.yaml
```

---

## Part 1: Backend Setup (Express)

### 1. Install Dependencies

In your Express app:
```bash
cd apps/backend
pnpm add better-auth better-auth@latest
pnpm add cors dotenv
```

### 2. Environment Variables

Create `apps/backend/.env`:
```bash
# Database (if using Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Better Auth
BETTER_AUTH_SECRET="generate-with: openssl rand -base64 32"
BETTER_AUTH_URL="http://localhost:3001"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

### 3. Configure Database (Using Prisma)

`apps/backend/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime

  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                String   @id
  accountId         String
  providerId        String
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken       String?
  refreshToken      String?
  idToken           String?
  accessTokenExpiresAt DateTime?
  refreshTokenExpiresAt DateTime?
  scope             String?
  password          String?
  createdAt         DateTime
  updatedAt         DateTime
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime
  updatedAt  DateTime
}
```

Run migrations:
```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
```

### 4. Create Better Auth Instance

`apps/backend/src/lib/auth.ts`:
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  baseURL: process.env.BETTER_AUTH_URL,
  
  trustedOrigins: [process.env.FRONTEND_URL!],
  
  emailAndPassword: {
    enabled: true,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### 5. Set Up Express Server

`apps/backend/src/index.ts`:
```typescript
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - MUST come before Better Auth handler
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Better Auth handler - MUST come before express.json()
app.all("/api/auth/*", toNodeHandler(auth));

// Other middleware (after Better Auth)
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
```

**Important**: Set `"type": "module"` in `apps/backend/package.json` (Better Auth requires ESM).

---

## Part 2: Frontend Setup (Next.js)

### 1. Install Dependencies

In your Next.js app:
```bash
cd apps/web
pnpm add better-auth
```

### 2. Environment Variables

Create `apps/web/.env.local`:
```bash
# Backend URL
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
```

### 3. Create Auth Client

`apps/web/lib/auth-client.ts`:
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

### 4. Sign In Page

`apps/web/app/signin/page.tsx`:
```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await authClient.signIn.email({
        email,
        password,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <h1 className="text-2xl font-bold">Sign In</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Sign In with Email
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-300 p-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
```

### 5. Dashboard (Protected Route)

`apps/web/app/dashboard/page.tsx`:
```typescript
"use client";

import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/signin");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <p>Welcome, {session.user.name || session.user.email}!</p>
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-16 h-16 rounded-full mt-2"
          />
        )}
      </div>
      <button
        onClick={handleSignOut}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}
```

---

## Part 3: Google OAuth Configuration

### 1. Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:3001/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**
8. Add them to your backend `.env` file

---

## Running the App

### Start Backend
```bash
cd apps/backend
pnpm dev
```

### Start Frontend
```bash
cd apps/web
pnpm dev
```

### Test the Flow
1. Visit `http://localhost:3000/signin`
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. You'll be redirected to the dashboard

---

## Common Issues & Solutions

**CORS errors**: Ensure `credentials: true` in both Express CORS config and fetch requests.

**Redirect URI mismatch**: Make sure your Google OAuth redirect URI exactly matches `{BETTER_AUTH_URL}/api/auth/callback/google`.

**Session not persisting**: Check that your frontend is sending cookies with `credentials: 'include'`.

**Module errors**: Ensure both backend and frontend have `"type": "module"` in `package.json`.

---

## Next Steps

- Add email verification
- Implement password reset
- Add more OAuth providers (GitHub, Discord)
- Enable 2FA with Better Auth plugins
- Add organization/team management

Refer to [Better Auth docs](https://www.better-auth.com/docs) for advanced features!