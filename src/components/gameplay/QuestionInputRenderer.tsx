import React, { forwardRef } from 'react';
import type { InputMode } from '../../types/adaptiveDifficulty';
import MultipleChoiceGrid from './MultipleChoiceGrid';
import OpenAnswerInput from './OpenAnswerInput';
import Icon from '../ui/Icon';

interface OptionItem {
  id: string;
  keyIndex: number;
  label: string;
  isCorrect: boolean;
}

interface FeedbackState {
  tone: 'success' | 'error';
  message?: string;
  hintUsed?: boolean;
}

interface QuestionInputRendererProps {
  mode: InputMode;
  exercise: any;
  feedback: FeedbackState | null;
  // Cards Props
  options: OptionItem[];
  selectedOption: OptionItem | null;
  onSelectOption: (option: OptionItem) => void;
  disabled?: boolean;
  // Input Props
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  // Navigation & Actions
  onNext: () => void;
  nextButtonRef?: React.Ref<HTMLButtonElement>;
  isLastQuestion: boolean;
  onSpeak: () => void;
  xpAwarded: number;
  gameMode?: string;
}

/**
 * QuestionInputRenderer — Resolves and renders either Cards (MultipleChoiceGrid)
 * or Input (OpenAnswerInput), ensuring a smooth transition between questions
 * without full component remounts or combo loss.
 */
const QuestionInputRenderer = forwardRef<HTMLInputElement, QuestionInputRendererProps>(
  function QuestionInputRenderer(
    {
      mode,
      exercise,
      feedback,
      options,
      selectedOption,
      onSelectOption,
      disabled = false,
      answer,
      onAnswerChange,
      onSubmit,
      onNext,
      nextButtonRef,
      isLastQuestion,
      onSpeak,
      xpAwarded,
      gameMode = 'recognize',
    },
    ref
  ) {
    if (mode === 'cards') {
      return (
        <div className="w-full space-y-4 pt-1 animate-fadeIn">
          <MultipleChoiceGrid
            options={options}
            selectedOption={selectedOption}
            feedback={feedback}
            onSelectOption={onSelectOption}
            disabled={disabled}
          />

          {/* Semantic Feedback Banner for Cards Mode */}
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
                      <span>
                        {exercise?.prompt} →{' '}
                        <strong className="font-bold">
                          {exercise?.solutionDisplay ||
                            (gameMode === 'translate'
                              ? exercise?.japanese || exercise?.hiragana
                              : exercise?.translation || exercise?.hiragana || exercise?.romaji)}
                        </strong>
                      </span>
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
                  {feedback.tone === 'success' && xpAwarded > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      +{xpAwarded} XP
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={onSpeak}
                    className="rounded-full p-2 text-stone-600 hover:bg-black/5 transition cursor-pointer"
                    title="Escuchar pronunciación"
                    aria-label="Escuchar pronunciación"
                  >
                    <Icon name="volume-high" className="w-4 h-4" aria-label="Audio" />
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  ref={nextButtonRef}
                  onClick={onNext}
                  className={`w-full min-h-[48px] rounded-xl text-sm sm:text-base font-bold text-white shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                    feedback.tone === 'success'
                      ? 'bg-emerald-700 hover:bg-emerald-800'
                      : 'bg-[#6b2832] hover:bg-[#581f27]'
                  }`}
                >
                  <span>
                    {isLastQuestion ? 'Ver resultados' : 'Siguiente pregunta'}
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Input mode (Master input field)
    return (
      <div className="w-full animate-fadeIn">
        <OpenAnswerInput
          ref={ref}
          answer={answer}
          onAnswerChange={onAnswerChange}
          onSubmit={onSubmit}
          onNext={onNext}
          feedback={feedback}
          exercise={exercise}
          difficultyMode="master"
          isLastQuestion={isLastQuestion}
          onSpeak={onSpeak}
          xpAwarded={xpAwarded}
        />
      </div>
    );
  }
);

export default QuestionInputRenderer;
