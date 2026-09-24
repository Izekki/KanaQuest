import React from 'react';
import Icon from '../ui/Icon';

export default function SessionProgressCard({ streak, questionNumber, totalQuestions, score, progress = 0, className = '' }) {
  return (
    <section className={['rounded-[1.3rem] border border-[#eaded6] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(128,43,56,0.06)] sm:px-5 sm:py-4', className].join(' ')}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs font-medium text-[rgb(var(--color-neutral))] sm:text-sm">
        <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-lg text-xs inline-flex items-center gap-1">
          <Icon name="lightning" className="w-3.5 h-3.5 text-amber-600" />
          <span>Combo: {streak}</span>
        </span>
        <span className="text-center font-medium">Pregunta {questionNumber} de {totalQuestions}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#6b2832]">
          <Icon name="sparkles" className="w-3.5 h-3.5 text-amber-600" />
          <span>{score} XP</span>
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#ecd8d0]">
        <div className="h-full rounded-full bg-[#6b2832] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}