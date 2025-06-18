'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  links: Array<{ to: string; label: string }>;
}

export function HeaderNavigation({ links }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center">
        <div className="flex">
          {links.map((link) => (
            <div key={link.to} className="flex">
              <Link
                href={link.to}
                className={cn(
                  'px-6 py-3 font-brutal font-black uppercase text-lg tracking-widest transition-colors duration-100 border-r-4 border-black dark:border-white',
                  pathname === link.to
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
                )}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        className="md:hidden font-brutal font-black text-xl text-black dark:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        MENU
      </Button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-4 border-black dark:border-white bg-white dark:bg-black absolute top-full left-0 w-full z-50">
          <div className="grid grid-cols-1">
            {links.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={cn(
                  'px-6 py-4 font-brutal font-black uppercase text-lg tracking-widest transition-colors duration-100 border-b-4 border-black dark:border-white',
                  pathname === link.to
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
