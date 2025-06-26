'use client';

import { HyperLiquidClient } from '@valkyrie/common/hyperliquid';
// import { Badge, Button, Card } from '@valkyrie/ui';
import { RotateCcw, TrendingDown, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface MarketDataProps {
  className?: string;
}

interface SimpleMarketData {
  coin: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  openInterest: number;
}

export function HyperLiquidMarketData({ className }: MarketDataProps) {
  const [marketData, setMarketData] = useState<SimpleMarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const client = new HyperLiquidClient();
      const allMids = await client.getAllMids();

      // Get BTC price from the response
      const btcPrice = allMids.BTC ? parseFloat(allMids.BTC) : 0;

      // Create mock data structure for now - will be replaced with real API calls
      const data: SimpleMarketData = {
        coin: 'BTC',
        price: btcPrice,
        change24h: Math.random() * 10 - 5, // Mock data
        volume24h: Math.random() * 1000000000,
        high24h: btcPrice * (1 + Math.random() * 0.1),
        low24h: btcPrice * (1 - Math.random() * 0.1),
        openInterest: Math.random() * 500000000,
      };

      setMarketData(data);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatPercentage = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  if (error) {
    return (
      <div className={`p-6 border-4 border-red-500 bg-red-50 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-brutal font-bold text-lg">Market Data Error</h3>
          <button
            type="button"
            onClick={fetchMarketData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white border-2 border-black hover:bg-red-600 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className={`p-6 border-4 border-black bg-white ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-brutal font-bold text-xl">BTC Market Data</h3>
        <button
          type="button"
          onClick={fetchMarketData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black hover:bg-gray-800 disabled:opacity-50"
        >
          <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : marketData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Current Price</p>
            <p className="text-2xl font-bold">{formatPrice(marketData.price)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">24h Change</p>
            <div className="text-lg font-semibold">{formatPercentage(marketData.change24h)}</div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Volume</p>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
              }).format(marketData.volume24h)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">High 24h</p>
            <p className="text-lg font-semibold">{formatPrice(marketData.high24h)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Low 24h</p>
            <p className="text-lg font-semibold">{formatPrice(marketData.low24h)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Open Interest</p>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
              }).format(marketData.openInterest)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No market data available</p>
      )}
    </div>
  );
}
