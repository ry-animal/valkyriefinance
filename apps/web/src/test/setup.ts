import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Setup and cleanup
beforeAll(() => {
  // Global test setup
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  // Global test cleanup
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock environment variables
vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'test',
    NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: 'test-project-id',
    NEXT_PUBLIC_REOWN_PROJECT_ID: 'test-reown-id',
    NEXT_PUBLIC_ALCHEMY_API_KEY: 'test-alchemy-key',
    NEXT_PUBLIC_DEFAULT_CHAIN: 1,
    NEXT_PUBLIC_ENABLE_TESTNETS: false,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: 'test-ga-id',
  },
}));

// Mock matchMedia for theme provider
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
