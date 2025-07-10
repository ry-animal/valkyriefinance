# Vercel Go AI Engine Deployment Guide

This document covers deployment strategies for the Go AI Engine service, including Vercel deployment options, alternative hosting solutions, and integration with the Next.js applications.

## Overview

The Go AI Engine service can be deployed using several strategies depending on your needs:

1. **Separate Vercel Project** (Recommended)
2. **External Hosting** (Railway, Render, Google Cloud Run)
3. **Vercel Serverless Functions** (Limited functionality)
4. **Hybrid Deployment** (Next.js on Vercel + Go elsewhere)

## Option 1: Separate Vercel Project (Recommended)

Deploy the Go AI Engine as a separate Vercel project for the best performance and isolation.

### Setup Steps

#### 1. Create Separate Vercel Project

```bash
# In apps/ai-engine directory
cd apps/ai-engine

# Create vercel.json specifically for Go service
cat > vercel.json << 'EOF'
{
  "functions": {
    "main.go": {
      "runtime": "go1.x"
    }
  },
  "routes": [
    {
      "src": "/health",
      "dest": "/main.go"
    },
    {
      "src": "/api/(.*)",
      "dest": "/main.go"
    }
  ],
  "env": {
    "CGO_ENABLED": "0",
    "GOOS": "linux",
    "GOARCH": "amd64"
  }
}
EOF

# Deploy to Vercel
vercel --prod
```

#### 2. Environment Variables

Set these in the Vercel dashboard for the Go project:

```bash
# Monitoring
SENTRY_DSN=https://your-dsn@sentry.io/project-id
ENVIRONMENT=production
RELEASE_VERSION=1.0.0

# Service Configuration
PORT=8080
LOG_LEVEL=info

# Health Check Configuration
HEALTH_CHECK_ENABLED=true
PERFORMANCE_MONITORING_ENABLED=true
```

#### 3. Update Next.js Apps to Use Go Service

In your Next.js environment configuration:

```bash
# apps/web/.env.local
NEXT_PUBLIC_AI_ENGINE_URL=https://your-go-project.vercel.app

# apps/server/.env.local
AI_ENGINE_URL=https://your-go-project.vercel.app
```

### Benefits
- ✅ Full Go runtime support
- ✅ Independent scaling
- ✅ Isolated deployments
- ✅ Optimal performance
- ✅ Complete monitoring support

### Drawbacks
- ❌ Requires separate Vercel project
- ❌ Additional configuration needed
- ❌ Cross-origin requests (mitigated with CORS)

## Option 2: External Hosting

Deploy the Go service on dedicated Go hosting platforms for maximum control.

### Railway Deployment

```yaml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[[services]]
name = "ai-engine"
source = "."
```

```bash
# Deploy to Railway
railway login
railway init
railway up
```

### Google Cloud Run

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]
```

```bash
# Deploy to Cloud Run
gcloud run deploy ai-engine \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Render Deployment

```yaml
# render.yaml
services:
  - type: web
    name: ai-engine
    env: go
    buildCommand: go build -o bin/ai-engine main.go
    startCommand: ./bin/ai-engine
    envVars:
      - key: PORT
        value: 8080
      - key: ENVIRONMENT
        value: production
```

### Benefits
- ✅ Full Go environment
- ✅ Long-running processes
- ✅ WebSocket support
- ✅ Custom domains
- ✅ Better resource control

### Drawbacks
- ❌ Additional hosting cost
- ❌ More complex deployment
- ❌ Separate monitoring setup

## Option 3: Vercel Serverless Functions (Limited)

Convert Go endpoints to Vercel serverless functions for simple use cases.

### Implementation

Create individual Go files for each endpoint:

```go
// api/health.go
package handler

import (
    "encoding/json"
    "net/http"
    "time"
)

func Handler(w http.ResponseWriter, r *http.Request) {
    response := map[string]interface{}{
        "status":    "healthy",
        "timestamp": time.Now(),
        "version":   "1.0.0",
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
```

```go
// api/optimize-portfolio.go
package handler

import (
    "encoding/json"
    "net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
    // Simplified portfolio optimization logic
    // Limited by serverless execution time
}
```

### Vercel Configuration

```json
{
  "functions": {
    "api/health.go": {
      "runtime": "go1.x"
    },
    "api/optimize-portfolio.go": {
      "runtime": "go1.x"
    }
  }
}
```

### Benefits
- ✅ Integrated with main Vercel project
- ✅ Automatic scaling
- ✅ No additional hosting costs
- ✅ Simple deployment

### Drawbacks
- ❌ 10-second execution limit
- ❌ Cold start latency
- ❌ Limited memory (1GB)
- ❌ No persistent state
- ❌ Complex AI algorithms may timeout

## Option 4: Hybrid Deployment (Recommended for Production)

