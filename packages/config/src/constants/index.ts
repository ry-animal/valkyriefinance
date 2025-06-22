/**
 * Application-wide constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  DEFAULT_CHAIN_ID: 1, // Ethereum Mainnet
  SUPPORTED_CHAINS: [1, 10, 137, 42161, 8453] as const, // Ethereum, Optimism, Polygon, Arbitrum, Base
  BLOCK_CONFIRMATIONS: 3,
  GAS_LIMIT_BUFFER: 1.2,
} as const;

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 20,
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Validation Patterns for Web3 and common formats
export const VALIDATION_PATTERNS = {
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
  PRIVATE_KEY: /^0x[a-fA-F0-9]{64}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

// Feature Flags (for development)
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_DEBUG_MODE: false,
  ENABLE_EXPERIMENTAL_FEATURES: false,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An internal server error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Changes saved successfully.',
  DELETE_SUCCESS: 'Item deleted successfully.',
  CREATE_SUCCESS: 'Item created successfully.',
  UPDATE_SUCCESS: 'Item updated successfully.',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  VAULT: '/vault',
  SWAP: '/swap',
  AI_ANALYTICS: '/ai-analytics',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const;

// Environment Variable Keys
export const ENV_KEYS = {
  SERVER_URL: 'NEXT_PUBLIC_SERVER_URL',
  WALLETCONNECT_PROJECT_ID: 'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
  REOWN_PROJECT_ID: 'NEXT_PUBLIC_REOWN_PROJECT_ID',
  ALCHEMY_API_KEY: 'NEXT_PUBLIC_ALCHEMY_API_KEY',
  DEFAULT_CHAIN: 'NEXT_PUBLIC_DEFAULT_CHAIN',
  ENABLE_TESTNETS: 'NEXT_PUBLIC_ENABLE_TESTNETS',
  GA_MEASUREMENT_ID: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',

  // Server-only
  POSTGRES_URL: 'POSTGRES_URL',
  BETTER_AUTH_SECRET: 'BETTER_AUTH_SECRET',
  BETTER_AUTH_URL: 'BETTER_AUTH_URL',
  CORS_ORIGIN: 'CORS_ORIGIN',
  GOOGLE_AI_API_KEY: 'GOOGLE_AI_API_KEY',
} as const;

// Redis Configuration
export const REDIS_PREFIXES = {
  SESSION: 'session:',
  CACHE: 'cache:',
  RATE_LIMIT: 'rate_limit:',
  SECURITY: 'security:',
  WALLET_SESSION: 'wallet_session:',
} as const;

// Security Configuration
export const securityConfig = {
  session: {
    maxAge: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
  },
  rateLimits: {
    transaction: {
      requests: 10,
      window: 60000, // 1 minute
    },
    api: {
      requests: 100,
      window: 60000, // 1 minute
    },
    auth: {
      requests: 5,
      window: 300000, // 5 minutes
    },
    wallet: {
      requests: 20,
      window: 60000, // 1 minute
    },
  },
} as const;
