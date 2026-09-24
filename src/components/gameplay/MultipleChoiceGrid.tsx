import React, { useEffect } from 'react';
import Icon from '../ui/Icon';

export interface MultipleChoiceOption {
  id?: string;
  keyIndex?: number;
  label: string;
  isCorrect?: boolean;
  [key: string]: any;
}

export interface MultipleChoiceGridProps {
  options: MultipleChoiceOption[];
  selectedOption?: MultipleChoiceOption | null;
  feedback?: { tone: 'success' | 'error'; [key: string]: any } | null;
  onSelectOption: (option: any) => void;
  disabled?: boolean;
}


const containsJapaneseScript = (str = '') => /[\u3040-\u30ff\u3400-\u9fff]/.test(str);

/**
 * MultipleChoiceGrid Component
 * Renders 4 tactile cards with keyboard shortcuts (1, 2, 3, 4)
 * and rich feedback states for Modo Aprendizaje.
 */
export default function MultipleChoiceGrid({
  options = [],
  selectedOption = null,
  feedback = null,
  onSelectOption,
  disabled = false,
}: MultipleChoiceGridProps) {
  // Support numeric keyboard shortcuts 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || feedback !== null) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= options.length) {
        e.preventDefault();
        const targetOpt = options[keyNum - 1];
        if (targetOpt) {
          onSelectOption(targetOpt);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, disabled, feedback, onSelectOption]);

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {options.map((opt, idx) => {
          const isSelected = selectedOption?.id === opt.id || selectedOption?.label === opt.label;
          const isCorrect = opt.isCorrect;
          const hasFeedback = feedback !== null;
          const isJapanese = containsJapaneseScript(opt.label);

          let cardStyle =
            'border-2 border-[#eaded6] bg-white text-[rgb(var(--color-neutral))] shadow-2xs hover:border-[#6b2832]/60 hover:bg-[#fdf9f7] hover:shadow-xs active:scale-[0.98]';
          let badgeStyle =
            'border-[#eaded6] bg-[#f9f5f2] text-[#6b2832]/70 group-hover:border-[#6b2832]/40 group-hover:text-[#6b2832]';
          let iconIndicator: React.ReactNode = null;

          if (hasFeedback) {
            if (isSelected) {
              if (isCorrect) {
                cardStyle =
                  'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-300 shadow-sm';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                iconIndicator = <Icon name="check" className="w-4 h-4 text-emerald-600" aria-label="Correcto" />;
              } else {
                cardStyle =
                  'border-2 border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-300 shadow-sm animate-shake';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
                iconIndicator = <Icon name="xmark" className="w-4 h-4 text-rose-600" aria-label="Incorrecto" />;
              }
            } else if (isCorrect) {
              // Reveal the correct option if the user made a mistake
              cardStyle =
                'border-2 border-emerald-400 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-400';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              iconIndicator = (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Correcta
                </span>
              );
            } else {
              cardStyle = 'border-2 border-[#eae4df] bg-[#faf7f5] text-[rgb(var(--color-neutral))]/40 opacity-50';
              badgeStyle = 'border-transparent bg-black/5 text-[rgb(var(--color-neutral))]/40';
            }
          }

          return (
            <button
              key={opt.id || idx}
              type="button"
              disabled={disabled || hasFeedback}
              onClick={() => onSelectOption(opt)}
              className={[
                'group relative flex items-center justify-between min-h-[58px] sm:min-h-[64px] w-full px-4 sm:px-5 py-3 rounded-2xl text-left transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6b2832]',
                cardStyle,
                disabled || hasFeedback ? 'cursor-default' : '',
              ].join(' ')}
              aria-label={`Opción ${idx + 1}: ${opt.label}`}
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
                <span
                  className={[
                    'inline-flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-lg border text-xs font-bold shrink-0 transition-colors',
                    badgeStyle,
                  ].join(' ')}
                >
                  {idx + 1}
                </span>

                <span
                  className={`font-bold truncate leading-snug ${
                    isJapanese ? 'font-jp text-base sm:text-lg' : 'font-sans text-sm sm:text-base'
                  }`}
                >
                  {opt.label}
                </span>
              </div>

              {iconIndicator && <div className="shrink-0 pl-1">{iconIndicator}</div>}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] font-medium text-[rgb(var(--color-neutral))]/50 select-none">
        <Icon name="keyboard" className="w-3.5 h-3.5 opacity-60" aria-label="Atajo de teclado" />
        <span>Pulsa 1, 2, 3 o 4 en el teclado para responder</span>
      </div>
    </div>
  );
}
