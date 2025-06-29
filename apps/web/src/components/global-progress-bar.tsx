'use client';

import { useIsFetching } from '@tanstack/react-query';

export function GlobalProgressBar() {
  const isFetching = useIsFetching();

  return (
    <div
      className={`pointer-events-none fixed top-0 left-0 z-[9999] h-[3px] w-full transform-gpu transition-opacity duration-300 ${
        isFetching > 0 ? 'opacity-100' : 'opacity-0'
      }`}
      role="progressbar"
      aria-hidden={isFetching === 0}
      aria-valuetext={isFetching > 0 ? 'Loading' : 'Idle'}
    >
      <div className="h-full w-full bg-blue-500 progress-bar-animation" />
    </div>
  );
}
