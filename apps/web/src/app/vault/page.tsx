export default function VaultPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">YIELD VAULT</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI-OPTIMIZED YIELD FARMING. AUTOMATED STRATEGIES. MAXIMUM RETURNS.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Vault Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Value Locked:</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Current APY:</span>
              <span className="font-semibold text-green-600">0.00%</span>
            </div>
            <div className="flex justify-between">
              <span>Your Position:</span>
              <span className="font-semibold">$0.00</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">AI Strategy</h2>
          <p className="text-gray-600 mb-4">
            Our AI continuously optimizes yield farming strategies across multiple protocols to
            maximize returns while managing risk.
          </p>
          <div className="text-sm text-gray-500">
            <p>• Automated rebalancing</p>
            <p>• Risk-adjusted positioning</p>
            <p>• Multi-protocol optimization</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-white shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Vault Interface</h2>
        <p className="text-gray-600">
          Advanced vault management interface coming soon. Deposit, withdraw, and track your yield
          farming performance.
        </p>
      </div>
    </div>
  );
}
