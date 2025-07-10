# Uptime Monitoring Setup Guide

This document provides instructions for configuring uptime monitoring for critical endpoints of the Valkyrie Finance platform.

## What is Uptime Monitoring?

Uptime monitoring continuously checks your application's endpoints to ensure they are responsive and functioning correctly. It alerts you when an endpoint becomes unavailable or returns unexpected responses, allowing you to quickly identify and resolve issues before they significantly impact users.

## Monitoring Services

We'll set up uptime monitoring using multiple services for redundancy:

1. **Vercel Monitoring**: Built-in monitoring through Vercel
2. **UptimeRobot**: Free tier for basic monitoring
3. **Better Stack**: More comprehensive monitoring with better alerts
4. **Datadog**: Enterprise-grade monitoring (optional)

## Critical Endpoints to Monitor

The following endpoints are critical for the Valkyrie Finance platform and should be monitored:

1. **Web Application**: `https://valkyriefinance.com`
2. **API Server**: `https://api.valkyriefinance.com`
3. **Health Check Endpoint**: `https://api.valkyriefinance.com/api/health`
4. **AI Engine**: `https://ai.valkyriefinance.com/api/health`
5. **Authentication Service**: `https://api.valkyriefinance.com/api/auth/session`

## Setup Process

### 1. Create Health Check Endpoints

First, let's create dedicated health check endpoints for each service:

#### API Server Health Check

```typescript
// apps/server/src/app/api/health/route.ts
import { db } from '@/db';

export const runtime = 'edge';

export async function GET() {
  const start = Date.now();

  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);
    const dbLatency = Date.now() - start;

    // Check AI service connection
    const aiResponse = await fetch('https://ai.valkyriefinance.com/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }, // No caching
    });

    const aiStatus = aiResponse.ok ? 'up' : 'down';

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
      checks: {
        database: { status: 'up', latency: dbLatency },
        ai: { status: aiStatus },
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);

    return Response.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
```

#### AI Engine Health Check

```go
// apps/ai-engine/api/health.go
package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthHandler returns the health status of the AI engine
func HealthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"version":   os.Getenv("VERSION"),
		"checks": gin.H{
			"model":    "loaded",
			"database": "connected",
		},
	})
}
```

## Go AI Engine Service

The Go AI Engine service provides a comprehensive health check endpoint specifically designed for uptime monitoring.

### Health Check Endpoint

**URL**: `https://your-domain.com/health` (or `http://localhost:8080/health` for development)

**Method**: GET

**Response**: Detailed health information with appropriate HTTP status codes

### Status Codes

- **200 OK**: Service is healthy
- **200 OK** (with degraded status): Service is functional but degraded
- **503 Service Unavailable**: Service is unhealthy

### Example Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": "2h30m15s",
  "system": {
    "go_version": "go1.21.5",
    "num_goroutines": 8,
    "memory_mb": 45.2,
    "num_cpu": 8
  },
  "components": {
    "ai_engine": {
      "status": "healthy",
      "latency": 2.5,
      "last_check": "2024-01-15T10:30:00Z"
    },
    "data_collector": {
      "status": "healthy",
      "latency": 1.8,
      "last_check": "2024-01-15T10:30:00Z"
    },
    "memory": {
      "status": "healthy",
      "latency": 0.1,
      "last_check": "2024-01-15T10:30:00Z"
    }
  }
}
```

### UptimeRobot Configuration

Add the Go AI Engine to UptimeRobot monitoring:

1. **Monitor Type**: HTTP(s)
2. **URL**: `https://your-ai-domain.vercel.app/health`
3. **Monitoring Interval**: 5 minutes
4. **HTTP Method**: GET
5. **Expected Status Code**: 200
6. **Expected Content**: `"healthy"`
7. **Timeout**: 30 seconds

### Better Stack Configuration

