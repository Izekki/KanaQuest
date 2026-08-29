import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import { fetchTopicsWithProgress } from '../../services/supabase/sentences';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

/**
 * Returns a human-friendly difficulty label and color variant
 * @param {number} level
 */
function getDifficultyConfig(level) {
  switch (level) {
    case 1:
      return { label: 'Básico (N5)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🌱' };
    case 2:
      return { label: 'Elemental (N5+)', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🌿' };
    case 3:
      return { label: 'Intermedio (N4)', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🌸' };
    default:
      return { label: `Nivel ${level}`, color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '⭐' };
  }
}

/**
 * SentenceBuilderLobby Component
 *
 * Topic selection lobby for the Sentence Builder game mode.
 * Displays all available grammatical topics, difficulty levels, and user progress.
 */
export default function SentenceBuilderLobby() {
  const { user } = useAuthSession();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await fetchTopicsWithProgress(user?.id);
      if (fetchErr) throw fetchErr;
      setTopics(data || []);
    } catch (err) {
      console.error('Error loading topics in lobby:', err);
      setError('No se pudieron cargar los temas de oraciones. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [user?.id]);

  const handleSelectTopic = (topicId) => {
    navigate(`/sentence-builder?topic=${topicId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 py-2 sm:py-4">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/game"
            className="inline-flex min-h-[36px] items-center gap-2 text-sm font-semibold text-accent hover:text-accentDark transition-colors"
          >
            <span>←</span> Volver a Modos de Juego
          </Link>
          <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-neutral))]">
            Constructor de Oraciones ⛩️
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70">
            Selecciona un tema para practicar la estructura y gramática japonesa ordenando fichas.
          </p>
        </div>

        {/* Global Summary Badge */}
        {!loading && topics.length > 0 && (
          <div className="flex items-center gap-3 self-start rounded-2xl border border-[#eaded6] bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm sm:self-auto">
            <span className="text-xl">📚</span>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold uppercase tracking-wider text-accent/80">
                {topics.length} Temas Disponibles
              </div>
              <div className="text-xs text-[rgb(var(--color-neutral))]/70">
                {topics.reduce((acc, t) => acc + (t.total_sentences || 0), 0)} oraciones en total
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 sm:p-6 text-center text-red-800 shadow-sm backdrop-blur-sm">
          <p className="font-semibold">{error}</p>
          <button
            onClick={loadTopics}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-accentDark transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="animate-pulse rounded-2xl border border-[#eaded6] bg-white/70 p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-6 w-28 rounded-full bg-neutral/10" />
                <div className="h-4 w-16 rounded bg-neutral/10" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-3/4 rounded bg-neutral/15" />
                <div className="h-4 w-1/2 rounded bg-neutral/10" />
              </div>
              <div className="h-3 w-full rounded-full bg-neutral/10 pt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Topics Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {topics.map((topic) => {
            const diffConfig = getDifficultyConfig(topic.difficulty_level);

            return (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#eaded6] bg-white/90 p-4 sm:p-6 shadow-[0_10px_30px_rgba(128,43,56,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_rgba(128,43,56,0.12)] cursor-pointer"
              >
                <div>
                  {/* Top Row: Difficulty & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${diffConfig.color}`}
                    >
                      <span>{diffConfig.icon}</span>
                      {diffConfig.label}
                    </span>

                    {topic.is_completed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        ✓ Completado
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[rgb(var(--color-neutral))]/60">
                        {topic.total_sentences} oraciones
                      </span>
                    )}
                  </div>

                  {/* Title Spanish & Japanese */}
                  <div className="mt-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-neutral))] transition-colors group-hover:text-accent leading-snug">
                      {topic.title_es}
                    </h3>
                    {topic.title_jp && (
                      <p className="mt-1 text-sm font-medium text-accent/80 tracking-wide">
                        {topic.title_jp}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Footer */}
                <div className="mt-6 pt-4 border-t border-[#eaded6]/60">
                  <div className="flex items-center justify-between text-xs font-medium text-[rgb(var(--color-neutral))]/75 mb-2">
                    <span>Progreso</span>
                    <span className="font-semibold text-accent">
                      {topic.completed_sentences} / {topic.total_sentences} completadas
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0e6e0]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-[#b86773] transition-all duration-500"
                      style={{ width: `${topic.progress_percentage}%` }}
                    />
                  </div>

                  {/* Action Link button */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60">
                      {topic.progress_percentage}% dominado
                    </span>
                    {topic.is_completed || topic.progress_percentage >= 100 ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#fbf0ec] border border-[#e3b8b1] px-4 py-2 text-xs font-semibold text-[#6b2832] shadow-2xs transition-all hover:bg-[#faece9] active:scale-98"
                      >
                        <span>Repasar Lección</span>
                        <span aria-hidden="true" className="transition-transform group-hover:rotate-45">↺</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#6b2832] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#581f27] active:scale-98"
                      >
                        <span>{topic.completed_sentences > 0 ? 'Continuar Lección' : 'Comenzar Lección'}</span>
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && topics.length === 0 && (
        <div className="rounded-2xl border border-[#eaded6] bg-white/80 p-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-[rgb(var(--color-neutral))]">
            No hay temas registrados por el momento.
          </p>
          <p className="mt-1 text-sm text-[rgb(var(--color-neutral))]/60">
            Pronto añadiremos nuevas lecciones de oraciones para practicar.
          </p>
        </div>
      )}
    </div>
  );
}
