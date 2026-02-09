import type { PublicClient } from 'viem';
import {
  Transaction,
  TransactionStatus,
  REQUIRED_CONFIRMATIONS,
  POLLING_INTERVAL,
  MAX_POLLING_DURATION,
} from './transactions';

/**
 * Poll for transaction confirmation on Ethereum
 */
export async function pollEthereumTransaction(
  hash: `0x${string}`,
  publicClient: PublicClient,
  onUpdate?: (confirmations: number) => void
): Promise<{ success: boolean; confirmations: number }> {
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLLING_DURATION) {
    try {
      const receipt = await publicClient.getTransactionReceipt({ hash });

      if (receipt) {
        const currentBlock = await publicClient.getBlockNumber();
        const confirmations = Number(currentBlock - receipt.blockNumber) + 1;

        if (onUpdate) {
          onUpdate(confirmations);
        }

        if (confirmations >= REQUIRED_CONFIRMATIONS.ethereum) {
          return {
            success: receipt.status === 'success',
            confirmations,
          };
        }
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    } catch (error) {
      console.error('Error polling transaction:', error);
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    }
  }

  throw new Error('Transaction confirmation timeout');
}

/**
 * Poll for transaction confirmation on Stacks
 */
export async function pollStacksTransaction(
  txId: string,
  onUpdate?: (status: string) => void
): Promise<{ success: boolean; status: string }> {
  const startTime = Date.now();
  const STACKS_API = 'https://api.testnet.hiro.so';

  while (Date.now() - startTime < MAX_POLLING_DURATION) {
    try {
      const response = await fetch(`${STACKS_API}/extended/v1/tx/${txId}`);
      const data = await response.json();

      if (onUpdate) {
        onUpdate(data.tx_status);
      }

      if (data.tx_status === 'success') {
        return { success: true, status: data.tx_status };
      }

      if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        return { success: false, status: data.tx_status };
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    } catch (error) {
      console.error('Error polling Stacks transaction:', error);
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    }
  }

  throw new Error('Stacks transaction confirmation timeout');
}

/**
 * Get transaction status from hash
 */
export async function getTransactionStatus(
  tx: Transaction,
  publicClient?: PublicClient
): Promise<TransactionStatus> {
  try {
    if (tx.chain === 'ethereum' && publicClient) {
      const receipt = await publicClient.getTransactionReceipt({ 
        hash: tx.hash as `0x${string}` 
      });

      if (!receipt) {
        return TransactionStatus.PENDING;
      }

      const currentBlock = await publicClient.getBlockNumber();
      const confirmations = Number(currentBlock - receipt.blockNumber) + 1;

      if (confirmations < REQUIRED_CONFIRMATIONS.ethereum) {
        return TransactionStatus.CONFIRMING;
      }

      return receipt.status === 'success' 
        ? TransactionStatus.CONFIRMED 
        : TransactionStatus.FAILED;
    }

    if (tx.chain === 'stacks') {
      const STACKS_API = 'https://api.testnet.hiro.so';
      const response = await fetch(`${STACKS_API}/extended/v1/tx/${tx.hash}`);
      const data = await response.json();

      if (data.tx_status === 'pending') {
        return TransactionStatus.PENDING;
      }

      if (data.tx_status === 'success') {
        return TransactionStatus.CONFIRMED;
      }

      if (data.tx_status.includes('abort')) {
        return TransactionStatus.FAILED;
      }

      return TransactionStatus.CONFIRMING;
    }

    return TransactionStatus.PENDING;
  } catch (error) {
    console.error('Error getting transaction status:', error);
    return TransactionStatus.PENDING;
  }
}

/**
 * Format time remaining for transaction
 */
export function getEstimatedTimeRemaining(
  chain: 'ethereum' | 'stacks',
  confirmations: number = 0
): string {
  if (chain === 'ethereum') {
    const remaining = REQUIRED_CONFIRMATIONS.ethereum - confirmations;
    if (remaining <= 0) return 'Confirmed';
    return `~${remaining * 12} seconds`;
  }

  if (chain === 'stacks') {
    return '~10 minutes';
  }

  return 'Unknown';
}
