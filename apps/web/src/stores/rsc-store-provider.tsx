'use client';

import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
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
    portfolio?: unknown;
    ui?: unknown;
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

  // Handle hydration on client-side
  useEffect(() => {
    if (uiStoreRef.current && typeof window !== 'undefined') {
      const store = uiStoreRef.current;
      const { hydrate } = store.getState();
      hydrate();
    }
  }, []);

  return (
    <UIStoreContext.Provider value={uiStoreRef.current || null}>
      <PortfolioStoreContext.Provider value={portfolioStoreRef.current || null}>
        {children}
      </PortfolioStoreContext.Provider>
    </UIStoreContext.Provider>
  );
}

// Enhanced hook with error handling
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

// Memoized convenience selectors for performance
export const useActiveModal = () =>
  useUIStore(useMemo(() => (state: UIStore) => state.activeModal, []));

export const useNotifications = () =>
  useUIStore(useMemo(() => (state: UIStore) => state.notifications, []));

export const useIsDarkMode = () =>
  useUIStore(useMemo(() => (state: UIStore) => state.isDarkMode, []));

export const useIsHydrated = () =>
  useUIStore(useMemo(() => (state: UIStore) => state.isHydrated, []));

export const useSidebarState = () =>
  useUIStore(
    useMemo(
      () => (state: UIStore) => ({
        open: state.sidebarOpen,
        collapsed: state.sidebarCollapsed,
      }),
      []
    )
  );

export const useLoadingState = () =>
  useUIStore(
    useMemo(
      () => (state: UIStore) => ({
        global: state.globalLoading,
        page: state.pageLoading,
      }),
      []
    )
  );

export const useFeatureFlags = () =>
  useUIStore(
    useMemo(
      () => (state: UIStore) => ({
        advanced: state.showAdvancedFeatures,
        animations: state.enableAnimations,
      }),
      []
    )
  );

export const usePortfolios = () =>
  usePortfolioStore(useMemo(() => (state: PortfolioStore) => state.portfolios, []));

export const useSelectedPortfolio = () =>
  usePortfolioStore(
    useMemo(
      () => (state: PortfolioStore) =>
        state.portfolios.find((p: Portfolio) => p.id === state.selectedPortfolioId),
      []
    )
  );

// SSR-safe hydration status
export const useSSRSafeValue = <T,>(value: T, defaultValue: T): T => {
  const isHydrated = useIsHydrated();
  return isHydrated ? value : defaultValue;
};
