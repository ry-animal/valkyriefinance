# Valkyrie Finance Web Application

🎨 **Modern React frontend with Server Components for the Valkyrie Finance platform**

## Overview

The web application is a Next.js 15 frontend that provides a beautiful, responsive interface for the Valkyrie Finance AI-driven DeFi platform. Built with React Server Components for optimal performance, it features **live Web3 integration**, **real-time AI analytics**, and **multi-chain wallet support**.

## 🚀 **Live Features**

### ✅ **Web3 Integration**
- **Multi-chain Support**: Ethereum, Arbitrum, Optimism, Sepolia testnets
- **Universal Wallet Support**: 300+ wallets via Reown AppKit
- **Smart Contract Integration**: Live ERC-20 token and ERC-4626 vault
- **Real-time Balances**: Live token balances and transaction history
- **Gas Optimization**: Efficient contract interactions

### ✅ **AI-Powered Analytics**
- **Portfolio Optimization**: Live AI portfolio optimization with sub-20ms response
- **Market Intelligence**: Real-time Fear & Greed Index, volatility metrics
- **Risk Assessment**: AI-driven risk scoring and confidence analysis
- **Strategy Recommendations**: Intelligent yield optimization suggestions

### ✅ **Production Features**
- **Vercel Deployment**: Production-ready with pnpm workspace support
- **Performance Optimized**: Core Web Vitals optimized, ~40% bundle reduction
- **Type Safety**: 100% TypeScript coverage with strict mode
- **Responsive Design**: Mobile-first with dark/light theme support

## Tech Stack

- **Framework**: Next.js 15 with App Router, React Server Components, and Turbopack
- **Architecture**: React Server Components (RSC) with selective client-side interactivity
- **Language**: TypeScript (strict mode, 100% coverage)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Theme**: Next-themes with dark/light mode support
- **Web3**: Wagmi v2 + Viem + Reown AppKit (WalletConnect v2)
- **State Management**: RSC-compatible Zustand stores + TanStack Query
- **Data Fetching**: Server-side async/await with React.cache and Suspense streaming
- **Package Manager**: pnpm with workspace optimization
- **Code Quality**: Biome.js for superior linting and formatting
- **API**: tRPC client with end-to-end type safety
- **Testing**: Vitest + React Testing Library + Playwright E2E
- **Animation**: Tailwindcss-animate for smooth transitions

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- pnpm (recommended package manager)
- Running server API (see [server README](../server/README.md))
- Running AI engine (see [AI engine README](../ai-engine/README.md))

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

### 🔗 **Web3 Features**

- **Multi-chain Wallet Connection**: Support for 300+ wallets across multiple networks
- **Smart Contract Integration**: Live interaction with deployed Valkyrie contracts
- **Real-time Token Data**: Live VLK token balances and metadata
- **Vault Operations**: ERC-4626 vault deposits, withdrawals, and share management
- **Transaction Management**: Comprehensive transaction state and history
- **Network Switching**: Seamless switching between supported networks

### 🤖 **AI Features**

- **Live Portfolio Optimization**: Real-time AI analysis with confidence scoring
- **Market Intelligence Dashboard**: Fear & Greed Index, volatility, BTC dominance
- **Risk Assessment**: Advanced risk metrics and portfolio analysis
- **Strategy Recommendations**: AI-powered yield optimization strategies
- **Performance Tracking**: Historical performance and prediction accuracy

### 🎨 **UI/UX Features**

- **Modern Design**: Brutalist-inspired design with clean aesthetics
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Layout**: Mobile-first design with responsive breakpoints
- **Smooth Animations**: Tailwindcss-animate for polished interactions
- **Accessibility**: WCAG compliant components from Shadcn UI
- **Progressive Loading**: Suspense boundaries for optimal perceived performance

## Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages (RSC-enabled)
│   │   ├── page.tsx           # Landing page (Server Component)
│   │   ├── dashboard/         # Analytics dashboard with AI + Web3
│   │   │   └── page.tsx       # Live portfolio and AI analytics
│   │   ├── vault/             # Vault management interface
│   │   ├── ai-analytics/      # AI market intelligence
│   │   ├── staking/           # Token staking features
│   │   ├── swap/              # Token swapping interface
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Shadcn UI base components
│   │   ├── dashboard/         # Dashboard components (Web3 + AI)
│   │   ├── wallet/            # Wallet connection and management
│   │   │   ├── wallet-button.tsx        # Connect/disconnect button
│   │   │   ├── wallet-status.tsx        # Network and balance display
│   │   │   └── valkyrie-token-info.tsx  # VLK token information
│   │   ├── swap/              # Cross-chain swap interface
│   │   ├── hyperliquid/       # External trading integration
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
│   │   ├── auth-store.ts            # Authentication state
│   │   ├── web3-store.ts           # Web3 connection state
│   │   └── __tests__/         # Store unit tests
│   ├── hooks/                 # Custom React hooks (Client Components only)
│   │   ├── use-valkyrie-vault.ts   # Vault operations
│   │   ├── use-valkyrie-token.ts   # Token operations
│   │   ├── use-token-balance.ts    # Token balance tracking
│   │   └── use-simple-token-balances.ts # Multi-token balances
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts           # Shared type exports
│   └── utils/                 # Client utilities
│       ├── trpc.ts            # tRPC client setup
│       └── security.ts        # Security utilities
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts             # Next.js configuration
├── components.json            # Shadcn UI configuration
├── playwright.config.ts       # E2E testing configuration
├── vitest.config.ts           # Unit testing configuration
└── package.json
```

## Web3 Integration

### **Supported Networks**
- **Ethereum Mainnet** (Chain ID: 1)
- **Arbitrum One** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Sepolia Testnet** (Chain ID: 11155111)

### **Smart Contract Integration**
```typescript
// Example: Using Valkyrie Token hook
import { useValkyrieToken } from '@/hooks/use-valkyrie-token';

