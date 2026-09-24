import React, { useState } from 'react';
import Icon from '../ui/Icon';

const KANJI_ROUNDS = [
  {
    kanji: '木',
    meaning: 'Árbol',
    correctOption: 'ki',
    options: [
      { id: 'ki', label: 'ki', translation: 'Árbol' },
      { id: 'mizu', label: 'mizu', translation: 'Agua' },
      { id: 'hi', label: 'hi', translation: 'Fuego' },
    ],
  },
  {
    kanji: '水',
    meaning: 'Agua',
    correctOption: 'mizu',
    options: [
      { id: 'yama', label: 'yama', translation: 'Montaña' },
      { id: 'mizu', label: 'mizu', translation: 'Agua' },
      { id: 'tsuki', label: 'tsuki', translation: 'Luna' },
    ],
  },
  {
    kanji: '日',
    meaning: 'Sol / Día',
    correctOption: 'hi',
    options: [
      { id: 'hi', label: 'hi', translation: 'Sol' },
      { id: 'hito', label: 'hito', translation: 'Persona' },
      { id: 'hon', label: 'hon', translation: 'Libro' },
    ],
  },
];

export default function RecognitionPreview() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [streakCount, setStreakCount] = useState(0);

  const current = KANJI_ROUNDS[roundIndex];

  const handleSelect = (optionId) => {
    setSelectedOption(optionId);
    if (optionId === current.correctOption) {
      setIsCorrect(true);
      setStreakCount((prev) => prev + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    setIsCorrect(null);
    setRoundIndex((prev) => (prev + 1) % KANJI_ROUNDS.length);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mini Interactive Canvas / Card Frame */}
      <div className="relative w-full rounded-2xl border border-[#ead8cf] bg-[linear-gradient(145deg,#fffdfb_0%,#faf2eb_100%)] p-4 shadow-xs overflow-hidden">
        {/* Subtle Japanese Pattern Accent */}
        <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#f4dcd6]/30 blur-xl pointer-events-none" />

        {/* Central Kanji Stage */}
        <div className="flex flex-col items-center justify-center py-2">
          <div
            className={[
              'relative flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-sm font-jp select-none',
              isCorrect === true
                ? 'border-[#1e8289] bg-[#ebf6f7] shadow-[0_0_20px_rgba(30,130,137,0.25)] scale-105'
                : isCorrect === false
                ? 'border-[#b83848] bg-[#fff1ee] animate-mascot-error'
                : 'border-[#dfc6bc] bg-white hover:border-[#1e8289]/60',
            ].join(' ')}
          >
            <span className="text-3xl sm:text-4xl font-extrabold text-[#6b2832]">
              {current.kanji}
            </span>

            {/* Micro Badge for Meaning */}
            <span className="absolute -bottom-2.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6b2832]/80 border border-[#ead8cf] shadow-2xs">
              {current.meaning}
            </span>
          </div>

          {/* Interactive Feedback Message */}
          <div className="h-6 mt-4 flex items-center justify-center text-xs font-bold">
            {isCorrect === true && (
              <span className="text-[#1e8289] flex items-center gap-1.5 animate-fadeIn">
                <Icon name="sparkles" className="w-3.5 h-3.5 text-[#1e8289]" />
                <span>¡Acierto! +15 XP</span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-1 text-[11px] underline underline-offset-2 hover:text-[#15666d]"
                >
                  Siguiente →
                </button>
              </span>
            )}
            {isCorrect === false && (
              <span className="text-[#b83848] animate-fadeIn flex items-center gap-1">
                <Icon name="cross-circle" className="w-3.5 h-3.5 text-[#b83848]" />
                <span>Intenta de nuevo</span>
              </span>
            )}
            {isCorrect === null && (
              <span className="text-[#6b2832]/60 text-[11px]">
                ¿Cuál es la lectura correcta?
              </span>
            )}
          </div>
        </div>

        {/* Multiple Choice Option Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#f0e3db]">
          {current.options.map((opt) => {
            const isChosen = selectedOption === opt.id;
            let btnStyle = 'border-[#ead8cf] bg-white text-[#6b2832] hover:bg-[#fbf4f0] hover:border-[#dfc6bc]';

            if (isChosen) {
              if (opt.id === current.correctOption) {
                btnStyle = 'border-[#1e8289] bg-[#ebf6f7] text-[#1e8289] font-bold shadow-xs';
              } else {
                btnStyle = 'border-[#b83848] bg-[#fff1ee] text-[#b83848] font-bold';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={[
                  'flex flex-col items-center justify-center rounded-xl border py-2 px-1 text-xs font-semibold transition-all duration-150 active:scale-95 min-h-[44px]',
                  btnStyle,
                ].join(' ')}
              >
                <span className="font-mono text-xs">{opt.label}</span>
                <span className="text-[9px] text-[#6b2832]/60 opacity-80">{opt.translation}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Streak mini indicator */}
      {streakCount > 0 && (
        <div className="mt-2 text-[10px] font-bold text-[#1e8289] flex items-center gap-1.5">
          <Icon name="fire-streak" className="w-3.5 h-3.5 text-[#1e8289]" />
          <span>Racha en preview: {streakCount}</span>
        </div>
      )}
    </div>
  );
}
