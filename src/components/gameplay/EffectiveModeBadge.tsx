import React from 'react';
import type { EffectiveInputModeResult } from '../../types/adaptiveDifficulty';

interface EffectiveModeBadgeProps {
  decision: EffectiveInputModeResult;
  className?: string;
}

/**
 * EffectiveModeBadge — Subtle contextual pill positioned above the kanji/word.
 * Communicates to the learner why this question is Cards vs Input,
 * highlighting the +50% XP reward on mastery challenges.
 */
export default function EffectiveModeBadge({
  decision,
  className = '',
}: EffectiveModeBadgeProps) {
  const { mode, reason, badgeText } = decision;

  // Determine harmonious color scheme based on mode and reason
  let badgeStyle = 'bg-[#faf6f3] text-[rgb(var(--color-neutral))]/80 border-[#eaded6]';
  let icon = '🎴';

  if (mode === 'input') {
    icon = '⚡';
    badgeStyle =
      reason === 'mastery'
        ? 'bg-amber-50/90 text-amber-900 border-amber-200/90 shadow-2xs'
        : 'bg-rose-50/90 text-rose-950 border-rose-200/80';
  } else if (reason === 'beginner') {
    icon = '🌱';
    badgeStyle = 'bg-emerald-50/80 text-emerald-900 border-emerald-200/70';
  } else if (reason === 'new_word') {
    icon = '🎴';
    badgeStyle = 'bg-stone-50 text-stone-700 border-stone-200/80';
  } else {
    icon = '🎴';
    badgeStyle = 'bg-[#faf6f3] text-[rgb(var(--color-neutral))]/70 border-[#eaded6]';
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-all duration-200 animate-fadeIn',
        badgeStyle,
        className,
      ].join(' ')}
    >
      <span aria-hidden="true" className="text-xs">
        {icon}
      </span>
      <span>{badgeText}</span>
    </div>
  );
}
