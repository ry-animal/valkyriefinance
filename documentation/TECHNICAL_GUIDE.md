# Valkryie Finance - Technical Guide

## Architecture Overview

### System Architecture

Valkryie Finance is built as a modern DeFi platform using a monorepo architecture with clear separation of concerns:

```
valkryiefinance/
├── apps/
│   ├── web/          # Next.js frontend (Port 3001)
│   └── server/       # tRPC API server (Port 3000)
├── packages/
│   ├── contracts/    # Foundry smart contracts
│   └── common/       # Shared types and utilities
```

### Technology Stack

**Frontend (apps/web)**

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Web3**: Wagmi, Viem, ConnectKit
- **State**: Zustand for Web3 state management
- **API**: tRPC client with TanStack Query

**Backend (apps/server)**

- **Framework**: Next.js API routes with tRPC
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth integration
- **Validation**: Zod schemas

**Smart Contracts (packages/contracts)**

- **Language**: Solidity 0.8.20+
- **Framework**: Foundry
- **Standards**: ERC-20, ERC-4626, OpenZeppelin
- **Testing**: Comprehensive Foundry test suite

**Infrastructure**

- **Monitoring**: Tenderly integration
- **Deployment**: Vercel (frontend), Railway (backend)
- **Testing**: Vitest, Playwright, Foundry

## Smart Contract Architecture

### Core Contracts

#### ValkryieToken (VLK)

- **Standard**: ERC-20 with extensions
- **Features**: Governance capabilities, burnable, pausable
- **Security**: Access controls, reentrancy guards
- **Gas Optimized**: Custom implementations for efficiency

```solidity
contract ValkryieToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
}
```

#### ValkryieVault (ERC-4626)

- **Standard**: ERC-4626 tokenized vault
- **Features**: Yield optimization, fee management, emergency controls
- **Security**: Inflation attack protection, secure asset handling
- **AI Integration**: Hooks for automated strategy execution

```solidity
contract ValkryieVault is ERC4626, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant STRATEGY_ROLE = keccak256("STRATEGY_ROLE");

    uint256 public performanceFee = 1000; // 10%
    uint256 public managementFee = 200;   // 2%
}
```

### Security Features

#### Access Control

- **Role-based permissions** using OpenZeppelin's AccessControl
- **Multi-signature requirements** for critical operations
- **Emergency pause mechanisms** for all contracts

#### Reentrancy Protection

- **ReentrancyGuard** on all external functions
- **Checks-Effects-Interactions** pattern throughout
- **Safe external calls** with proper error handling

#### Economic Security

- **Inflation attack protection** in ERC-4626 vault
- **Slippage protection** for swaps
- **Fee validation** and bounds checking

## Frontend Architecture

### Component Structure

```
apps/web/src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Auth-protected routes
│   ├── dashboard/      # Main dashboard
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
│   ├── ui/            # Shadcn UI components
│   ├── web3/          # Web3-specific components
│   └── forms/         # Form components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
└── stores/            # Zustand stores
```

### State Management

#### Zustand Store Structure

```typescript
interface Web3Store {
  // Wallet state
  isConnected: boolean;
  address: string | undefined;
  chainId: number | undefined;

  // Transaction state
  pendingTxs: Transaction[];

  // Token balances
  tokenBalances: Record<string, bigint>;

  // Actions
  setPendingTx: (tx: Transaction) => void;
  updateBalance: (token: string, balance: bigint) => void;
}
```

#### Server State with tRPC

- **Automatic caching** with TanStack Query
- **Type-safe APIs** end-to-end
- **Optimistic updates** for better UX
- **Background refetching** for real-time data

### Web3 Integration

#### Wagmi Configuration

```typescript
export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, optimism, base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Valkryie Finance" }),
    walletConnect({ projectId: PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(ALCHEMY_RPC_URL),
    // ... other chains
  },
});
```

#### Contract Interactions

- **Type-safe contract calls** using Wagmi hooks
- **Automatic ABI inference** from contract artifacts
- **Transaction status tracking** with toast notifications
- **Gas estimation** and optimization

## Backend Architecture

### tRPC Router Structure

```
apps/server/src/routers/
├── auth.ts           # Authentication routes
├── portfolio.ts      # Portfolio management
├── vault.ts          # Vault operations
├── analytics.ts      # Performance analytics
├── ai.ts            # AI recommendations
└── bridge.ts         # Cross-chain bridge operations
```

#### Bridge Router (`bridge.ts`)

The bridge router provides cross-chain swap functionality using Rubic API integration:

