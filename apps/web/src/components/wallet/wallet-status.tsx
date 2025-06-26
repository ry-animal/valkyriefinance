'use client';

import { Badge } from '@valkyrie/ui';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { getChainById } from '@/lib/wagmi-config';

export function WalletStatus() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const chain = getChainById(chainId);

  const { data: balance } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });

  if (!isConnected || !address) {
    return (
      <div className="text-sm text-muted-foreground">
        <Badge variant="outline">Disconnected</Badge>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Network:</span>
        <Badge variant="outline">{chain?.name || 'Unknown'}</Badge>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Address:</span>
        <code className="text-xs font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </code>
      </div>

      {balance && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Balance:</span>
          <span className="font-medium">
            {Number(balance.formatted).toFixed(4)} {balance.symbol}
          </span>
        </div>
      )}
    </div>
  );
}
