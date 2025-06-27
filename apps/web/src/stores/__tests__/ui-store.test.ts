import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUIStore } from '../ui-store';

// Mock setTimeout for notification auto-removal
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('UI Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useUIStore.setState({
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
    });
    vi.clearAllTimers();
  });

  describe('Modal Management', () => {
    it('should open and close modals correctly', () => {
      const { openModal, closeModal } = useUIStore.getState();

      openModal('create-portfolio', { test: 'data' });

      let state = useUIStore.getState();
      expect(state.activeModal).toBe('create-portfolio');
      expect(state.modalData).toEqual({ test: 'data' });

      closeModal();

      state = useUIStore.getState();
      expect(state.activeModal).toBe(null);
      expect(state.modalData).toBe(null);
    });
  });

  describe('Loading States', () => {
    it('should manage loading states', () => {
      const { setGlobalLoading, setPageLoading } = useUIStore.getState();

      setGlobalLoading(true);
      expect(useUIStore.getState().globalLoading).toBe(true);

      setPageLoading(true);
      expect(useUIStore.getState().pageLoading).toBe(true);
    });
  });

  describe('Sidebar Management', () => {
    it('should toggle sidebar correctly', () => {
      const { toggleSidebar } = useUIStore.getState();

      // Initial state is open
      expect(useUIStore.getState().sidebarOpen).toBe(true);

      toggleSidebar();
      expect(useUIStore.getState().sidebarOpen).toBe(false);

      toggleSidebar();
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it('should set sidebar open state directly', () => {
      const { setSidebarOpen } = useUIStore.getState();

      setSidebarOpen(false);
      expect(useUIStore.getState().sidebarOpen).toBe(false);

      setSidebarOpen(true);
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it('should toggle sidebar collapse correctly', () => {
      const { toggleSidebarCollapse } = useUIStore.getState();

      // Initial state is not collapsed
      expect(useUIStore.getState().sidebarCollapsed).toBe(false);

      toggleSidebarCollapse();
      expect(useUIStore.getState().sidebarCollapsed).toBe(true);

      toggleSidebarCollapse();
      expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    });
  });

  describe('Notifications', () => {
    it('should add and remove notifications', () => {
      const { addNotification, removeNotification } = useUIStore.getState();

      addNotification({
        type: 'success',
        title: 'Test Notification',
        message: 'Test message',
      });

      let state = useUIStore.getState();
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].type).toBe('success');

      const notificationId = state.notifications[0].id;
      removeNotification(notificationId);

      state = useUIStore.getState();
      expect(state.notifications).toHaveLength(0);
    });

    it('should auto-remove notifications', () => {
      const { addNotification } = useUIStore.getState();

      addNotification({
        type: 'success',
        title: 'Auto Remove Test',
        duration: 1000,
      });

      expect(useUIStore.getState().notifications).toHaveLength(1);

      vi.advanceTimersByTime(1000);

      expect(useUIStore.getState().notifications).toHaveLength(0);
    });

    it('should clear all notifications', () => {
      const { addNotification, clearNotifications } = useUIStore.getState();

      // Add multiple notifications
      addNotification({ type: 'success', title: 'Test 1' });
      addNotification({ type: 'error', title: 'Test 2' });
      addNotification({ type: 'info', title: 'Test 3' });

      expect(useUIStore.getState().notifications).toHaveLength(3);

      clearNotifications();

      expect(useUIStore.getState().notifications).toHaveLength(0);
    });
  });

  describe('Theme Management', () => {
    it('should toggle theme correctly', () => {
      const { toggleDarkMode } = useUIStore.getState();

      expect(useUIStore.getState().isDarkMode).toBe(false);

      toggleDarkMode();
      expect(useUIStore.getState().isDarkMode).toBe(true);

      toggleDarkMode();
      expect(useUIStore.getState().isDarkMode).toBe(false);
    });

    it('should set dark mode directly', () => {
      const { setDarkMode } = useUIStore.getState();

      setDarkMode(true);
      expect(useUIStore.getState().isDarkMode).toBe(true);

      setDarkMode(false);
      expect(useUIStore.getState().isDarkMode).toBe(false);
    });
  });

  describe('Feature Flags', () => {
    it('should toggle advanced features correctly', () => {
      const { toggleAdvancedFeatures } = useUIStore.getState();

      // Initial state is disabled
      expect(useUIStore.getState().showAdvancedFeatures).toBe(false);

      toggleAdvancedFeatures();
      expect(useUIStore.getState().showAdvancedFeatures).toBe(true);

      toggleAdvancedFeatures();
      expect(useUIStore.getState().showAdvancedFeatures).toBe(false);
    });

    it('should toggle animations correctly', () => {
      const { toggleAnimations } = useUIStore.getState();

      // Initial state is enabled
      expect(useUIStore.getState().enableAnimations).toBe(true);

      toggleAnimations();
      expect(useUIStore.getState().enableAnimations).toBe(false);

      toggleAnimations();
      expect(useUIStore.getState().enableAnimations).toBe(true);
    });
  });

  describe('Connection Status', () => {
    it('should set online status correctly', () => {
      const { setOnlineStatus } = useUIStore.getState();

      setOnlineStatus(false);
      expect(useUIStore.getState().isOnline).toBe(false);

      setOnlineStatus(true);
      expect(useUIStore.getState().isOnline).toBe(true);
    });
  });
});
