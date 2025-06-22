import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

const brutalButtonVariants = cva(
  'font-brutal uppercase tracking-widest text-xl font-black transition-all duration-100 border-4 border-black',
  {
    variants: {
      variant: {
        default: 'bg-black text-white hover:bg-white hover:text-black',
        outline: 'bg-white text-black hover:bg-black hover:text-white',
        card: 'bg-white text-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1',
      },
      size: {
        default: 'px-8 py-4',
        sm: 'px-4 py-2 text-lg',
        lg: 'px-12 py-6 text-2xl',
      },
      shadow: {
        none: '',
        default: 'shadow-brutal',
        hover: 'hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shadow: 'hover',
    },
  }
);

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brutalButtonVariants> {}

const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant, size, shadow, ...props }, ref) => {
    return (
      <button
        className={cn(brutalButtonVariants({ variant, size, shadow, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

BrutalButton.displayName = 'BrutalButton';

export { BrutalButton, brutalButtonVariants };
