import { useEffect, useCallback } from 'react';
import {
  saveStacksWalletConnection,
  clearStacksWalletConnection,
  getStacksWalletConnection,
  isConnectionStale,
  validateWalletAddress,
} from '../lib/wallet-state';
import { getUserPreferences } from '../lib/preferences';

interface StacksWalletHookParams {
  address?: string;
  isConnected: boolean;
  connect?: () => Promise<void>;
  disconnect?: () => void;
}

/**
 * Hook to persist Stacks wallet connection state
 * Automatically saves and restores Stacks wallet connection across sessions
 */
export function useStacksWalletPersistence({
  address,
  isConnected,
  connect,
  disconnect,
}: StacksWalletHookParams) {
  /**
   * Save connection state when wallet connects
   */
  useEffect(() => {
    if (isConnected && address) {
      saveStacksWalletConnection(address);
    }
  }, [isConnected, address]);

  /**
   * Clear connection state when wallet disconnects
   */
  useEffect(() => {
    if (!isConnected) {
      clearStacksWalletConnection();
    }
  }, [isConnected]);

  /**
   * Attempt to restore previous connection on mount
   */
  useEffect(() => {
    const restoreConnection = async () => {
      // Don't restore if already connected or no connect function
      if (isConnected || !connect) return;

      // Check if auto-connect is enabled
      const { autoConnectWallet } = getUserPreferences();
      if (!autoConnectWallet) return;

      const savedState = getStacksWalletConnection();
      
      // Check if we have a valid saved connection
      if (!savedState.isConnected || !savedState.lastConnectedAddress) {
        return;
      }

      // Check if connection is stale
      if (isConnectionStale(savedState.connectionTimestamp)) {
        clearStacksWalletConnection();
        return;
      }

      // Try to reconnect
      try {
        await connect();
      } catch (error) {
        console.error('Failed to restore Stacks wallet connection:', error);
        clearStacksWalletConnection();
      }
    };

    // Small delay to ensure providers are ready
    const timer = setTimeout(restoreConnection, 150);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Validate that current address matches saved address
   */
  useEffect(() => {
    if (isConnected && address) {
      const savedState = getStacksWalletConnection();
      
      // If addresses don't match, update saved state
      if (!validateWalletAddress(address, savedState.lastConnectedAddress)) {
        saveStacksWalletConnection(address);
      }
    }
  }, [isConnected, address]);

  /**
   * Manually clear persisted connection
   */
  const clearPersistedConnection = useCallback(() => {
    clearStacksWalletConnection();
    if (disconnect) {
      disconnect();
    }
  }, [disconnect]);

  return {
    clearPersistedConnection,
  };
}
