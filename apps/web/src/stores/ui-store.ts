import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Modal types
export type ModalType =
  | 'connect-wallet'
  | 'portfolio-create'
  | 'portfolio-edit'
  | 'portfolio-delete'
  | 'settings'
  | 'notifications'
  | null;

// Type-safe modal data mapping
type ModalDataMap = {
  'connect-wallet': undefined;
  'portfolio-create': undefined;
  'portfolio-edit': { portfolioId: string };
  'portfolio-delete': { portfolioId: string };
  settings: { section?: 'general' | 'security' | 'notifications' };
  notifications: { filter?: 'all' | 'unread' };
};

export interface NotificationState {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface UIState {
  // Modal state
  activeModal: ModalType;
  modalData: ModalDataMap[keyof ModalDataMap] | undefined;

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
}

interface UIActions {
  // Modal actions
  openModal: <T extends keyof ModalDataMap>(type: T, data?: ModalDataMap[T]) => void;
  closeModal: () => void;

  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Notification actions
  addNotification: (notification: NotificationState) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;

  // Theme actions
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;

  // Online status actions
  setOnlineStatus: (isOnline: boolean) => void;

  // Feature flag actions
  toggleAdvancedFeatures: () => void;
  setEnableAnimations: (enabled: boolean) => void;
}

export interface UIStore extends UIState, UIActions {}

export const createUIStore = () =>
  create<UIStore>()(
    devtools(
      (set) => ({
        // State
        activeModal: null,
        modalData: undefined,
        sidebarOpen: true,
        sidebarCollapsed: false,
        notifications: [],
        isDarkMode: false,
        isOnline: true,
        showAdvancedFeatures: false,
        enableAnimations: true,

        // Modal actions
        openModal: <T extends keyof ModalDataMap>(type: T, data?: ModalDataMap[T]) =>
          set({ activeModal: type, modalData: data }, false, 'ui/openModal'),

        closeModal: () => set({ activeModal: null, modalData: undefined }, false, 'ui/closeModal'),

        // Sidebar actions
        toggleSidebar: () =>
          set((state: UIState) => ({ sidebarOpen: !state.sidebarOpen }), false, 'ui/toggleSidebar'),

        setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }, false, 'ui/setSidebarOpen'),

        toggleSidebarCollapse: () =>
          set(
            (state: UIState) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
            false,
            'ui/toggleSidebarCollapse'
          ),

        setSidebarCollapsed: (collapsed: boolean) =>
          set({ sidebarCollapsed: collapsed }, false, 'ui/setSidebarCollapsed'),

        // Notification actions
        addNotification: (notification: NotificationState) =>
          set(
            (state: UIState) => ({
              notifications: [...state.notifications, notification],
            }),
            false,
            'ui/addNotification'
          ),

        dismissNotification: (id: string) =>
          set(
            (state: UIState) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }),
            false,
            'ui/dismissNotification'
          ),

        clearNotifications: () => set({ notifications: [] }, false, 'ui/clearNotifications'),

        // Theme actions
        toggleTheme: () =>
          set((state: UIState) => ({ isDarkMode: !state.isDarkMode }), false, 'ui/toggleTheme'),

        setDarkMode: (isDark: boolean) => set({ isDarkMode: isDark }, false, 'ui/setDarkMode'),

        // Online status actions
        setOnlineStatus: (isOnline: boolean) => set({ isOnline }, false, 'ui/setOnlineStatus'),

        // Feature flag actions
        toggleAdvancedFeatures: () =>
          set(
            (state: UIState) => ({ showAdvancedFeatures: !state.showAdvancedFeatures }),
            false,
            'ui/toggleAdvancedFeatures'
          ),

        setEnableAnimations: (enabled: boolean) =>
          set({ enableAnimations: enabled }, false, 'ui/setEnableAnimations'),
      }),
      { name: 'UI Store' }
    )
  );
