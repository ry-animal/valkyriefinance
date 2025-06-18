import { beforeEach, describe, expect, it } from 'vitest';
import type { WalletUser } from '../auth-store';
import { useAuthStore } from '../auth-store';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('Wallet Connection', () => {
    it('should connect wallet correctly', () => {
      const { connectWallet } = useAuthStore.getState();

      const mockWalletUser: WalletUser = {
        id: '1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        ensName: 'test.eth',
      };

      connectWallet(mockWalletUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockWalletUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should disconnect wallet correctly', () => {
      const { connectWallet, disconnectWallet } = useAuthStore.getState();

      const mockWalletUser: WalletUser = {
        id: '1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        ensName: 'test.eth',
      };

      // First connect
      connectWallet(mockWalletUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Then disconnect
      disconnectWallet();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('User Management', () => {
    it('should set user correctly', () => {
      const { setUser } = useAuthStore.getState();

      const mockWalletUser: WalletUser = {
        id: '1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        ensName: 'test.eth',
      };

      setUser(mockWalletUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockWalletUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should update user ENS name', () => {
      const { setUser } = useAuthStore.getState();

      const mockWalletUser: WalletUser = {
        id: '1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        ensName: 'test.eth',
      };

      setUser(mockWalletUser);

      // Update ENS name
      const updatedUser: WalletUser = {
        ...mockWalletUser,
        ensName: 'updated.eth',
      };

      setUser(updatedUser);

      const state = useAuthStore.getState();
      expect(state.user?.ensName).toBe('updated.eth');
      expect(state.user?.walletAddress).toBe(mockWalletUser.walletAddress);
    });

    it('should clear user when setting null', () => {
      const { setUser } = useAuthStore.getState();

      const mockWalletUser: WalletUser = {
        id: '1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        ensName: 'test.eth',
      };

      setUser(mockWalletUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      setUser(null);
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Loading State', () => {
    it('should set loading state correctly', () => {
      const { setLoading } = useAuthStore.getState();

      setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);

      setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });
});
