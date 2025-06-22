import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

const brutalCardVariants = cva('bg-white border-4 border-black shadow-brutal', {
  variants: {
    padding: {
      none: '',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
    },
    hover: {
      none: '',
      lift: 'hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all duration-100',
      press:
        'hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all duration-100',
    },
  },
  defaultVariants: {
    padding: 'default',
    hover: 'none',
  },
});

export interface BrutalCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brutalCardVariants> {}

const BrutalCard = forwardRef<HTMLDivElement, BrutalCardProps>(
  ({ className, padding, hover, ...props }, ref) => {
    return (
      <div className={cn(brutalCardVariants({ padding, hover, className }))} ref={ref} {...props} />
    );
  }
);

BrutalCard.displayName = 'BrutalCard';

export { BrutalCard, brutalCardVariants };
