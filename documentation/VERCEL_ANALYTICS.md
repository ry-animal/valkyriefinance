# Vercel Analytics Setup Guide

This document provides instructions for configuring Vercel Analytics to monitor the performance of the Valkyrie Finance platform.

## What is Vercel Analytics?

[Vercel Analytics](https://vercel.com/analytics) is a built-in analytics platform that provides insights into your application's performance, user experience, and usage patterns. It includes:

- **Web Vitals**: Core Web Vitals metrics like LCP, FID, CLS, and more
- **Real User Monitoring**: Performance data from actual users
- **Traffic Analysis**: Page views, unique visitors, and geographic distribution
- **Custom Events**: Track specific user interactions and business metrics
- **Speed Insights**: Performance scores and optimization recommendations

## Setup Process

### 1. Enable Vercel Analytics in Project Settings

1. Log in to your [Vercel dashboard](https://vercel.com/)
2. Select the Valkyrie Finance project
3. Navigate to "Settings" > "Analytics"
4. Toggle on "Web Analytics" and "Speed Insights"
5. Select your preferred data retention period

### 2. Install @vercel/analytics Package

```bash
cd apps/web
pnpm add @vercel/analytics
```

### 3. Add Analytics Provider to Web App

```tsx
// apps/web/src/components/providers.tsx
'use client';

import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './theme-provider';
// ... other imports

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Analytics />
    </ThemeProvider>
  );
}
```

### 4. Configure Web Vitals Reporting

```tsx
// apps/web/src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## Advanced Configuration

### 1. Custom Events

Track specific user interactions or business metrics:

```tsx
// apps/web/src/components/swap/cross-chain-swap-form.tsx
'use client';

import { useCallback } from 'react';
import { track } from '@vercel/analytics';

export function CrossChainSwapForm() {
  const handleSwap = useCallback(async (amount: number, fromToken: string, toToken: string) => {
    try {
      // Perform swap logic

      // Track successful swap
      track('swap_completed', {
        amount,
        fromToken,
        toToken,
        timestamp: Date.now()
      });
    } catch (error) {
      // Handle error

      // Track failed swap
      track('swap_failed', {
        amount,
        fromToken,
        toToken,
        error: error.message,
        timestamp: Date.now()
      });
    }
  }, []);

  // Component implementation
}
```

### 2. Custom Dimensions

Add custom dimensions to your analytics data:

```tsx
// apps/web/src/app/layout.tsx
import { AnalyticsProvider } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider
          beforeSend={(event) => {
            // Add custom dimensions to all events
            return {
              ...event,
              appVersion: '1.0.0',
              environment: process.env.NODE_ENV,
            };
          }}
        >
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

### 3. Exclude Specific Routes

Exclude certain routes from analytics tracking:

```tsx
// apps/web/src/components/providers.tsx
<Analytics
  beforeSend={(event) => {
    // Exclude development environment
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Exclude specific routes
    if (event.url.includes('/admin') || event.url.includes('/debug')) {
      return null;
    }

    return event;
  }}
/>
```

### 4. Server-Side Analytics

Track server-side events:

```typescript
// apps/server/src/routers/ai.ts
import { track } from '@vercel/analytics/server';

export const aiRouter = router({
  getRecommendation: publicProcedure
    .input(z.object({ portfolioId: z.string() }))
    .query(async ({ input }) => {
      const startTime = Date.now();
      const result = await aiService.getRecommendation(input.portfolioId);
      const duration = Date.now() - startTime;

      // Track AI recommendation performance
      track('ai_recommendation', {
        portfolioId: input.portfolioId,
        duration,
        resultCount: result.recommendations.length,
      });

      return result;
    }),
});
```

## Viewing Analytics Data

### 1. Analytics Dashboard

Access your analytics data through the Vercel dashboard:

1. Log in to your [Vercel dashboard](https://vercel.com/)
2. Select the Valkyrie Finance project
3. Click on "Analytics" in the top navigation
4. View Web Vitals, page views, and other metrics

### 2. Speed Insights

View detailed performance metrics and recommendations:

1. In the Vercel dashboard, go to "Analytics" > "Speed Insights"
2. Review Core Web Vitals metrics
3. See performance scores by page
4. Get optimization recommendations

### 3. Custom Reports

Create custom reports to track specific metrics:

1. In the Analytics dashboard, click "Create Report"
2. Select the metrics and dimensions you want to include
3. Set the date range and filters
4. Save and share the report

## Integration with Other Monitoring Tools

### 1. Google Analytics Integration

You can use Vercel Analytics alongside Google Analytics:

```tsx
// apps/web/src/components/providers.tsx
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <VercelAnalytics />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    </>
  );
}
```

### 2. Sentry Integration

Combine performance monitoring with error tracking:

```tsx
// apps/web/src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import * as Sentry from '@sentry/nextjs';

// Initialize Sentry performance monitoring
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## Performance Optimization Best Practices

Based on Vercel Analytics data, consider these optimization strategies:

### 1. Image Optimization

Use Next.js Image component with proper sizing and formats:

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero Image"
  width={1200}
  height={600}
  priority
  quality={85}
/>
```

### 2. Font Optimization

Use the Next.js Font system to eliminate layout shift:

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Code Splitting

Use dynamic imports to reduce initial bundle size:

```tsx
import dynamic from 'next/dynamic';

const ComplexChart = dynamic(() => import('@/components/complex-chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,
});
```

### 4. Caching Strategies

Implement effective caching with Next.js:

```typescript
// apps/server/src/app/api/market-data/route.ts
export async function GET() {
  const data = await fetchMarketData();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
    },
  });
}
```

## Additional Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/concepts/analytics)
- [Web Vitals Documentation](https://web.dev/vitals/)
- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Speed Insights Documentation](https://vercel.com/docs/concepts/speed-insights)
- [Custom Events API Reference](https://vercel.com/docs/concepts/analytics/custom-events)
