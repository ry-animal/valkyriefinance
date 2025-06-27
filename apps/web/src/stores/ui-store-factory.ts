import { createStore } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { type PersistedUIState, persistUIState, restoreUIState } from '@/lib/store-persistence';

export type ModalType =
  | 'create-portfolio'
  | 'edit-portfolio'
  | 'delete-portfolio'
  | 'connect-wallet'
  | 'transaction-details'
  | 'ai-settings'
  | null;

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  // Modal state
  activeModal: ModalType;
  modalData: any;

  // Loading states
  globalLoading: boolean;
  pageLoading: boolean;

  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Notifications
  notifications: NotificationState[];

  // General UI flags
  isDarkMode: boolean;
  isOnline: boolean;

  // Feature flags
  showAdvancedFeatures: boolean;
  enableAnimations: boolean;

  // Hydration state
  isHydrated: boolean;
}

interface UIActions {
  // Hydration
  hydrate: (persistedState?: PersistedUIState | null) => Promise<void>;

  // Modal actions
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;

  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setPageLoading: (loading: boolean) => void;

  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Notification actions
  addNotification: (notification: Omit<NotificationState, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Theme actions
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;

  // Connection status
  setOnlineStatus: (online: boolean) => void;

  // Feature toggles
  toggleAdvancedFeatures: () => void;
  setAdvancedFeatures: (enabled: boolean) => void;
  toggleAnimations: () => void;
  setAnimations: (enabled: boolean) => void;

  // Batch state updates for performance
  batchUpdate: (updates: Partial<UIState>) => void;
}

export type UIStore = UIState & UIActions;

const getDefaultState = (initialData?: Partial<UIState>): UIState => ({
  activeModal: null,
  modalData: null,
  globalLoading: false,
  pageLoading: false,
  sidebarOpen: true,
  sidebarCollapsed: false,
  notifications: [],
  isDarkMode: false,
  isOnline: true,
  showAdvancedFeatures: false,
  enableAnimations: true,
  isHydrated: false,
  ...initialData,
});

// Debounced persistence utility
let persistenceTimer: NodeJS.Timeout | null = null;
const debouncedPersist = (state: UIState) => {
  if (persistenceTimer) clearTimeout(persistenceTimer);
  persistenceTimer = setTimeout(() => {
    if (state.isHydrated) {
      persistUIState({
        sidebarOpen: state.sidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed,
        isDarkMode: state.isDarkMode,
        showAdvancedFeatures: state.showAdvancedFeatures,
        enableAnimations: state.enableAnimations,
      });
    }
  }, 500);
};

export const createUIStore = (initialData?: Partial<UIState>) => {
  return createStore<UIStore>()(
    devtools(
      subscribeWithSelector((set, get) => ({
        ...getDefaultState(initialData),

        // Hydration with persistence
        hydrate: async (persistedState?: PersistedUIState | null) => {
          try {
            const restored = persistedState || (await restoreUIState());

            if (restored) {
              set(
                (state) => ({
                  ...state,
                  sidebarOpen: restored.sidebarOpen ?? state.sidebarOpen,
                  sidebarCollapsed: restored.sidebarCollapsed ?? state.sidebarCollapsed,
                  isDarkMode: restored.isDarkMode ?? state.isDarkMode,
                  showAdvancedFeatures: restored.showAdvancedFeatures ?? state.showAdvancedFeatures,
                  enableAnimations: restored.enableAnimations ?? state.enableAnimations,
                  isHydrated: true,
                }),
                false,
                'ui/hydrate'
              );
            } else {
              set({ isHydrated: true }, false, 'ui/hydrateEmpty');
            }
          } catch (error) {
            console.warn('Failed to hydrate UI state:', error);
            set({ isHydrated: true }, false, 'ui/hydrateError');
          }
        },

        // Modal actions
        openModal: (type, data = null) =>
          set({ activeModal: type, modalData: data }, false, 'ui/openModal'),

        closeModal: () => set({ activeModal: null, modalData: null }, false, 'ui/closeModal'),

        // Loading actions
        setGlobalLoading: (loading) =>
          set({ globalLoading: loading }, false, 'ui/setGlobalLoading'),

        setPageLoading: (loading) => set({ pageLoading: loading }, false, 'ui/setPageLoading'),

        // Sidebar actions with persistence
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'ui/toggleSidebar');
          debouncedPersist(get());
        },

        setSidebarOpen: (open) => {
          set({ sidebarOpen: open }, false, 'ui/setSidebarOpen');
          debouncedPersist(get());
        },

        toggleSidebarCollapse: () => {
          set(
            (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
            false,
            'ui/toggleSidebarCollapse'
          );
          debouncedPersist(get());
        },

        setSidebarCollapsed: (collapsed) => {
          set({ sidebarCollapsed: collapsed }, false, 'ui/setSidebarCollapsed');
          debouncedPersist(get());
        },

        // Notification actions
        addNotification: (notification) => {
          const id = Math.random().toString(36).substring(2, 9);
          set(
            (state) => ({
              notifications: [...state.notifications, { ...notification, id }],
            }),
            false,
            'ui/addNotification'
          );

          // Auto-remove notification after duration
          const duration = notification.duration || 5000;
          setTimeout(() => {
            set(
              (state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
              }),
              false,
              'ui/autoRemoveNotification'
            );
          }, duration);
        },

        removeNotification: (id) =>
          set(
            (state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }),
            false,
            'ui/removeNotification'
          ),

        clearNotifications: () => set({ notifications: [] }, false, 'ui/clearNotifications'),

        // Theme actions with persistence
        toggleDarkMode: () => {
          set((state) => ({ isDarkMode: !state.isDarkMode }), false, 'ui/toggleDarkMode');
          debouncedPersist(get());
        },

        setDarkMode: (dark) => {
          set({ isDarkMode: dark }, false, 'ui/setDarkMode');
          debouncedPersist(get());
        },

        // Connection status
        setOnlineStatus: (online) => set({ isOnline: online }, false, 'ui/setOnlineStatus'),

        // Feature toggles with persistence
        toggleAdvancedFeatures: () => {
          set(
            (state) => ({ showAdvancedFeatures: !state.showAdvancedFeatures }),
            false,
            'ui/toggleAdvancedFeatures'
          );
          debouncedPersist(get());
        },

        setAdvancedFeatures: (enabled) => {
          set({ showAdvancedFeatures: enabled }, false, 'ui/setAdvancedFeatures');
          debouncedPersist(get());
        },

        toggleAnimations: () => {
          set(
            (state) => ({ enableAnimations: !state.enableAnimations }),
            false,
            'ui/toggleAnimations'
          );
          debouncedPersist(get());
        },

        setAnimations: (enabled) => {
          set({ enableAnimations: enabled }, false, 'ui/setAnimations');
          debouncedPersist(get());
        },

        // Batch updates for performance
        batchUpdate: (updates) => {
          set((state) => ({ ...state, ...updates }), false, 'ui/batchUpdate');
          debouncedPersist(get());
        },
      })),
      { name: 'ui-store' }
    )
  );
};
