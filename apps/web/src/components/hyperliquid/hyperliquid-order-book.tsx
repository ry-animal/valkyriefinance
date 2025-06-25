'use client';

import {
  HyperLiquidWebSocket,
  type MarketData,
  type OrderBook,
} from '@valkyrie/common/hyperliquid';
// import { Badge, Card } from '@valkyrie/ui';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderBookProps {
  coin: string;
  className?: string;
}

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export function HyperLiquidOrderBook({ coin, className }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<{
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  }>({ bids: [], asks: [] });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Create mock order book data for now
    const mockBids: OrderBookEntry[] = Array.from({ length: 10 }, (_, i) => {
      const price = 45000 - i * 10;
      const size = Math.random() * 5;
      return {
        price,
        size,
        total: size * (i + 1),
      };
    });

    const mockAsks: OrderBookEntry[] = Array.from({ length: 10 }, (_, i) => {
      const price = 45010 + i * 10;
      const size = Math.random() * 5;
      return {
        price,
        size,
        total: size * (i + 1),
      };
    });

    setOrderBook({ bids: mockBids, asks: mockAsks });
    setIsConnected(true);
    setLastUpdate(new Date());

    // Simulate periodic updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatSize = (size: number) => {
    return size.toFixed(4);
  };

  const getDepthPercentage = (total: number, maxTotal: number) => {
    return Math.max(1, (total / maxTotal) * 100);
  };

  const maxBidTotal = Math.max(...orderBook.bids.map((b) => b.total));
  const maxAskTotal = Math.max(...orderBook.asks.map((a) => a.total));

  return (
    <div className={`p-6 border-4 border-black bg-white ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-brutal font-bold text-xl">Order Book - {coin}</h3>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded border-2 border-black ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {isConnected ? 'Live' : 'Disconnected'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asks (Sell Orders) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <h4 className="font-semibold text-red-600">Asks (Sell)</h4>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 pb-2 border-b">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Total</span>
            </div>

            {orderBook.asks
              .slice(0, 10)
              .reverse()
              .map((ask, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-3 gap-2 text-sm py-1 hover:bg-red-50"
                >
                  <div
                    className="absolute inset-0 bg-red-100 opacity-30"
                    style={{ width: `${getDepthPercentage(ask.total, maxAskTotal)}%` }}
                  />
                  <span className="relative z-10 font-mono text-red-600">
                    {formatPrice(ask.price)}
                  </span>
                  <span className="relative z-10 text-right font-mono">{formatSize(ask.size)}</span>
                  <span className="relative z-10 text-right font-mono text-gray-600">
                    {formatSize(ask.total)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-4 w-4 text-green-500" />
            <h4 className="font-semibold text-green-600">Bids (Buy)</h4>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 pb-2 border-b">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Total</span>
            </div>

            {orderBook.bids.slice(0, 10).map((bid, index) => (
              <div
                key={index}
                className="relative grid grid-cols-3 gap-2 text-sm py-1 hover:bg-green-50"
              >
                <div
                  className="absolute inset-0 bg-green-100 opacity-30"
                  style={{ width: `${getDepthPercentage(bid.total, maxBidTotal)}%` }}
                />
                <span className="relative z-10 font-mono text-green-600">
                  {formatPrice(bid.price)}
                </span>
                <span className="relative z-10 text-right font-mono">{formatSize(bid.size)}</span>
                <span className="relative z-10 text-right font-mono text-gray-600">
                  {formatSize(bid.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t text-center">
        <p className="text-sm text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
