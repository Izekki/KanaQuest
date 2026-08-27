import React from 'react';

/**
 * WordBlock Component
 *
 * Renders an individual draggable/clickable word chip displaying ONLY hiragana.
 * Includes dynamic states for default, placed, dragging, fixed, correct, and incorrect.
 */
export default function WordBlock({
  block,
  index,
  location = 'available', // 'available' | 'placed'
  validationState = 'idle', // 'idle' | 'correct' | 'incorrect'
  onBlockClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
}) {
  const hiraganaText = block.words?.hiragana || block.hiragana || '—';
  const partOfSpeech = (block.words?.part_of_speech || block.part_of_speech || block.words?.word_types?.name || '').toLowerCase();
  const isFixed = block.is_fixed;

  // 1. Determine semantic color theme before validation
  let semanticClasses = 'border-[#eaded6] bg-white text-[rgb(var(--color-neutral))] hover:border-accent hover:shadow-[0_4px_14px_rgba(128,43,56,0.08)]';

  if (partOfSpeech === 'noun' || partOfSpeech === 'proper_noun' || partOfSpeech === 'pronoun') {
    // Sustantivos y pronombres: tono azul suave
    semanticClasses = 'border-blue-200 bg-blue-50/60 text-blue-800 hover:border-blue-400 hover:bg-blue-50 hover:shadow-[0_4px_14px_rgba(37,99,235,0.12)]';
  } else if (partOfSpeech === 'particle' || partOfSpeech === 'prefix') {
    // Partículas y prefijos: tono ámbar / naranja suave
    semanticClasses = 'border-amber-200 bg-amber-50/60 text-amber-800 hover:border-amber-400 hover:bg-amber-50 hover:shadow-[0_4px_14px_rgba(217,119,6,0.12)]';
  } else if (partOfSpeech === 'verb' || partOfSpeech === 'auxiliary') {
    // Verbos y auxiliares: tono púrpura / violeta suave (diferenciado del verde de victoria)
    semanticClasses = 'border-purple-200 bg-purple-50/70 text-purple-800 hover:border-purple-400 hover:bg-purple-50 hover:shadow-[0_4px_14px_rgba(147,51,234,0.12)]';
  } else if (partOfSpeech === 'adjective') {
    // Adjetivos: tono fucsia / rosa suave
    semanticClasses = 'border-fuchsia-200 bg-fuchsia-50/60 text-fuchsia-800 hover:border-fuchsia-400 hover:bg-fuchsia-50 hover:shadow-[0_4px_14px_rgba(217,70,239,0.12)]';
  }

  // 2. Override with validation or fixed state if active
  let stateClasses = semanticClasses;

  if (validationState === 'correct') {
    stateClasses = 'border-emerald-500 bg-emerald-100/90 text-emerald-950 ring-2 ring-emerald-400 shadow-md shadow-emerald-200/60';
  } else if (validationState === 'incorrect') {
    stateClasses = 'border-rose-500 bg-rose-100/90 text-rose-950 ring-2 ring-rose-400 shadow-md shadow-rose-200/60 animate-pulse';
  } else if (isFixed) {
    stateClasses = 'border-amber-400 bg-amber-50 text-amber-900 opacity-90 cursor-default ring-1 ring-amber-300';
  }

  const handleDragStart = (e) => {
    if (isFixed) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify({ blockId: block.id, location, index }));
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(block, location, index);
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd();
  };

  return (
    <div
      draggable={!isFixed}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onBlockClick && onBlockClick(block, location, index)}
      role="button"
      tabIndex={0}
      title={isFixed ? 'Bloque fijo' : 'Arrastra o haz clic para mover'}
      className={[
        'group relative inline-flex items-center justify-center select-none',
        'rounded-2xl border-2 px-4 py-3 min-w-[72px] sm:min-w-[84px]',
        'font-medium transition-all duration-200 cursor-grab active:cursor-grabbing active:scale-95 shadow-sm',
        isDragging ? 'opacity-40 scale-95' : 'opacity-100',
        stateClasses,
      ].join(' ')}
    >
      {/* Block Text - STRICTLY HIRAGANA */}
      <span className="text-xl sm:text-2xl font-bold tracking-wide font-sans text-center">
        {hiraganaText}
      </span>

      {/* Fixed Block Pin Indicator */}
      {isFixed && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white shadow-sm">
          📌
        </span>
      )}

      {/* Position badge when in placed zone */}
      {location === 'placed' && (
        <span className="absolute -bottom-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-cream/70 text-[9px] font-bold text-neutral/70">
          {index + 1}
        </span>
      )}
    </div>
  );
}
