import { useState, useCallback, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../lib/transactions';
import {
  pollEthereumTransaction,
  pollStacksTransaction,
  getTransactionStatus,
} from '../lib/transaction-tracker';

interface UseTransactionTrackerReturn {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => string;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  clearTransactions: () => void;
  trackTransaction: (tx: Transaction) => Promise<void>;
  getPendingCount: () => number;
  getRecentTransactions: (limit?: number) => Transaction[];
}

/**
 * Hook for tracking and managing transactions
 */
export function useTransactionTracker(): UseTransactionTrackerReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const publicClient = usePublicClient();

  /**
   * Add a new transaction to track
   */
  const addTransaction = useCallback((
    tx: Omit<Transaction, 'id' | 'timestamp'>
  ): string => {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTx: Transaction = {
      ...tx,
      id,
      timestamp: Date.now(),
    };

    setTransactions(prev => [newTx, ...prev]);
    return id;
  }, []);

  /**
   * Update an existing transaction
   */
  const updateTransaction = useCallback((
    id: string,
    updates: Partial<Transaction>
  ) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...updates } : tx))
    );
  }, []);

  /**
   * Remove a transaction
   */
  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }, []);

  /**
   * Clear all transactions
   */
  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  /**
   * Track a transaction and update its status
   */
  const trackTransaction = useCallback(async (tx: Transaction) => {
    try {
      if (tx.chain === 'ethereum' && publicClient) {
        // Update to confirming status
        updateTransaction(tx.id, { status: TransactionStatus.CONFIRMING });

        // Poll for confirmation
        const result = await pollEthereumTransaction(
          tx.hash as `0x${string}`,
          publicClient,
          (confirmations) => {
            updateTransaction(tx.id, { 
              confirmations,
              status: TransactionStatus.CONFIRMING,
            });
          }
        );

        // Update final status
        updateTransaction(tx.id, {
          status: result.success 
            ? TransactionStatus.CONFIRMED 
            : TransactionStatus.FAILED,
          confirmations: result.confirmations,
        });
      } else if (tx.chain === 'stacks') {
        // Update to confirming status
        updateTransaction(tx.id, { status: TransactionStatus.CONFIRMING });

        // Poll for confirmation
        const result = await pollStacksTransaction(
          tx.hash,
          (status) => {
            updateTransaction(tx.id, { 
              status: status === 'pending' 
                ? TransactionStatus.PENDING 
                : TransactionStatus.CONFIRMING,
            });
          }
        );

        // Update final status
        updateTransaction(tx.id, {
          status: result.success 
            ? TransactionStatus.CONFIRMED 
            : TransactionStatus.FAILED,
        });
      }
    } catch (error: any) {
      console.error('Transaction tracking failed:', error);
      updateTransaction(tx.id, {
        status: TransactionStatus.FAILED,
        error: error.message,
      });
    }
  }, [publicClient, updateTransaction]);

  /**
   * Get count of pending transactions
   */
  const getPendingCount = useCallback(() => {
    return transactions.filter(
      tx => tx.status === TransactionStatus.PENDING || 
            tx.status === TransactionStatus.CONFIRMING
    ).length;
  }, [transactions]);

  /**
   * Get recent transactions
   */
  const getRecentTransactions = useCallback((limit: number = 10) => {
    return transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    clearTransactions,
    trackTransaction,
    getPendingCount,
    getRecentTransactions,
  };
}
