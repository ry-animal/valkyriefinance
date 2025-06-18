import { publicProcedure, router } from '../lib/trpc';
import { aiRouter } from './ai';
import { analyticsRouter } from './analytics';
import { authRouter } from './auth';
import { bridgeRouter } from './bridge';
import { healthRouter } from './health';
import { portfolioRouter } from './portfolio';
import { vaultRouter } from './vault';

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return 'OK';
  }),
  auth: authRouter,
  health: healthRouter,
  portfolio: portfolioRouter,
  vault: vaultRouter,
  analytics: analyticsRouter,
  ai: aiRouter,
  bridge: bridgeRouter,
});
export type AppRouter = typeof appRouter;
