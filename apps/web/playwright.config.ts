import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3001',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'cd ../server && NODE_ENV=test DATABASE_URL="postgresql://test:test@localhost:5432/test_db" BETTER_AUTH_SECRET="test-secret-key-for-testing-minimum-32-chars" BETTER_AUTH_URL="http://localhost:3000" CORS_ORIGIN="http://localhost:3001" bun run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'NODE_ENV=test NEXT_PUBLIC_SERVER_URL="http://localhost:3000" NEXT_PUBLIC_DEFAULT_CHAIN="1" NEXT_PUBLIC_ENABLE_TESTNETS="true" NEXT_PUBLIC_ENABLE_AI_CHAT="true" NEXT_PUBLIC_ENABLE_WEB3="false" bun run dev',
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
  ],
}); 