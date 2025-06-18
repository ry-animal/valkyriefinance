import { z } from 'zod';

export const bridgeQuoteSchema = z.object({
  srcTokenAddress: z.string(),
  srcTokenBlockchain: z.string(),
  srcTokenAmount: z.string(),
  dstTokenAddress: z.string(),
  dstTokenBlockchain: z.string(),
  slippage: z.number().optional().default(1),
  referrer: z.string().optional().default('valkryie'),
});

export type BridgeQuoteInput = z.infer<typeof bridgeQuoteSchema>;

export const bridgeSwapSchema = bridgeQuoteSchema.extend({
  fromAddress: z.string(),
});

export type BridgeSwapInput = z.infer<typeof bridgeSwapSchema>;
