import type { NextRequest } from 'next/server';
import './env'; // Validate environment variables on startup

export async function createContext(req: NextRequest) {
  // Extract session information from headers
  const sessionId = req.headers.get('x-session-id');
  const walletAddress = req.headers.get('x-wallet-address');

  return {
    req,
    sessionId,
    walletAddress,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
