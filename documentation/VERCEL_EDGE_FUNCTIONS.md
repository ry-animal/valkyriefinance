# Vercel Edge Functions Configuration Guide

This document provides instructions for configuring Vercel Edge Functions to optimize the performance of the Valkyrie Finance platform.

## What are Edge Functions?

Vercel Edge Functions allow you to run server-side code at the edge of the network, closer to your users. This results in significantly lower latency compared to traditional serverless functions that run in a single region. Edge Functions are ideal for:

- API routes that need to be globally fast
- Authentication and authorization checks
- Geolocation-based content customization
- A/B testing
- Edge caching and revalidation

## Enabling Edge Functions

### 1. Configure Edge Runtime for API Routes

For Next.js API routes that should run at the edge, add the `runtime` export:

```typescript
// apps/server/src/app/api/health/route.ts
export const runtime = 'edge';

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
```

### 2. Configure Edge Middleware

Create or modify the middleware file to run at the edge:

```typescript
// apps/web/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add caching headers for static assets
  if (request.nextUrl.pathname.match(/\.(jpe?g|png|svg|ico|webp|css|js)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}
```

## Optimizing Edge Functions

### 1. Minimize Dependencies

Edge Functions have size limitations. Keep your dependencies minimal:

- Use lightweight libraries
- Import only what you need with selective imports
- Avoid large dependencies that aren't edge-compatible

### 2. Use Edge-Compatible APIs

Not all Node.js APIs are available at the edge. Use edge-compatible alternatives:

- Use `fetch` instead of Node.js HTTP modules
- Use Web APIs like `crypto.subtle` instead of Node.js `crypto`
- Use `Response` and `Request` objects instead of Express-style handlers

### 3. Implement Edge Caching

Leverage edge caching for improved performance:

```typescript
// apps/server/src/app/api/market-data/route.ts
export const runtime = 'edge';

export async function GET() {
  const data = await fetchMarketData();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
    },
  });
}
```

### 4. Configure Regional Edge Function Deployment

For specific functions that need to run in certain regions:

```typescript
// apps/server/src/app/api/region-specific/route.ts
export const runtime = 'edge';
export const regions = ['iad1', 'sfo1']; // US East and US West

export async function GET() {
  // Function logic here
}
```

## Edge Function Monitoring

### 1. Set Up Function Logs

Monitor your Edge Functions using Vercel's logging:

1. Navigate to your Vercel project dashboard
2. Go to "Functions" tab
3. Click on a specific function to view its logs and performance metrics

### 2. Configure Alerts

Set up alerts for Edge Function performance:

1. In your Vercel project, go to "Settings" > "Alerts"
2. Create alerts for:
   - Execution time exceeding thresholds
   - Error rates
   - Invocation counts

## Edge Function Use Cases for Valkyrie Finance

### 1. Market Data API

Serve real-time market data from the edge for low latency:

```typescript
// apps/server/src/app/api/market-data/route.ts
export const runtime = 'edge';

export async function GET() {
  const prices = await fetchLatestPrices();
  return new Response(JSON.stringify(prices), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    },
  });
}
```

### 2. Geo-Specific Content

Customize content based on user location:

```typescript
// apps/web/src/middleware.ts
export default function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US';

  // Add country to headers for client-side access
  const response = NextResponse.next();
  response.headers.set('x-user-country', country);

  return response;
}
```

### 3. Authentication Edge Middleware

Perform authentication checks at the edge:

```typescript
// apps/web/src/middleware.ts
export default function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;

  // Redirect unauthenticated users trying to access protected routes
  if (!authToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

## Limitations and Considerations

- **Size Limits**: Edge Functions have a size limit (1-4 MB depending on the plan)
- **Execution Time**: Limited to 30 seconds (or less on some plans)
- **Statelessness**: Edge Functions should be stateless
- **API Compatibility**: Not all Node.js APIs are available
- **Database Access**: Direct database connections may not be possible; use HTTP APIs instead

## Additional Resources

- [Vercel Edge Functions Documentation](https://vercel.com/docs/concepts/functions/edge-functions)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Edge Runtime API Reference](https://vercel.com/docs/concepts/functions/edge-functions/edge-runtime)
- [Edge Network Global Map](https://vercel.com/docs/concepts/edge-network/overview)
