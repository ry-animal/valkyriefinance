# Valkyrie Finance Server API

🚀 **tRPC-powered backend API for the Valkyrie Finance platform**

## Overview

The server application provides a type-safe API layer using tRPC, handling authentication, database operations, **AI service integration**, and **comprehensive DeFi functionality** for the Valkyrie Finance platform.

## 🚀 **Live Features**

### ✅ **Complete API Coverage**
- **Authentication**: Wallet-based authentication with Better Auth
- **AI Integration**: Real-time AI portfolio optimization and market analysis
- **Portfolio Management**: Comprehensive portfolio tracking and analytics
- **Vault Operations**: ERC-4626 vault management and tracking
- **Staking**: Token staking and rewards management
- **Analytics**: Advanced analytics and performance metrics
- **Bridge Integration**: Cross-chain bridge operations
- **Governance**: Token governance and voting systems

### ✅ **Production Ready**
- **Performance**: Sub-100ms API response times
- **Database**: PostgreSQL with Drizzle ORM and optimized queries
- **Security**: Input validation, rate limiting, and error handling
- **Type Safety**: 100% TypeScript coverage with tRPC
- **Monitoring**: Health checks and performance monitoring

## Tech Stack

- **Framework**: Next.js 15 (API routes)
- **API Layer**: tRPC v11 with end-to-end type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with wallet integration
- **AI Integration**: Direct integration with Go AI engine
- **Package Manager**: pnpm with workspace optimization
- **Code Quality**: Biome.js for superior linting and formatting
- **Validation**: Zod schemas for runtime type checking
- **Type Safety**: 100% TypeScript coverage
- **Caching**: Redis integration for performance optimization
- **Rate Limiting**: Built-in rate limiting and CORS protection

## Project Structure

```
apps/server/
├── src/
│   ├── routers/           # tRPC route handlers
│   │   ├── auth.ts        # Authentication routes
│   │   ├── ai.ts          # AI service integration
│   │   ├── portfolio.ts   # Portfolio management
│   │   ├── vault.ts       # Vault operations
│   │   ├── staking.ts     # Token staking
│   │   ├── analytics.ts   # Analytics and metrics
│   │   ├── bridge.ts      # Cross-chain bridge
│   │   ├── governance.ts  # Governance operations
│   │   ├── wallet.ts      # Wallet management
│   │   ├── admin.ts       # Admin operations
│   │   ├── health.ts      # Health checks
│   │   └── index.ts       # Root router
│   ├── db/                # Database layer
│   │   ├── schema/        # Drizzle schema definitions
│   │   │   ├── auth.ts    # User authentication tables
│   │   │   ├── portfolio.ts # Portfolio tracking
│   │   │   ├── staking.ts   # Staking operations
│   │   │   ├── analytics.ts # Analytics data
│   │   │   └── vault.ts     # Vault tracking
│   │   ├── queries/       # Optimized database queries
│   │   ├── migrations/    # Database migrations
│   │   └── index.ts       # Database connection
│   ├── lib/               # Utilities and configurations
│   │   ├── auth.ts        # Better-auth configuration
│   │   ├── trpc.ts        # tRPC setup and context
│   │   ├── env.ts         # Environment validation
│   │   ├── cache.ts       # Redis caching layer
│   │   ├── performance.ts # Performance monitoring
│   │   └── trpc-error.ts  # Error handling utilities
│   ├── middleware/        # Custom middleware
│   │   └── rate-limit.ts  # Rate limiting
│   └── types/             # TypeScript definitions
├── drizzle.config.ts      # Drizzle ORM configuration
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- PostgreSQL 14+ (or Docker for local development)
- Redis (optional, for caching)
- pnpm (recommended package manager)
- Go AI engine running on port 8080

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
REDIS_URL=redis://localhost:6379  # Optional

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
- `signIn` - Authenticate user with wallet
- `signOut` - End user session
- `getSession` - Get current session
- `refreshToken` - Refresh authentication token

#### AI Router (`/ai`)
- `getMarketStatus` - Real-time market indicators (Fear & Greed, volatility)
- `optimizePortfolio` - AI-powered portfolio optimization
- `analyzeRisk` - Risk assessment and scoring
- `getRecommendations` - Strategy recommendations
- `getMarketPredictions` - Market trend predictions

#### Portfolio Router (`/portfolio`)
- `getPortfolio` - Get user portfolio
- `getPerformance` - Portfolio performance metrics
- `getHistory` - Portfolio history and transactions
- `updateAllocation` - Update portfolio allocation
- `rebalance` - Portfolio rebalancing

#### Vault Router (`/vault`)
- `getVaultInfo` - Vault information and metrics
- `deposit` - Deposit assets to vault
- `withdraw` - Withdraw assets from vault
- `getShares` - User vault shares
- `getStrategies` - Active vault strategies
- `getPerformance` - Vault performance history

#### Staking Router (`/staking`)
- `stake` - Stake tokens
- `unstake` - Unstake tokens
- `getStakes` - User staking positions
- `getRewards` - Staking rewards
- `claimRewards` - Claim staking rewards

#### Analytics Router (`/analytics`)
- `getDashboardMetrics` - Dashboard analytics
- `getPerformanceMetrics` - Performance analytics
- `getMarketMetrics` - Market analytics
- `getUserMetrics` - User-specific metrics

#### Bridge Router (`/bridge`)
- `getSupportedChains` - Supported blockchain networks
- `getQuote` - Cross-chain bridge quote
- `initiateBridge` - Start bridge transaction
- `getTransactionStatus` - Bridge transaction status

#### Governance Router (`/governance`)
- `getProposals` - Active governance proposals
- `vote` - Vote on proposals
- `createProposal` - Create new proposal
- `getVotingPower` - User voting power

#### Health Router (`/health`)
- `check` - Health check endpoint
- `metrics` - Performance metrics
- `status` - System status

### Example Usage

```typescript
// From the web app
import { trpc } from "@/utils/trpc";

