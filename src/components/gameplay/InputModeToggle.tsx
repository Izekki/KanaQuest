import React from 'react';
import type { UserOverridePreference } from '../../types/adaptiveDifficulty';

interface InputModeToggleProps {
  preference: UserOverridePreference;
  onPreferenceChange: (next: UserOverridePreference) => void;
  disabled?: boolean;
}

interface OptionConfig {
  id: UserOverridePreference;
  label: string;
  icon: string;
  title: string;
  badge?: string;
}

const OPTIONS: OptionConfig[] = [
  {
    id: 'auto',
    label: 'Auto',
    icon: '🧠',
    title: 'Modo Auto: Adaptativo inteligente según tu dominio de cada palabra',
  },
  {
    id: 'always_cards',
    label: 'Tarjetas',
    icon: '🎴',
    title: 'Modo Tarjetas: Selección múltiple con 4 opciones',
  },
  {
    id: 'always_input',
    label: 'Maestro',
    icon: '⚡',
    title: 'Modo Maestro: Entrada de texto abierta con bono de +50% XP',
    badge: '+50%',
  },
];

/**
 * InputModeToggle — Discrete 3-way segmented switch for response style.
 * Allows switching between Auto (adaptive), Tarjetas (cards), and Maestro (input).
 * Shares identical styling and animations with GameModeToggle.
 */
export default function InputModeToggle({
  preference,
  onPreferenceChange,
  disabled = false,
}: InputModeToggleProps) {
  return (
    <nav
      aria-label="Selector de estilo de respuesta"
      className="inline-flex items-center p-0.5 bg-[#f5ebe6]/80 border border-[#eaded6] rounded-xl text-xs font-semibold shadow-2xs shrink-0"
    >
      <div role="radiogroup" aria-label="Estilo de respuesta" className="flex items-center gap-0.5">
        {OPTIONS.map((opt) => {
          const isSelected = preference === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onPreferenceChange(opt.id)}
              title={opt.title}
              className={[
                'relative flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6b2832]',
                isSelected
                  ? 'bg-[#6b2832] text-white shadow-xs'
                  : 'text-[#6b2832]/70 hover:text-[#6b2832] hover:bg-[#fcefe8]/60',
                disabled ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              <span className="text-xs" aria-hidden="true">
                {opt.icon}
              </span>
              <span>{opt.label}</span>
              {opt.badge && (
                <span
                  className={[
                    'text-[9px] font-mono px-1 py-0.2 rounded-full font-extrabold tracking-tight',
                    isSelected
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-amber-100 text-amber-800',
                  ].join(' ')}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
