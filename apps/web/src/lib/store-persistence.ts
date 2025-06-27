import { z } from 'zod';

// Simple validation schemas for persisted state
export const PersistedUIStateSchema = z.object({
  sidebarOpen: z.boolean().optional(),
  sidebarCollapsed: z.boolean().optional(),
  isDarkMode: z.boolean().optional(),
  showAdvancedFeatures: z.boolean().optional(),
  enableAnimations: z.boolean().optional(),
});

export const PersistedNavigationStateSchema = z.object({
  lastVisitedPath: z.string().optional(),
  frequentPaths: z.array(z.string()).optional(),
  navigationHistory: z.array(z.string()).optional(),
  prefetchOnHover: z.boolean().optional(),
  rememberLastLocation: z.boolean().optional(),
});

export type PersistedUIState = z.infer<typeof PersistedUIStateSchema>;
export type PersistedNavigationState = z.infer<typeof PersistedNavigationStateSchema>;

// Storage keys
const STORAGE_KEYS = {
  UI_STATE: 'valkyrie-ui-state',
  NAVIGATION_STATE: 'valkyrie-navigation-state',
  STATE_VERSION: 'valkyrie-state-version',
} as const;

const CURRENT_STATE_VERSION = '1.0.0';

// SSR-safe storage utilities
const isClient = typeof window !== 'undefined';

function getStorage(): Storage | null {
  if (!isClient) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// Generic state persistence with validation
async function persistState<T>(key: string, state: T, schema: z.ZodSchema<T>): Promise<void> {
  const storage = getStorage();
  if (!storage) return;

  try {
    const validatedState = schema.parse(state);
    const serialized = JSON.stringify({
      data: validatedState,
      timestamp: Date.now(),
      version: CURRENT_STATE_VERSION,
    });
    storage.setItem(key, serialized);
  } catch (error) {
    console.warn(`Failed to persist state for key ${key}:`, error);
  }
}

// Generic state restoration with validation and migration
async function restoreState<T>(key: string, schema: z.ZodSchema<T>): Promise<T | null> {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const stored = storage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Check version compatibility
    if (parsed.version !== CURRENT_STATE_VERSION) {
      console.info(`State version mismatch for ${key}, clearing old state`);
      storage.removeItem(key);
      return null;
    }

    // Validate and return data
    return schema.parse(parsed.data);
  } catch (error) {
    console.warn(`Failed to restore state for key ${key}:`, error);
    // Clear corrupted data
    storage.removeItem(key);
    return null;
  }
}

// UI state specific functions
export async function persistUIState(state: PersistedUIState): Promise<void> {
  return persistState(STORAGE_KEYS.UI_STATE, state, PersistedUIStateSchema);
}

export async function restoreUIState(): Promise<PersistedUIState | null> {
  return restoreState(STORAGE_KEYS.UI_STATE, PersistedUIStateSchema);
}

// Navigation state specific functions
export async function persistNavigationState(state: PersistedNavigationState): Promise<void> {
  return persistState(STORAGE_KEYS.NAVIGATION_STATE, state, PersistedNavigationStateSchema);
}

export async function restoreNavigationState(): Promise<PersistedNavigationState | null> {
  return restoreState(STORAGE_KEYS.NAVIGATION_STATE, PersistedNavigationStateSchema);
}

// Utility functions
export function clearAllPersistedState(): void {
  const storage = getStorage();
  if (!storage) return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    storage.removeItem(key);
  });
}

function updateFrequentPaths(current: string[], newPath: string): string[] {
  const pathCounts = current.reduce(
    (acc, path) => {
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  pathCounts[newPath] = (pathCounts[newPath] || 0) + 1;

  return Object.entries(pathCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([path]) => path);
}

// Track navigation patterns for AI
export async function trackNavigation(path: string): Promise<void> {
  const currentState = await restoreNavigationState();
  const navigationHistory = [...(currentState?.navigationHistory || []), path].slice(-50);
  const frequentPaths = updateFrequentPaths(currentState?.frequentPaths || [], path);

  await persistNavigationState({
    lastVisitedPath: path,
    navigationHistory,
    frequentPaths,
    prefetchOnHover: currentState?.prefetchOnHover,
    rememberLastLocation: currentState?.rememberLastLocation,
  });
}

// Hook for SSR-safe storage access
export function useSSRSafeStorage() {
  return {
    isClient,
    persistUIState,
    restoreUIState,
    persistNavigationState,
    restoreNavigationState,
    trackNavigation,
  };
}
