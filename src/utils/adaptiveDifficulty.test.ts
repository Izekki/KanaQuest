import { describe, it, expect } from 'vitest';
import { getEffectiveInputMode } from './adaptiveDifficulty';
import type { Word, WordProgress, UserProfile } from '../types/adaptiveDifficulty';

describe('getEffectiveInputMode — Sistema Adaptativo Híbrido de Dificultad', () => {
  const dummyWord: Word = {
    id: 'word-1',
    japanese: '水',
    translation: 'agua',
    item_type: 'kanji',
  };

  const beginnerProfile: UserProfile = {
    level: 2,
    xp: 150,
  };

  const advancedProfile: UserProfile = {
    level: 7,
    xp: 1200,
  };

  describe('Regla 1: Preferencia manual del usuario (Prevalencia absoluta)', () => {
    it('debe devolver "cards" con razón "manual" y multiplicador 1 cuando la preferencia es always_cards, incluso con perfil avanzado y dominio alto', () => {
      const highProgress: WordProgress = {
        correct_count: 5,
        mastery_score: 95,
        streak: 4,
      };

      const result = getEffectiveInputMode(
        dummyWord,
        highProgress,
        advancedProfile,
        'always_cards'
      );

      expect(result.mode).toBe('cards');
      expect(result.reason).toBe('manual');
      expect(result.badgeText).toBe('Modo Tarjetas forzado');
      expect(result.xpBonusMultiplier).toBe(1);
    });

    it('debe devolver "input" con razón "manual" y multiplicador 1.5 cuando la preferencia es always_input, incluso con usuario novel', () => {
      const result = getEffectiveInputMode(
        dummyWord,
        null,
        beginnerProfile,
        'always_input'
      );

      expect(result.mode).toBe('input');
      expect(result.reason).toBe('manual');
      expect(result.badgeText).toBe('Modo Maestro forzado (+50% XP)');
      expect(result.xpBonusMultiplier).toBe(1.5);
    });
  });

  describe('Regla 2: Modo automático para principiantes (level < 5 || xp < 500)', () => {
    it('debe devolver "cards" con razón "beginner" si level < 5 aunque xp >= 500', () => {
      const lowLevelProfile: UserProfile = { level: 3, xp: 800 };
      const result = getEffectiveInputMode(dummyWord, null, lowLevelProfile, 'auto');

      expect(result.mode).toBe('cards');
      expect(result.reason).toBe('beginner');
      expect(result.badgeText).toBe('Modo aprendizaje: Elige la opción correcta');
      expect(result.xpBonusMultiplier).toBe(1);
    });

    it('debe devolver "cards" con razón "beginner" si xp < 500 aunque level >= 5', () => {
      const lowXpProfile: UserProfile = { level: 6, xp: 350 };
      const result = getEffectiveInputMode(dummyWord, null, lowXpProfile, 'auto');

      expect(result.mode).toBe('cards');
      expect(result.reason).toBe('beginner');
      expect(result.xpBonusMultiplier).toBe(1);
    });

    it('debe devolver "cards" con razón "beginner" para usuarios invitados (sin perfil)', () => {
      const result = getEffectiveInputMode(dummyWord, null, null, 'auto');

      expect(result.mode).toBe('cards');
      expect(result.reason).toBe('beginner');
      expect(result.xpBonusMultiplier).toBe(1);
    });
  });

  describe('Regla 2: Modo automático para intermedios/avanzados (level >= 5 && xp >= 500)', () => {
    it('debe devolver "cards" con razón "new_word" si la palabra es nueva (!wordProgress)', () => {
      const result = getEffectiveInputMode(dummyWord, null, advancedProfile, 'auto');

      expect(result.mode).toBe('cards');
      expect(result.reason).toBe('new_word');
      expect(result.badgeText).toBe('Palabra en aprendizaje: Elige la opción correcta');
      expect(result.xpBonusMultiplier).toBe(1);
    });

    it('debe devolver "cards" con razón "new_word" si correct_count < 2', () => {
      const weakProgress: WordProgress = {
        correct_count: 1,
        mastery_score: 80,
      };

      const result = getEffectiveInputMode(dummyWord, weakProgress, advancedProfile, 'auto');

      expect(result.mode).toBe('cards');
      expect(result.reason).toBe('new_word');
      expect(result.xpBonusMultiplier).toBe(1);
    });

    it('debe devolver "cards" con razón "new_word" si mastery_score < 60', () => {
      const lowScoreProgress: WordProgress = {
        correct_count: 3,
        mastery_score: 45,
      };

      const result = getEffectiveInputMode(dummyWord, lowScoreProgress, advancedProfile, 'auto');

      expect(result.mode).toBe('cards');
      expect(result.reason).toBe('new_word');
      expect(result.xpBonusMultiplier).toBe(1);
    });

    it('debe devolver "input" con razón "mastery" y +50% XP si correct_count >= 2 y mastery_score >= 60', () => {
      const masteredProgress: WordProgress = {
        correct_count: 2,
        mastery_score: 70,
      };

      const result = getEffectiveInputMode(dummyWord, masteredProgress, advancedProfile, 'auto');

      expect(result.mode).toBe('input');
      expect(result.reason).toBe('mastery');
      expect(result.badgeText).toBe('Reto de Dominio: Escribe la respuesta (+50% XP)');
      expect(result.xpBonusMultiplier).toBe(1.5);
    });

    it('debe devolver "input" con razón "mastery" y +50% XP si streak >= 2', () => {
      const streakProgress: WordProgress = {
        correct_count: 1,
        streak: 2,
      };

      const result = getEffectiveInputMode(dummyWord, streakProgress, advancedProfile, 'auto');

      expect(result.mode).toBe('input');
      expect(result.reason).toBe('mastery');
      expect(result.xpBonusMultiplier).toBe(1.5);
    });

    it('debe mapear correctamente registros existentes de Supabase progress (attempts, mastery_level, correct)', () => {
      const supabaseProgress: WordProgress = {
        attempts: 4,
        correct: true,
        mastery_level: 4, // 4 * 20 = 80 score >= 60
      };

      const result = getEffectiveInputMode(dummyWord, supabaseProgress, advancedProfile, 'auto');

      expect(result.mode).toBe('input');
      expect(result.reason).toBe('mastery');
      expect(result.xpBonusMultiplier).toBe(1.5);
    });
  });
});
