import type {
  Word,
  WordProgress,
  UserProfile,
  UserOverridePreference,
  EffectiveInputModeResult,
} from '../types/adaptiveDifficulty';

/**
 * Pure function that determines the effective input mode ('cards' vs 'input')
 * for a specific question, balancing pedagogical safety for beginners with
 * mastery challenges (+50% XP) for consolidated items.
 *
 * @param word                   - The word/kanji row being tested.
 * @param wordProgress           - User learning record for this specific word (if any).
 * @param userProfile            - Global player profile (level, xp).
 * @param userOverridePreference - 'auto' | 'always_cards' | 'always_input'.
 * @returns EffectiveInputModeResult containing mode, reason, badgeText, and xpBonusMultiplier.
 */
export function getEffectiveInputMode(
  word: Word,
  wordProgress: WordProgress | null | undefined,
  userProfile: UserProfile | null | undefined,
  userOverridePreference: UserOverridePreference
): EffectiveInputModeResult {
  // ─── Regla 1: Preferencia manual del usuario ─────────────────────────────
  if (userOverridePreference === 'always_cards') {
    return {
      mode: 'cards',
      reason: 'manual',
      badgeText: 'Modo Tarjetas forzado',
      xpBonusMultiplier: 1,
    };
  }

  if (userOverridePreference === 'always_input') {
    return {
      mode: 'input',
      reason: 'manual',
      badgeText: 'Modo Maestro forzado (+50% XP)',
      xpBonusMultiplier: 1.5,
    };
  }

  // ─── Regla 2: Modo automático / inteligente ('auto') ─────────────────────
  const level = userProfile?.level ?? 1;
  const xp = userProfile?.xp ?? userProfile?.experience ?? 0;

  // 1. Principiante absoluto: level < 5 o xp < 500
  if (level < 5 || xp < 500) {
    return {
      mode: 'cards',
      reason: 'beginner',
      badgeText: 'Modo aprendizaje: Elige la opción correcta',
      xpBonusMultiplier: 1,
    };
  }

  // 2. Intermedio o avanzado: level >= 5 y xp >= 500
  // Extraer métricas normalizadas soportando campos directos y del esquema Supabase
  const correctCount =
    wordProgress?.correct_count ??
    (typeof wordProgress?.attempts === 'number' && wordProgress?.correct
      ? wordProgress.attempts
      : 0);

  const masteryScore =
    wordProgress?.mastery_score ??
    (typeof wordProgress?.mastery_level === 'number'
      ? wordProgress.mastery_level * 20
      : undefined);

  const streak =
    wordProgress?.streak ??
    (wordProgress?.correct ? 2 : 0);

  // a. Palabra en consolidación o dominada:
  // Condición: (correct_count >= 2 y (mastery_score ?? 100) >= 60) o streak >= 2
  const isMastered =
    Boolean(wordProgress) &&
    (((correctCount >= 2) && ((masteryScore ?? 100) >= 60)) || streak >= 2);

  if (isMastered) {
    return {
      mode: 'input',
      reason: 'mastery',
      badgeText: 'Reto de Dominio: Escribe la respuesta (+50% XP)',
      xpBonusMultiplier: 1.5,
    };
  }

  // b. Palabra nueva o poco dominada, o caso por defecto conservador:
  // Condición: !wordProgress o correct_count < 2 o mastery_score < 60
  return {
    mode: 'cards',
    reason: 'new_word',
    badgeText: 'Palabra en aprendizaje: Elige la opción correcta',
    xpBonusMultiplier: 1,
  };
}
