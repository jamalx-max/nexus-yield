import React, { createContext, useContext } from 'react';
import { useTransactionTracker } from '../hooks/useTransactionTracker';
import type { Transaction } from '../lib/transactions';

interface TransactionTrackerContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => string;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  clearTransactions: () => void;
  trackTransaction: (tx: Transaction) => Promise<void>;
  getPendingCount: () => number;
  getRecentTransactions: (limit?: number) => Transaction[];
}

const TransactionTrackerContext = createContext<TransactionTrackerContextType | undefined>(undefined);

export function useTransactionTrackerContext() {
  const context = useContext(TransactionTrackerContext);
  if (!context) {
    throw new Error('useTransactionTrackerContext must be used within TransactionTrackerProvider');
  }
  return context;
}

export const TransactionTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tracker = useTransactionTracker();

  return (
    <TransactionTrackerContext.Provider value={tracker}>
      {children}
    </TransactionTrackerContext.Provider>
  );
};
