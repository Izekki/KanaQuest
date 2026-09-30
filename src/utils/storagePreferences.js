import { recordUserConsent, CURRENT_LEGAL_VERSION } from '../services/supabase/consent';

export const PREFERENCES_STORAGE_KEY = 'kq_storage_prefs_v1';
export const PREFERENCES_UPDATED_EVENT = 'kq:preferences-updated';
export const OPEN_PREFERENCES_EVENT = 'kq:open-preferences';

const DEFAULT_PREFERENCES = {
  essential: true,
  preferences: false,
  analytics: false,
  version: CURRENT_LEGAL_VERSION,
  decided: false,
  updatedAt: null,
};

/**
 * Obtiene el estado actual de preferencias desde localStorage
 */
export function getStoragePreferences() {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CURRENT_LEGAL_VERSION) {
      return { ...DEFAULT_PREFERENCES, version: CURRENT_LEGAL_VERSION, decided: false };
    }
    return { ...DEFAULT_PREFERENCES, ...parsed, essential: true };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Indica si el usuario ya tomó una decisión informada en el banner
 */
export function hasUserDecidedPreferences() {
  const current = getStoragePreferences();
  return Boolean(current.decided && current.version === CURRENT_LEGAL_VERSION);
}

/**
 * Guarda las preferencias seleccionadas
 */
export function saveStoragePreferences({ preferences = false, analytics = false }, userId = null) {
  if (typeof window === 'undefined') return;

  const nextState = {
    essential: true,
    preferences: Boolean(preferences),
    analytics: Boolean(analytics),
    version: CURRENT_LEGAL_VERSION,
    decided: true,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(nextState));
  } catch (err) {
    console.warn('No se pudo guardar la preferencia en localStorage:', err);
  }

  // Notificar reactivamente a la app
  window.dispatchEvent(new CustomEvent(PREFERENCES_UPDATED_EVENT, { detail: nextState }));

  // Registrar de forma auditable en Supabase
  const consentType = preferences && analytics
    ? 'cookies_all'
    : (!preferences && !analytics ? 'cookies_essential' : 'cookies_custom');

  recordUserConsent({
    userId,
    consentType,
    documentVersion: CURRENT_LEGAL_VERSION,
    accepted: true,
    metadata: {
      categories: {
        essential: true,
        preferences: Boolean(preferences),
        analytics: Boolean(analytics),
      },
    },
  }).catch(() => {});

  return nextState;
}

/**
 * Acepta todas las categorías
 */
export function acceptAllPreferences(userId = null) {
  return saveStoragePreferences({ preferences: true, analytics: true }, userId);
}

/**
 * Acepta únicamente las esenciales/técnicas
 */
export function acceptEssentialPreferencesOnly(userId = null) {
  return saveStoragePreferences({ preferences: false, analytics: false }, userId);
}

/**
 * Verifica si una categoría específica está autorizada
 */
export function isPreferenceAllowed(category) {
  if (category === 'essential') return true;
  const current = getStoragePreferences();
  if (!current.decided) return false;
  return Boolean(current[category]);
}

/**
 * Dispara el evento global para abrir el modal de personalización
 */
export function openComplianceSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
  }
}

// Aliases para máxima compatibilidad interna
export const getCookieConsent = getStoragePreferences;
export const hasUserDecidedCookies = hasUserDecidedPreferences;
export const saveCookieConsent = saveStoragePreferences;
export const acceptAllCookies = acceptAllPreferences;
export const acceptEssentialOnly = acceptEssentialPreferencesOnly;
export const isCategoryAllowed = isPreferenceAllowed;
export const openCookieSettings = openComplianceSettings;
export const COOKIE_CONSENT_EVENT = PREFERENCES_UPDATED_EVENT;
export const OPEN_COOKIE_SETTINGS_EVENT = OPEN_PREFERENCES_EVENT;
