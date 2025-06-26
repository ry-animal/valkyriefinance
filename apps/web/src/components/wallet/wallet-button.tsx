'use client';

import { Button } from '@valkyrie/ui';
import { Wallet } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { getAppKit } from '@/lib/wagmi-config';

export function WalletButton() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = () => {
    const appKit = getAppKit();
    if (appKit) {
      if (isDisconnected) {
        appKit.open();
      } else {
        disconnect();
      }
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <Button variant="outline" disabled>
        <Wallet className="h-4 w-4 mr-2" />
        Connecting...
      </Button>
    );
  }

  if (address) {
    return (
      <Button variant="outline" onClick={handleClick}>
        <Wallet className="h-4 w-4 mr-2" />
        {formatAddress(address)}
      </Button>
    );
  }

  return (
    <Button onClick={handleClick}>
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
