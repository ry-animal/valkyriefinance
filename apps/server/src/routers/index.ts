import { publicProcedure, router } from '../lib/trpc';
import { adminRouter } from './admin';
import { aiRouter } from './ai';
import { analyticsRouter } from './analytics';
import { authRouter } from './auth';
import { bridgeRouter } from './bridge';
import { governanceRouter } from './governance';
import { healthRouter } from './health';
import { portfolioRouter } from './portfolio';
import { stakingRouter } from './staking';
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
  admin: adminRouter,
  staking: stakingRouter,
  governance: governanceRouter,
});
export type AppRouter = typeof appRouter;
