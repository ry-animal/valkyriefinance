'use client';

import { useEffect, useState } from 'react';
// import { MarketIndicators } from './_components/market-indicators';
// import { PortfolioOptimization } from './_components/portfolio-optimization';
// import { RiskAssessment } from './_components/risk-assessment';
// import { TokenAnalysis } from './_components/token-analysis';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function AIAnalyticsPage() {
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
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">AI ANALYTICS CENTER</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          ADVANCED AI-POWERED INSIGHTS. REAL-TIME MARKET ANALYSIS. STRATEGIC PORTFOLIO OPTIMIZATION.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* <MarketIndicators />
        <TokenAnalysis />
        <PortfolioOptimization />
        <RiskAssessment /> */}

        <div className="border rounded-lg bg-white shadow p-6">
          <h2 className="text-xl font-semibold mb-4">AI Analytics Components</h2>
          <p className="text-gray-600">
            Advanced AI analytics components will be displayed here once the system is fully
            initialized.
          </p>
        </div>
      </div>
    </div>
  );
}
