# Valkryie Finance

A next-generation decentralized finance (DeFi) platform that integrates advanced AI capabilities with core blockchain infrastructure. The platform enables seamless cross-chain token swaps into specialized ERC-4626 yield-bearing vaults, powered by Uniswap V4 and intelligent AI-driven strategies.

## 🎯 Vision

Create a highly efficient, intelligent, and user-friendly DeFi ecosystem that optimizes capital deployment, enhances yield generation, and provides superior liquidity management through AI-driven strategies.

## ✨ Core Features

### **Current Implementation (Phase 3 + Smart Contract Integration Complete)** 🚀

#### **Core Infrastructure** ✅

- **TypeScript** - Full type safety across the entire stack
- **Monorepo Architecture** - Turborepo-powered build system with shared packages
- **Environment Validation** - Comprehensive Zod-based configuration validation
- **Database Layer** - PostgreSQL with Drizzle ORM and comprehensive schemas
- **API Layer** - tRPC for end-to-end type-safe APIs
- **Authentication** - Better Auth integration for user management

#### **Smart Contract Integration** ✅ **NEW**

- **Contracts Package** - `@valkryie/contracts` with complete ABIs and types
- **ERC-4626 Vault ABI** - Full vault standard with deposit, withdraw, mint, redeem
- **Valkryie Token ABI** - ERC-20 + governance + staking functionality
- **Multi-Chain Addresses** - Contract addresses for 5 chains (Ethereum, Arbitrum, Optimism, Polygon, Base)
- **Type-Safe Hooks** - Complete contract interaction hooks with error handling
- **Transaction Tracking** - Automatic Web3 store integration for all operations

#### **Web3 Foundation** ✅

- **Wagmi v2.15.6 & Viem v2.31.0** - Modern Ethereum integration
- **ConnectKit** - Beautiful wallet connection UI with 5-chain support
- **Multi-Chain Support** - Ethereum, Arbitrum, Optimism, Polygon, Base (8453)
- **Real Wallet Connectivity** - Live wallet connection and network switching
- **ERC-20 Token Reading** - Dynamic token balance display across chains
- **Network Switching** - Real-time chain switching with ConnectKit integration

#### **Contract Operation Hooks** ✅ **NEW**

- **Vault Operations** - `useVaultInfo()`, `useVaultBalance()`, `useVaultOperations()`
  - Deposit, withdraw, mint, redeem with preview functions
  - Real-time vault data: total assets, share price, user positions
  - Type-safe asset/share conversions with error handling
- **Token Operations** - `useValkryieTokenInfo()`, `useValkryieTokenBalance()`, `useValkryieTokenOperations()`
  - Token info, balance tracking, and governance features
  - Staking operations: stake, unstake, claim rewards
  - Delegation and voting functionality
- **Transaction Management** - All operations integrated with Zustand Web3 store

#### **DeFi User Interface** ✅ **NEW**

- **Vault Demo Page** (`/vault`) - Interactive ERC-4626 vault operations interface
  - Real-time vault information display
  - Deposit/withdraw functionality with amount validation
  - Share price calculations and asset conversion previews
  - User position tracking and transaction history
- **Wallet Integration Page** (`/wallet`) - Complete wallet management
  - Multi-chain wallet status and balances
  - Network switching with real-time updates
  - Token balance display across 5 supported chains
- **Professional Navigation** - Clean header with all demo pages

#### **AI Foundation** ✅ **NEW**

- **AI Demo Interface** (`/ai`) - Foundation for AI-powered DeFi insights
- **Smart Contract Context** - Ready for AI analysis integration
- **Extensible Architecture** - Prepared for vault analytics and strategy recommendations
- **Future Enhancement Ready** - Framework for AI router integration

#### **Error Handling & Testing** ✅

- **React Error Boundaries** - Comprehensive error catching with user-friendly UI
- **tRPC Error Handling** - Database-specific error mapping and user-friendly messages
- **Health Monitoring** - Database and service connectivity monitoring
- **Unit Testing** - Vitest with React Testing Library (23 tests passing)
- **E2E Testing** - Playwright comprehensive integration testing (14 tests)
- **Build System** - Turbo-orchestrated builds with caching and optimization

#### **State Management** ✅

- **Zustand Stores** - Lightweight, type-safe state management (4 stores)
- **Auth Store** - User authentication and session management
- **UI Store** - Modal management, notifications, and theme state
- **Portfolio Store** - Portfolio selection and asset tracking
- **Web3 Store** - Wallet connection, transaction management, and contract state
- **Developer Tools** - Redux DevTools integration and debugging

#### **Database Schemas** ✅

- **Portfolio Management** - User portfolios and asset tracking
- **Transaction History** - Comprehensive transaction logging with status tracking
- **Vault Operations** - ERC-4626 vault interaction tracking
- **AI Analytics** - Strategy recommendations and market data
- **12 Database Tables** - Fully migrated with proper indexing

