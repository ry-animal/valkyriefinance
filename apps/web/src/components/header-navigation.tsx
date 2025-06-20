'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  links: Array<{ to: string; label: string }>;
}

export function HeaderNavigation({ links }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Memoize the active route calculation to avoid recalculating on every render
  const isActiveRoute = useCallback(
    (linkPath: string) => {
      return pathname === linkPath;
    },
    [pathname]
  );

  // Memoize class calculations to avoid recreation on every render
  const getLinkClassNames = useCallback(
    (linkPath: string) => {
      const isActive = isActiveRoute(linkPath);
      return cn(
        'px-6 py-3 font-brutal font-black uppercase text-lg tracking-widest transition-colors duration-100 border-r-4 border-black dark:border-white',
        isActive
          ? 'bg-black dark:bg-white text-white dark:text-black'
          : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
      );
    },
    [isActiveRoute]
  );

  const getMobileLinkClassNames = useCallback(
    (linkPath: string) => {
      const isActive = isActiveRoute(linkPath);
      return cn(
        'px-6 py-4 font-brutal font-black uppercase text-lg tracking-widest transition-colors duration-100 border-b-4 border-black dark:border-white',
        isActive
          ? 'bg-black dark:bg-white text-white dark:text-black'
          : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
      );
    },
    [isActiveRoute]
  );

  // Memoize the mobile menu toggle handler
  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileLinkClick = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Memoize the desktop navigation to prevent unnecessary re-renders
  const desktopNavigation = useMemo(
    () => (
      <nav className="hidden md:flex items-center">
        <div className="flex">
          {links.map((link) => (
            <div key={link.to} className="flex">
              <Link href={link.to} className={getLinkClassNames(link.to)}>
                {link.label}
              </Link>
            </div>
          ))}
        </div>
      </nav>
    ),
    [links, getLinkClassNames]
  );

  // Memoize the mobile navigation to prevent unnecessary re-renders
  const mobileNavigation = useMemo(() => {
    if (!mobileMenuOpen) return null;

    return (
      <div className="md:hidden border-t-4 border-black dark:border-white bg-white dark:bg-black absolute top-full left-0 w-full z-50">
        <div className="grid grid-cols-1">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={getMobileLinkClassNames(link.to)}
              onClick={handleMobileLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }, [mobileMenuOpen, links, getMobileLinkClassNames, handleMobileLinkClick]);

  return (
    <>
      {desktopNavigation}

      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        className="md:hidden font-brutal font-black text-xl text-black dark:text-white"
        onClick={handleMobileMenuToggle}
      >
        MENU
      </Button>

      {mobileNavigation}
    </>
  );
}
