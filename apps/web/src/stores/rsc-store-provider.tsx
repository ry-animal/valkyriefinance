'use client';

import { createContext, type ReactNode, useContext, useMemo, useRef } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createPortfolioStore, type PortfolioStore } from './portfolio-store-factory';
import { useUIStore } from './ui-store';
import { createUIStore, type UIStore } from './ui-store-factory';

// Store contexts
const PortfolioStoreContext = createContext<StoreApi<PortfolioStore> | null>(null);
const UIStoreContext = createContext<StoreApi<UIStore> | null>(null);

// Provider component
export function StoreProvider({ children }: { children: ReactNode }) {
  const portfolioStoreRef = useRef<StoreApi<PortfolioStore>>();
  if (!portfolioStoreRef.current) {
    portfolioStoreRef.current = createPortfolioStore();
  }

  const uiStoreRef = useRef<StoreApi<UIStore>>();
  if (!uiStoreRef.current) {
    uiStoreRef.current = createUIStore();
  }

  return (
    <PortfolioStoreContext.Provider value={portfolioStoreRef.current}>
      <UIStoreContext.Provider value={uiStoreRef.current}>{children}</UIStoreContext.Provider>
    </PortfolioStoreContext.Provider>
  );
}

// Hooks for accessing stores
export const usePortfolioStore = <T,>(selector: (store: PortfolioStore) => T): T => {
  const portfolioStoreContext = useContext(PortfolioStoreContext);

  if (!portfolioStoreContext) {
    throw new Error('usePortfolioStore must be used within a StoreProvider');
  }

  return useStore(portfolioStoreContext, selector);
};

export const useUIStoreApi = <T,>(selector: (store: UIStore) => T): T => {
  const uiStoreContext = useContext(UIStoreContext);

  if (!uiStoreContext) {
    throw new Error('useUIStoreApi must be used within a StoreProvider');
  }

  return useStore(uiStoreContext, selector);
};

// Hook for using the sidebar state
export const useSidebar = () =>
  useUIStore(
    useMemo(
      () => (state: UIStore) => ({
        isOpen: state.sidebarOpen,
        isCollapsed: state.sidebarCollapsed,
        toggle: state.toggleSidebar,
        setOpen: state.setSidebarOpen,
        toggleCollapse: state.toggleSidebarCollapse,
        setCollapsed: state.setSidebarCollapsed,
      }),
      []
    ),
    shallow
  );

// Hook for using the modal state
export const useModal = () =>
  useUIStore(
    useMemo(
      () => (state: UIStore) => ({
        activeModal: state.activeModal,
        modalData: state.modalData,
        openModal: state.openModal,
        closeModal: state.closeModal,
      }),
      []
    ),
    shallow
  );

// Hook for using the notification state
export const useNotifications = () =>
  useUIStore(
    useMemo(
      () => (state: UIStore) => ({
        notifications: state.notifications,
        addNotification: state.addNotification,
        dismissNotification: state.dismissNotification,
        clearNotifications: state.clearNotifications,
      }),
      []
    ),
    shallow
  );

// Hook for general UI properties
export const useInterface = () =>
  useUIStore(
    useMemo(
      () => (state: UIStore) => ({
        isDarkMode: state.isDarkMode,
        isOnline: state.isOnline,
        toggleTheme: state.toggleTheme,
        setOnlineStatus: state.setOnlineStatus,
      }),
      []
    ),
    shallow
  );

// Hook for feature flags
export const useFeatureFlags = () =>
  useUIStore(
    useMemo(
      () => (state: UIStore) => ({
        showAdvancedFeatures: state.showAdvancedFeatures,
        enableAnimations: state.enableAnimations,
        toggleAdvancedFeatures: state.toggleAdvancedFeatures,
        setEnableAnimations: state.setEnableAnimations,
      }),
      []
    ),
    shallow
  );

// SSR-safe hydration status
export const useIsHydrated = () => useUIStore((state) => state.isHydrated);

// SSR-safe value hook
export const useSSRSafeValue = <T,>(value: T, defaultValue: T): T => {
  const isHydrated = useIsHydrated();
  return isHydrated ? value : defaultValue;
};