### **Ready for Production Testing** 🎯

The platform now includes:

- **5 Interactive Pages** - Home, Dashboard, Wallet, Vault Demo, AI Demo, Stores Demo
- **Complete DeFi Interface** - Ready for real contract deployment and testing
- **Multi-Chain Infrastructure** - Full support for major EVM chains
- **Type-Safe Contract Operations** - Production-ready smart contract integration
- **Professional UI/UX** - Modern DeFi application interface

## 🏗️ Tech Stack

### **Frontend (apps/web)**

- **Next.js 15** - React framework with App Router
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **TanStack Query** - Data fetching and state management
- **Better Auth** - Authentication client
- **Wagmi v2.15.6** - React hooks for Ethereum
- **Viem v2.31.0** - TypeScript Ethereum interface
- **ConnectKit** - Beautiful wallet connection UI
- **Zustand** - Lightweight state management
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **Error Boundaries** - Comprehensive error handling

### **Backend (apps/server)**

- **Next.js API** - Server-side API implementation
- **tRPC** - Type-safe API layer with error handling
- **Drizzle ORM** - Database operations with migrations
- **PostgreSQL** - Primary database with 12 tables
- **Better Auth** - Authentication server
- **Health Monitoring** - Service status and connectivity checks

### **Smart Contracts (packages/contracts)** ✅ **NEW**

- **@valkryie/contracts** - Complete contract integration package
- **ERC-4626 Vault ABI** - Standardized vault operations
- **Valkryie Token ABI** - ERC-20 + governance + staking
- **Multi-Chain Addresses** - 5 supported networks
- **Type Generation** - Full TypeScript contract types
- **Deployment Ready** - Contract addresses and metadata management

### **Shared Packages**

- **@valkryie/common** - Shared types, schemas, and utilities
- **Zod** - Runtime validation and type inference
- **TypeScript** - Strict mode enabled across all packages
- **Comprehensive Types** - Portfolio, Transaction, Vault, AI, Web3 types

## 🚀 Getting Started

### Prerequisites

- **Bun** - Fast JavaScript runtime and package manager
- **PostgreSQL** - Database engine
- **Node.js 18+** - For compatibility with some packages

### Installation

1. **Clone and install dependencies:**

```bash
git clone https://github.com/your-org/valkryiefinance.git
cd valkryiefinance
bun install
```

2. **Environment Setup:**

Create environment files from examples:

```bash
# Server environment
cp apps/server/.env.example apps/server/.env.local

# Web environment
cp apps/web/.env.example apps/web/.env.local
```

3. **Database Setup:**

Ensure PostgreSQL is running and update your database URL in `apps/server/.env.local`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/valkryie_db
```

Apply database migrations:

```bash
cd apps/server
bun run db:generate  # Generate new migrations if needed
bun run db:migrate   # Apply migrations
```

4. **Start Development Servers:**

```bash
# Start both web and server in parallel
bun run dev:apps

# Or start all packages (including any future ones)
bun dev

