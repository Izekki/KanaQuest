import React from 'react';
import Icon from '../../ui/Icon';

/**
 * ParParejasCard - Tactile Memory Match Card Component
 * Optimized for high legibility, snappy ~220ms flips, and generous touch targets.
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
        'group relative w-full select-none cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#6b2832]',
        'min-h-[96px] sm:min-h-[115px] md:min-h-[130px] aspect-[4/3] sm:aspect-[1/1]',
        isMatched
          ? 'cursor-default opacity-85'
          : 'hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150',
      ].join(' ')}
      style={{ perspective: '800px' }}
    >
      <div
        className={[
          'relative h-full w-full rounded-2xl shadow-xs transition-transform duration-250 ease-out [transform-style:preserve-3d]',
          isFlipped || isMatched ? '[transform:rotateY(180deg)]' : '',
        ].join(' ')}
      >
        {/* FRONT OF CARD (FACE DOWN: Tactile pattern) */}
        <div
          className={[
            'absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-[#eaded6] bg-gradient-to-br from-[#ffffff] via-[#fdf8f5] to-[#f7ede8] p-2 text-center shadow-xs group-hover:border-[#6b2832]/40 transition-colors [backface-visibility:hidden]',
          ].join(' ')}
        >
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#fbeae5] text-lg sm:text-xl font-bold text-[#6b2832] shadow-2xs border border-[#f2d2cc]">
            <Icon name="cards-memory" className="w-5 h-5 sm:w-6 sm:h-6 text-[#6b2832]" />
          </div>
          <span className="mt-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-[#6b2832]/60 uppercase font-mono">
            Kana
          </span>
        </div>

        {/* BACK OF CARD (FACE UP: Revealed word/translation) */}
        <div
          className={[
            'absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 p-2 sm:p-3 text-center shadow-sm overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]',
            isMatched
              ? 'border-emerald-400 bg-emerald-50/95 text-emerald-950 shadow-emerald-200/40'
              : isKanjiType
              ? 'border-[#6b2832]/30 bg-gradient-to-b from-white to-[#fff8f6] text-[#6b2832]'
              : 'border-blue-300/80 bg-gradient-to-b from-white to-[#f0f7ff] text-[#1e3a8a]',
          ].join(' ')}
        >
          {/* Top Tag */}
          <div className="absolute top-1.5 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span
              className={[
                'rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider',
                isMatched
                  ? 'bg-emerald-200/80 text-emerald-900'
                  : isKanjiType
                  ? 'bg-[#6b2832]/10 text-[#6b2832]'
                  : 'bg-blue-100 text-blue-800',
              ].join(' ')}
            >
              {isKanjiType ? 'JP' : 'ES'}
            </span>
            {isMatched ? (
              <span className="text-xs text-emerald-700 font-extrabold" aria-label="Acertado">
                ✓
              </span>
            ) : null}
          </div>

          {/* Main Card Content */}
          <div className="flex flex-col items-center justify-center w-full px-1 pt-3 my-auto min-w-0">
            <div
              className={[
                'font-bold tracking-tight leading-tight w-full break-words hyphens-auto',
                isKanjiType
                  ? 'text-2xl sm:text-3xl md:text-4xl font-jp text-[#6b2832]'
                  : 'text-xs sm:text-sm md:text-base font-semibold text-[rgb(var(--color-neutral))] line-clamp-3',
              ].join(' ')}
            >
              {content}
            </div>

            {subtext ? (
              <div className="mt-1 text-[10px] sm:text-xs text-[rgb(var(--color-neutral))]/60 font-medium truncate max-w-[95%]">
                {subtext}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
