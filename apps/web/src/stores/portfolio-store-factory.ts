import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalYield: number;
  positions: Position[];
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  tokenSymbol: string;
  tokenAddress: string;
  amount: number;
  value: number;
  apy: number;
  vaultId: string;
}

interface PortfolioState {
  portfolios: Portfolio[];
  selectedPortfolioId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface PortfolioActions {
  setPortfolios: (portfolios: Portfolio[]) => void;
  addPortfolio: (portfolio: Portfolio) => void;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
  removePortfolio: (id: string) => void;
  selectPortfolio: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type PortfolioStore = PortfolioState & PortfolioActions;

const getDefaultState = (initialData?: Partial<PortfolioState>): PortfolioState => ({
  portfolios: [],
  selectedPortfolioId: null,
  isLoading: false,
  error: null,
  ...initialData,
});

export const createPortfolioStore = (initialData?: Partial<PortfolioState>) => {
  return createStore<PortfolioStore>()(
    devtools(
      (set, get) => ({
        ...getDefaultState(initialData),

        setPortfolios: (portfolios) =>
          set({ portfolios }, false, 'portfolio/setPortfolios'),

        addPortfolio: (portfolio) =>
          set(
            (state) => ({ portfolios: [...state.portfolios, portfolio] }),
            false,
            'portfolio/addPortfolio'
          ),

        updatePortfolio: (id, updates) =>
          set(
            (state) => ({
              portfolios: state.portfolios.map((p) =>
                p.id === id ? { ...p, ...updates } : p
              ),
            }),
            false,
            'portfolio/updatePortfolio'
          ),

        removePortfolio: (id) =>
          set(
            (state) => ({
              portfolios: state.portfolios.filter((p) => p.id !== id),
              selectedPortfolioId:
                state.selectedPortfolioId === id ? null : state.selectedPortfolioId,
            }),
            false,
            'portfolio/removePortfolio'
          ),

        selectPortfolio: (id) =>
          set({ selectedPortfolioId: id }, false, 'portfolio/selectPortfolio'),

        setLoading: (loading) =>
          set({ isLoading: loading }, false, 'portfolio/setLoading'),

        setError: (error) =>
          set({ error }, false, 'portfolio/setError'),

        clearError: () =>
          set({ error: null }, false, 'portfolio/clearError'),
      }),
      { name: 'portfolio-store' }
    )
  );
}; 