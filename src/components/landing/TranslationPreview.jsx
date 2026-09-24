import React, { useState } from 'react';
import Icon from '../ui/Icon';

const WORDS_TO_TRANSLATE = [
  {
    prompt: 'Comer',
    kanjiKana: '食べる',
    romaji: 'taberu',
    accepted: ['comer', 'taberu', 'comer.', 'taberu.'],
    hint: 'taberu',
  },
  {
    prompt: 'Gato',
    kanjiKana: '猫 (ねこ)',
    romaji: 'neko',
    accepted: ['gato', 'neko', 'gato.'],
    hint: 'neko',
  },
  {
    prompt: 'Agua',
    kanjiKana: '水 (みず)',
    romaji: 'mizu',
    accepted: ['agua', 'mizu', 'agua.'],
    hint: 'mizu',
  },
];

export default function TranslationPreview() {
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(null); // 'correct' | 'wrong' | null
  const [xpGained, setXpGained] = useState(0);

  const current = WORDS_TO_TRANSLATE[index];

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    const clean = inputValue.trim().toLowerCase();
    if (!clean) return;

    if (current.accepted.includes(clean)) {
      setStatus('correct');
      setXpGained((prev) => prev + 15);
    } else {
      setStatus('wrong');
    }
  };

  const handleQuickChip = (text) => {
    setInputValue(text);
    if (current.accepted.includes(text.toLowerCase())) {
      setStatus('correct');
      setXpGained((prev) => prev + 15);
    } else {
      setStatus('wrong');
    }
  };

  const handleNextWord = (e) => {
    if (e) e.stopPropagation();
    setInputValue('');
    setStatus(null);
    setIndex((prev) => (prev + 1) % WORDS_TO_TRANSLATE.length);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full rounded-2xl border border-[#ead8cf] bg-[linear-gradient(145deg,#fffdfb_0%,#faf2eb_100%)] p-4 shadow-xs overflow-hidden">
        {/* Subtle Japanese Ochre Accent */}
        <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#fae4ba]/30 blur-xl pointer-events-none" />

        {/* Word Prompt Header */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#f0e3db]">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9c6615]">
              Palabra en Español:
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#6b2832]">
              {current.prompt}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold font-jp text-[#6b2832]/80">
              {current.kanjiKana}
            </span>
            <div className="text-[10px] font-mono text-[#9c6615]/80">
              [{current.romaji}]
            </div>
          </div>
        </div>

        {/* Interactive Input Form */}
        <form onSubmit={handleCheck} className="space-y-2.5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (status) setStatus(null);
              }}
              placeholder={`Ej: ${current.hint}`}
              className={[
                'w-full rounded-xl border bg-white pl-3.5 pr-26 py-2 text-sm sm:text-base font-medium text-[#6b2832] placeholder:text-[#6b2832]/35 focus:outline-none transition-all min-h-[44px]',
                status === 'correct'
                  ? 'border-[#1e8289] ring-2 ring-[#1e8289]/20 bg-[#ebf6f7]/50'
                  : status === 'wrong'
                  ? 'border-[#b83848] ring-2 ring-[#b83848]/20 bg-[#fff1ee]/50'
                  : 'border-[#dfc6bc] focus:border-[#9c6615] focus:ring-2 focus:ring-[#fae4ba]',
              ].join(' ')}
            />

            <button
              type="submit"
              className="absolute right-1.5 rounded-lg bg-[#9c6615] hover:bg-[#85540e] px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition active:scale-95"
            >
              Comprobar
            </button>
          </div>

          {/* Quick Choice Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-[#6b2832]/60 font-semibold mr-0.5">
              Prueba:
            </span>
            <button
              type="button"
              onClick={() => handleQuickChip(current.hint)}
              className="rounded-lg border border-[#f0dec4] bg-[#fff8eb] px-2 py-0.5 text-[11px] font-mono text-[#9c6615] hover:bg-[#fae4ba] transition active:scale-95"
            >
              {current.hint}
            </button>
            <button
              type="button"
              onClick={() => handleQuickChip(current.prompt.toLowerCase())}
              className="rounded-lg border border-[#f0dec4] bg-[#fff8eb] px-2 py-0.5 text-[11px] text-[#9c6615] hover:bg-[#fae4ba] transition active:scale-95"
            >
              {current.prompt.toLowerCase()}
            </button>
          </div>

          {/* Validation Feedback */}
          <div className="min-h-[22px] flex items-center justify-between text-xs font-bold pt-1">
            {status === 'correct' && (
              <div className="text-[#1e8289] flex items-center gap-1.5 animate-fadeIn">
                <Icon name="target-accuracy" className="w-3.5 h-3.5 text-[#1e8289]" />
                <span>¡Excelente! +15 XP</span>
                <button
                  type="button"
                  onClick={handleNextWord}
                  className="ml-2 text-[11px] underline underline-offset-2 hover:text-[#15666d]"
                >
                  Siguiente palabra →
                </button>
              </div>
            )}
            {status === 'wrong' && (
              <span className="text-[#b83848] animate-fadeIn flex items-center gap-1">
                <Icon name="cross-circle" className="w-3.5 h-3.5 text-[#b83848]" />
                <span>Pista: Se lee "{current.hint}"</span>
              </span>
            )}
            {status === null && (
              <span className="text-[10px] text-[#6b2832]/60 font-normal">
                Escribe en español o lectura romaji
              </span>
            )}
          </div>
        </form>
      </div>

      {xpGained > 0 && (
        <div className="mt-2 text-[10px] font-bold text-[#9c6615] flex items-center gap-1.5">
          <Icon name="star-mastery" className="w-3.5 h-3.5 text-[#9c6615]" />
          <span>XP acumulada en prueba: +{xpGained} XP</span>
        </div>
      )}
    </div>
  );
}
