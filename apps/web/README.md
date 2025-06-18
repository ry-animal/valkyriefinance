# Valkyrie Finance Web Application

🎨 **Modern React frontend with Server Components for the Valkyrie Finance platform**

## Overview

The web application is a Next.js 15 frontend that provides a beautiful, responsive interface for the Valkyrie Finance AI-driven DeFi platform. Built with React Server Components for optimal performance, it features wallet integration, real-time data, and AI-powered insights.

## Tech Stack

- **Framework**: Next.js 15 with App Router, React Server Components, and Turbopack
- **Architecture**: React Server Components (RSC) with selective client-side interactivity
- **Language**: TypeScript (strict mode, 100% coverage)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Theme**: Next-themes with dark/light mode support
- **Web3**: Wagmi v2 + Viem + Reown AppKit (WalletConnect v2)
- **State Management**: RSC-compatible Zustand stores + TanStack Query
- **Data Fetching**: Server-side async/await with React.cache and Suspense streaming
- **API**: tRPC client with end-to-end type safety
- **Testing**: Vitest + React Testing Library
- **Animation**: Tailwindcss-animate for smooth transitions

## React Server Components Architecture

### Server Components (Default)
- **Homepage** (`app/page.tsx`): Static content rendered on server
- **Dashboard** (`app/dashboard/page.tsx`): Server-side data fetching with async/await
- **Header** (`components/header.tsx`): Static navigation layout
- **Layout Components**: Server-rendered structure and metadata

### Client Components (Interactive)
- **Header Navigation** (`components/header-navigation.tsx`): Mobile menu and routing state
- **Dashboard Stats** (`components/dashboard/dashboard-stats.tsx`): Uses `use()` hook for promise unwrapping
- **Wallet Components**: All Web3 interactions and wallet state
- **Theme Toggle**: Dark/light mode switching
- **Interactive Forms**: User input and state management

### Key Benefits
- **Faster Initial Load**: Reduced client-side JavaScript bundle (~40% reduction)
- **Better SEO**: Server-rendered content improves search rankings
- **Improved Performance**: Core Web Vitals (FCP, LCP) optimization
- **Progressive Enhancement**: UI streams as data becomes available
- **Secure by Default**: Data fetching happens on server

### Data Fetching Patterns
- **React.cache**: Request-level deduplication (`lib/data-access.ts`)
- **Parallel Fetching**: Avoiding request waterfalls with Promise.all
- **Suspense Streaming**: Progressive UI loading with fallback components
- **Error Boundaries**: Graceful error handling

## Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages (RSC-enabled)
│   │   ├── page.tsx           # Landing page (Server Component)
│   │   ├── dashboard/         # Analytics dashboard
│   │   │   └── page.tsx       # Dashboard with RSC data fetching
│   │   ├── vault/             # Vault demo pages
│   │   ├── ai/                # AI features demo
│   │   ├── stores/            # State management demo
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Shadcn UI base components (Shared)
│   │   ├── dashboard/         # Dashboard components (RSC pattern)
│   │   │   ├── dashboard-stats.tsx        # Client Component with use() hook
│   │   │   └── dashboard-stats-loading.tsx # Loading skeleton
│   │   ├── wallet/            # Wallet-related components (Client)
│   │   ├── vault/             # Vault interface components
│   │   ├── brutalist/         # Custom brutalist design components (Shared)
│   │   ├── examples/          # Demo components
│   │   ├── header.tsx         # Header (Server Component)
│   │   ├── header-navigation.tsx # Navigation (Client Component)
│   │   ├── mode-toggle.tsx    # Theme toggle (Client Component)
│   │   ├── theme-provider.tsx # Theme system provider (Client)
│   │   └── client-providers.tsx # Client-side providers
│   ├── lib/                   # Utilities and configurations
│   │   ├── wagmi-config.ts    # Reown AppKit setup (SSR-safe)
│   │   ├── data-access.ts     # Server-side data layer (RSC)
│   │   ├── utils.ts           # Utility functions
│   │   └── env.ts             # Environment validation
│   ├── stores/                # Zustand state stores (RSC-compatible)
│   │   ├── rsc-store-provider.tsx   # RSC-safe store provider
│   │   ├── ui-store-factory.ts      # Store factory pattern
│   │   ├── portfolio-store-factory.ts # Portfolio store factory
│   │   ├── [legacy stores...]       # Existing store implementations
│   │   └── __tests__/         # Store unit tests
│   ├── hooks/                 # Custom React hooks (Client Components only)
│   │   ├── use-valkyrie-vault.ts   # Vault operations
│   │   ├── use-valkyrie-token.ts   # Token operations
│   │   └── use-mobile.ts           # Responsive utilities
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts           # Shared type exports
│   └── utils/                 # Client utilities
│       ├── trpc.ts            # tRPC client setup
│       └── constants.ts       # App constants
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts             # Next.js configuration
├── components.json            # Shadcn UI configuration
├── RSC_REFACTORING_SUMMARY.md # Detailed RSC migration guide
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- pnpm (recommended package manager)
- Running server API (see [server README](../server/README.md))

