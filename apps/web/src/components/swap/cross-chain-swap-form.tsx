'use client'

import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { trpc } from '@/utils/trpc'
import { useAccount, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'

// Mock data for now
const SUPPORTED_CHAINS = [
    { id: 'ETH', name: 'Ethereum' },
    { id: 'ARBITRUM', name: 'Arbitrum' },
    { id: 'POLYGON', name: 'Polygon' },
    { id: 'OPTIMISM', name: 'Optimism' },
    { id: 'BASE', name: 'Base' },
]

const MOCK_TOKENS: Record<string, { address: string; symbol: string }[]> = {
    ETH: [{ address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'ETH' }, { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' }],
    ARBITRUM: [{ address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'ETH' }, { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC' }],
    POLYGON: [{ address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'MATIC' }, { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC' }],
    OPTIMISM: [{ address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'ETH' }, { address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', symbol: 'USDC' }],
    BASE: [{ address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'ETH' }, { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913', symbol: 'USDC' }],
}

export function CrossChainSwapForm() {
    const [fromChain, setFromChain] = useState('ARBITRUM')
    const [toChain, setToChain] = useState('BASE_SEPOLIA') // Target our vault chain
    const [fromToken, setFromToken] = useState(MOCK_TOKENS['ARBITRUM'][1].address) // Default to USDC on Arbitrum
    const [toToken, setToToken] = useState('0x45127aA113A3543971253483a1f49553a81b326B') // Our vault asset on Base Sepolia
    const [amount, setAmount] = useState('')
    const [debouncedAmount] = useDebounce(amount, 500)

    const { address, isConnected } = useAccount()
    const { sendTransactionAsync } = useSendTransaction()

    const quoteQuery = trpc.bridge.getQuote.useQuery(
        {
            srcTokenAddress: fromToken,
            srcTokenBlockchain: fromChain,
            srcTokenAmount: debouncedAmount,
            dstTokenAddress: toToken,
            dstTokenBlockchain: 'BASE_SEPOLIA',
        },
        {
            enabled: !!debouncedAmount && parseFloat(debouncedAmount) > 0 && isConnected,
            staleTime: 15000, // 15 seconds
        }
    )

    const getSwapMutation = trpc.bridge.getSwap.useMutation()

    const handleSwap = async () => {
        if (!address || !quoteQuery.data) return

        try {
            const swapData = await getSwapMutation.mutateAsync({
                fromAddress: address,
                srcTokenAddress: fromToken,
                srcTokenBlockchain: fromChain,
                srcTokenAmount: amount,
                dstTokenAddress: toToken,
                dstTokenBlockchain: 'BASE_SEPOLIA',
            })

            if (swapData.transaction) {
                await sendTransactionAsync({
                    to: swapData.transaction.to,
                    data: swapData.transaction.data,
                    value: BigInt(swapData.transaction.value),
                })
            }
        } catch (error) {
            console.error('Swap failed', error)
        }
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Cross-Chain Swap</CardTitle>
                <CardDescription>Swap tokens across different chains seamlessly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">From</label>
                        <Select value={fromChain} onValueChange={setFromChain}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                            <SelectContent>
                                {SUPPORTED_CHAINS.map((chain) => (
                                    <SelectItem key={chain.id} value={chain.id}>
                                        {chain.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">To</label>
                        <Select value={toChain} onValueChange={setToChain} disabled>
                            <SelectTrigger>
                                <SelectValue placeholder="Select chain" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BASE_SEPOLIA">Base Sepolia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">You send</label>
                    <div className="flex gap-2">
                        <Select value={fromToken} onValueChange={setFromToken}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Token" />
                            </SelectTrigger>
                            <SelectContent>
                                {MOCK_TOKENS[fromChain]?.map((token) => (
                                    <SelectItem key={token.address} value={token.address}>
                                        {token.symbol}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="0.0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-right"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">You receive (estimated)</label>
                    <div className="flex gap-2">
                        <Select value={toToken} disabled>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Token" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={toToken}>vUSDC</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="0.0"
                            readOnly
                            value={quoteQuery.data?.estimate?.destinationTokenAmount || ''}
                            className="text-right bg-muted"
                        />
                    </div>
                </div>

                {quoteQuery.isFetching && <p className="text-sm text-center text-muted-foreground">Fetching best quote...</p>}
                {quoteQuery.data && (
                    <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted rounded-lg">
                        <div className="flex justify-between">
                            <span>Rate</span>
                            <span>1 {MOCK_TOKENS[fromChain]?.find(t => t.address === fromToken)?.symbol} ≈ {quoteQuery.data.estimate?.destinationTokenAmount / parseFloat(amount)} vUSDC</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Gas Fee</span>
                            <span>~${quoteQuery.data.fees?.gasTokenFees?.gas.totalUsdAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Est. Time</span>
                            <span>{quoteQuery.data.estimate?.durationInMinutes} minutes</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={isConnected ? handleSwap : () => { }}
                    disabled={!isConnected || quoteQuery.isFetching || !quoteQuery.data || getSwapMutation.isPending}
                >
                    {isConnected ? (getSwapMutation.isPending ? 'Swapping...' : 'Swap') : 'Connect Wallet'}
                </Button>
            </CardFooter>
        </Card>
    )
} 