// AI portfolio optimization
const optimizePortfolio = trpc.ai.optimizePortfolio.useMutation();
await optimizePortfolio.mutate({
  portfolio: [
    { symbol: "ETH", allocation: 0.6 },
    { symbol: "BTC", allocation: 0.4 }
  ],
  riskTolerance: 0.5
});

// Vault operations
const depositToVault = trpc.vault.deposit.useMutation();
await depositToVault.mutate({
  amount: "1000",
  vaultAddress: "0x..."
});

// Get real-time market data
const { data: marketStatus } = trpc.ai.getMarketStatus.useQuery();
console.log(`Fear & Greed Index: ${marketStatus?.fearGreedIndex}`);
```

## Database Schema

### Core Tables

#### Authentication & Users
- **users** - User authentication and profile data
- **accounts** - OAuth account linking
- **sessions** - User session management
- **verificationTokens** - Email verification tokens

#### Portfolio & Trading
- **portfolios** - User portfolio compositions
- **transactions** - Transaction history and tracking
- **positions** - Current trading positions
- **performance** - Portfolio performance metrics

#### Staking & Rewards
- **stakes** - User staking positions
- **rewards** - Staking rewards tracking
- **staking_periods** - Staking period configurations

#### Analytics & Metrics
- **analytics_events** - User analytics events
- **performance_snapshots** - Daily performance snapshots
- **market_data** - Historical market data cache

#### Vault Operations
- **vault_deposits** - Vault deposit tracking
- **vault_withdrawals** - Vault withdrawal history
- **vault_strategies** - Active vault strategies
- **vault_performance** - Vault performance tracking

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

## AI Integration

### **Market Data Integration**
The server integrates with the Go AI engine for real-time market analysis:

```typescript
// AI service integration
const marketData = await fetch('http://localhost:8080/market-data')
  .then(res => res.json());

return {
  fearGreedIndex: marketData.fearGreedIndex,
  volatility: marketData.volatility,
  btcDominance: marketData.btcDominance,
  recommendations: marketData.aiRecommendations
};
```

### **Portfolio Optimization**
AI-powered portfolio optimization with real-time analysis:

```typescript
// Portfolio optimization endpoint
export const optimizePortfolio = publicProcedure
  .input(portfolioOptimizationSchema)
  .mutation(async ({ input }) => {
    const aiResponse = await fetch('http://localhost:8080/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    return aiResponse.json();
  });
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
pnpm run test:e2e       # Run integration tests

# Building
pnpm run build          # Build for production
pnpm run start          # Start production server

# Code quality
pnpm run lint           # Run Biome linting
pnpm run type-check     # TypeScript type checking
```

### Adding New Endpoints

1. **Create Router File**:

```typescript
// src/routers/feature.ts
import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";

export const featureRouter = router({
  getFeature: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.features.findFirst({
        where: eq(features.id, input.id),
      });
    }),
});
```

2. **Add to Root Router**:

```typescript
// src/routers/index.ts
import { featureRouter } from "./feature";

