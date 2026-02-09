// Error types and categories for ApexYield

export enum ErrorCategory {
  WALLET = 'WALLET',
  NETWORK = 'NETWORK',
  TRANSACTION = 'TRANSACTION',
  CONTRACT = 'CONTRACT',
  BRIDGE = 'BRIDGE',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ParsedError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  originalError?: any;
  recoverable: boolean;
  suggestedAction?: string;
}

export const ERROR_MESSAGES = {
  // Wallet errors
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  WALLET_DISCONNECTED: 'Your wallet has been disconnected. Please reconnect.',
  WALLET_REJECTED: 'Transaction was rejected. Please try again when ready.',
  WALLET_LOCKED: 'Your wallet appears to be locked. Please unlock it and try again.',
  
  // Network errors
  WRONG_NETWORK: 'You are on the wrong network. Please switch to the correct chain.',
  NETWORK_ERROR: 'Network connection error. Please check your internet and try again.',
  RPC_ERROR: 'Unable to communicate with blockchain. Please try again later.',
  
  // Transaction errors
  INSUFFICIENT_FUNDS: 'Insufficient funds to complete this transaction.',
  INSUFFICIENT_GAS: 'Insufficient gas to complete this transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please check details and try again.',
  TRANSACTION_REVERTED: 'Transaction was reverted by the contract.',
  NONCE_TOO_LOW: 'Transaction nonce is too low. Please reset your wallet or try again.',
  
  // Contract errors
  CONTRACT_ERROR: 'Smart contract error occurred.',
  ALLOWANCE_ERROR: 'Failed to set token allowance. Please try again.',
  INSUFFICIENT_ALLOWANCE: 'Insufficient token allowance. Please approve tokens first.',
  
  // Bridge errors
  BRIDGE_DEPOSIT_FAILED: 'Bridge deposit failed. Please try again.',
  BRIDGE_ATTESTATION_TIMEOUT: 'Bridge attestation timed out. Your funds are safe.',
  BRIDGE_MINT_FAILED: 'Bridge minting failed. Please contact support.',
  
  // Validation errors
  INVALID_AMOUNT: 'Please enter a valid amount.',
  AMOUNT_TOO_LOW: 'Amount is below the minimum required.',
  AMOUNT_TOO_HIGH: 'Amount exceeds your available balance.',
  INVALID_ADDRESS: 'Please enter a valid address.',
  
  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
} as const;
