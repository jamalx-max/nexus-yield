import { useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  saveWalletConnection,
  clearWalletConnection,
  getWalletConnection,
  isConnectionStale,
  validateWalletAddress,
} from '../lib/wallet-state';
import { getUserPreferences } from '../lib/preferences';

/**
 * Hook to persist Ethereum wallet connection state
 * Automatically saves and restores wallet connection across sessions
 */
export function useWalletPersistence() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  /**
   * Save connection state when wallet connects
   */
  useEffect(() => {
    if (isConnected && address) {
      const walletType = connector?.name?.toLowerCase();
      saveWalletConnection(address, walletType);
    }
  }, [isConnected, address, connector]);

  /**
   * Clear connection state when wallet disconnects
   */
  useEffect(() => {
    if (!isConnected) {
      clearWalletConnection();
    }
  }, [isConnected]);

  /**
   * Attempt to restore previous connection on mount
   */
  useEffect(() => {
    const restoreConnection = async () => {
      // Don't restore if already connected
      if (isConnected) return;

      // Check if auto-connect is enabled
      const { autoConnectWallet } = getUserPreferences();
      if (!autoConnectWallet) return;

      const savedState = getWalletConnection();
      
      // Check if we have a valid saved connection
      if (!savedState.isConnected || !savedState.lastConnectedAddress) {
        return;
      }

      // Check if connection is stale
      if (isConnectionStale(savedState.connectionTimestamp)) {
        clearWalletConnection();
        return;
      }

      // Try to reconnect with the saved connector
      try {
        const targetConnector = connectors.find(c => 
          c.name?.toLowerCase() === savedState.walletType
        ) || connectors[0]; // Fallback to first connector

        if (targetConnector) {
          await connect({ connector: targetConnector });
        }
      } catch (error) {
        console.error('Failed to restore wallet connection:', error);
        clearWalletConnection();
      }
    };

    // Small delay to ensure providers are ready
    const timer = setTimeout(restoreConnection, 100);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Validate that current address matches saved address
   */
  useEffect(() => {
    if (isConnected && address) {
      const savedState = getWalletConnection();
      
      // If addresses don't match, update saved state
      if (!validateWalletAddress(address, savedState.lastConnectedAddress)) {
        saveWalletConnection(address, connector?.name?.toLowerCase());
      }
    }
  }, [isConnected, address, connector]);

  /**
   * Manually clear persisted connection
   */
  const clearPersistedConnection = useCallback(() => {
    clearWalletConnection();
    disconnect();
  }, [disconnect]);

  return {
    clearPersistedConnection,
  };
}
