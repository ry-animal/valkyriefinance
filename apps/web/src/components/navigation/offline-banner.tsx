'use client';

import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface OfflineBannerProps {
  className?: string;
}

export function OfflineBanner({ className }: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const handleRetry = () => {
    window.location.reload();
  };

  // Don't render anything if user is online and hasn't been offline
  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', className)}
      role="alert"
      aria-live="polite"
    >
      {showReconnected ? (
        // Reconnected banner
        <div className="bg-green-500 text-white px-4 py-2 text-sm font-medium text-center">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-4 w-4" />
            <span>Connection restored</span>
          </div>
        </div>
      ) : (
        // Offline banner
        <div className="bg-yellow-500 text-yellow-900 px-4 py-3 text-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              <span className="font-medium">You&apos;re currently offline</span>
              <span className="hidden sm:inline">- Some features may not be available</span>
            </div>

            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
              aria-label="Retry connection"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="hidden sm:inline">Retry</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for components to check online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
