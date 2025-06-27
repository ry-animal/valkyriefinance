# Valkyrie Finance - Technical Architecture Guide

## System Overview

Valkyrie Finance is a next-generation DeFi platform that combines AI-powered yield optimization with a sophisticated component-based architecture. The platform is built using a modern monorepo structure with TypeScript, React, and cutting-edge DeFi protocols.

## 🏗️ **Monorepo Architecture**

### **Project Structure**
```
valkyriefinance/
├── apps/
│   ├── web/              # Next.js frontend application (port 3001)
│   ├── server/           # tRPC API server with database (port 3000)
│   ├── storybook-host/   # Component documentation (port 6006)
│   └── ai-engine/        # Go-based AI optimization service
├── packages/
│   ├── ui/               # Centralized component library (@valkyrie/ui)
│   ├── common/           # Shared types and utilities (@valkyrie/common)
│   ├── config/           # Environment and configuration (@valkyrie/config)
│   └── contracts/        # Smart contract ABIs and types (@valkyrie/contracts)
```

### **Development Workflow**
- **Single Command**: `pnpm dev` runs all services simultaneously
- **Hot Reload**: Live development with instant feedback across all apps
- **Type Safety**: End-to-end TypeScript with shared types and validation
- **Component Development**: Add shadcn → move to UI package → create stories
- **Quality Assurance**: `pnpm check` runs Biome linting across all packages
- **Workspace Validation**: `pnpm workspace:check` verifies all package health

### **Infrastructure Quality & Reliability**
- **Code Quality**: Production-grade TypeScript with strict type checking
- **Session Management**: Redis-backed sessions with proper type safety
- **Performance Monitoring**: Structured logging and query timing utilities
- **Error Handling**: Comprehensive error boundaries and type-safe error responses
- **Rate Limiting**: Redis-distributed rate limiting for API protection

## 🎨 **Component System Architecture**

### **Centralized UI Package (`@valkyrie/ui`)**

**Core Philosophy**: Single source of truth for all UI components with comprehensive Storybook documentation.

**Component Categories**:
- **Core**: Button, Card, Input, Label, Badge, Avatar, Alert
- **Layout**: BrutalGrid, BrutalSection, Separator, Sheet
- **Forms**: Form, Textarea, Switch, Checkbox, Select with React Hook Form
- **Overlays**: Dialog, Popover, Tooltip, Toast
- **Data**: Table, Tabs, Progress, Skeleton

**Technology Stack**:
```typescript
// Component foundation
- Shadcn/ui components (battle-tested, accessible)
- Radix UI primitives (headless, composable)
- Tailwind CSS (utility-first styling)
- React Hook Form + Zod (type-safe form validation)

// Development tools
- Storybook 8 (interactive documentation)
- TypeScript strict mode (type safety)
- Vitest (unit testing)
- Playwright (E2E testing)
```

### **Storybook Documentation System**

**Interactive Examples**: 50+ stories covering real-world use cases
- **Form Stories**: Contact forms, settings, DeFi vault deposits
- **Dialog Stories**: Confirmations, wallet connections, vault details
- **Tooltip Stories**: DeFi explanations, help context, smart contract info

**DeFi-Specific Components**:
```typescript
// Vault deposit form with validation
export const VaultDepositForm = {
  token: z.string().min(1, 'Please select a token'),
  amount: z.coerce.number().min(0.01, 'Minimum deposit is 0.01'),
  slippage: z.coerce.number().min(0.1).max(10),
  autoCompound: z.boolean(),
}

// Wallet connection dialog
export const WalletConnectionDialog = {
  wallets: ['MetaMask', 'WalletConnect', 'Coinbase'],
  onConnect: (walletId: string) => void,
  selectedWallet: string | null,
}
```

## 🖥️ **Frontend Architecture (Next.js App)**

### **Application Structure**
```
apps/web/src/
├── app/                  # Next.js App Router
│   ├── dashboard/        # Main dashboard page
│   ├── vault/           # Vault management pages
│   ├── swap/            # Cross-chain swap interface
│   └── ai-analytics/    # AI insights and analytics
├── components/          # App-specific components
│   ├── wallet/          # Web3 wallet integration
│   ├── vault/           # Vault management UI
│   └── dashboard/       # Dashboard components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configuration
└── stores/              # State management (Zustand)
```

### **State Management Strategy**
```typescript
// Zustand for client state
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))

// TanStack Query for server state
export const useVaultData = () => {
  return useQuery({
    queryKey: ['vault', vaultId],
    queryFn: () => trpc.vault.getDetails.query({ vaultId }),
  })
}
```

