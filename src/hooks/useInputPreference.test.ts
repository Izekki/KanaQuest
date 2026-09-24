import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoredInputPreference,
  saveStoredInputPreference,
  INPUT_PREFERENCE_STORAGE_KEY,
} from './useInputPreference';

describe('useInputPreference storage helpers', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }

    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => {
        mockStorage[key] = val;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        for (const key of Object.keys(mockStorage)) {
          delete mockStorage[key];
        }
      },
    });
  });

  it('should default to "auto" if localStorage is empty', () => {
    const pref = getStoredInputPreference();
    expect(pref).toBe('auto');
  });

  it('should load initial preference from localStorage if valid ("always_input")', () => {
    mockStorage[INPUT_PREFERENCE_STORAGE_KEY] = 'always_input';
    expect(getStoredInputPreference()).toBe('always_input');
  });

  it('should load initial preference from localStorage if valid ("always_cards")', () => {
    mockStorage[INPUT_PREFERENCE_STORAGE_KEY] = 'always_cards';
    expect(getStoredInputPreference()).toBe('always_cards');
  });

  it('should fall back to "auto" if localStorage contains invalid value', () => {
    mockStorage[INPUT_PREFERENCE_STORAGE_KEY] = 'invalid_override_mode';
    expect(getStoredInputPreference()).toBe('auto');
  });

  it('should persist valid preference to localStorage using saveStoredInputPreference', () => {
    const ok = saveStoredInputPreference('always_cards');
    expect(ok).toBe(true);
    expect(mockStorage[INPUT_PREFERENCE_STORAGE_KEY]).toBe('always_cards');
    expect(getStoredInputPreference()).toBe('always_cards');

    const ok2 = saveStoredInputPreference('always_input');
    expect(ok2).toBe(true);
    expect(mockStorage[INPUT_PREFERENCE_STORAGE_KEY]).toBe('always_input');
    expect(getStoredInputPreference()).toBe('always_input');
  });

  it('should reject invalid values in saveStoredInputPreference', () => {
    // @ts-expect-error Testing invalid runtime value
    const ok = saveStoredInputPreference('foo_bar');
    expect(ok).toBe(false);
    expect(mockStorage[INPUT_PREFERENCE_STORAGE_KEY]).toBeUndefined();
  });
});
