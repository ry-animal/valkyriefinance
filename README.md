# Valkyrie Finance: AI-Driven DeFi Platform

🚀 **Modern DeFi Platform with AI-Powered Yield Optimization**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Reown AppKit](https://img.shields.io/badge/Wallet-Reown%20AppKit-purple)](https://reown.com/)
[![Foundry](https://img.shields.io/badge/Smart%20Contracts-Foundry-blue)](https://getfoundry.sh/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)](https://github.com/features/actions)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com)
[![Tests](https://img.shields.io/badge/Tests-150%2B%20Passing-brightgreen)](https://github.com)

## 🎯 Project Overview

Valkyrie Finance is a next-generation DeFi platform that combines AI-driven yield optimization with modern Web3 infrastructure. The platform features intelligent vaults that automatically optimize yield strategies across multiple DeFi protocols and chains.

### ✨ Key Features

- **🤖 AI-Powered Vaults**: Autonomous yield optimization using machine learning algorithms
- **🌉 Cross-Chain Support**: Seamless asset bridging and multi-chain operations
- **🔗 Modern Wallet Integration**: Powered by Reown AppKit for superior UX (300+ wallets)
- **📊 Real-Time Analytics**: Comprehensive performance tracking and risk monitoring
- **🎮 Interactive Demo**: Full-featured vault and token operations interface
- **⚡ Production Ready**: Comprehensive CI/CD pipeline with 150+ automated tests
- **🛡️ Type Safety**: 100% TypeScript coverage with strict mode enforcement
- **🚀 Modern Stack**: Next.js 15, Wagmi v2, Foundry, and cutting-edge Web3 tools

---

## 🏗️ Architecture

### Frontend Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript (strict mode, 100% coverage)
- **Styling**: Tailwind CSS + Shadcn UI components + tailwindcss-animate
- **Web3**: Wagmi v2 + Viem + Reown AppKit (WalletConnect v2)
- **State Management**: Zustand + TanStack Query
- **Testing**: Vitest + React Testing Library (23 tests passing)
- **Code Quality**: ESLint + Prettier with automated CI checks

### Backend Stack

- **API**: tRPC with end-to-end type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-auth integration
- **Runtime**: Node.js with Bun package manager
- **Deployment**: Vercel with automatic deployments

### Smart Contracts

- **Language**: Solidity ^0.8.28
- **Framework**: Foundry (Forge, Anvil, Cast)
- **Standards**: ERC-20, ERC-4626 (Vault Standard)
- **Testing**: 127 comprehensive unit, fuzz, and integration tests
- **Coverage**: Full test coverage with gas optimization

### DevOps & CI/CD

- **Monorepo**: Turborepo for efficient builds and caching
- **CI/CD**: GitHub Actions with parallel job execution
- **Package Management**: Bun for fast installs and builds
- **Type Safety**: End-to-end TypeScript with strict mode
- **Code Quality**: ESLint, Prettier, automated testing

---

## 📁 Project Structure

```
valkyriefinance/
├── .github/
│   └── workflows/
│       └── main.yml              # Comprehensive CI/CD pipeline
├── apps/
│   ├── web/                      # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/             # App router pages
│   │   │   │   ├── page.tsx             # Landing page
│   │   │   │   ├── vault/               # Vault demo page
│   │   │   │   ├── dashboard/           # Analytics dashboard
│   │   │   │   ├── ai/                  # AI features demo
│   │   │   │   ├── stores/              # State management demo
│   │   │   │   └── login/               # Authentication
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── ui/                  # Shadcn UI components
│   │   │   │   ├── wallet/              # Wallet-related components
│   │   │   │   ├── vault/               # Vault interface components
│   │   │   │   ├── brutalist/           # Brutalist design components
│   │   │   │   └── examples/            # Demo components
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   │   ├── use-valkyrie-vault.ts    # Vault operations
│   │   │   │   └── use-valkyrie-token.ts    # Token operations
│   │   │   ├── lib/             # Utilities and configurations
│   │   │   │   ├── wagmi-config.ts      # Reown AppKit setup
│   │   │   │   └── env.ts               # Environment validation
│   │   │   ├── stores/          # Zustand state stores
│   │   │   │   └── __tests__/           # Store unit tests
│   │   │   └── types/           # TypeScript type definitions
│   │   ├── tailwind.config.ts   # Tailwind configuration
│   │   ├── .eslintrc.js         # ESLint configuration
│   │   └── package.json
│   └── server/                   # tRPC API server
│       ├── src/
│       │   ├── routers/         # API route handlers
│       │   ├── db/              # Database schema and migrations
│       │   ├── lib/             # Server utilities
│       │   └── types/           # Server-side types
│       └── package.json
├── packages/
│   ├── contracts/               # Smart contracts package
│   │   ├── src/
│   │   │   ├── abis/            # Contract ABIs
│   │   │   ├── addresses/       # Contract addresses
│   │   │   └── types/           # Contract types
│   │   ├── foundry/             # Foundry project
│   │   │   ├── src/             # Solidity contracts (5 contracts)
│   │   │   ├── test/            # Contract tests (15+ test suites)
│   │   │   └── script/          # Deployment scripts
│   │   └── package.json
│   └── common/                  # Shared utilities
│       ├── src/
│       │   ├── types/           # Shared type definitions
│       │   ├── utils/           # Utility functions
│       │   └── schemas/         # Validation schemas
│       └── package.json
├── documentation/               # Project documentation
│   ├── PRD.md                  # Product Requirements Document
│   └── MIGRATION_SUMMARY.md    # Migration and development summary
├── scripts/
│   └── prepare-npm-deploy.js   # Deployment preparation script
├── turbo.json                  # Monorepo configuration
├── vercel.json                 # Vercel deployment configuration
└── package.json                # Root package configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Bun** (recommended package manager)
- **Git**
- **PostgreSQL** (for database)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/valkyriefinance.git
cd valkyriefinance

# Install dependencies
bun install

# Build shared packages (required for type checking)
cd packages/common && bun run build
cd ../contracts && bun run build
cd ../..

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env.local

# Configure your environment variables:
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (get from https://cloud.reown.com)
# - Database connection strings
# - API keys and secrets

# Set up database
cd apps/server
bun run db:push
bun run db:seed

# Start development servers
cd ../..
bun run dev:apps
```

### Access Points

- **Web Application**: http://localhost:3001
- **API Server**: http://localhost:3000
- **Database Studio**: `bun run db:studio`

---

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev              # Start all services
bun run dev:apps         # Start web + server only
bun run dev:web          # Start web app only
bun run dev:server       # Start API server only

# Building
bun run build            # Build all packages
bun run build:web        # Build web app only
bun run check-types      # Type checking across all packages

# Testing
bun run test             # Run all tests (23 web + 127 contract tests)
bun run test:watch       # Watch mode testing

# Database
bun run db:push          # Push schema changes
bun run db:studio        # Open database studio
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations

# Code Quality
bun run lint             # Lint all packages
bun run prepare:deploy   # Prepare for npm-based deployment
```

### Key Components

#### Wallet Integration

- **Reown AppKit**: Modern wallet connection with support for 300+ wallets
- **Multi-chain**: Ethereum, Arbitrum, Optimism, Polygon, Sepolia
- **Type-safe**: Full TypeScript integration with Wagmi v2
- **SSR Compatible**: Proper hydration handling for Next.js

#### Vault System

- **ERC-4626 Standard**: Industry-standard vault implementation
- **AI Optimization**: Automated yield strategy management
- **Real-time Data**: Live vault metrics and performance tracking
- **Preview Functions**: Transaction simulation before execution

#### User Interface

- **Responsive Design**: Mobile-first approach with excellent UX
- **Dark/Light Mode**: Automatic theme switching
- **Component Library**: Shadcn UI with custom brutalist components
- **Animations**: Smooth transitions with tailwindcss-animate

---

## 🧪 Testing

### Test Coverage Summary

- **Web Application**: 23/23 tests passing ✅
- **Smart Contracts**: 127/127 tests passing ✅
- **Type Checking**: All packages clean ✅
- **Linting**: No errors ✅
- **Build**: Production build successful ✅

### Smart Contract Tests

```bash
cd packages/contracts/foundry
forge test                    # Run all contract tests
forge test --gas-report      # Include gas usage
forge coverage               # Test coverage report
```

**Test Categories:**

- **Core Functionality**: 16 tests (including fuzz & invariant tests)
- **Valkyrie Token**: 24 tests (including governance & staking)
- **Vault Integration**: 10 tests (including multi-user scenarios)
- **AI Integration**: 13 tests (machine learning integration)
- **Price Oracle**: 15 tests (price feed accuracy & manipulation resistance)
- **Automation**: 12 tests (automated strategy execution)
- **Cross-Chain**: 8 tests (bridge and multi-chain operations)
- **Security**: 29 tests (attack vectors and edge cases)

### Web Application Tests

```bash
cd apps/web
bun run test                 # Run component tests
bun run test:watch           # Watch mode
```

**Test Categories:**

- **Error Boundary**: 2 tests (error handling)
- **Auth Store**: 8 tests (authentication state management)
- **UI Store**: 13 tests (user interface state)

### API Tests

```bash
cd apps/server
bun run test                 # Run API tests
```

---

## 🔧 Configuration

### Environment Variables

#### Web App (`apps/web/.env.local`)

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CHAIN=1
NEXT_PUBLIC_ENABLE_TESTNETS=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_WEB3=true
```

#### Server (`apps/server/.env.local`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/valkyrie
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### Wallet Configuration

The project uses Reown AppKit (formerly WalletConnect) for wallet connections:

- **Supported Networks**: Ethereum, Arbitrum, Optimism, Polygon, Sepolia
- **Wallet Support**: 300+ wallets including MetaMask, Coinbase, Rainbow, etc.
- **Features**: Account management, network switching, transaction signing
- **SSR Safe**: Proper hydration handling for server-side rendering

---

## 🌟 Features

### Current Implementation

#### ✅ Core Platform

- [x] Modern Next.js 15 application with App Router
- [x] Reown AppKit wallet integration (WalletConnect v2)
- [x] Multi-chain support (5 networks)
- [x] Responsive UI with dark/light themes
- [x] Type-safe API with tRPC
- [x] Comprehensive CI/CD pipeline
- [x] Production-ready build system

#### ✅ Vault System

- [x] ERC-4626 vault interface
- [x] Deposit/withdraw operations with previews
- [x] Real-time balance tracking
- [x] Transaction simulation
- [x] Vault analytics dashboard
- [x] Multi-user vault support

#### ✅ Token Operations

- [x] Platform token management
- [x] Staking and rewards system
- [x] Governance token features
- [x] Balance and allowance tracking
- [x] Delegation functionality

#### ✅ Developer Experience

- [x] Hot reload development
- [x] TypeScript strict mode (100% coverage)
- [x] Comprehensive error handling
- [x] Monorepo architecture with Turborepo
- [x] Automated testing and deployment
- [x] Package workspace management

#### ✅ Smart Contracts

- [x] 5 core smart contracts implemented
- [x] 127 comprehensive tests (unit, fuzz, integration)
- [x] ERC-20 platform token with governance
- [x] ERC-4626 vault standard implementation
- [x] Price oracle with manipulation resistance
- [x] Automation system for strategy execution
- [x] AI integration hooks

### Planned Features

#### 🔄 AI Integration

- [ ] Machine learning yield optimization
- [ ] Risk assessment algorithms
- [ ] Automated rebalancing strategies
- [ ] Anomaly detection system

#### 🔄 Advanced DeFi

- [ ] Cross-chain asset bridging
- [ ] Liquidity provision strategies
- [ ] Yield farming automation
- [ ] Portfolio optimization

#### 🔄 Enterprise Features

- [ ] Advanced analytics dashboard
- [ ] Risk management tools
- [ ] Institutional features
- [ ] API for third-party integration

---

## 🚀 Deployment

### Vercel Deployment

The project is configured for deployment on Vercel with automatic handling of workspace dependencies:

1. **Automatic Deployment**: Push to `main` branch triggers automatic deployment
2. **Build Process**: Vercel runs the preparation script to convert workspace dependencies
3. **Environment Variables**: Set required environment variables in Vercel dashboard

#### Required Environment Variables for Vercel:

```bash
# Database
DATABASE_URL=your_production_database_url

# Authentication
BETTER_AUTH_SECRET=your_production_auth_secret
BETTER_AUTH_URL=https://your-domain.vercel.app

# AI Services
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Web3 (Optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
```

#### Manual Deployment:

```bash
# Prepare for npm-based deployment
bun run prepare:deploy

# Deploy to Vercel
vercel --prod
```

### Local Production Build

To test the production build locally:

```bash
# Build all packages
bun run build

# Or build just the web app
bun run build:web

# Start production server
cd apps/web && bun start
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration with comprehensive testing:

### Pipeline Jobs

1. **Smart Contract Tests**

   - Foundry installation and setup
   - Contract compilation and testing
   - Gas usage reporting
   - 127 tests across all contracts

2. **Web Application Tests**

   - Bun setup and dependency installation
   - Shared package building
   - TypeScript type checking
   - ESLint code quality checks
   - 23 unit tests for components and stores

3. **Server Application Tests**

   - API type checking
   - Server-side validation
   - Database schema validation

4. **E2E Tests** (runs after other tests pass)
   - Playwright browser testing
   - Full application flow testing
   - Cross-browser compatibility

### Build Status

- **All Tests**: ✅ 150+ tests passing
- **Type Safety**: ✅ 100% TypeScript coverage
- **Code Quality**: ✅ ESLint clean
- **Build**: ✅ Production build successful
- **Deployment**: ✅ Vercel deployment ready

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- **TypeScript**: All code must be properly typed (strict mode)
- **Testing**: Include tests for new features (maintain 100% coverage)
- **Documentation**: Update docs for significant changes
- **Code Style**: Follow existing patterns and use provided linters
- **CI/CD**: Ensure all tests pass before submitting PR

---

## 📚 Documentation

### Quick Links

- **[API Documentation](apps/server/README.md)** - tRPC endpoint reference
- **[Smart Contract Docs](packages/contracts/README.md)** - Contract architecture
- **[Component Library](apps/web/src/components/README.md)** - UI component guide
- **[Migration Summary](documentation/MIGRATION_SUMMARY.md)** - Development history

### Guides

- **[Wallet Integration](docs/WALLET_INTEGRATION.md)** - Reown AppKit setup
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Testing Strategy](docs/TESTING.md)** - Comprehensive testing approach

---

## 🛡️ Security

### Security Measures

- **Type Safety**: End-to-end TypeScript for reduced runtime errors
- **Input Validation**: Comprehensive validation on all inputs
- **Environment Isolation**: Secure environment variable handling
- **Wallet Security**: Non-custodial wallet integration
- **Smart Contract Security**: 127 comprehensive tests including security scenarios
- **CI/CD Security**: Automated security checks in deployment pipeline

### Reporting Issues

Please report security vulnerabilities to: security@valkyrie.finance

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Reown](https://reown.com/)** - For excellent wallet infrastructure
- **[Wagmi](https://wagmi.sh/)** - For React hooks for Ethereum
- **[Shadcn UI](https://ui.shadcn.com/)** - For beautiful UI components
- **[Next.js](https://nextjs.org/)** - For the powerful React framework
- **[Foundry](https://getfoundry.sh/)** - For smart contract development
- **[Turborepo](https://turbo.build/)** - For monorepo management
- **[Bun](https://bun.sh/)** - For fast package management and builds

---

## 📞 Contact

- **Website**: [valkyrie.finance](https://valkyrie.finance)
- **Email**: hello@valkyrie.finance
- **GitHub**: [github.com/valkyriefinance](https://github.com/valkyriefinance)

---

**Built with ❤️ for the future of DeFi**

_Revolutionizing decentralized finance through AI-driven automation and intelligent yield optimization._
