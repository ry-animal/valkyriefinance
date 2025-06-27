'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { restoreNavigationState, trackNavigation } from '@/lib/store-persistence';
import { cn } from '@/lib/utils';
import { useSSRSafeValue } from '@/stores/rsc-store-provider';

interface NavigationLink {
  to: string;
  label: string;
  prefetch?: boolean;
}

interface NavigationProps {
  links: NavigationLink[];
  className?: string;
}

// Memoized navigation link component for performance
const NavigationLinkComponent = memo(
  ({
    link,
    isActive,
    onClick,
    onMouseEnter,
    className,
  }: {
    link: NavigationLink;
    isActive: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    className: string;
  }) => (
    <Link
      href={link.to as any}
      prefetch={link.prefetch}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-current={isActive ? 'page' : undefined}
    >
      {link.label}
    </Link>
  )
);

NavigationLinkComponent.displayName = 'NavigationLinkComponent';

// Lazy mobile menu component for performance
const MobileMenu = memo(
  ({
    links,
    pathname,
    onLinkClick,
    onMouseEnter,
    baseMobileLinkClasses,
    activeLinkClasses,
    inactiveLinkClasses,
  }: {
    links: NavigationLink[];
    pathname: string;
    onLinkClick: () => void;
    onMouseEnter: (path: string) => void;
    baseMobileLinkClasses: string;
    activeLinkClasses: string;
    inactiveLinkClasses: string;
  }) => (
    <div
      id="mobile-navigation"
      className="md:hidden border-t-4 border-black dark:border-white bg-white dark:bg-black absolute top-full left-0 w-full z-50"
    >
      <nav aria-label="Mobile navigation">
        <div className="grid grid-cols-1">
          {links.map((link) => {
            const isActive = pathname === link.to;
            return (
              <NavigationLinkComponent
                key={link.to}
                link={link}
                isActive={isActive}
                onClick={onLinkClick}
                onMouseEnter={() => onMouseEnter(link.to)}
                className={cn(
                  baseMobileLinkClasses,
                  isActive ? activeLinkClasses : inactiveLinkClasses
                )}
              />
            );
          })}
        </div>
      </nav>
    </div>
  )
);

MobileMenu.displayName = 'MobileMenu';

const baseLinkClasses =
  'px-6 py-3 font-black uppercase text-lg tracking-widest transition-colors duration-100 border-r-4 border-black dark:border-white';
const activeLinkClasses = 'bg-black dark:bg-white text-white dark:text-black';
const inactiveLinkClasses =
  'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black';

const baseMobileLinkClasses =
  'px-6 py-4 font-black uppercase text-lg tracking-widest transition-colors duration-100 border-b-4 border-black dark:border-white';

export function EnhancedNavigation({ links, className }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefetchedPaths, setPrefetchedPaths] = useState<Set<string>>(new Set());

  // SSR-safe mobile menu state
  const safeMobileMenuOpen = useSSRSafeValue(mobileMenuOpen, false);

  // Track navigation patterns for AI
  useEffect(() => {
    if (pathname) {
      trackNavigation(pathname);
    }
  }, [pathname]);

  // Intelligent prefetching based on user behavior
  const handleLinkHover = useCallback(
    async (path: string) => {
      if (prefetchedPaths.has(path)) return;

      try {
        // Check if user preferences allow prefetching
        const navigationState = await restoreNavigationState();
        const shouldPrefetch = navigationState?.prefetchOnHover !== false;

        if (shouldPrefetch) {
          router.prefetch(path as any);
          setPrefetchedPaths((prev) => new Set([...prev, path]));
        }
      } catch (error) {
        console.warn('Failed to prefetch route:', error);
      }
    },
    [router, prefetchedPaths]
  );

  // Batch mobile menu state updates
  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileLinkClick = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Memoize link processing for performance
  const processedLinks = useMemo(
    () =>
      links.map((link) => ({
        ...link,
        prefetch: link.prefetch ?? false, // Default to false for manual control
      })),
    [links]
  );

  // Keyboard navigation support
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && safeMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    },
    [safeMobileMenuOpen]
  );

  return (
    <div
      className={cn('relative', className)}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="navigation"
    >
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center" aria-label="Main navigation">
        <div className="flex">
          {processedLinks.map((link) => {
            const isActive = pathname === link.to;
            return (
              <div key={link.to} className="flex">
                <NavigationLinkComponent
                  link={link}
                  isActive={isActive}
                  onClick={() => handleLinkHover(link.to)}
                  onMouseEnter={() => handleLinkHover(link.to)}
                  className={cn(
                    baseLinkClasses,
                    isActive ? activeLinkClasses : inactiveLinkClasses
                  )}
                />
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        type="button"
        className="md:hidden font-black text-xl text-black dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        onClick={handleMobileMenuToggle}
        aria-label={safeMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
        aria-expanded={safeMobileMenuOpen}
        aria-controls="mobile-navigation"
      >
        {safeMobileMenuOpen ? 'CLOSE' : 'MENU'}
      </button>

      {/* Mobile Navigation - Conditionally rendered for performance */}
      {safeMobileMenuOpen && (
        <MobileMenu
          links={processedLinks}
          pathname={pathname}
          onLinkClick={handleMobileLinkClick}
          onMouseEnter={handleLinkHover}
          baseMobileLinkClasses={baseMobileLinkClasses}
          activeLinkClasses={activeLinkClasses}
          inactiveLinkClasses={inactiveLinkClasses}
        />
      )}
    </div>
  );
}

// Export legacy component for backward compatibility
export { EnhancedNavigation as HeaderNavigation };
