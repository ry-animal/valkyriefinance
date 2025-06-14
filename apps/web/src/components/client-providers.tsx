"use client";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useEffect } from 'react'

import { queryClient, wagmiConfig, initializeAppKit } from '@/lib/wagmi-config'

export default function ClientProviders({
    children,
}: {
    children: React.ReactNode
}) {
    useEffect(() => {
        // Initialize AppKit after component mounts
        initializeAppKit()
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
                {children}
                <ReactQueryDevtools />
            </WagmiProvider>
        </QueryClientProvider>
    )
} 