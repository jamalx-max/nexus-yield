import React, { useState } from 'react';
import { useTransactionTrackerContext } from '../../providers/TransactionTrackerProvider';
import { TransactionList } from './transaction-list';
import { cn } from '../../lib/utils';

interface PendingTransactionsIndicatorProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const PendingTransactionsIndicator: React.FC<PendingTransactionsIndicatorProps> = ({
  className,
  position = 'bottom-right',
}) => {
  const { transactions, getPendingCount, getRecentTransactions } = useTransactionTrackerContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const pendingCount = getPendingCount();

  if (pendingCount === 0 && !isExpanded) {
    return null;
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      {/* Indicator Button */}
      {!isExpanded && pendingCount > 0 && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium">{pendingCount} pending</span>
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">Transactions</h3>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Transaction List */}
          <div className="flex-1 overflow-y-auto p-4">
            <TransactionList
              transactions={getRecentTransactions(10)}
              showFilters={false}
              compact={true}
              emptyMessage="No recent transactions"
            />
          </div>

          {/* Footer */}
          {transactions.length > 10 && (
            <div className="border-t border-gray-200 p-3 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all transactions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
