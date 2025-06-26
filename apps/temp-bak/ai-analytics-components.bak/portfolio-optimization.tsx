'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';
import { Bot, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PortfolioOptimization() {
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
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Render UI components only after hydration
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Portfolio Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Optimization Opportunity</span>
            <Badge variant="secondary">+12.3% APY</Badge>
          </div>
          <p className="text-sm text-blue-800">
            Consider reallocating 25% of your portfolio to high-yield staking opportunities. Current
            market conditions favor liquid staking derivatives.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Recommended Actions:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Increase ETH staking allocation by 15%</li>
            <li>• Reduce exposure to low-yield farming pools</li>
            <li>• Consider cross-chain yield opportunities</li>
          </ul>
        </div>

        <Button className="w-full">Apply AI Recommendations</Button>
      </CardContent>
    </Card>
  );
}
