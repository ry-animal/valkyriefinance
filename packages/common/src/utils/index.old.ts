// Logger utility with structured logging
export interface LogContext {
  userId?: string;
  traceId?: string;
  [key: string]: unknown;
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...context,
      })
    );
  },

  error: (message: string, error?: Error, context?: LogContext) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error?.stack || error?.message,
        timestamp: new Date().toISOString(),
        ...context,
      })
    );
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        ...context,
      })
    );
  },

  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        JSON.stringify({
          level: 'debug',
          message,
          timestamp: new Date().toISOString(),
          ...context,
        })
      );
    }
  },
};

// Error handling utilities
export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public validation?: Array<{ field: string; message: string; code?: string }>;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    validation?: Array<{ field: string; message: string; code?: string }>
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.validation = validation;
  }
}

export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  validation?: Array<{ field: string; message: string; code?: string }>
) => {
  return new AppError(message, statusCode, code, validation);
};

// Formatting utilities
export const formatters = {
  currency: (amount: string | number, currency: string = 'USD', locale: string = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  },

  number: (value: string | number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat('en-US', options).format(
      typeof value === 'string' ? parseFloat(value) : value
    );
  },

  percentage: (value: string | number, decimals: number = 2) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${(num * 100).toFixed(decimals)}%`;
  },

  address: (address: string, length: number = 4) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
  },

  hash: (hash: string, length: number = 6) => {
    if (!hash || hash.length < 12) return hash;
    return `${hash.slice(0, length + 2)}...${hash.slice(-length)}`;
  },

  date: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(dateObj);
  },

  dateTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  },
};

// Validation utilities
export const validators = {
  isValidAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  isValidTransactionHash: (hash: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  },

  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidUUID: (uuid: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
  },
};

// Type guards
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !Number.isNaN(value);
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

// Async utilities
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Web3 utilities
export const web3Utils = {
  parseUnits: (value: string, decimals: number = 18): bigint => {
    const [integer, decimal = ''] = value.split('.');
    const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(integer + paddedDecimal);
  },

  formatUnits: (value: bigint, decimals: number = 18): string => {
    const divisor = BigInt(10 ** decimals);
    const quotient = value / divisor;
    const remainder = value % divisor;
    return `${quotient}.${remainder.toString().padStart(decimals, '0')}`.replace(/\.?0+$/, '');
  },

  isValidChainId: (chainId: number): boolean => {
    return chainId > 0 && Number.isInteger(chainId);
  },
};
