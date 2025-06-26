import { VaultStatusIndicator } from './_components/vault-status-indicator';

export default function VaultPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">VALKYRIE VAULT</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI-POWERED YIELD OPTIMIZATION. ERC-4626 STANDARD. MAXIMUM CAPITAL EFFICIENCY.
        </p>
      </div>

      <div className="grid gap-6">
        <VaultOverview />
        <div className="grid gap-6 md:grid-cols-2">
          <VaultActions />
          <VaultPerformance />
        </div>
        <AIStrategyPanel />
      </div>
    </div>
  );
}

function VaultOverview() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">🏦 Vault Overview</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">$0.00</div>
          <div className="text-sm text-gray-600">Your Balance</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">$2.4M</div>
          <div className="text-sm text-gray-600">Total Locked</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">12.5%</div>
          <div className="text-sm text-gray-600">Current APY</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <VaultStatusIndicator />
        </div>
      </div>
    </div>
  );
}

function VaultActions() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">💎 Vault Actions</h2>
      <div className="space-y-4">
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          DEPOSIT USDC
        </button>
        <button
          type="button"
          className="w-full bg-gray-600 text-white py-3 px-4 rounded font-semibold hover:bg-gray-700 transition-colors"
        >
          WITHDRAW FUNDS
        </button>
        <div className="text-xs text-gray-500 text-center">
          Connect wallet to start earning yield
        </div>
      </div>
    </div>
  );
}

function VaultPerformance() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">📊 Performance Metrics</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span>24h Return:</span>
          <span className="font-semibold text-green-600">+0.34%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>7d Return:</span>
          <span className="font-semibold text-green-600">+2.41%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>30d Return:</span>
          <span className="font-semibold text-green-600">+9.87%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Total Return:</span>
          <span className="font-semibold text-green-600">+24.12%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Sharpe Ratio:</span>
          <span className="font-semibold">2.34</span>
        </div>
      </div>
    </div>
  );
}

function AIStrategyPanel() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">🤖 AI Strategy Engine</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-900">Current Strategy</h3>
          <p className="text-sm text-blue-700 mt-2">Yield Farming + LP Optimization</p>
          <div className="text-xs text-blue-600 mt-2">Allocation: 70% Yield Farming, 30% LP</div>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <h3 className="font-semibold text-green-900">Performance</h3>
          <p className="text-sm text-green-700 mt-2">Above benchmark by +3.2%</p>
          <div className="text-xs text-green-600 mt-2">Risk Score: Low (2.1/10)</div>
        </div>
        <div className="p-4 bg-purple-50 rounded">
          <h3 className="font-semibold text-purple-900">Next Rebalance</h3>
          <p className="text-sm text-purple-700 mt-2">In 4 hours 23 minutes</p>
          <div className="text-xs text-purple-600 mt-2">Triggered by volatility threshold</div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
        <strong>AI Insight:</strong> Current market conditions suggest maintaining aggressive yield
        farming position. Expected rebalance will shift 5% from LP to lending protocols for higher
        risk-adjusted returns.
      </div>
    </div>
  );
}
