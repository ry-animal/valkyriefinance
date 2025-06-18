import { LayoutDashboard } from 'lucide-react';
import { Suspense } from 'react';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { DashboardStatsLoading } from '@/components/dashboard/dashboard-stats-loading';
import { VaultDashboard } from '@/components/vault/vault-dashboard';
import { ClientWalletGuard } from '@/components/wallet/client-wallet-guard';
import { getPortfolioStats } from '@/lib/data-access';

// This is now a Server Component (no 'use client')
export default async function DashboardPage() {
  // In a real app, you'd get the user address from session/auth
  // For demo purposes, we'll pass undefined (no wallet connected)
  const portfolioStatsPromise = getPortfolioStats(undefined);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <LayoutDashboard className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Your command center for portfolio overview and quick actions.
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-8">
        {/* Stats Section with Suspense for streaming */}
        <Suspense fallback={<DashboardStatsLoading />}>
          <DashboardStats dataPromise={portfolioStatsPromise} />
        </Suspense>

        {/* Wallet-gated content */}
        <ClientWalletGuard>
          <VaultDashboard />
          {/* We can add more dashboard components here in the future */}
        </ClientWalletGuard>
      </main>
    </div>
  );
}
