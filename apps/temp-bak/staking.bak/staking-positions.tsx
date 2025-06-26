'use client';

import { Badge, Button, Card, CardContent } from '@valkyrie/ui';
import { Clock, DollarSign, Lock, TrendingUp, Unlock } from 'lucide-react';
import { useAccount } from 'wagmi';

// Mock data for demonstration
const mockPositions = [
  {
    id: '1',
    type: 'sVLK' as const,
    amount: '500.0',
    currentValue: '520.5',
    apy: '8.5',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    type: 'veVLK' as const,
    amount: '1000.0',
    veVlkAmount: '250.0',
    lockDuration: '1 Year',
    unlockDate: new Date('2025-01-15'),
    votingPower: '250.0',
    apy: '20.0',
    nftId: '42',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    type: 'veVLK' as const,
    amount: '2000.0',
    veVlkAmount: '1000.0',
    lockDuration: '2 Years',
    unlockDate: new Date('2026-01-15'),
    votingPower: '1000.0',
    apy: '28.0',
    nftId: '43',
    createdAt: new Date('2024-01-15'),
  },
];

export function StakingPositions() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Connect your wallet to view your staking positions</p>
      </div>
    );
  }

  const sVlkPositions = mockPositions.filter((p) => p.type === 'sVLK');
  const veVlkPositions = mockPositions.filter((p) => p.type === 'veVLK');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isUnlockable = (unlockDate: Date) => {
    return new Date() >= unlockDate;
  };

  return (
    <div className="space-y-6">
      {/* Liquid Staking Positions */}
      {sVlkPositions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="h-3 w-3 bg-blue-500 rounded-full" />
            Liquid Staking (sVLK)
          </h3>

          {sVlkPositions.map((position) => (
            <Card key={position.id} className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        sVLK
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Since {formatDate(position.createdAt)}
                      </span>
                    </div>
                    <div className="font-mono text-lg font-semibold">
                      {position.amount} VLK → {position.currentValue} sVLK
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>APY: {position.apy}%</span>
                      <span>
                        Earned: +
                        {(parseFloat(position.currentValue) - parseFloat(position.amount)).toFixed(
                          2
                        )}{' '}
                        sVLK
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Add More
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Unstake
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Locked Staking Positions */}
      {veVlkPositions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="h-3 w-3 bg-purple-500 rounded-full" />
            Locked Staking (veVLK)
          </h3>

          {veVlkPositions.map((position) => (
            <Card key={position.id} className="border-purple-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-purple-500 text-purple-700">
                        veVLK #{position.nftId}
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {position.lockDuration}
                      </Badge>
                      {isUnlockable(position.unlockDate!) && (
                        <Badge className="bg-green-500">
                          <Unlock className="h-3 w-3 mr-1" />
                          Unlockable
                        </Badge>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Created {formatDate(position.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <DollarSign className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                      <div className="font-mono font-semibold">{position.amount} VLK</div>
                      <div className="text-xs text-muted-foreground">Locked Amount</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                      <div className="font-mono font-semibold">{position.veVlkAmount} veVLK</div>
                      <div className="text-xs text-muted-foreground">Voting Power</div>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 mx-auto text-green-600 mb-1" />
                      <div className="font-semibold text-green-600">{position.apy}%</div>
                      <div className="text-xs text-muted-foreground">Current APY</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                      <div className="font-semibold">{formatDate(position.unlockDate!)}</div>
                      <div className="text-xs text-muted-foreground">Unlock Date</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Extend Lock
                    </Button>
                    <Button variant="outline" size="sm">
                      Delegate
                    </Button>
                    {isUnlockable(position.unlockDate!) ? (
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        <Unlock className="h-4 w-4 mr-1" />
                        Withdraw
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Lock className="h-4 w-4 mr-1" />
                        Locked
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sVlkPositions.length === 0 && veVlkPositions.length === 0 && (
        <div className="text-center py-12">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Staking Positions</h3>
          <p className="text-muted-foreground mb-6">
            Start staking VLK to earn rewards and participate in governance
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline">Start Liquid Staking</Button>
            <Button>Create Locked Position</Button>
          </div>
        </div>
      )}
    </div>
  );
}
