'use client';

import { Toaster, TooltipProvider } from '@valkyrie/ui';
import ClientProviders from '@/components/client-providers';
import { GlobalProgressBar } from '@/components/global-progress-bar';
import { ThemeProvider } from '@/components/theme-provider';

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={['light', 'dark']}
    >
      <ClientProviders>
        <GlobalProgressBar />
        {children}
        <Toaster />
      </ClientProviders>
    </ThemeProvider>
  );
}
