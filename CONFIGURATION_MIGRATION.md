# 🔧 Configuration Consolidation Guide

## 📋 Overview

This guide shows how to migrate from scattered configurations across your monorepo to a centralized `@valkyrie/config` package. This consolidation provides:

- **Single Source of Truth** - All environment variables, constants, and configurations in one place
- **Type Safety** - Zod validation and TypeScript types for all configurations
- **Reusability** - Shared configurations across all apps and packages
- **Maintainability** - Update once, use everywhere

## 🏗️ New Architecture

```
@valkyrie/config
├── env/           # Environment variables with validation
│   ├── client.ts  # Browser-safe environment
│   ├── server.ts  # Server-side environment (includes secrets)
│   └── contracts.ts # Smart contract deployment config
├── networks/      # Blockchain network configurations
├── contracts/     # Contract addresses and ABIs
└── constants/     # App constants and feature flags
```

## 🚀 Migration Steps

### Step 1: Install the Shared Config Package

Add the dependency to each app that needs configuration:

```bash
# In apps/web, apps/server, etc.
pnpm add @valkyrie/config@workspace:*
```

### Step 2: Replace Environment Files

#### **Before (apps/web/src/lib/env.ts):**
```typescript
// Old scattered approach
const envSchema = z.object({
  NEXT_PUBLIC_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
  // ... many more variables
});
```

#### **After (apps/web/src/lib/env.ts):**
```typescript
// New centralized approach
import { clientEnv } from '@valkyrie/config/env';

// That's it! All validation and types are handled centrally
export { clientEnv as env };
```

#### **Before (apps/server/src/lib/env.ts):**
```typescript
// Old approach with duplicate schemas
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  KV_URL: z.string().url().optional(),
  // ... duplicate definitions
});
```

#### **After (apps/server/src/lib/env.ts):**
```typescript
// New centralized approach
import { serverEnv } from '@valkyrie/config/env';

export { serverEnv as env };
```

### Step 3: Update Network Configurations

#### **Before (scattered across files):**
```typescript
// Different files had different network configs
const ETHEREUM_CHAIN_ID = 1;
const SEPOLIA_CHAIN_ID = 11155111;
const BLOCK_EXPLORER = 'https://etherscan.io';
```

#### **After (apps/web/src/lib/wagmi-config.ts):**
```typescript
import { chains, getChain, isTestnet } from '@valkyrie/config/networks';
import { clientEnv } from '@valkyrie/config/env';

// Use centralized network configs
export const networks = clientEnv.NEXT_PUBLIC_ENABLE_TESTNETS
  ? chains
  : chains.filter(chain => !isTestnet(chain.id));

export function createWagmiConfig() {
  return createConfig({
    chains: networks,
    transports: Object.fromEntries(
      networks.map(chain => [
        chain.id,
        http(chain.rpcUrl)
      ])
    ),
  });
}
```

### Step 4: Centralize Contract Addresses

#### **Before (multiple hardcoded addresses):**
```typescript
// Scattered across different files
const VAULT_ADDRESS = '0x123...';
const TOKEN_ADDRESS = '0x456...';
```

#### **After (using shared contracts):**
```typescript
import { getContractAddress, isContractDeployed } from '@valkyrie/config/contracts';
import { useChainId } from 'wagmi';

export function useVaultContract() {
  const chainId = useChainId();

  try {
    const vaultAddress = getContractAddress(chainId, 'valkyrieVault');
    return { address: vaultAddress, isDeployed: true };
  } catch {
    return { address: null, isDeployed: false };
  }
}
```

### Step 5: Use Shared Constants

#### **Before (duplicate constants):**
```typescript
// Different values in different files
const API_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const DEFAULT_SLIPPAGE = 0.5;
```

#### **After (shared constants):**
```typescript
import { appConstants, securityConfig, VALIDATION_PATTERNS } from '@valkyrie/config/constants';

// Use consistent values across all apps
const apiClient = axios.create({
  timeout: appConstants.api.timeout,
  maxRetries: appConstants.api.retries,
});

// Validate Ethereum addresses consistently
export function isValidAddress(address: string): boolean {
  return VALIDATION_PATTERNS.ETHEREUM_ADDRESS.test(address);
}
```

### Step 6: Update Smart Contract Scripts

#### **Before (packages/contracts/foundry/script/Deploy.s.sol):**
```solidity
// Hardcoded configurations per network
function getDeployConfig() internal view returns (DeployConfig memory) {
    uint256 chainId = block.chainid;
    if (chainId == 11155111) { // Sepolia
        return DeployConfig({
            tokenName: "Valkyrie Token",
            // ... hardcoded values
        });
    }
    // ... more hardcoded configs
}
```

