'use client';

import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '../../../server/src/routers';
import { env } from '@/lib/env';

export const trpc = createTRPCReact<AppRouter>();

// TODO: Add proper type inference when AppRouter is available
// export type RouterInputs = inferRouterInputs<AppRouter>;
// export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const TrpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: 'include',
                });
            },
        }),
    ],
});

