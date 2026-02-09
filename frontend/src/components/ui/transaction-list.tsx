import React, { useState } from 'react';
import { Transaction, TransactionStatus, TransactionType } from '../../lib/transactions';
import { TransactionItem } from './transaction-item';

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails?: (tx: Transaction) => void;
  showFilters?: boolean;
  maxItems?: number;
  compact?: boolean;
  emptyMessage?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onViewDetails,
  showFilters = true,
  maxItems,
  compact = false,
  emptyMessage = 'No transactions yet',
}) => {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');

  const filteredTransactions = transactions
    .filter(tx => statusFilter === 'all' || tx.status === statusFilter)
    .filter(tx => typeFilter === 'all' || tx.type === typeFilter)
    .slice(0, maxItems);

  const getStatusFilterOptions = () => [
    { value: 'all', label: 'All Status' },
    { value: TransactionStatus.PENDING, label: 'Pending' },
    { value: TransactionStatus.CONFIRMING, label: 'Confirming' },
    { value: TransactionStatus.CONFIRMED, label: 'Confirmed' },
    { value: TransactionStatus.FAILED, label: 'Failed' },
  ];

  const getTypeFilterOptions = () => [
    { value: 'all', label: 'All Types' },
    { value: TransactionType.APPROVE, label: 'Approvals' },
    { value: TransactionType.BRIDGE_DEPOSIT, label: 'Bridge Deposits' },
    { value: TransactionType.BRIDGE_WITHDRAW, label: 'Withdrawals' },
    { value: TransactionType.VAULT_DEPOSIT, label: 'Vault Deposits' },
    { value: TransactionType.VAULT_WITHDRAW, label: 'Vault Withdrawals' },
  ];

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getStatusFilterOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="type-filter" className="sr-only">Filter by type</label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getTypeFilterOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No transactions match the selected filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onViewDetails={onViewDetails}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
};
