# Valkryie Finance - Deployment Guide

## Overview

This guide covers the complete deployment process for Valkryie Finance, from local development setup to production deployment and monitoring.

## Prerequisites

### Required Software

- **Node.js**: v18+ (recommended: v20+)
- **Bun**: Latest version for package management
- **Git**: For version control
- **PostgreSQL**: v14+ for database
- **Foundry**: For smart contract development

### Required Accounts

- **GitHub**: For code repository and CI/CD
- **Vercel**: For frontend deployment
- **Railway/Render**: For backend deployment
- **Alchemy**: For blockchain RPC endpoints
- **Tenderly**: For smart contract monitoring
- **WalletConnect**: For wallet connection

## Local Development Setup

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/your-org/valkryiefinance.git
cd valkryiefinance

# Install dependencies
bun install

# Setup environment files
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env.local
```

### 2. Database Setup

#### PostgreSQL Installation (macOS)

```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb valkryie_development
```

#### Database Configuration

```bash
# apps/server/.env.local
DATABASE_URL="postgresql://username:password@localhost:5432/valkryie_development"
```

#### Run Migrations

```bash
cd apps/server
bun db:generate
bun db:migrate
```

### 3. Environment Configuration

#### Frontend Environment (apps/web/.env.local)

```bash
# Server URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Web3 Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Network Configuration
NEXT_PUBLIC_DEFAULT_CHAIN=11155111  # Sepolia for development
NEXT_PUBLIC_ENABLE_TESTNETS=true

# Feature Flags
NEXT_PUBLIC_ENABLE_WEB3=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
```

#### Backend Environment (apps/server/.env.local)

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/valkryie_development

# Authentication
BETTER_AUTH_SECRET=your_super_secret_key_minimum_32_characters
BETTER_AUTH_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3001

# External APIs
ALCHEMY_API_KEY=your_alchemy_api_key
TENDERLY_ACCESS_KEY=your_tenderly_access_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### 4. Start Development Servers

```bash
# Start all services
bun dev

# Or start individually
bun dev:web      # Frontend (http://localhost:3001)
bun dev:server   # Backend (http://localhost:3000)
```

## Smart Contract Deployment

### 1. Setup Foundry Project

```bash
cd packages/contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test
```

### 2. Deploy to Testnet

#### Setup Deployment Environment

```bash
# packages/contracts/.env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key
PRIVATE_KEY=your_private_key_for_testnet
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### Deploy Contracts

```bash
# Deploy to Sepolia
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify

# Verify on Etherscan
forge verify-contract <contract_address> <contract_name> --chain sepolia
```

#### Update Contract Addresses

```typescript
// packages/common/src/contracts/addresses.ts
export const CONTRACT_ADDRESSES = {
  11155111: {
    // Sepolia
    valkryieToken: "0x...",
    valkryieVault: "0x...",
  },
  1: {
    // Mainnet (when ready)
    valkryieToken: "0x...",
    valkryieVault: "0x...",
  },
};
```

### 3. Tenderly Integration

#### Setup Monitoring

```bash
# Install Tenderly CLI
npm install -g @tenderly/cli

# Login and setup project
tenderly login
tenderly project init
```

#### Configure Monitoring

```yaml
# tenderly.yaml
account_id: your_account_id
project_slug: valkryie-finance
contracts:
  - name: ValkryieToken
    address: "0x..."
    network_id: 11155111
  - name: ValkryieVault
    address: "0x..."
    network_id: 11155111
```

## Production Deployment

### 1. Frontend Deployment (Vercel)

#### Vercel Project Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Link project
cd apps/web
vercel link
```

#### Environment Variables (Vercel Dashboard)

```bash
# Production environment variables
NEXT_PUBLIC_SERVER_URL=https://your-api-domain.com
NEXT_PUBLIC_ALCHEMY_API_KEY=your_production_alchemy_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_DEFAULT_CHAIN=1  # Mainnet
NEXT_PUBLIC_ENABLE_TESTNETS=false
```

#### Deployment Configuration

```json
// vercel.json
{
  "buildCommand": "cd ../.. && bun run build:web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"]
}
```

### 2. Backend Deployment (Railway)

#### Railway Project Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway new valkryie-api
```

#### Database Setup

```bash
# Add PostgreSQL service
railway add postgresql

# Get database URL
railway run env | grep DATABASE_URL
```

#### Environment Variables

```bash
# Set production environment variables
railway variables set BETTER_AUTH_SECRET=your_production_secret
railway variables set ALCHEMY_API_KEY=your_production_key
railway variables set CORS_ORIGIN=https://your-frontend-domain.com
```

#### Deployment Configuration

```json
// railway.json
{
  "deploy": {
    "buildCommand": "cd ../.. && bun run build:server",
    "startCommand": "cd apps/server && bun start"
  }
}
```

### 3. Database Migration (Production)

```bash
# Run production migrations
railway run bun db:migrate

# Verify database setup
railway run bun db:studio
```

## Monitoring and Observability

### 1. Application Monitoring

#### Error Tracking Setup

```typescript
// apps/web/src/lib/monitoring.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// apps/server/src/lib/monitoring.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

#### Performance Monitoring

```typescript
// apps/web/src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify(metric),
  });
}

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

### 2. Smart Contract Monitoring

#### Tenderly Alerts Configuration

