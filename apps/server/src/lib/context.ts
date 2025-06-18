import type { NextRequest } from 'next/server';
import './env'; // Validate environment variables on startup

export async function createContext(req: NextRequest) {
  return {
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
