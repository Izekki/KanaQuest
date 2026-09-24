import React, { forwardRef } from 'react';
import Icon from '../ui/Icon';

export interface OpenAnswerInputProps {
  answer?: string;
  onAnswerChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onNext: () => void;
  feedback?: {
    tone: 'success' | 'error';
    message?: string;
    hintUsed?: boolean;
  } | null;
  exercise?: {
    prompt?: string;
    hiragana?: string;
    katakana?: string;
    romaji?: string;
    translation?: string;
    japanese?: string;
    solutionDisplay?: string;
    kanjiFeedback?: string | null;
    placeholder?: string;
    gameMode?: string;
    expectedAnswers?: string[];
    answers?: string[];
    [key: string]: unknown;
  } | null;
  difficultyMode?: 'apprentice' | 'master';
  isLastQuestion?: boolean;
  onSpeak?: () => void;
  xpAwarded?: number;
}

/**
 * OpenAnswerInput — Master Mode open text input component.
 * Features auto-focus, responsive feedback banners, and verify/next buttons.
 */
const OpenAnswerInput = forwardRef<HTMLInputElement, OpenAnswerInputProps>(
  function OpenAnswerInput(
    {
      answer = '',
      onAnswerChange,
      onSubmit,
      onNext,
      feedback = null,
      exercise = null,
      isLastQuestion = false,
      onSpeak,
      xpAwarded = 0,
    },
    inputRef
  ) {
    return (
      <form onSubmit={onSubmit} className="w-full space-y-4 pt-2">
        {/* Text Input */}
        <div className="relative">
          <input
            ref={inputRef}
            className="w-full min-h-[58px] sm:min-h-[64px] rounded-2xl border-2 border-[#eaded6] bg-white px-5 text-center text-xl sm:text-2xl text-[rgb(var(--color-neutral))] outline-none transition focus:border-[#6b2832] focus:ring-4 focus:ring-[#6b2832]/10 placeholder:text-[rgb(var(--color-neutral))]/30 disabled:bg-[#fbf9f7] disabled:opacity-90 font-medium"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder={exercise?.placeholder || 'Escribe la respuesta exacta...'}
            autoComplete="off"
            disabled={feedback !== null}
          />
        </div>

        {/* Semantic Feedback Banner */}
        {feedback && (
          <div
            className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 animate-fadeIn border ${
              feedback.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50/90 text-emerald-950'
                : 'border-rose-200 bg-rose-50/90 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold">
                  {feedback.tone === 'success' ? '✓' : '✕'}
                </span>
                <div>
                  <div className="font-bold text-sm sm:text-base">
                    {feedback.tone === 'success' ? '¡Correcto!' : 'No exactamente'}
                  </div>
                  <div className="text-xs sm:text-sm font-medium opacity-85 mt-0.5">
                    {feedback.tone === 'success' ? (
                      <span>
                        {exercise?.prompt} →{' '}
                        <strong className="font-bold">
                          {exercise?.solutionDisplay ||
                            (exercise?.gameMode === 'translate'
                              ? exercise?.japanese || exercise?.hiragana
                              : exercise?.hiragana || exercise?.romaji || exercise?.translation)}
                        </strong>
                      </span>
                    ) : (
                      <span>
                        Respuesta aceptada:{' '}
                        <strong className="font-bold">
                          {exercise?.solutionDisplay ||
                            exercise?.expectedAnswers?.[0] ||
                            exercise?.answers?.[0] ||
                            exercise?.translation ||
                            exercise?.hiragana}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Kanji educational feedback */}
                  {exercise?.kanjiFeedback && (
                    <div className="text-[11px] font-medium opacity-70 mt-1 italic">
                      {exercise.kanjiFeedback}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {feedback.tone === 'success' && !feedback.hintUsed && xpAwarded > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    +{xpAwarded} XP ⚡
                  </span>
                )}
                {onSpeak && (
                  <button
                    type="button"
                    onClick={onSpeak}
                    className="rounded-full p-2 text-stone-600 hover:bg-black/5 transition cursor-pointer"
                    title="Escuchar"
                    aria-label="Escuchar pronunciación"
                  >
                    <Icon name="volume-high" className="w-4 h-4" aria-label="Audio" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Action Button */}
        <div className="pt-2">
          {feedback ? (
            <button
              type="button"
              onClick={onNext}
              className={`w-full min-h-[54px] rounded-2xl text-base sm:text-lg font-bold text-white shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                feedback.tone === 'success'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-[#6b2832] hover:bg-[#581f27]'
              }`}
            >
              <span>{isLastQuestion ? 'Ver resultados' : 'Siguiente'}</span>
              <span>→</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!answer.trim()}
              className="w-full min-h-[54px] rounded-2xl bg-[#6b2832] text-white text-base sm:text-lg font-bold shadow-md transition-all hover:bg-[#581f27] active:scale-98 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none cursor-pointer"
            >
              Verificar
            </button>
          )}
        </div>
      </form>
    );
  }
);

export default OpenAnswerInput;
