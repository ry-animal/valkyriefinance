'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';
import { useAccount } from 'wagmi';
import Loader from '@/components/loader';
import { trpc } from '@/utils/trpc';

export function StakingDashboard() {
  const { address, isConnected } = useAccount();

  const {
    data: stakingData,
    isLoading,
    error,
  } = trpc.staking.getStakingOverview.useQuery(undefined, {
    enabled: isConnected && !!address,
  });

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staking Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect your wallet to view your staking dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staking Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staking Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading staking data: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staking Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Staked</p>
              <p className="text-2xl font-bold">{stakingData?.totalStaked || '0'} VLK</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Rewards Earned</p>
              <p className="text-2xl font-bold">{stakingData?.totalRewards || '0'} VLK</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">APR</p>
              <p className="text-2xl font-bold">{stakingData?.currentApr || '0'}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Liquid Staking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Staked Amount</p>
                <p className="text-xl font-semibold">
                  {stakingData?.liquidStaking?.amount || '0'} VLK
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">sVLK Balance</p>
                <p className="text-xl font-semibold">
                  {stakingData?.liquidStaking?.sVlkBalance || '0'} sVLK
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Locked Staking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Locked Amount</p>
                <p className="text-xl font-semibold">
                  {stakingData?.lockedStaking?.amount || '0'} VLK
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">veVLK Balance</p>
                <p className="text-xl font-semibold">
                  {stakingData?.lockedStaking?.veVlkBalance || '0'} veVLK
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Lock End Date</p>
                <p className="text-sm">
                  {stakingData?.lockedStaking?.lockEndDate
                    ? new Date(stakingData.lockedStaking.lockEndDate).toLocaleDateString()
                    : 'Not locked'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
