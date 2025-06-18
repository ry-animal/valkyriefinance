'use client';

import { DollarSign, Target, TrendingUp, Wallet } from 'lucide-react';
import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PortfolioStats } from '@/lib/data-access';

interface DashboardStatsProps {
  dataPromise: Promise<PortfolioStats>;
}

export function DashboardStats({ dataPromise }: DashboardStatsProps) {
  // Use the 'use' hook to unwrap the promise - component will suspend until resolved
  const data = use(dataPromise);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalValue}</div>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalYield}</div>
          <p className="text-xs text-muted-foreground">Annualized percentage yield</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activePositions}</div>
          <p className="text-xs text-muted-foreground">Across all protocols</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.pendingRewards}</div>
          <p className="text-xs text-muted-foreground">Ready to claim</p>
        </CardContent>
      </Card>
    </div>
  );
}
