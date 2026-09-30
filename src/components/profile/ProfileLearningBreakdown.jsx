import React from 'react';

export default function ProfileLearningBreakdown({ learningStats, loading = false }) {
  if (loading) {
    return (
      <section aria-label="Progreso de aprendizaje" className="space-y-3">
        <div className="h-4 w-32 bg-[#eaded6]/60 rounded-md animate-pulse" />
        <div className="rounded-xl border border-[#eaded6]/80 bg-white/80 p-4 space-y-4">
          <div className="h-8 bg-[#f5ede7] rounded-md animate-pulse" />
          <div className="h-8 bg-[#f5ede7] rounded-md animate-pulse" />
          <div className="h-8 bg-[#f5ede7] rounded-md animate-pulse" />
        </div>
      </section>
    );
  }

  if (!learningStats) return null;

  const categories = [
    {
      id: 'hiragana',
      name: 'Hiragana',
      native: '平仮名',
      data: learningStats.hiragana,
      barGradient: 'from-[#8d2c3a] to-[#6b2832]',
    },
    {
      id: 'katakana',
      name: 'Katakana',
      native: '片仮名',
      data: learningStats.katakana,
      barGradient: 'from-[#228b92] to-[#176f75]',
    },
    {
      id: 'kanji',
      name: 'Kanji y Vocabulario',
      native: '漢字',
      data: learningStats.kanji,
      barGradient: 'from-[#d4993a] to-[#a86e1b]',
    },
  ];

  // Only render categories that actually exist in the words catalog (total > 0)
  const activeCategories = categories.filter((c) => (c.data?.total ?? 0) > 0);

  if (activeCategories.length === 0) return null;

  return (
    <section aria-label="Progreso de aprendizaje" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6b2832]/80">
            Tu Aprendizaje
          </h3>
          <p className="text-xs text-[rgb(var(--color-neutral))]/60">
            Dominio de silabarios y caracteres en tu catálogo
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#eaded6]/80 bg-white/80 p-4 sm:p-5 shadow-2xs backdrop-blur-xs space-y-4">
        {activeCategories.map((cat) => {
          const learned = cat.data?.learned ?? 0;
          const total = cat.data?.total ?? 0;
          const percent = cat.data?.percent ?? 0;

          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-[#6b2832] font-bold">{cat.name}</span>
                  <span className="font-jp text-[11px] text-[rgb(var(--color-neutral))]/50">
                    ({cat.native})
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[11px] text-[rgb(var(--color-neutral))]/60">
                    {learned} / {total} aprendidas
                  </span>
                  <span className="font-bold text-[#6b2832]">{percent}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progreso en ${cat.name}: ${percent}%`}
                className="h-2 sm:h-2.5 w-full overflow-hidden rounded-full bg-[#f0e4de]"
              >
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${cat.barGradient} transition-all duration-500 ease-out`}
                  style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
