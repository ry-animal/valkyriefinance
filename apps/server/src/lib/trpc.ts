import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

// Auth middleware (simplified - would integrate with your auth system)
const isAuthed = t.middleware(async ({ next, ctx }) => {
  // For now, create a mock user - in production this would validate JWT/session
  const user = { id: 'user-123' }; // This would come from actual auth

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
