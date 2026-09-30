import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TITLE_CATEGORIES, TITLES_CATALOG, RARITY_BADGES } from '../../data/titlesCatalog';
import Icon from '../ui/Icon';

export default function TitlesSelectorModal({
  isOpen,
  onClose,
  currentTitleId,
  currentTitleName,
  unlockedTitleIds = [],
  onEquipTitle,
  isEquipping = false,
}) {
  const [activeCategory, setActiveCategory] = useState('habits');

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unlockedSet = new Set(unlockedTitleIds);
  const filteredTitles = TITLES_CATALOG.filter((t) => t.category === activeCategory);
  const totalUnlockedInCategory = filteredTitles.filter((t) => unlockedSet.has(t.id)).length;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titles-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-[#e8ded6] bg-[#fdfbf7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e4dd] bg-white">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#6b2832]/70">
              Vitrina de Títulos de Rol
            </span>
            <h2 id="titles-modal-title" className="text-lg font-bold text-[#6b2832]">
              Personalización de Título
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b2832]/70 hover:bg-[#faf4f2] hover:text-[#6b2832] transition-colors cursor-pointer"
            title="Cerrar ventana"
            aria-label="Cerrar ventana"
          >
            <span className="text-lg leading-none" aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b border-[#f0e4dd] bg-[#fbf6f2]">
          {Object.values(TITLE_CATEGORIES).map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={[
                  'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer',
                  isActive
                    ? 'bg-[#6b2832] text-white shadow-xs font-bold'
                    : 'text-[#6b2832]/75 hover:text-[#6b2832] hover:bg-white/80',
                ].join(' ')}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Description & Progress */}
        <div className="px-5 py-2.5 bg-white/70 border-b border-[#f5ede7] flex items-center justify-between text-xs text-[rgb(var(--color-neutral))]/70">
          <span className="font-medium">{TITLE_CATEGORIES[activeCategory]?.desc}</span>
          <span className="font-mono text-[11px] font-bold text-[#6b2832] bg-[#f0e4de] px-2.5 py-0.5 rounded-full shrink-0">
            {totalUnlockedInCategory} / {filteredTitles.length} desbloqueados
          </span>
        </div>

        {/* Titles List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {filteredTitles.map((title) => {
            const isUnlocked = unlockedSet.has(title.id);
            const isEquipped = title.id === currentTitleId || title.name === currentTitleName;
            const rarityStyle = RARITY_BADGES[title.rarity] || RARITY_BADGES.common;

            return (
              <div
                key={title.id}
                className={[
                  'flex items-start justify-between gap-3.5 rounded-xl border p-3.5 transition-all',
                  isEquipped
                    ? 'bg-[#fbf5f2] border-[#ebdcd3] ring-1 ring-[#6b2832]/15 shadow-2xs'
                    : isUnlocked
                    ? 'bg-white/85 border-[#eaded6]/80 hover:border-[#dfcfc5] hover:bg-white shadow-2xs'
                    : 'bg-[#faf7f5]/80 border-[#eaded6]/50 opacity-75',
                ].join(' ')}
              >
                {/* Title Info */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={[
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm border',
                      isEquipped
                        ? 'bg-[#f4e6e0] border-[#ebdcd3] text-[#6b2832]'
                        : isUnlocked
                        ? 'bg-[#fff9ea] border-[#f2d89f] text-[#c98a2c]'
                        : 'bg-[#f0e8e4] border-[#eaded6]/70 text-[rgb(var(--color-neutral))]/40',
                    ].join(' ')}
                  >
                    {isUnlocked ? (
                      <Icon name="sparkles" className="w-4 h-4 text-[#c98a2c]" />
                    ) : (
                      <Icon name="lock" className="w-3.5 h-3.5 text-[rgb(var(--color-neutral))]/45" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={[
                          'text-xs sm:text-sm font-bold',
                          isUnlocked ? 'text-[#6b2832]' : 'text-[rgb(var(--color-neutral))]/60',
                        ].join(' ')}
                      >
                        {title.name}
                      </span>

                      <span
                        className={[
                          'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                          rarityStyle.bg,
                          rarityStyle.text,
                          rarityStyle.border,
                        ].join(' ')}
                      >
                        {rarityStyle.label}
                      </span>

                      {isEquipped && (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[#6b2832] text-white px-2 py-0.5 rounded-full shadow-2xs">
                          Equipado
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[rgb(var(--color-neutral))]/70 leading-relaxed">
                      {title.description}
                    </p>
                  </div>
                </div>

                {/* Action button / status */}
                <div className="shrink-0 self-center pl-1">
                  {isEquipped ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6b2832] bg-[#f0e4de] px-2.5 py-1 rounded-lg">
                      <Icon name="check-circle" className="w-3.5 h-3.5 text-[#6b2832]" />
                      <span>Activo</span>
                    </span>
                  ) : isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onEquipTitle(title.id, title.name)}
                      disabled={isEquipping}
                      className="inline-flex min-h-[38px] items-center justify-center px-3.5 py-1.5 rounded-xl bg-[#6b2832] hover:bg-[#581f27] text-white text-xs font-semibold shadow-2xs transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                    >
                      {isEquipping ? 'Equipando...' : 'Equipar'}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[rgb(var(--color-neutral))]/50 bg-[#f0e8e4] px-2.5 py-1 rounded-lg">
                      <Icon name="lock" className="w-3 h-3 text-[rgb(var(--color-neutral))]/40" />
                      <span>Bloqueado</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[#f0e4dd] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[rgb(var(--color-neutral))]/70">
          <span>Tu título seleccionado es visible en tu perfil y barra superior.</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[38px] items-center justify-center px-4 py-1.5 rounded-xl border border-[#eaded6] bg-white text-xs font-semibold text-[#6b2832] hover:bg-[#faf4f2] active:scale-98 transition shadow-2xs cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
