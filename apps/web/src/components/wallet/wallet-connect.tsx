'use client';

import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@valkyrie/ui';

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" className="flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        Loading...
      </Button>
    );
  }

  // Use Reown AppKit's built-in button
  return <w3m-button />;
}
