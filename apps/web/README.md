# Valkyrie Finance Web Application

🎨 **Modern React frontend for the Valkyrie Finance platform**

## Overview

The web application is a Next.js 15 frontend that provides a beautiful, responsive interface for the Valkyrie Finance AI-driven DeFi platform. Built with modern React patterns, it features wallet integration, real-time data, and AI-powered insights.

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript (strict mode, 100% coverage)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Theme**: Next-themes with dark/light mode support
- **Web3**: Wagmi v2 + Viem + Reown AppKit (WalletConnect v2)
- **State Management**: Zustand + TanStack Query
- **API**: tRPC client with end-to-end type safety
- **Testing**: Vitest + React Testing Library
- **Animation**: Tailwindcss-animate for smooth transitions

## Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes
│   │   ├── vault/             # Vault demo pages
│   │   ├── dashboard/         # Analytics dashboard
│   │   ├── ai/                # AI features demo
│   │   ├── stores/            # State management demo
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Shadcn UI base components
│   │   ├── wallet/            # Wallet-related components
│   │   ├── vault/             # Vault interface components
│   │   ├── brutalist/         # Custom brutalist design components
│   │   ├── examples/          # Demo components
│   │   ├── mode-toggle.tsx    # Theme toggle button
│   │   ├── theme-provider.tsx # Theme system provider
│   │   └── providers.tsx      # App-wide providers
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-valkyrie-vault.ts   # Vault operations
│   │   ├── use-valkyrie-token.ts   # Token operations
│   │   └── use-mobile.ts           # Responsive utilities
│   ├── lib/                   # Utilities and configurations
│   │   ├── wagmi-config.ts    # Reown AppKit setup (SSR-safe)
│   │   ├── utils.ts           # Utility functions
│   │   └── env.ts             # Environment validation
│   ├── stores/                # Zustand state stores
│   │   ├── counter-store.ts   # Demo counter store
│   │   ├── wallet-store.ts    # Wallet state management
│   │   └── __tests__/         # Store unit tests
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts           # Shared type exports
│   └── utils/                 # Client utilities
│       ├── trpc.ts            # tRPC client setup
│       └── constants.ts       # App constants
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts             # Next.js configuration
├── components.json            # Shadcn UI configuration
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- Bun (recommended package manager)
- Running server API (see [server README](../server/README.md))

### Installation

```bash
# From repository root
cd apps/web

# Install dependencies (or run from root)
bun install

# Set up environment variables
cp .env.example .env.local

# Configure your .env.local:
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_DEFAULT_CHAIN=1
NEXT_PUBLIC_ENABLE_TESTNETS=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_WEB3=true

# Start development server
bun run dev
```

The application will be available at: http://localhost:3001

## Features

### 🎨 UI/UX Features

- **Modern Design**: Brutalist-inspired design with clean aesthetics
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Layout**: Mobile-first design with responsive breakpoints
- **Smooth Animations**: Tailwindcss-animate for polished interactions
- **Accessibility**: WCAG compliant components from Shadcn UI

### 🔗 Web3 Features

- **Universal Wallet Support**: 300+ wallets via Reown AppKit
- **Multi-Chain Support**: Ethereum, Arbitrum, Optimism, and testnets
- **Smart Contract Integration**: Type-safe contract interactions
- **Real-time Data**: Live blockchain data with automatic updates
- **Transaction Management**: Comprehensive transaction state handling

### 🤖 AI Features

- **AI Chat Interface**: Interactive AI assistant for DeFi guidance
- **Strategy Recommendations**: AI-powered yield optimization suggestions
- **Portfolio Analysis**: Intelligent portfolio performance insights
- **Risk Assessment**: AI-driven risk analysis and alerts

### 🏦 Vault Features

- **Vault Interface**: Complete ERC-4626 vault interaction
- **Deposit/Withdraw**: Seamless asset management
- **Performance Tracking**: Real-time yield and performance metrics
- **Strategy Monitoring**: AI strategy execution tracking

## Development

### Available Scripts

```bash
# Development
bun run dev              # Start development server with hot reload
bun run build            # Build for production
bun run start            # Start production server
bun run preview          # Preview production build

# Testing
bun run test             # Run unit tests
bun run test:watch       # Run tests in watch mode
bun run test:ui          # Open test UI
bun run coverage         # Generate test coverage report

# Code Quality
bun run lint             # Run ESLint
bun run lint:fix         # Fix ESLint issues
bun run type-check       # TypeScript type checking

# Shadcn UI
bunx shadcn@latest add   # Add new Shadcn component
```

### Component Development

#### Using Shadcn UI Components

```typescript
// Install a new component
bunx shadcn@latest add button

// Use in your component
import { Button } from '@/components/ui/button'

export function MyComponent() {
  return (
    <Button variant="outline" size="lg">
      Click me
    </Button>
  )
}
```

#### Creating Custom Components

```typescript
// components/custom/feature-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  title: string;
  description: string;
  status: "active" | "inactive";
}

export function FeatureCard({ title, description, status }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
```

### State Management with Zustand

