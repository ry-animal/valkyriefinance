import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/utils';

const brutalGridVariants = cva('grid gap-4 w-full', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
      16: 'grid-cols-16',
      20: 'grid-cols-20',
      24: 'grid-cols-24',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    },
    responsive: {
      true: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      false: '',
    },
  },
  defaultVariants: {
    cols: 12,
    gap: 'md',
    responsive: false,
  },
});

export interface BrutalGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brutalGridVariants> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 16 | 20 | 24;
}

const BrutalGrid = React.forwardRef<HTMLDivElement, BrutalGridProps>(
  ({ className, cols, gap, responsive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(brutalGridVariants({ cols, gap, responsive }), className)}
        {...props}
      />
    );
  }
);

BrutalGrid.displayName = 'BrutalGrid';

export { BrutalGrid, brutalGridVariants };
