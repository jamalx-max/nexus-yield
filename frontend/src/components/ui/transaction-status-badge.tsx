import React from 'react';
import { cn } from '../../lib/utils';
import { TransactionStatus, TRANSACTION_STATUS_LABELS } from '../../lib/transactions';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  confirmations?: number;
  requiredConfirmations?: number;
  className?: string;
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({
  status,
  confirmations,
  requiredConfirmations,
  className,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border-green-200';
      case TransactionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TransactionStatus.CONFIRMING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case TransactionStatus.FAILED:
        return 'bg-red-100 text-red-800 border-red-200';
      case TransactionStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case TransactionStatus.PENDING:
      case TransactionStatus.CONFIRMING:
        return (
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      case TransactionStatus.FAILED:
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const label = TRANSACTION_STATUS_LABELS[status];
  const showConfirmations = status === TransactionStatus.CONFIRMING && 
    confirmations !== undefined && 
    requiredConfirmations !== undefined;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
        getStatusStyles(),
        className
      )}
    >
      {getStatusIcon()}
      <span>{label}</span>
      {showConfirmations && (
        <span className="font-normal opacity-75">
          ({confirmations}/{requiredConfirmations})
        </span>
      )}
    </span>
  );
};
