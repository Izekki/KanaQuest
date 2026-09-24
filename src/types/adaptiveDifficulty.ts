/**
 * adaptiveDifficulty.ts
 * Type definitions for KanaQuest's Hybrid Adaptive Difficulty System.
 */

export type InputMode = 'cards' | 'input';

export type UserOverridePreference = 'auto' | 'always_cards' | 'always_input';

export type InputModeReason = 'manual' | 'beginner' | 'new_word' | 'mastery';

export interface UserProfile {
  level?: number;
  xp?: number;
  experience?: number;
  username?: string;
  [key: string]: unknown;
}

export interface WordProgress {
  correct_count?: number;
  mastery_score?: number;
  mastery_level?: number;
  streak?: number;
  attempts?: number;
  correct?: boolean;
  mode?: string;
  last_attempt?: string;
  [key: string]: unknown;
}

export interface Word {
  id: string;
  japanese?: string;
  kanji?: string;
  hiragana?: string;
  katakana?: string;
  romaji?: string;
  translation?: string;
  item_type?: string;
  level?: number;
  difficulty?: string;
  [key: string]: unknown;
}

export interface EffectiveInputModeResult {
  mode: InputMode;
  reason: InputModeReason;
  badgeText: string;
  xpBonusMultiplier: number; // 1.0 or 1.5
}
