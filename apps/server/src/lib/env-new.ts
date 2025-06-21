/**
 * NEW: Centralized environment configuration using @valkyrie/config
 * This replaces the old apps/server/src/lib/env.ts with a much simpler approach
 */

import { serverEnv } from '@valkyrie/config/env';

// That's it! All validation, types, and fallbacks are handled centrally
export { serverEnv as env };

// You still get full TypeScript support and validation
export type Env = typeof serverEnv;

// Usage examples:
// import { env } from './env-new';
//
// console.log(env.DATABASE_URL);                   // ✅ Type-safe
// console.log(env.KV_REST_API_TOKEN);             // ✅ Type-safe
// console.log(env.NEXT_PUBLIC_SERVER_URL);        // ✅ Also includes client vars
// console.log(env.CORS_ORIGIN);                   // ✅ Type-safe
//
// // All environment variables are validated with Zod schemas
// // Server crashes safely in production if required vars are missing
// // Development uses sensible fallbacks
// // All are properly typed for IntelliSense
//
// // Example: Using with your Redis configuration
// import { kv } from '@vercel/kv';
//
// const redisUrl = env.KV_URL;
// const redisToken = env.KV_REST_API_TOKEN;
