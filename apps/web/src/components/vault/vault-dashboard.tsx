'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type SimpleTokenBalance, useSimpleTokenBalances } from '@/hooks/use-simple-token-balances';
import {
  useAssetAllowance,
  useAssetApproval,
  useVaultBalance,
  useVaultInfo,
  useVaultOperations,
} from '@/hooks/use-valkyrie-vault';
import { bt } from '@/lib/theme-utils';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Loader2,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatEther, formatUnits, parseEther } from 'viem';
import { useAccount, useChainId } from 'wagmi';

export function VaultDashboard() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawShares, setWithdrawShares] = useState('');
  const [activeTab, setActiveTab] = useState('deposit');

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { addNotification } = useUIStore();

  // Contract data hooks
  const vaultInfo = useVaultInfo();
  const userBalance = useVaultBalance();
  const { allowance, assetAddress } = useAssetAllowance();
  const balances = useSimpleTokenBalances();

  // Contract operations
  const { deposit, withdraw } = useVaultOperations();
  const { approve, approveMax, isPending: approvalPending } = useAssetApproval();

  // Get asset balance
  const assetBalance =
    balances.tokenBalances.find(
      (token: SimpleTokenBalance) => token.address.toLowerCase() === assetAddress?.toLowerCase()
    )?.balance || 0n;

  // Calculate derived values
  const userAssetValue = userBalance.assetsFromShares;

  const depositAmountWei = depositAmount ? parseEther(depositAmount) : 0n;
  const withdrawSharesWei = withdrawShares ? parseEther(withdrawShares) : 0n;

  const needsApproval = depositAmountWei > 0n && allowance < depositAmountWei;
  const hasInsufficientBalance = depositAmountWei > assetBalance;
  const hasInsufficientShares = withdrawSharesWei > userBalance.shares;

  const handleDeposit = async () => {
    if (!isConnected || !depositAmount) return;

    try {
      if (needsApproval) {
        toast.info('Approval required before deposit');
        return;
      }

      await deposit(depositAmount);
      setDepositAmount('');
      toast.success('Deposit successful!');
    } catch (error) {
      console.error('Deposit failed:', error);
      toast.error('Deposit failed');
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !withdrawShares) return;

    try {
      await withdraw(formatEther(withdrawSharesWei));
      setWithdrawShares('');
      toast.success('Withdrawal successful!');
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Withdrawal failed');
    }
  };

  const handleApproval = async () => {
    try {
      if (depositAmountWei > 0n) {
        await approve(depositAmount);
      } else {
        await approveMax();
      }
      toast.success('Approval successful!');
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error('Approval failed');
    }
  };

  const setMaxDeposit = () => {
    if (assetBalance > 0n) {
      setDepositAmount(formatEther(assetBalance));
    }
  };

  const setMaxWithdraw = () => {
    if (userBalance.shares > 0n) {
      setWithdrawShares(formatEther(userBalance.shares));
    }
  };

  // Loading states
  const isLoading = balances.isLoading;
  const operationLoading = false; // Operations are handled with try/catch

  if (!isConnected) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center min-h-[400px] space-y-4', bt.page)}
      >
        <AlertTriangle className={cn('h-12 w-12', bt.muted)} />
        <h2 className={cn('text-2xl font-bold', bt.heading)}>Wallet Not Connected</h2>
        <p className={cn('text-center max-w-md', bt.muted)}>
          Please connect your wallet to access the vault dashboard and start earning AI-optimized
          yields.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', bt.page)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={cn('border-4', bt.border, bt.section)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn('text-sm font-medium', bt.heading)}>Your Deposit</CardTitle>
            <DollarSign className={cn('h-4 w-4', bt.muted)} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={cn('text-2xl font-bold', bt.heading)}>
                {formatEther(userAssetValue)} ETH
              </div>
            )}
            <p className={cn('text-xs', bt.muted)}>
              {formatEther(userBalance.shares)} vault shares
            </p>
          </CardContent>
        </Card>

        <Card className={cn('border-4', bt.border, bt.section)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn('text-sm font-medium', bt.heading)}>Current APY</CardTitle>
            <TrendingUp className={cn('h-4 w-4', bt.muted)} />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', bt.heading)}>12.5%</div>
            <p className={cn('text-xs', bt.muted)}>AI-optimized yield</p>
          </CardContent>
        </Card>

        <Card className={cn('border-4', bt.border, bt.section)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn('text-sm font-medium', bt.heading)}>Share Price</CardTitle>
            <Target className={cn('h-4 w-4', bt.muted)} />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', bt.heading)}>
              {vaultInfo.totalAssets > 0n && vaultInfo.totalSupply
                ? formatUnits((vaultInfo.totalAssets * 10n ** 18n) / vaultInfo.totalSupply, 18)
                : '1.00'}
            </div>
            <p className={cn('text-xs', bt.muted)}>Assets per share</p>
          </CardContent>
        </Card>

        <Card className={cn('border-4', bt.border, bt.section)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn('text-sm font-medium', bt.heading)}>Total TVL</CardTitle>
            <Shield className={cn('h-4 w-4', bt.muted)} />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', bt.heading)}>
              {formatEther(vaultInfo.totalAssets)} ETH
            </div>
            <p className={cn('text-xs', bt.muted)}>Total value locked</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn('grid w-full grid-cols-2', bt.section)}>
          <TabsTrigger value="deposit" className={cn('font-bold', bt.heading)}>
            DEPOSIT
          </TabsTrigger>
          <TabsTrigger value="withdraw" className={cn('font-bold', bt.heading)}>
            WITHDRAW
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          <Card className={cn('border-4', bt.border, bt.section)}>
            <CardHeader>
              <CardTitle className={cn('text-xl font-black', bt.heading)}>DEPOSIT ASSETS</CardTitle>
              <CardDescription className={bt.muted}>
                Deposit ETH to start earning AI-optimized yields
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className={cn('text-sm font-medium', bt.heading)}>Amount (ETH)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className={cn(
                      'font-mono text-lg border-4',
                      bt.border,
                      hasInsufficientBalance && 'border-red-500'
                    )}
                    disabled={operationLoading || approvalPending}
                  />
                  <Button
                    variant="outline"
                    onClick={setMaxDeposit}
                    className={cn('border-4', bt.border)}
                    disabled={operationLoading || approvalPending}
                  >
                    MAX
                  </Button>
                </div>
                {hasInsufficientBalance && (
                  <p className="text-sm text-red-500">
                    Insufficient balance. Available: {formatEther(assetBalance)} ETH
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {needsApproval ? (
                  <Button
                    onClick={handleApproval}
                    disabled={approvalPending || hasInsufficientBalance}
                    className={cn(
                      'w-full h-12 text-lg font-black border-4',
                      bt.border,
                      'bg-yellow-500 hover:bg-yellow-600 text-black'
                    )}
                  >
                    {approvalPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        APPROVING...
                      </>
                    ) : (
                      'APPROVE SPENDING'
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleDeposit}
                    disabled={operationLoading || !depositAmount || hasInsufficientBalance}
                    className={cn(
                      'w-full h-12 text-lg font-black border-4',
                      bt.border,
                      'bg-green-500 hover:bg-green-600 text-black'
                    )}
                  >
                    {operationLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        DEPOSITING...
                      </>
                    ) : (
                      'DEPOSIT ETH'
                    )}
                  </Button>
                )}
              </div>

              {!needsApproval && depositAmountWei > 0n && (
                <div className={cn('p-3 border-2 border-green-500', bt.sectionAlt)}>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Approved for spending</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-6">
          <Card className={cn('border-4', bt.border, bt.section)}>
            <CardHeader>
              <CardTitle className={cn('text-xl font-black', bt.heading)}>
                WITHDRAW ASSETS
              </CardTitle>
              <CardDescription className={bt.muted}>
                Withdraw your vault shares and earned yields
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className={cn('text-sm font-medium', bt.heading)}>Vault Shares</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={withdrawShares}
                    onChange={(e) => setWithdrawShares(e.target.value)}
                    className={cn(
                      'font-mono text-lg border-4',
                      bt.border,
                      hasInsufficientShares && 'border-red-500'
                    )}
                    disabled={operationLoading}
                  />
                  <Button
                    variant="outline"
                    onClick={setMaxWithdraw}
                    className={cn('border-4', bt.border)}
                    disabled={operationLoading}
                  >
                    MAX
                  </Button>
                </div>
                {hasInsufficientShares && (
                  <p className="text-sm text-red-500">
                    Insufficient shares. Available: {formatEther(userBalance.shares)}
                  </p>
                )}
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={operationLoading || !withdrawShares || hasInsufficientShares}
                className={cn(
                  'w-full h-12 text-lg font-black border-4',
                  bt.border,
                  'bg-red-500 hover:bg-red-600 text-white'
                )}
              >
                {operationLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    WITHDRAWING...
                  </>
                ) : (
                  'WITHDRAW ASSETS'
                )}
              </Button>

              {withdrawSharesWei > 0n && (
                <div className={cn('p-3 border-2', bt.border, bt.sectionAlt)}>
                  <div className="text-sm">
                    <span className={bt.muted}>You will receive approximately: </span>
                    <span className={cn('font-mono font-bold', bt.heading)}>
                      {formatEther(withdrawSharesWei)} ETH
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Strategy Status */}
      <Card className={cn('border-4', bt.border, bt.section)}>
        <CardHeader>
          <CardTitle className={cn('text-xl font-black flex items-center gap-2', bt.heading)}>
            <Zap className="h-5 w-5" />
            AI STRATEGY STATUS
          </CardTitle>
          <CardDescription className={bt.muted}>
            Current AI optimization and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={cn('p-4 border-2', bt.border, bt.sectionAlt)}>
              <div className={cn('text-sm font-medium', bt.heading)}>Strategy Status</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={cn('border-green-500 text-green-500', bt.section)}
                >
                  ACTIVE
                </Badge>
              </div>
            </div>

            <div className={cn('p-4 border-2', bt.border, bt.sectionAlt)}>
              <div className={cn('text-sm font-medium', bt.heading)}>Next Rebalance</div>
              <div className={cn('text-lg font-mono', bt.heading)}>2h 34m</div>
            </div>

            <div className={cn('p-4 border-2', bt.border, bt.sectionAlt)}>
              <div className={cn('text-sm font-medium', bt.heading)}>Confidence Score</div>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={87} className="flex-1" />
                <span className={cn('text-sm font-mono', bt.heading)}>87%</span>
              </div>
            </div>
          </div>

          <div className={cn('p-4 border-2', bt.border, bt.sectionAlt)}>
            <div className={cn('text-sm font-medium mb-2', bt.heading)}>Latest AI Insight</div>
            <p className={cn('font-mono text-sm', bt.body)}>
              &ldquo;Market volatility detected. Adjusting liquidity concentration to minimize
              impermanent loss. Expected yield improvement: +2.3% over next 24h.&rdquo;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
