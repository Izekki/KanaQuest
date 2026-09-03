import React from 'react';

/**
 * ParParejasCard - 3D Flippable Memory Match Card Component
 */
export default function ParParejasCard({
  card,
  onCardClick,
  disabled = false,
}) {
  const { id, content, subtext, type, isFlipped, isMatched } = card;

  const handleClick = () => {
    if (disabled || isFlipped || isMatched) return;
    onCardClick(card);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const isKanjiType = type === 'kanji';

  return (
    <div
      role="button"
      tabIndex={isMatched || disabled ? -1 : 0}
      aria-label={
        isFlipped || isMatched
          ? `Carta ${isKanjiType ? 'japonesa' : 'española'}: ${content}`
          : 'Carta boca abajo'
      }
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={[
        'group relative aspect-[3/4] sm:aspect-square w-full select-none cursor-pointer rounded-xl sm:rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-accent))]',
        isMatched ? 'cursor-default opacity-85' : 'hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150',
      ].join(' ')}
      style={{ perspective: '1000px' }}
    >
      <div
        className={[
          'relative h-full w-full rounded-xl sm:rounded-2xl shadow-xs transition-transform duration-500 [transform-style:preserve-3d]',
          isFlipped || isMatched ? '[transform:rotateY(180deg)]' : '',
        ].join(' ')}
      >
        {/* FRONT OF CARD (FACE DOWN: Torii/Logo Pattern) */}
        <div
          className={[
            'absolute inset-0 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-rose-100/90 bg-gradient-to-br from-[#ffffff] via-[#fdf7f4] to-[#fbf0ec] p-1.5 sm:p-2 text-center shadow-xs hover:shadow-md transition-all [backface-visibility:hidden]',
            'group-hover:border-[#6b2832]/40',
          ].join(' ')}
        >
          <div className="flex h-8 w-8 min-[400px]:h-9 min-[400px]:w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-[#fbeae5] text-base min-[400px]:text-lg sm:text-xl font-bold text-[#6b2832] shadow-2xs border border-[#f2d2cc]">
            <span>🎴</span>
          </div>
          <span className="mt-1 text-[9px] min-[400px]:text-[10px] sm:text-xs font-bold tracking-wider text-[#6b2832]/70 uppercase">
            Kana
          </span>
        </div>

        {/* BACK OF CARD (FACE UP: Content revealed) */}
        <div
          className={[
            'absolute inset-0 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border p-1 sm:p-2.5 text-center shadow-sm overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]',
            isMatched
              ? 'border-emerald-400 bg-emerald-50/95 text-emerald-900 shadow-emerald-200/50'
              : isKanjiType
              ? 'border-[rgba(128,43,56,0.25)] bg-gradient-to-b from-white to-[#fff8f6] text-[rgb(var(--color-accent))]'
              : 'border-[rgba(59,130,246,0.25)] bg-gradient-to-b from-white to-[#f0f7ff] text-[#1e3a8a]',
          ].join(' ')}
        >
          {/* Top Badge */}
          <div className="absolute top-1 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
            <span
              className={[
                'rounded-full px-1 py-0.2 sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider',
                isMatched
                  ? 'bg-emerald-200/80 text-emerald-800'
                  : isKanjiType
                  ? 'bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))]'
                  : 'bg-blue-100 text-blue-700',
              ].join(' ')}
            >
              {isKanjiType ? 'JP' : 'ES'}
            </span>
            {isMatched ? (
              <span className="text-[10px] sm:text-xs text-emerald-600 font-extrabold" aria-label="Acertado">
                ✓
              </span>
            ) : null}
          </div>

          {/* Main Card Content */}
          <div className="flex flex-col items-center justify-center w-full px-0.5 pt-3 sm:pt-4 my-auto min-w-0">
            <div
              className={[
                'font-bold tracking-tight leading-tight w-full break-words hyphens-auto',
                isKanjiType
                  ? 'text-lg min-[400px]:text-xl sm:text-2xl md:text-3xl font-jp text-[rgb(var(--color-accent))]'
                  : 'text-[11px] min-[400px]:text-xs sm:text-sm md:text-base font-semibold text-[rgb(var(--color-neutral))] line-clamp-3',
              ].join(' ')}
            >
              {content}
            </div>

            {subtext ? (
              <div className="mt-0.5 text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-[rgb(var(--color-neutral))]/65 font-medium truncate max-w-[95%]">
                {subtext}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
