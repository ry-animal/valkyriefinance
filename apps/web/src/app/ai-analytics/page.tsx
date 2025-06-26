import { AIStatus } from './_components/ai-status';

export default function AIAnalyticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">AI ANALYTICS CENTER</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          ADVANCED AI-POWERED INSIGHTS. REAL-TIME MARKET ANALYSIS. STRATEGIC PORTFOLIO OPTIMIZATION.
        </p>
      </div>

      <div className="grid gap-6">
        <AIHealthStatus />
        <div className="grid gap-6 md:grid-cols-2">
          <MarketInsights />
          <PortfolioOptimization />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <RiskAnalysis />
          <YieldPredictions />
          <TokenAnalysis />
        </div>
      </div>
    </div>
  );
}

function AIHealthStatus() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">🤖 AI Engine Status</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="text-center p-4 bg-gray-50 rounded">
          <AIStatus />
          <div className="text-sm text-gray-600">AI Engine</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-lg font-bold">95.2%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-lg font-bold">24/7</div>
          <div className="text-sm text-gray-600">Monitoring</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-lg font-bold">∞</div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
      </div>
    </div>
  );
}

function MarketInsights() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">📊 Market Insights</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span>Market Sentiment:</span>
          <span className="font-semibold text-green-600">🔥 BULLISH</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Volatility Index:</span>
          <span className="font-semibold">23.4</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Trend Prediction:</span>
          <span className="font-semibold text-blue-600">📈 UPWARD</span>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
          <strong>AI Insight:</strong> Current market conditions favor yield farming strategies with
          reduced impermanent loss risk.
        </div>
      </div>
    </div>
  );
}

function PortfolioOptimization() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold mb-4">⚡ Portfolio Optimization</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span>Optimization Score:</span>
          <span className="font-semibold text-green-600">87/100</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Suggested Actions:</span>
          <span className="font-semibold">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Yield Potential:</span>
          <span className="font-semibold text-green-600">+12.5%</span>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded text-sm">
          <strong>Recommendation:</strong> Increase staking allocation by 15% for optimal
          yield-to-risk ratio.
        </div>
      </div>
    </div>
  );
}

function RiskAnalysis() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-lg font-semibold mb-4">🛡️ Risk Analysis</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Smart Contract:</span>
          <span className="text-green-600 font-semibold">LOW</span>
        </div>
        <div className="flex justify-between">
          <span>Liquidity:</span>
          <span className="text-yellow-600 font-semibold">MEDIUM</span>
        </div>
        <div className="flex justify-between">
          <span>Market:</span>
          <span className="text-green-600 font-semibold">LOW</span>
        </div>
      </div>
    </div>
  );
}

function YieldPredictions() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-lg font-semibold mb-4">📈 Yield Predictions</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>7-Day:</span>
          <span className="font-semibold">8.2%</span>
        </div>
        <div className="flex justify-between">
          <span>30-Day:</span>
          <span className="font-semibold">12.5%</span>
        </div>
        <div className="flex justify-between">
          <span>90-Day:</span>
          <span className="font-semibold">15.8%</span>
        </div>
      </div>
    </div>
  );
}

function TokenAnalysis() {
  return (
    <div className="border rounded-lg bg-white shadow p-6">
      <h2 className="text-lg font-semibold mb-4">🪙 Token Analysis</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>VLK Score:</span>
          <span className="font-semibold text-green-600">A+</span>
        </div>
        <div className="flex justify-between">
          <span>Growth Potential:</span>
          <span className="font-semibold">HIGH</span>
        </div>
        <div className="flex justify-between">
          <span>Stability:</span>
          <span className="font-semibold">STABLE</span>
        </div>
      </div>
    </div>
  );
}