```typescript
// tenderly-alerts.config.js
export const alertConfigs = [
  {
    name: "Large Vault Withdrawal",
    contract: "ValkryieVault",
    event: "Withdraw",
    condition: "amount > 1000000000000000000000", // > 1000 tokens
    notifications: ["email", "slack"],
  },
  {
    name: "Emergency Pause Triggered",
    contract: "ValkryieVault",
    event: "Paused",
    condition: "immediate",
    notifications: ["email", "slack", "sms"],
  },
  {
    name: "High Gas Usage",
    contract: "ValkryieVault",
    function: "deposit",
    condition: "gasUsed > 500000",
    notifications: ["slack"],
  },
];
```

### 3. Health Checks

#### API Health Endpoints

```typescript
// apps/server/src/routers/health.ts
export const healthRouter = router({
  check: publicProcedure.query(async () => {
    const checks = {
      database: await checkDatabase(),
      redis: await checkRedis(),
      externalAPIs: await checkExternalAPIs(),
    };

    const isHealthy = Object.values(checks).every(
      (check) => check.status === "ok"
    );

    return {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks,
    };
  }),
});
```

#### Infrastructure Monitoring

```bash
# Setup monitoring with Uptime Robot or similar
curl -X POST https://api.uptimerobot.com/v2/newMonitor \
  -d "api_key=your_api_key" \
  -d "friendly_name=Valkryie API Health" \
  -d "url=https://your-api-domain.com/api/health" \
  -d "type=1"
```

## Security Checklist

### Pre-Deployment Security

#### Smart Contract Security

- [ ] **Security audit completed** by reputable firm
- [ ] **All tests passing** with 100% coverage
- [ ] **Gas optimization** completed and verified
- [ ] **Access controls** properly implemented
- [ ] **Emergency controls** tested and functional

#### Application Security

- [ ] **Environment variables** properly secured
- [ ] **API rate limiting** configured
- [ ] **CORS policies** properly set
- [ ] **Input validation** on all endpoints
- [ ] **Authentication** properly implemented

#### Infrastructure Security

- [ ] **SSL certificates** configured
- [ ] **Database access** restricted
- [ ] **Firewall rules** configured
- [ ] **Backup strategy** implemented
- [ ] **Monitoring alerts** configured

### Post-Deployment Security

#### Monitoring Setup

- [ ] **Error tracking** active
- [ ] **Performance monitoring** configured
- [ ] **Security alerts** set up
- [ ] **Backup verification** completed
- [ ] **Incident response** plan in place

## Backup and Recovery

### Database Backups

#### Automated Backups

```bash
# Setup automated PostgreSQL backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Upload to cloud storage
aws s3 cp backup_*.sql s3://your-backup-bucket/database/
```

#### Recovery Process

```bash
# Restore from backup
psql $DATABASE_URL < backup_20241201_120000.sql

# Verify data integrity
bun db:validate
```

### Contract Backup

#### State Snapshots

```bash
# Create state snapshot using Foundry
forge inspect ValkryieVault storage-layout > vault_storage_layout.json

# Backup critical state variables
cast call $VAULT_ADDRESS "totalAssets()"
cast call $VAULT_ADDRESS "totalSupply()"
```

## Scaling Considerations

### Performance Optimization

#### Database Scaling

```typescript
// Database connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

#### Caching Strategy

```typescript
// Redis caching implementation
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedData(key: string) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function setCachedData(key: string, data: any, ttl = 300) {
  await redis.setex(key, ttl, JSON.stringify(data));
}
```

#### CDN Configuration

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ["your-cdn-domain.com"],
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
```

## Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool status
SELECT * FROM pg_stat_activity;
```

#### Contract Deployment Issues

```bash
# Check gas price and limits
cast gas-price --rpc-url $RPC_URL

# Verify contract bytecode
forge inspect ValkryieVault bytecode
```

#### Performance Issues

```bash
# Check application metrics
curl https://your-api-domain.com/api/health

# Monitor database performance
SELECT * FROM pg_stat_statements ORDER BY total_time DESC;
```

### Emergency Procedures

#### Contract Emergency

1. **Trigger emergency pause** on affected contracts
2. **Notify users** via all communication channels
3. **Assess the issue** using Tenderly debugging tools
4. **Coordinate fix** with security team
5. **Resume operations** after verification

#### Infrastructure Emergency

1. **Scale up resources** if performance related
2. **Rollback deployment** if caused by recent changes
3. **Enable maintenance mode** if necessary
4. **Communicate status** to users
5. **Monitor recovery** closely

## Maintenance

### Regular Maintenance Tasks

#### Weekly Tasks

- [ ] Review monitoring alerts and logs
- [ ] Check database performance metrics
- [ ] Verify backup integrity
- [ ] Update dependency security scan
- [ ] Review gas usage optimization opportunities

#### Monthly Tasks

- [ ] Security audit of new features
- [ ] Performance optimization review
- [ ] Database maintenance and optimization
- [ ] Update monitoring and alerting rules
- [ ] Review and update documentation

#### Quarterly Tasks

- [ ] Full security audit
- [ ] Disaster recovery testing
- [ ] Infrastructure cost optimization
- [ ] Technology stack updates
- [ ] Business continuity plan review

---

**Last Updated**: December 2024
**Version**: 2.0
**Maintainer**: DevOps Team
