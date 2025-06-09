import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../auth-store';
import type { User } from '@valkryie/common/types';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  image: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    
    expect(state.user).toBe(null);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });

  it('should login user correctly', () => {
    const { login } = useAuthStore.getState();
    
    login(mockUser);
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('should logout user correctly', () => {
    const { login, logout } = useAuthStore.getState();
    
    // First login
    login(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    
    // Then logout
    logout();
    
    const state = useAuthStore.getState();
    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('should set user correctly', () => {
    const { setUser } = useAuthStore.getState();
    
    setUser(mockUser);
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear user when setting null', () => {
    const { setUser, login } = useAuthStore.getState();
    
    // First login
    login(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    
    // Then set null
    setUser(null);
    
    const state = useAuthStore.getState();
    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });

  it('should update user correctly', () => {
    const { login, updateUser } = useAuthStore.getState();
    
    // First login
    login(mockUser);
    
    // Update user
    const updates = { name: 'Updated Name' };
    updateUser(updates);
    
    const state = useAuthStore.getState();
    expect(state.user?.name).toBe('Updated Name');
    expect(state.user?.email).toBe(mockUser.email); // Other fields unchanged
  });

  it('should not update user when no user is logged in', () => {
    const { updateUser } = useAuthStore.getState();
    
    // Try to update when no user
    updateUser({ name: 'Updated Name' });
    
    const state = useAuthStore.getState();
    expect(state.user).toBe(null);
  });

  it('should set loading state correctly', () => {
    const { setLoading } = useAuthStore.getState();
    
    setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
    
    setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
}); 