#!/usr/bin/env node

/**
 * Production Deployment Test Script
 *
 * This script validates the Vercel configuration and environment setup
 * for production deployment of the Valkyrie Finance platform.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}=== Valkyrie Finance Production Deployment Test ===${colors.reset}\n`);

// Check Vercel CLI installation
try {
  console.log(`${colors.blue}Checking Vercel CLI...${colors.reset}`);
  execSync('vercel --version', { stdio: 'pipe' });
  console.log(`${colors.green}✓ Vercel CLI is installed${colors.reset}`);
} catch (err) {
  console.error(
    `${colors.red}✗ Vercel CLI is not installed. Please install it with: npm i -g vercel${colors.reset}`
  );
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
}

// Validate Vercel configuration files
const vercelConfigs = ['vercel.json', 'apps/web/vercel.json', 'apps/server/vercel.json'];

console.log(`${colors.blue}Validating Vercel configuration files...${colors.reset}`);
vercelConfigs.forEach((configPath) => {
  try {
    const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), configPath), 'utf8'));
    console.log(`${colors.green}✓ ${configPath} is valid JSON${colors.reset}`);

    // Check for security headers
    if (configPath === 'vercel.json' && !config.headers) {
      console.warn(`${colors.yellow}⚠ Root vercel.json is missing security headers${colors.reset}`);
    }

    // Check for proper Node.js runtime
    if (config.functions) {
      const runtimes = new Set();
      Object.values(config.functions).forEach((fn) => {
        if (fn.runtime) runtimes.add(fn.runtime);
      });

      if (runtimes.has('nodejs18.x')) {
        console.log(`${colors.green}✓ Using Node.js 18 runtime${colors.reset}`);
      } else {
        console.warn(
          `${colors.yellow}⚠ Consider using Node.js 18+ runtime for better security${colors.reset}`
        );
      }
    }
  } catch (error) {
    console.error(
      `${colors.red}✗ Failed to validate ${configPath}: ${error.message}${colors.reset}`
    );
  }
});

// Check for required environment variables
console.log(`\n${colors.blue}Checking required environment variables...${colors.reset}`);
const requiredEnvVars = [
  'NEXT_PUBLIC_SERVER_URL',
  'DATABASE_URL',
  'NEXT_PUBLIC_REOWN_PROJECT_ID',
  'NEXT_PUBLIC_DEFAULT_CHAIN',
  'NEXT_PUBLIC_ENABLE_TESTNETS',
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.warn(
    `${colors.yellow}⚠ Missing environment variables: ${missingEnvVars.join(', ')}${colors.reset}`
  );
  console.log(
    `${colors.blue}These will need to be configured in Vercel's environment settings.${colors.reset}`
  );
} else {
  console.log(`${colors.green}✓ All required environment variables are set${colors.reset}`);
}

// Suggest security headers
console.log(`\n${colors.blue}Recommended security headers for production:${colors.reset}`);
console.log(`
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; connect-src 'self' https://*.vercel-insights.com https://*.algolia.net https://*.algolianet.com https://vitals.vercel-insights.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self'"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
`);

console.log(`\n${colors.cyan}=== Production Deployment Test Complete ===${colors.reset}`);
console.log(`${colors.blue}Next steps:${colors.reset}`);
console.log(`1. Add security headers to vercel.json`);
console.log(`2. Configure environment variables in Vercel dashboard`);
console.log(`3. Run 'vercel --prod' to deploy to production`);
