import NextImage from 'next/image';
import Link from 'next/link';
import { memo, useMemo } from 'react';
import { HeaderNavigation } from '@/components/header-navigation';
import { ModeToggle } from '@/components/mode-toggle';
import UserMenu from '@/components/user-menu';

// Define navigation links as a constant outside the component to prevent recreation
const NAVIGATION_LINKS: Array<{ to: string; label: string }> = [
  { to: '/', label: 'HOME' },
  { to: '/dashboard', label: 'DASHBOARD' },
  { to: '/vault', label: 'VAULT' },
  { to: '/swap', label: 'SWAP' },
  { to: '/ai', label: 'AI CHAT' },
  { to: '/ai-analytics', label: 'AI Analytics' },
];

// This is now a Server Component - static parts render on server
function Header() {
  // Memoize the links to prevent unnecessary prop changes
  const navigationLinks = useMemo(() => NAVIGATION_LINKS, []);

  return (
    <header className="bg-white dark:bg-black border-b-4 border-black dark:border-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-6">
          {/* Logo - Static Server Component */}
          <Link href="/" className="brutal-hover flex items-center gap-4">
            <NextImage
              src="/favicon.png"
              alt="Valkyrie"
              width={72}
              height={72}
              className="dark:invert"
              priority
            />
            <div className="font-brutal font-black text-3xl uppercase tracking-tighter text-black dark:text-white">
              VALKYRIE
            </div>
          </Link>

          {/* Interactive Navigation - Client Component */}
          <HeaderNavigation links={navigationLinks} />

          {/* User Actions - Client Components */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

// Memoize the entire header component to prevent unnecessary re-renders
export default memo(Header);
