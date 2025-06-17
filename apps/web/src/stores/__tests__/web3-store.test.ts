import { describe, it, expect, beforeEach } from 'vitest';
import { useWeb3Store } from '../web3-store';
import type { Transaction } from '../web3-store';

describe('Web3 Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useWeb3Store.setState({
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
      supportedChains: [1, 42161, 10, 137, 8453],
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useWeb3Store.getState();
      
      expect(state.isConnected).toBe(false);
      expect(state.address).toBeNull();
      expect(state.chainId).toBeNull();
      expect(state.pendingTransactions).toEqual([]);
      expect(state.recentTransactions).toEqual([]);
      expect(state.isWrongNetwork).toBe(false);
      expect(state.supportedChains).toEqual([1, 42161, 10, 137, 8453]);
    });
  });

  describe('Connection Management', () => {
    it('should set connected state', () => {
      const { setConnected } = useWeb3Store.getState();
      
      setConnected(true);
      expect(useWeb3Store.getState().isConnected).toBe(true);
      
      setConnected(false);
      expect(useWeb3Store.getState().isConnected).toBe(false);
    });

    it('should set wallet address', () => {
      const { setAddress } = useWeb3Store.getState();
      const testAddress = '0x1234567890123456789012345678901234567890';
      
      setAddress(testAddress);
      expect(useWeb3Store.getState().address).toBe(testAddress);
      
      setAddress(null);
      expect(useWeb3Store.getState().address).toBeNull();
    });

    it('should set chain ID and detect wrong network', () => {
      const { setChainId } = useWeb3Store.getState();
      
      // Set supported chain
      setChainId(1);
      expect(useWeb3Store.getState().chainId).toBe(1);
      expect(useWeb3Store.getState().isWrongNetwork).toBe(false);
      
      // Set unsupported chain
      setChainId(999);
      expect(useWeb3Store.getState().chainId).toBe(999);
      expect(useWeb3Store.getState().isWrongNetwork).toBe(true);
      
      // Set null chain
      setChainId(null);
      expect(useWeb3Store.getState().chainId).toBeNull();
      expect(useWeb3Store.getState().isWrongNetwork).toBe(false);
    });
  });

  describe('Transaction Management', () => {
    const mockTransaction: Omit<Transaction, 'timestamp'> = {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      type: 'vault_deposit',
      status: 'pending',
      amount: '1.0',
      token: 'ETH',
      chainId: 1,
    };

    it('should add new transaction to pending list', () => {
      const { addTransaction } = useWeb3Store.getState();
      
      addTransaction(mockTransaction);
      
      const state = useWeb3Store.getState();
      expect(state.pendingTransactions).toHaveLength(1);
      expect(state.pendingTransactions[0]).toMatchObject(mockTransaction);
      expect(state.pendingTransactions[0].timestamp).toBeInstanceOf(Date);
      expect(state.recentTransactions).toHaveLength(0);
    });

    it('should update pending transaction status', () => {
      const { addTransaction, updateTransaction } = useWeb3Store.getState();
      
      // Add transaction
      addTransaction(mockTransaction);
      
      // Update transaction
      updateTransaction(mockTransaction.hash, { status: 'confirmed' });
      
      const state = useWeb3Store.getState();
      expect(state.pendingTransactions).toHaveLength(0);
      expect(state.recentTransactions).toHaveLength(1);
      expect(state.recentTransactions[0].status).toBe('confirmed');
      expect(state.recentTransactions[0].hash).toBe(mockTransaction.hash);
    });

    it('should update transaction with additional data', () => {
      const { addTransaction, updateTransaction } = useWeb3Store.getState();
      
      addTransaction(mockTransaction);
      
      updateTransaction(mockTransaction.hash, { 
        gasUsed: '150000',
        status: 'confirmed' 
      });
      
      const state = useWeb3Store.getState();
      expect(state.recentTransactions[0].gasUsed).toBe('150000');
      expect(state.recentTransactions[0].status).toBe('confirmed');
    });

    it('should handle multiple transactions', () => {
      const { addTransaction } = useWeb3Store.getState();
      
      const transaction1 = { ...mockTransaction, hash: '0xhash1' };
      const transaction2 = { ...mockTransaction, hash: '0xhash2', type: 'vault_withdraw' as const };
      
      addTransaction(transaction1);
      addTransaction(transaction2);
      
      const state = useWeb3Store.getState();
      expect(state.pendingTransactions).toHaveLength(2);
      expect(state.pendingTransactions[0].hash).toBe('0xhash1');
      expect(state.pendingTransactions[1].hash).toBe('0xhash2');
      expect(state.pendingTransactions[1].type).toBe('vault_withdraw');
    });

    it('should remove transaction', () => {
      const { addTransaction, removeTransaction } = useWeb3Store.getState();
      
      addTransaction(mockTransaction);
      expect(useWeb3Store.getState().pendingTransactions).toHaveLength(1);
      
      removeTransaction(mockTransaction.hash);
      expect(useWeb3Store.getState().pendingTransactions).toHaveLength(0);
    });

    it('should clear all pending transactions', () => {
      const { addTransaction, clearPendingTransactions } = useWeb3Store.getState();
      
      addTransaction({ ...mockTransaction, hash: '0xhash1' });
      addTransaction({ ...mockTransaction, hash: '0xhash2' });
      addTransaction({ ...mockTransaction, hash: '0xhash3' });
      
      expect(useWeb3Store.getState().pendingTransactions).toHaveLength(3);
      
      clearPendingTransactions();
      expect(useWeb3Store.getState().pendingTransactions).toHaveLength(0);
    });

    it('should limit recent transactions to 20', () => {
      const { addTransaction, updateTransaction } = useWeb3Store.getState();
      
      // Add 25 transactions and mark them as confirmed
      for (let i = 0; i < 25; i++) {
        const tx = { ...mockTransaction, hash: `0xhash${i}` };
        addTransaction(tx);
        updateTransaction(`0xhash${i}`, { status: 'confirmed' });
      }
      
      const state = useWeb3Store.getState();
      expect(state.recentTransactions).toHaveLength(20);
      // Should keep the most recent ones
      expect(state.recentTransactions[0].hash).toBe('0xhash24');
      expect(state.recentTransactions[19].hash).toBe('0xhash5');
    });

    it('should handle failed transactions', () => {
      const { addTransaction, updateTransaction } = useWeb3Store.getState();
      
      addTransaction(mockTransaction);
      updateTransaction(mockTransaction.hash, { status: 'failed' });
      
      const state = useWeb3Store.getState();
      expect(state.pendingTransactions).toHaveLength(0);
      expect(state.recentTransactions).toHaveLength(1);
      expect(state.recentTransactions[0].status).toBe('failed');
    });

    it('should handle vault-specific transaction types', () => {
      const { addTransaction } = useWeb3Store.getState();
      
      const vaultTransactions = [
        { ...mockTransaction, type: 'vault_deposit' as const },
        { ...mockTransaction, hash: '0xhash2', type: 'vault_withdraw' as const },
        { ...mockTransaction, hash: '0xhash3', type: 'approve' as const },
      ];
      
      vaultTransactions.forEach(tx => addTransaction(tx));
      
      const state = useWeb3Store.getState();
      expect(state.pendingTransactions).toHaveLength(3);
      expect(state.pendingTransactions.map(tx => tx.type)).toEqual([
        'vault_deposit',
        'vault_withdraw', 
        'approve'
      ]);
    });
  });

  describe('Balance Management', () => {
    it('should set native balance', () => {
      const { setNativeBalance } = useWeb3Store.getState();
      
      setNativeBalance('1.5');
      expect(useWeb3Store.getState().nativeBalance).toBe('1.5');
      
      setNativeBalance(null);
      expect(useWeb3Store.getState().nativeBalance).toBeNull();
    });

    it('should set token balances', () => {
      const { setTokenBalances } = useWeb3Store.getState();
      
      const balances = [
        {
          address: '0xtoken1',
          symbol: 'TOKEN1',
          decimals: 18,
          balance: '1000',
          balanceFormatted: '1.0',
          valueUsd: '100.00',
        },
        {
          address: '0xtoken2',
          symbol: 'TOKEN2',
          decimals: 6,
          balance: '500000',
          balanceFormatted: '0.5',
        },
      ];
      
      setTokenBalances(balances);
      expect(useWeb3Store.getState().tokenBalances).toEqual(balances);
    });

    it('should update individual token balance', () => {
      const { setTokenBalances, updateTokenBalance } = useWeb3Store.getState();
      
      const initialBalances = [
        {
          address: '0xtoken1',
          symbol: 'TOKEN1',
          decimals: 18,
          balance: '1000',
          balanceFormatted: '1.0',
        },
      ];
      
      setTokenBalances(initialBalances);
      updateTokenBalance('0xtoken1', '2000');
      
      const state = useWeb3Store.getState();
      expect(state.tokenBalances[0].balance).toBe('2000');
      expect(state.tokenBalances[0].balanceFormatted).toBe('2000');
    });
  });

  describe('Loading States', () => {
    it('should manage connection loading state', () => {
      const { setConnecting } = useWeb3Store.getState();
      
      setConnecting(true);
      expect(useWeb3Store.getState().isConnecting).toBe(true);
      
      setConnecting(false);
      expect(useWeb3Store.getState().isConnecting).toBe(false);
    });

    it('should manage balance loading state', () => {
      const { setBalanceLoading } = useWeb3Store.getState();
      
      setBalanceLoading(true);
      expect(useWeb3Store.getState().isBalanceLoading).toBe(true);
      
      setBalanceLoading(false);
      expect(useWeb3Store.getState().isBalanceLoading).toBe(false);
    });

    it('should manage transaction loading state', () => {
      const { setTransactionLoading } = useWeb3Store.getState();
      
      setTransactionLoading(true);
      expect(useWeb3Store.getState().isTransactionLoading).toBe(true);
      
      setTransactionLoading(false);
      expect(useWeb3Store.getState().isTransactionLoading).toBe(false);
    });
  });

  describe('Network Management', () => {
    it('should manage wrong network state', () => {
      const { setWrongNetwork } = useWeb3Store.getState();
      
      setWrongNetwork(true);
      expect(useWeb3Store.getState().isWrongNetwork).toBe(true);
      
      setWrongNetwork(false);
      expect(useWeb3Store.getState().isWrongNetwork).toBe(false);
    });

    it('should set supported chains', () => {
      const { setSupportedChains } = useWeb3Store.getState();
      
      const newChains = [1, 42161, 10];
      setSupportedChains(newChains);
      expect(useWeb3Store.getState().supportedChains).toEqual(newChains);
    });
  });

  describe('Reset Actions', () => {
    const mockTransaction: Omit<Transaction, 'timestamp'> = {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      type: 'vault_deposit',
      status: 'pending',
      amount: '1.0',
      token: 'ETH',
      chainId: 1,
    };

    it('should reset wallet state', () => {
      const { 
        setConnected, 
        setAddress, 
        setChainId, 
        addTransaction, 
        resetWalletState 
      } = useWeb3Store.getState();
      
      // Set some state
      setConnected(true);
      setAddress('0x1234567890123456789012345678901234567890');
      setChainId(1);
      addTransaction(mockTransaction);
      
      // Reset
      resetWalletState();
      
      const state = useWeb3Store.getState();
      expect(state.isConnected).toBe(false);
      expect(state.address).toBeNull();
      expect(state.chainId).toBeNull();
      expect(state.pendingTransactions).toEqual([]);
      expect(state.recentTransactions).toEqual([]);
    });

    it('should disconnect wallet', () => {
      const { 
        setConnected, 
        setAddress, 
        setChainId, 
        disconnect 
      } = useWeb3Store.getState();
      
      // Set connected state
      setConnected(true);
      setAddress('0x1234567890123456789012345678901234567890');
      setChainId(1);
      
      // Disconnect
      disconnect();
      
      const state = useWeb3Store.getState();
      expect(state.isConnected).toBe(false);
      expect(state.address).toBeNull();
      expect(state.chainId).toBeNull();
    });
  });

  describe('Vault Integration Scenarios', () => {
    it('should handle complete vault deposit transaction flow', () => {
      const { addTransaction, updateTransaction } = useWeb3Store.getState();
      
      // Step 1: Add approval transaction
      const approvalTx = {
        hash: '0xapproval123',
        type: 'approve' as const,
        status: 'pending' as const,
        amount: '1.0',
        token: 'ETH',
        chainId: 1,
      };
      
      addTransaction(approvalTx);
      
      // Step 2: Approval confirmed
      updateTransaction('0xapproval123', { status: 'confirmed' });
      
      // Step 3: Add deposit transaction
      const depositTx = {
        hash: '0xdeposit456',
        type: 'vault_deposit' as const,
        status: 'pending' as const,
        amount: '1.0',
        token: 'ETH',
        chainId: 1,
      };
      
      addTransaction(depositTx);
      
      // Step 4: Deposit confirmed
      updateTransaction('0xdeposit456', { 
        status: 'confirmed',
        gasUsed: '150000'
      });
      
      const state = useWeb3Store.getState();
      expect(state.pendingTransactions).toHaveLength(0);
      expect(state.recentTransactions).toHaveLength(2);
      expect(state.recentTransactions[0].type).toBe('vault_deposit');
      expect(state.recentTransactions[1].type).toBe('approve');
    });

    it('should handle vault withdrawal transaction', () => {
      const { addTransaction, updateTransaction } = useWeb3Store.getState();
      
      const withdrawTx = {
        hash: '0xwithdraw789',
        type: 'vault_withdraw' as const,
        status: 'pending' as const,
        amount: '0.5',
        token: 'Vault Shares',
        chainId: 1,
      };
      
      addTransaction(withdrawTx);
      updateTransaction('0xwithdraw789', { status: 'confirmed' });
      
      const state = useWeb3Store.getState();
      expect(state.recentTransactions[0].type).toBe('vault_withdraw');
      expect(state.recentTransactions[0].amount).toBe('0.5');
      expect(state.recentTransactions[0].token).toBe('Vault Shares');
    });

    it('should handle failed vault transactions', () => {
      const { addTransaction, updateTransaction } = useWeb3Store.getState();
      
      const failedTx = {
        hash: '0xfailed123',
        type: 'vault_deposit' as const,
        status: 'pending' as const,
        amount: '1.0',
        token: 'ETH',
        chainId: 1,
      };
      
      addTransaction(failedTx);
      updateTransaction('0xfailed123', { status: 'failed' });
      
      const state = useWeb3Store.getState();
      expect(state.pendingTransactions).toHaveLength(0);
      expect(state.recentTransactions[0].status).toBe('failed');
    });
  });
}); 