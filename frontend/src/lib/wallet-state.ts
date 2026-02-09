import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from './storage';

export interface WalletConnectionState {
  isConnected: boolean;
  walletType?: 'metamask' | 'walletconnect' | 'coinbase' | 'other';
  lastConnectedAddress?: string;
  connectionTimestamp?: number;
}

export interface StacksWalletConnectionState {
  isConnected: boolean;
  lastConnectedAddress?: string;
  connectionTimestamp?: number;
}

/**
 * Save Ethereum wallet connection state
 */
export function saveWalletConnection(address: string, walletType?: string): void {
  setStorageItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');
  setStorageItem(STORAGE_KEYS.LAST_CONNECTED_ADDRESS, address);
  setStorageItem(STORAGE_KEYS.CONNECTION_TIMESTAMP, Date.now());
  
  if (walletType) {
    setStorageItem(STORAGE_KEYS.WALLET_TYPE, walletType);
  }
}

/**
 * Save Stacks wallet connection state
 */
export function saveStacksWalletConnection(address: string): void {
  setStorageItem(STORAGE_KEYS.STACKS_WALLET_CONNECTED, 'true');
  setStorageItem(STORAGE_KEYS.STACKS_LAST_CONNECTED_ADDRESS, address);
  setStorageItem(STORAGE_KEYS.CONNECTION_TIMESTAMP, Date.now());
}

/**
 * Get Ethereum wallet connection state
 */
export function getWalletConnection(): WalletConnectionState {
  const isConnected = getStorageItem(STORAGE_KEYS.WALLET_CONNECTED) === 'true';
  const lastConnectedAddress = getStorageItem(STORAGE_KEYS.LAST_CONNECTED_ADDRESS);
  const walletType = getStorageItem(STORAGE_KEYS.WALLET_TYPE);
  const connectionTimestamp = getStorageItem<number>(STORAGE_KEYS.CONNECTION_TIMESTAMP);

  return {
    isConnected,
    lastConnectedAddress: lastConnectedAddress || undefined,
    walletType: walletType as WalletConnectionState['walletType'] || undefined,
    connectionTimestamp: connectionTimestamp || undefined,
  };
}

/**
 * Get Stacks wallet connection state
 */
export function getStacksWalletConnection(): StacksWalletConnectionState {
  const isConnected = getStorageItem(STORAGE_KEYS.STACKS_WALLET_CONNECTED) === 'true';
  const lastConnectedAddress = getStorageItem(STORAGE_KEYS.STACKS_LAST_CONNECTED_ADDRESS);
  const connectionTimestamp = getStorageItem<number>(STORAGE_KEYS.CONNECTION_TIMESTAMP);

  return {
    isConnected,
    lastConnectedAddress: lastConnectedAddress || undefined,
    connectionTimestamp: connectionTimestamp || undefined,
  };
}

/**
 * Clear Ethereum wallet connection state
 */
export function clearWalletConnection(): void {
  removeStorageItem(STORAGE_KEYS.WALLET_CONNECTED);
  removeStorageItem(STORAGE_KEYS.LAST_CONNECTED_ADDRESS);
  removeStorageItem(STORAGE_KEYS.WALLET_TYPE);
  removeStorageItem(STORAGE_KEYS.CONNECTION_TIMESTAMP);
}

/**
 * Clear Stacks wallet connection state
 */
export function clearStacksWalletConnection(): void {
  removeStorageItem(STORAGE_KEYS.STACKS_WALLET_CONNECTED);
  removeStorageItem(STORAGE_KEYS.STACKS_LAST_CONNECTED_ADDRESS);
}

/**
 * Check if connection is stale (older than 7 days)
 */
export function isConnectionStale(timestamp?: number): boolean {
  if (!timestamp) return true;
  
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return (now - timestamp) > SEVEN_DAYS;
}

/**
 * Validate saved wallet address matches current address
 */
export function validateWalletAddress(currentAddress?: string, savedAddress?: string): boolean {
  if (!currentAddress || !savedAddress) return false;
  return currentAddress.toLowerCase() === savedAddress.toLowerCase();
}
