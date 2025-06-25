'use client';

import { Badge, Button, Card, CardContent } from '@valkyrie/ui';
import { Calendar, DollarSign, ExternalLink, TrendingUp } from 'lucide-react';
import { useAccount } from 'wagmi';

// Mock data for demonstration
const mockRewards = [
  {
    id: '1',
    type: 'sVLK',
    amount: '12.50',
    asset: 'USDC',
    date: new Date('2024-01-20'),
    txHash: '0x1234...5678',
    status: 'claimed',
  },
  {
    id: '2',
    type: 'veVLK',
    amount: '45.75',
    asset: 'USDC',
    date: new Date('2024-01-19'),
    txHash: '0x2345...6789',
    status: 'claimed',
    nftId: '42',
  },
  {
    id: '3',
    type: 'sVLK',
    amount: '8.25',
    asset: 'USDC',
    date: new Date('2024-01-18'),
    txHash: '0x3456...7890',
    status: 'claimed',
  },
  {
    id: '4',
    type: 'veVLK',
    amount: '32.10',
    asset: 'USDC',
    date: new Date('2024-01-17'),
    txHash: '0x4567...8901',
    status: 'claimed',
    nftId: '43',
  },
];

export function RewardHistory() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Connect your wallet to view your reward history</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalRewards = mockRewards.reduce((sum, reward) => sum + parseFloat(reward.amount), 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-900">${totalRewards.toFixed(2)}</div>
            <div className="text-sm text-green-700">Total Rewards Claimed</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-900">
              {mockRewards.filter((r) => r.type === 'sVLK').length}
            </div>
            <div className="text-sm text-blue-700">sVLK Claims</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-900">
              {mockRewards.filter((r) => r.type === 'veVLK').length}
            </div>
            <div className="text-sm text-purple-700">veVLK Claims</div>
          </CardContent>
        </Card>
      </div>

      {/* Reward List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Claims</h3>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </div>

        {mockRewards.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Rewards Yet</h3>
              <p className="text-muted-foreground">
                Start staking to earn rewards that will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {mockRewards.map((reward) => (
              <Card key={reward.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Type Badge */}
                      <Badge
                        variant={reward.type === 'sVLK' ? 'secondary' : 'outline'}
                        className={
                          reward.type === 'sVLK'
                            ? 'bg-blue-100 text-blue-700'
                            : 'border-purple-500 text-purple-700'
                        }
                      >
                        {reward.type}
                        {reward.nftId && ` #${reward.nftId}`}
                      </Badge>

                      {/* Amount */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-mono text-lg font-semibold text-green-600">
                          ${reward.amount}
                        </span>
                        <span className="text-sm text-muted-foreground">{reward.asset}</span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(reward.date)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 border-green-200 text-green-700"
                      >
                        Claimed
                      </Badge>

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {mockRewards.length > 0 && (
        <div className="text-center">
          <Button variant="outline">Load More History</Button>
        </div>
      )}
    </div>
  );
}
