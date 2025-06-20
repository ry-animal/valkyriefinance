import { type ClassValue, clsx } from 'clsx';
import type React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to generate component variants using class-variance-authority
 */
export { cva, type VariantProps } from 'class-variance-authority';

/**
 * Type helper for extracting component props
 */
export type ComponentProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;

/**
 * Type helper for component props with ref
 */
export type ComponentPropsWithRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>;
