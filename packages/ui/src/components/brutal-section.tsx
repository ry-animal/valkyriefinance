import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/utils';

const brutalSectionVariants = cva('relative w-full', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-8',
      lg: 'p-12',
      xl: 'p-16',
      '2xl': 'p-20',
    },
    fullWidth: {
      true: 'w-full',
      false: 'max-w-7xl mx-auto',
    },
    border: {
      none: '',
      top: 'border-t-4 border-black dark:border-white',
      bottom: 'border-b-4 border-black dark:border-white',
      both: 'border-t-4 border-b-4 border-black dark:border-white',
      all: 'border-4 border-black dark:border-white',
    },
    background: {
      none: '',
      white: 'bg-white',
      black: 'bg-black',
      gray: 'bg-gray-100 dark:bg-gray-900',
    },
  },
  defaultVariants: {
    padding: 'lg',
    fullWidth: false,
    border: 'none',
    background: 'none',
  },
});

export interface BrutalSectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof brutalSectionVariants> {
  as?: 'section' | 'div' | 'article' | 'main' | 'aside';
  fullWidth?: boolean;
}

const BrutalSection = React.forwardRef<HTMLDivElement, BrutalSectionProps>(
  (
    { className, padding, fullWidth, border, background, as: Component = 'section', ...props },
    ref
  ) => {
    return (
      <Component
        ref={ref as any}
        className={cn(brutalSectionVariants({ padding, fullWidth, border, background }), className)}
        {...props}
      />
    );
  }
);

BrutalSection.displayName = 'BrutalSection';

export { BrutalSection, brutalSectionVariants };
