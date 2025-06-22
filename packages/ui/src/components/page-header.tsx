import React from 'react';
import { cn } from '../lib/utils';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-2 pb-8 border-b-4 border-black dark:border-white',
          className
        )}
        {...props}
      >
        <h1 className="font-brutal font-black text-4xl lg:text-5xl uppercase tracking-tight text-black dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="font-mono text-lg text-black dark:text-white opacity-75">{description}</p>
        )}
        {children}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export { PageHeader };
