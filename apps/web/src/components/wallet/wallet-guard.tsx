'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface WalletGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireConnection?: boolean;
}

export function WalletGuard({
  children,
  redirectTo = '/dashboard',
  requireConnection = false,
}: WalletGuardProps) {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (requireConnection && !isConnected) {
      // Redirect to home page if wallet connection is required but not connected
      router.push('/');
    } else if (!requireConnection && isConnected) {
      // Redirect away from home if wallet is connected
      router.push(redirectTo);
    }
  }, [mounted, isConnected, requireConnection, redirectTo, router]);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  // For home page (requireConnection = false), don't render if connected
  if (!requireConnection && isConnected) {
    return null;
  }

  // For protected pages (requireConnection = true), don't render if not connected
  if (requireConnection && !isConnected) {
    return null;
  }

  return <>{children}</>;
}
