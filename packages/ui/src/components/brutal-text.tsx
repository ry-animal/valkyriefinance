import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/utils';

const brutalTextVariants = cva('text-black dark:text-white', {
  variants: {
    variant: {
      default: 'font-sans',
      mono: 'font-mono',
      brutal: 'font-brutal uppercase font-black tracking-wide',
      serif: 'font-serif',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black',
    },
    spacing: {
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
      widest: 'tracking-widest',
    },
    leading: {
      tight: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    weight: 'normal',
    spacing: 'normal',
    leading: 'normal',
  },
});

export interface BrutalTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof brutalTextVariants> {
  as?: 'p' | 'span' | 'div' | 'strong' | 'em' | 'small';
}

const BrutalText = React.forwardRef<HTMLParagraphElement, BrutalTextProps>(
  ({ className, variant, size, weight, spacing, leading, as: Component = 'p', ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(brutalTextVariants({ variant, size, weight, spacing, leading }), className)}
        {...props}
      />
    );
  }
);

BrutalText.displayName = 'BrutalText';

export { BrutalText, brutalTextVariants };
