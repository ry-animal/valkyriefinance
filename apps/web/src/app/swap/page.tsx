'use client';

import { useEffect, useState } from 'react';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function SwapPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton during SSR
  if (!mounted) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="h-12 bg-gray-200 rounded animate-pulse mx-auto w-96"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-128"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">CROSS-CHAIN SWAPS</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          SEAMLESS MULTI-CHAIN TRADING. OPTIMAL ROUTING. ZERO SLIPPAGE.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Swap Interface</h2>
          <p className="text-gray-600 mb-6">
            Advanced cross-chain swap interface coming soon. Trade assets across multiple
            blockchains with optimal routing.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Multi-Chain</h3>
              <p className="text-sm text-gray-600">Support for 10+ chains</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Best Rates</h3>
              <p className="text-sm text-gray-600">Optimal price discovery</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Fast Settlement</h3>
              <p className="text-sm text-gray-600">Sub-minute execution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
