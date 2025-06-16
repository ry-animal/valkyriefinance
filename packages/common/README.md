# Valkyrie Finance Common Package

🔧 **Shared utilities, types, and schemas for the Valkyrie Finance platform**

## Overview

The common package provides shared TypeScript types, Zod validation schemas, utility functions, and constants used across all applications in the Valkyrie Finance monorepo. This ensures consistency and prevents code duplication.

## Package Contents

- **Types**: Shared TypeScript interfaces and type definitions
- **Schemas**: Zod validation schemas for runtime type checking
- **Utils**: Utility functions for data manipulation and formatting
- **Constants**: Shared constants and configuration values
- **Validation**: Common validation logic and helpers

## Project Structure

```
packages/common/
├── src/
│   ├── types/              # TypeScript type definitions
│   │   ├── api.ts          # API request/response types
│   │   ├── auth.ts         # Authentication types
│   │   ├── database.ts     # Database entity types
│   │   ├── vault.ts        # Vault-related types
│   │   ├── blockchain.ts   # Blockchain and Web3 types
│   │   └── index.ts        # Type exports
│   ├── schemas/            # Zod validation schemas
│   │   ├── auth.ts         # Authentication schemas
│   │   ├── todo.ts         # Todo validation schemas
│   │   ├── vault.ts        # Vault operation schemas
│   │   ├── api.ts          # API input/output schemas
│   │   └── index.ts        # Schema exports
│   ├── utils/              # Utility functions
│   │   ├── validation.ts   # Validation helpers
│   │   ├── formatters.ts   # Data formatting utilities
│   │   ├── date.ts         # Date manipulation helpers
│   │   ├── crypto.ts       # Cryptocurrency utilities
│   │   ├── errors.ts       # Error handling utilities
│   │   └── index.ts        # Utility exports
│   ├── constants/          # Shared constants
│   │   ├── chains.ts       # Blockchain configuration
│   │   ├── contracts.ts    # Contract addresses
│   │   ├── tokens.ts       # Token configurations
│   │   └── index.ts        # Constant exports
│   └── index.ts            # Main package exports
├── package.json
├── tsconfig.json
└── README.md
```

## Installation & Usage

### Within the Monorepo

The common package is automatically linked within the monorepo workspace:

```typescript
// In apps/server or apps/web
import { UserSchema, formatCurrency, SUPPORTED_CHAINS } from "@valkyrie/common";

// Or import specific modules
import { todoCreateSchema } from "@valkyrie/common/schemas";
import { formatTokenAmount } from "@valkyrie/common/utils";
import type { VaultDepositInput } from "@valkyrie/common/types";
```

### Development

```bash
# From repository root
cd packages/common

# Install dependencies
bun install

# Build the package
bun run build

# Run tests
bun run test

# Type checking
bun run type-check

# Linting
bun run lint
```

## Types

### API Types

```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### Authentication Types

```typescript
// types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expires: Date;
  user: User;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Vault Types

```typescript
// types/vault.ts
export interface VaultInfo {
  address: `0x${string}`;
  name: string;
  symbol: string;
  asset: `0x${string}`;
  totalAssets: bigint;
  totalSupply: bigint;
  sharePrice: bigint;
}

export interface VaultDepositInput {
  amount: string;
  recipient?: `0x${string}`;
}

export interface VaultWithdrawInput {
  shares: string;
  recipient?: `0x${string}`;
}

export interface VaultStrategy {
  id: string;
  name: string;
  description: string;
  allocation: number;
  expectedApy: number;
  isActive: boolean;
}
```

### Blockchain Types

```typescript
// types/blockchain.ts
export interface ChainConfig {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  blockExplorers: {
    default: { name: string; url: string };
  };
  testnet?: boolean;
}

export interface TokenInfo {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface TransactionStatus {
  hash: `0x${string}`;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
  gasUsed?: bigint;
  timestamp?: Date;
}
```

## Validation Schemas

### Authentication Schemas

```typescript
// schemas/auth.ts
import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
```

### Vault Schemas

```typescript
// schemas/vault.ts
import { z } from "zod";

export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

export const bigintStringSchema = z
  .string()
  .regex(/^\d+$/, "Invalid number format");

export const vaultDepositSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  recipient: addressSchema.optional(),
});

export const vaultWithdrawSchema = z.object({
  shares: bigintStringSchema,
  recipient: addressSchema.optional(),
});

export const vaultInfoSchema = z.object({
  address: addressSchema,
  name: z.string(),
  symbol: z.string(),
  asset: addressSchema,
  totalAssets: z.bigint(),
  totalSupply: z.bigint(),
  sharePrice: z.bigint(),
});

export type VaultDepositInput = z.infer<typeof vaultDepositSchema>;
export type VaultWithdrawInput = z.infer<typeof vaultWithdrawSchema>;
export type VaultInfo = z.infer<typeof vaultInfoSchema>;
```

### API Schemas

```typescript
// schemas/api.ts
import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  });

export type PaginationInput = z.infer<typeof paginationSchema>;
```

## Utility Functions

### Formatters

```typescript
// utils/formatters.ts
import { formatUnits, parseUnits } from "viem";

export function formatTokenAmount(
  amount: bigint | string,
  decimals: number = 18,
  maxDecimals: number = 4
): string {
  const formatted = formatUnits(BigInt(amount), decimals);
  const num = parseFloat(formatted);

  if (num === 0) return "0";
  if (num < 0.0001) return "< 0.0001";

  return num.toLocaleString("en-US", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  });
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (address.length <= startLength + endLength) {
    return address;
  }

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
```

### Validation Helpers

```typescript
// utils/validation.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidPrivateKey(key: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(key);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### Crypto Utilities

```typescript
// utils/crypto.ts
import { parseUnits, formatUnits } from "viem";

