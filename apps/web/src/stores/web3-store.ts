import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TokenBalance {
  address: string;
  symbol: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  valueUsd?: string;
}

export interface Transaction {
  hash: string;
  type: 'swap' | 'deposit' | 'withdrawal' | 'bridge' | 'approve';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  amount?: string;
  token?: string;
  chainId: number;
  gasUsed?: string;
}

interface Web3State {
  // Wallet connection
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  
  // Balances
  nativeBalance: string | null;
  tokenBalances: TokenBalance[];
  
  // Transactions
  pendingTransactions: Transaction[];
  recentTransactions: Transaction[];
  
  // Loading states
  isConnecting: boolean;
  isBalanceLoading: boolean;
  isTransactionLoading: boolean;
  
  // Network status
  isWrongNetwork: boolean;
  supportedChains: number[];
}

interface Web3Actions {
  // Connection actions
  setConnected: (connected: boolean) => void;
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setConnecting: (connecting: boolean) => void;
  
  // Balance actions
  setNativeBalance: (balance: string | null) => void;
  setTokenBalances: (balances: TokenBalance[]) => void;
  updateTokenBalance: (address: string, balance: string) => void;
  setBalanceLoading: (loading: boolean) => void;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'timestamp'>) => void;
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void;
  removeTransaction: (hash: string) => void;
  clearPendingTransactions: () => void;
  setTransactionLoading: (loading: boolean) => void;
  
  // Network actions
  setWrongNetwork: (wrong: boolean) => void;
  setSupportedChains: (chains: number[]) => void;
  
  // Reset actions
  resetWalletState: () => void;
  disconnect: () => void;
}

type Web3Store = Web3State & Web3Actions;

const initialState: Web3State = {
  isConnected: false,
  address: null,
  chainId: null,
  nativeBalance: null,
  tokenBalances: [],
  pendingTransactions: [],
  recentTransactions: [],
  isConnecting: false,
  isBalanceLoading: false,
  isTransactionLoading: false,
  isWrongNetwork: false,
  supportedChains: [1, 42161, 10, 137], // Ethereum, Arbitrum, Optimism, Polygon
};

export const useWeb3Store = create<Web3Store>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Connection actions
      setConnected: (connected) =>
        set(
          { isConnected: connected },
          false,
          'web3/setConnected'
        ),

      setAddress: (address) =>
        set(
          { address },
          false,
          'web3/setAddress'
        ),

      setChainId: (chainId) => {
        const { supportedChains } = get();
        set(
          { 
            chainId,
            isWrongNetwork: chainId ? !supportedChains.includes(chainId) : false
          },
          false,
          'web3/setChainId'
        );
      },

      setConnecting: (connecting) =>
        set(
          { isConnecting: connecting },
          false,
          'web3/setConnecting'
        ),

      // Balance actions
      setNativeBalance: (balance) =>
        set(
          { nativeBalance: balance },
          false,
          'web3/setNativeBalance'
        ),

      setTokenBalances: (balances) =>
        set(
          { tokenBalances: balances },
          false,
          'web3/setTokenBalances'
        ),

      updateTokenBalance: (address, balance) =>
        set(
          (state) => ({
            tokenBalances: state.tokenBalances.map((token) =>
              token.address.toLowerCase() === address.toLowerCase()
                ? { ...token, balance, balanceFormatted: balance }
                : token
            ),
          }),
          false,
          'web3/updateTokenBalance'
        ),

      setBalanceLoading: (loading) =>
        set(
          { isBalanceLoading: loading },
          false,
          'web3/setBalanceLoading'
        ),

      // Transaction actions
      addTransaction: (transaction) =>
        set(
          (state) => ({
            pendingTransactions: [
              ...state.pendingTransactions,
              { ...transaction, timestamp: new Date() },
            ],
          }),
          false,
          'web3/addTransaction'
        ),

      updateTransaction: (hash, updates) =>
        set(
          (state) => {
            const pendingIndex = state.pendingTransactions.findIndex(
              (tx) => tx.hash === hash
            );
            
            if (pendingIndex !== -1) {
              const updatedTx = { ...state.pendingTransactions[pendingIndex], ...updates };
              const newPending = [...state.pendingTransactions];
              
              if (updates.status === 'confirmed' || updates.status === 'failed') {
                // Move to recent transactions
                newPending.splice(pendingIndex, 1);
                return {
                  pendingTransactions: newPending,
                  recentTransactions: [updatedTx, ...state.recentTransactions].slice(0, 20),
                };
              } else {
                // Update in pending
                newPending[pendingIndex] = updatedTx;
                return { pendingTransactions: newPending };
              }
            }
            
            return state;
          },
          false,
          'web3/updateTransaction'
        ),

      removeTransaction: (hash) =>
        set(
          (state) => ({
            pendingTransactions: state.pendingTransactions.filter(
              (tx) => tx.hash !== hash
            ),
          }),
          false,
          'web3/removeTransaction'
        ),

      clearPendingTransactions: () =>
        set(
          { pendingTransactions: [] },
          false,
          'web3/clearPendingTransactions'
        ),

      setTransactionLoading: (loading) =>
        set(
          { isTransactionLoading: loading },
          false,
          'web3/setTransactionLoading'
        ),

      // Network actions
      setWrongNetwork: (wrong) =>
        set(
          { isWrongNetwork: wrong },
          false,
          'web3/setWrongNetwork'
        ),

      setSupportedChains: (chains) =>
        set(
          (state) => ({
            supportedChains: chains,
            isWrongNetwork: state.chainId ? !chains.includes(state.chainId) : false,
          }),
          false,
          'web3/setSupportedChains'
        ),

      // Reset actions
      resetWalletState: () =>
        set(
          {
            nativeBalance: null,
            tokenBalances: [],
            pendingTransactions: [],
            isBalanceLoading: false,
            isTransactionLoading: false,
          },
          false,
          'web3/resetWalletState'
        ),

      disconnect: () =>
        set(
          initialState,
          false,
          'web3/disconnect'
        ),
    }),
    { name: 'web3-store' }
  )
); 