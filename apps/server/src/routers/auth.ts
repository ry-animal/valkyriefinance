import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../lib/trpc';
import { createTRPCError } from '../lib/trpc-error';

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    if (!ctx.session) {
      return null;
    }
    
    return {
      user: ctx.session.user,
      expires: ctx.session.session.expiresAt,
    };
  }),

  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // In a real implementation, you'd update the user in your database
        // For now, we'll just return the updated user data
        const updatedUser = {
          ...ctx.session.user,
          ...input,
        };

        return { success: true, user: updatedUser };
      } catch (error) {
        throw createTRPCError('INTERNAL_SERVER_ERROR', 'Failed to update profile');
      }
    }),

  changePassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // In a real implementation, you'd verify the current password
        // and update it in your database
        // This is just a placeholder
        return { success: true };
      } catch (error) {
        throw createTRPCError('INTERNAL_SERVER_ERROR', 'Failed to change password');
      }
    }),

  deleteAccount: protectedProcedure
    .input(z.object({
      password: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // In a real implementation, you'd verify the password
        // and delete the user account
        // This is just a placeholder
        return { success: true };
      } catch (error) {
        throw createTRPCError('INTERNAL_SERVER_ERROR', 'Failed to delete account');
      }
    }),
}); 