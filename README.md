# Valkryie Finance

A next-generation decentralized finance (DeFi) platform that integrates advanced AI capabilities with core blockchain infrastructure. The platform enables seamless cross-chain token swaps into specialized ERC-4626 yield-bearing vaults, powered by Uniswap V4 and intelligent AI-driven strategies.

## 🎯 Vision

Create a highly efficient, intelligent, and user-friendly DeFi ecosystem that optimizes capital deployment, enhances yield generation, and provides superior liquidity management through AI-driven strategies.

## ✨ Core Features

### **Current Implementation (Phase 0 Complete)**

- **TypeScript** - Full type safety across the entire stack
- **Monorepo Architecture** - Turborepo-powered build system with shared packages
- **Environment Validation** - Comprehensive Zod-based configuration validation
- **Database Layer** - PostgreSQL with Drizzle ORM and comprehensive schemas
- **API Layer** - tRPC for end-to-end type-safe APIs
- **Authentication** - Better Auth integration for user management

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

### **Backend (apps/server)**

- **Next.js API** - Server-side API implementation
- **tRPC** - Type-safe API layer
- **Drizzle ORM** - Database operations
- **PostgreSQL** - Primary database
- **Better Auth** - Authentication server

### **Shared Packages**

- **@valkryie/common** - Shared types, schemas, and utilities
- **Zod** - Runtime validation and type inference
- **TypeScript** - Strict mode enabled across all packages

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
# Start both web and server
bun dev

# Or start individually
bun dev:web     # Frontend at http://localhost:3001
bun dev:server  # Backend at http://localhost:3000
```

## 📁 Project Structure

```
valkryiefinance/
├── apps/
│   ├── web/                 # Frontend Next.js application
│   │   ├── src/
│   │   │   ├── app/         # Next.js App Router pages
│   │   │   ├── components/  # React components
│   │   │   ├── lib/         # Utilities and configurations
│   │   │   └── utils/       # Helper functions
│   │   └── package.json
│   └── server/              # Backend API application
│       ├── src/
│       │   ├── app/         # Next.js API routes
│       │   ├── db/          # Database schemas and migrations
│       │   ├── lib/         # Server utilities
│       │   ├── routers/     # tRPC route handlers
│       │   └── types/       # TypeScript type definitions
│       └── package.json
├── packages/
│   └── common/              # Shared package
│       ├── src/
│       │   ├── types/       # Shared TypeScript types
│       │   ├── schemas/     # Zod validation schemas
│       │   └── utils/       # Shared utility functions
│       └── package.json
├── .cursor/                 # Cursor IDE rules and documentation
├── turbo.json              # Turborepo configuration
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
- `bun build` - Build all applications for production
- `bun check-types` - TypeScript validation across all packages
- `bun test` - Run test suite (when implemented)

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
NEXT_PUBLIC_ENABLE_TESTNETS=false
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_WEB3=false
```

## 🔄 Development Workflow

1. **Make Changes** - Edit code in any package
2. **Type Check** - `bun check-types` validates across all packages
3. **Build** - `bun build` ensures production readiness
4. **Database Changes** - Use `db:generate` and `db:migrate` for schema updates

## 📈 Roadmap

### **Phase 1: Enhanced Infrastructure** (Next)

- [ ] Error handling and monitoring
- [ ] Testing infrastructure (Vitest, Playwright)
- [ ] Performance optimization
- [ ] API documentation

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
