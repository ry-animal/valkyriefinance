import {
  protectedProcedure, publicProcedure,
  router,
} from "../lib/trpc";
import { todoRouter } from "./todo";
import { portfolioRouter } from "./portfolio";
import { vaultRouter } from "./vault";
import { analyticsRouter } from "./analytics";

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
  todo: todoRouter,
  portfolio: portfolioRouter,
  vault: vaultRouter,
  analytics: analyticsRouter,
});
export type AppRouter = typeof appRouter;
