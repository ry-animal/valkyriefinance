'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="h-16 bg-gray-200 rounded animate-pulse mx-auto w-32"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto w-64"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse mx-auto w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-8xl font-black uppercase tracking-tighter">404</h1>
          <h2 className="text-4xl font-black uppercase">PAGE NOT FOUND</h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            THE PAGE YOU'RE LOOKING FOR HAS VANISHED INTO THE VOID.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-black text-white font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-colors"
          >
            RETURN HOME
          </Link>

          <div className="text-sm text-gray-500">
            <p>Lost? Try these instead:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/ai-analytics" className="hover:underline">
                AI Analytics
              </Link>
              <Link href="/vault" className="hover:underline">
                Vault
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
