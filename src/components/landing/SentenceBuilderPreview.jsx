import React, { useState } from 'react';
import Icon from '../ui/Icon';

const SENTENCE_GOAL = [
  { id: 'watashi', text: '私', romaji: 'watashi', label: 'Yo' },
  { id: 'ha', text: 'は', romaji: 'wa', label: '(partícula)', isFixed: true },
  { id: 'gakusei', text: '学生', romaji: 'gakusei', label: 'Estudiante' },
  { id: 'desu', text: 'です', romaji: 'desu', label: 'Ser', isFixed: true },
];

export default function SentenceBuilderPreview() {
  // Slots in sentence: slot 0 (needs 'watashi'), slot 1 (fixed 'は'), slot 2 (needs 'gakusei'), slot 3 (fixed 'です')
  const [slotWatashi, setSlotWatashi] = useState(null);
  const [slotGakusei, setSlotGakusei] = useState(null);

  const isCompleted = slotWatashi && slotGakusei;

  const handleTileClick = (tileId) => {
    if (tileId === 'watashi') {
      setSlotWatashi(true);
    } else if (tileId === 'gakusei') {
      setSlotGakusei(true);
    }
  };

  const handleReset = (e) => {
    if (e) e.stopPropagation();
    setSlotWatashi(null);
    setSlotGakusei(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full rounded-2xl border border-[#ead8cf] bg-[linear-gradient(145deg,#fffdfb_0%,#faf2eb_100%)] p-4 shadow-xs overflow-hidden">
        {/* Subtle Green / Jade Accent */}
        <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#cfe9d8]/30 blur-xl pointer-events-none" />

        {/* Goal Description */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0e3db]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#22633e]">
            Construye la Frase:
          </span>
          <span className="text-xs font-semibold text-[#6b2832]/80">
            "Yo soy estudiante"
          </span>
        </div>

        {/* Sentence Slots Stage */}
        <div className="flex items-center justify-center gap-1.5 py-2.5 px-1 bg-white/80 rounded-xl border border-[#e8ded6] min-h-[58px]">
          {/* Slot 1: [ 私 ] */}
          {slotWatashi ? (
            <button
              type="button"
              onClick={() => setSlotWatashi(null)}
              className="px-2.5 py-1.5 rounded-lg bg-[#eef8f2] border-2 border-[#22633e] text-[#22633e] font-bold font-jp text-sm sm:text-base shadow-2xs hover:bg-[#e0f3e6] transition animate-fadeIn"
              title="Toca para remover"
            >
              私
            </button>
          ) : (
            <div className="h-9 w-10 sm:w-12 rounded-lg border-2 border-dashed border-[#dfc6bc] bg-[#fbf5f2] flex items-center justify-center text-[10px] font-bold text-[#6b2832]/40">
              ?
            </div>
          )}

          {/* Fixed Particle: [ は ] */}
          <div className="px-2 py-1.5 rounded-lg bg-[#fbf0ec] border border-[#f2d2cc] text-[#6b2832] font-bold font-jp text-sm">
            は
          </div>

          {/* Slot 2: [ 学生 ] */}
          {slotGakusei ? (
            <button
              type="button"
              onClick={() => setSlotGakusei(null)}
              className="px-2.5 py-1.5 rounded-lg bg-[#eef8f2] border-2 border-[#22633e] text-[#22633e] font-bold font-jp text-sm sm:text-base shadow-2xs hover:bg-[#e0f3e6] transition animate-fadeIn"
              title="Toca para remover"
            >
              学生
            </button>
          ) : (
            <div className="h-9 w-12 sm:w-14 rounded-lg border-2 border-dashed border-[#dfc6bc] bg-[#fbf5f2] flex items-center justify-center text-[10px] font-bold text-[#6b2832]/40">
              ?
            </div>
          )}

          {/* Fixed Ending: [ です ] */}
          <div className="px-2 py-1.5 rounded-lg bg-[#fbf0ec] border border-[#f2d2cc] text-[#6b2832] font-bold font-jp text-sm">
            です
          </div>
        </div>

        {/* Word Chips Dock */}
        <div className="mt-3 pt-2 border-t border-[#f0e3db]">
          <div className="text-[10px] font-semibold text-[#6b2832]/70 mb-1.5">
            Toca las fichas para colocarlas:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!slotWatashi && (
              <button
                type="button"
                onClick={() => handleTileClick('watashi')}
                className="px-3 py-1.5 rounded-xl border-2 border-[#22633e]/50 bg-white hover:bg-[#eef8f2] hover:border-[#22633e] text-[#22633e] font-bold font-jp text-xs sm:text-sm shadow-2xs transition active:scale-95 flex items-center gap-1.5"
              >
                <span>私</span>
                <span className="text-[10px] font-sans font-normal opacity-75">(Yo)</span>
              </button>
            )}

            {!slotGakusei && (
              <button
                type="button"
                onClick={() => handleTileClick('gakusei')}
                className="px-3 py-1.5 rounded-xl border-2 border-[#22633e]/50 bg-white hover:bg-[#eef8f2] hover:border-[#22633e] text-[#22633e] font-bold font-jp text-xs sm:text-sm shadow-2xs transition active:scale-95 flex items-center gap-1.5"
              >
                <span>学生</span>
                <span className="text-[10px] font-sans font-normal opacity-75">(Estudiante)</span>
              </button>
            )}

            {isCompleted && (
              <div className="w-full flex items-center justify-between text-xs font-bold text-[#22633e] animate-fadeIn py-0.5">
                <span className="flex items-center gap-1.5">
                  <Icon name="star-mastery" className="w-3.5 h-3.5 text-[#22633e]" />
                  <span>¡Frase completada! +25 XP</span>
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] underline underline-offset-2 hover:text-[#184d30]"
                >
                  Reiniciar ↻
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-[10px] font-bold text-[#22633e] flex items-center gap-1.5">
        <Icon name="puzzle-blocks" className="w-3.5 h-3.5 text-[#22633e]" />
        <span>Gramática visual por bloques</span>
      </div>
    </div>
  );
}
