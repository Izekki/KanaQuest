import React from 'react';
import Icon from '../ui/Icon';

export default function ProfileStatsStrip({
  streak = 0,
  experience = 0,
  learnedCount = 0,
  totalWords = 0,
  level = 1,
}) {
  const stats = [
    {
      id: 'streak',
      label: 'Racha',
      value: `${streak} ${streak === 1 ? 'día' : 'días'}`,
      hint: streak > 0 ? '¡Estudio constante!' : 'Inicia tu racha hoy',
      iconName: 'fire-streak',
      iconColor: 'text-amber-500',
    },
    {
      id: 'xp',
      label: 'Experiencia',
      value: `${experience.toLocaleString()} XP`,
      hint: `Nivel ${level} de maestría`,
      iconName: 'star-mastery',
      iconColor: 'text-[#c98a2c]',
    },
    {
      id: 'learned',
      label: 'Palabras',
      value: `${learnedCount.toLocaleString()} ${learnedCount === 1 ? 'aprendida' : 'aprendidas'}`,
      hint: totalWords > 0 ? `De ${totalWords} disponibles` : 'Dominio en progreso',
      iconName: 'book-open',
      iconColor: 'text-emerald-700',
    },
  ];

  return (
    <section aria-label="Estadísticas de progreso">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6b2832]/80">
          Tu Progreso
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center gap-3.5 rounded-xl border border-[#eaded6]/80 bg-white/80 p-3.5 sm:p-4 shadow-2xs backdrop-blur-xs transition hover:border-[#dfcfc5] hover:bg-white"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf4f0] border border-[#f0e4de]">
              <Icon name={stat.iconName} className={`w-5 h-5 ${stat.iconColor}`} />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60">
                {stat.label}
              </span>
              <div className="text-base sm:text-lg font-extrabold text-[#6b2832] leading-tight truncate">
                {stat.value}
              </div>
              <p className="text-[11px] text-[rgb(var(--color-neutral))]/60 truncate">
                {stat.hint}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
