import { TRPCError } from '@trpc/server';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { logger } from '@valkyrie/common';
import type { APIErrorContext, TRPCErrorContext } from '../types/api';

export type TRPCErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'INTERNAL_SERVER_ERROR'
  | 'CONFLICT'
  | 'TOO_MANY_REQUESTS'
  | 'PAYLOAD_TOO_LARGE';

/**
 * Create a TRPC error with proper logging and context
 */
export const createTRPCError = (
  code: TRPC_ERROR_CODE_KEY,
  message: string,
  cause?: unknown,
  context?: TRPCErrorContext
) => {
  const logContext = {
    code,
    message,
    context,
    cause: cause instanceof Error ? cause.message : String(cause),
  };

  logger.error(
    `tRPC Error [${code}]: ${message}`,
    cause instanceof Error ? cause : undefined,
    logContext
  );

  return new TRPCError({
    code,
    message,
    cause: cause instanceof Error ? cause : undefined,
  });
};

/**
 * Handle database errors with context logging
 */
export const handleDatabaseError = (error: unknown, context?: APIErrorContext) => {
  const logContext = { ...context };
  logger.error('Database error occurred', error instanceof Error ? error : undefined, logContext);

  if (error instanceof Error) {
    if (error.message.includes('UNIQUE constraint')) {
      const errorContext: TRPCErrorContext = { ...context, errorType: 'unique_constraint' };
      throw createTRPCError('CONFLICT', 'Resource already exists', error, errorContext);
    }
    if (error.message.includes('NOT NULL constraint')) {
      const errorContext: TRPCErrorContext = { ...context, errorType: 'not_null_constraint' };
      throw createTRPCError('BAD_REQUEST', 'Missing required field', error, errorContext);
    }
    if (error.message.includes('FOREIGN KEY constraint')) {
      const errorContext: TRPCErrorContext = { ...context, errorType: 'foreign_key_constraint' };
      throw createTRPCError('BAD_REQUEST', 'Invalid reference', error, errorContext);
    }
  }

  throw createTRPCError('INTERNAL_SERVER_ERROR', 'Database operation failed', error, context);
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
