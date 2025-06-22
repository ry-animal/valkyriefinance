'use client';

import { Brain, PieChart, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@valkyrie/ui';
import { Button } from '@valkyrie/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';
import { Progress } from '@valkyrie/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@valkyrie/ui';

const currentAllocation = [
  { asset: 'ETH', percentage: 45, value: '$4,500', color: 'bg-blue-500' },
  { asset: 'USDC', percentage: 30, value: '$3,000', color: 'bg-green-500' },
  { asset: 'WBTC', percentage: 15, value: '$1,500', color: 'bg-orange-500' },
  { asset: 'UNI', percentage: 10, value: '$1,000', color: 'bg-purple-500' },
];

const optimizedAllocation = [
  { asset: 'ETH', percentage: 35, value: '$3,500', color: 'bg-blue-500', change: -10 },
  { asset: 'USDC', percentage: 35, value: '$3,500', color: 'bg-green-500', change: +5 },
  { asset: 'WBTC', percentage: 20, value: '$2,000', color: 'bg-orange-500', change: +5 },
  { asset: 'UNI', percentage: 10, value: '$1,000', color: 'bg-purple-500', change: 0 },
];

const strategies = [
  {
    name: 'Conservative Growth',
    expectedReturn: '12.5%',
    riskScore: 4.2,
    description: 'Stable returns with lower volatility',
    allocation: 'High stablecoin, moderate ETH',
  },
  {
    name: 'Aggressive Growth',
    expectedReturn: '28.7%',
    riskScore: 8.1,
    description: 'Maximum returns with higher risk',
    allocation: 'High ETH/BTC, minimal stablecoins',
  },
  {
    name: 'Balanced Portfolio',
    expectedReturn: '18.3%',
    riskScore: 6.5,
    description: 'Optimal risk-reward balance',
    allocation: 'Diversified across major assets',
  },
];

export function PortfolioOptimization() {
  const [selectedStrategy, setSelectedStrategy] = useState('Balanced Portfolio');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulate AI optimization process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsOptimizing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Portfolio Optimization</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="optimized">AI Optimized</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Current Allocation</h3>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Target className="h-3 w-3" />
                <span>Total: $10,000</span>
              </Badge>
            </div>

            <div className="space-y-3">
              {currentAllocation.map((item) => (
                <div key={item.asset} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-medium">{item.asset}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{item.percentage}%</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="optimized" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">AI Optimized Allocation</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-green-500">
                  +15.2% Expected Return
                </Badge>
                <Button onClick={handleOptimize} disabled={isOptimizing} size="sm">
                  {isOptimizing ? 'Optimizing...' : 'Apply Changes'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {optimizedAllocation.map((item) => (
                <div key={item.asset} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-medium">{item.asset}</span>
                      {item.change !== 0 && (
                        <Badge
                          variant={item.change > 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {item.change > 0 ? '+' : ''}
                          {item.change}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{item.percentage}%</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Optimization Summary</h4>
              <p className="text-sm text-muted-foreground">
                AI recommends reducing ETH exposure and increasing USDC and WBTC allocation for
                better risk-adjusted returns based on current market conditions.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-4">
            <h3 className="font-semibold">AI Strategy Recommendations</h3>

            <div className="space-y-3">
              {strategies.map((strategy) => (
                <button
                  key={strategy.name}
                  type="button"
                  className={`w-full p-4 border rounded-lg cursor-pointer transition-colors text-left ${
                    selectedStrategy === strategy.name
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedStrategy(strategy.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{strategy.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-500/10">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {strategy.expectedReturn}
                      </Badge>
                      <Badge variant="outline">Risk: {strategy.riskScore}/10</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>

                  <div className="flex items-center space-x-2 text-xs">
                    <PieChart className="h-3 w-3" />
                    <span>{strategy.allocation}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button className="w-full" disabled={isOptimizing}>
              Implement {selectedStrategy} Strategy
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
