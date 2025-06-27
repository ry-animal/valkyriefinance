import { z } from 'zod';

// Navigation link validation schema
export const NavigationLinkSchema = z.object({
  to: z
    .string()
    .min(1, 'Path cannot be empty')
    .max(2048, 'Path too long')
    .regex(/^\/[a-zA-Z0-9/_-]*$/, 'Invalid path format')
    .refine((path) => !path.includes('..'), 'Path traversal not allowed')
    .refine((path) => !/(javascript|data|vbscript):/i.test(path), 'Dangerous protocol not allowed'),
  label: z
    .string()
    .min(1, 'Label cannot be empty')
    .max(100, 'Label too long')
    .regex(/^[a-zA-Z0-9\s\-_&()]+$/, 'Invalid characters in label'),
  prefetch: z.boolean().optional(),
  external: z.boolean().optional(),
});

// Route validation - ensures routes are in our allowed list
const ALLOWED_ROUTES = [
  '/',
  '/dashboard',
  '/portfolio',
  '/swap',
  '/vault',
  '/staking',
  '/ai',
  '/ai-analytics',
  '/hyperliquid',
  '/settings',
  '/profile',
  '/transactions',
  '/governance',
] as const;

export function validateRoute(path: string): boolean {
  // Remove query params and hash for validation
  const cleanPath = path.split('?')[0].split('#')[0];

  // Check if it's an exact match or starts with an allowed route
  return ALLOWED_ROUTES.some((route) => cleanPath === route || cleanPath.startsWith(`${route}/`));
}

// Modal data validation schemas
export const CreatePortfolioModalSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  initialBalance: z.number().min(0).optional(),
});

export const EditPortfolioModalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const DeletePortfolioModalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
});

export const TransactionDetailsModalSchema = z.object({
  transactionId: z.string().min(1),
  type: z.enum(['deposit', 'withdrawal', 'swap', 'stake', 'unstake']),
  amount: z.string().min(1),
  asset: z.string().min(1).max(20),
});

export const AISettingsModalSchema = z.object({
  riskTolerance: z.number().min(1).max(10),
  autoRebalance: z.boolean(),
  strategies: z.array(z.string()).max(10),
});

// Generic modal data validation
export const ModalDataSchema = z.union([
  CreatePortfolioModalSchema,
  EditPortfolioModalSchema,
  DeletePortfolioModalSchema,
  TransactionDetailsModalSchema,
  AISettingsModalSchema,
  z.null(),
]);

// CSRF token management
const CSRF_TOKEN_KEY = 'valkyrie-csrf-token';
const CSRF_HEADER = 'X-CSRF-Token';

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function getCSRFToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return sessionStorage.getItem(CSRF_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setCSRFToken(token: string): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  } catch {
    console.warn('Failed to store CSRF token');
  }
}

export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken();
  return storedToken !== null && storedToken === token;
}

// Input sanitization utilities
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();
}

export function sanitizeModalData(data: unknown): unknown {
  if (data === null || data === undefined) return null;

  if (typeof data === 'string') {
    return sanitizeString(data);
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = sanitizeString(key);

      if (typeof value === 'string') {
        sanitized[sanitizedKey] = sanitizeString(value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[sanitizedKey] = value;
      } else if (Array.isArray(value)) {
        sanitized[sanitizedKey] = value.map((item) =>
          typeof item === 'string' ? sanitizeString(item) : item
        );
      } else if (value !== null && typeof value === 'object') {
        sanitized[sanitizedKey] = sanitizeModalData(value);
      }
    }

    return sanitized;
  }

  return data;
}

// Rate limiting for state changes
interface RateLimiter {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number;
}

const rateLimiters = new Map<string, RateLimiter>();

export function createRateLimiter(key: string, capacity = 10, refillRate = 1): void {
  rateLimiters.set(key, {
    tokens: capacity,
    lastRefill: Date.now(),
    capacity,
    refillRate,
  });
}

export function checkRateLimit(key: string): boolean {
  const limiter = rateLimiters.get(key);
  if (!limiter) return true; // No limit set

  const now = Date.now();
  const timePassed = (now - limiter.lastRefill) / 1000;

  // Refill tokens
  limiter.tokens = Math.min(limiter.capacity, limiter.tokens + timePassed * limiter.refillRate);
  limiter.lastRefill = now;

  if (limiter.tokens >= 1) {
    limiter.tokens -= 1;
    return true;
  }

  return false;
}

// Security headers for client-side requests
export function getSecurityHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};

  const csrfToken = getCSRFToken();
  if (csrfToken) {
    headers[CSRF_HEADER] = csrfToken;
  }

  return headers;
}

// Initialize security on app start
export function initializeSecurity(): void {
  // Generate CSRF token if it doesn't exist
  if (!getCSRFToken()) {
    setCSRFToken(generateCSRFToken());
  }

  // Set up rate limiters
  createRateLimiter('modal-actions', 20, 2); // 20 actions, refill 2 per second
  createRateLimiter('navigation-changes', 30, 3); // 30 changes, refill 3 per second
  createRateLimiter('state-updates', 50, 5); // 50 updates, refill 5 per second
}

// Validation hook for React components
export function useSecurityValidation() {
  return {
    validateRoute,
    sanitizeModalData,
    validateNavigationLink: (link: unknown) => NavigationLinkSchema.safeParse(link),
    validateModalData: (data: unknown) => ModalDataSchema.safeParse(data),
    checkRateLimit,
    getSecurityHeaders,
  };
}
