/**
 * Environment configuration using centralized @valkyrie/config
 *
 * MIGRATION NOTES:
 * - Replaced 69 lines of validation logic with 3 lines
 * - All validation and types are now centrally managed
 * - Same environment variables are available with better type safety
 * - Fallback values and error handling are handled centrally
 * - Includes both server-side and client-side environment variables
 *
 * OLD FILE BACKED UP AS: env.old.ts
 */

import { serverEnv } from '@valkyrie/config/env';

// All validation, types, and fallbacks are handled centrally in @valkyrie/config
export { serverEnv as env };

// Export the type for backward compatibility
export type ServerEnv = typeof serverEnv;
