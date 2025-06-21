/**
 * Security utilities for input validation, sanitization, and protection
 * Following dApp security best practices for frontend security
 */

import { z } from 'zod';

// Input validation schemas
export const securitySchemas = {
  // Ethereum address validation
  ethereumAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
    .refine(
      (addr) => addr !== '0x0000000000000000000000000000000000000000',
      'Zero address not allowed'
    ),

  // Token amount validation (prevents negative values and overflow)
  tokenAmount: z
    .string()
    .regex(/^\d+(\.\d{1,18})?$/, 'Invalid token amount format')
    .refine((amount) => {
      const num = parseFloat(amount);
      return num >= 0 && num <= Number.MAX_SAFE_INTEGER;
    }, 'Token amount out of safe range'),

  // Transaction hash validation
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash format'),

  // URL validation for external links
  externalUrl: z
    .string()
    .url('Invalid URL format')
    .refine((url) => {
      const allowedDomains = [
        'etherscan.io',
        'polygonscan.com',
        'arbiscan.io',
        'optimistic.etherscan.io',
        'basescan.org',
        'coingecko.com',
        'coinmarketcap.com',
        'defillama.com',
      ];
      const domain = new URL(url).hostname;
      return allowedDomains.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`));
    }, 'URL domain not in allowlist'),
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[char] || char;
    })
    .trim()
    .slice(0, 1000); // Limit input length
}

/**
 * Validates contract addresses before interaction
 */
export function validateContractAddress(address: string): boolean {
  try {
    securitySchemas.ethereumAddress.parse(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limiting utility for preventing DoS attacks
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 10, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Remove old attempts outside the window
    const validAttempts = attempts.filter((time) => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);

    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Global rate limiter instances
export const transactionRateLimiter = new RateLimiter(5, 60000); // 5 transactions per minute
export const apiRateLimiter = new RateLimiter(30, 60000); // 30 API calls per minute

/**
 * Validates transaction parameters before signing
 */
export function validateTransactionParams(params: {
  to?: string;
  value?: string;
  data?: string;
  gasLimit?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate recipient address
  if (params.to && !validateContractAddress(params.to)) {
    errors.push('Invalid recipient address');
  }

  // Validate value
  if (params.value) {
    try {
      securitySchemas.tokenAmount.parse(params.value);
    } catch {
      errors.push('Invalid transaction value');
    }
  }

  // Validate gas limit
  if (params.gasLimit) {
    const gasLimit = parseInt(params.gasLimit);
    if (Number.isNaN(gasLimit) || gasLimit < 21000 || gasLimit > 10000000) {
      errors.push('Invalid gas limit');
    }
  }

  // Check for suspicious data patterns
  if (params.data) {
    const suspiciousPatterns = [
      /selfdestruct/i,
      /delegatecall/i,
      /0x[a-fA-F0-9]{8}.*?[a-fA-F0-9]{64}/g, // Pattern for potential exploit signatures
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(params.data)) {
        errors.push('Transaction contains suspicious data patterns');
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a URL is safe for external navigation
 */
export function isSafeExternalUrl(url: string): boolean {
  try {
    securitySchemas.externalUrl.parse(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a Content Security Policy nonce for inline scripts
 */
export function generateCSPNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates and sanitizes form data
 */
export function validateFormData<T extends Record<string, unknown>>(
  data: T,
  schema: z.ZodSchema<T>
): { isValid: boolean; data?: T; errors?: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error };
    }
    throw error;
  }
}

/**
 * Security headers for API requests
 */
export const securityHeaders = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;

/**
 * Checks if the current environment is secure (HTTPS)
 */
export function isSecureContext(): boolean {
  return (
    typeof window !== 'undefined' &&
    (window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  );
}

/**
 * Warning for insecure contexts
 */
export function warnIfInsecure(): void {
  if (typeof window !== 'undefined' && !isSecureContext()) {
    console.warn(
      '⚠️ SECURITY WARNING: Application is not running in a secure context (HTTPS). ' +
        'Wallet connections and sensitive operations may be compromised.'
    );
  }
}
