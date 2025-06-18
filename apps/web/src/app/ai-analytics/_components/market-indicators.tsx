'use client';

import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/utils/trpc';

export function MarketIndicators() {
  const { data, isLoading, error } = trpc.ai.getMarketIndicators.useQuery();

  if (isLoading) {
    return <MarketIndicatorsSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={20} />
            Error Fetching Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Market Indicators</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <IndicatorCard
          title="Fear & Greed"
          value={data.fearGreedIndex.toString()}
          description={data.interpretation.fearGreed}
        />
        <IndicatorCard
          title="Total Market Cap"
          value={`$${(data.totalMarketCap / 1e12).toFixed(2)}T`}
        />
        <IndicatorCard title="BTC Dominance" value={`${data.btcDominance.toFixed(2)}%`} />
        <IndicatorCard title="ETH Dominance" value={`${data.ethDominance.toFixed(2)}%`} />
        <IndicatorCard title="DeFi TVL" value={`$${(data.defiTVL / 1e9).toFixed(2)}B`} />
        <IndicatorCard title="Volatility" value={data.interpretation.marketCondition} />
      </CardContent>
    </Card>
  );
}

function IndicatorCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

function MarketIndicatorsSkeleton() {
  const skeletonItems = [
    'fear-greed',
    'market-cap',
    'btc-dominance',
    'eth-dominance',
    'defi-tvl',
    'volatility',
  ];

  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-1/2" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {skeletonItems.map((item) => (
          <div key={item} className="p-4 bg-muted/50 rounded-lg flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
