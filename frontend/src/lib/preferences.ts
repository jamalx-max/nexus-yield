import { STORAGE_KEYS, getStorageItem, setStorageItem } from './storage';

export interface UserPreferences {
  autoConnectWallet: boolean;
  showBalancesInUSD: boolean;
  defaultSlippage: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  autoConnectWallet: true,
  showBalancesInUSD: true,
  defaultSlippage: 0.5,
  notificationsEnabled: true,
  theme: 'dark',
};

/**
 * Get user preferences from storage
 */
export function getUserPreferences(): UserPreferences {
  const saved = getStorageItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
  return { ...DEFAULT_PREFERENCES, ...saved };
}

/**
 * Save user preferences to storage
 */
export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  const current = getUserPreferences();
  const updated = { ...current, ...preferences };
  setStorageItem(STORAGE_KEYS.USER_PREFERENCES, updated);
}

/**
 * Update a single preference
 */
export function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  const current = getUserPreferences();
  current[key] = value;
  setStorageItem(STORAGE_KEYS.USER_PREFERENCES, current);
}

/**
 * Reset preferences to defaults
 */
export function resetPreferences(): void {
  setStorageItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES);
}
