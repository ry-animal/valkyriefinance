'use client';

import { trpc } from '@/utils/trpc';

export function AIStatus() {
  const healthCheck = trpc.healthCheck.useQuery();
  const marketIndicators = trpc.ai.getMarketIndicators.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="space-y-4">
      {/* AI Engine Connection Status */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">AI Engine:</span>
        <div className="text-lg font-bold text-green-600">
          {healthCheck.isLoading ? '...' : healthCheck.data ? '🟢 ONLINE' : '🔴 OFFLINE'}
        </div>
      </div>

      {/* Market Indicators */}
      {marketIndicators.data && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Fear & Greed Index:</span>
            <span className="font-bold">{marketIndicators.data.fearGreedIndex}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Market Volatility:</span>
            <span className="font-bold">
              {(marketIndicators.data.volatility * 100).toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">BTC Dominance:</span>
            <span className="font-bold">{marketIndicators.data.btcDominance.toFixed(1)}%</span>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            Last Update: {new Date(marketIndicators.data.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}

      {marketIndicators.isLoading && (
        <div className="text-sm text-muted-foreground">Loading market data...</div>
      )}

      {marketIndicators.error && (
        <div className="text-sm text-red-600">Market data unavailable</div>
      )}
    </div>
  );
}
