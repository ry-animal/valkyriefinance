import { createStore } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import {
  checkRateLimit,
  type ModalDataSchema,
  sanitizeModalData,
  validateCSRFToken,
} from '@/lib/security-validation';
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
  modalData: unknown;

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

  // Security state
  securityInitialized: boolean;
}

interface UIActions {
  // Hydration
  hydrate: (persistedState?: PersistedUIState | null) => Promise<void>;

  // Modal actions (with security validation)
  openModal: (type: ModalType, data?: unknown, csrfToken?: string) => boolean;
  closeModal: () => void;

  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setPageLoading: (loading: boolean) => void;

  // Sidebar actions (with rate limiting)
  toggleSidebar: () => boolean;
  setSidebarOpen: (open: boolean) => boolean;
  toggleSidebarCollapse: () => boolean;
  setSidebarCollapsed: (collapsed: boolean) => boolean;

  // Notification actions (with sanitization)
  addNotification: (notification: Omit<NotificationState, 'id'>) => boolean;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Theme actions
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;

  // Connection status
  setOnlineStatus: (online: boolean) => void;

  // Feature toggles (with rate limiting)
  toggleAdvancedFeatures: () => boolean;
  setAdvancedFeatures: (enabled: boolean) => boolean;
  toggleAnimations: () => boolean;
  setAnimations: (enabled: boolean) => boolean;

  // Batch state updates for performance (with validation)
  batchUpdate: (updates: Partial<UIState>, csrfToken?: string) => boolean;

  // Security initialization
  initializeSecurity: () => void;
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
  securityInitialized: false,
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

        // Modal actions (with security validation)
        openModal: (type, data = null, csrfToken) => {
          if (!csrfToken || validateCSRFToken(csrfToken)) {
            const sanitizedData = sanitizeModalData(data);
            if (!checkRateLimit('modal-actions')) {
              console.warn('Rate limit exceeded for modal actions');
              return false;
            }
            set({ activeModal: type, modalData: sanitizedData }, false, 'ui/openModal');
            return true;
          }
          return false;
        },

        closeModal: () => set({ activeModal: null, modalData: null }, false, 'ui/closeModal'),

        // Loading actions
        setGlobalLoading: (loading) =>
          set({ globalLoading: loading }, false, 'ui/setGlobalLoading'),

        setPageLoading: (loading) => set({ pageLoading: loading }, false, 'ui/setPageLoading'),

        // Sidebar actions (with rate limiting)
        toggleSidebar: () => {
          if (!checkRateLimit('navigation-changes')) {
            console.warn('Rate limit exceeded for sidebar toggle');
            return false;
          }
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'ui/toggleSidebar');
          debouncedPersist(get());
          return true;
        },

        setSidebarOpen: (open) => {
          if (!checkRateLimit('navigation-changes')) {
            console.warn('Rate limit exceeded for sidebar open');
            return false;
          }
          set({ sidebarOpen: open }, false, 'ui/setSidebarOpen');
          debouncedPersist(get());
          return true;
        },

        toggleSidebarCollapse: () => {
          if (!checkRateLimit('navigation-changes')) {
            console.warn('Rate limit exceeded for sidebar collapse toggle');
            return false;
          }
          set(
            (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
            false,
            'ui/toggleSidebarCollapse'
          );
          debouncedPersist(get());
          return true;
        },

        setSidebarCollapsed: (collapsed) => {
          if (!checkRateLimit('navigation-changes')) {
            console.warn('Rate limit exceeded for sidebar collapsed');
            return false;
          }
          set({ sidebarCollapsed: collapsed }, false, 'ui/setSidebarCollapsed');
          debouncedPersist(get());
          return true;
        },

        // Notification actions (with sanitization)
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
          return true;
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

        // Theme actions
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

        // Feature toggles (with rate limiting)
        toggleAdvancedFeatures: () => {
          if (!checkRateLimit('state-updates')) {
            console.warn('Rate limit exceeded for advanced features toggle');
            return false;
          }
          set(
            (state) => ({ showAdvancedFeatures: !state.showAdvancedFeatures }),
            false,
            'ui/toggleAdvancedFeatures'
          );
          debouncedPersist(get());
          return true;
        },

        setAdvancedFeatures: (enabled) => {
          if (!checkRateLimit('state-updates')) {
            console.warn('Rate limit exceeded for advanced features set');
            return false;
          }
          set({ showAdvancedFeatures: enabled }, false, 'ui/setAdvancedFeatures');
          debouncedPersist(get());
          return true;
        },

        toggleAnimations: () => {
          if (!checkRateLimit('state-updates')) {
            console.warn('Rate limit exceeded for animations toggle');
            return false;
          }
          set(
            (state) => ({ enableAnimations: !state.enableAnimations }),
            false,
            'ui/toggleAnimations'
          );
          debouncedPersist(get());
          return true;
        },

        setAnimations: (enabled) => {
          if (!checkRateLimit('state-updates')) {
            console.warn('Rate limit exceeded for animations set');
            return false;
          }
          set({ enableAnimations: enabled }, false, 'ui/setAnimations');
          debouncedPersist(get());
          return true;
        },

        // Batch updates for performance (with validation)
        batchUpdate: (updates, csrfToken) => {
          if (!csrfToken || validateCSRFToken(csrfToken)) {
            if (!checkRateLimit('state-updates')) {
              console.warn('Rate limit exceeded for state updates');
              return false;
            }
            set((state) => ({ ...state, ...updates }), false, 'ui/batchUpdate');
            debouncedPersist(get());
            return true;
          }
          return false;
        },

        // Security initialization
        initializeSecurity: () => {
          set({ securityInitialized: true }, false, 'ui/initializeSecurity');
        },
      })),
      { name: 'ui-store' }
    )
  );
};
