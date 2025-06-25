/**
 * Rate limiter implementing HyperLiquid's token bucket system
 * 100 requests burst, 10/sec refill rate
 */

export interface RateLimitConfig {
  maxTokens: number;
  refillRate: number; // tokens per second
  refillInterval: number; // milliseconds
}

export class HyperLiquidRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = {
      maxTokens: 100, // 100 request burst
      refillRate: 10, // 10 requests per second
      refillInterval: 100, // Check every 100ms
      ...config,
    };

    this.tokens = this.config.maxTokens;
    this.lastRefill = Date.now();
  }

  /**
   * Wait for rate limit availability
   */
  async waitForLimit(): Promise<void> {
    this.refillTokens();

    if (this.tokens >= 1) {
      this.tokens--;
      return;
    }

    // Calculate wait time for next token
    const tokensNeeded = 1 - this.tokens;
    const waitTime = (tokensNeeded / this.config.refillRate) * 1000;

    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return this.waitForLimit();
  }

  /**
   * Check if request can be made immediately
   */
  canMakeRequest(): boolean {
    this.refillTokens();
    return this.tokens >= 1;
  }

  /**
   * Get current token count
   */
  getTokenCount(): number {
    this.refillTokens();
    return this.tokens;
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.tokens = this.config.maxTokens;
    this.lastRefill = Date.now();
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;

    if (timePassed >= this.config.refillInterval) {
      const tokensToAdd = (timePassed / 1000) * this.config.refillRate;
      this.tokens = Math.min(this.config.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }
}

/**
 * Global rate limiter instance for HyperLiquid API
 */
export const hyperliquidRateLimiter = new HyperLiquidRateLimiter();

/**
 * Decorator for automatic rate limiting
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limiter: HyperLiquidRateLimiter = hyperliquidRateLimiter
): T {
  return (async (...args: Parameters<T>) => {
    await limiter.waitForLimit();
    return fn(...args);
  }) as T;
}