#### **After (using TypeScript config generator):**
```typescript
// packages/contracts/scripts/generate-config.ts
import { contractEnv } from '@valkyrie/config/env';
import { getChain } from '@valkyrie/config/networks';

export function generateDeployConfig(chainId: number) {
  const chain = getChain(chainId);
  const isTestnet = chain?.testnet ?? false;

  return {
    tokenName: "Valkyrie Token",
    tokenSymbol: "VLK",
    initialSupply: isTestnet ? "1000000" : "100000000",
    feeRecipient: contractEnv.FEE_RECIPIENT_ADDRESS,
    owner: contractEnv.AI_CONTROLLER_ADDRESS,
  };
}
```

## 📝 Migration Checklist

### ✅ **Phase 1: Environment Variables**
- [ ] Install `@valkyrie/config` in all apps
- [ ] Replace `apps/web/src/lib/env.ts` with shared client config
- [ ] Replace `apps/server/src/lib/env.ts` with shared server config
- [ ] Update contract deployment scripts to use shared contract config
- [ ] Test all apps to ensure environment variables work correctly

### ✅ **Phase 2: Network Configurations**
- [ ] Update wagmi config to use shared network definitions
- [ ] Replace hardcoded chain IDs with shared constants
- [ ] Update block explorer links to use shared utilities
- [ ] Test wallet connections and network switching

### ✅ **Phase 3: Contract Addresses**
- [ ] Move contract addresses to shared package
- [ ] Update deployment scripts to write to shared config
- [ ] Replace hardcoded addresses in frontend hooks
- [ ] Test contract interactions across all networks

### ✅ **Phase 4: Application Constants**
- [ ] Move API timeouts and retry logic to shared constants
- [ ] Consolidate validation patterns and regex
- [ ] Update feature flags to use shared definitions
- [ ] Test all functionality with shared constants

## 🔄 Example Migrations

### **Web App Migration**

```typescript
// OLD: apps/web/src/lib/wagmi-config.ts
import { arbitrum, baseSepolia, mainnet, optimism, polygon, sepolia } from '@reown/appkit/networks';

const projectId = env.NEXT_PUBLIC_REOWN_PROJECT_ID;
export const networks = [mainnet, sepolia, baseSepolia, arbitrum, optimism, polygon];

// NEW: apps/web/src/lib/wagmi-config.ts
import { allChains, testnetChains, mainnetChains } from '@valkyrie/config/networks';
import { clientEnv } from '@valkyrie/config/env';

const projectId = clientEnv.NEXT_PUBLIC_REOWN_PROJECT_ID;
export const networks = clientEnv.NEXT_PUBLIC_ENABLE_TESTNETS
  ? allChains
  : mainnetChains;
```

### **Server Migration**

```typescript
// OLD: apps/server/src/lib/redis.ts
export const REDIS_PREFIXES = {
  RATE_LIMIT: 'rl:',
  SESSION: 'sess:',
  // ... duplicate definitions
} as const;

// NEW: apps/server/src/lib/redis.ts
import { REDIS_PREFIXES, securityConfig } from '@valkyrie/config/constants';

// Use shared prefixes and security config
export const rateLimiter = {
  api: new RedisRateLimiter('api',
    securityConfig.rateLimits.api.requests,
    securityConfig.rateLimits.api.window
  ),
  // ...
};
```

### **Contract Migration**

```typescript
// OLD: packages/contracts/foundry/env.example
VALKYRIE_TOKEN_ADDRESS=
VALKYRIE_VAULT_ADDRESS=
// ... scattered addresses

// NEW: Auto-generated from shared config
import { deployments } from '@valkyrie/config/contracts';

// Addresses are now type-safe and centrally managed
const addresses = deployments[chainId];
```

## 🎯 Benefits After Migration

### **For Developers**
- **Single Source of Truth** - No more hunting for configs across files
- **Type Safety** - IntelliSense and compile-time validation for all configs
- **Consistency** - Same environment variables and constants everywhere
- **Easy Updates** - Change once, update everywhere

### **For Operations**
- **Centralized Environment Management** - All env vars documented in one place
- **Validation** - Automatic validation prevents misconfigurations
- **Security** - Clear separation between client and server variables
- **Deployment** - Simplified deployment with shared contract addresses

### **For Testing**
- **Consistent Test Data** - Same constants and addresses in all tests
- **Easy Mocking** - Centralized configs are easier to mock
- **Network Testing** - Simplified testing across different networks

## 🚨 Important Notes

### **Breaking Changes**
- Environment variable names are now validated and typed
- Some constants may have different names (check the migration guide)
- Contract addresses are now functions, not constants

### **Gradual Migration**
You can migrate incrementally:
1. Start with environment variables (highest impact)
2. Move to network configurations
3. Consolidate contract addresses
4. Finally, move application constants

### **Rollback Plan**
If you need to rollback:
1. The old configuration files are preserved (just commented out)
2. Remove the `@valkyrie/config` dependency
3. Uncomment the old configuration files
4. Update imports back to local files

---

**Ready to start?** Begin with Phase 1 (Environment Variables) as it provides the most immediate benefits and is the safest to migrate.
