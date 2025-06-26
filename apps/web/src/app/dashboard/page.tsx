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
        <PortfolioOverview />
        <div className="grid gap-6 md:grid-cols-2">
          <StakingOverview />
          <VaultOverview />
        </div>
      </div>
    </div>
  );
}

function PortfolioOverview() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">$0.00</div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">$0.00</div>
          <div className="text-sm text-gray-600">Staked Amount</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">$0.00</div>
          <div className="text-sm text-gray-600">Pending Rewards</div>
        </div>
      </div>
      <PortfolioStatus />
    </div>
  );
}

function StakingOverview() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Staking Overview</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Active Positions:</span>
          <span className="font-semibold">0</span>
        </div>
        <div className="flex justify-between">
          <span>Current APY:</span>
          <span className="font-semibold text-green-600">12.5%</span>
        </div>
        <div className="flex justify-between">
          <span>Total Rewards:</span>
          <span className="font-semibold">$0.00</span>
        </div>
      </div>
    </div>
  );
}

function VaultOverview() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Vault Overview</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Vault Balance:</span>
          <span className="font-semibold">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>Current Yield:</span>
          <span className="font-semibold text-green-600">8.2%</span>
        </div>
        <div className="flex justify-between">
          <span>AI Strategy:</span>
          <span className="font-semibold text-blue-600">Active</span>
        </div>
      </div>
    </div>
  );
}
