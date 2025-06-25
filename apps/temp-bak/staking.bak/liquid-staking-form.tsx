'use client';

import { Button, Input, Label } from '@valkyrie/ui';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';

export function LiquidStakingForm() {
  const [amount, setAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');

  const { isConnected } = useAccount();

  // Mock data - will be replaced with actual hooks
  const vlkBalance = 1000n * 10n ** 18n; // 1000 VLK
  const allowance = 0n;
  const isApproving = false;

  const amountWei = amount ? parseEther(amount) : 0n;
  const needsApproval = amountWei > 0n && allowance < amountWei;
  const hasInsufficientBalance = amountWei > vlkBalance;

  const handleStake = async () => {
    if (!isConnected || !amount || hasInsufficientBalance) return;

    try {
      setIsStaking(true);

      if (needsApproval) {
        toast.info('Approval required before staking');
        return;
      }

      // TODO: Implement actual staking call
      // await stakingManager.stake(amountWei);

      toast.success(`Successfully staked ${amount} VLK for sVLK!`);
      setAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
      toast.error('Staking failed. Please try again.');
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!isConnected || !amount) return;

    try {
      setIsUnstaking(true);

      // TODO: Implement actual unstaking call
      // await stakingManager.unstake(amountWei);

      toast.success(`Successfully unstaked ${amount} sVLK for VLK!`);
      setAmount('');
    } catch (error) {
      console.error('Unstaking failed:', error);
      toast.error('Unstaking failed. Please try again.');
    } finally {
      setIsUnstaking(false);
    }
  };

  const handleApproval = async () => {
    try {
      // TODO: Implement actual approval call
      // await approve(amountWei);
      toast.success('Approval successful! You can now stake.');
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error('Approval failed. Please try again.');
    }
  };

  const setMaxAmount = () => {
    if (activeTab === 'stake' && vlkBalance > 0n) {
      setAmount(formatEther(vlkBalance));
    } else if (activeTab === 'unstake') {
      // TODO: Get sVLK balance
      // setAmount(formatEther(sVlkBalance));
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Connect your wallet to start liquid staking</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="flex rounded-lg border p-1">
        <button
          type="button"
          onClick={() => setActiveTab('stake')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'stake'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Stake VLK → sVLK
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('unstake')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'unstake'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Unstake sVLK → VLK
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Amount ({activeTab === 'stake' ? 'VLK' : 'sVLK'})
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`font-mono text-lg ${hasInsufficientBalance ? 'border-red-500' : ''}`}
            disabled={isStaking || isUnstaking || isApproving}
          />
          <Button
            variant="outline"
            onClick={setMaxAmount}
            disabled={isStaking || isUnstaking || isApproving}
          >
            MAX
          </Button>
        </div>

        {/* Balance Display */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Available: {formatEther(vlkBalance)} {activeTab === 'stake' ? 'VLK' : 'sVLK'}
          </span>
          {hasInsufficientBalance && <span className="text-red-500">Insufficient balance</span>}
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span>Exchange Rate:</span>
          <span className="font-mono">1 VLK = 1 sVLK</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span>Current APY:</span>
          <span className="font-semibold text-blue-600">8.5%</span>
        </div>
        {amount && (
          <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t">
            <span>You will {activeTab === 'stake' ? 'receive' : 'get back'}:</span>
            <span className="font-mono font-semibold">
              {amount} {activeTab === 'stake' ? 'sVLK' : 'VLK'}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {activeTab === 'stake' && needsApproval && (
          <Button
            onClick={handleApproval}
            disabled={isApproving || hasInsufficientBalance || !amount}
            className="w-full h-12 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              'Approve VLK Spending'
            )}
          </Button>
        )}

        <Button
          onClick={activeTab === 'stake' ? handleStake : handleUnstake}
          disabled={
            (activeTab === 'stake' &&
              (isStaking || needsApproval || hasInsufficientBalance || !amount)) ||
            (activeTab === 'unstake' && (isUnstaking || !amount))
          }
          className={`w-full h-12 text-lg font-semibold ${
            activeTab === 'stake' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {(activeTab === 'stake' && isStaking) || (activeTab === 'unstake' && isUnstaking) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {activeTab === 'stake' ? 'Staking...' : 'Unstaking...'}
            </>
          ) : (
            `${activeTab === 'stake' ? 'Stake' : 'Unstake'} ${activeTab === 'stake' ? 'VLK' : 'sVLK'}`
          )}
        </Button>
      </div>

      {/* Success State */}
      {!needsApproval && activeTab === 'stake' && amount && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700">Ready to stake - VLK spending approved</span>
        </div>
      )}

      {/* Info Cards */}
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-1">Liquid Staking Benefits</h4>
          <ul className="space-y-1 text-blue-700">
            <li>• Earn staking rewards while keeping tokens liquid</li>
            <li>• Use sVLK in DeFi protocols as collateral</li>
            <li>• Trade sVLK on DEXs without unstaking delay</li>
            <li>• Automatic reward compounding</li>
          </ul>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-900 mb-1">Important Notes</h4>
          <ul className="space-y-1 text-amber-700">
            <li>• sVLK can be instantly converted back to VLK</li>
            <li>• No lock-up period or withdrawal delays</li>
            <li>• Lower APY compared to locked staking (veVLK)</li>
            <li>• No governance voting power with sVLK</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
