'use client';

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@valkyrie/ui';
import { AlertCircle, Clock, Lock, TrendingUp, Vote } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';

// Lock duration options (in seconds)
const LOCK_DURATIONS = [
  { value: 90 * 24 * 60 * 60, label: '3 Months', multiplier: 0.0625, apy: '12%' },
  { value: 180 * 24 * 60 * 60, label: '6 Months', multiplier: 0.125, apy: '15%' },
  { value: 365 * 24 * 60 * 60, label: '1 Year', multiplier: 0.25, apy: '20%' },
  { value: 730 * 24 * 60 * 60, label: '2 Years', multiplier: 0.5, apy: '28%' },
  { value: 1460 * 24 * 60 * 60, label: '4 Years', multiplier: 1.0, apy: '35%' },
];

export function LockedStakingForm() {
  const [amount, setAmount] = useState('');
  const [lockDuration, setLockDuration] = useState<number>(365 * 24 * 60 * 60); // Default 1 year
  const [isLocking, setIsLocking] = useState(false);

  const { isConnected } = useAccount();

  // Mock data - will be replaced with actual hooks
  const vlkBalance = 1000n * 10n ** 18n; // 1000 VLK
  const allowance = 0n;
  const isApproving = false;

  const amountWei = amount ? parseEther(amount) : 0n;
  const needsApproval = amountWei > 0n && allowance < amountWei;
  const hasInsufficientBalance = amountWei > vlkBalance;

  const selectedDuration = LOCK_DURATIONS.find((d) => d.value === lockDuration);
  const veVlkAmount =
    selectedDuration && amount
      ? (parseFloat(amount) * selectedDuration.multiplier).toFixed(4)
      : '0';

  const handleLock = async () => {
    if (!isConnected || !amount || hasInsufficientBalance || !selectedDuration) return;

    try {
      setIsLocking(true);

      if (needsApproval) {
        toast.info('Approval required before locking');
        return;
      }

      // TODO: Implement actual locking call
      // await stakingManager.lock(amountWei, lockDuration);

      toast.success(`Successfully locked ${amount} VLK for ${selectedDuration.label}!`);
      setAmount('');
    } catch (error) {
      console.error('Locking failed:', error);
      toast.error('Locking failed. Please try again.');
    } finally {
      setIsLocking(false);
    }
  };

  const handleApproval = async () => {
    try {
      // TODO: Implement actual approval call
      // await approve(amountWei);
      toast.success('Approval successful! You can now lock VLK.');
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error('Approval failed. Please try again.');
    }
  };

  const setMaxAmount = () => {
    if (vlkBalance > 0n) {
      setAmount(formatEther(vlkBalance));
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Connect your wallet to start locked staking</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Amount (VLK)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`font-mono text-lg ${hasInsufficientBalance ? 'border-red-500' : ''}`}
            disabled={isLocking || isApproving}
          />
          <Button variant="outline" onClick={setMaxAmount} disabled={isLocking || isApproving}>
            MAX
          </Button>
        </div>

        {/* Balance Display */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Available: {formatEther(vlkBalance)} VLK</span>
          {hasInsufficientBalance && <span className="text-red-500">Insufficient balance</span>}
        </div>
      </div>

      {/* Lock Duration Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Lock Duration</Label>
        <Select
          value={lockDuration.toString()}
          onValueChange={(value) => setLockDuration(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select lock duration" />
          </SelectTrigger>
          <SelectContent>
            {LOCK_DURATIONS.map((duration) => (
              <SelectItem key={duration.value} value={duration.value.toString()}>
                <div className="flex items-center justify-between w-full">
                  <span>{duration.label}</span>
                  <span className="ml-4 text-sm text-muted-foreground">
                    {duration.multiplier}x voting power • {duration.apy} APY
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lock Summary */}
      {amount && selectedDuration && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">Lock Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-700">VLK to Lock:</span>
              <span className="font-mono font-semibold text-purple-900">{amount} VLK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Lock Duration:</span>
              <span className="font-semibold text-purple-900">{selectedDuration.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">veVLK Received:</span>
              <span className="font-mono font-semibold text-purple-900">{veVlkAmount} veVLK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Voting Power:</span>
              <span className="font-semibold text-purple-900">{selectedDuration.multiplier}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Expected APY:</span>
              <span className="font-semibold text-green-600">{selectedDuration.apy}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-purple-300">
              <span className="text-purple-700">Unlock Date:</span>
              <span className="font-semibold text-purple-900">
                {new Date(Date.now() + lockDuration * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {needsApproval && (
          <Button
            onClick={handleApproval}
            disabled={isApproving || hasInsufficientBalance || !amount}
            className="w-full h-12 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {isApproving ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              'Approve VLK Spending'
            )}
          </Button>
        )}

        <Button
          onClick={handleLock}
          disabled={isLocking || needsApproval || hasInsufficientBalance || !amount}
          className="w-full h-12 text-lg font-semibold bg-purple-500 hover:bg-purple-600"
        >
          {isLocking ? (
            <>
              <Lock className="mr-2 h-4 w-4 animate-spin" />
              Locking VLK...
            </>
          ) : (
            'Lock VLK for veVLK'
          )}
        </Button>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
          <Vote className="h-6 w-6 text-purple-600 mb-2" />
          <h4 className="font-semibold text-purple-900 mb-1">Governance Power</h4>
          <p className="text-sm text-purple-700">
            Vote on protocol decisions and AI strategy parameters
          </p>
        </div>

        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
          <h4 className="font-semibold text-green-900 mb-1">Enhanced Rewards</h4>
          <p className="text-sm text-green-700">Earn higher APY compared to liquid staking</p>
        </div>

        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <Clock className="h-6 w-6 text-blue-600 mb-2" />
          <h4 className="font-semibold text-blue-900 mb-1">Vault Boosting</h4>
          <p className="text-sm text-blue-700">Boost your vault yields up to 2.5x with veVLK</p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-900 mb-1">⚠️ Important Considerations</h4>
          <ul className="space-y-1 text-amber-700">
            <li>• VLK will be locked and cannot be withdrawn until unlock date</li>
            <li>• veVLK NFTs are non-transferable but can be delegated</li>
            <li>• Voting power decays linearly over the lock period</li>
            <li>• Longer locks provide exponentially more voting power</li>
            <li>• You can extend lock duration but cannot reduce it</li>
          </ul>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-1">💡 Pro Tips</h4>
          <ul className="space-y-1 text-blue-700">
            <li>• Create multiple positions with different unlock dates</li>
            <li>• Use veVLK to boost yields in AI-managed vaults</li>
            <li>• Participate in governance to influence AI strategies</li>
            <li>• Consider your liquidity needs before locking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
