'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MarketIndicators() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton during SSR
  if (!mounted) {
    return (
      <div className="border rounded-lg bg-white shadow">
        <div className="p-6 border-b">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render UI components only after hydration
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Indicators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">BTC Dominance</span>
          <Badge variant="secondary">54.2%</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Fear & Greed Index</span>
          <Badge variant="default" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            72 (Greed)
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">DeFi TVL</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            $45.2B
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
