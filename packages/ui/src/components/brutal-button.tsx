'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

const brutalButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-x-1 active:translate-y-1',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-brutal hover:shadow-brutal-sm active:shadow-none border-2 border-black',
        destructive:
          'bg-destructive text-destructive-foreground shadow-brutal hover:shadow-brutal-sm active:shadow-none border-2 border-black',
        outline:
          'border-2 border-black bg-background shadow-brutal hover:shadow-brutal-sm active:shadow-none hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-brutal hover:shadow-brutal-sm active:shadow-none border-2 border-black',
        ghost: 'hover:bg-accent hover:text-accent-foreground border-2 border-transparent',
        link: 'text-primary underline-offset-4 hover:underline border-2 border-transparent',
        gradient:
          'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-brutal hover:shadow-brutal-sm active:shadow-none border-2 border-black',
        neon: 'bg-black text-white shadow-glow-cyan hover:shadow-glow-lg active:shadow-glow-sm border-2 border-cyan-400 hover:bg-cyan-950',
        defi: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-brutal hover:shadow-brutal-sm active:shadow-none border-2 border-black',
      },
      size: {
        default: 'h-10 px-6 py-2 text-base',
        xs: 'h-6 px-3 text-xs',
        sm: 'h-8 px-4 text-sm',
        lg: 'h-12 px-8 text-lg',
        xl: 'h-14 px-10 text-xl',
        icon: 'h-10 w-10',
      },
      animation: {
        none: '',
        hover: 'hover:scale-105',
        bounce: 'hover:animate-bounce',
        pulse: 'hover:animate-pulse',
        wiggle: 'hover:animate-wiggle',
        float: 'animate-float',
        glow: 'animate-glow-pulse',
        rubber: 'hover:animate-rubber',
        heartbeat: 'hover:animate-heartbeat',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'hover',
    },
  }
);

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brutalButtonVariants> {
  asChild?: boolean;
}

const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(brutalButtonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
BrutalButton.displayName = 'BrutalButton';

export { BrutalButton, brutalButtonVariants };
