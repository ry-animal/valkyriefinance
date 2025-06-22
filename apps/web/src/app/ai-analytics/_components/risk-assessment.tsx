'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle, Progress } from '@valkyrie/ui';
import { Activity, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const riskMetrics = [
  {
    title: 'Portfolio Risk',
    score: 6.8,
    maxScore: 10,
    status: 'Medium',
    color: 'bg-yellow-500',
    icon: Shield,
  },
  {
    title: 'Market Volatility',
    score: 7.2,
    maxScore: 10,
    status: 'High',
    color: 'bg-red-500',
    icon: TrendingUp,
  },
  {
    title: 'Liquidity Risk',
    score: 4.1,
    maxScore: 10,
    status: 'Low',
    color: 'bg-green-500',
    icon: Activity,
  },
];

const riskFactors = [
  {
    factor: 'Smart Contract Risk',
    impact: 'Medium',
    probability: 'Low',
    mitigation: 'Audited contracts only',
  },
  {
    factor: 'Market Correlation',
    impact: 'High',
    probability: 'Medium',
    mitigation: 'Diversification strategy',
  },
  {
    factor: 'Impermanent Loss',
    impact: 'Medium',
    probability: 'High',
    mitigation: 'Stable pair selection',
  },
];

export function RiskAssessment() {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Risk Assessment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Scores */}
        <div className="space-y-4">
          {riskMetrics.map((metric) => {
            const Icon = metric.icon;
            const percentage = (metric.score / metric.maxScore) * 100;

            return (
              <div key={metric.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{metric.title}</span>
                  </div>
                  <Badge className={metric.color}>{metric.status}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm font-semibold">
                    {metric.score}/{metric.maxScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk Factors */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Key Risk Factors</h4>
          {riskFactors.map((factor, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{factor.factor}</span>
                <div className="flex space-x-1">
                  <Badge variant="outline" className={getImpactColor(factor.impact)}>
                    {factor.impact}
                  </Badge>
                  <Badge variant="outline">{factor.probability}</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Mitigation: {factor.mitigation}</p>
            </div>
          ))}
        </div>

        {/* Overall Assessment */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">AI Recommendation</h4>
          <p className="text-sm text-muted-foreground">
            Current portfolio shows moderate risk levels. Consider reducing exposure to
            high-volatility assets and increasing stable asset allocation for better risk-adjusted
            returns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
