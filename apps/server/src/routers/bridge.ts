import { bridgeQuoteSchema, bridgeSwapSchema } from '@valkyrie/common';
import { publicProcedure, router } from '../lib/trpc';

const RUBIC_API_URL = 'https://api-v2.rubic.exchange/api/routes';

export const bridgeRouter = router({
  getQuote: publicProcedure.input(bridgeQuoteSchema).query(async ({ input }) => {
    try {
      const response = await fetch(`${RUBIC_API_URL}/quoteBest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: input }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error((error as any).message || 'Failed to fetch quote from Rubic API');
      }

      const quote = await response.json();
      return quote;
    } catch (error) {
      console.error('Error fetching Rubic quote:', error);
      // Consider creating a specific TRPC error
      throw new Error('Failed to fetch quote from Rubic API');
    }
  }),

  getSwap: publicProcedure.input(bridgeSwapSchema).mutation(async ({ input }) => {
    try {
      // First, get the best trade to get the trade ID
      const quoteResponse = await fetch(`${RUBIC_API_URL}/quoteBest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params: input }),
      });

      if (!quoteResponse.ok) {
        throw new Error('Failed to fetch initial quote for swap data');
      }
      const bestTrade = (await quoteResponse.json()) as any;

      if (!bestTrade.id) {
        throw new Error('No trade ID found in quote response');
      }

      // Then, get the swap transaction data
      const swapResponse = await fetch(`${RUBIC_API_URL}/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: {
            ...input,
            id: bestTrade.id,
          },
        }),
      });

      if (!swapResponse.ok) {
        const error = await swapResponse.json();
        throw new Error((error as any).message || 'Failed to fetch swap data from Rubic API');
      }

      const swapData = await swapResponse.json();
      return swapData;
    } catch (error) {
      console.error('Error fetching Rubic swap data:', error);
      throw new Error('Failed to fetch swap data from Rubic API');
    }
  }),
});
