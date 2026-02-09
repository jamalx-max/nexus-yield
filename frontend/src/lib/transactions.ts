// Transaction status tracking types and constants

export enum TransactionType {
  APPROVE = 'APPROVE',
  BRIDGE_DEPOSIT = 'BRIDGE_DEPOSIT',
  BRIDGE_WITHDRAW = 'BRIDGE_WITHDRAW',
  VAULT_DEPOSIT = 'VAULT_DEPOSIT',
  VAULT_WITHDRAW = 'VAULT_WITHDRAW',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMING = 'CONFIRMING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  hash: string;
  chain: 'ethereum' | 'stacks';
  amount?: string;
  token?: string;
  from?: string;
  to?: string;
  timestamp: number;
  confirmations?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface BridgeTransaction extends Transaction {
  type: TransactionType.BRIDGE_DEPOSIT | TransactionType.BRIDGE_WITHDRAW;
  ethTxHash?: string;
  stacksTxId?: string;
  hookData?: string;
  attestationStatus?: 'pending' | 'attested' | 'failed';
  mintStatus?: 'pending' | 'minted' | 'failed';
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'Pending',
  [TransactionStatus.CONFIRMING]: 'Confirming',
  [TransactionStatus.CONFIRMED]: 'Confirmed',
  [TransactionStatus.FAILED]: 'Failed',
  [TransactionStatus.CANCELLED]: 'Cancelled',
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.APPROVE]: 'Token Approval',
  [TransactionType.BRIDGE_DEPOSIT]: 'Bridge Deposit',
  [TransactionType.BRIDGE_WITHDRAW]: 'Bridge Withdrawal',
  [TransactionType.VAULT_DEPOSIT]: 'Vault Deposit',
  [TransactionType.VAULT_WITHDRAW]: 'Vault Withdrawal',
};

export const REQUIRED_CONFIRMATIONS = {
  ethereum: 2,
  stacks: 1,
} as const;

export const POLLING_INTERVAL = 3000; // 3 seconds
export const MAX_POLLING_DURATION = 300000; // 5 minutes
