import { ValkyrieTokenInfo } from '@/components/wallet/valkyrie-token-info';
import { WalletStatus } from '@/components/wallet/wallet-status';
import { PortfolioStatus } from './_components/portfolio-status';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">DASHBOARD</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI-POWERED PORTFOLIO MANAGEMENT. REAL-TIME ANALYTICS. MAXIMUM PERFORMANCE.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <PortfolioOverview />
          <Web3Status />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <StakingOverview />
          <ValkyrieTokenInfo />
        </div>
      </div>
    </div>
  );
}

function PortfolioOverview() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Value</span>
          <span className="font-bold">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">24h Change</span>
          <span className="font-bold text-green-600">+0.00%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Active Strategies</span>
          <span className="font-bold">0</span>
        </div>
      </div>

      <PortfolioStatus />
    </div>
  );
}

function Web3Status() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
      <WalletStatus />
    </div>
  );
}

function StakingOverview() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Staking Overview</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Staked VLK</span>
          <span className="font-bold">0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pending Rewards</span>
          <span className="font-bold text-green-600">0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">APY</span>
          <span className="font-bold">0.00%</span>
        </div>
      </div>
    </div>
  );
}
