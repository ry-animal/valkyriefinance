"use client";

import ClientProviders from '@/components/client-providers';

export default function ProvidersWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClientProviders>
            {children}
        </ClientProviders>
    );
} 