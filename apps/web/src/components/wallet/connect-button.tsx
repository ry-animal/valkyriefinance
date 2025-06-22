'use client';

import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@valkyrie/ui';

export function ConnectButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="default"
        className="flex items-center gap-2 font-brutal font-black uppercase tracking-widest shadow-brutal border-4 border-black"
      >
        <Wallet className="w-5 h-5" />
        CONNECT
      </Button>
    );
  }

  // Use Reown AppKit's built-in button with secure styling
  return (
    <div className="brutal-wallet-wrapper">
      {/* Secure: Use CSS module or external stylesheet instead of inline styles */}
      <div className="w3m-brutal-theme">
        <w3m-button />
      </div>
    </div>
  );
}
