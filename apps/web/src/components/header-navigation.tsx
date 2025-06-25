'use client';

// import { Button } from '@valkyrie/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  links: Array<{ to: string; label: string }>;
}

const baseLinkClasses =
  'px-6 py-3 font-black uppercase text-lg tracking-widest transition-colors duration-100 border-r-4 border-black dark:border-white';
const activeLinkClasses = 'bg-black dark:bg-white text-white dark:text-black';
const inactiveLinkClasses =
  'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black';

const baseMobileLinkClasses =
  'px-6 py-4 font-black uppercase text-lg tracking-widest transition-colors duration-100 border-b-4 border-black dark:border-white';

export function HeaderNavigation({ links }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center">
        <div className="flex">
          {links.map((link) => {
            const isActive = pathname === link.to;
            return (
              <div key={link.to} className="flex">
                <Link
                  href={link.to}
                  className={cn(
                    baseLinkClasses,
                    isActive ? activeLinkClasses : inactiveLinkClasses
                  )}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        type="button"
        className="md:hidden font-black text-xl text-black dark:text-white px-4 py-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        MENU
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-4 border-black dark:border-white bg-white dark:bg-black absolute top-full left-0 w-full z-50">
          <div className="grid grid-cols-1">
            {links.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  className={cn(
                    baseMobileLinkClasses,
                    isActive ? activeLinkClasses : inactiveLinkClasses
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
