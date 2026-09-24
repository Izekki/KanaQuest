import React, { useState } from 'react';
import Icon from '../ui/Icon';

export default function PairMatchPreview() {
  // Initial state: Card 0 (日) and Card 1 (ひ) are already flipped and matched.
  // Card 2 (月) and Card 3 (つき) start face down and can be clicked to flip!
  const [flippedCards, setFlippedCards] = useState({
    card0: true,
    card1: true,
    card2: false,
    card3: false,
  });

  const [hasCompletedAll, setHasCompletedAll] = useState(false);

  const handleCardClick = (cardId) => {
    if (flippedCards[cardId]) return;

    const nextState = {
      ...flippedCards,
      [cardId]: true,
    };
    setFlippedCards(nextState);

    // Check if both 2 and 3 are flipped
    if (nextState.card2 && nextState.card3) {
      setHasCompletedAll(true);
    }
  };

  const handleReset = (e) => {
    if (e) e.stopPropagation();
    setFlippedCards({
      card0: true,
      card1: true,
      card2: false,
      card3: false,
    });
    setHasCompletedAll(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full rounded-2xl border border-[#ead8cf] bg-[linear-gradient(145deg,#fffdfb_0%,#faf2eb_100%)] p-4 shadow-xs overflow-hidden">
        {/* Subtle Slate-Blue Accent for Memory Challenge */}
        <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#d2e1f5]/30 blur-xl pointer-events-none" />

        {/* 2x2 Memory Cards Mini Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-1">
          {/* Card 0: Kanji 日 (Sol) - Pre-matched */}
          <div className="relative h-16 sm:h-18 rounded-xl border-2 border-[#2c5282] bg-[#eef3fb] p-2 flex flex-col items-center justify-center shadow-xs">
            <span className="text-xl sm:text-2xl font-extrabold text-[#2c5282] font-jp">日</span>
            <span className="text-[9px] font-bold text-[#2c5282]/80">Kanji · Sol</span>
            <span className="absolute top-1.5 right-1.5 text-[#2c5282]">
              <Icon name="sparkles" className="w-3 h-3 text-[#2c5282]" />
            </span>
          </div>

          {/* Card 1: Kana ひ - Pre-matched */}
          <div className="relative h-16 sm:h-18 rounded-xl border-2 border-[#2c5282] bg-[#eef3fb] p-2 flex flex-col items-center justify-center shadow-xs">
            <span className="text-xl sm:text-2xl font-extrabold text-[#2c5282] font-jp">ひ</span>
            <span className="text-[9px] font-bold text-[#2c5282]/80">Lectura 'hi'</span>
            <span className="absolute top-1.5 right-1.5 text-[#2c5282]">
              <Icon name="sparkles" className="w-3 h-3 text-[#2c5282]" />
            </span>
          </div>

          {/* Card 2: Kanji 月 (Luna) - Interactive Flip */}
          <button
            type="button"
            onClick={() => handleCardClick('card2')}
            className={[
              'relative h-16 sm:h-18 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer active:scale-95 shadow-xs select-none',
              flippedCards.card2
                ? 'border-[#1e8289] bg-[#ebf6f7] shadow-[0_0_12px_rgba(30,130,137,0.2)]'
                : 'border-[#dfc6bc] bg-[linear-gradient(135deg,#6b2832_0%,#541c24_100%)] text-white hover:brightness-110',
            ].join(' ')}
          >
            {flippedCards.card2 ? (
              <>
                <span className="text-xl sm:text-2xl font-extrabold text-[#1e8289] font-jp animate-fadeIn">月</span>
                <span className="text-[9px] font-bold text-[#1e8289]/80 animate-fadeIn">Kanji · Luna</span>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-0.5">
                <Icon name="cards-memory" className="w-5 h-5 text-white/90" />
                <span className="text-[9px] font-bold tracking-wider opacity-90">Tocar</span>
              </div>
            )}
          </button>

          {/* Card 3: Kana つき - Interactive Flip */}
          <button
            type="button"
            onClick={() => handleCardClick('card3')}
            className={[
              'relative h-16 sm:h-18 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer active:scale-95 shadow-xs select-none',
              flippedCards.card3
                ? 'border-[#1e8289] bg-[#ebf6f7] shadow-[0_0_12px_rgba(30,130,137,0.2)]'
                : 'border-[#dfc6bc] bg-[linear-gradient(135deg,#6b2832_0%,#541c24_100%)] text-white hover:brightness-110',
            ].join(' ')}
          >
            {flippedCards.card3 ? (
              <>
                <span className="text-xl sm:text-2xl font-extrabold text-[#1e8289] font-jp animate-fadeIn">つき</span>
                <span className="text-[9px] font-bold text-[#1e8289]/80 animate-fadeIn">Lectura 'tsuki'</span>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-0.5">
                <Icon name="cards-memory" className="w-5 h-5 text-white/90" />
                <span className="text-[9px] font-bold tracking-wider opacity-90">Tocar</span>
              </div>
            )}
          </button>
        </div>

        {/* Interactive Banner / Feedback */}
        <div className="mt-2 pt-2 border-t border-[#f0e3db] flex items-center justify-between min-h-[26px]">
          {hasCompletedAll ? (
            <div className="w-full flex items-center justify-between text-xs font-bold text-[#1e8289] animate-fadeIn">
              <span className="flex items-center gap-1.5">
                <Icon name="star-mastery" className="w-3.5 h-3.5 text-[#1e8289]" />
                <span>¡Parejas emparejadas! +20 XP</span>
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] underline underline-offset-2 hover:text-[#15666d]"
              >
                Reiniciar ↻
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between text-[11px] text-[#2c5282] font-semibold">
              <span>Toca las cartas boca abajo</span>
              <span>1/2 resuelto</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-[10px] font-bold text-[#2c5282] flex items-center gap-1.5">
        <Icon name="cards-memory" className="w-3.5 h-3.5 text-[#2c5282]" />
        <span>Memoria visual Kanji & Kana</span>
      </div>
    </div>
  );
}
