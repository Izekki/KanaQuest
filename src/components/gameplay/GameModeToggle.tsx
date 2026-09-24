import React from 'react';

export type GameModeType = 'recognize' | 'translate';

interface GameModeToggleProps {
  mode: GameModeType;
  onModeChange: (nextMode: GameModeType) => void;
  disabled?: boolean;
}

interface GameModeOption {
  id: GameModeType;
  label: string;
  icon: string;
  title: string;
}

const GAME_MODES: GameModeOption[] = [
  {
    id: 'recognize',
    label: 'Reconocer',
    icon: '👁️',
    title: 'Modo Reconocimiento: Identifica lecturas y significados a partir del kanji/vocabulario',
  },
  {
    id: 'translate',
    label: 'Traducir',
    icon: '🔄',
    title: 'Modo Traducción: Escribe o selecciona la palabra japonesa correspondiente al significado',
  },
];

/**
 * GameModeToggle — Cohesive segmented switch for Game Type (Reconocer vs Traducir).
 * Shares the exact visual design tokens, hover micro-animations, and accessible
 * keyboard navigation as InputModeToggle.
 */
export default function GameModeToggle({
  mode,
  onModeChange,
  disabled = false,
}: GameModeToggleProps) {
  return (
    <nav
      aria-label="Selector de tipo de ejercicio"
      className="inline-flex items-center p-0.5 bg-[#f5ebe6]/80 border border-[#eaded6] rounded-xl text-xs font-semibold shadow-2xs shrink-0"
    >
      <div role="radiogroup" aria-label="Tipo de ejercicio" className="flex items-center gap-0.5">
        {GAME_MODES.map((item) => {
          const isSelected = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onModeChange(item.id)}
              title={item.title}
              className={[
                'relative flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6b2832]',
                isSelected
                  ? 'bg-[#6b2832] text-white shadow-xs'
                  : 'text-[#6b2832]/70 hover:text-[#6b2832] hover:bg-[#fcefe8]/60',
                disabled ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              <span className="text-xs" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
