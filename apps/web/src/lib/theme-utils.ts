import { cn } from './utils';

/**
 * Brutalist theme utilities for consistent dark mode styling
 */
export const brutalTheme = {
  // Background utilities
  bg: {
    primary: 'bg-white dark:bg-black',
    secondary: 'bg-gray-50 dark:bg-gray-900',
    inverse: 'bg-black dark:bg-white',
    card: 'bg-white dark:bg-gray-800',
  },

  // Text utilities
  text: {
    primary: 'text-black dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-400',
    inverse: 'text-white dark:text-black',
    muted: 'text-gray-500 dark:text-gray-500',
  },

  // Border utilities
  border: {
    primary: 'border-black dark:border-white',
    secondary: 'border-gray-200 dark:border-gray-700',
    inverse: 'border-white dark:border-black',
  },

  // Button utilities
  button: {
    primary: cn(
      'bg-black dark:bg-white text-white dark:text-black',
      'hover:bg-gray-800 dark:hover:bg-gray-200'
    ),
    secondary: cn(
      'bg-white dark:bg-black text-black dark:text-white',
      'border-black dark:border-white',
      'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
    ),
    outline: cn(
      'border-black dark:border-white text-black dark:text-white',
      'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
    ),
  },
};

/**
 * Helper function to apply brutalist theme classes
 */
export function brutalClass(
  type: keyof typeof brutalTheme,
  variant: string,
  additionalClasses?: string
) {
  const themeGroup = brutalTheme[type] as Record<string, string>;
  const baseClasses = themeGroup[variant] || '';
  return cn(baseClasses, additionalClasses);
}

/**
 * Quick utilities for common patterns
 */
export const bt = {
  // Page background
  page: brutalTheme.bg.primary,

  // Section backgrounds
  section: brutalTheme.bg.primary,
  sectionAlt: brutalTheme.bg.secondary,
  sectionInverse: brutalTheme.bg.inverse,

  // Text styles
  heading: brutalTheme.text.primary,
  body: brutalTheme.text.primary,
  muted: brutalTheme.text.secondary,
  inverse: brutalTheme.text.inverse,

  // Border styles
  border: brutalTheme.border.primary,
  borderInverse: brutalTheme.border.inverse,
};
