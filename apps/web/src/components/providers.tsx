"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WagmiProvider } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { queryClient } from "@/utils/trpc";
import { wagmiConfig } from "@/lib/wagmi-config";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { ErrorBoundary } from "./error-boundary";

export default function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ErrorBoundary>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        <ConnectKitProvider>
                            {children}
                            <ReactQueryDevtools />
                        </ConnectKitProvider>
                    </QueryClientProvider>
                </WagmiProvider>
                <Toaster richColors />
            </ThemeProvider>
        </ErrorBoundary>
    );
} 