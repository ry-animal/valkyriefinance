"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { useWeb3Store } from "@/stores/web3-store";
import { useUIStore } from "@/stores/ui-store";
import {
    TrendingUp,
    Coins,
    Target,
    Shield,
    ArrowUpRight,
    ArrowDownLeft,
    Zap,
    TrendingDown,
    DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { bt } from "@/lib/theme-utils";

export function VaultDashboard() {
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    const { selectedPortfolioId, portfolios } = usePortfolioStore();
    const { isConnected } = useWeb3Store();
    const { addNotification } = useUIStore();

    const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId);

    const handleDeposit = () => {
        if (!isConnected) {
            addNotification({
                type: "error",
                title: "Wallet Not Connected",
                message: "Please connect your wallet to deposit"
            });
            return;
        }

        if (!depositAmount || isNaN(Number(depositAmount))) {
            addNotification({
                type: "error",
                title: "Invalid Amount",
                message: "Please enter a valid deposit amount"
            });
            return;
        }

        addNotification({
            type: "success",
            title: "Deposit Initiated",
            message: `Depositing ${depositAmount} USDC to vault`
        });
        setDepositAmount("");
    };

    const handleWithdraw = () => {
        if (!isConnected) {
            addNotification({
                type: "error",
                title: "Wallet Not Connected",
                message: "Please connect your wallet to withdraw"
            });
            return;
        }

        if (!withdrawAmount || isNaN(Number(withdrawAmount))) {
            addNotification({
                type: "error",
                title: "Invalid Amount",
                message: "Please enter a valid withdrawal amount"
            });
            return;
        }

        addNotification({
            type: "success",
            title: "Withdrawal Initiated",
            message: `Withdrawing ${withdrawAmount} vault shares`
        });
        setWithdrawAmount("");
    };

    // Mock vault data - will be replaced with tRPC calls
    const vaultData = {
        totalValueLocked: 12450000,
        currentApy: 18.5,
        userShares: Number(selectedPortfolio?.totalValue) || 0,
        sharePrice: 1.0234,
        strategies: [
            { name: "Aave Lending", allocation: 35, apy: 12.3, status: "active" },
            { name: "Compound Yield", allocation: 25, apy: 15.8, status: "active" },
            { name: "Uniswap V4 LP", allocation: 40, apy: 24.2, status: "active" }
        ]
    };

    return (
        <div className={cn("space-y-8", bt.page)}>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={cn("border-4", bt.border, bt.section)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn("text-sm font-medium", bt.heading)}>
                            Total Deposited
                        </CardTitle>
                        <DollarSign className={cn("h-4 w-4", bt.muted)} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", bt.heading)}>$0.00</div>
                        <p className={cn("text-xs", bt.muted)}>
                            +0% from last month
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
                        <div className={cn("text-2xl font-bold", bt.heading)}>0.00%</div>
                        <p className={cn("text-xs", bt.muted)}>
                            AI-optimized yield
                        </p>
                    </CardContent>
                </Card>

                <Card className={cn("border-4", bt.border, bt.section)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn("text-sm font-medium", bt.heading)}>
                            Total Earned
                        </CardTitle>
                        <Target className={cn("h-4 w-4", bt.muted)} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", bt.heading)}>$0.00</div>
                        <p className={cn("text-xs", bt.muted)}>
                            Lifetime earnings
                        </p>
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
                            AI risk assessment
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={cn("border-4", bt.border, bt.section)}>
                    <CardHeader>
                        <CardTitle className={cn("text-xl font-black", bt.heading)}>
                            DEPOSIT FUNDS
                        </CardTitle>
                        <CardDescription className={bt.muted}>
                            Add funds to start earning AI-optimized yields
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className={cn("text-sm font-medium", bt.heading)}>
                                Amount (ETH)
                            </label>
                            <input 
                                type="number" 
                                placeholder="0.0" 
                                className={cn(
                                    "w-full p-3 border-4 rounded-none font-mono text-lg",
                                    bt.border,
                                    bt.section,
                                    bt.heading,
                                    "focus:outline-none focus:ring-2 focus:ring-offset-2"
                                )}
                            />
                        </div>
                        <Button 
                            className={cn(
                                "w-full h-12 text-lg font-black border-4",
                                bt.border,
                                "bg-black dark:bg-white text-white dark:text-black",
                                "hover:bg-gray-800 dark:hover:bg-gray-200"
                            )}
                        >
                            DEPOSIT ETH
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                            <Button 
                                variant="outline" 
                                className={cn(
                                    "border-4",
                                    bt.border,
                                    bt.section,
                                    bt.heading,
                                    "hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                MAX
                            </Button>
                            <Button 
                                variant="outline"
                                className={cn(
                                    "border-4",
                                    bt.border,
                                    bt.section,
                                    bt.heading,
                                    "hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                BRIDGE
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border-4", bt.border, bt.section)}>
                    <CardHeader>
                        <CardTitle className={cn("text-xl font-black", bt.heading)}>
                            WITHDRAW FUNDS
                        </CardTitle>
                        <CardDescription className={bt.muted}>
                            Withdraw your deposits and earnings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className={cn("text-sm font-medium", bt.heading)}>
                                Amount (Vault Shares)
                            </label>
                            <input 
                                type="number" 
                                placeholder="0.0" 
                                className={cn(
                                    "w-full p-3 border-4 rounded-none font-mono text-lg",
                                    bt.border,
                                    bt.section,
                                    bt.heading,
                                    "focus:outline-none focus:ring-2 focus:ring-offset-2"
                                )}
                            />
                        </div>
                        <Button 
                            variant="outline"
                            className={cn(
                                "w-full h-12 text-lg font-black border-4",
                                bt.border,
                                bt.section,
                                bt.heading,
                                "hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                            )}
                        >
                            WITHDRAW
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                            <Button 
                                variant="outline" 
                                className={cn(
                                    "border-4",
                                    bt.border,
                                    bt.section,
                                    bt.heading,
                                    "hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                25%
                            </Button>
                            <Button 
                                variant="outline"
                                className={cn(
                                    "border-4",
                                    bt.border,
                                    bt.section,
                                    bt.heading,
                                    "hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                100%
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Strategy Status */}
            <Card className={cn("border-4", bt.border, bt.section)}>
                <CardHeader>
                    <CardTitle className={cn("text-xl font-black flex items-center gap-2", bt.heading)}>
                        <Zap className="h-5 w-5" />
                        AI STRATEGY STATUS
                    </CardTitle>
                    <CardDescription className={bt.muted}>
                        Current AI optimization and performance metrics
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={cn("p-4 border-2", bt.border, bt.sectionAlt)}>
                            <div className={cn("text-sm font-medium", bt.heading)}>Strategy Active</div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={cn("border-green-500 text-green-500", bt.section)}>
                                    OPTIMIZING
                                </Badge>
                            </div>
                        </div>
                        
                        <div className={cn("p-4 border-2", bt.border, bt.sectionAlt)}>
                            <div className={cn("text-sm font-medium", bt.heading)}>Next Rebalance</div>
                            <div className={cn("text-lg font-mono", bt.heading)}>2h 34m</div>
                        </div>
                        
                        <div className={cn("p-4 border-2", bt.border, bt.sectionAlt)}>
                            <div className={cn("text-sm font-medium", bt.heading)}>Confidence Score</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Progress value={87} className="flex-1" />
                                <span className={cn("text-sm font-mono", bt.heading)}>87%</span>
                            </div>
                        </div>
                    </div>

                    <div className={cn("p-4 border-2", bt.border, bt.sectionAlt)}>
                        <div className={cn("text-sm font-medium mb-2", bt.heading)}>Latest AI Insight</div>
                        <p className={cn("font-mono text-sm", bt.body)}>
                            "Market volatility detected. Adjusting liquidity concentration to minimize impermanent loss. 
                            Expected yield improvement: +2.3% over next 24h."
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
