import { useState, useCallback, useEffect } from 'react';
import {
  getUserPreferences,
  saveUserPreferences,
  updatePreference as updatePreferenceStorage,
  resetPreferences as resetPreferencesStorage,
  type UserPreferences,
} from '../lib/preferences';

/**
 * Hook to manage user preferences with React state
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => getUserPreferences());

  /**
   * Update multiple preferences at once
   */
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...updates };
      saveUserPreferences(updated);
      return updated;
    });
  }, []);

  /**
   * Update a single preference
   */
  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      updatePreferenceStorage(key, value);
      return updated;
    });
  }, []);

  /**
   * Reset all preferences to defaults
   */
  const resetPreferences = useCallback(() => {
    resetPreferencesStorage();
    setPreferences(getUserPreferences());
  }, []);

  /**
   * Sync with storage on mount (in case another tab updated)
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'apexYield_userPreferences') {
        setPreferences(getUserPreferences());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    preferences,
    updatePreferences,
    updatePreference,
    resetPreferences,
  };
}
