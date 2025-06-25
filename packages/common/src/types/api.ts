// API types will be defined here when needed
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Re-export the AppRouter type from the generated file
// This enables proper type sharing between server and client
export type { AppRouter } from './router.generated';
