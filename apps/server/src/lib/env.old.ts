import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env files
// Priority: .env.local > .env > .env.example
config({ path: ['.env.local', '.env'] });

const envSchema = z.object({
  // Database Configuration
  DATABASE_URL: z.string().url('Invalid database URL'),

  // Redis Configuration (Vercel KV)
  KV_URL: z.string().url('Invalid KV URL').optional(),
  KV_REST_API_URL: z.string().url('Invalid KV REST API URL').optional(),
  KV_REST_API_TOKEN: z.string().optional(),
  KV_REST_API_READ_ONLY_TOKEN: z.string().optional(),

  // CORS Configuration
  CORS_ORIGIN: z.string().url('Invalid CORS origin URL'),

  // AI Configuration (optional for build)
  GOOGLE_AI_API_KEY: z.string().optional(),

  // Blockchain RPC URLs (optional for future Web3 integration)
  ETHEREUM_RPC_URL: z.string().url().optional(),
  ARBITRUM_RPC_URL: z.string().url().optional(),
  OPTIMISM_RPC_URL: z.string().url().optional(),

  // Contract Addresses (optional for future smart contract integration)
  PLATFORM_TOKEN_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  VAULT_CONTRACT_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  UNISWAP_V4_POSITION_MANAGER: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),

  // External API Keys (optional)
  COINGECKO_API_KEY: z.string().optional(),
  DEFILLAMA_API_KEY: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server Configuration
  PORT: z.coerce.number().default(3000),
});

let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export { env };
export type Env = z.infer<typeof envSchema>;