```typescript
export const bridgeRouter = router({
  getQuote: publicProcedure
    .input(bridgeQuoteSchema)
    .query(async ({ input }) => {
      // Fetch best quote from Rubic API
      const response = await fetch(`${RUBIC_API_URL}/quoteBest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params: input }),
      });
      return response.json();
    }),

  getSwap: publicProcedure
    .input(bridgeSwapSchema)
    .mutation(async ({ input }) => {
      // Get transaction data for cross-chain swap
      const response = await fetch(`${RUBIC_API_URL}/swap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params: input }),
      });
      return response.json();
    }),
});
```

**Key Features:**

- **Real-time Quotes**: Dynamic pricing from Rubic's aggregated liquidity sources
- **Multi-chain Support**: Ethereum, Arbitrum, Base Sepolia integration
- **Type Safety**: Full Zod schema validation for inputs and outputs
- **Error Handling**: Comprehensive error management with structured responses

### Database Schema

#### Core Tables

```sql
-- Users and authentication
users, accounts, sessions, verification_tokens

-- Portfolio management
portfolios, portfolio_assets, asset_balances

-- Transactions
transactions, transaction_history

-- Vault operations
vault_deposits, vault_withdrawals, vault_strategies

-- AI and analytics
ai_recommendations, performance_metrics, market_data
```

#### Relationships

- **Users** → **Portfolios** (one-to-many)
- **Portfolios** → **Assets** (many-to-many through portfolio_assets)
- **Users** → **Transactions** (one-to-many)
- **Vault Operations** → **Users** (many-to-one)

### API Design Patterns

#### Input Validation

```typescript
const createPortfolioSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  initialAssets: z.array(assetSchema).optional(),
});

export const bridgeQuoteSchema = z.object({
  srcTokenAddress: z.string(),
  srcTokenBlockchain: z.string(),
  srcTokenAmount: z.string(),
  dstTokenAddress: z.string(),
  dstTokenBlockchain: z.string(),
  slippage: z.number().optional().default(1),
  referrer: z.string().optional().default("valkryie"),
});

export const bridgeSwapSchema = bridgeQuoteSchema.extend({
  fromAddress: z.string(),
});

export const portfolioRouter = router({
  create: protectedProcedure
    .input(createPortfolioSchema)
    .mutation(async ({ input, ctx }) => {
      // Implementation
    }),
});
```

#### Error Handling

- **Structured error responses** with proper HTTP status codes
- **Client-side error boundaries** for graceful degradation
- **Comprehensive logging** for debugging and monitoring

## AI Vault Architecture

### Strategy Framework

#### Strategy Interface

```typescript
interface VaultStrategy {
  readonly name: string;
  readonly riskLevel: 1 | 2 | 3 | 4 | 5;

  analyze(marketData: MarketData): Promise<StrategyRecommendation>;
  execute(
    vault: VaultContract,
    params: ExecutionParams
  ): Promise<TransactionHash>;
  validate(proposal: StrategyProposal): Promise<ValidationResult>;
}
```

#### AI Components

1. **Market Analysis Engine** - Real-time market data processing
2. **Strategy Optimizer** - ML-based strategy selection
3. **Risk Assessment** - Portfolio risk evaluation
4. **Execution Engine** - Automated trade execution

### Integration Patterns

#### Chainlink Integration

- **Price feeds** for accurate asset pricing
- **Automation** for strategy execution triggers
- **Functions** for off-chain computation
- **CCIP** for cross-chain operations

#### Oracle Security

- **Multiple data sources** for price validation
- **Time-weighted averages** to prevent manipulation
- **Circuit breakers** for extreme market conditions
- **Manual override** capabilities for emergencies

## Testing Strategy

### Smart Contract Testing

#### Foundry Test Structure

```solidity
contract ValkryieVaultTest is Test {
    ValkryieVault vault;
    ValkryieToken token;

    function setUp() public {
        token = new ValkryieToken();
        vault = new ValkryieVault(IERC20(token), "Vault Shares", "vVLK");
    }

    function test_Deposit() public {
        // Test implementation
    }

    function testFuzz_WithdrawAllowsOnlyOwner(uint256 amount, address user) public {
        // Fuzz test implementation
    }
}
```

#### Test Categories

- **Unit tests** for individual functions
- **Integration tests** for contract interactions
- **Fuzz tests** for edge case discovery
- **Invariant tests** for system-wide properties

### Frontend Testing

#### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import { WalletStatus } from "@/components/web3/wallet-status";

describe("WalletStatus", () => {
  it("shows connected state when wallet is connected", () => {
    render(<WalletStatus />, { wrapper: TestProviders });
    expect(screen.getByText(/connected/i)).toBeInTheDocument();
  });
});
```

#### E2E Testing with Playwright

```typescript
test("user can connect wallet and view portfolio", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click('[data-testid="connect-wallet"]');
  // Mock wallet connection
  await expect(page.locator('[data-testid="portfolio-value"]')).toBeVisible();
});
```

## Development Workflow

### Environment Setup

#### Development Environment

```bash
# Install dependencies
bun install

# Start development servers
bun dev          # Starts both web and server
bun dev:web      # Frontend only (port 3001)
bun dev:server   # Backend only (port 3000)

# Database operations
bun db:generate  # Generate migrations
bun db:migrate   # Apply migrations
bun db:studio    # Open Drizzle Studio
```

#### Testing Commands

```bash
# Smart contracts
bun test:contracts           # Run Foundry tests
bun test:contracts:coverage  # With coverage report

# Frontend
bun test:web                # Run Vitest tests
bun test:web:ui             # With UI dashboard
bun test:e2e                # Run Playwright tests

# All tests
bun test                    # Run complete test suite
```

### Code Quality

#### TypeScript Configuration

- **Strict mode enabled** for maximum type safety
- **Path mapping** for clean imports
- **Incremental compilation** for faster builds

#### Linting and Formatting

- **ESLint** with strict rules for code quality
- **Prettier** for consistent code formatting
- **Husky** for pre-commit hooks
- **lint-staged** for staged file linting

#### Git Workflow

- **Feature branches** for all development work
- **PR reviews** required before merging
- **Automated testing** on all PRs
- **Semantic versioning** for releases

### Testnet Development Strategy

#### Production-Like Testnet Deployment

**Objective**: Test all features with real protocol integrations before mainnet launch

**Deployment Process**:

```bash
# Deploy to Sepolia with real integrations
forge script script/DeployTestnetProduction.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

**Real Protocol Integrations**:

- **Aave V3 Sepolia**: `0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951`
- **Compound Sepolia**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- **Chainlink Price Feeds**: ETH/USD and USDC/USD on Sepolia
- **USDC Sepolia**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`

#### Testing Phases

**Phase 1 (Week 1-2): Foundation**

- Deploy contracts with real protocol integrations
- Configure frontend for testnet environment
- Test basic vault operations with real USDC
- Validate price oracle functionality

**Phase 2 (Week 2-3): Advanced Features**

- Test yield generation strategies (Aave, Compound)
- Implement AI strategy mocking
- Cross-chain functionality preparation
- Performance optimization

**Phase 3 (Week 3-4): Load Testing**

- Stress test smart contracts
- Frontend performance optimization
- Backend scalability testing
- Security vulnerability assessment

**Phase 4 (Week 4-5): User Acceptance**

- Beta user program launch
- Complete user journey testing
- Feedback collection and integration
- Documentation finalization

#### Mainnet Readiness Criteria

**Technical Requirements**:

- [ ] All 150+ tests passing consistently
- [ ] Security audit completed with no critical issues
- [ ] Gas optimization verified (35% reduction achieved)
- [ ] Performance metrics meeting targets

**User Experience Requirements**:

- [ ] User acceptance testing completed successfully
- [ ] Support documentation finalized
- [ ] Community feedback integrated
- [ ] Beta user satisfaction >4.5/5

**Business Requirements**:

- [ ] Legal and compliance review completed
- [ ] Partnership integrations tested
- [ ] Marketing and launch strategy finalized
- [ ] Incident response procedures documented

## Deployment Architecture

### Infrastructure Overview

#### Frontend Deployment (Vercel)

- **Automatic deployments** from GitHub
- **Preview deployments** for PRs
- **Edge caching** for optimal performance
- **Custom domains** with SSL

#### Backend Deployment (Railway)

- **Auto-scaling** based on demand
- **Database management** with backups
- **Environment isolation** (dev/staging/prod)
- **Health monitoring** and alerts

### Environment Management

#### Configuration

```typescript
// Environment validation with Zod
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  ALCHEMY_API_KEY: z.string(),
  TENDERLY_ACCESS_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
```

#### Security

- **Environment variable encryption**
- **Secret rotation** policies
- **Access control** for production environments
- **Audit logging** for all deployments

## Monitoring and Observability

### Smart Contract Monitoring (Tenderly)

#### Real-time Monitoring

- **Transaction tracking** with detailed execution traces
- **Gas usage optimization** insights
- **Error detection** and alerting
- **Performance metrics** dashboard

#### Alert Configuration

```typescript
const alertConfig = {
  contractAddress: VAULT_ADDRESS,
  triggers: [
    { event: "LargeWithdrawal", threshold: "1000000" },
    { event: "EmergencyPause", immediate: true },
    { function: "deposit", gasThreshold: "500000" },
  ],
  notifications: ["email", "slack", "webhook"],
};
```

### Application Monitoring

#### Performance Tracking

- **Core Web Vitals** monitoring
- **API response times** tracking
- **Database query performance**
- **User experience metrics**

#### Error Tracking

- **Client-side error boundary** integration
- **Server-side error logging**
- **Automatic error reporting**
- **Error correlation** across services

## Security Considerations

### Smart Contract Security

#### Audit Process

1. **Internal review** by development team
2. **Automated scanning** with tools like Slither
3. **Professional audit** by security firms
4. **Bug bounty program** for ongoing security

#### Security Features

- **Multi-signature wallets** for admin functions
- **Time delays** for critical operations
- **Emergency pause** mechanisms
- **Upgrade governance** through DAO voting

### Application Security

#### Authentication & Authorization

- **Secure session management** with Better Auth
- **Role-based access control** (RBAC)
- **API rate limiting** to prevent abuse
- **Input validation** and sanitization

#### Data Protection

- **Encryption at rest** for sensitive data
- **HTTPS enforcement** for all communications
- **CORS configuration** for API security
- **CSP headers** for XSS protection

## Performance Optimization

### Frontend Optimization

#### Bundle Optimization

- **Tree shaking** to eliminate unused code
- **Code splitting** for optimal loading
- **Image optimization** with Next.js Image
- **Font optimization** with next/font

#### Caching Strategy

- **Static asset caching** at CDN level
- **API response caching** with TanStack Query
- **Browser caching** with proper headers
- **Service worker** for offline functionality

### Backend Optimization

#### Database Performance

- **Connection pooling** for efficient resource usage
- **Query optimization** with proper indexing
- **Caching layer** with Redis for frequently accessed data
- **Read replicas** for scaling read operations

#### API Performance

- **Response compression** with gzip
- **Pagination** for large datasets
- **Background jobs** for heavy processing
- **CDN integration** for global distribution

## AI Services

The AI services consist of a high-performance, Go-based engine located in the `apps/ai-engine` directory. This engine provides a RESTful API that is consumed by the main tRPC server (`apps/server`). This architecture ensures a clean separation of concerns, allowing the AI engine to be optimized independently for performance-critical computations.

### AI Engine API Endpoints

The Go-based AI engine exposes the following RESTful endpoints, which are called by the tRPC server:

- **`GET /health`**: Provides a health check of the AI engine and its sub-services, like the data collector.
- **`GET /api/market-indicators`**: Returns real-time market indicators, including the Fear & Greed Index, market cap, and DeFi TVL.
- **`POST /api/optimize-portfolio`**: Accepts a user's portfolio data and returns a comprehensive optimization plan, including rebalancing actions, expected returns, and risk analysis.
- **`POST /api/risk-metrics`**: Accepts portfolio data and returns detailed risk metrics such as Value at Risk (VaR), Sharpe Ratio, Beta, and max drawdown.
- **`POST /api/market-analysis`**: Accepts a list of tokens and returns a detailed technical and sentiment analysis for each.

### tRPC AI Router (`apps/server/src/routers/ai.ts`)

The main server application provides a type-safe interface to the AI engine's capabilities through the `aiRouter`. This router abstracts the direct REST calls and integrates the AI insights into the broader platform ecosystem. Key procedures include:

- **`getAIEngineStatus` (Query)**: Wraps the `/health` endpoint.
- **`getMarketIndicators` (Query)**: Wraps the `/api/market-indicators` endpoint.
- **`optimizePortfolioAdvanced` (Mutation)**: The primary optimization procedure. It calls the `/api/optimize-portfolio`, `/api/risk-metrics`, and `/api/market-analysis` endpoints in sequence to provide a holistic portfolio review.
- **`assessPortfolioRisk` (Mutation)**: Wraps the `/api/risk-metrics` endpoint.
- **`getTokenAnalysis` (Mutation)**: Wraps the `/api/market-analysis` endpoint.

This setup ensures that the frontend application (`apps/web`) can interact with the powerful AI engine through a secure, efficient, and fully type-safe tRPC API.

## Frontend Architecture

The frontend is a Next.js application built with the App Router, located in `apps/web`.

---

**Last Updated**: December 2024
**Version**: 2.0
**Maintainer**: Development Team
