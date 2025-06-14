import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { env } from '@/lib/env';

export const trpc = createTRPCClient<any>({
  links: [
    httpBatchLink({
      url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

// TODO: Add proper type inference when AppRouter is available
// export type RouterInputs = inferRouterInputs<AppRouter>;
// export type RouterOutputs = inferRouterOutputs<AppRouter>;

