import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/utils';

const brutalHeadlineVariants = cva(
  'font-brutal font-black uppercase tracking-tight leading-none text-black dark:text-white',
  {
    variants: {
      size: {
        xs: 'text-xl',
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl',
        xl: 'text-5xl',
        '2xl': 'text-6xl',
        huge: 'text-huge',
        massive: 'text-massive',
        giant: 'text-giant',
        mega: 'text-mega',
      },
      variant: {
        default: 'text-black dark:text-white',
        gradient: 'gradient-text',
        outlined: 'text-transparent stroke-2 stroke-black dark:stroke-white',
      },
      spacing: {
        tight: 'tracking-tighter',
        normal: 'tracking-tight',
        wide: 'tracking-wide',
        wider: 'tracking-wider',
      },
    },
    defaultVariants: {
      size: 'lg',
      variant: 'default',
      spacing: 'normal',
    },
  }
);

export interface BrutalHeadlineProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof brutalHeadlineVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const BrutalHeadline = React.forwardRef<HTMLHeadingElement, BrutalHeadlineProps>(
  ({ className, size, variant, spacing, as: Component = 'h1', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(brutalHeadlineVariants({ size, variant, spacing }), className)}
        {...props}
      />
    );
  }
);

BrutalHeadline.displayName = 'BrutalHeadline';

export { BrutalHeadline, brutalHeadlineVariants };
