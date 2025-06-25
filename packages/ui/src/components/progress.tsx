'use client';

import type * as React from 'react';
import { cn } from '../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

function Progress({ className, value = 0, max = 100, ...props }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800',
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export { Progress };
