'use client';

// import {
//   Button,
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   Skeleton,
// } from '@valkyrie/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { getAppKit } from '@/lib/wagmi-config';

export default function UserMenu() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after client-side hydration
  if (!mounted) {
    return <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>;
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
    return <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>;
  }

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={handleConnect}
        data-testid="connect-button"
        className="px-4 py-2 border-4 border-black bg-white text-black hover:bg-black hover:text-white font-bold uppercase"
      >
        CONNECT
      </button>
    );
  }

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="relative">
      <button
        type="button"
        className="px-4 py-2 border-4 border-black bg-white text-black hover:bg-black hover:text-white font-mono"
      >
        {truncatedAddress}
      </button>
      <div className="hidden absolute right-0 mt-2 w-48 bg-white border-4 border-black shadow-lg">
        <div className="p-2 font-bold">WALLET</div>
        <div className="border-t border-black"></div>
        <div className="p-2 text-xs font-mono">{address}</div>
        <button
          type="button"
          className="w-full p-2 border-4 border-red-500 bg-red-500 text-white hover:bg-red-600 font-bold uppercase"
          onClick={() => {
            disconnect();
            router.push('/');
          }}
        >
          DISCONNECT
        </button>
      </div>
    </div>
  );
}
