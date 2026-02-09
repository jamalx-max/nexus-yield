import React from 'react';
import { Transaction, TRANSACTION_TYPE_LABELS, REQUIRED_CONFIRMATIONS } from '../../lib/transactions';
import { TransactionStatusBadge } from './transaction-status-badge';
import { formatNumber, shortenAddress } from '../../lib/utils';
import { getEstimatedTimeRemaining } from '../../lib/transaction-tracker';

interface TransactionItemProps {
  transaction: Transaction;
  onViewDetails?: (tx: Transaction) => void;
  showChain?: boolean;
  compact?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onViewDetails,
  showChain = true,
  compact = false,
}) => {
  const typeLabel = TRANSACTION_TYPE_LABELS[transaction.type];
  const explorerUrl = transaction.chain === 'ethereum'
    ? `https://sepolia.etherscan.io/tx/${transaction.hash}`
    : `https://explorer.hiro.so/txid/${transaction.hash}?chain=testnet`;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{typeLabel}</p>
          <p className="text-xs text-gray-500">
            {formatTimestamp(transaction.timestamp)}
            {transaction.amount && ` • ${formatNumber(parseFloat(transaction.amount), 2)} ${transaction.token || 'USDC'}`}
          </p>
        </div>
        <TransactionStatusBadge 
          status={transaction.status}
          confirmations={transaction.confirmations}
          requiredConfirmations={transaction.chain === 'ethereum' ? REQUIRED_CONFIRMATIONS.ethereum : REQUIRED_CONFIRMATIONS.stacks}
        />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">{typeLabel}</h4>
            {showChain && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {transaction.chain === 'ethereum' ? 'ETH' : 'STX'}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{formatTimestamp(transaction.timestamp)}</p>
        </div>
        <TransactionStatusBadge 
          status={transaction.status}
          confirmations={transaction.confirmations}
          requiredConfirmations={transaction.chain === 'ethereum' ? REQUIRED_CONFIRMATIONS.ethereum : REQUIRED_CONFIRMATIONS.stacks}
        />
      </div>

      {transaction.amount && (
        <div className="mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Amount:</span>{' '}
            {formatNumber(parseFloat(transaction.amount), 6)} {transaction.token || 'USDC'}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span className="font-mono">
          {shortenAddress(transaction.hash, 6)}
        </span>
        {transaction.confirmations !== undefined && (
          <span>
            {getEstimatedTimeRemaining(transaction.chain, transaction.confirmations)}
          </span>
        )}
      </div>

      {transaction.error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {transaction.error}
        </div>
      )}

      <div className="flex gap-2">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          View on Explorer
        </a>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(transaction)}
            className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Details
          </button>
        )}
      </div>
    </div>
  );
};