# Or start individually
bun dev:web     # Frontend at http://localhost:3001
bun dev:server  # Backend at http://localhost:3000
```

## 📁 Project Structure

```
valkryiefinance/
├── apps/
│   ├── web/                 # Frontend Next.js application (port 3001)
│   │   ├── src/
│   │   │   ├── app/         # Next.js App Router pages (6 pages)
│   │   │   │   ├── vault/   # 🆕 Interactive vault demo page
│   │   │   │   ├── wallet/  # 🆕 Multi-chain wallet management
│   │   │   │   └── ai/      # 🆕 AI demo interface
│   │   │   ├── components/  # React components + error boundaries
│   │   │   ├── hooks/       # 🆕 Smart contract interaction hooks
│   │   │   │   ├── use-valkryie-vault.ts    # ERC-4626 operations
│   │   │   │   ├── use-valkryie-token.ts    # Token & governance
│   │   │   │   └── use-token-balance.ts     # Multi-chain balances
│   │   │   ├── lib/         # Environment validation and configurations
│   │   │   ├── stores/      # Zustand state management (4 stores)
│   │   │   ├── test/        # Testing utilities and setup
│   │   │   └── utils/       # Enhanced tRPC client with error handling
│   │   ├── vitest.config.ts # Vitest testing configuration
│   │   └── package.json
│   └── server/              # Backend API application (port 3000)
│       ├── src/
│       │   ├── app/         # Next.js API routes
│       │   ├── db/          # Database schemas (4 modules) and migrations
│       │   ├── lib/         # Environment validation and tRPC error handling
│       │   ├── routers/     # tRPC route handlers (6 routers)
│       │   └── types/       # TypeScript type definitions
│       └── package.json
├── packages/
│   ├── common/              # Shared package (@valkryie/common)
│   │   ├── src/
│   │   │   ├── types/       # Comprehensive type definitions
│   │   │   ├── schemas/     # Zod validation schemas
│   │   │   └── utils/       # Shared utility functions
│   │   └── package.json
│   └── contracts/           # 🆕 Smart contract integration (@valkryie/contracts)
│       ├── src/
│       │   ├── abis/        # Contract ABIs (ERC-4626, Valkryie Token)
│       │   ├── addresses/   # Multi-chain contract addresses
│       │   └── types/       # Contract interaction types
│       └── package.json
├── turbo.json              # Turborepo configuration with test tasks
└── package.json            # Root package configuration (4 packages)
```

## 📊 Database Schema

The platform uses a comprehensive PostgreSQL schema supporting:

### **Core Tables**

- **`portfolios`** - User portfolio management
- **`portfolio_assets`** - Token holdings and balances
- **`transactions`** - Complete transaction history
- **`vault_operations`** - ERC-4626 vault interactions
- **`vault_strategies`** - AI-driven investment strategies
- **`ai_recommendations`** - ML-generated trading recommendations
- **`market_data`** - Real-time price and market information

### **Authentication Tables** (Better Auth)

- **`user`** - User accounts and profiles
- **`session`** - Active user sessions
- **`account`** - OAuth provider connections
- **`verification`** - Email verification tokens

## 🛠️ Available Scripts

### **Root Commands**

- `bun dev` - Start all apps in development mode
- `bun run dev:apps` - Start web and server in parallel
- `bun build` - Build all applications for production
- `bun check-types` - TypeScript validation across all packages
- `bun test` - Run test suite across all packages
- `bun run test:watch` - Run tests in watch mode
- `bun lint` - Run linting across all packages

### **Testing Commands**

- `bun test` - Run all unit tests (23 tests)
- `bun run test:watch` - Run unit tests in watch mode
- `bun run test:e2e` - Run Playwright E2E tests (14 tests)
- `bun run test:e2e:ui` - Run E2E tests with UI
- `bun run test:e2e:headed` - Run E2E tests in headed mode

### **Database Commands (from apps/server)**

- `bun run db:generate` - Generate new Drizzle migrations
- `bun run db:migrate` - Apply pending migrations
- `bun run db:push` - Push schema changes directly (dev only)
- `bun run db:studio` - Open Drizzle Studio for database exploration

### **Individual App Commands**

- `bun dev:web` - Start frontend only (port 3001)
- `bun dev:server` - Start backend only (port 3000)

## 🔧 Configuration

### **Environment Variables**

The platform uses environment-specific configuration with Zod validation:

**Server (.env.local):**

```env
DATABASE_URL=postgresql://localhost:5432/valkryie_db
BETTER_AUTH_SECRET=your_32_character_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
```

**Web (.env.local):**

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CHAIN=1
NEXT_PUBLIC_ENABLE_TESTNETS=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_WEB3=true

# Optional Web3 Configuration
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
# NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

## 📖 Smart Contract Integration

### **Available Hooks**

**Vault Operations (`use-valkryie-vault.ts`):**

```typescript
const vaultInfo = useVaultInfo(); // Vault metadata and totals
const vaultBalance = useVaultBalance(); // User's vault position
const { deposit, withdraw, mint, redeem } = useVaultOperations();
```

**Token Operations (`use-valkryie-token.ts`):**

```typescript
const tokenInfo = useValkryieTokenInfo(); // Token metadata
const tokenBalance = useValkryieTokenBalance(); // User's token balance
const { stake, unstake, delegate } = useValkryieTokenOperations();
```

**Multi-Chain Balances (`use-token-balance.ts`):**

```typescript
const balance = useTokenBalance(tokenAddress, symbol); // Any ERC-20 across 5 chains
```

### **Supported Chains**

- **Ethereum** (1) - ETH, USDC, USDT, WETH, DAI, WBTC
- **Arbitrum** (42161) - ETH, USDC, USDT, WETH, DAI, WBTC, ARB
- **Optimism** (10) - ETH, USDC, USDT, WETH, DAI, WBTC, OP
- **Polygon** (137) - MATIC, USDC, USDT, WETH, DAI, WBTC
- **Base** (8453) - ETH, USDC, WETH, DAI, CBETH

## 🔄 Development Workflow

1. **Start Development** - `bun run dev:apps` for parallel web/server development
2. **Make Changes** - Edit code in any package with hot reload
3. **Run Tests** - `bun test` or `bun test:watch` for continuous testing
4. **Type Check** - `bun check-types` validates across all packages
5. **Build** - `bun build` ensures production readiness (22.6s full build)
6. **Database Changes** - Use `db:generate` and `db:migrate` for schema updates

### **Quality Gates**

- ✅ **Type Safety**: All code must pass TypeScript strict mode
- ✅ **Error Handling**: Comprehensive error boundaries and user-friendly messages
- ✅ **Testing**: Unit tests for components and critical functions
- ✅ **Build Success**: All 4 packages must build without errors
- ✅ **Contract Safety**: All smart contract interactions are type-safe

## 📈 Development Roadmap

### **✅ Phase 0: Foundation** (Complete)

- [x] TypeScript monorepo setup with Turborepo
- [x] Environment validation with Zod
- [x] Database schemas with Drizzle ORM (12 tables)
- [x] tRPC API layer with type safety
- [x] Authentication with Better Auth

### **✅ Phase 1.1: Error Handling & Testing** (Complete)

- [x] React Error Boundaries with user-friendly UI
- [x] tRPC error handling with database-specific mapping
- [x] Health monitoring and service status checks
- [x] Unit testing infrastructure with Vitest
- [x] Build system optimization with Turbo

### **✅ Phase 1.2: State Management** (Complete)

- [x] Zustand stores for client state management
- [x] Auth, UI, Portfolio, and Web3 stores
- [x] Redux DevTools integration
- [x] Type-safe selectors and actions

### **✅ Phase 1.3: E2E Testing & Cleanup** (Complete)

- [x] Playwright E2E testing infrastructure (14 tests)
- [x] Navigation, stores, and error handling tests
- [x] Removed example routes (AI chat, todos)
- [x] Codebase cleanup focused on Web3/DeFi

### **✅ Phase 2: Portfolio UI** (Complete)

- [x] Modern DeFi-focused landing page design
- [x] Comprehensive vault operations interface
- [x] Portfolio management components
- [x] Professional header and footer
- [x] AI strategy visualization

### **✅ Phase 3: Web3 Integration Foundation** (Complete)

- [x] Wagmi v2.15.6 & Viem v2.31.0 integration
- [x] ConnectKit beautiful wallet connection UI
- [x] Multi-chain support (5 chains: Ethereum, Arbitrum, Optimism, Polygon, Base)
- [x] Real wallet connectivity replacing mock functionality
- [x] ERC-20 token balance reading with contract ABIs
- [x] Zustand store synchronization with Wagmi state
- [x] Comprehensive wallet demo page with connected state management

### **✅ Phase A-B-C: Smart Contract Integration** (Complete) 🎉

**Phase A: Complete Contract Hooks**

- [x] `@valkryie/contracts` package with ABIs and types
- [x] ERC-4626 vault interaction hooks (deposit, withdraw, mint, redeem)
- [x] Valkryie token hooks (stake, unstake, delegate, governance)
- [x] Multi-chain contract address management
- [x] Transaction tracking integration with Web3 store

**Phase B: Demo Vault Page**

- [x] Interactive vault operations interface (`/vault`)
- [x] Real-time vault data display and user position tracking
- [x] Deposit/withdraw functionality with amount validation
- [x] Share price calculations and asset conversion previews
- [x] Professional UI with cards, tabs, and live data updates

**Phase C: AI Integration Foundation**

- [x] AI demo interface (`/ai`) ready for enhancement
- [x] Smart contract context preparation for AI analysis
- [x] Extensible architecture for vault analytics
- [x] Framework prepared for AI router integration

### **🎯 Next Phase: Production Deployment**

- [ ] Deploy ERC-4626 vault contracts to testnets
- [ ] Deploy Valkryie token with governance features
- [ ] Live contract integration testing
- [ ] Cross-chain bridge integration
- [ ] Enhanced AI analytics with real contract data

### **Phase 4: Advanced DeFi Features**

- [ ] Uniswap V4 custom hooks integration
- [ ] Automated yield optimization strategies
- [ ] Cross-chain asset management
- [ ] Advanced portfolio analytics

### **Phase 5: AI-Powered Optimization**

- [ ] ML model integration for strategy recommendations
- [ ] Real-time risk assessment algorithms
- [ ] Automated rebalancing and yield farming
- [ ] Predictive market analysis

## 🚀 Current Status

**🎉 Ready for Production Testing!**

The Valkryie Finance platform now includes:

- **Complete DeFi Interface** - Interactive vault and token management
- **5-Chain Web3 Support** - Full multi-chain wallet and contract integration
- **Type-Safe Operations** - Production-ready smart contract interaction hooks
- **Professional UI/UX** - Modern DeFi application with comprehensive error handling
- **Extensible Architecture** - Ready for real contract deployment and AI enhancement

**Build Status:** ✅ All 4 packages building successfully in 22.6s  
**Test Coverage:** ✅ 23 unit tests + 14 E2E tests passing  
**Type Safety:** ✅ 100% TypeScript strict mode compliance

## 🤝 Contributing

This is a private project currently in active development. Contribution guidelines will be established as the project matures.

## 📄 License

[License to be determined]
