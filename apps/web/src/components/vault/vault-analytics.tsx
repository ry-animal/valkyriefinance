"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useVaultInfo, useVaultBalance } from "@/hooks/use-valkyrie-vault";
import { formatEther, formatUnits } from "viem";
import {
    TrendingUp,
    TrendingDown,
    Target,
    BarChart3,
    PieChart,
    Zap,
    Brain,
    Shield,
    Clock,
    DollarSign,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { bt } from "@/lib/theme-utils";

// Mock data for analytics - would come from real APIs in production
const analyticsData = {
    performance: {
        daily: { apy: 0.034, change: 0.12 },
        weekly: { apy: 0.089, change: -0.05 },
        monthly: { apy: 0.285, change: 0.23 },
        yearly: { apy: 12.5, change: 2.1 }
    },
    strategies: [
        { name: "Aave Yield Farming", allocation: 35, apy: 8.2, risk: "low", status: "active" },
        { name: "Compound Lending", allocation: 25, apy: 12.1, risk: "low", status: "active" },
        { name: "Uniswap V4 LP", allocation: 30, apy: 18.7, risk: "medium", status: "active" },
        { name: "Arbitrage Trading", allocation: 10, apy: 24.5, risk: "high", status: "paused" }
    ],
    aiInsights: [
        {
            type: "optimization",
            title: "Yield Opportunity Detected",
            description: "AI identified 3.2% yield improvement by rebalancing Uniswap positions.",
            confidence: 87,
            impact: "high"
        },
        {
            type: "risk",
            title: "Market Volatility Alert",
            description: "Increased volatility detected. Reducing high-risk strategy allocation by 15%.",
            confidence: 92,
            impact: "medium"
        },
        {
            type: "trend",
            title: "Gas Cost Optimization",
            description: "Optimal gas window identified for next rebalance. Estimated savings: 40%.",
            confidence: 78,
            impact: "low"
        }
    ],
    historicalPerformance: [
        { period: "24h", value: 1034.12, change: 2.34 },
        { period: "7d", value: 1029.87, change: -0.87 },
        { period: "30d", value: 1045.23, change: 4.52 },
        { period: "90d", value: 1078.45, change: 7.84 },
        { period: "1y", value: 1156.78, change: 15.68 }
    ]
};

export function VaultAnalytics() {
    const [selectedPeriod, setSelectedPeriod] = useState("monthly");
    const vaultInfo = useVaultInfo();
    const userBalance = useVaultBalance();

    const currentPerformance = analyticsData.performance[selectedPeriod as keyof typeof analyticsData.performance];
    const totalUserValue = formatEther(userBalance.assetsFromShares);

    return (
        <div className={cn("space-y-8", bt.page)}>
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={cn("border-4", bt.border, bt.section)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn("text-sm font-medium", bt.heading)}>
                            Portfolio Value
                        </CardTitle>
                        <DollarSign className={cn("h-4 w-4", bt.muted)} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", bt.heading)}>
                            ${(parseFloat(totalUserValue) * 2341).toFixed(2)}
                        </div>
                        <p className={cn("text-xs flex items-center gap-1", bt.muted)}>
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            +2.34% today
                        </p>
                    </CardContent>
                </Card>

                <Card className={cn("border-4", bt.border, bt.section)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn("text-sm font-medium", bt.heading)}>
                            Current APY
                        </CardTitle>
                        <TrendingUp className={cn("h-4 w-4", bt.muted)} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", bt.heading)}>
                            {currentPerformance.apy.toFixed(2)}%
                        </div>
                        <p className={cn("text-xs flex items-center gap-1",
                            currentPerformance.change > 0 ? "text-green-600" : "text-red-600"
                        )}>
                            {currentPerformance.change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                            ) : (
                                <TrendingDown className="h-3 w-3" />
                            )}
                            {currentPerformance.change > 0 ? '+' : ''}{currentPerformance.change.toFixed(2)}%
                        </p>
                    </CardContent>
                </Card>

                <Card className={cn("border-4", bt.border, bt.section)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn("text-sm font-medium", bt.heading)}>
                            AI Confidence
                        </CardTitle>
                        <Brain className={cn("h-4 w-4", bt.muted)} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", bt.heading)}>87%</div>
                        <div className="flex items-center gap-2 mt-1">
                            <Progress value={87} className="flex-1 h-2" />
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border-4", bt.border, bt.section)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn("text-sm font-medium", bt.heading)}>
                            Risk Score
                        </CardTitle>
                        <Shield className={cn("h-4 w-4", bt.muted)} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold text-green-600", bt.heading)}>Low</div>
                        <p className={cn("text-xs", bt.muted)}>
                            Conservative strategy
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <Tabs defaultValue="performance" className="w-full">
                <TabsList className={cn("grid w-full grid-cols-4", bt.section)}>
                    <TabsTrigger value="performance" className={cn("font-bold", bt.heading)}>
                        PERFORMANCE
                    </TabsTrigger>
                    <TabsTrigger value="strategies" className={cn("font-bold", bt.heading)}>
                        STRATEGIES
                    </TabsTrigger>
                    <TabsTrigger value="ai-insights" className={cn("font-bold", bt.heading)}>
                        AI INSIGHTS
                    </TabsTrigger>
                    <TabsTrigger value="history" className={cn("font-bold", bt.heading)}>
                        HISTORY
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-6">
                    <Card className={cn("border-4", bt.border, bt.section)}>
                        <CardHeader>
                            <CardTitle className={cn("text-xl font-black", bt.heading)}>
                                PERFORMANCE METRICS
                            </CardTitle>
                            <CardDescription className={bt.muted}>
                                Detailed breakdown of vault performance across time periods
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2 mb-4">
                                {Object.keys(analyticsData.performance).map((period) => (
                                    <Button
                                        key={period}
                                        variant={selectedPeriod === period ? "default" : "outline"}
                                        size="sm"
                                        className={cn("border-2", bt.border)}
                                        onClick={() => setSelectedPeriod(period)}
                                    >
                                        {period.toUpperCase()}
                                    </Button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={cn("p-4 border-2", bt.border, bt.sectionAlt)}>
                                    <div className={cn("text-sm font-medium mb-2", bt.heading)}>
                                        APY Breakdown
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className={bt.muted}>Base yield:</span>
                                            <span className={cn("font-mono", bt.heading)}>8.3%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={bt.muted}>AI optimization:</span>
                                            <span className={cn("font-mono text-green-600", bt.heading)}>+4.2%</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className={cn("font-medium", bt.heading)}>Total APY:</span>
                                            <span className={cn("font-mono font-bold", bt.heading)}>
                                                {currentPerformance.apy.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={cn("p-4 border-2", bt.border, bt.sectionAlt)}>
                                    <div className={cn("text-sm font-medium mb-2", bt.heading)}>
                                        Risk Metrics
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className={bt.muted}>Volatility:</span>
                                            <span className={cn("font-mono", bt.heading)}>2.1%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={bt.muted}>Max drawdown:</span>
                                            <span className={cn("font-mono", bt.heading)}>-1.3%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={bt.muted}>Sharpe ratio:</span>
                                            <span className={cn("font-mono", bt.heading)}>4.2</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="strategies" className="space-y-6">
                    <Card className={cn("border-4", bt.border, bt.section)}>
                        <CardHeader>
                            <CardTitle className={cn("text-xl font-black", bt.heading)}>
                                ACTIVE STRATEGIES
                            </CardTitle>
                            <CardDescription className={bt.muted}>
                                Current allocation and performance of AI-managed strategies
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analyticsData.strategies.map((strategy, index) => (
                                <div
                                    key={index}
                                    className={cn("p-4 border-2", bt.border, bt.sectionAlt)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className={cn("font-bold", bt.heading)}>{strategy.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs",
                                                        strategy.status === "active" ? "border-green-500 text-green-600" :
                                                            strategy.status === "paused" ? "border-yellow-500 text-yellow-600" :
                                                                "border-red-500 text-red-600"
                                                    )}
                                                >
                                                    {strategy.status.toUpperCase()}
                                                </Badge>
                                                <Badge variant="outline" className={cn("text-xs", bt.section)}>
                                                    {strategy.risk.toUpperCase()} RISK
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={cn("font-bold", bt.heading)}>{strategy.apy}% APY</div>
                                            <div className={cn("text-sm", bt.muted)}>{strategy.allocation}% allocated</div>
                                        </div>
                                    </div>
                                    <Progress value={strategy.allocation} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai-insights" className="space-y-6">
                    <div className="grid gap-6">
                        {analyticsData.aiInsights.map((insight, index) => (
                            <Card key={index} className={cn("border-4", bt.border, bt.section)}>
                                <CardHeader>
                                    <CardTitle className={cn("text-lg font-black flex items-center gap-2", bt.heading)}>
                                        <Zap className="h-5 w-5" />
                                        {insight.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className={cn("mb-4", bt.body)}>{insight.description}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-sm", bt.muted)}>Confidence:</span>
                                                <Progress value={insight.confidence} className="w-20 h-2" />
                                                <span className={cn("text-sm font-mono", bt.heading)}>
                                                    {insight.confidence}%
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs",
                                                    insight.impact === "high" ? "border-red-500 text-red-600" :
                                                        insight.impact === "medium" ? "border-yellow-500 text-yellow-600" :
                                                            "border-blue-500 text-blue-600"
                                                )}
                                            >
                                                {insight.impact.toUpperCase()} IMPACT
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <Card className={cn("border-4", bt.border, bt.section)}>
                        <CardHeader>
                            <CardTitle className={cn("text-xl font-black", bt.heading)}>
                                HISTORICAL PERFORMANCE
                            </CardTitle>
                            <CardDescription className={bt.muted}>
                                Track your vault performance over different time periods
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.historicalPerformance.map((period, index) => (
                                    <div
                                        key={index}
                                        className={cn("flex justify-between items-center p-3 border-2", bt.border, bt.sectionAlt)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn("font-bold", bt.heading)}>{period.period}</div>
                                            <div className={cn("font-mono", bt.heading)}>${period.value.toFixed(2)}</div>
                                        </div>
                                        <div className={cn(
                                            "flex items-center gap-1 font-mono",
                                            period.change > 0 ? "text-green-600" : "text-red-600"
                                        )}>
                                            {period.change > 0 ? (
                                                <TrendingUp className="h-3 w-3" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3" />
                                            )}
                                            {period.change > 0 ? '+' : ''}{period.change.toFixed(2)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 