import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import { walletSessionManager } from './redis';

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

// Proper authentication middleware with session validation
const isAuthed = t.middleware(async ({ next, ctx }) => {
  const sessionId = ctx.sessionId;
  const walletAddress = ctx.walletAddress;

  if (!sessionId || !walletAddress) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Session ID and wallet address required',
    });
  }

  // Validate wallet session
  const isValidSession = await walletSessionManager.validateWalletSession(walletAddress, sessionId);

  if (!isValidSession) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired session',
    });
  }

  // Update last activity
  await walletSessionManager.updateLastActivity(walletAddress);

  return next({
    ctx: {
      ...ctx,
      user: {
        id: walletAddress,
        walletAddress,
        sessionId,
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
