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
  const isFixed = block.is_fixed;

  // Determine state-based styles
  let stateClasses = 'border-cream/80 bg-surface text-neutral hover:border-accent hover:shadow-md active:scale-95';

  if (validationState === 'correct') {
    stateClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400 shadow-emerald-200';
  } else if (validationState === 'incorrect') {
    stateClasses = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400 shadow-rose-200 animate-pulse';
  } else if (isFixed) {
    stateClasses = 'border-amber-400/80 bg-amber-50/70 text-neutral opacity-90 cursor-default';
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
        'font-medium transition-all duration-200 cursor-grab active:cursor-grabbing',
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
