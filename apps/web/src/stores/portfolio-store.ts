import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Portfolio, PortfolioAsset } from '@valkryie/common/types';

interface PortfolioState {
  portfolios: Portfolio[];
  selectedPortfolioId: string | null;
  isLoading: boolean;
  lastUpdated: Date | null;
}

interface PortfolioActions {
  setPortfolios: (portfolios: Portfolio[]) => void;
  addPortfolio: (portfolio: Portfolio) => void;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
  removePortfolio: (id: string) => void;
  selectPortfolio: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  updatePortfolioAssets: (portfolioId: string, assets: PortfolioAsset[]) => void;
  updatePortfolioValue: (portfolioId: string, totalValue: string) => void;
  getSelectedPortfolio: () => Portfolio | null;
  getPortfolioById: (id: string) => Portfolio | null;
}

type PortfolioStore = PortfolioState & PortfolioActions;

export const usePortfolioStore = create<PortfolioStore>()(
  devtools(
    (set, get) => ({
      // State
      portfolios: [],
      selectedPortfolioId: null,
      isLoading: false,
      lastUpdated: null,

      // Actions
      setPortfolios: (portfolios) =>
        set(
          {
            portfolios,
            lastUpdated: new Date(),
            // Auto-select default portfolio if none selected
            selectedPortfolioId: get().selectedPortfolioId || 
              portfolios.find(p => p.isDefault)?.id || 
              portfolios[0]?.id || null,
          },
          false,
          'portfolio/setPortfolios'
        ),

      addPortfolio: (portfolio) =>
        set(
          (state) => ({
            portfolios: [...state.portfolios, portfolio],
            lastUpdated: new Date(),
          }),
          false,
          'portfolio/addPortfolio'
        ),

      updatePortfolio: (id, updates) =>
        set(
          (state) => ({
            portfolios: state.portfolios.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
            lastUpdated: new Date(),
          }),
          false,
          'portfolio/updatePortfolio'
        ),

      removePortfolio: (id) =>
        set(
          (state) => {
            const newPortfolios = state.portfolios.filter((p) => p.id !== id);
            return {
              portfolios: newPortfolios,
              selectedPortfolioId: state.selectedPortfolioId === id 
                ? newPortfolios[0]?.id || null 
                : state.selectedPortfolioId,
              lastUpdated: new Date(),
            };
          },
          false,
          'portfolio/removePortfolio'
        ),

      selectPortfolio: (id) =>
        set(
          { selectedPortfolioId: id },
          false,
          'portfolio/selectPortfolio'
        ),

      setLoading: (loading) =>
        set(
          { isLoading: loading },
          false,
          'portfolio/setLoading'
        ),

      updatePortfolioAssets: (portfolioId, assets) =>
        set(
          (state) => ({
            portfolios: state.portfolios.map((p) =>
              p.id === portfolioId ? { ...p, assets } : p
            ),
            lastUpdated: new Date(),
          }),
          false,
          'portfolio/updateAssets'
        ),

      updatePortfolioValue: (portfolioId, totalValue) =>
        set(
          (state) => ({
            portfolios: state.portfolios.map((p) =>
              p.id === portfolioId ? { ...p, totalValue } : p
            ),
            lastUpdated: new Date(),
          }),
          false,
          'portfolio/updateValue'
        ),

      // Computed getters
      getSelectedPortfolio: () => {
        const { portfolios, selectedPortfolioId } = get();
        return portfolios.find((p) => p.id === selectedPortfolioId) || null;
      },

      getPortfolioById: (id) => {
        const { portfolios } = get();
        return portfolios.find((p) => p.id === id) || null;
      },
    }),
    { name: 'portfolio-store' }
  )
); 