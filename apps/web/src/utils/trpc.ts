import { QueryCache, QueryClient, MutationCache } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink, TRPCClientError } from '@trpc/client';
import { toast } from 'sonner';
import { env } from '@/lib/env';

// Type-only import to avoid build issues
type AppRouter = any;

const getErrorMessage = (error: Error): string => {
  if (error instanceof TRPCClientError) {
    // Handle tRPC specific errors
    switch (error.data?.code) {
      case 'UNAUTHORIZED':
        return 'Please log in to continue';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action';
      case 'NOT_FOUND':
        return 'The requested resource was not found';
      case 'CONFLICT':
        return 'This resource already exists';
      case 'TOO_MANY_REQUESTS':
        return 'Too many requests. Please slow down';
      case 'PAYLOAD_TOO_LARGE':
        return 'The data you are trying to send is too large';
      case 'BAD_REQUEST':
        return error.message || 'Invalid request data';
      case 'INTERNAL_SERVER_ERROR':
        return 'Something went wrong on our end. Please try again';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
  
  // Network errors
  if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
    return 'Network error. Please check your connection and try again';
  }
  
  return error.message || 'An unexpected error occurred';
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof TRPCClientError) {
          const status = error.data?.httpStatus;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error('Query error:', error, { queryKey: query.queryKey });
      
      const message = getErrorMessage(error as Error);
      toast.error(message, {
        action: {
          label: "Retry",
          onClick: () => queryClient.invalidateQueries({ queryKey: query.queryKey }),
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      console.error('Mutation error:', error, { variables });
      
      const message = getErrorMessage(error as Error);
      toast.error(message);
    },
    onSuccess: (data, variables, context, mutation) => {
      // Show success message for mutations if needed
      const mutationKey = mutation.options.mutationKey?.[0];
      if (mutationKey && typeof mutationKey === 'string') {
        if (mutationKey.includes('create')) {
          toast.success('Created successfully');
        } else if (mutationKey.includes('update')) {
          toast.success('Updated successfully');
        } else if (mutationKey.includes('delete')) {
          toast.success('Deleted successfully');
        }
      }
    },
  }),
});

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

