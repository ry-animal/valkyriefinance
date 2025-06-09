import { useAuthStore } from './auth-store';
import { usePortfolioStore } from './portfolio-store';
import { useUIStore } from './ui-store';
import { useWeb3Store } from './web3-store';

export { useAuthStore, usePortfolioStore, useUIStore, useWeb3Store };

// Re-export types for convenience
export type { NotificationState, ModalType } from './ui-store';
export type { TokenBalance, Transaction } from './web3-store';

// Combined store hooks for when you need multiple stores
export const useStores = () => ({
  auth: useAuthStore(),
  portfolio: usePortfolioStore(),
  ui: useUIStore(),
  web3: useWeb3Store(),
});

// Selectors for common use cases
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

export const useSelectedPortfolio = () => usePortfolioStore((state) => state.getSelectedPortfolio());
export const usePortfolios = () => usePortfolioStore((state) => state.portfolios);

export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useIsDarkMode = () => useUIStore((state) => state.isDarkMode);

export const useWalletAddress = () => useWeb3Store((state) => state.address);
export const useIsWalletConnected = () => useWeb3Store((state) => state.isConnected);
export const usePendingTransactions = () => useWeb3Store((state) => state.pendingTransactions); 