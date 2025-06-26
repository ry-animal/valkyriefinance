'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';
import { useAccount } from 'wagmi';
import { useValkyrieTokenBalance, useValkyrieTokenInfo } from '@/hooks/use-valkyrie-token';

export function ValkyrieTokenInfo() {
  const { isConnected } = useAccount();
  const tokenInfo = useValkyrieTokenInfo();
  const tokenBalance = useValkyrieTokenBalance();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valkyrie Token (VLK)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Connect wallet to view token information</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {tokenInfo.name} ({tokenInfo.symbol})
        </CardTitle>
        <Badge variant="outline" className="w-fit">
          {tokenInfo.tokenAddress === '0x0000000000000000000000000000000000000000'
            ? 'Not Deployed'
            : 'Active'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Your Balance</p>
            <p className="font-medium">
              {tokenBalance.formattedBalance} {tokenInfo.symbol}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Total Supply</p>
            <p className="font-medium">
              {tokenInfo.formattedTotalSupply} {tokenInfo.symbol}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-muted-foreground">Token Address</p>
            <code className="text-xs font-mono break-all">{tokenInfo.tokenAddress}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