export const appRouter = router({
  // ... existing routers
  feature: featureRouter,
});
```

3. **Update Types**:

```typescript
// src/types/router.ts
export type AppRouter = typeof appRouter;
```

## Performance Optimization

### **Caching Strategy**
```typescript
// Redis caching for frequent queries
import { redis } from '@/lib/redis';

const getCachedData = async (key: string) => {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFromDatabase();
  await redis.setex(key, 300, JSON.stringify(data)); // 5 min cache
  return data;
};
```

### **Query Optimization**
```typescript
// Optimized database queries with proper indexing
const getPortfolioWithPerformance = await db
  .select()
  .from(portfolios)
  .innerJoin(performance, eq(portfolios.id, performance.portfolioId))
  .where(eq(portfolios.userId, userId))
  .orderBy(desc(performance.timestamp))
  .limit(100);
```

### **Rate Limiting**
```typescript
// Built-in rate limiting
import { rateLimit } from '@/middleware/rate-limit';

export const expensiveOperation = publicProcedure
  .use(rateLimit({ max: 10, windowMs: 60000 })) // 10 requests per minute
  .mutation(async ({ input }) => {
    // Expensive operation
  });
```

## Security

### **Input Validation**
All inputs are validated using Zod schemas:

```typescript
const portfolioSchema = z.object({
  assets: z.array(z.object({
    symbol: z.string().min(1).max(10),
    allocation: z.number().min(0).max(1)
  })),
  riskTolerance: z.number().min(0).max(1)
});
```

### **Authentication**
Wallet-based authentication with Better Auth:

```typescript
// Protected procedure requiring authentication
export const protectedProcedure = publicProcedure
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({ ctx: { ...ctx, user: ctx.session.user } });
  });
```

### **Error Handling**
Comprehensive error handling with structured logging:

```typescript
import { createTRPCError } from '@/lib/trpc-error';

try {
  // Database operation
} catch (error) {
  throw createTRPCError('INTERNAL_SERVER_ERROR', 'Database operation failed');
}
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `BETTER_AUTH_SECRET` | Auth secret (min 32 chars) | `your-super-secret-key-here` |
| `BETTER_AUTH_URL` | Auth service URL | `http://localhost:3000` |
| `CORS_ORIGIN` | Frontend origin for CORS | `http://localhost:3001` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection string | None (memory cache) |
| `GOOGLE_AI_API_KEY` | Google AI API key | None |
| `LOG_LEVEL` | Logging level | `info` |
| `PORT` | Server port | `3000` |

## Deployment

### **Production Configuration**
```bash
# Production environment variables
DATABASE_URL=postgresql://user:pass@prod-db:5432/valkyrie
BETTER_AUTH_SECRET=production-secret-min-32-chars
BETTER_AUTH_URL=https://api.valkyrie.finance
CORS_ORIGIN=https://valkyrie.finance
REDIS_URL=redis://prod-redis:6379
NODE_ENV=production
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Health Checks**
Built-in health check endpoint for monitoring:

```bash
curl http://localhost:3000/api/trpc/health.check
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": { "status": "up", "latency": 5 },
    "redis": { "status": "up", "latency": 2 },
    "ai_engine": { "status": "up", "latency": 15 }
  }
}
```

## Monitoring & Analytics

### **Performance Metrics**
- API response times
- Database query performance
- Cache hit rates
- AI service response times

### **Error Tracking**
- Structured error logging
- Error rate monitoring
- Performance degradation alerts

### **Usage Analytics**
- API endpoint usage
- User activity tracking
- Performance optimization insights

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/api-enhancement`)
3. Make your changes with tests
4. Ensure all tests pass (`pnpm test`)
5. Commit changes (`git commit -m 'Add API enhancement'`)
6. Push to branch (`git push origin feature/api-enhancement`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
