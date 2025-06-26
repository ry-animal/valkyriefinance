'use client';

import { trpc } from '@/utils/trpc';

export function AIStatus() {
  const healthCheck = trpc.healthCheck.useQuery();

  return (
    <div className="text-lg font-bold text-green-600">
      {healthCheck.isLoading ? '...' : healthCheck.data ? '🟢 ONLINE' : '🔴 OFFLINE'}
    </div>
  );
}
