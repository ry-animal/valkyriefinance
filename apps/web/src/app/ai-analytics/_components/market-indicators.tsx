'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';
import { Activity, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

const marketData = [
  {
    title: 'Total Value Locked',
    value: '$2.4B',
    change: '+12.5%',
    trend: 'up' as const,
    icon: DollarSign,
  },
  {
    title: 'Active Strategies',
    value: '847',
    change: '+5.2%',
    trend: 'up' as const,
    icon: Activity,
  },
  {
    title: 'Average APY',
    value: '18.7%',
    change: '-2.1%',
    trend: 'down' as const,
    icon: TrendingUp,
  },
  {
    title: 'Risk Score',
    value: '6.8/10',
    change: '+0.3',
    trend: 'up' as const,
    icon: TrendingDown,
  },
];

export function MarketIndicators() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketData.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge
                  variant={item.trend === 'up' ? 'default' : 'destructive'}
                  className="flex items-center space-x-1"
                >
                  {item.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{item.change}</span>
                </Badge>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
