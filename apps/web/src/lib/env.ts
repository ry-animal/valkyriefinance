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
const isTest = process.env.NODE_ENV === "test";

let env: z.infer<typeof envSchema>;

// Get default values for testing/fallback
const getDefaultEnv = () => ({
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
  // Server-side validation
  try {
    const envVars = getDefaultEnv();
    
    // In test environment, be more lenient
    if (isTest) {
      console.log("🧪 Test environment detected, using fallback values");
      env = envVars as any;
    } else {
      // Production/development - strict validation
      if (!process.env.NEXT_PUBLIC_SERVER_URL) {
        console.warn("⚠️ NEXT_PUBLIC_SERVER_URL not found, using fallback");
      }
      
      console.log("🔍 Parsing environment variables (server):", {
        NEXT_PUBLIC_SERVER_URL: envVars.NEXT_PUBLIC_SERVER_URL,
        NEXT_PUBLIC_DEFAULT_CHAIN: envVars.NEXT_PUBLIC_DEFAULT_CHAIN,
        NEXT_PUBLIC_ENABLE_TESTNETS: envVars.NEXT_PUBLIC_ENABLE_TESTNETS,
        NEXT_PUBLIC_ENABLE_AI_CHAT: envVars.NEXT_PUBLIC_ENABLE_AI_CHAT,
        NEXT_PUBLIC_ENABLE_WEB3: envVars.NEXT_PUBLIC_ENABLE_WEB3,
        NODE_ENV: envVars.NODE_ENV,
      });
      
      env = envSchema.parse(envVars);
      console.log("✅ Environment validation passed (server)");
    }
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
      
      // In non-production, use fallbacks instead of crashing
      if (process.env.NODE_ENV !== "production") {
        console.warn("🔄 Using fallback environment values...");
        env = getDefaultEnv() as any;
      } else {
        process.exit(1);
      }
    } else {
      console.error("Environment validation error:", error);
      // Use fallbacks in non-production
      if (process.env.NODE_ENV !== "production") {
        env = getDefaultEnv() as any;
      } else {
        throw error;
      }
    }
  }
} else {
  // Client-side - use safe fallbacks
  try {
    const clientEnvVars = getDefaultEnv();
    console.log("🔍 Parsing environment variables (client):", clientEnvVars);
    
    env = envSchema.parse(clientEnvVars);
    console.log("✅ Environment validation passed (client)");
  } catch (error) {
    console.warn("⚠️ Client-side environment validation failed, using fallbacks:", error);
    // Use safe fallbacks on client
    env = getDefaultEnv() as any;
  }
}

export { env };
export type Env = z.infer<typeof envSchema>; 