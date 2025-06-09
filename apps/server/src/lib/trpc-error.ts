import { TRPCError } from '@trpc/server';
import { logger } from '@valkryie/common/utils';

export type TRPCErrorCode = 
  | 'UNAUTHORIZED' 
  | 'FORBIDDEN' 
  | 'NOT_FOUND' 
  | 'BAD_REQUEST' 
  | 'INTERNAL_SERVER_ERROR'
  | 'CONFLICT'
  | 'TOO_MANY_REQUESTS'
  | 'PAYLOAD_TOO_LARGE';

export const createTRPCError = (
  code: TRPCErrorCode,
  message: string,
  cause?: unknown,
  context?: Record<string, any>
) => {
  logger.error(`tRPC Error [${code}]: ${message}`, cause instanceof Error ? cause : undefined, {
    code,
    context,
  });

  return new TRPCError({
    code,
    message,
    cause,
  });
};

export const handleDatabaseError = (error: unknown, context?: Record<string, any>) => {
  logger.error('Database error occurred', error instanceof Error ? error : undefined, context);
  
  if (error instanceof Error) {
    // PostgreSQL specific error codes
    if ('code' in error) {
      switch (error.code) {
        case '23505': // Unique violation
          return createTRPCError(
            'CONFLICT', 
            'A resource with this information already exists',
            error,
            context
          );
        case '23503': // Foreign key violation
          return createTRPCError(
            'BAD_REQUEST', 
            'Referenced resource does not exist',
            error,
            context
          );
        case '23502': // Not null violation
          return createTRPCError(
            'BAD_REQUEST', 
            'Required information is missing',
            error,
            context
          );
        case '22001': // String too long
          return createTRPCError(
            'BAD_REQUEST', 
            'Input data is too long',
            error,
            context
          );
        default:
          return createTRPCError(
            'INTERNAL_SERVER_ERROR', 
            'Database operation failed',
            error,
            context
          );
      }
    }
  }
  
  return createTRPCError(
    'INTERNAL_SERVER_ERROR', 
    'An unexpected database error occurred',
    error,
    context
  );
};

export const handleAuthError = (message: string = 'Authentication required') => {
  return createTRPCError('UNAUTHORIZED', message);
};

export const handleNotFoundError = (resource: string) => {
  return createTRPCError('NOT_FOUND', `${resource} not found`);
};

export const handleValidationError = (message: string, cause?: unknown) => {
  return createTRPCError('BAD_REQUEST', `Validation error: ${message}`, cause);
};

export const handlePermissionError = (action: string) => {
  return createTRPCError('FORBIDDEN', `You do not have permission to ${action}`);
};

export const handleRateLimitError = () => {
  return createTRPCError('TOO_MANY_REQUESTS', 'Too many requests. Please try again later.');
};

export const handleExternalServiceError = (service: string, cause?: unknown) => {
  return createTRPCError(
    'INTERNAL_SERVER_ERROR',
    `External service (${service}) is currently unavailable`,
    cause
  );
}; 