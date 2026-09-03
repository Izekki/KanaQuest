import React, { useState } from 'react';
import WordBlock from './WordBlock';

/**
 * WordBank Component
 *
 * Source container holding unordered available word blocks for the current sentence.
 */
export default function WordBank({
  availableBlocks = [],
  onDropToAvailable,
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
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const parsed = JSON.parse(dataStr);
      if (onDropToAvailable) {
        onDropToAvailable(parsed);
      }
    } catch (err) {
      console.error('Failed to parse dropped data:', err);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral/60">
        <span>Banco de Palabras ({availableBlocks.length})</span>
        <span className="hidden min-[420px]:inline">Toca para agregar</span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'min-h-[76px] sm:min-h-[105px] w-full rounded-2xl sm:rounded-3xl border border-cream/40 bg-surface/50 p-2.5 sm:p-5 md:p-6',
          'flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 transition-all duration-200 overflow-hidden',
          isOver ? 'border-accent bg-accent/5 ring-2 ring-accent/20' : '',
        ].join(' ')}
      >
        {availableBlocks.length === 0 ? (
          <div className="pointer-events-none text-center text-sm font-medium text-neutral/40 italic">
            Todas las fichas están en la zona de construcción ✨
          </div>
        ) : (
          availableBlocks.map((block, index) => (
            <WordBlock
              key={block.id || index}
              block={block}
              index={index}
              location="available"
              validationState="idle"
              onBlockClick={onBlockClick}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggingBlockId === block.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
