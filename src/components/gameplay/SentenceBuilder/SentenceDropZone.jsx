import React, { useState } from 'react';
import WordBlock from './WordBlock';

/**
 * SentenceDropZone Component
 *
 * Target container where the user places and reorders word blocks to build the Japanese sentence.
 */
export default function SentenceDropZone({
  placedBlocks = [],
  totalRequired = 0,
  validationState = 'idle', // 'idle' | 'correct' | 'incorrect'
  onDropToPlaced,
  onBlockClick,
  onDragStart,
  onDragEnd,
  draggingBlockId,
}) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = (e) => {
    // Only deactivate if leaving the container boundaries
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsOver(false);
  };

  const handleDrop = (e, targetIndex = placedBlocks.length) => {
    e.preventDefault();
    setIsOver(false);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const parsed = JSON.parse(dataStr);
      if (onDropToPlaced) {
        onDropToPlaced(parsed, targetIndex);
      }
    } catch (err) {
      console.error('Failed to parse dropped data:', err);
    }
  };

  // Border and glow based on validation
  let containerStyles = 'border-cream/60 bg-surface/80';
  if (validationState === 'correct') {
    containerStyles = 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10';
  } else if (validationState === 'incorrect') {
    containerStyles = 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-400/50 shadow-lg shadow-rose-500/10';
  } else if (isOver) {
    containerStyles = 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-md';
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral/60">
        <span>Zona de Construcción ({placedBlocks.length}/{totalRequired})</span>
        <span className="hidden min-[420px]:inline">Toca o arrastra para ordenar</span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e)}
        className={[
          'relative min-h-[76px] sm:min-h-[105px] w-full rounded-2xl sm:rounded-3xl border-2 border-dashed p-2.5 sm:p-5 md:p-6',
          'flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 transition-all duration-200 overflow-hidden',
          containerStyles,
        ].join(' ')}
      >
        {placedBlocks.length === 0 ? (
          <div className="pointer-events-none text-center text-xs sm:text-sm font-medium text-neutral/40">
            <span className="hidden sm:block text-2xl mb-1">✍️</span>
            <span>Toca las fichas de abajo para ordenar</span>
          </div>
        ) : (
          placedBlocks.map((block, index) => (
            <div
              key={block.id || index}
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(e, index);
              }}
              className="inline-flex items-center"
            >
              <WordBlock
                block={block}
                index={index}
                location="placed"
                validationState={validationState}
                onBlockClick={onBlockClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={draggingBlockId === block.id}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
