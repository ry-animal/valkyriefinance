import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import type { RubicErrorResponse, RubicQuoteResponse, RubicSwapResponse } from '../types/api';

const _RUBIC_API_URL = 'https://api-v2.rubic.exchange/api/routes';

export const bridgeRouter = router({
  getQuote: publicProcedure
    .input(
      z.object({
        fromTokenAddress: z.string(),
        toTokenAddress: z.string(),
        amount: z.string(),
        fromChainId: z.number(),
        toChainId: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await fetch('https://api.rubic.exchange/api/best-trade/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const error = (await response.json()) as RubicErrorResponse;
          throw new Error(error.message || 'Failed to fetch quote from Rubic API');
        }

        const data = (await response.json()) as RubicQuoteResponse;
        return data;
      } catch (error) {
        console.error('Bridge quote error:', error);
        throw new Error('Failed to get bridge quote');
      }
    }),

  executeSwap: publicProcedure
    .input(
      z.object({
        fromTokenAddress: z.string(),
        toTokenAddress: z.string(),
        amount: z.string(),
        fromChainId: z.number(),
        toChainId: z.number(),
        userAddress: z.string(),
        slippage: z.number().default(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // First get the best quote
        const quoteResponse = await fetch('https://api.rubic.exchange/api/best-trade/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromTokenAddress: input.fromTokenAddress,
            toTokenAddress: input.toTokenAddress,
            amount: input.amount,
            fromChainId: input.fromChainId,
            toChainId: input.toChainId,
          }),
        });

        if (!quoteResponse.ok) {
          throw new Error('Failed to fetch initial quote for swap data');
        }
        const bestTrade = (await quoteResponse.json()) as RubicQuoteResponse;

        if (!bestTrade.id) {
          throw new Error('No valid trade route found');
        }

        // Get swap transaction data
        const swapResponse = await fetch(`https://api.rubic.exchange/api/best-trade/swap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trade: bestTrade,
            userAddress: input.userAddress,
            slippage: input.slippage,
          }),
        });

        if (!swapResponse.ok) {
          const error = (await swapResponse.json()) as RubicErrorResponse;
          throw new Error(error.message || 'Failed to fetch swap data from Rubic API');
        }

        const swapData = (await swapResponse.json()) as RubicSwapResponse;
        return swapData;
      } catch (error) {
        console.error('Bridge swap error:', error);
        throw new Error('Failed to execute bridge swap');
      }
    }),
});
