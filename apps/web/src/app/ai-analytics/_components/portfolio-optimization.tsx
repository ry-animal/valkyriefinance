'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Bot, TrendingUp, Zap, BarChart, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock portfolio data
const MOCK_PORTFOLIO = {
    totalValue: '12500.00',
    assets: [
        { symbol: 'BTC', balance: '0.1', valueUsd: '4074.21', percentage: 32.59 },
        { symbol: 'ETH', balance: '2.5', valueUsd: '6094.01', percentage: 48.75 },
        { symbol: 'LINK', balance: '150', valueUsd: '2331.78', percentage: 18.66 },
    ],
    chainDistribution: { 'Ethereum': '12500.00' },
};

type OptimizationData = NonNullable<Awaited<ReturnType<typeof trpc.ai.optimizePortfolioAdvanced.useMutation>>['data']>;

export function PortfolioOptimization() {
    const [optData, setOptData] = useState<OptimizationData | null>(null);
    const optMutation = trpc.ai.optimizePortfolioAdvanced.useMutation({
        onSuccess: setOptData,
    });

    const handleOptimize = () => {
        optMutation.mutate(MOCK_PORTFOLIO);
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Advanced AI Portfolio Optimization</CardTitle>
                <CardDescription>
                    Get a comprehensive, multi-faceted optimization plan for your portfolio using the Valkyrie AI Engine.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!optData && !optMutation.isPending && (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Ready to Optimize?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Our AI will analyze your current holdings and provide a detailed plan to enhance returns and manage risk.
                        </p>
                        <Button onClick={handleOptimize}>
                            <Zap className="mr-2 h-4 w-4" />
                            Optimize My Portfolio
                        </Button>
                    </div>
                )}

                {optMutation.isPending && <OptimizationSkeleton />}

                {optMutation.isError && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
                        <AlertTriangle size={16} />
                        <p className="text-sm font-medium">{optMutation.error.message}</p>
                    </div>
                )}

                {optData && (
                    <div className="space-y-6">
                        <OptimizationResult data={optData} />
                    </div>
                )}
            </CardContent>
            {optData && (
                <CardFooter>
                    <Button onClick={handleOptimize} variant="outline" className="w-full">
                        <Zap className="mr-2 h-4 w-4" />
                        Re-run Optimization
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

function OptimizationResult({ data }: { data: OptimizationData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1: Summary & Actions */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp size={20} />Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Confidence:</span> <Badge>{(data.optimization.confidence * 100).toFixed(1)}%</Badge></div>
                        <div className="flex justify-between"><span>Expected Return:</span> <span className="font-medium text-green-600">{(data.optimization.expectedReturn * 100).toFixed(2)}%</span></div>
                        <div className="flex justify-between"><span>Projected Risk:</span> <span className="font-medium text-yellow-600">{(data.optimization.risk * 100).toFixed(2)}%</span></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Zap size={20} />Recommended Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Column 2: Risk & Reasoning */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldAlert size={20} />Risk Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Volatility:</span> <span>{(data.riskMetrics.volatility * 100).toFixed(2)}%</span></div>
                        <div className="flex justify-between"><span>Sharpe Ratio:</span> <span>{data.riskMetrics.sharpeRatio.toFixed(3)}</span></div>
                        <div className="flex justify-between"><span>Max Drawdown:</span> <span>{(data.riskMetrics.maxDrawdown * 100).toFixed(2)}%</span></div>
                        <div className="flex justify-between"><span>95% VaR:</span> <span>{(data.riskMetrics.var95 * 100).toFixed(2)}%</span></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot size={20} />AI Reasoning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{data.optimization.reasoning}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Column 3: Market Analysis */}
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart size={20} />Market Analysis</CardTitle>
                        <CardDescription>Based on 1-day timeframe. Overall sentiment: {data.marketAnalysis.sentiment}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Token</TableHead>
                                    <TableHead>Trend</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.marketAnalysis.tokenAnalysis.map((token) => (
                                    <TableRow key={token.token}>
                                        <TableCell className="font-medium">{token.token}</TableCell>
                                        <TableCell><Badge variant="outline" className={token.trend === 'bullish' ? 'text-green-600' : 'text-red-600'}>{token.trend}</Badge></TableCell>
                                        <TableCell className="text-right font-mono">${token.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function OptimizationSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></CardContent></Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
            </div>
            <div className="lg:col-span-1">
                <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
            </div>
        </div>
    )
} 