function TokenInfo() {
  const { symbol, decimals, totalSupply, userBalance } = useValkyrieToken();

  return (
    <div>
      <p>Token: {symbol}</p>
      <p>Balance: {userBalance}</p>
      <p>Total Supply: {totalSupply}</p>
    </div>
  );
}
```

### **Wallet Integration**
```typescript
// Example: Wallet connection component
import { WalletButton } from '@/components/wallet/wallet-button';

function Header() {
  return (
    <header>
      <nav>
        <WalletButton />
      </nav>
    </header>
  );
}
```

## AI Integration

### **Real-time Market Data**
```typescript
// Example: AI status component
import { trpc } from '@/utils/trpc';

function AIStatus() {
  const { data: marketData } = trpc.ai.getMarketStatus.useQuery();

  return (
    <div>
      <p>Fear & Greed: {marketData?.fearGreedIndex}</p>
      <p>Volatility: {marketData?.volatility}</p>
      <p>BTC Dominance: {marketData?.btcDominance}%</p>
    </div>
  );
}
```

### **Portfolio Optimization**
```typescript
// Example: Portfolio optimizer
import { trpc } from '@/utils/trpc';

function PortfolioOptimizer() {
  const optimizeMutation = trpc.ai.optimizePortfolio.useMutation();

  const handleOptimize = () => {
    optimizeMutation.mutate({
      portfolio: [
        { symbol: 'ETH', allocation: 0.6 },
        { symbol: 'BTC', allocation: 0.4 }
      ]
    });
  };

  return (
    <button onClick={handleOptimize}>
      Optimize Portfolio
    </button>
  );
}
```

## Development

### **Available Scripts**

```bash
# Development server with hot reload
pnpm run dev

# Building
pnpm run build          # Build for production
pnpm run start          # Start production server
pnpm run preview        # Preview production build

# Testing
pnpm run test           # Run unit tests
pnpm run test:watch     # Run tests in watch mode
pnpm run test:e2e       # Run E2E tests with Playwright
pnpm run test:e2e:ui    # Run E2E tests with Playwright UI

# Code quality
pnpm run lint           # Run ESLint
pnpm run type-check     # TypeScript type checking
```

### **Environment Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SERVER_URL` | tRPC server URL | `http://localhost:3000` |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | Reown AppKit project ID | Required for Web3 |
| `NEXT_PUBLIC_DEFAULT_CHAIN` | Default blockchain network | `1` (Ethereum) |
| `NEXT_PUBLIC_ENABLE_TESTNETS` | Enable testnet support | `true` |
| `NEXT_PUBLIC_ENABLE_AI_CHAT` | Enable AI chat features | `true` |
| `NEXT_PUBLIC_ENABLE_WEB3` | Enable Web3 features | `true` |

## Testing

### **Unit Testing**
```bash
# Run all unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test -- --coverage
```

### **E2E Testing**
```bash
# Run E2E tests
pnpm run test:e2e

# Run E2E tests with UI
pnpm run test:e2e:ui

# Run specific test file
pnpm run test:e2e -- tests/wallet-connection.spec.ts
```

## Deployment

### **Vercel Deployment**
The app is optimized for Vercel deployment with pnpm workspace support:

```bash
# Automatic deployment
git push origin main

# Manual deployment
vercel deploy --prod
```

### **Environment Setup for Production**
```bash
# Production environment variables
NEXT_PUBLIC_SERVER_URL=https://your-api-domain.com
NEXT_PUBLIC_REOWN_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_DEFAULT_CHAIN=1
NEXT_PUBLIC_ENABLE_TESTNETS=false
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_WEB3=true
```

## Performance

### **React Server Components Benefits**
- **~40% JavaScript Bundle Reduction**: Server Components reduce client-side JavaScript
- **Faster Initial Page Loads**: Server-side rendering with progressive hydration
- **Improved Core Web Vitals**: Better FCP and LCP scores
- **Enhanced SEO**: Server-rendered content for better search optimization

### **Web3 Performance Optimizations**
- **Smart Contract Call Caching**: Reduced redundant blockchain calls
- **Optimistic Updates**: Immediate UI updates with background confirmation
- **Gas Estimation**: Accurate gas estimation before transactions
- **Batch Requests**: Multiple contract calls batched for efficiency

### **Build Performance**
- **Bundle Size**: Optimized ~1.38MB production bundle
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with optimization

## Security

### **Web3 Security**
- **Secure Wallet Integration**: Industry-standard WalletConnect v2
- **Transaction Validation**: All inputs validated before blockchain submission
- **Network Verification**: Automatic network validation and switching
- **Error Handling**: Comprehensive error handling for failed transactions

### **Application Security**
- **Type Safety**: 100% TypeScript coverage with strict mode
- **Input Validation**: Zod schemas for all user inputs
- **XSS Protection**: React's built-in XSS protection
- **CSP Headers**: Content Security Policy headers in production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Ensure all tests pass (`pnpm test && pnpm test:e2e`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
