'use client';

import {
  Alert,
  AlertDescription,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@valkyrie/ui';
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function RiskAssessment() {
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
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Render UI components only after hydration
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Risk Score</span>
            <Badge variant="outline">Medium (6.2/10)</Badge>
          </div>
          <Progress value={62} className="h-2" />
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Smart Contract Risk:</strong> High exposure to experimental protocols. Consider
            diversifying across battle-tested platforms.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Impermanent Loss Risk</span>
            <Badge variant="destructive">High</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Liquidity Risk</span>
            <Badge variant="secondary">Medium</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Protocol Risk</span>
            <Badge variant="outline">Low</Badge>
          </div>
        </div>

        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-orange-900">Risk Mitigation</span>
          </div>
          <p className="text-sm text-orange-800">
            Consider reducing position sizes in high-risk pools and implementing stop-loss
            strategies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
