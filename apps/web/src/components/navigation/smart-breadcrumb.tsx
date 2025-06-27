'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbSegment {
  label: string;
  href: string | '#';
  isCurrentPage?: boolean;
  isEllipsis?: boolean;
}

// Route label mapping for better UX
const ROUTE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/portfolio': 'Portfolio',
  '/swap': 'Swap',
  '/vault': 'Vault',
  '/staking': 'Staking',
  '/ai': 'AI Assistant',
  '/ai-analytics': 'AI Analytics',
  '/hyperliquid': 'Hyperliquid',
  '/settings': 'Settings',
  '/profile': 'Profile',
  '/transactions': 'Transactions',
  '/governance': 'Governance',
};

// Route icons for better visual hierarchy
const ROUTE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  '/': Home,
};

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbSegment[] = [];

  // Always start with home
  breadcrumbs.push({
    label: ROUTE_LABELS['/'] || 'Home',
    href: '/',
  });

  // Build breadcrumbs for each path segment
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label: ROUTE_LABELS[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
      isCurrentPage: isLast,
    });
  });

  return breadcrumbs;
}

interface SmartBreadcrumbProps {
  className?: string;
  maxItems?: number;
  showHome?: boolean;
}

export function SmartBreadcrumb({
  className,
  maxItems = 5,
  showHome = true,
}: SmartBreadcrumbProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const allBreadcrumbs = generateBreadcrumbs(pathname);

    // Filter out home if not wanted
    const filtered = showHome ? allBreadcrumbs : allBreadcrumbs.slice(1);

    // Truncate if too many items
    if (filtered.length > maxItems) {
      const start = filtered.slice(0, 1);
      const end = filtered.slice(-(maxItems - 2));
      return [...start, { label: '...', href: '#', isEllipsis: true }, ...end];
    }

    return filtered;
  }, [pathname, maxItems, showHome]);

  // Don't show breadcrumbs on home page unless forced
  if (pathname === '/' && !showHome) {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = ROUTE_ICONS[breadcrumb.href];

          return (
            <div key={breadcrumb.href + index} className="flex items-center">
              <BreadcrumbItem>
                {breadcrumb.isCurrentPage ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {Icon && <Icon className="h-4 w-4" />}
                    {breadcrumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={breadcrumb.href}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {breadcrumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Context-aware breadcrumb variant for specific pages
interface ContextualBreadcrumbProps {
  customSegments?: BreadcrumbSegment[];
  className?: string;
}

export function ContextualBreadcrumb({ customSegments, className }: ContextualBreadcrumbProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (customSegments) {
      return customSegments;
    }
    return generateBreadcrumbs(pathname);
  }, [pathname, customSegments]);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = ROUTE_ICONS[breadcrumb.href];

          return (
            <div key={breadcrumb.href + index} className="flex items-center">
              <BreadcrumbItem>
                {breadcrumb.isCurrentPage || isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {Icon && <Icon className="h-4 w-4" />}
                    {breadcrumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={breadcrumb.href}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {breadcrumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Hook for getting current breadcrumb data
export function useBreadcrumbs() {
  const pathname = usePathname();

  return useMemo(() => {
    const breadcrumbs = generateBreadcrumbs(pathname);
    const currentPage = breadcrumbs[breadcrumbs.length - 1];
    const parentPage = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

    return {
      breadcrumbs,
      currentPage,
      parentPage,
      depth: breadcrumbs.length,
    };
  }, [pathname]);
}
