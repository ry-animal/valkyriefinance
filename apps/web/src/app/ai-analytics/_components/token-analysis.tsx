'use client';

import { Search, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const tokenData = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$2,345.67',
    change: '+5.2%',
    trend: 'up' as const,
    aiScore: 8.7,
    recommendation: 'Strong Buy',
    volume: '$1.2B',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    price: '$1.00',
    change: '+0.1%',
    trend: 'up' as const,
    aiScore: 9.1,
    recommendation: 'Hold',
    volume: '$2.8B',
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    price: '$43,210.45',
    change: '-2.3%',
    trend: 'down' as const,
    aiScore: 7.4,
    recommendation: 'Buy',
    volume: '$890M',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    price: '$8.92',
    change: '+12.8%',
    trend: 'up' as const,
    aiScore: 8.2,
    recommendation: 'Strong Buy',
    volume: '$145M',
  },
];

export function TokenAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = tokenData.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy':
        return 'bg-green-500';
      case 'Buy':
        return 'bg-green-400';
      case 'Hold':
        return 'bg-yellow-500';
      case 'Sell':
        return 'bg-red-400';
      case 'Strong Sell':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5" />
          <span>AI Token Analysis</span>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTokens.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm">{token.symbol}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold">{token.price}</div>
                <div className="flex items-center space-x-1 text-sm">
                  {token.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={token.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {token.change}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold">{token.aiScore}/10</div>
                <div className="text-xs text-muted-foreground">AI Score</div>
              </div>

              <div className="text-right">
                <Badge className={getRecommendationColor(token.recommendation)}>
                  {token.recommendation}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">Vol: {token.volume}</div>
              </div>

              <Button variant="outline" size="sm">
                Analyze
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
