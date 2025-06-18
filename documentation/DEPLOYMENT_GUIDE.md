# Valkryie Finance - Deployment Guide

## Overview

This guide covers the complete deployment process for Valkryie Finance, from local development setup to production deployment and monitoring.

## Prerequisites

Before deploying, ensure you have:

- **Node.js**: Version 18 or higher
- **pnpm**: Latest version for package management
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

## Deployment Steps

### 1. Build Preparation

```bash
# Install dependencies
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

# Install dependencies  
pnpm install

# Setup environment
cp apps/server/.env.example apps/server/.env.local
cp apps/web/.env.example apps/web/.env.local

# Start development servers
pnpm dev

# Available development commands:
pnpm dev:web      # Frontend (http://localhost:3001)  
pnpm dev:server   # Backend (http://localhost:3000)
```

## Database Management

### Migration Workflow

```bash
# 1. Make schema changes in apps/server/src/db/schema/
# 2. Generate migration
cd apps/server
pnpm db:generate

# 3. Review generated migration
# 4. Apply to development
pnpm db:migrate

# 5. For production (Railway example)
railway run pnpm db:migrate
```

### Backup and Restore

```bash
# Backup production database
pg_dump $DATABASE_URL > backup.sql

# Restore to development
psql $LOCAL_DATABASE_URL < backup.sql
```

## Monitoring and Maintenance

### Health Checks

Both applications include health check endpoints:

- **Web**: `GET /api/health`
- **Server**: `GET /api/health`

### Performance Monitoring

1. **Vercel Analytics**: Automatic for frontend
2. **Railway Metrics**: Built-in for backend
3. **Database Performance**: Monitor query performance and connection pools

### Error Tracking

Implement error tracking service:

```typescript
// Example: Sentry integration
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

## Security Considerations

### Environment Variables

- Never commit `.env` files to version control
- Use different secrets for each environment
- Rotate secrets regularly

### Database Security

- Use connection pooling for production
- Enable SSL for database connections
- Regular security updates

### API Security

- Implement rate limiting
- Use CORS properly
- Validate all inputs
- Keep dependencies updated

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   ```bash
   # Check TypeScript errors
   pnpm run type-check
   
   # Verify dependencies
   pnpm install
   ```

2. **Database Connection Issues**:
   ```bash
   # Test connection
   pnpm db:validate
   ```

3. **Environment Variable Issues**:
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure values are properly escaped

### Performance Issues

1. **Slow API Responses**:
   - Check database query performance
   - Review N+1 query patterns
   - Implement caching where appropriate

2. **High Memory Usage**:
   - Monitor memory leaks
   - Optimize database connections
   - Review large object handling

## Scaling Considerations

### Horizontal Scaling

- **Frontend**: Automatic with Vercel
- **Backend**: Scale Railway instances
- **Database**: Consider read replicas

### Caching Strategy

- **CDN**: Vercel Edge Network
- **API Caching**: Implement Redis for API responses
- **Database Caching**: Query result caching

### Load Testing

```bash
# Example load testing with Artillery
npm install -g artillery
artillery quick --count 100 --num 10 https://your-api.com/health
```

This deployment guide ensures a robust, scalable production environment for the Valkyrie Finance platform.

---

**Last Updated**: December 2024
**Version**: 2.0
**Maintainer**: DevOps Team
