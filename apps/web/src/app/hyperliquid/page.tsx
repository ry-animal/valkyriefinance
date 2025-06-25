'use client';

import { useEffect, useState } from 'react';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function HyperliquidPage() {
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
        <h1 className="text-6xl font-black uppercase tracking-tighter">HYPERLIQUID TRADING</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          PROFESSIONAL DERIVATIVES TRADING. MAXIMUM LEVERAGE. ZERO SLIPPAGE.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trading Interface</h2>
          <p className="text-gray-600">
            Advanced Hyperliquid trading interface coming soon. Experience institutional-grade
            derivatives trading.
          </p>
        </div>
      </div>
    </div>
  );
}
