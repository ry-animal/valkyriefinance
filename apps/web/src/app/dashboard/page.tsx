import {
  Badge,
  BrutalButton,
  BrutalCard,
  BrutalCardContent,
  BrutalCardFooter,
  BrutalCardHeader,
  BrutalCardTitle,
} from '@valkyrie/ui';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <LayoutDashboard className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-fluid-hero font-brutal font-black uppercase tracking-wider text-black dark:text-white">
                Dashboard
              </h1>
              <p className="text-fluid-lg text-muted-foreground">
                Your command center for portfolio overview and quick actions.
              </p>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <BrutalButton variant="gradient" animation="glow" className="h-20 flex-col">
              <div className="text-2xl mb-1">💰</div>
              <span className="text-sm">Swap</span>
            </BrutalButton>
            <BrutalButton variant="neon" animation="float" className="h-20 flex-col">
              <div className="text-2xl mb-1">🏦</div>
              <span className="text-sm">Lend</span>
            </BrutalButton>
            <BrutalButton variant="defi" animation="pulse" className="h-20 flex-col">
              <div className="text-2xl mb-1">🥩</div>
              <span className="text-sm">Stake</span>
            </BrutalButton>
            <BrutalButton variant="outline" animation="bounce" className="h-20 flex-col">
              <div className="text-2xl mb-1">🌊</div>
              <span className="text-sm">Pool</span>
            </BrutalButton>
            <BrutalButton variant="gradient" animation="wiggle" className="h-20 flex-col">
              <div className="text-2xl mb-1">🤖</div>
              <span className="text-sm">AI Vault</span>
            </BrutalButton>
            <BrutalButton variant="neon" animation="rubber" className="h-20 flex-col">
              <div className="text-2xl mb-1">🗳️</div>
              <span className="text-sm">Vote</span>
            </BrutalButton>
          </div>
        </header>

        <main className="space-y-8">
          {/* Enhanced Portfolio Overview */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BrutalCard variant="neon" hover="glow" className="h-full">
              <BrutalCardHeader>
                <BrutalCardTitle className="text-cyan-400">Total Portfolio</BrutalCardTitle>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="text-3xl font-bold text-profit mb-2">$125,432.67</div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-profit text-white">+12.5%</Badge>
                  <span className="text-sm text-gray-300">+$13,890.45</span>
                </div>
              </BrutalCardContent>
            </BrutalCard>

            <BrutalCard variant="gradient" hover="lift" className="h-full">
              <BrutalCardHeader>
                <BrutalCardTitle>Staking Rewards</BrutalCardTitle>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="text-2xl font-bold text-staking mb-2">1,567.89 VALKYRIE</div>
                <div className="text-sm text-muted-foreground">APY: 24.7%</div>
              </BrutalCardContent>
              <BrutalCardFooter>
                <BrutalButton variant="defi" size="sm" animation="pulse">
                  Claim Rewards
                </BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>

            <BrutalCard variant="default" hover="scale" className="h-full">
              <BrutalCardHeader>
                <BrutalCardTitle>Liquidity Pools</BrutalCardTitle>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="text-2xl font-bold text-liquidity mb-2">$45,678.90</div>
                <div className="text-sm text-muted-foreground">3 Active Pools</div>
              </BrutalCardContent>
              <BrutalCardFooter>
                <BrutalButton variant="outline" size="sm" animation="hover">
                  Manage
                </BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>

            <BrutalCard variant="glass" hover="bounce" className="h-full">
              <BrutalCardHeader>
                <BrutalCardTitle>AI Yield</BrutalCardTitle>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="text-2xl font-bold text-yield mb-2">18.9% APY</div>
                <div className="text-sm text-muted-foreground">Auto-optimized</div>
              </BrutalCardContent>
              <BrutalCardFooter>
                <BrutalButton variant="gradient" size="sm" animation="glow">
                  Optimize
                </BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>
          </section>

          {/* Stats Section with Suspense for streaming */}
          <Suspense fallback={<DashboardStatsLoading />}>
            <DashboardStats dataPromise={portfolioStatsPromise} />
          </Suspense>

          {/* Wallet-gated content */}
          <ClientWalletGuard>
            <VaultDashboard />

            {/* Enhanced Market Overview */}
            <section>
              <h2 className="text-fluid-2xl font-bold mb-6 text-foreground">Market Overview</h2>
              <BrutalCard variant="glass" hover="scale">
                <BrutalCardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">$2,456.78</div>
                      <div className="text-sm text-muted-foreground">ETH Price</div>
                      <Badge className="bg-profit text-white mt-1">+2.4%</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">$89.45</div>
                      <div className="text-sm text-muted-foreground">VALKYRIE Price</div>
                      <Badge className="bg-profit text-white mt-1">+8.7%</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">$2.4B</div>
                      <div className="text-sm text-muted-foreground">Total TVL</div>
                      <Badge className="bg-neutral text-white mt-1">+0.2%</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">23.5%</div>
                      <div className="text-sm text-muted-foreground">Avg APY</div>
                      <Badge className="bg-profit text-white mt-1">+1.2%</Badge>
                    </div>
                  </div>
                </BrutalCardContent>
              </BrutalCard>
            </section>
          </ClientWalletGuard>
        </main>
      </div>
    </div>
  );
}
