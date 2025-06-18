'use client';

import { AlertTriangle, Bot } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/utils/trpc';

type TokenAnalysisData = NonNullable<
  Awaited<ReturnType<typeof trpc.ai.getTokenAnalysis.useMutation>>['data']
>;

export function TokenAnalysis() {
  const [tokens, setTokens] = useState('BTC,ETH,LINK');
  const [analysisResult, setAnalysisResult] = useState<TokenAnalysisData | null>(null);

  const tokenAnalysisMutation = trpc.ai.getTokenAnalysis.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
  });

  const handleAnalyze = () => {
    const tokenList = tokens
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);
    if (tokenList.length > 0) {
      tokenAnalysisMutation.mutate({ tokens: tokenList });
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'bg-green-500/20 text-green-700';
      case 'bearish':
        return 'bg-red-500/20 text-red-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY':
        return 'text-green-600';
      case 'SELL':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot size={20} /> AI Token Analysis
            </CardTitle>
            <CardDescription>
              Enter comma-separated token symbols for AI-driven analysis.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            placeholder="e.g., BTC, ETH, SOL"
            disabled={tokenAnalysisMutation.isPending}
          />
          <Button onClick={handleAnalyze} disabled={tokenAnalysisMutation.isPending}>
            {tokenAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>

        {tokenAnalysisMutation.isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertTriangle size={16} />
            <p className="text-sm font-medium">{tokenAnalysisMutation.error.message}</p>
          </div>
        )}

        {tokenAnalysisMutation.isPending && <TokenAnalysisSkeleton />}

        {analysisResult && (
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="font-semibold">
                Analysis Result:{' '}
                <span className="text-muted-foreground font-normal">
                  {analysisResult.overallTrend}
                </span>
              </h4>
              <p className="text-xs text-muted-foreground">
                Updated: {new Date(analysisResult.timestamp).toLocaleString()}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead className="text-right">Price (USD)</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>AI Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysisResult.tokenAnalysis.map((token: any) => (
                  <TableRow key={token.token}>
                    <TableCell className="font-medium">{token.token}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${token.price.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-right ${token.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {(token.change_24h * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTrendColor(token.trend)}>
                        {token.trend}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`font-bold ${getRecommendationColor(token.recommendation)}`}
                    >
                      {token.recommendation} ({token.strength})
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TokenAnalysisSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-5 w-[80px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-[100px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-[60px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-[90px]" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-[120px]" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-[70px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[90px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[50px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[110px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
