# Valkyrie Finance - Environment Configuration

## 🏗️ Environment Strategy

### Environment Types
- **Development**: Local development + Vercel preview deployments
- **Production**: Live production deployments

### Variable Management
- **Vercel Dashboard**: Environment variables per project
- **Local**: `.env.local` files (gitignored)

## 🔧 Environment Variables by Service

### 🌐 Web App (`valkyriefinance-web`)

#### Development Environment
```bash
# Public variables (exposed to browser)
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_SERVER_URL=https://valkyriefinance-server-git-main.vercel.app
NEXT_PUBLIC_AI_ENGINE_URL=https://valkyriefinance-ai-git-main.vercel.app
NEXT_PUBLIC_REOWN_PROJECT_ID=1a91f40c774bfe7c56b13d36dc0fe7a6
NEXT_PUBLIC_DEFAULT_CHAIN=11155111
NEXT_PUBLIC_ENABLE_TESTNETS=true

# Analytics (development)
NEXT_PUBLIC_POSTHOG_KEY=phc_dev_key_here
```

#### Production Environment
```bash
# Public variables (exposed to browser)
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SERVER_URL=https://valkyriefinance-server.vercel.app
NEXT_PUBLIC_AI_ENGINE_URL=https://valkyriefinance-ai.vercel.app
NEXT_PUBLIC_REOWN_PROJECT_ID=1a91f40c774bfe7c56b13d36dc0fe7a6
NEXT_PUBLIC_DEFAULT_CHAIN=1
NEXT_PUBLIC_ENABLE_TESTNETS=false

# Analytics (production)
NEXT_PUBLIC_POSTHOG_KEY=phc_prod_key_here
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn_here
```

### 🔧 Server App (`valkyriefinance-server`)

#### Development Environment
```bash
NODE_ENV=development
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/valkyrie_dev
POSTGRES_POOL_SIZE=5

# Blockchain RPCs (Testnets)
ETH_RPC_URL=https://eth-sepolia.alchemyapi.io/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mumbai.alchemyapi.io/v2/YOUR_KEY
ARBITRUM_RPC_URL=https://arb-sepolia.alchemyapi.io/v2/YOUR_KEY

# External APIs
ALCHEMY_API_KEY=your_dev_alchemy_key
COINGECKO_API_KEY=your_coingecko_key

# Security (use test keys)
JWT_SECRET=dev_jwt_secret_here
NEXTAUTH_SECRET=dev_nextauth_secret_here
NEXTAUTH_URL=https://valkyriefinance-web-git-main.vercel.app

# AI Engine
AI_ENGINE_URL=https://valkyriefinance-ai-git-main.vercel.app
AI_ENGINE_API_KEY=dev_ai_key_here
```

#### Production Environment
```bash
NODE_ENV=production
LOG_LEVEL=info

# Database (Production Postgres)
DATABASE_URL=postgresql://user:pass@prod-db:5432/valkyrie_prod
POSTGRES_POOL_SIZE=20

# Blockchain RPCs (Mainnets)
ETH_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_PROD_KEY
POLYGON_RPC_URL=https://polygon-mainnet.alchemyapi.io/v2/YOUR_PROD_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.alchemyapi.io/v2/YOUR_PROD_KEY
BASE_RPC_URL=https://base-mainnet.alchemyapi.io/v2/YOUR_PROD_KEY

# External APIs (Production keys)
ALCHEMY_API_KEY=your_prod_alchemy_key
COINGECKO_API_KEY=your_prod_coingecko_key
MORALIS_API_KEY=your_prod_moralis_key

# Security (Strong production secrets)
JWT_SECRET=super_secure_prod_jwt_secret
NEXTAUTH_SECRET=super_secure_prod_nextauth_secret
NEXTAUTH_URL=https://valkyriefinance-web.vercel.app

# AI Engine
AI_ENGINE_URL=https://valkyriefinance-ai.vercel.app
AI_ENGINE_API_KEY=prod_ai_key_here

# Monitoring
SENTRY_DSN=https://your_prod_sentry_dsn
DATADOG_API_KEY=your_datadog_key
```

### 🤖 AI Engine (`valkyriefinance-ai`)

#### Development Environment
```bash
GO_ENV=development
LOG_LEVEL=debug
PORT=8080

# Market Data (Development/Free tiers)
COINBASE_API_KEY=dev_coinbase_key
ALPHA_VANTAGE_API_KEY=dev_alpha_vantage_key
BINANCE_API_KEY=dev_binance_key (testnet)

# AI Services (Development)
OPENAI_API_KEY=your_dev_openai_key
ANTHROPIC_API_KEY=your_dev_anthropic_key

# Cache
REDIS_URL=upstash_redis_dev_url
CACHE_TTL=60
```

#### Production Environment
```bash
GO_ENV=production
LOG_LEVEL=info
PORT=8080

# Market Data (Production/Paid tiers)
COINBASE_API_KEY=prod_coinbase_key
COINBASE_API_SECRET=prod_coinbase_secret
ALPHA_VANTAGE_API_KEY=prod_alpha_vantage_key
BINANCE_API_KEY=prod_binance_key
BINANCE_API_SECRET=prod_binance_secret

# AI Services (Production)
OPENAI_API_KEY=your_prod_openai_key
ANTHROPIC_API_KEY=your_prod_anthropic_key

# Cache
REDIS_URL=upstash_redis_prod_url
CACHE_TTL=300

# Monitoring
SENTRY_DSN=https://your_ai_sentry_dsn
```

## 🚀 Setup Instructions

### 1. Vercel Dashboard Configuration

For each project (`valkyriefinance-web`, `valkyriefinance-server`, `valkyriefinance-ai`):

1. Go to **Settings** > **Environment Variables**
2. Add variables for each environment:
   - **Development**: Used for preview deployments
   - **Production**: Used for production deployments

### 2. Local Development Setup

Create `.env.local` files in each app directory:

```bash
# Create local env files (these are gitignored)
cp docs/env-templates/web.env.example apps/web/.env.local
cp docs/env-templates/server.env.example apps/server/.env.local
cp docs/env-templates/ai-engine.env.example apps/ai-engine/.env.local
```

### 3. Shared Environment Variables

Variables that are the same across multiple services should be managed at the team level in Vercel or use a secret management service.

## 🔒 Security Best Practices

### 1. Secret Rotation
- Rotate API keys every 90 days
- Use different keys for dev/prod
- Monitor usage of all API keys

### 2. Environment Separation
- Never use production keys in development
- Use separate databases for each environment
- Test with minimal data sets

### 3. Access Control
- Limit who can view production environment variables
- Use Vercel team permissions appropriately
- Audit environment variable access regularly

## 🏷️ Environment-Specific URLs

### Development
- Web: `https://valkyriefinance-web-git-{branch}.vercel.app`
- Server: `https://valkyriefinance-server-git-{branch}.vercel.app`
- AI Engine: `https://valkyriefinance-ai-git-{branch}.vercel.app`

### Production
- Web: `https://valkyriefinance-web.vercel.app` (+ custom domain)
- Server: `https://valkyriefinance-server.vercel.app`
- AI Engine: `https://valkyriefinance-ai.vercel.app`

## 📋 Environment Checklist

### Before Production Deploy:
- [ ] All production API keys are valid and have proper rate limits
- [ ] Database is properly configured with backups
- [ ] Monitoring and alerting is set up
- [ ] CORS is configured correctly
- [ ] Security headers are in place
- [ ] Error tracking is enabled
- [ ] Performance monitoring is active
