import React, { useState } from 'react';

/**
 * GrammarColorLegend Component
 *
 * Displays an interactive visual guide explaining the semantic colors used for word blocks
 * and highlighting that green is exclusively reserved for victory/correct validation.
 */
export default function GrammarColorLegend({ className = '' }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const legendItems = [
    {
      category: 'Sustantivos y Pronombres',
      pos: 'noun, pronoun',
      example: 'わたし, すし, いす',
      description: 'Sujetos, objetos, lugares y personas.',
      colorClasses: 'border-blue-200 bg-blue-50/70 text-blue-800',
      badgeDot: 'bg-blue-500',
    },
    {
      category: 'Partículas y Conectores',
      pos: 'particle, prefix',
      example: 'は, を, に, の',
      description: 'Indican funciones gramaticales clave.',
      colorClasses: 'border-amber-200 bg-amber-50/70 text-amber-800',
      badgeDot: 'bg-amber-500',
    },
    {
      category: 'Verbos y Acciones',
      pos: 'verb, auxiliary',
      example: 'たべます, あります, です',
      description: 'Acciones, estados y formas verbales.',
      colorClasses: 'border-purple-200 bg-purple-50/70 text-purple-800',
      badgeDot: 'bg-purple-500',
    },
    {
      category: 'Adjetivos y Cualidades',
      pos: 'adjective',
      example: 'すき, おいしい',
      description: 'Expresan descripciones y preferencias.',
      colorClasses: 'border-fuchsia-200 bg-fuchsia-50/70 text-fuchsia-800',
      badgeDot: 'bg-fuchsia-500',
    },
    {
      category: 'Respuesta Correcta (Victoria)',
      pos: 'correct state',
      example: '✓ Oración Completa',
      description: 'Color exclusivo activado al acertar la oración.',
      colorClasses: 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-400 font-bold',
      badgeDot: 'bg-emerald-500',
    },
  ];

  return (
    <aside
      className={[
        'rounded-2xl sm:rounded-3xl border border-[#eaded6] bg-white/95 p-4 sm:p-6 shadow-[0_10px_30px_rgba(128,43,56,0.06)] backdrop-blur-sm transition-all',
        className,
      ].join(' ')}
    >
      {/* Card Header with Collapse Toggle on Mobile/Tablet */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eaded6]/60">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🎨</span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[rgb(var(--color-neutral))] leading-tight">
              Guía de Colores
            </h3>
            <p className="text-[11px] text-[rgb(var(--color-neutral))]/60">
              Categorías gramaticales
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="lg:hidden inline-flex min-h-[36px] items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold text-accent hover:bg-[#f9efea] active:scale-95 transition-all"
          aria-label={isExpanded ? 'Contraer guía' : 'Expandir guía'}
        >
          {isExpanded ? '▲ Ocultar' : '▼ Ver Guía'}
        </button>
      </div>

      {/* Color Items List */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {legendItems.map((item) => (
            <div
              key={item.category}
              className="flex items-start gap-3 rounded-xl border border-cream/40 bg-surface/50 p-2.5 transition-colors hover:bg-surface"
            >
              {/* Demo Badge */}
              <div
                className={[
                  'shrink-0 flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-semibold select-none shadow-2xs',
                  item.colorClasses,
                ].join(' ')}
              >
                {item.example}
              </div>

              {/* Label & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={['h-2 w-2 rounded-full shrink-0', item.badgeDot].join(' ')} />
                  <span className="text-xs font-bold text-[rgb(var(--color-neutral))] truncate">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-[rgb(var(--color-neutral))]/65 leading-tight mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          {/* Educational Tip Box */}
          <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold">💡 Estructura típica:</span>
            <div className="mt-1 flex flex-wrap items-center gap-1 font-medium">
              <span className="rounded bg-blue-100/90 px-1.5 py-0.5 text-blue-800 font-semibold">Sujeto 🔵</span>
              <span>+</span>
              <span className="rounded bg-amber-100/90 px-1.5 py-0.5 text-amber-800 font-semibold">Partícula 🟡</span>
              <span>+</span>
              <span className="rounded bg-purple-100/90 px-1.5 py-0.5 text-purple-800 font-semibold">Verbo 🟣</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
