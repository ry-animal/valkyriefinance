/**
 * NEW: Centralized environment configuration using @valkyrie/config
 * This replaces the old apps/web/src/lib/env.ts with a much simpler approach
 */

import { clientEnv } from '@valkyrie/config/env';

// That's it! All validation, types, and fallbacks are handled centrally
export { clientEnv as env };

// You still get full TypeScript support and validation
export type Env = typeof clientEnv;

// Usage examples:
// import { env } from './env-new';
//
// console.log(env.NEXT_PUBLIC_SERVER_URL);        // ✅ Type-safe
// console.log(env.NEXT_PUBLIC_DEFAULT_CHAIN);     // ✅ Type-safe
// console.log(env.NEXT_PUBLIC_ENABLE_TESTNETS);   // ✅ Type-safe
//
// // This would cause a TypeScript error:
// // console.log(env.DATABASE_URL);                // ❌ Not available on client
//
// // All environment variables are validated with Zod schemas
// // All have proper fallback values for development
// // All are properly typed for IntelliSense
