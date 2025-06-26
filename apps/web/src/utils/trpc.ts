'use client';

// Placeholder for tRPC client - will be properly typed when server router is ready
export const trpc = {
  staking: {
    getStakingOverview: {
      useQuery: (_input?: any, _options?: any) => ({
        data: undefined,
        isLoading: false,
        error: null,
      }),
    },
  },
} as any;

// Temporary client for build compatibility
export const TrpcClient = {
  staking: {
    getStakingOverview: {
      query: () => Promise.resolve(null),
    },
  },
} as any;
