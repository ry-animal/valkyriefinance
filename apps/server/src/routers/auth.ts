import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { user } from '../db/schema/user';
import { publicProcedure, router } from '../lib/trpc';
import { createTRPCError } from '../lib/trpc-error';

export const authRouter = router({
  // Create or get user by wallet address
  connectWallet: publicProcedure
    .input(
      z.object({
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
        ensName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if user already exists
        const existingUser = await db
          .select()
          .from(user)
          .where(eq(user.walletAddress, input.walletAddress))
          .limit(1);

        if (existingUser.length > 0) {
          // Update ENS name if provided
          if (input.ensName) {
            await db
              .update(user)
              .set({
                ensName: input.ensName,
                updatedAt: new Date(),
              })
              .where(eq(user.walletAddress, input.walletAddress));
          }
          return { user: existingUser[0], isNewUser: false };
        }

        // Create new user
        const newUser = await db
          .insert(user)
          .values({
            walletAddress: input.walletAddress,
            ensName: input.ensName,
          })
          .returning();

        return { user: newUser[0], isNewUser: true };
      } catch (_error) {
        throw createTRPCError('INTERNAL_SERVER_ERROR', 'Failed to connect wallet');
      }
    }),

  // Get user by wallet address
  getUserByWallet: publicProcedure
    .input(
      z.object({
        walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
      })
    )
    .query(async ({ input }) => {
      try {
        const userData = await db
          .select()
          .from(user)
          .where(eq(user.walletAddress, input.walletAddress))
          .limit(1);

        return userData.length > 0 ? userData[0] : null;
      } catch (_error) {
        throw createTRPCError('INTERNAL_SERVER_ERROR', 'Failed to get user');
      }
    }),
});
