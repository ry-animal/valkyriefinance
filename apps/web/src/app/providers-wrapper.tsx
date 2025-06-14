"use client";

import ClientProviders from '@/components/client-providers';
import { ThemeProvider } from '@/components/theme-provider';

export default function ProvidersWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            themes={['light', 'dark']}
        >
            <ClientProviders>
                {children}
            </ClientProviders>
        </ThemeProvider>
    );
} 