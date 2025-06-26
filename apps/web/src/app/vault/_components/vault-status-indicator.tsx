'use client';

import { trpc } from '@/utils/trpc';

export function VaultStatusIndicator() {
  const healthCheck = trpc.healthCheck.useQuery();

  return (
    <>
      <div className="text-2xl font-bold text-green-600">
        {healthCheck.isLoading ? '...' : healthCheck.data ? 'ACTIVE' : 'OFFLINE'}
      </div>
      <div className="text-sm text-gray-600">Status</div>
    </>
  );
}
