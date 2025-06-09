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

let env: z.infer<typeof envSchema>;

try {
  // Only validate if we have the basic required environment variables
  if (!process.env.NEXT_PUBLIC_SERVER_URL && typeof window === "undefined") {
    throw new Error("NEXT_PUBLIC_SERVER_URL is required");
  }
  
  console.log("🔍 Parsing environment variables:", {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_DEFAULT_CHAIN: process.env.NEXT_PUBLIC_DEFAULT_CHAIN,
    NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS,
    NEXT_PUBLIC_ENABLE_AI_CHAT: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT,
    NEXT_PUBLIC_ENABLE_WEB3: process.env.NEXT_PUBLIC_ENABLE_WEB3,
    NODE_ENV: process.env.NODE_ENV,
    isClient: typeof window !== "undefined",
  });
  
  env = envSchema.parse(process.env);
  console.log("✅ Environment validation passed");
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    error.errors.forEach((err) => {
      console.error(`  ${err.path.join(".")}: ${err.message}`);
    });
    
    // In development, show helpful error message
    if (process.env.NODE_ENV === "development") {
      console.error("\n💡 Make sure you have created a .env.local file with the required variables.");
      console.error("   Check .env.example for reference.\n");
    }
    
    // Only exit on server-side
    if (typeof window === "undefined") {
      process.exit(1);
    }
  } else {
    console.error("Environment validation error:", error);
    // Only exit on server-side
    if (typeof window === "undefined") {
      throw error;
    }
  }
}

export { env };
export type Env = z.infer<typeof envSchema>; 