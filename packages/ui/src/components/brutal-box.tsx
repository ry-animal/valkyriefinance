import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/utils';

const brutalBoxVariants = cva('relative p-6 bg-white dark:bg-black transition-all duration-200', {
  variants: {
    border: {
      true: 'border-4 border-black dark:border-white',
      false: '',
    },
    shadow: {
      none: '',
      sm: 'shadow-brutal-sm',
      md: 'shadow-brutal',
      lg: 'shadow-brutal-lg',
      xl: 'shadow-brutal-xl',
    },
    hover: {
      none: '',
      lift: 'hover:-translate-y-2',
      grow: 'hover:scale-105',
      shadow: 'hover:shadow-brutal-lg',
    },
  },
  defaultVariants: {
    border: false,
    shadow: 'none',
    hover: 'none',
  },
});

export interface BrutalBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brutalBoxVariants> {
  border?: boolean;
}

const BrutalBox = React.forwardRef<HTMLDivElement, BrutalBoxProps>(
  ({ className, border, shadow, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(brutalBoxVariants({ border, shadow, hover }), className)}
        {...props}
      />
    );
  }
);

BrutalBox.displayName = 'BrutalBox';

export { BrutalBox, brutalBoxVariants };