### **Web3 Integration**
```typescript
// Wagmi + ConnectKit for wallet management
export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, optimism, sepolia],
  connectors: [injected(), coinbaseWallet(), walletConnect()],
  transports: {
    [mainnet.id]: http(alchemyUrl),
    [arbitrum.id]: http(arbitrumUrl),
  },
})

// Conditional Web3 loading
if (env.NEXT_PUBLIC_ENABLE_WEB3) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}
```

## 🔧 **Backend Architecture (tRPC Server)**

### **API Layer Design**
```
apps/server/src/
├── routers/             # tRPC route handlers
│   ├── auth.ts         # Authentication endpoints
│   ├── vault.ts        # Vault operations
│   ├── portfolio.ts    # Portfolio management
│   ├── ai.ts          # AI insights and recommendations
│   └── bridge.ts      # Cross-chain operations
├── db/                 # Database layer
│   ├── schema/        # Drizzle ORM schemas
│   ├── queries/       # Optimized database queries
│   └── migrations/    # Database migration files
└── lib/               # Server utilities and middleware
```

### **Database Schema (Drizzle + Supabase)**
```typescript
// User and authentication
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Vault operations
export const vaultDeposits = pgTable('vault_deposits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  vaultAddress: varchar('vault_address', { length: 42 }).notNull(),
  amount: decimal('amount', { precision: 36, scale: 18 }).notNull(),
  transactionHash: varchar('transaction_hash', { length: 66 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// AI recommendations
export const aiRecommendations = pgTable('ai_recommendations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  strategy: varchar('strategy', { length: 100 }).notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 4 }).notNull(),
  expectedYield: decimal('expected_yield', { precision: 8, scale: 6 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### **tRPC Router Implementation**
```typescript
// Type-safe API with input validation
export const vaultRouter = router({
  getDetails: publicProcedure
    .input(z.object({ vaultId: z.string() }))
    .query(async ({ input }) => {
      return await getVaultDetails(input.vaultId)
    }),

  deposit: protectedProcedure
    .input(vaultDepositSchema)
    .mutation(async ({ input, ctx }) => {
      return await processVaultDeposit(input, ctx.user.id)
    }),
})
```

## 🤖 **AI Engine Architecture (Go Service)**

### **Service Design**
```
apps/ai-engine/
├── internal/
│   ├── models/         # AI model implementations
│   ├── services/       # Business logic services
│   └── server/         # gRPC/HTTP server
├── proto/              # Protocol buffer definitions
└── cmd/                # Application entry points
```

### **AI Model Integration**
```go
// Yield optimization engine
type YieldOptimizer struct {
    models []Model
    dataCollector DataCollector
    riskAssessor RiskAssessor
}

func (yo *YieldOptimizer) OptimizePortfolio(
    ctx context.Context,
    portfolio *Portfolio,
) (*OptimizationResult, error) {
    // Collect real-time market data
    marketData := yo.dataCollector.GetMarketData(ctx)

    // Assess risk for each strategy
    riskScores := yo.riskAssessor.AssessStrategies(portfolio, marketData)

    // Run optimization models
    result := yo.runOptimization(portfolio, marketData, riskScores)

    return result, nil
}
```

## 📱 **Smart Contract Architecture**

### **Contract System Design**
```
packages/contracts/foundry/src/
├── ValkyrieToken.sol      # ERC-20 governance token
├── ValkyrieVault.sol      # ERC-4626 yield-bearing vault
├── ValkyrieAutomation.sol # Chainlink automation integration
└── interfaces/            # Contract interfaces
```

### **ERC-4626 Vault Implementation**
```solidity
contract ValkyrieVault is ERC4626, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // AI-controlled strategy allocation
    mapping(address => uint256) public strategyAllocations;

    // Deposit with AI optimization
    function deposit(uint256 assets, address receiver)
        public
        override
        nonReentrant
        returns (uint256 shares)
    {
        shares = super.deposit(assets, receiver);

        // Trigger AI rebalancing
        _requestRebalance();

        emit DepositWithOptimization(receiver, assets, shares);
    }

    // AI-driven strategy rebalancing
    function rebalanceStrategies(
        address[] calldata strategies,
        uint256[] calldata allocations
    ) external onlyAutomation {
        require(strategies.length == allocations.length, "Length mismatch");

        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < allocations.length; i++) {
            totalAllocation += allocations[i];
            strategyAllocations[strategies[i]] = allocations[i];
        }

        require(totalAllocation == 10000, "Must equal 100%"); // 100% = 10000 basis points

        emit StrategiesRebalanced(strategies, allocations);
    }
}
```

## 🔗 **Integration Patterns**

### **Frontend ↔ Backend Communication**
```typescript
// Type-safe tRPC client
export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
        }),
      ],
    }
  },
})

