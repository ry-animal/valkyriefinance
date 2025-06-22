'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { env } from '@/lib/env';
import { TrpcClient, trpc } from '@/utils/trpc';

// Conditionally import wagmi config only if Web3 is enabled
let wagmiConfig: any = null;
let initializeAppKit: any = null;

if (env.NEXT_PUBLIC_ENABLE_WEB3) {
  const wagmiModule = require('@/lib/wagmi-config');
  wagmiConfig = wagmiModule.wagmiConfig;
  initializeAppKit = wagmiModule.initializeAppKit;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => TrpcClient);

  useEffect(() => {
    // Initialize AppKit after component mounts (only if Web3 is enabled)
    if (env.NEXT_PUBLIC_ENABLE_WEB3 && initializeAppKit) {
      initializeAppKit();
    }
  }, []);

  const content = (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );

  // Conditionally wrap with WagmiProvider only if Web3 is enabled
  if (env.NEXT_PUBLIC_ENABLE_WEB3 && wagmiConfig) {
    return <WagmiProvider config={wagmiConfig}>{content}</WagmiProvider>;
  }

  return content;
}
