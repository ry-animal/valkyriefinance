"use client";

import { useAccount, useBalance, useChainId } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConnectButton } from "@/components/wallet/connect-button"
import { WalletStatus } from "@/components/wallet/wallet-status"
import { NetworkSwitcher } from "@/components/wallet/network-switcher"
import { useTokenBalance, TOKENS_BY_CHAIN } from "@/hooks/use-token-balance"
import { getChainById } from "@/lib/wagmi-config"
import { Wallet, Link, Coins, Network, TrendingUp } from "lucide-react"

export default function WalletPage() {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const chain = getChainById(chainId)

    const { data: ethBalance } = useBalance({
        address,
        query: { enabled: !!address }
    })

    // Get supported tokens for current chain
    const chainTokens = TOKENS_BY_CHAIN[chainId as keyof typeof TOKENS_BY_CHAIN] || {}
    const supportedTokens = Object.keys(chainTokens)

    // Get individual token balances for display
    const tokenAddresses = Object.values(chainTokens)
    const firstThreeTokens = tokenAddresses.slice(0, 3) // Show first 3 tokens for demo

    const token1 = useTokenBalance(firstThreeTokens[0])
    const token2 = useTokenBalance(firstThreeTokens[1])
    const token3 = useTokenBalance(firstThreeTokens[2])

    const allTokens = [token1, token2, token3].filter(token =>
        token.balance > BigInt(0) && token.symbol !== 'TOKEN'
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
                                    <ConnectButton />
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
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            Wallet Portfolio
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <ConnectButton />
                            <NetworkSwitcher />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
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
                                <div>
                                    <label className="text-sm text-muted-foreground">Supported Tokens</label>
                                    <p className="text-sm">{supportedTokens.length} tokens available</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Coins className="h-5 w-5" />
                                    Token Balances
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {/* Native Token (ETH/MATIC etc) */}
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Coins className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {chain?.nativeCurrency?.name || 'Ethereum'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {chain?.nativeCurrency?.symbol || 'ETH'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-medium">
                                                {ethBalance
                                                    ? `${Number(ethBalance.formatted).toFixed(4)}`
                                                    : '0.0000'
                                                }
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {ethBalance?.symbol || 'ETH'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ERC-20 Tokens */}
                                    {allTokens.length > 0 ? (
                                        allTokens.map((token, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                                        <TrendingUp className="h-4 w-4 text-secondary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{token.symbol}</p>
                                                        <p className="text-sm text-muted-foreground">ERC-20 Token</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono font-medium">
                                                        {Number(token.formattedBalance).toFixed(4)}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{token.symbol}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-muted-foreground">
                                                No ERC-20 token balances found
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Supported: {supportedTokens.join(', ')}
                                            </p>
                                        </div>
                                    )}
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
