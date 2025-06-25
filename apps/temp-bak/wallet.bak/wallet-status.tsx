'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount, useBalance, useEnsName } from 'wagmi';

export function WalletStatus() {
  const { address, isConnected, chain, status } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const openInExplorer = () => {
    if (address && chain?.blockExplorers?.default) {
      window.open(`${chain.blockExplorers.default.url}/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>No wallet connected</p>
            <p className="text-sm mt-1">Connect your wallet to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Wallet Status
          <Badge variant={status === 'connected' ? 'default' : 'secondary'}>{status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm flex-1">
              {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </p>
            <Button size="sm" variant="ghost" onClick={copyAddress}>
              <Copy className="h-3 w-3" />
            </Button>
            {chain?.blockExplorers?.default && (
              <Button size="sm" variant="ghost" onClick={openInExplorer}>
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Network</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm">{chain?.name}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-sm font-medium">
            {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
