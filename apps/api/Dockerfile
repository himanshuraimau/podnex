# syntax=docker/dockerfile:1
FROM node:20-slim AS base

# Install system dependencies: ffmpeg for audio, openssl for Prisma, ca-certs
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@9

WORKDIR /app

# ──────────────────────────────────────────────
# Stage 1: Install ALL workspace dependencies
# ──────────────────────────────────────────────
FROM base AS installer

# Copy workspace manifests first (for layer caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/redis/package.json ./packages/redis/

# Install all deps (including dev, needed for build tools)
RUN pnpm install --frozen-lockfile

# Copy full source
COPY apps/api ./apps/api
COPY packages/database ./packages/database
COPY packages/redis ./packages/redis

# Generate Prisma client
RUN pnpm --filter @repo/database exec prisma generate

# Build the API
RUN pnpm --filter @repo/api build

# ──────────────────────────────────────────────
# Stage 2: Production image (lean, no dev deps)
# ──────────────────────────────────────────────
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy built output and production deps only
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=installer /app/apps/api/dist ./apps/api/dist
COPY --from=installer /app/packages/database ./packages/database
COPY --from=installer /app/packages/redis ./packages/redis

# Copy package manifests (needed by Node module resolution)
COPY --from=installer /app/package.json ./
COPY --from=installer /app/pnpm-workspace.yaml ./
COPY --from=installer /app/apps/api/package.json ./apps/api/

EXPOSE 3001

# Run Prisma migrations then start
CMD ["sh", "-c", "cd apps/api && node dist/index.js"]
