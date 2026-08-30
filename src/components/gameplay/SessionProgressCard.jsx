export default function SessionProgressCard({ streak, questionNumber, totalQuestions, score, progress = 0, className = '' }) {
  return (
    <section className={['rounded-[1.3rem] border border-[#eaded6] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(128,43,56,0.06)] sm:px-5 sm:py-4', className].join(' ')}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs font-medium text-[rgb(var(--color-neutral))] sm:text-sm">
        <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-lg text-xs">
          ⚡ Combo: {streak}
        </span>
        <span className="text-center">Pregunta {questionNumber} de {totalQuestions}</span>
        <span>Puntuación: {score} XP</span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#ecd8d0]">
        <div className="h-full rounded-full bg-[rgb(var(--color-accent))]" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}