// LocalStorage utility functions with type safety and error handling

export const STORAGE_KEYS = {
  WALLET_CONNECTED: 'apexYield_walletConnected',
  WALLET_TYPE: 'apexYield_walletType',
  STACKS_WALLET_CONNECTED: 'apexYield_stacksWalletConnected',
  LAST_CONNECTED_ADDRESS: 'apexYield_lastConnectedAddress',
  STACKS_LAST_CONNECTED_ADDRESS: 'apexYield_stacksLastConnectedAddress',
  CONNECTION_TIMESTAMP: 'apexYield_connectionTimestamp',
  USER_PREFERENCES: 'apexYield_userPreferences',
} as const;

/**
 * Safely get an item from localStorage
 */
export function getStorageItem<T = string>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    // Try to parse as JSON, fall back to string
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Safely set an item in localStorage
 */
export function setStorageItem<T = any>(key: string, value: T): boolean {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all ApexYield-related items from localStorage
 */
export function clearApexYieldStorage(): boolean {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing ApexYield localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__apexYield_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
