'use client';

import { createContext, type ReactNode, useContext, useRef } from 'react';
import { type StoreApi, useStore } from 'zustand';
import {
  createPortfolioStore,
  type Portfolio,
  type PortfolioStore,
} from './portfolio-store-factory';
import { createUIStore, type UIStore } from './ui-store-factory';

// Store contexts
export const UIStoreContext = createContext<StoreApi<UIStore> | null>(null);
export const PortfolioStoreContext = createContext<StoreApi<PortfolioStore> | null>(null);

interface StoreProviderProps {
  children: ReactNode;
  initialData?: {
    portfolio?: any;
    ui?: any;
  };
}

export function RSCStoreProvider({ children, initialData }: StoreProviderProps) {
  // Create store instances once per component lifetime
  const uiStoreRef = useRef<StoreApi<UIStore> | undefined>(undefined);
  const portfolioStoreRef = useRef<StoreApi<PortfolioStore> | undefined>(undefined);

  if (!uiStoreRef.current) {
    uiStoreRef.current = createUIStore(initialData?.ui || {});
  }

  if (!portfolioStoreRef.current) {
    portfolioStoreRef.current = createPortfolioStore(initialData?.portfolio || {});
  }

  return (
    <UIStoreContext.Provider value={uiStoreRef.current || null}>
      <PortfolioStoreContext.Provider value={portfolioStoreRef.current || null}>
        {children}
      </PortfolioStoreContext.Provider>
    </UIStoreContext.Provider>
  );
}

// Custom hooks for consuming stores
export const useUIStore = <T,>(selector: (store: UIStore) => T): T => {
  const storeContext = useContext(UIStoreContext);

  if (!storeContext) {
    throw new Error(`useUIStore must be used within a RSCStoreProvider`);
  }

  return useStore(storeContext, selector);
};

export const usePortfolioStore = <T,>(selector: (store: PortfolioStore) => T): T => {
  const storeContext = useContext(PortfolioStoreContext);

  if (!storeContext) {
    throw new Error(`usePortfolioStore must be used within a RSCStoreProvider`);
  }

  return useStore(storeContext, selector);
};

// Convenience selectors
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useIsDarkMode = () => useUIStore((state) => state.isDarkMode);
export const useSidebarState = () =>
  useUIStore((state) => ({
    open: state.sidebarOpen,
    collapsed: state.sidebarCollapsed,
  }));

export const usePortfolios = () => usePortfolioStore((state) => state.portfolios);
export const useSelectedPortfolio = () =>
  usePortfolioStore((state) =>
    state.portfolios.find((p: Portfolio) => p.id === state.selectedPortfolioId)
  );