```typescript
// stores/wallet-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface WalletState {
  isConnected: boolean;
  address: string | undefined;
  chainId: number | undefined;

  // Actions
  setConnection: (connected: boolean) => void;
  setAddress: (address: string | undefined) => void;
  setChainId: (chainId: number | undefined) => void;
}

export const useWalletStore = create<WalletState>()(
  devtools(
    (set) => ({
      isConnected: false,
      address: undefined,
      chainId: undefined,

      setConnection: (connected) => set({ isConnected: connected }),
      setAddress: (address) => set({ address }),
      setChainId: (chainId) => set({ chainId }),
    }),
    { name: "wallet-store" }
  )
);

// Using in components
import { useWalletStore } from "@/stores/wallet-store";

export function WalletStatus() {
  const { isConnected, address } = useWalletStore();

  return <div>{isConnected ? `Connected: ${address}` : "Not connected"}</div>;
}
```

### Web3 Integration

```typescript
// hooks/use-valkyrie-vault.ts
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { VAULT_ABI, VAULT_ADDRESS } from "@valkyrie/contracts";

export function useValkryieVault() {
  // Read vault data
  const { data: totalAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "totalAssets",
  });

  // Write to vault
  const { writeContract, isPending } = useWriteContract();

  const deposit = async (amount: string) => {
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "deposit",
      args: [parseEther(amount)],
    });
  };

  return {
    totalAssets,
    deposit,
    isDepositing: isPending,
  };
}

// Using in components
export function VaultInterface() {
  const { totalAssets, deposit, isDepositing } = useValkryieVault();
  const [amount, setAmount] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vault Total Assets</CardTitle>
        <p>{totalAssets?.toString()} tokens</p>
      </CardHeader>
      <CardContent>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to deposit"
        />
        <Button onClick={() => deposit(amount)} disabled={isDepositing}>
          {isDepositing ? "Depositing..." : "Deposit"}
        </Button>
      </CardContent>
    </Card>
  );
}
```

### API Integration with tRPC

```typescript
// utils/trpc.ts (already configured)
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@valkyrie/server";

export const trpc = createTRPCReact<AppRouter>();

// Using in components
import { trpc } from "@/utils/trpc";

export function TodoList() {
  const { data: todos, isLoading } = trpc.todo.getAll.useQuery();
  const createTodo = trpc.todo.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch todos
      trpc.useContext().todo.getAll.invalidate();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {todos?.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
      <Button
        onClick={() =>
          createTodo.mutate({
            title: "New todo",
            content: "Todo content",
          })
        }
      >
        Add Todo
      </Button>
    </div>
  );
}
```

## Testing

### Unit Testing

```bash
# Run all tests
bun run test

# Run specific test file
bun run test wallet-store.test.ts

# Run tests with UI
bun run test:ui

# Generate coverage
bun run coverage
```

### Test Examples

```typescript
// stores/__tests__/wallet-store.test.ts
import { renderHook, act } from "@testing-library/react";
import { useWalletStore } from "../wallet-store";

describe("WalletStore", () => {
  beforeEach(() => {
    useWalletStore.setState({
      isConnected: false,
      address: undefined,
      chainId: undefined,
    });
  });

  it("should connect wallet", () => {
    const { result } = renderHook(() => useWalletStore());

    act(() => {
      result.current.setConnection(true);
      result.current.setAddress("0x123...");
      result.current.setChainId(1);
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.address).toBe("0x123...");
    expect(result.current.chainId).toBe(1);
  });
});
```

## Environment Variables

### Required Variables

```bash
# API Connection
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Web3 Configuration
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# App Configuration
NEXT_PUBLIC_DEFAULT_CHAIN=1
NEXT_PUBLIC_ENABLE_TESTNETS=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_WEB3=true
```

### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## Deployment

### Vercel Deployment

The application is optimized for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Build Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with optimization
- **Bundle Analysis**: Use `ANALYZE=true bun run build` to analyze bundles
- **Tree Shaking**: Automatic dead code elimination

## Performance

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Techniques

- **Server Components**: Leverage RSC for better performance
- **Streaming**: Use Suspense boundaries for progressive loading
- **Image Optimization**: Next.js Image with lazy loading
- **Font Optimization**: Next.js Font with preloading

## Troubleshooting

### Common Issues

1. **Web3 Connection Issues**:

   - Verify wallet is installed and connected
   - Check network configuration
   - Ensure Reown Project ID is valid

2. **API Connection Issues**:

   - Verify server is running on correct port
   - Check NEXT_PUBLIC_SERVER_URL is correct
   - Verify CORS configuration on server

3. **Build Issues**:

   - Ensure shared packages are built first
   - Check TypeScript errors with `bun run type-check`
   - Verify environment variables are set

4. **Styling Issues**:
   - Check Tailwind CSS configuration
   - Verify Shadcn UI components are installed correctly
   - Check for conflicting CSS classes

## Related Documentation

- [Main Project README](../../README.md)
- [Server API Documentation](../server/README.md)
- [Smart Contracts](../../packages/contracts/README.md)
- [Shared Utilities](../../packages/common/README.md)
