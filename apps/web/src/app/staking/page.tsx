import { TestTRPCConnection } from './_components/test-trpc-connection';

export default function StakingPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">STAKING CENTER</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          STAKE VLK TOKENS. EARN REWARDS. PARTICIPATE IN GOVERNANCE. MAXIMIZE YIELDS.
        </p>
      </div>

      <TestTRPCConnection />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Staking Components</h2>
          <p className="text-gray-600">
            Staking interface components will be displayed here once the Web3 integration is
            complete.
          </p>
        </div>

        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Analytics</h2>
          <p className="text-gray-600">
            Real-time portfolio and staking analytics will be shown here.
          </p>
        </div>
      </div>
    </div>
  );
}