```yaml
monitors:
  - name: "AI Engine Health Check"
    url: "https://your-ai-domain.vercel.app/health"
    method: "GET"
    interval: 300  # 5 minutes
    timeout: 30
    expected_status: 200
    expected_content: "healthy"
    tags:
      - "ai-engine"
      - "go-service"
      - "critical"
```

### Datadog Synthetic Test

```json
{
  "name": "AI Engine Health Check",
  "type": "api",
  "subtype": "http",
  "config": {
    "request": {
      "method": "GET",
      "url": "https://your-ai-domain.vercel.app/health",
      "timeout": 30
    },
    "assertions": [
      {
        "type": "statusCode",
        "operator": "is",
        "target": 200
      },
      {
        "type": "body",
        "operator": "contains",
        "target": "healthy"
      },
      {
        "type": "responseTime",
        "operator": "lessThan",
        "target": 5000
      }
    ]
  },
  "options": {
    "tick_every": 300,
    "follow_redirects": true
  },
  "locations": ["aws:us-east-1", "aws:eu-west-1"],
  "tags": ["ai-engine", "health-check"]
}
```

### Component Health Monitoring

The Go service monitors individual components:

- **AI Engine**: Performance metrics and error rates
- **Data Collector**: Market data collection status
- **Memory**: Memory usage monitoring
- **System**: Overall system health

### Alert Configuration

Set up alerts based on:

1. **Service Down**: Health check returns 503 or fails to respond
2. **Degraded Performance**: Health check shows "degraded" status
3. **High Response Time**: Health check takes >5 seconds
4. **Component Failures**: Individual components report unhealthy status

### Monitoring Best Practices

1. **Check Frequency**: Monitor every 5 minutes for production services
2. **Timeout**: Set reasonable timeouts (30 seconds) to avoid false positives
3. **Expected Content**: Validate specific content ("healthy") not just status codes
4. **Multi-Location**: Monitor from multiple geographic locations
5. **Alert Thresholds**: Require 2+ consecutive failures before alerting

### 2. Set Up Vercel Monitoring

