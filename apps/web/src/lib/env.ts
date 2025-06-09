import { z } from "zod";

const envSchema = z.object({
  // Server URL for tRPC communication
  NEXT_PUBLIC_SERVER_URL: z.string().url("Invalid server URL"),
  
  // Wallet Connect Project ID (from WalletConnect Cloud)
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  
  // Alchemy API Key for RPC endpoints
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
  
  // Network Configuration
  NEXT_PUBLIC_DEFAULT_CHAIN: z.coerce.number().default(1),
  NEXT_PUBLIC_ENABLE_TESTNETS: z.coerce.boolean().default(false),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_AI_CHAT: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_WEB3: z.coerce.boolean().default(false),
  
  // Analytics (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  
  // Environment (only validate on server-side)
  NODE_ENV: typeof window === "undefined" 
    ? z.enum(["development", "production", "test"]).default("development")
    : z.string().optional(),
});

const isServer = typeof window === "undefined";

let env: z.infer<typeof envSchema>;

// On client side, create a safe fallback env object
const getClientEnv = () => ({
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_DEFAULT_CHAIN: Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN) || 1,
  NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
  NEXT_PUBLIC_ENABLE_AI_CHAT: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT !== 'false',
  NEXT_PUBLIC_ENABLE_WEB3: process.env.NEXT_PUBLIC_ENABLE_WEB3 === 'true',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NODE_ENV: process.env.NODE_ENV || 'development',
});

if (isServer) {
  // Server-side validation - strict
  try {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      throw new Error("NEXT_PUBLIC_SERVER_URL is required");
    }
    
    console.log("🔍 Parsing environment variables (server):", {
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
      NEXT_PUBLIC_DEFAULT_CHAIN: process.env.NEXT_PUBLIC_DEFAULT_CHAIN,
      NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS,
      NEXT_PUBLIC_ENABLE_AI_CHAT: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT,
      NEXT_PUBLIC_ENABLE_WEB3: process.env.NEXT_PUBLIC_ENABLE_WEB3,
      NODE_ENV: process.env.NODE_ENV,
    });
    
    env = envSchema.parse(process.env);
    console.log("✅ Environment validation passed (server)");
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join(".")}: ${err.message}`);
      });
      
      if (process.env.NODE_ENV === "development") {
        console.error("\n💡 Make sure you have created a .env.local file with the required variables.");
        console.error("   Check .env.example for reference.\n");
      }
      
      process.exit(1);
    } else {
      console.error("Environment validation error:", error);
      throw error;
    }
  }
} else {
  // Client-side - use safe fallbacks
  try {
    const clientEnvVars = getClientEnv();
    console.log("🔍 Parsing environment variables (client):", clientEnvVars);
    
    env = envSchema.parse(clientEnvVars);
    console.log("✅ Environment validation passed (client)");
  } catch (error) {
    console.warn("⚠️ Client-side environment validation failed, using fallbacks:", error);
    // Use safe fallbacks on client
    env = getClientEnv() as any;
  }
}

export { env };
export type Env = z.infer<typeof envSchema>; 