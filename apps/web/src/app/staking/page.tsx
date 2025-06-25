'use client';

import { useEffect, useState } from 'react';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function StakingPage() {
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
        <h1 className="text-6xl font-black uppercase tracking-tighter">STAKING VAULT</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          LIQUID STAKING. MAXIMUM REWARDS. ZERO LOCKUP PERIODS.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Liquid Staking</h2>
          <p className="text-gray-600 mb-4">
            Stake your tokens and receive liquid staking derivatives that can be used across DeFi
            while earning rewards.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current APY:</span>
              <span className="font-semibold">12.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Staked:</span>
              <span className="font-semibold">$0.00</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Locked Staking</h2>
          <p className="text-gray-600 mb-4">
            Lock your tokens for higher rewards. Choose from multiple lock periods for optimized
            returns.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>30 Day Lock APY:</span>
              <span className="font-semibold">15.2%</span>
            </div>
            <div className="flex justify-between">
              <span>90 Day Lock APY:</span>
              <span className="font-semibold">18.7%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-white shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Staking Interface</h2>
        <p className="text-gray-600">
          Advanced staking interface coming soon. Stake, unstake, and manage your positions with
          ease.
        </p>
      </div>
    </div>
  );
}
