/**
 * Application constants and configuration types
 */

export interface AppConstants {
  // Application metadata
  app: {
    name: string;
    version: string;
    description: string;
    url: string;
  };

  // API configuration
  api: {
    timeout: number;
    retries: number;
    baseUrl: string;
  };

  // UI configuration
  ui: {
    defaultTheme: 'light' | 'dark' | 'system';
    animationDuration: number;
    toastDuration: number;
  };

  // DeFi specific constants
  defi: {
    slippageTolerance: number;
    maxGasPrice: bigint;
    defaultDeadline: number;
  };
}

export interface SecurityConfig {
  // Rate limiting
  rateLimits: {
    api: { requests: number; window: number };
    transaction: { requests: number; window: number };
    auth: { requests: number; window: number };
    wallet: { requests: number; window: number };
  };

  // Session management
  session: {
    maxAge: number;
    renewThreshold: number;
  };

  // Security headers
  security: {
    csp: string;
    hsts: boolean;
    frameOptions: string;
  };
}
