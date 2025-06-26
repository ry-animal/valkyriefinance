'use client';

import { trpc } from '@/utils/trpc';

export function PortfolioStatus() {
  const healthCheck = trpc.healthCheck.useQuery();

  return (
    <div className="mt-4 text-xs text-gray-500">
      Server Status:{' '}
      {healthCheck.isLoading
        ? 'Connecting...'
        : healthCheck.data
          ? '🟢 Connected'
          : '🔴 Disconnected'}
    </div>
  );
}
