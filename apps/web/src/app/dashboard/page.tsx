export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">PORTFOLIO COMMAND CENTER</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          REAL-TIME ANALYTICS. AI-POWERED INSIGHTS. MAXIMUM YIELD OPTIMIZATION.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <p className="text-gray-600">
            Your comprehensive portfolio dashboard will appear here. Connect your wallet to view
            real-time data.
          </p>
        </div>
      </div>
    </div>
  );
}
