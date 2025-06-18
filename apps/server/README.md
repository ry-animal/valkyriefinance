# Valkyrie Finance Server API

🚀 **tRPC-powered backend API for the Valkyrie Finance platform**

## Overview

The server application provides a type-safe API layer using tRPC, handling authentication, database operations, and AI service integration for the Valkyrie Finance platform.

## Tech Stack

- **Framework**: Next.js 15 (API routes)
- **API Layer**: tRPC v11 with end-to-end type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Wallet-based authentication
- **AI Integration**: Google AI API integration
- **Validation**: Zod schemas for runtime type checking
- **Type Safety**: 100% TypeScript coverage

## Project Structure

```
apps/server/
├── src/
│   ├── routers/           # tRPC route handlers
│   │   ├── auth.ts        # Authentication routes
│   │   ├── todo.ts        # Todo CRUD operations
│   │   ├── ai.ts          # AI service integration
│   │   └── index.ts       # Root router
│   ├── db/                # Database layer
│   │   ├── schema/        # Drizzle schema definitions
│   │   │   ├── auth.ts    # User authentication tables
│   │   │   └── todo.ts    # Todo data tables
│   │   └── index.ts       # Database connection
│   ├── lib/               # Utilities and configurations
│   │   ├── auth.ts        # Better-auth configuration
│   │   ├── trpc.ts        # tRPC setup and context
│   │   └── env.ts         # Environment validation
│   └── types/             # TypeScript definitions
├── drizzle.config.ts      # Drizzle ORM configuration
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- PostgreSQL 14+ (or Docker for local development)
- pnpm (recommended package manager)

### Installation

```bash
# From repository root
cd apps/server

# Install dependencies (or run from root)
pnpm install

# Set up environment variables
cp .env.example .env.local

# Configure your .env.local:
DATABASE_URL=postgresql://username:password@localhost:5432/valkryie_db
GOOGLE_AI_API_KEY=your_google_ai_api_key
BETTER_AUTH_SECRET=your_super_secret_auth_key_here_minimum_32_characters
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001

# Set up database
pnpm run db:push
pnpm run db:seed

# Start development server
pnpm run dev
```

The server will be available at: http://localhost:3000

## API Documentation

### Available Routers

#### Authentication Router (`/auth`)

- `signUp` - Create new user account
- `signIn` - Authenticate user
- `signOut` - End user session
- `getSession` - Get current session

#### Todo Router (`/todo`)

- `getAll` - List all todos for authenticated user
- `create` - Create new todo
- `update` - Update existing todo
- `delete` - Delete todo
- `toggle` - Toggle todo completion status

#### AI Router (`/ai`)

- `chat` - Send message to AI assistant
- `getRecommendations` - Get AI-powered strategy recommendations
- `analyzePortfolio` - AI analysis of user portfolio

### Example Usage

```typescript
// From the web app
import { trpc } from "@/utils/trpc";

// Create a todo
const createTodo = trpc.todo.create.useMutation();
await createTodo.mutate({
  title: "Learn tRPC",
  content: "Build type-safe APIs",
});

// Get AI recommendations
const { data: recommendations } = trpc.ai.getRecommendations.useQuery();
```

## Database Schema

### Core Tables

- **users** - User authentication and profile data
- **accounts** - OAuth account linking
- **sessions** - User session management
- **verificationTokens** - Email verification tokens
- **todos** - Todo items with user relationships

### Migrations

```bash
# Generate new migration
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# Push schema changes (development)
pnpm run db:push

# Open database studio
pnpm run db:studio
```

## Development

### Available Scripts

```bash
# Development server with hot reload
pnpm run dev

# Database operations
pnpm run db:generate    # Generate migration from schema changes
pnpm run db:migrate     # Run pending migrations
pnpm run db:push        # Push schema directly to database
pnpm run db:seed        # Seed database with sample data
pnpm run db:studio      # Open Drizzle Studio

# Testing
pnpm run test           # Run unit tests
pnpm run test:watch     # Run tests in watch mode

# Building
pnpm run build          # Build for production
pnpm run start          # Start production server

# Code quality
pnpm run lint           # Run ESLint
pnpm run type-check     # TypeScript type checking
```

### Adding New Endpoints

1. **Create Router File**:

```typescript
// src/routers/portfolio.ts
import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";

export const portfolioRouter = router({
  getPortfolio: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Implementation
      return await ctx.db.query.portfolios.findFirst({
        where: eq(portfolios.userId, input.userId),
      });
    }),
});
```

2. **Add to Root Router**:

```typescript
// src/routers/index.ts
import { portfolioRouter } from "./portfolio";

export const appRouter = router({
  auth: authRouter,
  todo: todoRouter,
  ai: aiRouter,
  portfolio: portfolioRouter, // Add here
});
```

3. **Update Types**:

```typescript
// The types are automatically inferred
export type AppRouter = typeof appRouter;
```

### Database Schema Changes

1. **Update Schema**:

```typescript
// src/db/schema/portfolio.ts
export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  // ... other fields
});
```

2. **Generate Migration**:

```bash
pnpm run db:generate
```

3. **Apply Migration**:

```bash
pnpm run db:migrate
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/valkryie_db

# Authentication
BETTER_AUTH_SECRET=your_super_secret_auth_key_here_minimum_32_characters
BETTER_AUTH_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3001

# AI Services
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### Optional Variables

```bash
# External APIs
COINGECKO_API_KEY=your_coingecko_api_key
DEFILLAMA_API_KEY=your_defillama_api_key

# Blockchain RPC URLs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_api_key
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/your_api_key
```

## Production Deployment

### Railway Deployment

The server is configured for Railway deployment:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Environment Setup

Set the following environment variables in your production environment:

- All required variables from above
- Production database URL
- Production-grade secrets

### Health Checks

The server includes health check endpoints:

- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Database connectivity check

## Testing

### Unit Tests

```bash
# Run all tests
pnpm run test

# Run specific test file
pnpm run test auth.test.ts

# Run with coverage
pnpm run test --coverage
```

### Integration Tests

```bash
# Test with real database
pnpm run test:integration
```

## API Security

- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Input Validation**: Zod schemas validate all inputs
- **Authentication**: Secure wallet-based authentication
- **CORS**: Configured for secure cross-origin requests
- **Environment**: Secure environment variable handling

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:

   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check network connectivity

2. **Authentication Errors**:

   - Verify BETTER_AUTH_SECRET is set and > 32 characters
   - Check CORS_ORIGIN matches frontend URL

3. **Type Errors**:
   - Run `pnpm run type-check` to identify issues
   - Ensure shared packages are built: `cd ../../packages/common && pnpm run build`

## Related Documentation

- [Main Project README](../../README.md)
- [Frontend Documentation](../web/README.md)
- [Smart Contracts](../../packages/contracts/README.md)
- [Shared Utilities](../../packages/common/README.md)