// React Query integration
export const useVaultDeposit = () => {
  return trpc.vault.deposit.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['vault'])
      toast.success('Deposit successful!')
    },
  })
}
```

### **Backend ↔ AI Service Communication**
```typescript
// gRPC client for AI service
export class AIServiceClient {
  private client: AIServiceClient

  async getOptimizationRecommendation(
    portfolio: Portfolio
  ): Promise<OptimizationResult> {
    const request = {
      portfolio: this.serializePortfolio(portfolio),
      riskTolerance: portfolio.riskTolerance,
    }

    const response = await this.client.optimizePortfolio(request)
    return this.deserializeResult(response)
  }
}
```

### **Smart Contract Integration**
```typescript
// Wagmi hooks for contract interaction
export const useVaultDeposit = (vaultAddress: string) => {
  return useWriteContract({
    address: vaultAddress,
    abi: ValkyrieVaultABI,
    functionName: 'deposit',
  })
}

// Type-safe contract calls
export const depositToVault = async (
  amount: bigint,
  receiver: string
) => {
  const { data: hash } = await writeContract({
    address: VAULT_ADDRESS,
    abi: ValkyrieVaultABI,
    functionName: 'deposit',
    args: [amount, receiver],
  })

  return hash
}
```

## 🔐 **Security Architecture**

### **Authentication & Authorization**
```typescript
// Better Auth integration
export const auth = betterAuth({
  database: {
    provider: 'pg',
    url: env.DATABASE_URL,
  },
  plugins: [
    twoFactor(),
    organization(),
  ],
})

// Protected tRPC procedures
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  })
})
```

### **Smart Contract Security**
```solidity
// Multi-layered security approach
contract ValkyrieVault is ERC4626, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Access control
    modifier onlyAutomation() {
        require(msg.sender == automationAddress, "Only automation");
        _;
    }

    // Emergency controls
    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPaused(block.timestamp);
    }

    // Withdrawal limits
    uint256 public constant MAX_WITHDRAWAL_PER_TX = 1000000e18; // 1M tokens

    function withdraw(uint256 assets, address receiver, address owner)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256 shares)
    {
        require(assets <= MAX_WITHDRAWAL_PER_TX, "Exceeds withdrawal limit");
        return super.withdraw(assets, receiver, owner);
    }
}
```

## 🚀 **Deployment Architecture**

### **Development Environment**
- **Local Development**: `pnpm dev` - All services with hot reload
- **Component Development**: Storybook at `localhost:6006`
- **API Testing**: tRPC panel and Postman integration
- **Database**: Local Supabase or Docker PostgreSQL

### **Production Deployment**
- **Frontend**: Vercel with automatic deployments
- **Backend**: Railway or Vercel serverless functions
- **Database**: Supabase with connection pooling
- **AI Service**: Google Cloud Run or AWS ECS
- **Smart Contracts**: Ethereum mainnet + L2s (Arbitrum, Optimism)

### **CI/CD Pipeline**
```yaml
# GitHub Actions workflow
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 📊 **Performance Optimization**

### **Frontend Optimization**
- **Bundle Splitting**: Dynamic imports for route-based code splitting
- **Image Optimization**: Next.js Image component with WebP conversion
- **Caching Strategy**: SWR for data fetching with background revalidation
- **Component Lazy Loading**: React.lazy for non-critical components

### **Backend Optimization**
- **Database**: Connection pooling and query optimization
- **Caching**: Redis for session storage and API response caching
- **Rate Limiting**: Per-user and per-endpoint rate limiting
- **Background Jobs**: Queue system for heavy AI computations

### **Redis Infrastructure**
```typescript
// Type-safe Redis session management
export class RedisSessionManager {
  async createSession(
    sessionId: string,
    sessionData: Record<string, unknown>,
    ttlSeconds: number = this.defaultTTL
  ): Promise<void> {
    const data = {
      ...sessionData,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlSeconds * 1000,
    }
    await kv.setex(`session:${sessionId}`, ttlSeconds, JSON.stringify(data))
  }
}

// Distributed rate limiting
export class RedisRateLimiter {
  async isAllowed(userIdentifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    // Redis sliding window rate limiting implementation
  }
}
```

### **Smart Contract Optimization**
- **Gas Optimization**: Minimal proxy patterns and efficient storage
- **Batch Operations**: Multi-call patterns for multiple transactions
- **Layer 2 Integration**: Arbitrum and Optimism for lower fees

---

This technical architecture provides a solid foundation for building a sophisticated DeFi platform with AI-powered optimization, comprehensive component systems, and production-ready infrastructure.
