/**
 * Simple environment configuration for web app
 */

function getEnv<T>(key: string, defaultValue?: T): T {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${key} is required`);
  }
  return value as T;
}

export const env = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  NEXT_PUBLIC_SERVER_URL: getEnv('NEXT_PUBLIC_SERVER_URL', 'http://localhost:3000'),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_REOWN_PROJECT_ID: getEnv(
    'NEXT_PUBLIC_REOWN_PROJECT_ID',
    '1a91f40c774bfe7c56b13d36dc0fe7a6'
  ),
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_DEFAULT_CHAIN: Number(getEnv('NEXT_PUBLIC_DEFAULT_CHAIN', '1')),
  NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};

export type ClientEnv = typeof env;