Use Next.js on Vercel for web/API and external hosting for Go AI Engine.

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   API Server    │    │   AI Engine     │
│   (Vercel)      │───▶│   (Vercel)      │───▶│   (Railway/GCP) │
│   Next.js       │    │   Next.js       │    │   Go            │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Implementation

#### 1. Deploy Next.js Apps to Vercel

```bash
# From project root
vercel --prod
```

#### 2. Deploy Go Service Separately

```bash
# Deploy to Railway
cd apps/ai-engine
railway login
railway init
railway up

# Or deploy to Google Cloud Run
gcloud run deploy ai-engine --source .
```

#### 3. Configure Service Communication

```typescript
// apps/server/src/lib/ai-client.ts
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8080';

export class AIEngineClient {
  async optimizePortfolio(request: OptimizationRequest) {
    const response = await fetch(`${AI_ENGINE_URL}/api/optimize-portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`AI Engine error: ${response.statusText}`);
    }

    return response.json();
  }

  async healthCheck() {
    const response = await fetch(`${AI_ENGINE_URL}/health`);
    return response.json();
  }
}
```

### Benefits
- ✅ Best of both worlds
- ✅ Optimal performance for each service
- ✅ Independent scaling
- ✅ Full feature support
- ✅ Cost-effective

### Drawbacks
- ❌ More complex architecture
- ❌ Multiple deployment pipelines
- ❌ Network latency between services

## Monitoring Integration

### Health Check Endpoints

All deployment options should expose health check endpoints:

```go
// Health check response format
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": "2h30m15s",
  "system": {
    "go_version": "go1.21.5",
    "memory_mb": 45.2,
    "num_goroutines": 8
  },
  "components": {
    "ai_engine": {"status": "healthy", "latency": 2.5},
    "memory": {"status": "healthy", "latency": 0.1}
  }
}
```

### Uptime Monitoring Configuration

Update monitoring services to check the Go service:

```yaml
# UptimeRobot
monitors:
  - name: "AI Engine Health"
    url: "https://your-go-service.vercel.app/health"
    interval: 300
    expected_status: 200
    expected_content: "healthy"
```

### Sentry Integration

Ensure Sentry is configured for the Go service:

```bash
# Environment variables
SENTRY_DSN=https://your-dsn@sentry.io/project-id
ENVIRONMENT=production
RELEASE_VERSION=1.0.0
```

## Deployment Commands

### Option 1: Separate Vercel Project

```bash
# Deploy Go service
cd apps/ai-engine
vercel --prod

# Deploy Next.js apps
cd ../..
vercel --prod
```

### Option 2: Railway + Vercel

```bash
# Deploy Go service to Railway
cd apps/ai-engine
railway up

# Deploy Next.js to Vercel
cd ../..
vercel --prod
```

### Option 3: Google Cloud Run + Vercel

```bash
# Deploy Go service to Cloud Run
cd apps/ai-engine
gcloud run deploy ai-engine --source .

# Deploy Next.js to Vercel
cd ../..
vercel --prod
```

## Performance Considerations

### Vercel Go Functions
- **Cold Start**: 1-3 seconds
- **Execution Time**: Max 10 seconds
- **Memory**: Max 1GB
- **Concurrent Executions**: Limited

### External Hosting
- **Cold Start**: Minimal (persistent containers)
- **Execution Time**: Unlimited
- **Memory**: Configurable (up to 32GB+)
- **Concurrent Executions**: High

### Network Latency
- **Same Region**: 1-5ms
- **Cross Region**: 50-200ms
- **Mitigation**: Use same region for all services

## Cost Analysis

### Vercel Only
- **Pro Plan**: $20/month per team member
- **Function Executions**: $0.40 per million
- **Bandwidth**: $40 per 100GB

### Hybrid (Vercel + Railway)
- **Vercel**: $20/month
- **Railway**: $5-20/month depending on usage
- **Total**: $25-40/month

### Hybrid (Vercel + Google Cloud Run)
- **Vercel**: $20/month
- **Cloud Run**: $0.40 per million requests + compute
- **Total**: $20-30/month typically

## Recommendation

For **production deployment**, we recommend **Option 4: Hybrid Deployment**:

1. **Deploy Next.js apps to Vercel** for optimal frontend/API performance
2. **Deploy Go AI Engine to Railway or Google Cloud Run** for full Go runtime support
3. **Configure monitoring** for both services
4. **Use environment variables** to connect services
5. **Implement health checks** for both services

This approach provides the best balance of performance, cost, and maintainability while leveraging each platform's strengths.

## Next Steps

1. Choose deployment strategy based on your requirements
2. Set up environment variables and monitoring
3. Configure CI/CD pipelines for automated deployment
4. Test cross-service communication and performance
5. Monitor and optimize based on usage patterns

For detailed monitoring setup, see [GO_SERVICE_MONITORING.md](./GO_SERVICE_MONITORING.md).
