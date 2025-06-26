'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function PortfolioOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Sample portfolio data - in real app this would come from user's actual portfolio
  const samplePortfolio = {
    totalValue: '10000',
    assets: [
      { symbol: 'ETH', balance: '3.5', valueUsd: '7000', percentage: 70 },
      { symbol: 'BTC', balance: '0.1', valueUsd: '2000', percentage: 20 },
      { symbol: 'USDC', balance: '1000', valueUsd: '1000', percentage: 10 },
    ],
    chainDistribution: {
      ethereum: '8000',
      arbitrum: '2000',
    },
  };

  const optimizeMutation = trpc.ai.optimizePortfolioAdvanced.useMutation({
    onSuccess: (data) => {
      setIsOptimizing(false);
      console.log('Optimization result:', data);
    },
    onError: (error) => {
      setIsOptimizing(false);
      console.error('Optimization error:', error);
    },
  });

  const handleOptimize = () => {
    setIsOptimizing(true);
    optimizeMutation.mutate(samplePortfolio);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Portfolio Optimizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Portfolio Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Current Portfolio</h4>
          <div className="space-y-1 text-sm">
            {samplePortfolio.assets.map((asset) => (
              <div key={asset.symbol} className="flex justify-between">
                <span>{asset.symbol}</span>
                <span>{asset.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Button */}
        <Button
          type="button"
          onClick={handleOptimize}
          disabled={isOptimizing || optimizeMutation.isPending}
          className="w-full"
        >
          {isOptimizing || optimizeMutation.isPending ? 'Optimizing...' : 'Optimize Portfolio'}
        </Button>

        {/* Optimization Results */}
        {optimizeMutation.data && (
          <div className="space-y-3 p-3 bg-gray-50 rounded">
            <h4 className="text-sm font-medium text-green-700">🎯 AI Recommendations</h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Expected Return:</span>
                <span className="font-bold text-green-600">
                  {(optimizeMutation.data.optimization.expectedReturn * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between">
                <span>Risk Score:</span>
                <span className="font-bold">
                  {optimizeMutation.data.optimization.risk.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Confidence:</span>
                <span className="font-bold text-blue-600">
                  {(optimizeMutation.data.optimization.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-medium">Recommended Actions:</h5>
              <div className="text-xs text-gray-600">
                {optimizeMutation.data.recommendations.slice(0, 3).map((rec: string) => (
                  <div key={rec}>• {rec}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {optimizeMutation.error && (
          <div className="text-sm text-red-600 p-3 bg-red-50 rounded">
            AI optimization unavailable. Check if AI engine is running.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
