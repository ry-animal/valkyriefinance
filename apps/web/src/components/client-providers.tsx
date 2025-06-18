"use client";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { WagmiProvider } from 'wagmi'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { wagmiConfig, initializeAppKit } from '@/lib/wagmi-config'
import { trpc, TrpcClient } from '@/utils/trpc';

export default function ClientProviders({
    children,
}: {
    children: React.ReactNode
}) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() => TrpcClient);

    useEffect(() => {
        // Initialize AppKit after component mounts
        initializeAppKit()
    }, [])

    return (
        <WagmiProvider config={wagmiConfig}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    {children}
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </trpc.Provider>
        </WagmiProvider>
    )
} 