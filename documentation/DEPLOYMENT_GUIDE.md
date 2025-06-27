# Valkyrie Finance - Deployment Guide

## Overview

This guide covers the complete deployment process for Valkyrie Finance, from local development setup to production deployment and monitoring.

## Prerequisites

Before deploying, ensure you have:

- **Node.js**: Version 18 or higher
- **pnpm**: Version 8+ for package management (replaces bun)
- **PostgreSQL**: Database for production data
- **Vercel Account**: For frontend deployment
- **Railway Account**: For backend deployment (alternative to Vercel)

## Environment Setup

### Production Environment Variables

Create production environment files for each application:

**apps/server/.env.production**:
```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
BETTER_AUTH_SECRET="your-super-secure-32-character-secret"
BETTER_AUTH_URL="https://your-api-domain.com"

# CORS
CORS_ORIGIN="https://your-frontend-domain.com"

# AI Service
GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

**apps/web/.env.production**:
```bash
# API Connection
NEXT_PUBLIC_SERVER_URL="https://your-api-domain.com"

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT="true"
NEXT_PUBLIC_ENABLE_WEB3="false"
```

## Code Quality & Development Tools

### Biome.js Configuration

The project uses Biome.js for linting and formatting across all packages:

```bash
# Lint all packages
pnpm lint

# Format all packages
pnpm format

# Check specific package
cd apps/web && pnpm lint
cd apps/server && pnpm format
```

### Package Management with pnpm

```bash
# Install dependencies (uses pnpm workspaces)
pnpm install

# Add dependency to specific package
pnpm add --filter @valkyrie/web react-query
pnpm add --filter @valkyrie/server fastify

# Remove dependency
pnpm remove --filter @valkyrie/web old-package
```

## Deployment Steps

### 1. Build Preparation

```bash
# Install dependencies with pnpm
pnpm install

# Build shared packages
cd packages/common && pnpm run build
cd ../contracts && pnpm run build
cd ../..

# Generate database migrations
cd apps/server
pnpm db:generate
pnpm db:migrate
cd ../..

# Run linting and formatting
pnpm lint
pnpm format

# Run tests
pnpm test
```

### 2. Frontend Deployment (Vercel)

#### Option A: Automatic Deployment via Git

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Connect your GitHub repository
   - Select the project

2. **Configure Build Settings**:
   ```json
   {
     "framework": "nextjs",
     "rootDirectory": "apps/web",
     "buildCommand": "cd ../.. && pnpm run build:web",
     "outputDirectory": ".next",
     "installCommand": "pnpm install",
     "nodeVersion": "18.x"
   }
   ```

3. **Environment Variables**:
   Add the production environment variables in Vercel dashboard.

4. **Deploy**:
   Push to main branch to trigger automatic deployment.

#### Option B: Manual Deployment

```bash
# From project root
pnpm run build:web
cd apps/web
vercel --prod
```

### 3. Backend Deployment (Railway)

1. **Create Railway Project**:
   ```bash
   railway login
   railway new
   ```

2. **Configure Deployment**:
   ```json
   {
     "buildCommand": "cd ../.. && pnpm run build:server",
     "startCommand": "cd apps/server && pnpm start"
   }
   ```

3. **Set Environment Variables**:
   ```bash
   railway variables set DATABASE_URL="your-postgres-url"
   railway variables set BETTER_AUTH_SECRET="your-secret"
   ```

4. **Deploy and Run Migrations**:
   ```bash
   railway run pnpm db:migrate
   ```

   **Database Studio Access**:
   ```bash
   railway run pnpm db:studio
   ```

## Local Development

For local development setup:

```bash
# Clone repository
git clone <repository-url>
cd valkyrie-finance

# Install dependencies with pnpm
pnpm install

# Setup environment
cp apps/server/.env.example apps/server/.env.local
cp apps/web/.env.example apps/web/.env.local

# Start development servers
pnpm dev

# Available development commands:
pnpm dev:web      # Frontend (http://localhost:3001)
pnpm dev:server   # Backend (http://localhost:3000)
pnpm lint         # Run Biome.js linting
pnpm format       # Run Biome.js formatting
pnpm test         # Run all tests
```

### Development Workflow

```bash
# Before committing
pnpm lint          # Check code quality
pnpm format        # Auto-fix formatting
pnpm test          # Run test suite
pnpm type-check    # TypeScript validation

# Package-specific commands
pnpm --filter @valkyrie/web dev
pnpm --filter @valkyrie/server build
pnpm --filter @valkyrie/contracts test
```

## Database Management

### Migration Workflow

```
