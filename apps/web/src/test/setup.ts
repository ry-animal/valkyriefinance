import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock matchMedia for theme provider
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
    NEXT_PUBLIC_DEFAULT_CHAIN: '1',
    NEXT_PUBLIC_ENABLE_TESTNETS: 'false',
    NEXT_PUBLIC_ENABLE_AI_CHAT: 'true',
    NEXT_PUBLIC_ENABLE_WEB3: 'false',
  },
}));

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