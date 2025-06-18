'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { bt } from '@/lib/theme-utils';
import { cn } from '@/lib/utils';
import { getAppKit } from '@/lib/wagmi-config';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export default function UserMenu() {
  const [mounted, setMounted] = useState(false);
  const _router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after client-side hydration
  if (!mounted) {
    return <Skeleton className="h-9 w-24" />;
  }

  return <UserMenuClient />;
}

function UserMenuClient() {
  const router = useRouter();
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const appKit = getAppKit();
    if (appKit) {
      appKit.open();
    }
  };

  if (isConnecting) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!isConnected) {
    return (
      <Button
        variant="outline"
        onClick={handleConnect}
        data-testid="connect-button"
        className={cn(
          'border-4 border-black dark:border-white',
          'bg-white dark:bg-black text-black dark:text-white',
          'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black',
          'font-brutal font-black uppercase tracking-widest'
        )}
      >
        CONNECT
      </Button>
    );
  }

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'border-4 border-black dark:border-white',
            'bg-white dark:bg-black text-black dark:text-white',
            'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black',
            'font-mono'
          )}
        >
          {truncatedAddress}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('border-4', bt.border, bt.section)}>
        <DropdownMenuLabel className={cn('font-brutal font-black', bt.heading)}>
          WALLET
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={bt.border} />
        <DropdownMenuItem className={cn('font-mono text-xs', bt.body)}>{address}</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            variant="destructive"
            className={cn(
              'w-full border-4 border-red-500 bg-red-500 text-white',
              'hover:bg-red-600 font-brutal font-black uppercase'
            )}
            onClick={() => {
              disconnect();
              router.push('/');
            }}
          >
            DISCONNECT
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
