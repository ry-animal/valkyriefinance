'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { initializeAppKit, wagmiConfig } from '@/lib/wagmi-config';
import { trpc, trpcClient } from '@/utils/trpc';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors
              if (error && typeof error === 'object' && 'status' in error) {
                const status = (error as { status: number }).status;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  useEffect(() => {
    // Initialize AppKit after component mounts
    initializeAppKit();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
          <Analytics />
          <SpeedInsights />
        </QueryClientProvider>
      </trpc.Provider>
    </WagmiProvider>
  );
}
