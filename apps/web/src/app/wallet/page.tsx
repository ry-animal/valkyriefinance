"use client";

import { useAccount, useBalance, useChainId } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WalletConnect } from "@/components/wallet/wallet-connect"
import { useTokenBalance, COMMON_TOKENS } from "@/hooks/use-token-balance"
import { getChainById } from "@/lib/wagmi-config"
import { Wallet, Link, Coins, Network } from "lucide-react"

export default function WalletPage() {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const chain = getChainById(chainId)

    const { data: ethBalance } = useBalance({
        address,
        query: { enabled: !!address }
    })

    const { formattedBalance: usdcBalance, symbol: usdcSymbol } = useTokenBalance(
        chainId === 1 ? COMMON_TOKENS.USDC : undefined
    )

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
                <div className="container mx-auto py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <Wallet className="h-16 w-16 mx-auto mb-4 text-primary" />
                            <h1 className="text-4xl font-bold tracking-tight mb-4">
                                Connect Your Wallet
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Connect your wallet to access DeFi features and manage your portfolio
                            </p>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <WalletConnect />
                                    <p className="text-sm text-muted-foreground mt-4">
                                        Supports MetaMask, Coinbase Wallet, and WalletConnect compatible wallets
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            Wallet Connected
                        </h1>
                        <WalletConnect />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5" />
                                    Wallet Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Address</label>
                                    <p className="font-mono text-sm bg-muted p-2 rounded">
                                        {address}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Network</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary">
                                            {chain?.name || 'Unknown'}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            Chain ID: {chainId}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Coins className="h-5 w-5" />
                                    Balances
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        {chain?.nativeCurrency?.symbol || 'ETH'}
                                    </span>
                                    <span className="font-mono">
                                        {ethBalance
                                            ? `${Number(ethBalance.formatted).toFixed(4)} ${ethBalance.symbol}`
                                            : '0.0000 ETH'
                                        }
                                    </span>
                                </div>

                                {chainId === 1 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{usdcSymbol}</span>
                                        <span className="font-mono">
                                            {Number(usdcBalance).toFixed(2)} {usdcSymbol}
                                        </span>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <Button variant="outline" size="sm" className="w-full">
                                        View All Tokens
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Available Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <Button size="lg" className="flex flex-col h-auto py-4">
                                    <Coins className="h-6 w-6 mb-2" />
                                    <span>Deposit to Vault</span>
                                    <span className="text-xs text-muted-foreground">
                                        Earn yield on your assets
                                    </span>
                                </Button>

                                <Button variant="outline" size="lg" className="flex flex-col h-auto py-4">
                                    <Network className="h-6 w-6 mb-2" />
                                    <span>Cross-Chain Swap</span>
                                    <span className="text-xs text-muted-foreground">
                                        Bridge assets from other chains
                                    </span>
                                </Button>

                                <Button variant="outline" size="lg" className="flex flex-col h-auto py-4">
                                    <Link className="h-6 w-6 mb-2" />
                                    <span>Manage Portfolio</span>
                                    <span className="text-xs text-muted-foreground">
                                        View and organize holdings
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
