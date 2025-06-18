'use client';

import { PageHeader } from '@/components/ui/layout';
import { ClientWalletGuard } from '@/components/wallet/client-wallet-guard';
import { MarketIndicators } from './_components/market-indicators';
import { PortfolioOptimization } from './_components/portfolio-optimization';
import { RiskAssessment } from './_components/risk-assessment';
import { TokenAnalysis } from './_components/token-analysis';

// TODO: Create and import these components
// import { PortfolioOptimization } from './_components/portfolio-optimization';

export default function AIAnalyticsPage() {
  return (
    <ClientWalletGuard>
      <div className="container mx-auto py-8">
        <PageHeader
          title="AI-Powered Market Analytics"
          description="Leverage advanced AI to get real-time market insights, portfolio analysis, and strategic recommendations."
        />

        <div className="space-y-6 mt-8">
          <MarketIndicators />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TokenAnalysis />
            </div>

            <div>
              <RiskAssessment />
            </div>
          </div>

          <PortfolioOptimization />
        </div>
      </div>
    </ClientWalletGuard>
  );
}