### Installation

```bash
# From repository root
cd apps/web

# Install dependencies (or run from root)
pnpm install

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
pnpm run dev
```

The application will be available at: http://localhost:3001

## Features

### 🎨 UI/UX Features

- **Modern Design**: Brutalist-inspired design with clean aesthetics
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Layout**: Mobile-first design with responsive breakpoints
- **Smooth Animations**: Tailwindcss-animate for polished interactions
- **Accessibility**: WCAG compliant components from Shadcn UI
- **Progressive Loading**: Suspense boundaries for optimal perceived performance

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
pnpm run dev              # Start development server with hot reload
pnpm run build            # Build for production
pnpm run start            # Start production server
pnpm run preview          # Preview production build

# Testing
pnpm run test             # Run unit tests
pnpm run test:watch       # Run tests in watch mode
pnpm run test:ui          # Open test UI
pnpm run coverage         # Generate test coverage report

# Code Quality
pnpm run lint             # Run ESLint
pnpm run lint:fix         # Fix ESLint issues
pnpm run type-check       # TypeScript type checking

# Shadcn UI
pnpx shadcn@latest add   # Add new Shadcn component
```

### React Server Components Development

#### Creating Server Components (Default)

```typescript
// app/my-page/page.tsx - Server Component
import { MyClientComponent } from '@/components/my-client-component';
import { getServerData } from '@/lib/data-access';

export default async function MyPage() {
  // Data fetching happens on the server
  const data = await getServerData();
  
  return (
    <div>
      <h1>Server Rendered Content</h1>
      <p>This content is rendered on the server</p>
      
      {/* Pass server data to client component */}
      <MyClientComponent initialData={data} />
    </div>
  );
}
```

#### Creating Client Components

```typescript
// components/my-client-component.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  initialData: any;
}

export function MyClientComponent({ initialData }: Props) {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Interactive content: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Click me
      </Button>
    </div>
  );
}
```

#### Server-Side Data Fetching

```typescript
// lib/data-access.ts
import { cache } from 'react';

// Use React.cache for request-level deduplication
export const getUserData = cache(async (userId: string) => {
  // This will only run once per request, even if called multiple times
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Parallel data fetching to avoid waterfalls
export const getDashboardData = cache(async () => {
  const [stats, vaults, portfolio] = await Promise.all([
    getPortfolioStats(),
    getActiveVaults(),
    getUserPortfolio(),
  ]);
  
  return { stats, vaults, portfolio };
});
```

#### Using Suspense for Streaming

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { DashboardStatsLoading } from '@/components/dashboard/dashboard-stats-loading';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Stream UI as data becomes available */}
      <Suspense fallback={<DashboardStatsLoading />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
```

### Component Development

#### Using Shadcn UI Components

```typescript
// Install a new component
pnpx shadcn@latest add button

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
pnpm run test

# Run specific test file
pnpm run test wallet-store.test.ts

# Run tests with UI
pnpm run test:ui

# Generate coverage
pnpm run coverage
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
- **Bundle Analysis**: Use `ANALYZE=true pnpm run build` to analyze bundles
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
   - Check TypeScript errors with `pnpm run type-check`
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
