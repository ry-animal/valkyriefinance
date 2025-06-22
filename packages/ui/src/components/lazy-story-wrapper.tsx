'use client';

import type React from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';

interface LazyStoryWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  enableIntersectionObserver?: boolean;
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="p-8 space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

// Progressive loading hook
const useProgressiveLoading = (delay: number = 0) => {
  const [isLoaded, setIsLoaded] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsLoaded(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  return isLoaded;
};

// Intersection observer hook for lazy loading
const useIntersectionObserver = (enabled: boolean = true) => {
  const [isVisible, setIsVisible] = useState(!enabled);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, enabled]);

  return { isVisible, ref: setRef };
};

export const LazyStoryWrapper: React.FC<LazyStoryWrapperProps> = ({
  children,
  fallback = <LoadingSkeleton />,
  delay = 0,
  enableIntersectionObserver = true,
}) => {
  const isProgressivelyLoaded = useProgressiveLoading(delay);
  const { isVisible, ref } = useIntersectionObserver(enableIntersectionObserver);

  const shouldRender = isProgressivelyLoaded && isVisible;

  if (enableIntersectionObserver && !isVisible) {
    return (
      <div ref={ref} className="min-h-[200px] flex items-center justify-center">
        {fallback}
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 ease-out">
      {shouldRender ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Suspense fallback={fallback}>{children}</Suspense>
        </div>
      ) : (
        <div className="animate-in fade-in duration-200">{fallback}</div>
      )}
    </div>
  );
};

// HOC for creating lazy-loaded stories
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    delay?: number;
    enableIntersectionObserver?: boolean;
    customFallback?: React.ReactNode;
  } = {}
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));

  return (props: P) => (
    <LazyStoryWrapper
      delay={options.delay}
      enableIntersectionObserver={options.enableIntersectionObserver}
      fallback={options.customFallback}
    >
      <LazyComponent {...props} />
    </LazyStoryWrapper>
  );
};

// Progressive loading component for multiple stories
export const ProgressiveStoryLoader: React.FC<{
  stories: Array<{
    component: React.ComponentType;
    priority: 'critical' | 'secondary' | 'heavy';
    name: string;
  }>;
}> = ({ stories }) => {
  const [loadedPriorities, setLoadedPriorities] = useState<Set<string>>(new Set(['critical']));

  useEffect(() => {
    // Load secondary components after critical ones
    const secondaryTimer = setTimeout(() => {
      setLoadedPriorities((prev) => new Set([...prev, 'secondary']));
    }, 200);

    // Load heavy components last
    const heavyTimer = setTimeout(() => {
      setLoadedPriorities((prev) => new Set([...prev, 'heavy']));
    }, 500);

    return () => {
      clearTimeout(secondaryTimer);
      clearTimeout(heavyTimer);
    };
  }, []);

  return (
    <div className="space-y-8">
      {stories.map(({ component: Component, priority, name }) => {
        const shouldLoad = loadedPriorities.has(priority);

        return (
          <div key={name}>
            {shouldLoad ? (
              <LazyStoryWrapper
                delay={priority === 'heavy' ? 100 : 0}
                enableIntersectionObserver={priority === 'heavy'}
              >
                <Component />
              </LazyStoryWrapper>
            ) : (
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Loading {name}...</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
