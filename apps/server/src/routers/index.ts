import {
  protectedProcedure, publicProcedure,
  router,
} from "../lib/trpc";
import { portfolioRouter } from "./portfolio";
import { vaultRouter } from "./vault";
import { analyticsRouter } from "./analytics";
import { healthRouter } from "./health";
import { authRouter } from "./auth";
import { aiRouter } from "./ai";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  auth: authRouter,
  health: healthRouter,
  portfolio: portfolioRouter,
  vault: vaultRouter,
  analytics: analyticsRouter,
  ai: aiRouter,
});
export type AppRouter = typeof appRouter;
