import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type React from 'react';
import { ThemeProvider } from '@/components/theme-provider';

// Create a custom render function with providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockTodo = {
  id: 'test-todo-id',
  title: 'Test Todo',
  content: 'Test content',
  completed: false,
  userId: mockUser.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockPortfolio = {
  id: 'test-portfolio-id',
  userId: mockUser.id,
  name: 'Test Portfolio',
  description: 'Test portfolio description',
  totalValue: '1000.00',
  currency: 'USD',
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
