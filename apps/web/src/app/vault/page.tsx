"use client";

import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ConnectButton } from '@/components/wallet/connect-button'
import { AlertCircle, TrendingUp, Coins, Vault, ArrowUpRight, ArrowDownLeft, Gift, Lock } from 'lucide-react'
import { BrutalHeadline, BrutalText, BrutalSection, BrutalBox, BrutalGrid } from '@/components/brutalist/layout'
import { WalletGuard } from "@/components/wallet/wallet-guard"
import { cn } from "@/lib/utils"
import { bt } from "@/lib/theme-utils"

import {
    useVaultInfo,
    useVaultBalance,
    useVaultPreviewDeposit,
    useVaultPreviewWithdraw,
    useVaultOperations
} from '@/hooks/use-valkyrie-vault'
import {
    useValkyrieTokenInfo,
    useValkyrieTokenBalance,
    useValkyrieTokenOperations
} from '@/hooks/use-valkyrie-token'
import { useWeb3Store } from '@/stores/web3-store'

// Mock data - replace with actual contract calls
const mockVaultInfo = {
    vaultAddress: '0x1234567890123456789012345678901234567890',
    asset: '0x0987654321098765432109876543210987654321',
    name: 'Valkyrie Vault',
    totalAssets: '1000000',
    totalSupply: '950000',
    formattedTotalAssets: '1,000,000 USDC',
    formattedTotalSupply: '950,000 shares'
};

const mockVaultBalance = {
    shares: '1000',
    assetsFromShares: '1050',
    maxWithdraw: '1050',
    maxRedeem: '1000',
    formattedShares: '1,000 shares',
    formattedAssetsFromShares: '1,050 USDC',
    formattedMaxWithdraw: '1,050 USDC',
    formattedMaxRedeem: '1,000 shares'
};

const mockTokenInfo = {
    tokenAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    name: 'Valkyrie Token',
    symbol: 'VLKR',
    totalSupply: '10000000',
    formattedTotalSupply: '10,000,000 VLKR'
};

const mockTokenBalance = {
    balance: '5000',
    stakedBalance: '2000',
    pendingRewards: '150',
    formattedBalance: '5,000 VLKR',
    formattedStakedBalance: '2,000 VLKR',
    formattedPendingRewards: '150 VLKR'
};

