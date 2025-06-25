'use client';

import dynamic from 'next/dynamic';
import NextImage from 'next/image';
import Link from 'next/link';
import { HeaderNavigation } from '@/components/header-navigation';

// import { ModeToggle } from '@/components/mode-toggle';

// Temporarily disabled due to UI package build issues
// const UserMenu = dynamic(() => import('@/components/user-menu'), {
//   ssr: false,
//   loading: () => <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />,
// });

const NAVIGATION_LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/dashboard', label: 'DASHBOARD' },
  { to: '/vault', label: 'VAULT' },
  { to: '/hyperliquid', label: 'HYPERLIQUID' },
  { to: '/ai-analytics', label: 'AI Analytics' },
  // { to: '/swap', label: 'SWAP' },
];

export default function Header() {
  return (
    <header className="bg-white dark:bg-black border-b-4 border-black dark:border-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-4">
            <NextImage
              src="/favicon.png"
              alt="Valkyrie"
              width={72}
              height={72}
              className="dark:invert"
              priority
            />
            <div className="font-black text-3xl uppercase tracking-tighter text-black dark:text-white">
              VALKYRIE
            </div>
          </Link>

          <HeaderNavigation links={NAVIGATION_LINKS} />

          <div className="hidden md:flex items-center gap-4">
            {/* <ModeToggle /> */}
            {/* <UserMenu /> */}
            <div className="text-sm text-gray-500">Coming Soon</div>
          </div>
        </div>
      </div>
    </header>
  );
}
