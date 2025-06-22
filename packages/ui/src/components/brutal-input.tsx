import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

const brutalInputVariants = cva('bg-white border-4 border-black font-mono focus:outline-none', {
  variants: {
    size: {
      sm: 'px-3 py-2 text-base',
      default: 'px-4 py-3 text-lg',
      lg: 'px-6 py-4 text-xl',
    },
    focus: {
      shadow: 'focus:shadow-brutal-sm',
      lift: 'focus:shadow-brutal focus:-translate-x-1 focus:-translate-y-1 transition-all duration-100',
      none: '',
    },
  },
  defaultVariants: {
    size: 'default',
    focus: 'shadow',
  },
});

export interface BrutalInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof brutalInputVariants> {}

const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ className, size, focus, ...props }, ref) => {
    return (
      <input className={cn(brutalInputVariants({ size, focus, className }))} ref={ref} {...props} />
    );
  }
);

BrutalInput.displayName = 'BrutalInput';

export { BrutalInput, brutalInputVariants };
