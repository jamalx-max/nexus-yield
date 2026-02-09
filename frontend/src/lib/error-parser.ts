import { 
  ErrorCategory, 
  ErrorSeverity, 
  ERROR_MESSAGES, 
  type ParsedError 
} from './errors';

/**
 * Parses an error and categorizes it with helpful information
 */
export function parseError(error: any): ParsedError {
  if (!error) {
    return {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      recoverable: true,
    };
  }

  const errorMessage = (
    error?.shortMessage || 
    error?.message || 
    error?.reason || 
    error?.toString() || 
    ''
  ).toLowerCase();

  // Wallet errors
  if (
    errorMessage.includes('user rejected') || 
    errorMessage.includes('action rejected') || 
    errorMessage.includes('user denied') ||
    errorMessage.includes('user canceled')
  ) {
    return {
      category: ErrorCategory.WALLET,
      severity: ErrorSeverity.LOW,
      message: ERROR_MESSAGES.WALLET_REJECTED,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Please approve the transaction in your wallet to continue.',
    };
  }

  if (errorMessage.includes('connector not connected') || errorMessage.includes('wallet not connected')) {
    return {
      category: ErrorCategory.WALLET,
      severity: ErrorSeverity.HIGH,
      message: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Click the "Connect Wallet" button to get started.',
    };
  }

  if (errorMessage.includes('wallet locked')) {
    return {
      category: ErrorCategory.WALLET,
      severity: ErrorSeverity.MEDIUM,
      message: ERROR_MESSAGES.WALLET_LOCKED,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Please unlock your wallet and try again.',
    };
  }

  // Network errors
  if (
    errorMessage.includes('chain mismatch') || 
    errorMessage.includes('wrong network') ||
    errorMessage.includes('unsupported chain')
  ) {
    return {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      message: ERROR_MESSAGES.WRONG_NETWORK,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Please switch to Sepolia testnet in your wallet.',
    };
  }

  if (
    errorMessage.includes('network error') || 
    errorMessage.includes('fetch failed') ||
    errorMessage.includes('connection refused')
  ) {
    return {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Check your internet connection and try again.',
    };
  }

  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message: ERROR_MESSAGES.TIMEOUT_ERROR,
      originalError: error,
      recoverable: true,
      suggestedAction: 'The request took too long. Please try again.',
    };
  }

  // Transaction errors
  if (errorMessage.includes('insufficient funds') || errorMessage.includes('exceeds balance')) {
    return {
      category: ErrorCategory.TRANSACTION,
      severity: ErrorSeverity.HIGH,
      message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Please ensure you have enough funds and gas to complete the transaction.',
    };
  }

  if (errorMessage.includes('gas required exceeds allowance') || errorMessage.includes('out of gas')) {
    return {
      category: ErrorCategory.TRANSACTION,
      severity: ErrorSeverity.MEDIUM,
      message: ERROR_MESSAGES.INSUFFICIENT_GAS,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Try increasing the gas limit or reducing the transaction amount.',
    };
  }

  if (errorMessage.includes('nonce too low')) {
    return {
      category: ErrorCategory.TRANSACTION,
      severity: ErrorSeverity.MEDIUM,
      message: ERROR_MESSAGES.NONCE_TOO_LOW,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Please reset your wallet account or wait for pending transactions to complete.',
    };
  }

  if (errorMessage.includes('transaction reverted') || errorMessage.includes('execution reverted')) {
    return {
      category: ErrorCategory.TRANSACTION,
      severity: ErrorSeverity.HIGH,
      message: ERROR_MESSAGES.TRANSACTION_REVERTED,
      originalError: error,
      recoverable: true,
      suggestedAction: 'The smart contract rejected this transaction. Please verify the transaction details.',
    };
  }

  // Contract errors
  if (errorMessage.includes('allowance') || errorMessage.includes('approve')) {
    return {
      category: ErrorCategory.CONTRACT,
      severity: ErrorSeverity.MEDIUM,
      message: ERROR_MESSAGES.ALLOWANCE_ERROR,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Please approve the token spending first.',
    };
  }

  // Bridge errors
  if (errorMessage.includes('bridge') || errorMessage.includes('deposit')) {
    return {
      category: ErrorCategory.BRIDGE,
      severity: ErrorSeverity.HIGH,
      message: ERROR_MESSAGES.BRIDGE_DEPOSIT_FAILED,
      originalError: error,
      recoverable: true,
      suggestedAction: 'Please try the bridge operation again. If the issue persists, contact support.',
    };
  }

  // Default unknown error
  return {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    message: errorMessage.length > 120 
      ? `${errorMessage.slice(0, 120)}...` 
      : errorMessage || ERROR_MESSAGES.UNKNOWN_ERROR,
    originalError: error,
    recoverable: true,
    suggestedAction: 'Please try again. If the problem continues, contact support.',
  };
}

/**
 * Formats a parsed error for display to users
 */
export function formatErrorMessage(parsedError: ParsedError): string {
  return parsedError.message;
}

/**
 * Gets suggested action for a parsed error
 */
export function getErrorAction(parsedError: ParsedError): string | undefined {
  return parsedError.suggestedAction;
}

/**
 * Logs error to console in development mode
 */
export function logError(parsedError: ParsedError): void {
  if (import.meta.env.DEV) {
    console.error('[ApexYield Error]', {
      category: parsedError.category,
      severity: parsedError.severity,
      message: parsedError.message,
      originalError: parsedError.originalError,
      recoverable: parsedError.recoverable,
      suggestedAction: parsedError.suggestedAction,
    });
  }
}
