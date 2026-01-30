/**
 * Transaction History Management
 * Uses LocalStorage to persist bridge transactions across sessions.
 */

export interface BridgeTransaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
}

const STORAGE_KEY = 'apex_bridge_history';

export function saveTransaction(tx: BridgeTransaction) {
  const current = getTransactions();
  const updated = [tx, ...current].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getTransactions(): BridgeTransaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse transaction history', e);
    return [];
  }
}

export function updateTransactionStatus(id: string, status: BridgeTransaction['status']) {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
}
