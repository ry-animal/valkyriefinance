'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
// import { WagmiProvider } from 'wagmi';
// import { initializeAppKit, wagmiConfig } from '@/lib/wagmi-config';
import { TrpcClient, trpc } from '@/utils/trpc';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => TrpcClient);

  // useEffect(() => {
  //   // Initialize AppKit after component mounts
  //   initializeAppKit();
  // }, []);

  return (
    // <WagmiProvider config={wagmiConfig}>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
    // </WagmiProvider>
  );
}
