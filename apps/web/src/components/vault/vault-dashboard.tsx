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
    Zap
} from "lucide-react";

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
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
                        <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${vaultData.totalValueLocked.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +2.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current APY</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {vaultData.currentApy}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            AI-optimized yield
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Position</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${vaultData.userShares.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {(vaultData.userShares / vaultData.sharePrice).toFixed(2)} shares
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Vault Operations
                    </CardTitle>
                    <CardDescription>
                        Deposit assets to earn optimized yield or withdraw your position
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="deposit" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="deposit" className="flex items-center gap-2">
                                <ArrowUpRight className="h-4 w-4" />
                                Deposit
                            </TabsTrigger>
                            <TabsTrigger value="withdraw" className="flex items-center gap-2">
                                <ArrowDownLeft className="h-4 w-4" />
                                Withdraw
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="deposit" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="deposit-amount">Amount (USDC)</Label>
                                <Input
                                    id="deposit-amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleDeposit}
                                className="w-full"
                                disabled={!isConnected}
                            >
                                {!isConnected ? "Connect Wallet" : "Deposit to Vault"}
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Deposits are automatically optimized across multiple strategies
                            </p>
                        </TabsContent>

                        <TabsContent value="withdraw" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="withdraw-amount">Shares to Withdraw</Label>
                                <Input
                                    id="withdraw-amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleWithdraw}
                                variant="outline"
                                className="w-full"
                                disabled={!isConnected}
                            >
                                {!isConnected ? "Connect Wallet" : "Withdraw from Vault"}
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Withdrawals are processed immediately with current share price
                            </p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Active Strategies
                    </CardTitle>
                    <CardDescription>
                        AI-managed allocation across different yield opportunities
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {vaultData.strategies.map((strategy, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{strategy.name}</h4>
                                        <Badge variant={strategy.status === "active" ? "default" : "secondary"}>
                                            {strategy.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {strategy.allocation}% allocation • {strategy.apy}% APY
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Progress value={strategy.allocation} className="w-20 mb-1" />
                                    <p className="text-sm text-muted-foreground">{strategy.allocation}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
