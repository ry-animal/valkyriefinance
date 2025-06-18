import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface WalletUser {
  id: string;
  walletAddress: string;
  ensName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthState {
  user: WalletUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  walletAddress: string | null;
}

interface AuthActions {
  setUser: (user: WalletUser | null) => void;
  setLoading: (loading: boolean) => void;
  connectWallet: (user: WalletUser) => void;
  disconnectWallet: () => void;
  setWalletAddress: (address: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, _get) => ({
      // State
      user: null,
      isLoading: false,
      isAuthenticated: false,
      walletAddress: null,

      // Actions
      setUser: (user) =>
        set(
          {
            user,
            isAuthenticated: !!user,
            walletAddress: user?.walletAddress || null,
          },
          false,
          'auth/setUser'
        ),

      setLoading: (loading) => set({ isLoading: loading }, false, 'auth/setLoading'),

      connectWallet: (user) =>
        set(
          {
            user,
            walletAddress: user.walletAddress,
            isAuthenticated: true,
            isLoading: false,
          },
          false,
          'auth/connectWallet'
        ),

      disconnectWallet: () =>
        set(
          {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            walletAddress: null,
          },
          false,
          'auth/disconnectWallet'
        ),

      setWalletAddress: (address) =>
        set({ walletAddress: address }, false, 'auth/setWalletAddress'),
    }),
    { name: 'auth-store' }
  )
);
