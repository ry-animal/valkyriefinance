# Valkyrie Finance: AI-Driven DeFi Platform

🚀 **Modern DeFi Platform with AI-Powered Yield Optimization**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Reown AppKit](https://img.shields.io/badge/Wallet-Reown%20AppKit-purple)](https://reown.com/)
[![Foundry](https://img.shields.io/badge/Smart%20Contracts-Foundry-blue)](https://getfoundry.sh/)

## 🎯 Project Overview

Valkyrie Finance is a next-generation DeFi platform that combines AI-driven yield optimization with modern Web3 infrastructure. The platform features intelligent vaults that automatically optimize yield strategies across multiple DeFi protocols and chains.

### ✨ Key Features

- **🤖 AI-Powered Vaults**: Autonomous yield optimization using machine learning algorithms
- **🌉 Cross-Chain Support**: Seamless asset bridging and multi-chain operations
- **🔗 Modern Wallet Integration**: Powered by Reown AppKit for superior UX
- **📊 Real-Time Analytics**: Comprehensive performance tracking and risk monitoring
- **🎮 Interactive Demo**: Full-featured vault and token operations interface

---

## 🏗️ Architecture

### Frontend Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Web3**: Wagmi v2 + Viem + Reown AppKit
- **State Management**: Zustand + TanStack Query

### Backend Stack

- **API**: tRPC with end-to-end type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-auth integration
- **Runtime**: Node.js with Bun package manager

### Smart Contracts

- **Language**: Solidity ^0.8.28
- **Framework**: Foundry (Forge, Anvil, Cast)
- **Standards**: ERC-20, ERC-4626 (Vault Standard)
- **Testing**: Comprehensive unit, fuzz, and integration tests

---

## 📁 Project Structure

```
valkyriefinance/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/           # App router pages
│   │   │   │   ├── page.tsx           # Landing page
│   │   │   │   ├── vault/             # Vault demo page
│   │   │   │   ├── dashboard/         # Analytics dashboard
│   │   │   │   ├── ai/                # AI features demo
│   │   │   │   ├── stores/            # State management demo
│   │   │   │   └── login/             # Authentication
│   │   │   ├── components/    # Reusable UI components
│   │   │   │   ├── ui/                # Shadcn UI components
│   │   │   │   ├── wallet/            # Wallet-related components
│   │   │   │   ├── vault/             # Vault interface components
│   │   │   │   └── examples/          # Demo components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   ├── use-valkyrie-vault.ts    # Vault operations
│   │   │   │   └── use-valkyrie-token.ts    # Token operations
│   │   │   ├── lib/           # Utilities and configurations
│   │   │   │   ├── wagmi-config.ts    # Reown AppKit setup
│   │   │   │   └── env.ts             # Environment validation
│   │   │   ├── stores/        # Zustand state stores
│   │   │   └── types/         # TypeScript type definitions
│   │   └── package.json
│   └── server/                 # tRPC API server
│       ├── src/
│       │   ├── routers/       # API route handlers
│       │   ├── db/            # Database schema and migrations
│       │   ├── lib/           # Server utilities
│       │   └── types/         # Server-side types
│       └── package.json
├── packages/
│   ├── contracts/             # Smart contracts package
│   │   ├── src/
│   │   │   ├── abis/          # Contract ABIs
│   │   │   ├── addresses/     # Contract addresses
│   │   │   └── types/         # Contract types
│   │   ├── foundry/           # Foundry project
│   │   │   ├── src/           # Solidity contracts
│   │   │   ├── test/          # Contract tests
│   │   │   └── script/        # Deployment scripts
│   │   └── package.json
│   └── common/                # Shared utilities
│       ├── src/
│       └── package.json
├── documentation/             # Project documentation
├── turbo.json                # Monorepo configuration
└── package.json              # Root package configuration
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
bun run check-types      # Type checking

# Testing
bun run test             # Run all tests
bun run test:watch       # Watch mode testing

# Database
bun run db:push          # Push schema changes
bun run db:studio        # Open database studio
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations

# Code Quality
bun run lint             # Lint all packages
```

### Key Components

#### Wallet Integration

- **Reown AppKit**: Modern wallet connection with support for 300+ wallets
- **Multi-chain**: Ethereum, Arbitrum, Optimism, Polygon, Sepolia
- **Type-safe**: Full TypeScript integration with Wagmi v2

#### Vault System

- **ERC-4626 Standard**: Industry-standard vault implementation
- **AI Optimization**: Automated yield strategy management
- **Real-time Data**: Live vault metrics and performance tracking

#### User Interface

- **Responsive Design**: Mobile-first approach with excellent UX
- **Dark/Light Mode**: Automatic theme switching
- **Component Library**: Shadcn UI with custom components

---

## 🧪 Testing

### Smart Contract Tests

```bash
cd packages/contracts/foundry
forge test                    # Run all contract tests
forge test --gas-report      # Include gas usage
forge coverage               # Test coverage report
```

### Web Application Tests

```bash
cd apps/web
bun run test                 # Run component tests
bun run test:watch           # Watch mode
```

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
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Wallet Configuration

The project uses Reown AppKit (formerly WalletConnect) for wallet connections:

- **Supported Networks**: Ethereum, Arbitrum, Optimism, Polygon, Sepolia
- **Wallet Support**: 300+ wallets including MetaMask, Coinbase, Rainbow, etc.
- **Features**: Account management, network switching, transaction signing

---

## 🌟 Features

### Current Implementation

#### ✅ Core Platform

- [x] Modern Next.js 15 application with App Router
- [x] Reown AppKit wallet integration
- [x] Multi-chain support (5 networks)
- [x] Responsive UI with dark/light themes
- [x] Type-safe API with tRPC

#### ✅ Vault System

- [x] ERC-4626 vault interface
- [x] Deposit/withdraw operations
- [x] Real-time balance tracking
- [x] Preview functions for operations
- [x] Vault analytics dashboard

#### ✅ Token Operations

- [x] Platform token management
- [x] Staking and rewards system
- [x] Governance token features
- [x] Balance and allowance tracking

#### ✅ Developer Experience

- [x] Hot reload development
- [x] TypeScript strict mode
- [x] Comprehensive error handling
- [x] Monorepo architecture with Turborepo

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

### Development Deployment

The application is configured for easy deployment on modern platforms:

- **Vercel**: Optimized for Next.js applications
- **Railway**: Full-stack deployment with database
- **Docker**: Containerized deployment option

### Production Considerations

- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for session and API caching
- **Monitoring**: Error tracking and performance monitoring
- **Security**: Environment variable validation and secure headers

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- **TypeScript**: All code must be properly typed
- **Testing**: Include tests for new features
- **Documentation**: Update docs for significant changes
- **Code Style**: Follow existing patterns and use provided linters

---

## 📚 Documentation

### Quick Links

- **[API Documentation](apps/server/README.md)** - tRPC endpoint reference
- **[Smart Contract Docs](packages/contracts/README.md)** - Contract architecture
- **[Component Library](apps/web/src/components/README.md)** - UI component guide

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
- **Smart Contract Security**: Comprehensive testing and best practices

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

---

## 📞 Contact

- **Website**: [valkyrie.finance](https://valkyrie.finance)
- **Email**: hello@valkyrie.finance
- **GitHub**: [github.com/valkyriefinance](https://github.com/valkyriefinance)

---

**Built with ❤️ for the future of DeFi**

_Revolutionizing decentralized finance through AI-driven automation and intelligent yield optimization._
