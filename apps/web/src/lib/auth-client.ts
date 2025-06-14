import { useAuthStore, type WalletUser } from '@/stores/auth-store';

// Session data structure to match the expected interface
export interface SessionData {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    walletAddress: string;
  } | null;
}

// Hook to get session data compatible with the user menu
export function useSession() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  const sessionData: SessionData = {
    user: user ? {
      id: user.id,
      name: user.ensName || `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`,
      email: undefined, // Wallet auth doesn't have email
      image: undefined, // Could add avatar generation based on wallet address
      walletAddress: user.walletAddress,
    } : null
  };

  return {
    data: sessionData,
    status: isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated',
  };
}

// Sign out function
export function signOut() {
  const { disconnectWallet } = useAuthStore.getState();
  disconnectWallet();
  
  // Optionally redirect to home page
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

// Sign in function (for future use)
export function signIn(user: WalletUser) {
  const { connectWallet } = useAuthStore.getState();
  connectWallet(user);
} 