import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
}

interface UIActions {
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
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // State
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

      // Modal actions
      openModal: (type, data = null) =>
        set({ activeModal: type, modalData: data }, false, 'ui/openModal'),

      closeModal: () => set({ activeModal: null, modalData: null }, false, 'ui/closeModal'),

      // Loading actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }, false, 'ui/setGlobalLoading'),

      setPageLoading: (loading) => set({ pageLoading: loading }, false, 'ui/setPageLoading'),

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'ui/toggleSidebar'),

      setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'ui/setSidebarOpen'),

      toggleSidebarCollapse: () =>
        set(
          (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
          false,
          'ui/toggleSidebarCollapse'
        ),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }, false, 'ui/setSidebarCollapsed'),

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

      // Theme actions
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode }), false, 'ui/toggleDarkMode'),

      setDarkMode: (dark) => set({ isDarkMode: dark }, false, 'ui/setDarkMode'),

      // Connection status
      setOnlineStatus: (online) => set({ isOnline: online }, false, 'ui/setOnlineStatus'),

      // Feature toggles
      toggleAdvancedFeatures: () =>
        set(
          (state) => ({ showAdvancedFeatures: !state.showAdvancedFeatures }),
          false,
          'ui/toggleAdvancedFeatures'
        ),

      setAdvancedFeatures: (enabled) =>
        set({ showAdvancedFeatures: enabled }, false, 'ui/setAdvancedFeatures'),

      toggleAnimations: () =>
        set(
          (state) => ({ enableAnimations: !state.enableAnimations }),
          false,
          'ui/toggleAnimations'
        ),

      setAnimations: (enabled) => set({ enableAnimations: enabled }, false, 'ui/setAnimations'),
    }),
    { name: 'ui-store' }
  )
);
