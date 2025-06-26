'use client';

import { trpc } from '@/utils/trpc';

export function TestTRPCConnection() {
  const healthCheck = trpc.healthCheck.useQuery();

  return (
    <div className="border rounded-lg bg-gray-50 p-4 mb-6">
      <h3 className="font-semibold mb-2">🔗 tRPC Connection Test</h3>
      <p className="text-sm text-gray-600">
        Status:{' '}
        {healthCheck.isLoading ? (
          <span className="text-yellow-600">Connecting...</span>
        ) : healthCheck.error ? (
          <span className="text-red-600">Error: {healthCheck.error.message}</span>
        ) : healthCheck.data ? (
          <span className="text-green-600">✅ Connected - Server Response: {healthCheck.data}</span>
        ) : (
          <span className="text-gray-500">No data</span>
        )}
      </p>
    </div>
  );
}