export function parseTokenAmount(
  amount: string,
  decimals: number = 18
): bigint {
  return parseUnits(amount, decimals);
}

export function formatTokenBalance(
  balance: bigint,
  decimals: number = 18,
  precision: number = 4
): string {
  const formatted = formatUnits(balance, decimals);
  return parseFloat(formatted).toFixed(precision);
}

export function calculateSharePrice(
  totalAssets: bigint,
  totalSupply: bigint,
  decimals: number = 18
): number {
  if (totalSupply === 0n) return 1;

  const price = (totalAssets * parseUnits("1", decimals)) / totalSupply;
  return parseFloat(formatUnits(price, decimals));
}

export function calculateApy(
  initialValue: bigint,
  finalValue: bigint,
  timeInDays: number
): number {
  if (initialValue === 0n || timeInDays === 0) return 0;

  const ratio = Number(finalValue) / Number(initialValue);
  const dailyReturn = Math.pow(ratio, 1 / timeInDays);
  const apy = Math.pow(dailyReturn, 365) - 1;

  return apy * 100; // Convert to percentage
}
```

### Error Handling

```typescript
// utils/errors.ts
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}
```

## Constants

### Chain Configuration

```typescript
// constants/chains.ts
import type { ChainConfig } from "../types/blockchain";

export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  1: {
    id: 1,
    name: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ["https://eth-mainnet.g.alchemy.com/v2/"] },
      public: { http: ["https://cloudflare-eth.com"] },
    },
    blockExplorers: {
      default: { name: "Etherscan", url: "https://etherscan.io" },
    },
  },
  11155111: {
    id: 11155111,
    name: "Sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ["https://eth-sepolia.g.alchemy.com/v2/"] },
      public: { http: ["https://rpc.sepolia.org"] },
    },
    blockExplorers: {
      default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
    },
    testnet: true,
  },
};

export const DEFAULT_CHAIN_ID = 1;
export const TESTNET_CHAIN_IDS = [11155111, 5, 80001];
```

### Contract Addresses

```typescript
// constants/contracts.ts
export const CONTRACT_ADDRESSES = {
  // Mainnet
  1: {
    VALKYRIE_TOKEN: "0x..." as const,
    VALKYRIE_VAULT: "0x..." as const,
    UNISWAP_V4_POOL_MANAGER: "0x..." as const,
  },
  // Sepolia Testnet
  11155111: {
    VALKYRIE_TOKEN: "0x..." as const,
    VALKYRIE_VAULT: "0x..." as const,
    UNISWAP_V4_POOL_MANAGER: "0x..." as const,
  },
} as const;

export function getContractAddress(
  chainId: number,
  contract: keyof (typeof CONTRACT_ADDRESSES)[1]
): `0x${string}` | undefined {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.[
    contract
  ];
}
```

## Development Scripts

```bash
# Build the package
bun run build

# Watch mode for development
bun run dev

# Run tests
bun run test
bun run test:watch

# Type checking
bun run type-check

# Linting
bun run lint
bun run lint:fix

# Clean build artifacts
bun run clean
```

## Testing

### Example Tests

```typescript
// utils/__tests__/formatters.test.ts
import { describe, it, expect } from "vitest";
import {
  formatTokenAmount,
  formatAddress,
  formatPercentage,
} from "../formatters";

describe("formatters", () => {
  describe("formatTokenAmount", () => {
    it("should format token amounts correctly", () => {
      expect(formatTokenAmount("1000000000000000000", 18)).toBe("1");
      expect(formatTokenAmount("1500000000000000000", 18)).toBe("1.5");
      expect(formatTokenAmount("999", 18)).toBe("< 0.0001");
    });
  });

  describe("formatAddress", () => {
    it("should format addresses correctly", () => {
      const address = "0x1234567890abcdef1234567890abcdef12345678";
      expect(formatAddress(address)).toBe("0x1234...5678");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentages correctly", () => {
      expect(formatPercentage(0.1234)).toBe("12.34%");
      expect(formatPercentage(0.1234, 1)).toBe("12.3%");
    });
  });
});
```

## Usage Examples

### In tRPC Routers

```typescript
// apps/server/src/routers/vault.ts
import { z } from "zod";
import {
  vaultDepositSchema,
  vaultWithdrawSchema,
} from "@valkyrie/common/schemas";
import type { VaultInfo } from "@valkyrie/common/types";
import { formatTokenAmount } from "@valkyrie/common/utils";

export const vaultRouter = router({
  deposit: protectedProcedure
    .input(vaultDepositSchema)
    .mutation(async ({ input, ctx }) => {
      // Implementation using validated input
    }),

  getInfo: publicProcedure.query(async ({ ctx }): Promise<VaultInfo> => {
    // Return vault info with proper typing
  }),
});
```

### In React Components

```typescript
// apps/web/src/components/vault/vault-display.tsx
import { formatTokenAmount, formatPercentage } from "@valkyrie/common/utils";
import type { VaultInfo } from "@valkyrie/common/types";

interface VaultDisplayProps {
  vaultInfo: VaultInfo;
}

export function VaultDisplay({ vaultInfo }: VaultDisplayProps) {
  return (
    <div>
      <h2>{vaultInfo.name}</h2>
      <p>Total Assets: {formatTokenAmount(vaultInfo.totalAssets)}</p>
      <p>APY: {formatPercentage(0.05)}</p>
    </div>
  );
}
```

## Related Documentation

- [Main Project README](../../README.md)
- [Server API Documentation](../../apps/server/README.md)
- [Web Application](../../apps/web/README.md)
- [Smart Contracts](../contracts/README.md)