1. Log in to your [Vercel dashboard](https://vercel.com/)
2. Select the Valkyrie Finance project
3. Navigate to "Settings" > "Monitoring"
4. Click "Add Endpoint"
5. Configure each endpoint:
   - URL: `https://api.valkyriefinance.com/api/health`
   - Method: `GET`
   - Expected Status: `200`
   - Check Frequency: `1 minute`
   - Regions: Select multiple regions
   - Alerts: Configure email and Slack notifications
6. Repeat for all critical endpoints

### 3. Set Up UptimeRobot

1. Sign up for a free account at [UptimeRobot](https://uptimerobot.com/)
2. Click "Add New Monitor"
3. Configure each monitor:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Valkyrie API Health`
   - URL: `https://api.valkyriefinance.com/api/health`
   - Monitoring Interval: `5 minutes`
   - Monitor Timeout: `30 seconds`
   - HTTP Method: `GET`
   - Alert Contacts: Add your team's email addresses and Slack webhook
4. Repeat for all critical endpoints
5. Set up status page (optional):
   - Go to "Status Pages"
   - Click "Add New Status Page"
   - Configure and customize your public status page

### 4. Set Up Better Stack (Formerly Logtail)

1. Sign up for an account at [Better Stack](https://betterstack.com/)
2. Navigate to "Uptime" > "Monitors"
3. Click "Add Monitor"
4. Configure each monitor:
   - Name: `Valkyrie API Health`
   - URL: `https://api.valkyriefinance.com/api/health`
   - Check Frequency: `1 minute`
   - Regions: Select multiple regions
   - Expected Status Code: `200`
   - Expected Response: Configure JSON response validation
   - Alerts: Set up alert policies
5. Repeat for all critical endpoints
6. Create a public status page:
   - Go to "Status Pages"
   - Click "Create Status Page"
   - Configure and customize your status page

### 5. Set Up Datadog Monitoring (Optional - Enterprise)

1. Sign up for a Datadog account
2. Install the Datadog agent on your infrastructure
3. Navigate to "Synthetics" > "Tests"
4. Click "New Test" > "API Test"
5. Configure each test:
   - Name: `Valkyrie API Health`
   - URL: `https://api.valkyriefinance.com/api/health`
   - Request Type: `GET`
   - Locations: Select multiple regions
   - Frequency: `1 minute`
   - Response Validation: Configure assertions for status code and response body
   - Notifications: Configure alert notifications
6. Repeat for all critical endpoints

## Advanced Monitoring Configuration

### 1. Custom Response Validation

Configure monitors to validate the response content, not just the status code:

#### UptimeRobot

In the "Advanced" section, enable "Check for keyword" and enter:
```
"status":"healthy"
```

#### Better Stack

Add a response validation rule:
```
$.status == "healthy"
```

#### Datadog

Add an assertion:
```
jsonpath "$.status" == "healthy"
```

### 2. Multi-Region Monitoring

Configure monitors to check from multiple geographic regions to detect regional outages:

- North America (US East, US West)
- Europe (London, Frankfurt)
- Asia (Singapore, Tokyo)
- Australia (Sydney)

### 3. Integrated Alerting

Set up a comprehensive alerting system that integrates with your team's communication tools:

#### Slack Integration

1. Create a dedicated #alerts channel in Slack
2. Set up incoming webhooks for each monitoring service
3. Configure alert formatting for clarity

Example Slack alert configuration for Better Stack:
```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚨 {monitor.name} is {monitor.status}"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*URL:* {monitor.url}"
        },
        {
          "type": "mrkdwn",
          "text": "*Status:* {monitor.status}"
        },
        {
          "type": "mrkdwn",
          "text": "*Response Time:* {monitor.response_time}ms"
        },
        {
          "type": "mrkdwn",
          "text": "*Region:* {monitor.region}"
        }
      ]
    }
  ]
}
```

#### PagerDuty Integration

For critical production alerts:

1. Set up a PagerDuty service
2. Configure on-call schedules
3. Integrate with your monitoring services
4. Set up escalation policies

### 4. Status Page

Create a public status page to keep users informed about system status:

1. Use Better Stack's status page feature
2. Configure components:
   - Web Application
   - API Server
   - AI Engine
   - Authentication Service
3. Set up custom domain: `status.valkyriefinance.com`
4. Configure incident templates for common issues

## Monitoring Dashboard

Create a comprehensive monitoring dashboard that aggregates data from all services:

### 1. Vercel Dashboard

- Real-time deployment status
- Function invocations
- Error rates
- Performance metrics

### 2. Custom Dashboard (Datadog or Grafana)

- System-wide health status
- Response times by endpoint
- Error rates by service
- Geographic distribution of requests
- User impact metrics

## Incident Response Plan

Establish a clear incident response plan for when monitoring alerts are triggered:

### 1. Alert Levels

- **P1 (Critical)**: Main application or API is down
- **P2 (High)**: Significant degradation in service
- **P3 (Medium)**: Non-critical service degradation
- **P4 (Low)**: Minor issues with minimal impact

### 2. Response Procedures

1. **Acknowledge**: Confirm receipt of alert
2. **Investigate**: Determine root cause
3. **Communicate**: Update status page and notify stakeholders
4. **Mitigate**: Implement temporary fix if possible
5. **Resolve**: Deploy permanent solution
6. **Review**: Conduct post-mortem analysis

### 3. Runbooks

Create runbooks for common issues:

- Database connectivity issues
- API timeouts
- Authentication service failures
- AI engine errors

## Additional Resources

- [Vercel Monitoring Documentation](https://vercel.com/docs/concepts/observability/monitoring)
- [UptimeRobot Documentation](https://uptimerobot.com/help/)
- [Better Stack Documentation](https://betterstack.com/docs/uptime)
- [Datadog Synthetics Documentation](https://docs.datadoghq.com/synthetics/)
- [PagerDuty Integration Guide](https://www.pagerduty.com/docs/guides/vercel-integration-guide/)
