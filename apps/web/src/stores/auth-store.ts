import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@valkyrie/common/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setUser: (user) =>
        set(
          {
            user,
            isAuthenticated: !!user,
          },
          false,
          'auth/setUser'
        ),

      setLoading: (loading) =>
        set(
          { isLoading: loading },
          false,
          'auth/setLoading'
        ),

      login: (user) =>
        set(
          {
            user,
            isAuthenticated: true,
            isLoading: false,
          },
          false,
          'auth/login'
        ),

      logout: () =>
        set(
          {
            user: null,
            isAuthenticated: false,
            isLoading: false,
          },
          false,
          'auth/logout'
        ),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set(
            {
              user: { ...currentUser, ...updates },
            },
            false,
            'auth/updateUser'
          );
        }
      },
    }),
    { name: 'auth-store' }
  )
); 