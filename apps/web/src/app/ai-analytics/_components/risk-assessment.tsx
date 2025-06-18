'use client';

import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/utils/trpc';

// Mock portfolio data - in a real app, this would come from a user store or API
const MOCK_PORTFOLIO = {
  totalValue: '12500.00',
  assets: [
    { symbol: 'BTC', balance: '0.1', valueUsd: '4074.21', percentage: 32.59 },
    { symbol: 'ETH', balance: '2.5', valueUsd: '6094.01', percentage: 48.75 },
    { symbol: 'LINK', balance: '150', valueUsd: '2331.78', percentage: 18.66 },
  ],
  chainDistribution: { Ethereum: '12500.00' },
};

type RiskData = NonNullable<
  Awaited<ReturnType<typeof trpc.ai.assessPortfolioRisk.useMutation>>['data']
>;

export function RiskAssessment() {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const riskMutation = trpc.ai.assessPortfolioRisk.useMutation({
    onSuccess: setRiskData,
  });

  const handleAssessRisk = () => {
    riskMutation.mutate(MOCK_PORTFOLIO);
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'High':
        return <ShieldAlert className="h-10 w-10 text-destructive" />;
      case 'Medium':
        return <Shield className="h-10 w-10 text-yellow-500" />;
      case 'Low':
        return <ShieldCheck className="h-10 w-10 text-green-500" />;
      default:
        return <Shield size={40} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Portfolio Risk Assessment</CardTitle>
        <CardDescription>Get an AI-powered risk analysis of your portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        {!riskData && !riskMutation.isPending && (
          <Button onClick={handleAssessRisk} className="w-full">
            Assess My Portfolio Risk
          </Button>
        )}

        {riskMutation.isPending && <RiskSkeleton />}

        {riskMutation.isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertTriangle size={16} />
            <p className="text-sm font-medium">{riskMutation.error.message}</p>
          </div>
        )}

        {riskData && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
              {getRiskIcon(riskData.riskLevel)}
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p className="text-2xl font-bold">{riskData.riskLevel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">{riskData.riskScore}/10</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Warnings:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {riskData.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {riskData.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <Button onClick={handleAssessRisk} className="w-full" variant="outline">
              Re-assess Risk
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RiskSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-8 w-[50px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
