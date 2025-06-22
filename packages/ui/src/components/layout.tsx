import * as React from 'react';
import { cn } from '../lib/utils';

interface BrutalGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const BrutalGrid = React.forwardRef<HTMLDivElement, BrutalGridProps>(
  ({ className, cols = 12, children, ...props }, ref) => {
    const gridClass = {
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
    }[cols];

    return (
      <div ref={ref} className={cn('grid', gridClass, className)} {...props}>
        {children}
      </div>
    );
  }
);
BrutalGrid.displayName = 'BrutalGrid';

interface BrutalSectionProps extends React.HTMLAttributes<HTMLElement> {
  fullWidth?: boolean;
}

const BrutalSection = React.forwardRef<HTMLElement, BrutalSectionProps>(
  ({ className, fullWidth = false, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-8 px-4', fullWidth ? 'w-full' : 'max-w-7xl mx-auto', className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);
BrutalSection.displayName = 'BrutalSection';

interface BrutalHeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'huge' | 'massive' | 'mega' | 'giant';
}

const BrutalHeadline = React.forwardRef<HTMLHeadingElement, BrutalHeadlineProps>(
  ({ className, size = 'lg', children, ...props }, ref) => {
    const sizeClass = {
      sm: 'text-lg font-black',
      md: 'text-xl font-black',
      lg: 'text-2xl font-black',
      xl: 'text-3xl font-black',
      huge: 'text-4xl font-black',
      massive: 'text-5xl font-black',
      mega: 'text-6xl font-black',
      giant: 'text-7xl font-black',
    }[size];

    return (
      <h1
        ref={ref}
        className={cn(sizeClass, 'uppercase tracking-tight leading-none', className)}
        {...props}
      >
        {children}
      </h1>
    );
  }
);
BrutalHeadline.displayName = 'BrutalHeadline';

interface BrutalBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shadow' | 'hover' | 'inverted';
  border?: boolean;
}

const BrutalBox = React.forwardRef<HTMLDivElement, BrutalBoxProps>(
  ({ className, variant = 'default', border = true, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white text-black',
      shadow: 'bg-white text-black shadow-brutal',
      hover:
        'bg-white text-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all duration-100',
      inverted: 'bg-black text-white',
    };

    return (
      <div
        ref={ref}
        className={cn('p-6', border && 'border-4 border-black', variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BrutalBox.displayName = 'BrutalBox';

interface BrutalTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'mono' | 'brutal';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const BrutalText = React.forwardRef<HTMLParagraphElement, BrutalTextProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variantClass = {
      default: '',
      mono: 'font-mono',
      brutal: 'font-black uppercase tracking-wide',
    }[variant];

    const sizeClass = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    }[size];

    return (
      <p ref={ref} className={cn(variantClass, sizeClass, className)} {...props}>
        {children}
      </p>
    );
  }
);
BrutalText.displayName = 'BrutalText';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-8', className)} {...props}>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-lg text-muted-foreground">{description}</p>}
      </div>
    );
  }
);
PageHeader.displayName = 'PageHeader';

export { BrutalGrid, BrutalSection, BrutalHeadline, BrutalBox, BrutalText, PageHeader };
