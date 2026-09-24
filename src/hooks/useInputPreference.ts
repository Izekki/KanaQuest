import { useState, useCallback } from 'react';
import type { UserOverridePreference } from '../types/adaptiveDifficulty';

export const INPUT_PREFERENCE_STORAGE_KEY = 'kanaquest_input_preference';

export const VALID_PREFERENCES: readonly UserOverridePreference[] = [
  'auto',
  'always_cards',
  'always_input',
];

/**
 * Pure function to read the stored preference from localStorage.
 * Returns 'auto' if not set or invalid.
 */
export function getStoredInputPreference(): UserOverridePreference {
  try {
    if (typeof localStorage === 'undefined') {
      return 'auto';
    }
    const stored = localStorage.getItem(
      INPUT_PREFERENCE_STORAGE_KEY
    ) as UserOverridePreference | null;
    if (stored && VALID_PREFERENCES.includes(stored)) {
      return stored;
    }
  } catch (e) {
    console.debug('Error reading input preference from localStorage:', e);
  }
  return 'auto';
}

/**
 * Pure function to persist the preference to localStorage.
 */
export function saveStoredInputPreference(nextPref: UserOverridePreference): boolean {
  if (!VALID_PREFERENCES.includes(nextPref)) return false;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(INPUT_PREFERENCE_STORAGE_KEY, nextPref);
      return true;
    }
  } catch (e) {
    console.debug('Error saving input preference to localStorage:', e);
  }
  return false;
}

export type UseInputPreferenceReturn = [
  UserOverridePreference,
  (next: UserOverridePreference) => void
] & {
  preference: UserOverridePreference;
  setPreference: (next: UserOverridePreference) => void;
};

/**
 * Custom hook to manage the user's difficulty/input override preference.
 * Persists value to localStorage under key 'kanaquest_input_preference'.
 * Defaults to 'auto' if no valid value is stored.
 *
 * Supports both tuple destructuring: `const [preference, setPreference] = useInputPreference()`
 * and object destructuring: `const { preference, setPreference } = useInputPreference()`
 */
export function useInputPreference(): UseInputPreferenceReturn {
  const [preference, setPreferenceState] = useState<UserOverridePreference>(() => {
    return getStoredInputPreference();
  });

  const setPreference = useCallback((nextPref: UserOverridePreference) => {
    if (!VALID_PREFERENCES.includes(nextPref)) return;
    setPreferenceState(nextPref);
    saveStoredInputPreference(nextPref);
  }, []);

  const result = [preference, setPreference] as unknown as UseInputPreferenceReturn;
  result.preference = preference;
  result.setPreference = setPreference;

  return result;
}
