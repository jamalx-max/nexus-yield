import React from 'react';
import { cn } from '../../lib/utils';
import { ErrorCategory, ErrorSeverity, type ParsedError } from '../../lib/errors';

export interface ErrorAlertProps {
  error?: ParsedError | string;
  className?: string;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  className,
  onDismiss,
  showDetails = false,
}) => {
  if (!error) return null;

  const parsedError = typeof error === 'string' 
    ? { message: error, category: ErrorCategory.UNKNOWN, severity: ErrorSeverity.MEDIUM, recoverable: true }
    : error;

  const getSeverityStyles = () => {
    switch (parsedError.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'bg-red-50 border-red-300 text-red-900';
      case ErrorSeverity.MEDIUM:
        return 'bg-orange-50 border-orange-300 text-orange-900';
      case ErrorSeverity.LOW:
        return 'bg-yellow-50 border-yellow-300 text-yellow-900';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-900';
    }
  };

  const getSeverityIcon = () => {
    const iconClass = parsedError.severity === ErrorSeverity.CRITICAL || parsedError.severity === ErrorSeverity.HIGH
      ? 'text-red-500'
      : parsedError.severity === ErrorSeverity.MEDIUM
      ? 'text-orange-500'
      : 'text-yellow-500';

    return (
      <svg className={cn('w-5 h-5', iconClass)} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className={cn('border rounded-lg p-4', getSeverityStyles(), className)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getSeverityIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{parsedError.message}</p>
          {parsedError.suggestedAction && (
            <p className="mt-2 text-sm opacity-90">
              <span className="font-semibold">Solution: </span>
              {parsedError.suggestedAction}
            </p>
          )}
          {showDetails && import.meta.env.DEV && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className="text-xs opacity-70">
                <span className="font-semibold">Category:</span> {parsedError.category}
              </p>
              <p className="text-xs opacity-70">
                <span className="font-semibold">Severity:</span> {parsedError.severity}
              </p>
              <p className="text-xs opacity-70">
                <span className="font-semibold">Recoverable:</span> {parsedError.recoverable ? 'Yes' : 'No'}
              </p>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-current/50 hover:text-current/80 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