export default function VaultPage() {
    const [mounted, setMounted] = useState(false)

    // Always call hooks first (React rule)
    const { isConnected } = useAccount()
    const { pendingTransactions } = useWeb3Store()

    // Use mock data for now - replace with actual hooks when contracts are deployed
    const vaultInfo = mockVaultInfo
    const vaultBalance = mockVaultBalance
    const vaultOperations = { isPending: false }

    const tokenInfo = mockTokenInfo
    const tokenBalance = mockTokenBalance
    const tokenOperations = { isPending: false }

    // Form states
    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [stakeAmount, setStakeAmount] = useState('')
    const [unstakeAmount, setUnstakeAmount] = useState('')

    // Mock previews for current inputs
    const depositPreview = { data: depositAmount ? (parseFloat(depositAmount) * 0.95).toString() : null }
    const withdrawPreview = { data: withdrawAmount ? (parseFloat(withdrawAmount) * 1.05).toString() : null }

    useEffect(() => {
        setMounted(true)
    }, [])

    // Early return AFTER all hooks have been called
    if (!mounted) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <Vault className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Valkyrie Vault</h1>
                    <p className="text-muted-foreground mb-6">Loading...</p>
                </div>
            </div>
        )
    }

    const handleDeposit = () => {
        console.log('Deposit:', depositAmount);
    };

    const handleWithdraw = () => {
        console.log('Withdraw:', withdrawAmount);
    };

    const handleStake = () => {
        console.log('Stake:', stakeAmount);
    };

    const handleUnstake = () => {
        console.log('Unstake:', unstakeAmount);
    };

    const handleClaimRewards = () => {
        console.log('Claim rewards');
    };

    return (
        <WalletGuard requireConnection={true}>
            <div className="min-h-screen bg-white dark:bg-black">
                {/* Header */}
                <BrutalSection fullWidth className="border-b-4 border-black dark:border-white py-20">
                    <div className="max-w-7xl mx-auto text-center">
                        <BrutalHeadline size="mega" className="mb-8 text-center text-black dark:text-white">
                            VALKYRIE
                            <br />
                            VAULT
                        </BrutalHeadline>
                        <BrutalText variant="mono" size="xl" className="text-center max-w-3xl mx-auto text-black dark:text-white">
                            EXPERIENCE OUR ERC-4626 VAULT AND PLATFORM TOKEN INTEGRATION.
                            MAXIMUM YIELD. ZERO COMPROMISE.
                        </BrutalText>
                    </div>
                </BrutalSection>

                {/* Pending Transactions Alert */}
                {pendingTransactions.length > 0 && (
                    <BrutalSection className="py-8 bg-red-500 dark:bg-red-600">
                        <div className="max-w-7xl mx-auto">
                            <BrutalBox className="bg-white dark:bg-black border-4 border-black dark:border-white p-6" border>
                                <div className="flex items-center gap-4">
                                    <AlertCircle className="h-8 w-8 text-red-500" />
                                    <BrutalText variant="brutal" size="lg" className="text-black dark:text-white">
                                        {pendingTransactions.length} TRANSACTION(S) PENDING CONFIRMATION
                                    </BrutalText>
                                </div>
                            </BrutalBox>
                        </div>
                    </BrutalSection>
                )}

                {/* Vault Overview Stats */}
                <BrutalSection fullWidth className="bg-black dark:bg-white text-white dark:text-black py-16">
                    <BrutalGrid cols={3} className="gap-8 max-w-7xl mx-auto">
                        <BrutalBox className="text-center bg-black dark:bg-white border-white dark:border-black text-white dark:text-black p-8" border>
                            <BrutalHeadline size="massive" className="text-white dark:text-black mb-4">
                                {vaultInfo.formattedTotalAssets}
                            </BrutalHeadline>
                            <BrutalText variant="brutal" className="text-white dark:text-black">
                                TOTAL VAULT ASSETS
                            </BrutalText>
                        </BrutalBox>

                        <BrutalBox className="text-center bg-black dark:bg-white border-white dark:border-black text-white dark:text-black p-8" border>
                            <BrutalHeadline size="massive" className="text-white dark:text-black mb-4">
                                {vaultBalance.formattedAssetsFromShares}
                            </BrutalHeadline>
                            <BrutalText variant="brutal" className="text-white dark:text-black">
                                YOUR POSITION
                            </BrutalText>
                        </BrutalBox>

                        <BrutalBox className="text-center bg-black dark:bg-white border-white dark:border-black text-white dark:text-black p-8" border>
                            <BrutalHeadline size="massive" className="text-white dark:text-black mb-4">
                                {tokenBalance.formattedBalance}
                            </BrutalHeadline>
                            <BrutalText variant="brutal" className="text-white dark:text-black">
                                PLATFORM TOKENS
                            </BrutalText>
                        </BrutalBox>
                    </BrutalGrid>
                </BrutalSection>

                {/* Main Interface */}
                <BrutalSection className="py-16 bg-white dark:bg-black">
                    <div className="max-w-7xl mx-auto">
                        <BrutalHeadline size="giant" className="mb-16 text-center text-black dark:text-white">
                            OPERATIONS
                        </BrutalHeadline>

                        <Tabs defaultValue="vault" className="space-y-12">
                            <TabsList className="grid w-full grid-cols-2 border-4 border-black dark:border-white bg-white dark:bg-gray-900 h-16">
                                <TabsTrigger 
                                    value="vault" 
                                    className="font-brutal font-black uppercase text-xl h-full data-[state=active]:bg-black data-[state=active]:dark:bg-white data-[state=active]:text-white data-[state=active]:dark:text-black text-black dark:text-white"
                                >
                                    VAULT OPERATIONS
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="token" 
                                    className="font-brutal font-black uppercase text-xl h-full data-[state=active]:bg-black data-[state=active]:dark:bg-white data-[state=active]:text-white data-[state=active]:dark:text-black text-black dark:text-white"
                                >
                                    TOKEN OPERATIONS
                                </TabsTrigger>
                            </TabsList>

                            {/* Vault Operations */}
                            <TabsContent value="vault" className="space-y-12">
                                <BrutalGrid cols={2} className="gap-8">
                                    {/* Deposit */}
                                    <BrutalBox className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-8" border>
                                        <BrutalHeadline size="lg" className="mb-6 text-black dark:text-white flex items-center gap-4">
                                            <ArrowUpRight className="h-8 w-8" />
                                            DEPOSIT ASSETS
                                        </BrutalHeadline>
                                        <BrutalText variant="mono" className="mb-8 text-black dark:text-white">
                                            DEPOSIT ASSETS TO MINT VAULT SHARES AND EARN YIELD
                                        </BrutalText>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <BrutalText variant="brutal" className="mb-3 text-black dark:text-white">
                                                    AMOUNT
                                                </BrutalText>
                                                <Input
                                                    type="number"
                                                    placeholder="0.0"
                                                    value={depositAmount}
                                                    onChange={(e) => setDepositAmount(e.target.value)}
                                                    className="border-4 border-black dark:border-white font-mono text-xl h-16 bg-white dark:bg-gray-800 text-black dark:text-white"
                                                />
                                                {depositPreview.data && (
                                                    <BrutalText variant="mono" size="sm" className="mt-2 text-gray-600 dark:text-gray-400">
                                                        WILL RECEIVE: {Number(depositPreview.data).toFixed(6)} SHARES
                                                    </BrutalText>
                                                )}
                                            </div>
                                            <Button
                                                onClick={handleDeposit}
                                                disabled={!depositAmount || vaultOperations.isPending}
                                                className="w-full font-brutal font-black uppercase text-xl h-16 border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                                            >
                                                {vaultOperations.isPending ? 'DEPOSITING...' : 'DEPOSIT'}
                                            </Button>
                                        </div>
                                    </BrutalBox>

                                    {/* Withdraw */}
                                    <BrutalBox className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-8" border>
                                        <BrutalHeadline size="lg" className="mb-6 text-black dark:text-white flex items-center gap-4">
                                            <ArrowDownLeft className="h-8 w-8" />
                                            WITHDRAW ASSETS
                                        </BrutalHeadline>
                                        <BrutalText variant="mono" className="mb-8 text-black dark:text-white">
                                            WITHDRAW YOUR ASSETS FROM THE VAULT
                                        </BrutalText>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <BrutalText variant="brutal" className="mb-3 text-black dark:text-white">
                                                    AMOUNT
                                                </BrutalText>
                                                <Input
                                                    type="number"
                                                    placeholder="0.0"
                                                    value={withdrawAmount}
                                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                                    className="border-4 border-black dark:border-white font-mono text-xl h-16 bg-white dark:bg-gray-800 text-black dark:text-white"
                                                />
                                                {withdrawPreview.data && (
                                                    <BrutalText variant="mono" size="sm" className="mt-2 text-gray-600 dark:text-gray-400">
                                                        WILL BURN: {Number(withdrawPreview.data).toFixed(6)} SHARES
                                                    </BrutalText>
                                                )}
                                            </div>
                                            <Button
                                                onClick={handleWithdraw}
                                                disabled={!withdrawAmount || vaultOperations.isPending}
                                                className="w-full font-brutal font-black uppercase text-xl h-16 border-4 border-black dark:border-white bg-white dark:bg-gray-900 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                                                variant="outline"
                                            >
                                                {vaultOperations.isPending ? 'WITHDRAWING...' : 'WITHDRAW'}
                                            </Button>
                                        </div>
                                    </BrutalBox>
                                </BrutalGrid>

                                {/* Vault Details */}
                                <BrutalBox className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-8" border>
                                    <BrutalHeadline size="lg" className="mb-8 text-black dark:text-white">
                                        VAULT DETAILS
                                    </BrutalHeadline>
                                    
                                    <BrutalGrid cols={2} className="gap-8">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">VAULT ADDRESS:</BrutalText>
                                                <Badge variant="outline" className="font-mono border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-1">
                                                    {vaultInfo.vaultAddress ? `${vaultInfo.vaultAddress.slice(0, 6)}...${vaultInfo.vaultAddress.slice(-4)}` : 'N/A'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">TOTAL SUPPLY:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{vaultInfo.formattedTotalSupply}</BrutalText>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">ASSET ADDRESS:</BrutalText>
                                                <Badge variant="outline" className="font-mono border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-1">
                                                    {vaultInfo.asset ? `${vaultInfo.asset.slice(0, 6)}...${vaultInfo.asset.slice(-4)}` : 'N/A'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">YOUR SHARES:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{vaultBalance.formattedShares}</BrutalText>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">MAX WITHDRAW:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{vaultBalance.formattedMaxWithdraw}</BrutalText>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">MAX REDEEM:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{vaultBalance.formattedMaxRedeem}</BrutalText>
                                            </div>
                                        </div>
                                    </BrutalGrid>
                                </BrutalBox>
                            </TabsContent>

                            {/* Token Operations */}
                            <TabsContent value="token" className="space-y-12">
                                <BrutalGrid cols={2} className="gap-8">
                                    {/* Staking */}
                                    <BrutalBox className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-8" border>
                                        <BrutalHeadline size="lg" className="mb-6 text-black dark:text-white">
                                            STAKE PLATFORM TOKENS
                                        </BrutalHeadline>
                                        <BrutalText variant="mono" className="mb-8 text-black dark:text-white">
                                            STAKE {tokenInfo.symbol || 'VLKR'} TOKENS TO EARN REWARDS AND PARTICIPATE IN GOVERNANCE
                                        </BrutalText>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <BrutalText variant="brutal" className="mb-3 text-black dark:text-white">
                                                    AMOUNT TO STAKE
                                                </BrutalText>
                                                <Input
                                                    type="number"
                                                    placeholder="0.0"
                                                    value={stakeAmount}
                                                    onChange={(e) => setStakeAmount(e.target.value)}
                                                    className="border-4 border-black dark:border-white font-mono text-xl h-16 bg-white dark:bg-gray-800 text-black dark:text-white"
                                                />
                                            </div>
                                            <Button
                                                onClick={handleStake}
                                                disabled={!stakeAmount || tokenOperations.isPending}
                                                className="w-full font-brutal font-black uppercase text-xl h-16 border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                                            >
                                                {tokenOperations.isPending ? 'STAKING...' : 'STAKE TOKENS'}
                                            </Button>
                                        </div>
                                    </BrutalBox>

                                    {/* Rewards */}
                                    <BrutalBox className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-8" border>
                                        <BrutalHeadline size="lg" className="mb-6 text-black dark:text-white">
                                            STAKING REWARDS
                                        </BrutalHeadline>
                                        <BrutalText variant="mono" className="mb-8 text-black dark:text-white">
                                            VIEW AND CLAIM YOUR STAKING REWARDS
                                        </BrutalText>
                                        
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <BrutalText variant="brutal" className="text-black dark:text-white">STAKED BALANCE:</BrutalText>
                                                    <BrutalText variant="mono" className="text-black dark:text-white">{tokenBalance.formattedStakedBalance}</BrutalText>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <BrutalText variant="brutal" className="text-black dark:text-white">PENDING REWARDS:</BrutalText>
                                                    <BrutalText variant="mono" className="text-green-500">{tokenBalance.formattedPendingRewards}</BrutalText>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleClaimRewards}
                                                disabled={tokenOperations.isPending}
                                                className="w-full font-brutal font-black uppercase text-xl h-16 border-4 border-black dark:border-white bg-white dark:bg-gray-900 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                                                variant="outline"
                                            >
                                                {tokenOperations.isPending ? 'CLAIMING...' : 'CLAIM REWARDS'}
                                            </Button>
                                        </div>
                                    </BrutalBox>
                                </BrutalGrid>

                                {/* Token Details */}
                                <BrutalBox className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-8" border>
                                    <BrutalHeadline size="lg" className="mb-8 text-black dark:text-white">
                                        TOKEN INFORMATION
                                    </BrutalHeadline>
                                    
                                    <BrutalGrid cols={2} className="gap-8">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">TOKEN NAME:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{tokenInfo.name || 'Valkyrie Token'}</BrutalText>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">SYMBOL:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{tokenInfo.symbol || 'VLKR'}</BrutalText>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">TOTAL SUPPLY:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{tokenInfo.formattedTotalSupply}</BrutalText>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">YOUR BALANCE:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{tokenBalance.formattedBalance}</BrutalText>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">STAKED AMOUNT:</BrutalText>
                                                <BrutalText variant="mono" className="text-black dark:text-white">{tokenBalance.formattedStakedBalance}</BrutalText>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <BrutalText variant="brutal" className="text-black dark:text-white">TOKEN ADDRESS:</BrutalText>
                                                <Badge variant="outline" className="font-mono border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-1">
                                                    {tokenInfo.tokenAddress ? `${tokenInfo.tokenAddress.slice(0, 6)}...${tokenInfo.tokenAddress.slice(-4)}` : 'N/A'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </BrutalGrid>
                                </BrutalBox>
                            </TabsContent>
                        </Tabs>
                    </div>
                </BrutalSection>

                {/* Recent Transactions */}
                {pendingTransactions.length > 0 && (
                    <BrutalSection className="py-16 bg-gray-50 dark:bg-gray-900 border-t-4 border-black dark:border-white">
                        <div className="max-w-7xl mx-auto">
                            <BrutalHeadline size="giant" className="mb-12 text-center text-black dark:text-white">
                                RECENT TRANSACTIONS
                            </BrutalHeadline>
                            
                            <BrutalBox className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-8" border>
                                <div className="space-y-4">
                                    {pendingTransactions.slice(0, 5).map((tx, index) => (
                                        <div key={index} className="flex items-center justify-between p-6 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-700">
                                            <div className="flex items-center gap-6">
                                                <Badge variant="outline" className="font-brutal font-black uppercase border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2">
                                                    {tx.type.replace('_', ' ')}
                                                </Badge>
                                                <BrutalText variant="mono" className="text-black dark:text-white">
                                                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                                </BrutalText>
                                            </div>
                                            <Badge
                                                variant={tx.status === 'confirmed' ? 'default' : 'secondary'}
                                                className="font-brutal font-black uppercase border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2"
                                            >
                                                {tx.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </BrutalBox>
                        </div>
                    </BrutalSection>
                )}
            </div>
        </WalletGuard>
    )
} 