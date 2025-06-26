'use client';

import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { env } from '@/lib/env';
import type { AppRouter } from '../../../server/src/routers';

// Create the tRPC React client
export const trpc = createTRPCReact<AppRouter>();

// Create tRPC client instance
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      headers: () => {
        // Add auth headers when available
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
