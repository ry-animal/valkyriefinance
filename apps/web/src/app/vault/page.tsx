'use client'

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ConnectButton } from '@/components/wallet/connect-button'
import { AlertCircle, TrendingUp, Coins, Vault, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

import {
    useVaultInfo,
    useVaultBalance,
    useVaultPreviews,
    useVaultOperations
} from '@/hooks/use-valkryie-vault'
import {
    useValkryieTokenInfo,
    useValkryieTokenBalance,
    useValkryieTokenOperations
} from '@/hooks/use-valkryie-token'
import { useWeb3Store } from '@/stores/web3-store'

export default function VaultPage() {
    const { isConnected } = useAccount()
    const { pendingTransactions } = useWeb3Store()

    // Vault data
    const vaultInfo = useVaultInfo()
    const vaultBalance = useVaultBalance()
    const vaultOperations = useVaultOperations()

    // Token data
    const tokenInfo = useValkryieTokenInfo()
    const tokenBalance = useValkryieTokenBalance()
    const tokenOperations = useValkryieTokenOperations()

    // Form states
    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [stakeAmount, setStakeAmount] = useState('')

    // Previews for current inputs
    const { previewDeposit } = useVaultPreviews()
    const depositPreview = previewDeposit(depositAmount)
    const { previewWithdraw } = useVaultPreviews()
    const withdrawPreview = previewWithdraw(withdrawAmount)

    if (!isConnected) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <Vault className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Valkryie Vault</h1>
                    <p className="text-muted-foreground mb-6">
                        Connect your wallet to interact with the Valkryie DeFi vault
                    </p>
                    <ConnectButton />
                </div>
            </div>
        )
    }

    const handleDeposit = async () => {
        if (!depositAmount) return
        try {
            await vaultOperations.deposit(depositAmount)
            setDepositAmount('')
        } catch (error) {
            console.error('Deposit failed:', error)
        }
    }

    const handleWithdraw = async () => {
        if (!withdrawAmount) return
        try {
            await vaultOperations.withdraw(withdrawAmount)
            setWithdrawAmount('')
        } catch (error) {
            console.error('Withdraw failed:', error)
        }
    }

    const handleStake = async () => {
        if (!stakeAmount) return
        try {
            await tokenOperations.stake(stakeAmount)
            setStakeAmount('')
        } catch (error) {
            console.error('Stake failed:', error)
        }
    }

    const handleClaimRewards = async () => {
        try {
            await tokenOperations.claimRewards()
        } catch (error) {
            console.error('Claim failed:', error)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Valkryie Vault Demo</h1>
                <p className="text-muted-foreground">
                    Experience our ERC-4626 vault and platform token integration
                </p>
            </div>

            {/* Pending Transactions Alert */}
            {pendingTransactions.length > 0 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {pendingTransactions.length} transaction(s) pending confirmation
                    </AlertDescription>
                </Alert>
            )}

            {/* Vault Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vault Assets</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vaultInfo.formattedTotalAssets}</div>
                        <p className="text-xs text-muted-foreground">
                            {vaultInfo.name || 'Valkryie Vault'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Vault Position</CardTitle>
                        <Vault className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vaultBalance.formattedAssetsFromShares}</div>
                        <p className="text-xs text-muted-foreground">
                            {vaultBalance.formattedShares} shares
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Platform Tokens</CardTitle>
                        <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tokenBalance.formattedBalance}</div>
                        <p className="text-xs text-muted-foreground">
                            {tokenInfo.symbol || 'VLKR'} tokens
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Interface */}
            <Tabs defaultValue="vault" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="vault">Vault Operations</TabsTrigger>
                    <TabsTrigger value="token">Token Operations</TabsTrigger>
                </TabsList>

                {/* Vault Operations */}
                <TabsContent value="vault" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Deposit */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowUpRight className="h-5 w-5" />
                                    Deposit Assets
                                </CardTitle>
                                <CardDescription>
                                    Deposit assets to mint vault shares and earn yield
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="deposit-amount">Amount</Label>
                                    <Input
                                        id="deposit-amount"
                                        type="number"
                                        placeholder="0.0"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                    />
                                    {depositPreview.data && (
                                        <p className="text-sm text-muted-foreground">
                                            Will receive: {Number(depositPreview.data).toFixed(6)} shares
                                        </p>
                                    )}
                                </div>
                                <Button
                                    onClick={handleDeposit}
                                    disabled={!depositAmount || vaultOperations.isPending}
                                    className="w-full"
                                >
                                    {vaultOperations.isPending ? 'Depositing...' : 'Deposit'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Withdraw */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowDownLeft className="h-5 w-5" />
                                    Withdraw Assets
                                </CardTitle>
                                <CardDescription>
                                    Withdraw your assets from the vault
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="withdraw-amount">Amount</Label>
                                    <Input
                                        id="withdraw-amount"
                                        type="number"
                                        placeholder="0.0"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                    />
                                    {withdrawPreview.data && (
                                        <p className="text-sm text-muted-foreground">
                                            Will burn: {Number(withdrawPreview.data).toFixed(6)} shares
                                        </p>
                                    )}
                                </div>
                                <Button
                                    onClick={handleWithdraw}
                                    disabled={!withdrawAmount || vaultOperations.isPending}
                                    className="w-full"
                                    variant="outline"
                                >
                                    {vaultOperations.isPending ? 'Withdrawing...' : 'Withdraw'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Vault Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vault Details</CardTitle>
                            <CardDescription>
                                Comprehensive information about the vault
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Vault Address:</span>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {vaultInfo.vaultAddress ? `${vaultInfo.vaultAddress.slice(0, 6)}...${vaultInfo.vaultAddress.slice(-4)}` : 'N/A'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Total Supply:</span>
                                        <span className="text-sm">{vaultInfo.formattedTotalSupply}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Asset Address:</span>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {vaultInfo.asset ? `${vaultInfo.asset.slice(0, 6)}...${vaultInfo.asset.slice(-4)}` : 'N/A'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Your Shares:</span>
                                        <span className="text-sm">{vaultBalance.formattedShares}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Max Withdraw:</span>
                                        <span className="text-sm">{vaultBalance.formattedMaxWithdraw}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Max Redeem:</span>
                                        <span className="text-sm">{vaultBalance.formattedMaxRedeem}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Token Operations */}
                <TabsContent value="token" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Staking */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Stake Platform Tokens</CardTitle>
                                <CardDescription>
                                    Stake {tokenInfo.symbol || 'VLKR'} tokens to earn rewards and participate in governance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stake-amount">Amount to Stake</Label>
                                    <Input
                                        id="stake-amount"
                                        type="number"
                                        placeholder="0.0"
                                        value={stakeAmount}
                                        onChange={(e) => setStakeAmount(e.target.value)}
                                    />
                                </div>
                                <Button
                                    onClick={handleStake}
                                    disabled={!stakeAmount || tokenOperations.isPending}
                                    className="w-full"
                                >
                                    {tokenOperations.isPending ? 'Staking...' : 'Stake Tokens'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Rewards */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Staking Rewards</CardTitle>
                                <CardDescription>
                                    View and claim your staking rewards
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Staked Balance:</span>
                                        <span className="text-sm">{tokenBalance.formattedStakedBalance}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Pending Rewards:</span>
                                        <span className="text-sm">{tokenBalance.formattedPendingRewards}</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleClaimRewards}
                                    disabled={tokenOperations.isPending}
                                    className="w-full"
                                    variant="outline"
                                >
                                    {tokenOperations.isPending ? 'Claiming...' : 'Claim Rewards'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Token Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Token Information</CardTitle>
                            <CardDescription>
                                Platform token details and supply information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Token Name:</span>
                                        <span className="text-sm">{tokenInfo.name || 'Valkryie Token'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Symbol:</span>
                                        <span className="text-sm">{tokenInfo.symbol || 'VLKR'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Total Supply:</span>
                                        <span className="text-sm">{tokenInfo.formattedTotalSupply}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Your Balance:</span>
                                        <span className="text-sm">{tokenBalance.formattedBalance}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Staked Amount:</span>
                                        <span className="text-sm">{tokenBalance.formattedStakedBalance}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Token Address:</span>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {tokenInfo.tokenAddress ? `${tokenInfo.tokenAddress.slice(0, 6)}...${tokenInfo.tokenAddress.slice(-4)}` : 'N/A'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Recent Transactions */}
            {pendingTransactions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                            Track your recent vault and token transactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {pendingTransactions.slice(0, 5).map((tx, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="capitalize">
                                            {tx.type.replace('_', ' ')}
                                        </Badge>
                                        <span className="text-sm font-mono">
                                            {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                        </span>
                                    </div>
                                    <Badge
                                        variant={tx.status === 'confirmed' ? 'default' : 'secondary'}
                                        className="capitalize"
                                    >
                                        {tx.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
} 