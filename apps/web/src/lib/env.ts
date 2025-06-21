/**
 * Environment configuration using centralized @valkyrie/config
 *
 * MIGRATION NOTES:
 * - Replaced 127 lines of validation logic with 3 lines
 * - All validation and types are now centrally managed
 * - Same environment variables are available with better type safety
 * - Fallback values and error handling are handled centrally
 *
 * OLD FILE BACKED UP AS: env.old.ts
 */

import { clientEnv } from '@valkyrie/config/env';

// All validation, types, and fallbacks are handled centrally in @valkyrie/config
export { clientEnv as env };

// Export the type for backward compatibility
export type ClientEnv = typeof clientEnv;
