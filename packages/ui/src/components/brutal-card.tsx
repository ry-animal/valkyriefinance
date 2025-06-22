'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

const brutalCardVariants = cva('border-2 border-black transition-all duration-normal', {
  variants: {
    variant: {
      default: 'bg-white shadow-brutal',
      elevated: 'bg-white shadow-brutal-lg',
      glass: 'glass backdrop-blur-md',
      gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 shadow-brutal',
      neon: 'bg-black border-cyan-400 shadow-glow-cyan',
      defi: 'bg-gradient-to-br from-emerald-50 to-teal-50 shadow-brutal',
      outline: 'bg-transparent border-2 border-black',
      flat: 'bg-white border-0 shadow-lg',
    },
    size: {
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
    },
    hover: {
      none: '',
      lift: 'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg',
      glow: 'hover:shadow-glow-lg',
      scale: 'hover:scale-105',
      float: 'hover:animate-float',
      bounce: 'hover:animate-bounce',
      rubber: 'hover:animate-rubber',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      default: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    hover: 'lift',
    rounded: 'default',
  },
});

export interface BrutalCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brutalCardVariants> {}

const BrutalCard = forwardRef<HTMLDivElement, BrutalCardProps>(
  ({ className, variant, size, hover, rounded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(brutalCardVariants({ variant, size, hover, rounded, className }))}
        {...props}
      />
    );
  }
);

BrutalCard.displayName = 'BrutalCard';

const BrutalCardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-6', className)} {...props} />
  )
);

BrutalCardHeader.displayName = 'BrutalCardHeader';

const BrutalCardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-brutal text-2xl font-black uppercase tracking-wider leading-none text-black',
        className
      )}
      {...props}
    />
  )
);

BrutalCardTitle.displayName = 'BrutalCardTitle';

const BrutalCardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground font-medium', className)} {...props} />
));

BrutalCardDescription.displayName = 'BrutalCardDescription';

const BrutalCardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pt-0', className)} {...props} />
);

BrutalCardContent.displayName = 'BrutalCardContent';

const BrutalCardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-6', className)} {...props} />
  )
);

BrutalCardFooter.displayName = 'BrutalCardFooter';

export {
  BrutalCard,
  BrutalCardHeader,
  BrutalCardFooter,
  BrutalCardTitle,
  BrutalCardDescription,
  BrutalCardContent,
  brutalCardVariants,
};
