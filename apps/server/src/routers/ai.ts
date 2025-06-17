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

// AI Engine Integration Configuration
const AI_ENGINE_URL = "http://localhost:8080";

// AI Engine helper functions
async function callAIEngine(endpoint: string, data?: any) {
  try {
    const url = `${AI_ENGINE_URL}${endpoint}`;
    
    // Determine method based on endpoint, not just data presence
    const isPostEndpoint = endpoint.includes('/api/optimize-portfolio') || 
                          endpoint.includes('/api/risk-metrics') || 
                          endpoint.includes('/api/market-analysis');
    
    const options: RequestInit = {
      method: isPostEndpoint ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
    
    if (data && isPostEndpoint) {
      options.body = JSON.stringify(data);
    }
    
    console.log(`Making AI Engine call to: ${url} (${options.method})`);
    if (data && isPostEndpoint) console.log('Request payload:', JSON.stringify(data, null, 2));
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI Engine error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`AI Engine error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`AI Engine response from ${endpoint}:`, result);
    return result;
  } catch (error) {
    console.error(`AI Engine call failed for ${endpoint}:`, error);
    if (error instanceof Error) {
        throw new Error(`Failed to call AI Engine: ${error.message}`);
    }
    throw new Error('An unknown error occurred when calling the AI engine.');
  }
}

function convertPortfolioToAIEngineFormat(portfolioData: z.infer<typeof portfolioDataSchema>) {
  return {
    id: `portfolio-${Date.now()}`,
    total_value: parseFloat(portfolioData.totalValue),
    positions: portfolioData.assets.map(asset => ({
      token: asset.symbol,
      amount: parseFloat(asset.balance),
      value: parseFloat(asset.valueUsd),
      weight: asset.percentage / 100,
      yield_apy: 0, // Default value, can be enhanced with actual APY data
    })),
    last_updated: new Date().toISOString(),
  };
}

export const aiRouter = router({
  // Enhanced portfolio optimization using AI Engine
  optimizePortfolioAdvanced: publicProcedure
    .input(portfolioDataSchema)
    .mutation(async ({ input }) => {
      try {
        // Convert portfolio format
        const aiEnginePortfolio = convertPortfolioToAIEngineFormat(input);
        
        // Get optimization from AI Engine
        const optimization = await callAIEngine('/api/optimize-portfolio', aiEnginePortfolio);
        
        // Get risk metrics from AI Engine
        const riskMetrics = await callAIEngine('/api/risk-metrics', aiEnginePortfolio);
        
        // Get market analysis for portfolio tokens
        const marketAnalysis = await callAIEngine('/api/market-analysis', {
          tokens: input.assets.map(asset => asset.symbol),
          timeframe: '1d'
        });
        
        return {
          optimization: {
            portfolioId: optimization.portfolio_id,
            confidence: optimization.confidence,
            expectedReturn: optimization.expected_return,
            risk: optimization.risk,
            actions: optimization.actions,
            reasoning: optimization.reasoning,
            timestamp: optimization.timestamp,
          },
          riskMetrics: {
            var95: riskMetrics.var_95,
            var99: riskMetrics.var_99,
            volatility: riskMetrics.volatility,
            sharpeRatio: riskMetrics.sharpe_ratio,
            maxDrawdown: riskMetrics.max_drawdown,
            beta: riskMetrics.beta,
          },
          marketAnalysis: {
            tokenAnalysis: marketAnalysis.token_analysis,
            sentiment: marketAnalysis.sentiment,
            timestamp: marketAnalysis.timestamp,
          },
          recommendations: (optimization.actions || []).map((action: any) => 
            `${action.type.toUpperCase()}: ${action.token} - Target weight ${(action.target_weight * 100).toFixed(1)}%`
          ),
        };
      } catch (error) {
        console.error("Advanced portfolio optimization error:", error);
        if (error instanceof Error) {
          throw new Error(`Failed to perform advanced portfolio optimization: ${error.message}`);
        }
        throw new Error("Failed to perform advanced portfolio optimization due to an unknown error.");
      }
    }),

  // Get real-time market indicators from AI Engine
  getMarketIndicators: publicProcedure
    .query(async () => {
      try {
        const indicators = await callAIEngine('/api/market-indicators');
        
        return {
          fearGreedIndex: indicators.fear_greed_index,
          totalMarketCap: indicators.total_market_cap,
          btcDominance: indicators.btc_dominance,
          ethDominance: indicators.eth_dominance,
          defiTVL: indicators.defi_tvl,
          volatility: indicators.volatility,
          timestamp: indicators.timestamp,
          interpretation: {
            fearGreed: indicators.fear_greed_index > 75 ? 'Extreme Greed' :
                      indicators.fear_greed_index > 55 ? 'Greed' :
                      indicators.fear_greed_index > 45 ? 'Neutral' :
                      indicators.fear_greed_index > 25 ? 'Fear' : 'Extreme Fear',
            marketCondition: indicators.volatility > 0.4 ? 'High Volatility' :
                           indicators.volatility > 0.25 ? 'Moderate Volatility' : 'Low Volatility',
            recommendation: indicators.fear_greed_index < 30 ? 'Consider buying opportunities' :
                           indicators.fear_greed_index > 70 ? 'Consider taking profits' : 'Hold and monitor',
          }
        };
      } catch (error) {
        console.error("Market indicators error:", error);
        if (error instanceof Error) {
          throw new Error(`Failed to fetch market indicators: ${error.message}`);
        }
        throw new Error("Failed to fetch market indicators due to an unknown error.");
      }
    }),

  // Enhanced risk assessment using AI Engine
  assessPortfolioRisk: publicProcedure
    .input(portfolioDataSchema)
    .mutation(async ({ input }) => {
      try {
        const aiEnginePortfolio = convertPortfolioToAIEngineFormat(input);
        const riskMetrics = await callAIEngine('/api/risk-metrics', aiEnginePortfolio);
        
        // Generate risk assessment interpretation
        const riskLevel = riskMetrics.volatility > 0.3 ? 'High' :
                         riskMetrics.volatility > 0.15 ? 'Medium' : 'Low';
        
        const warnings = [];
        if (riskMetrics.max_drawdown > 0.5) {
          warnings.push('High maximum drawdown detected - consider diversification');
        }
        if (riskMetrics.sharpe_ratio < 0.5) {
          warnings.push('Low risk-adjusted returns - review portfolio allocation');
        }
        if (riskMetrics.beta > 1.2) {
          warnings.push('High market correlation - consider uncorrelated assets');
        }
        
        return {
          riskMetrics: {
            var95: riskMetrics.var_95,
            var99: riskMetrics.var_99,
            volatility: riskMetrics.volatility,
            sharpeRatio: riskMetrics.sharpe_ratio,
            maxDrawdown: riskMetrics.max_drawdown,
            beta: riskMetrics.beta,
          },
          riskLevel,
          riskScore: Math.round(riskMetrics.volatility * 10), // Convert to 1-10 scale
          warnings,
          recommendations: [
            riskLevel === 'High' ? 'Consider reducing position sizes' : 'Maintain current risk levels',
            riskMetrics.sharpe_ratio < 1 ? 'Look for higher yield opportunities' : 'Good risk-adjusted performance',
            'Monitor correlation with major market movements',
            'Set stop-loss levels for volatile positions'
          ],
          timestamp: riskMetrics.timestamp,
        };
      } catch (error) {
        console.error("Portfolio risk assessment error:", error);
        if (error instanceof Error) {
          throw new Error(`Failed to assess portfolio risk: ${error.message}`);
        }
        throw new Error("Failed to assess portfolio risk due to an unknown error.");
      }
    }),

  // Get comprehensive market analysis for specific tokens
  getTokenAnalysis: publicProcedure
    .input(z.object({
      tokens: z.array(z.string()).min(1).max(10),
      timeframe: z.enum(['1h', '4h', '1d', '1w']).default('1d'),
    }))
    .mutation(async ({ input }) => {
      try {
        const analysis = await callAIEngine('/api/market-analysis', {
          tokens: input.tokens,
          timeframe: input.timeframe
        });
        
        return {
          tokenAnalysis: analysis.token_analysis.map((token: any) => ({
            ...token,
            recommendation: token.trend === 'bullish' ? 'BUY' : 
                          token.trend === 'bearish' ? 'SELL' : 'HOLD',
            strength: Math.abs(token.change_24h) > 0.05 ? 'Strong' : 'Weak',
          })),
          sentiment: analysis.sentiment,
          overallTrend: analysis.token_analysis.filter((t: any) => t.trend === 'bullish').length > 
                       analysis.token_analysis.filter((t: any) => t.trend === 'bearish').length ? 
                       'Bullish' : 'Bearish',
          timestamp: analysis.timestamp,
        };
      } catch (error) {
        console.error("Token analysis error:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get token analysis: ${error.message}`);
        }
        throw new Error("Failed to get token analysis due to an unknown error.");
      }
    }),

  // Check AI Engine health status
  getAIEngineStatus: publicProcedure
    .query(async () => {
      try {
        const health = await callAIEngine('/health');
        return {
          status: health.status,
          services: health.services,
          timestamp: health.timestamp,
          isHealthy: health.status === 'healthy',
        };
      } catch (error) {
        console.error("AI Engine health check error:", error);
        return {
          status: 'unhealthy',
          services: [],
          timestamp: new Date().toISOString(),
          isHealthy: false,
          error: error.message,
        };
      }
    }),

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
        let systemPrompt = `You are an AI assistant for Valkyrie Finance, a sophisticated DeFi platform. You help users with:
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
        if (error instanceof Error) {
            throw new Error(`Failed to generate AI response: ${error.message}`);
        }
        throw new Error("Failed to generate AI response due to an unknown error.");
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
      } catch (error: unknown) {
        console.error("Vault analysis error:", error);
        let errorMessage = "Failed to analyze vault strategy due to an unknown error.";
        if (error instanceof Error) {
          errorMessage = `Failed to analyze vault strategy: ${error.message}`;
        }
        throw new Error(errorMessage);
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
        5. Valkyrie vault integration potential
        
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
        5. Integration with Valkyrie ecosystem
        
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