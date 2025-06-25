'use client';

import { useEffect, useState } from 'react';
// import { DashboardStats } from '@/components/dashboard/dashboard-stats';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// This is now a Client Component
export default function DashboardPage() {
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
        <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">PORTFOLIO COMMAND CENTER</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          REAL-TIME ANALYTICS. AI-POWERED INSIGHTS. MAXIMUM YIELD OPTIMIZATION.
        </p>
      </div>

      {/* <DashboardStats /> */}

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
