# Valkryie Finance

A next-generation decentralized finance (DeFi) platform that integrates advanced AI capabilities with core blockchain infrastructure. The platform enables seamless cross-chain token swaps into specialized ERC-4626 yield-bearing vaults, powered by Uniswap V4 and intelligent AI-driven strategies.

## 🎯 Vision

Create a highly efficient, intelligent, and user-friendly DeFi ecosystem that optimizes capital deployment, enhances yield generation, and provides superior liquidity management through AI-driven strategies.

## ✨ Core Features

### **Current Implementation (Phase 1.3 Complete)**

#### **Core Infrastructure** ✅

- **TypeScript** - Full type safety across the entire stack
- **Monorepo Architecture** - Turborepo-powered build system with shared packages
- **Environment Validation** - Comprehensive Zod-based configuration validation
- **Database Layer** - PostgreSQL with Drizzle ORM and comprehensive schemas
- **API Layer** - tRPC for end-to-end type-safe APIs
- **Authentication** - Better Auth integration for user management

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
- **Web3 Store** - Wallet connection and transaction management
- **Developer Tools** - Redux DevTools integration and debugging

#### **Database Schemas** ✅

- **Portfolio Management** - User portfolios and asset tracking
- **Transaction History** - Comprehensive transaction logging with status tracking
- **Vault Operations** - ERC-4626 vault interaction tracking
- **AI Analytics** - Strategy recommendations and market data
- **12 Database Tables** - Fully migrated with proper indexing

### **Planned Features (Roadmap)**

- **Cross-Chain Swaps** - Direct token swaps into ERC-4626 vaults from multiple chains
- **AI-Powered Optimization** - Dynamic yield strategy optimization and liquidity management
- **ERC-4626 Vaults** - Standardized yield-bearing vault implementation
- **Uniswap V4 Integration** - Custom hooks for advanced AMM functionality
- **Custom ERC-20 Token** - Platform utility and governance token

## 🏗️ Tech Stack

### **Frontend (apps/web)**

- **Next.js 15** - React framework with App Router
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **TanStack Query** - Data fetching and state management
- **Better Auth** - Authentication client
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

### **Shared Packages**

- **@valkryie/common** - Shared types, schemas, and utilities
- **Zod** - Runtime validation and type inference
- **TypeScript** - Strict mode enabled across all packages
- **Comprehensive Types** - Portfolio, Transaction, Vault, AI, Web3 types

## Getting Started

First, install the dependencies:

```bash
bun install
```

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
│   │   │   ├── app/         # Next.js App Router pages
│   │   │   ├── components/  # React components + error boundaries
│   │   │   ├── lib/         # Environment validation and configurations
│   │   │   ├── test/        # Testing utilities and setup
│   │   │   └── utils/       # Enhanced tRPC client with error handling
│   │   ├── vitest.config.ts # Vitest testing configuration
│   │   └── package.json
│   └── server/              # Backend API application (port 3000)
│       ├── src/
│       │   ├── app/         # Next.js API routes
│       │   ├── db/          # Database schemas (4 modules) and migrations
│       │   ├── lib/         # Environment validation and tRPC error handling
│       │   ├── routers/     # tRPC route handlers (5 routers)
│       │   └── types/       # TypeScript type definitions
│       └── package.json
├── packages/
│   └── common/              # Shared package (@valkryie/common)
│       ├── src/
│       │   ├── types/       # Comprehensive type definitions
│       │   ├── schemas/     # Zod validation schemas
│       │   └── utils/       # Shared utility functions
│       └── package.json
├── .cursor/                 # Cursor IDE rules and documentation (ignored)
├── DEVELOPMENT_SUMMARY.mdc  # Complete development progress summary
├── turbo.json              # Turborepo configuration with test tasks
└── package.json            # Root package configuration
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

### **Testing Commands**

- `cd apps/web && bun test` - Run web app unit tests
- `cd apps/web && bun test:watch` - Run tests in watch mode
- `cd apps/web && bun test:ui` - Run tests with UI interface

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
NEXT_PUBLIC_ENABLE_TESTNETS=false
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_WEB3=false
```

## 🔄 Development Workflow

1. **Start Development** - `bun run dev:apps` for parallel web/server development
2. **Make Changes** - Edit code in any package with hot reload
3. **Run Tests** - `bun test` or `bun test:watch` for continuous testing
4. **Type Check** - `bun check-types` validates across all packages
5. **Build** - `bun build` ensures production readiness
6. **Database Changes** - Use `db:generate` and `db:migrate` for schema updates

### **Quality Gates**

- ✅ **Type Safety**: All code must pass TypeScript strict mode
- ✅ **Error Handling**: Comprehensive error boundaries and user-friendly messages
- ✅ **Testing**: Unit tests for components and critical functions
- ✅ **Build Success**: All packages must build without errors

## 📈 Roadmap

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

### **Phase 2: Web3 Integration**

- [ ] Wallet connection (Wagmi, ConnectKit)
- [ ] Smart contract integration
- [ ] Cross-chain bridge protocols
- [ ] Token operations

### **Phase 3: DeFi Core**

- [ ] ERC-4626 vault implementation
- [ ] Uniswap V4 custom hooks
- [ ] Cross-chain swap functionality
- [ ] Yield optimization strategies

### **Phase 4: AI Layer**

- [ ] ML model integration
- [ ] Strategy recommendation engine
- [ ] Risk assessment algorithms
- [ ] Automated rebalancing

## 🤝 Contributing

This is a private project currently in active development. Contribution guidelines will be established as the project matures.

## 📄 License

[License to be determined]
