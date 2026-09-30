import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoragePreferences,
  saveStoragePreferences,
  acceptAllPreferences,
  acceptEssentialPreferencesOnly,
  hasUserDecidedPreferences,
  isPreferenceAllowed,
  PREFERENCES_STORAGE_KEY,
} from './storagePreferences';

describe('storagePreferences utility', () => {
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

    vi.stubGlobal('window', {
      localStorage,
      dispatchEvent: vi.fn(),
      CustomEvent: class CustomEvent {
        type: string;
        detail: any;
        constructor(type: string, params?: { detail?: any }) {
          this.type = type;
          this.detail = params?.detail;
        }
      },
      navigator: {
        userAgent: 'Vitest/Test-Agent',
      },
      location: {
        origin: 'http://localhost:5173',
      },
    });
  });

  it('retorna configuración por defecto con solo esenciales cuando no se ha decidido', () => {
    const prefs = getStoragePreferences();
    expect(prefs.essential).toBe(true);
    expect(prefs.preferences).toBe(false);
    expect(prefs.analytics).toBe(false);
    expect(prefs.decided).toBe(false);
    expect(hasUserDecidedPreferences()).toBe(false);
  });

  it('permite aceptar todas las preferencias y lo persiste', () => {
    const result = acceptAllPreferences();
    expect(result.essential).toBe(true);
    expect(result.preferences).toBe(true);
    expect(result.analytics).toBe(true);
    expect(result.decided).toBe(true);

    expect(hasUserDecidedPreferences()).toBe(true);
    expect(isPreferenceAllowed('essential')).toBe(true);
    expect(isPreferenceAllowed('preferences')).toBe(true);
    expect(isPreferenceAllowed('analytics')).toBe(true);
  });

  it('permite aceptar solo las esenciales bloqueando preferencias y analítica', () => {
    const result = acceptEssentialPreferencesOnly();
    expect(result.essential).toBe(true);
    expect(result.preferences).toBe(false);
    expect(result.analytics).toBe(false);
    expect(result.decided).toBe(true);

    expect(hasUserDecidedPreferences()).toBe(true);
    expect(isPreferenceAllowed('essential')).toBe(true);
    expect(isPreferenceAllowed('preferences')).toBe(false);
    expect(isPreferenceAllowed('analytics')).toBe(false);
  });

  it('permite guardar configuración personalizada', () => {
    saveStoragePreferences({ preferences: true, analytics: false });

    const current = getStoragePreferences();
    expect(current.preferences).toBe(true);
    expect(current.analytics).toBe(false);
    expect(isPreferenceAllowed('preferences')).toBe(true);
    expect(isPreferenceAllowed('analytics')).toBe(false);
  });
});
