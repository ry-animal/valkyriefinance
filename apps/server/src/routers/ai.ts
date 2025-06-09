import { z } from "zod";
import { publicProcedure, router } from "../lib/trpc";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const vaultAnalyticsSchema = z.object({
  vaultAddress: z.string(),
  totalAssets: z.string(),
  totalSupply: z.string(),
  userShares: z.string().optional(),
  userAssets: z.string().optional(),
  chainId: z.number(),
});

const portfolioDataSchema = z.object({
  totalValue: z.string(),
  assets: z.array(z.object({
    symbol: z.string(),
    balance: z.string(),
    valueUsd: z.string(),
    percentage: z.number(),
  })),
  chainDistribution: z.record(z.string(), z.string()),
});

export const aiRouter = router({
  // Enhanced chat with DeFi context
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(chatMessageSchema),
        context: z.object({
          userPortfolio: portfolioDataSchema.optional(),
          vaultData: vaultAnalyticsSchema.optional(),
          currentChain: z.number().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Build context-aware system prompt
        let systemPrompt = `You are an AI assistant for Valkryie Finance, a sophisticated DeFi platform. You help users with:
        - ERC-4626 vault strategies and yield optimization
        - Multi-chain portfolio management
        - Platform token (VLKR) staking and governance
        - Risk assessment and diversification strategies
        - DeFi protocol analysis and recommendations
        
        Always provide practical, actionable advice while being mindful of DeFi risks.`;
        
        if (input.context?.userPortfolio) {
          const portfolio = input.context.userPortfolio;
          systemPrompt += `\n\nUser's current portfolio:
          - Total Value: $${portfolio.totalValue}
          - Top Assets: ${portfolio.assets.slice(0, 3).map(a => `${a.symbol} (${a.percentage.toFixed(1)}%)`).join(', ')}
          - Chain Distribution: ${Object.entries(portfolio.chainDistribution).map(([chain, value]) => `${chain}: $${value}`).join(', ')}`;
        }
        
        if (input.context?.vaultData) {
          const vault = input.context.vaultData;
          systemPrompt += `\n\nVault Information:
          - Total Assets Locked: ${vault.totalAssets}
          - Total Shares: ${vault.totalSupply}
          - User Position: ${vault.userShares || '0'} shares (${vault.userAssets || '0'} assets)
          - Network: Chain ID ${vault.chainId}`;
        }

        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...input.messages,
        ];

        const result = await generateText({
          model: google("gemini-1.5-flash"),
          messages,
          temperature: 0.7,
          maxTokens: 1000,
        });

        return {
          role: "assistant" as const,
          content: result.text,
        };
      } catch (error) {
        console.error("AI chat error:", error);
        throw new Error("Failed to generate AI response");
      }
    }),

  // Vault strategy analysis
  analyzeVaultStrategy: publicProcedure
    .input(vaultAnalyticsSchema)
    .mutation(async ({ input }) => {
      try {
        const prompt = `Analyze this ERC-4626 vault performance and provide strategic insights:
        
        Vault Metrics:
        - Total Assets: ${input.totalAssets}
        - Total Shares: ${input.totalSupply}
        - User Holdings: ${input.userShares || '0'} shares (${input.userAssets || '0'} assets)
        - Network: Chain ID ${input.chainId}
        
        Provide analysis on:
        1. Current vault utilization and efficiency
        2. Risk assessment of the vault strategy
        3. Optimal deposit/withdrawal timing
        4. Yield optimization opportunities
        5. Comparison with similar DeFi protocols
        
        Format as a structured analysis with specific recommendations.`;

        const result = await generateText({
          model: google("gemini-1.5-flash"),
          prompt,
          temperature: 0.3,
          maxTokens: 800,
        });

        return {
          analysis: result.text,
          confidence: 0.85,
          timestamp: new Date().toISOString(),
          recommendations: [
            "Monitor vault APY trends",
            "Consider position sizing based on risk tolerance", 
            "Diversify across multiple yield strategies",
            "Set up automated rebalancing alerts"
          ]
        };
      } catch (error) {
        console.error("Vault analysis error:", error);
        throw new Error("Failed to analyze vault strategy");
      }
    }),

  // Portfolio optimization suggestions
  optimizePortfolio: publicProcedure
    .input(portfolioDataSchema)
    .mutation(async ({ input }) => {
      try {
        const prompt = `Analyze this DeFi portfolio and suggest optimizations:
        
        Portfolio Overview:
        - Total Value: $${input.totalValue}
        - Asset Breakdown: ${input.assets.map(a => `${a.symbol}: ${a.percentage.toFixed(1)}% ($${a.valueUsd})`).join(', ')}
        - Chain Distribution: ${Object.entries(input.chainDistribution).map(([chain, value]) => `${chain}: $${value}`).join(', ')}
        
        Provide recommendations for:
        1. Asset allocation optimization
        2. Cross-chain diversification
        3. Yield farming opportunities
        4. Risk reduction strategies
        5. Valkryie vault integration potential
        
        Be specific and actionable.`;

        const result = await generateText({
          model: google("gemini-1.5-flash"),
          prompt,
          temperature: 0.4,
          maxTokens: 700,
        });

        // Extract key metrics from portfolio
        const highestAllocation = input.assets.reduce((max, asset) => 
          asset.percentage > max.percentage ? asset : max
        );
        
        const diversificationScore = Math.min(100, (input.assets.length * 20) - (highestAllocation.percentage * 0.5));
        
        return {
          optimization: result.text,
          diversificationScore: Math.round(diversificationScore),
          riskLevel: highestAllocation.percentage > 50 ? 'High' : 
                    highestAllocation.percentage > 30 ? 'Medium' : 'Low',
          suggestedActions: [
            "Consider rebalancing if any asset > 40%",
            "Explore yield opportunities in underallocated chains",
            "Set up automated DCA for major positions",
            "Monitor correlation between major holdings"
          ],
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Portfolio optimization error:", error);
        throw new Error("Failed to optimize portfolio");
      }
    }),

  // Market opportunity scanner
  scanMarketOpportunities: publicProcedure
    .input(z.object({
      userPreferences: z.object({
        riskTolerance: z.enum(['low', 'medium', 'high']),
        preferredChains: z.array(z.number()),
        minAPY: z.number().optional(),
        maxPositionSize: z.string().optional(),
      }),
      currentPositions: z.array(z.object({
        protocol: z.string(),
        apy: z.number(),
        tvl: z.string(),
        userAmount: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const prompt = `Scan for DeFi opportunities based on user preferences:
        
        User Profile:
        - Risk Tolerance: ${input.userPreferences.riskTolerance}
        - Preferred Chains: ${input.userPreferences.preferredChains.join(', ')}
        - Minimum APY: ${input.userPreferences.minAPY || 'No preference'}%
        - Max Position Size: ${input.userPreferences.maxPositionSize || 'No limit'}
        
        ${input.currentPositions ? `Current Positions:
        ${input.currentPositions.map(p => `- ${p.protocol}: ${p.apy}% APY, $${p.userAmount} invested`).join('\n')}` : ''}
        
        Identify and rank top 5 opportunities considering:
        1. Yield potential vs risk
        2. Protocol security and track record
        3. Liquidity and exit options
        4. Gas efficiency and user experience
        5. Integration with Valkryie ecosystem
        
        Format as numbered opportunities with clear rationale.`;

        const result = await generateText({
          model: google("gemini-1.5-flash"),
          prompt,
          temperature: 0.5,
          maxTokens: 900,
        });

        // Generate mock opportunity scoring
        const opportunityScore = input.userPreferences.riskTolerance === 'high' ? 85 : 
                               input.userPreferences.riskTolerance === 'medium' ? 70 : 55;
        
        return {
          opportunities: result.text,
          overallScore: opportunityScore,
          marketSentiment: 'Bullish',
          nextScanRecommended: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
          priorityActions: [
            "Review top-ranked opportunities immediately",
            "Set price alerts for recommended entry points", 
            "Prepare position sizing for quick execution",
            "Monitor gas prices for optimal transaction timing"
          ],
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Market scan error:", error);
        throw new Error("Failed to scan market opportunities");
      }
    }),

  // Risk assessment for specific actions
  assessRisk: publicProcedure
    .input(z.object({
      action: z.enum(['deposit', 'withdraw', 'stake', 'swap', 'bridge']),
      amount: z.string(),
      fromToken: z.string().optional(),
      toToken: z.string().optional(),
      protocol: z.string(),
      chainId: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        const prompt = `Assess the risk of this DeFi transaction:
        
        Transaction Details:
        - Action: ${input.action}
        - Amount: ${input.amount}
        - Protocol: ${input.protocol}
        - Chain: ${input.chainId}
        ${input.fromToken ? `- From Token: ${input.fromToken}` : ''}
        ${input.toToken ? `- To Token: ${input.toToken}` : ''}
        
        Analyze risks including:
        1. Smart contract security
        2. Liquidity and slippage
        3. Impermanent loss potential
        4. Network/bridge risks
        5. Market timing considerations
        
        Provide a risk score (1-10) and specific warnings.`;

        const result = await generateText({
          model: google("gemini-1.5-flash"),
          prompt,
          temperature: 0.2,
          maxTokens: 600,
        });

        // Calculate basic risk score based on action and amount
        let baseRisk = 3;
        if (input.action === 'bridge') baseRisk = 6;
        if (input.action === 'swap') baseRisk = 4;
        if (parseFloat(input.amount) > 10000) baseRisk += 2;
        
        const riskScore = Math.min(10, Math.max(1, baseRisk + Math.floor(Math.random() * 2)));
        
        return {
          riskAssessment: result.text,
          riskScore,
          riskLevel: riskScore >= 7 ? 'High' : riskScore >= 4 ? 'Medium' : 'Low',
          warnings: riskScore >= 7 ? [
            "High-risk transaction - consider reducing amount",
            "Verify all contract addresses before proceeding",
            "Consider market conditions and volatility"
          ] : riskScore >= 4 ? [
            "Moderate risk - proceed with standard caution",
            "Monitor transaction for optimal timing"
          ] : [
            "Low risk transaction",
            "Standard precautions apply"
          ],
          recommendedActions: [
            "Set appropriate slippage tolerance",
            "Monitor gas prices for cost efficiency",
            "Keep some funds in reserve for opportunities"
          ],
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Risk assessment error:", error);
        throw new Error("Failed to assess transaction risk");
      }
    }),
}); 