# Sentry Integration Guide

This document provides instructions for integrating Sentry error tracking with the Valkyrie Finance platform.

## What is Sentry?

[Sentry](https://sentry.io/) is an error tracking and performance monitoring platform that helps developers identify, triage, and fix errors in real-time. It provides detailed error reports, stack traces, and context to help diagnose and resolve issues quickly.

## Setup Process

### 1. Create a Sentry Account

1. Sign up at [sentry.io](https://sentry.io/)
2. Create a new organization or use an existing one
3. Create a new project for each application:
   - `valkyrie-web` - For the Next.js web application
   - `valkyrie-server` - For the Next.js API server
   - `valkyrie-ai` - For the AI engine

### 2. Install Sentry SDK

#### For Next.js Web App

```bash
cd apps/web
pnpm add @sentry/nextjs
```

#### For Next.js Server

```bash
cd apps/server
pnpm add @sentry/nextjs
```

#### For AI Engine (Go)

```bash
cd apps/ai-engine
go get github.com/getsentry/sentry-go
```

### 3. Configure Sentry for Next.js Apps

Run the Sentry wizard in each Next.js app directory:

```bash
cd apps/web
npx @sentry/wizard@latest -i nextjs
```

```bash
cd apps/server
npx @sentry/wizard@latest -i nextjs
```

This will create the following files:
- `sentry.client.config.js`
- `sentry.server.config.js`
- `sentry.edge.config.js` (if using Edge runtime)

### 4. Configure Environment Variables

Add Sentry environment variables to each app's `.env.local` file:

```
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/project-id
SENTRY_ORG=your-organization
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token
```

Add these to the Vercel project settings as well.

### 5. Update Next.js Configuration

Modify `next.config.js` to include Sentry configuration:

```javascript
// apps/web/next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses source map uploading logs during build
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions
);
```

### 6. Configure Sentry for Go AI Engine

```go
// apps/ai-engine/cmd/main.go
package main

import (
	"log"
	"time"

	"github.com/getsentry/sentry-go"
)

func main() {
	err := sentry.Init(sentry.ClientOptions{
		Dsn: "https://your-sentry-dsn.ingest.sentry.io/project-id",
		// Enable performance monitoring
		EnableTracing: true,
		// Set traces sample rate to capture 10% of transactions
		TracesSampleRate: 0.1,
		Environment: "production",
	})
	if err != nil {
		log.Fatalf("sentry.Init: %s", err)
	}
	defer sentry.Flush(2 * time.Second)

	// Your application code here
}
```

## Error Handling Integration

### 1. Client-Side Error Handling

Update the error boundary component to report errors to Sentry:

```tsx
// apps/web/src/components/error-boundary.tsx
'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Report error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            An unexpected error occurred. Our team has been notified.
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Server-Side Error Handling

Update the tRPC error handling to report errors to Sentry:

```typescript
// apps/server/src/lib/trpc-error.ts
import { TRPCError } from '@trpc/server';
import * as Sentry from '@sentry/nextjs';

export const createTRPCError = (
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR',
  message: string,
  cause?: unknown
) => {
  // Report server errors to Sentry
  if (code === 'INTERNAL_SERVER_ERROR') {
    Sentry.captureException(cause || new Error(message), {
      tags: {
        source: 'trpc',
        errorType: code,
      },
    });
  }

  return new TRPCError({
    code,
    message,
    cause,
  });
};
```

### 3. AI Engine Error Handling

```go
// apps/ai-engine/internal/server/simple_server.go
func handleError(err error, c *gin.Context) {
    // Report error to Sentry
    sentry.CaptureException(err)

    // Return error response
    c.JSON(http.StatusInternalServerError, gin.H{
        "error": err.Error(),
    })
}
```

## Advanced Configuration

### 1. User Context

Add user context to Sentry events:

```typescript
// apps/web/src/app/layout.tsx
import * as Sentry from '@sentry/nextjs';
import { auth } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Set user context if authenticated
  if (session?.user) {
    Sentry.setUser({
      id: session.user.id,
      email: session.user.email,
    });
  } else {
    Sentry.setUser(null);
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 2. Custom Tags and Context

Add custom tags and context to Sentry events:

```typescript
// Example of adding custom context in a component
import * as Sentry from '@sentry/nextjs';

// Set global tags
Sentry.setTags({
  environment: process.env.NODE_ENV,
  version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
});

// Add transaction-specific context
try {
  // Some code that might fail
} catch (error) {
  Sentry.withScope((scope) => {
    scope.setTag('feature', 'portfolio-management');
    scope.setContext('transaction', {
      amount: 1000,
      currency: 'USD',
    });
    Sentry.captureException(error);
  });
}
```

### 3. Performance Monitoring

Enable performance monitoring:

```typescript
// sentry.client.config.js
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2, // Capture 20% of transactions
  profilesSampleRate: 0.1, // Capture 10% of profiles
});
```

### 4. Source Maps

Ensure source maps are uploaded to Sentry for better stack traces:

```javascript
// next.config.js
const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sourcemaps: {
    assets: './**/*.map',
  },
};
```

## Testing Sentry Integration

### 1. Test Client-Side Error Reporting

Create a test component that triggers an error:

```tsx
// apps/web/src/app/debug/sentry-test/page.tsx
'use client';

import { Button } from '@/components/ui/button';

export default function SentryTestPage() {
  const triggerError = () => {
    throw new Error('This is a test error for Sentry');
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Sentry Test Page</h1>
      <Button onClick={triggerError}>Trigger Error</Button>
    </div>
  );
}
```

### 2. Test Server-Side Error Reporting

Create a test API route that triggers an error:

```typescript
// apps/server/src/app/api/debug/sentry-test/route.ts
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    throw new Error('This is a test server error for Sentry');
  } catch (error) {
    Sentry.captureException(error);
    return new Response('Error reported to Sentry', { status: 500 });
  }
}
```

## Vercel Integration

Sentry integrates with Vercel to provide error tracking directly from the Vercel dashboard:

1. In the Sentry dashboard, go to Settings > Integrations
2. Find and enable the Vercel integration
3. Follow the prompts to connect your Vercel account
4. Select the projects you want to monitor

## Additional Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js SDK Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Go SDK Documentation](https://docs.sentry.io/platforms/go/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Vercel Integration](https://docs.sentry.io/product/integrations/deployment/vercel/)

## Go AI Engine Integration

The Go AI Engine service includes comprehensive Sentry integration with custom error tracking and performance monitoring.

### Installation

The Go service uses the official Sentry Go SDK:

```bash
# Already included in go.mod
go get github.com/getsentry/sentry-go
```

### Configuration

The Go service automatically initializes Sentry on startup using environment variables:

```go
// Initialize Sentry monitoring first
if err := monitoring.InitializeSentry(); err != nil {
    log.Printf("Warning: Failed to initialize Sentry: %v", err)
} else {
    // Ensure Sentry is properly flushed on exit
    defer monitoring.Close()
}
```

### Environment Variables

Add these to your Go service environment:

```bash
# Sentry Configuration for Go AI Engine
SENTRY_DSN=https://your-dsn@sentry.io/project-id
ENVIRONMENT=production
RELEASE_VERSION=1.0.0
```

### Error Tracking

The Go service captures errors with rich context:

```go
monitoring.CaptureError(err, map[string]string{
    "component": "data_collector",
    "error_type": "startup_failure",
}, map[string]interface{}{
    "port": port,
    "additional_context": "value",
})
```

### Performance Monitoring

Performance tracking for critical operations:

```go
transaction := monitoring.StartTransaction("optimize_portfolio", "ai_processing")
defer transaction.Finish()

// AI processing code here
```

### Health Check Integration

The Go service health checks include Sentry error reporting:

```go
if err := json.NewEncoder(w).Encode(health); err != nil {
    monitoring.CaptureError(err, map[string]string{
        "endpoint": "health",
        "error_type": "json_encoding",
    }, map[string]interface{}{
        "request_uri": r.RequestURI,
    })
}
```

### Service-Specific Tags

All Go service events are tagged with:

- `component`: Specific component (ai-engine, data-collector, etc.)
- `language`: "go"
- `service`: "ai-engine"
- `operation`: Operation being performed

This allows for easy filtering and analysis in Sentry dashboards.

### Monitoring Best Practices

1. **Initialize Early**: Sentry is initialized before any other service components
2. **Graceful Degradation**: Service continues to function if Sentry initialization fails
3. **Context-Rich Errors**: All errors include component and operation context
4. **Performance Tracking**: Critical AI operations are tracked for performance
5. **Proper Cleanup**: Sentry is properly flushed on service shutdown

For detailed Go service monitoring configuration, see [GO_SERVICE_MONITORING.md](./GO_SERVICE_MONITORING.md).
