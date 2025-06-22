'use client';

import {
  Badge,
  BrutalButton,
  BrutalCard,
  BrutalCardContent,
  BrutalCardDescription,
  BrutalCardFooter,
  BrutalCardHeader,
  BrutalCardTitle,
} from '@valkyrie/ui';
import { Vault } from 'lucide-react';
import { VaultDashboard } from '@/components/vault/vault-dashboard';
import { ClientWalletGuard } from '@/components/wallet/client-wallet-guard';

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <Vault className="h-10 w-10 text-cyan-400" />
            <div>
              <h1 className="text-fluid-hero font-brutal font-black uppercase tracking-wider text-white">
                Valkyrie Vault
              </h1>
              <p className="text-fluid-lg text-gray-300">
                Your central hub for asset management and yield optimization.
              </p>
            </div>
          </div>

          {/* Vault Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <BrutalCard variant="neon" hover="glow">
              <BrutalCardHeader>
                <BrutalCardTitle className="flex items-center justify-between">
                  <span className="text-cyan-400">VALKYRIE/ETH LP</span>
                  <Badge className="bg-liquidity text-white">Active</Badge>
                </BrutalCardTitle>
                <BrutalCardDescription className="text-gray-300">
                  Uniswap V4 Concentrated Liquidity
                </BrutalCardDescription>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Position Value:</span>
                    <span className="font-bold">$23,456.78</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Fees:</span>
                    <span className="text-profit font-bold">+$127.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>APR:</span>
                    <span className="text-yield font-bold">34.2%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-xs text-gray-400">Position utilization: 75%</p>
                </div>
              </BrutalCardContent>
              <BrutalCardFooter className="flex gap-2">
                <BrutalButton variant="neon" size="sm" animation="float">
                  Rebalance
                </BrutalButton>
                <BrutalButton variant="outline" size="sm">
                  Remove
                </BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>

            <BrutalCard variant="gradient" hover="lift">
              <BrutalCardHeader>
                <BrutalCardTitle className="flex items-center justify-between">
                  <span>AI Vault Strategy</span>
                  <Badge className="bg-yield text-white">Optimizing</Badge>
                </BrutalCardTitle>
                <BrutalCardDescription>
                  Multi-protocol yield farming with AI optimization
                </BrutalCardDescription>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Deposited:</span>
                    <span className="font-bold">$67,890.12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Yield:</span>
                    <span className="text-profit font-bold">18.9% APY</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compound (40%)</span>
                      <span className="text-lending">$27,156.05</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Aave (35%)</span>
                      <span className="text-lending">$23,761.54</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Curve (25%)</span>
                      <span className="text-liquidity">$16,972.53</span>
                    </div>
                  </div>
                </div>
              </BrutalCardContent>
              <BrutalCardFooter className="flex gap-2">
                <BrutalButton variant="gradient" size="sm" animation="pulse">
                  Reoptimize
                </BrutalButton>
                <BrutalButton variant="outline" size="sm">
                  Withdraw
                </BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>

            <BrutalCard variant="glass" hover="scale">
              <BrutalCardHeader>
                <BrutalCardTitle>Vault Performance</BrutalCardTitle>
                <BrutalCardDescription>Real-time analytics and metrics</BrutalCardDescription>
              </BrutalCardHeader>
              <BrutalCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total TVL:</span>
                    <span className="font-bold text-cyan-400">$2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Volume:</span>
                    <span className="font-bold">$156,789</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sharpe Ratio:</span>
                    <span className="font-bold text-profit">2.34</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Drawdown:</span>
                    <span className="font-bold text-loss">-3.2%</span>
                  </div>
                </div>
              </BrutalCardContent>
              <BrutalCardFooter>
                <BrutalButton variant="defi" size="sm" animation="glow" className="w-full">
                  View Analytics
                </BrutalButton>
              </BrutalCardFooter>
            </BrutalCard>
          </div>

          {/* Vault Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BrutalButton variant="gradient" animation="glow" className="h-16 flex-col">
              <span className="text-lg font-bold">Deposit</span>
              <span className="text-xs opacity-80">Add liquidity</span>
            </BrutalButton>
            <BrutalButton variant="neon" animation="float" className="h-16 flex-col">
              <span className="text-lg font-bold">Withdraw</span>
              <span className="text-xs opacity-80">Remove funds</span>
            </BrutalButton>
            <BrutalButton variant="defi" animation="pulse" className="h-16 flex-col">
              <span className="text-lg font-bold">Compound</span>
              <span className="text-xs opacity-80">Reinvest rewards</span>
            </BrutalButton>
            <BrutalButton variant="outline" animation="bounce" className="h-16 flex-col">
              <span className="text-lg font-bold">Migrate</span>
              <span className="text-xs opacity-80">Move positions</span>
            </BrutalButton>
          </div>
        </header>

        <main>
          <ClientWalletGuard>
            <VaultDashboard />
          </ClientWalletGuard>
        </main>
      </div>
    </div>
  );
}
