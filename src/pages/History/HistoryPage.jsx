import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import { getUser } from '../../services/supabase/auth';
import { fetchWordsForHistory } from '../../services/supabase/words';
import { fetchUserProgress } from '../../services/supabase/progress';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const containsJapaneseScript = (value = '') => /[\u3040-\u30ff\u3400-\u9fff]/.test(value);

function formatRelativeTime(dateString) {
  if (!dateString) return 'Sin intentos';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Sin intentos';

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHour < 24) return `Hace ${diffHour} h`;
  if (diffDay === 1) return 'Ayer';
  if (diffDay < 30) return `Hace ${diffDay} días`;

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function speakWord(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.debug('Speech synthesis error:', e);
  }
}

const statusConfig = {
  correct: {
    label: 'Aprendida',
    badgeClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    cardBorder: 'hover:border-emerald-300',
    icon: '✓',
  },
  wrong: {
    label: 'Por repasar',
    badgeClass: 'bg-rose-100/90 text-rose-800 border-rose-200',
    cardBorder: 'hover:border-rose-300',
    icon: '✕',
  },
  pending: {
    label: 'Pendiente',
    badgeClass: 'bg-stone-100 text-stone-600 border-stone-200',
    cardBorder: 'hover:border-stone-300',
    icon: '⏳',
  },
};

const difficultyLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

const modeLabels = {
  recognize: 'Reconocer',
  translate: 'Traducir',
  pair_match: 'Par-Parejas',
};

export default function HistoryPage() {
  const { user } = useAuthSession();
  const { playFlip } = useSoundEffects();

  const [mode, setMode] = useState('recognize');
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [progressRows, setProgressRows] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'pending'
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // 'all' | 'beginner' | 'intermediate' | 'advanced'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'mastery_desc' | 'attempts_desc' | 'recent' | 'alpha'

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // 1. Data Fetching from Supabase
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let activeUserId = user?.id;

      if (!activeUserId) {
        const { data: authData } = await getUser();
        activeUserId = authData?.user?.id;
      }

      if (!activeUserId) {
        setWords([]);
        setProgressRows([]);
        setLoading(false);
        return;
      }

      const [wordsResult, progressResult] = await Promise.all([
        fetchWordsForHistory(),
        fetchUserProgress(activeUserId, mode),
      ]);

      if (wordsResult.error) throw wordsResult.error;
      if (progressResult.error) throw progressResult.error;

      setWords(wordsResult.data ?? []);
      setProgressRows(progressResult.data ?? []);
    } catch (error) {
      console.warn('Error al cargar datos del historial:', error?.message ?? error);
      setWords([]);
      setProgressRows([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, mode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset pagination on filter changes
  useEffect(() => {
    setPage(1);
  }, [mode, searchQuery, statusFilter, difficultyFilter, sortBy]);

  // 2. Correlate Words with Progress per active mode
  const progressMap = useMemo(() => {
    return progressRows.reduce((acc, row) => {
      if (row?.word_id) {
        acc[row.word_id] = row;
      }
      return acc;
    }, {});
  }, [progressRows]);

  const allItems = useMemo(() => {
    return words.map((word) => {
      const progress = progressMap[word.id];
      const attempts = progress?.attempts ?? 0;
      const masteryLevel = progress?.mastery_level ?? 0;
      const isCorrect = Boolean(progress?.correct) || masteryLevel >= 1;
      const status = isCorrect ? 'correct' : attempts > 0 ? 'wrong' : 'pending';

      return {
        ...word,
        progress,
        status,
        attempts,
        masteryLevel,
        lastAttempt: progress?.last_attempt ?? null,
      };
    });
  }, [words, progressMap]);

  // 3. Dynamic Metrics (KPIs)
  const totals = useMemo(() => {
    const total = allItems.length;
    let correct = 0;
    let wrong = 0;
    let pending = 0;

    allItems.forEach((item) => {
      if (item.status === 'correct') correct += 1;
      else if (item.status === 'wrong') wrong += 1;
      else pending += 1;
    });

    const masteryPercent = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { total, correct, wrong, pending, masteryPercent };
  }, [allItems]);

  // 4. Filtering and Sorting
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((item) => {
        const japanese = (item.japanese || '').toLowerCase();
        const hiragana = (item.hiragana || '').toLowerCase();
        const katakana = (item.katakana || '').toLowerCase();
        const romaji = (item.romaji || '').toLowerCase();
        const translation = (item.translation || '').toLowerCase();

        return (
          japanese.includes(q) ||
          hiragana.includes(q) ||
          katakana.includes(q) ||
          romaji.includes(q) ||
          translation.includes(q)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      result = result.filter((item) => item.difficulty === difficultyFilter);
    }

    // Sorting
    if (sortBy === 'mastery_desc') {
      result.sort((a, b) => b.masteryLevel - a.masteryLevel || b.attempts - a.attempts);
    } else if (sortBy === 'attempts_desc') {
      result.sort((a, b) => b.attempts - a.attempts);
    } else if (sortBy === 'recent') {
      result.sort((a, b) => {
        if (!a.lastAttempt) return 1;
        if (!b.lastAttempt) return -1;
        return new Date(b.lastAttempt) - new Date(a.lastAttempt);
      });
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => (a.romaji || a.japanese || '').localeCompare(b.romaji || b.japanese || ''));
    }

    return result;
  }, [allItems, searchQuery, statusFilter, difficultyFilter, sortBy]);

  // 5. Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, page, pageSize]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDifficultyFilter('all');
    setSortBy('default');
  };

  return (
    <section className="grid gap-5 w-full max-w-7xl mx-auto">
      {/* Header & Mode Switcher */}
      <div className="rounded-[1.75rem] border border-[#eaded6] bg-white p-4 sm:p-6 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[rgb(var(--color-accent))]/70">
              Historial & Avances
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[rgb(var(--color-accent))] md:text-4xl">
              Palabras y Progreso
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[rgb(var(--color-neutral))]/75">
              Consulta tu dominio de vocabulario, niveles de maestría y estadísticas por modo de juego.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-[#fbf5f2] p-1.5 border border-[#eaded6] self-start md:self-auto overflow-x-auto max-w-full">
            {['recognize', 'translate', 'pair_match'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  playFlip();
                  setMode(option);
                }}
                className={[
                  'rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap min-h-[40px]',
                  mode === option
                    ? 'bg-[rgb(var(--color-accent))] text-white shadow-sm'
                    : 'text-[rgb(var(--color-neutral))]/70 hover:text-[rgb(var(--color-accent))] hover:bg-white',
                ].join(' ')}
              >
                {modeLabels[option]}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Cards (KPIs) */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl bg-[#fdf8f6] p-3 sm:p-4 border border-[#f2e6df] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[rgb(var(--color-neutral))]/70 uppercase tracking-wider">
                Total Palabras
              </span>
              <span className="text-sm">📚</span>
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-[rgb(var(--color-accent))]">
              {loading ? '—' : totals.total}
            </div>
            <div className="mt-1 text-[11px] text-[rgb(var(--color-neutral))]/60">
              En el vocabulario activo
            </div>
          </div>

          {/* Correctas */}
          <div className="rounded-2xl bg-emerald-50/70 p-3 sm:p-4 border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800/80 uppercase tracking-wider">
                Aprendidas
              </span>
              <span className="text-sm">✅</span>
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {loading ? '—' : totals.correct}
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium">
              {totals.masteryPercent}% del total dominado
            </div>
          </div>

          {/* Falladas */}
          <div className="rounded-2xl bg-rose-50/70 p-3 sm:p-4 border border-rose-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800/80 uppercase tracking-wider">
                Por Repasar
              </span>
              <span className="text-sm">⚠️</span>
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-600">
              {loading ? '—' : totals.wrong}
            </div>
            <div className="mt-1 text-[11px] text-rose-500">
              Con fallos o bajo dominio
            </div>
          </div>

          {/* Pendientes */}
          <div className="rounded-2xl bg-amber-50/70 p-3 sm:p-4 border border-amber-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800/80 uppercase tracking-wider">
                Pendientes
              </span>
              <span className="text-sm">⏳</span>
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-700">
              {loading ? '—' : totals.pending}
            </div>
            <div className="mt-1 text-[11px] text-amber-600">
              Aún sin practicar en este modo
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="rounded-[1.75rem] border border-[#eaded6] bg-white p-4 sm:p-6 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por kanji, kana, romaji o traducción..."
              className="w-full rounded-2xl border border-[#eaded6] bg-[#fdfaf8] px-4 py-2.5 pl-10 text-sm text-[rgb(var(--color-neutral))] outline-none transition focus:border-[rgb(var(--color-accent))] focus:bg-white focus:ring-2 focus:ring-[rgb(var(--color-accent))]/20"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[rgb(var(--color-neutral))]/40 select-none">
              🔍
            </span>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs text-[rgb(var(--color-neutral))]/50 hover:bg-black/5"
              >
                ✕
              </button>
            ) : null}
          </div>

          {/* Filter selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-[#f8ebe6] p-1 border border-[#eaded6]/60 text-xs">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'correct', label: 'Aprendidas' },
                { id: 'wrong', label: 'Por repasar' },
                { id: 'pending', label: 'Pendientes' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id)}
                  className={[
                    'rounded-lg px-2.5 py-1.5 font-medium transition-all',
                    statusFilter === filter.id
                      ? 'bg-white text-[rgb(var(--color-accent))] shadow-xs font-semibold'
                      : 'text-[rgb(var(--color-neutral))]/70 hover:text-[rgb(var(--color-neutral))]',
                  ].join(' ')}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Difficulty select */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-xl border border-[#eaded6] bg-white px-3 py-2 text-xs font-medium text-[rgb(var(--color-neutral))] outline-none focus:border-[rgb(var(--color-accent))]"
              aria-label="Filtrar por dificultad"
            >
              <option value="all">Todas las dificultades</option>
              <option value="beginner">Principiante (N5)</option>
              <option value="intermediate">Intermedio (N4)</option>
              <option value="advanced">Avanzado (N3+)</option>
            </select>

            {/* Sort order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-[#eaded6] bg-white px-3 py-2 text-xs font-medium text-[rgb(var(--color-neutral))] outline-none focus:border-[rgb(var(--color-accent))]"
              aria-label="Ordenar palabras"
            >
              <option value="default">Orden por defecto</option>
              <option value="mastery_desc">Mayor maestría</option>
              <option value="attempts_desc">Más intentos</option>
              <option value="recent">Recientes primero</option>
              <option value="alpha">Alfabético</option>
            </select>
          </div>
        </div>

        {/* Active search summary */}
        <div className="mt-3 flex items-center justify-between text-xs text-[rgb(var(--color-neutral))]/60">
          <span>
            Mostrando <strong>{filteredItems.length}</strong> de {allItems.length} palabras registradas
          </span>
          {searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all' || sortBy !== 'default' ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[rgb(var(--color-accent))] hover:underline font-semibold"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {/* Word Grid or Skeleton */}
        {loading ? (
          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[#eaded6] bg-[#fdfbf9] p-4 space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-[#ebdcd4] rounded-full" />
                  <div className="h-4 w-20 bg-[#ebdcd4] rounded-full" />
                </div>
                <div className="h-10 w-24 bg-[#ebdcd4] rounded-lg mx-auto" />
                <div className="h-4 w-32 bg-[#ebdcd4] rounded mx-auto" />
                <div className="h-3 w-20 bg-[#ebdcd4] rounded mx-auto" />
                <div className="h-2 w-full bg-[#ebdcd4] rounded-full pt-1" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="my-8 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-[#eaded6] bg-[#fdfbf9]">
            <span className="text-4xl mb-2">🔍</span>
            <h3 className="text-base font-semibold text-[rgb(var(--color-accent))]">
              No se encontraron palabras
            </h3>
            <p className="mt-1 max-w-sm text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70">
              No hay palabras que coincidan con los filtros o término de búsqueda aplicado.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-3.5 rounded-xl bg-[rgb(var(--color-accent))] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pagedItems.map((item) => {
              const statusCfg = statusConfig[item.status] || statusConfig.pending;
              const hasJapanesePrompt = containsJapaneseScript(item.japanese || item.hiragana);

              return (
                <div
                  key={item.id}
                  className={[
                    'group relative flex flex-col justify-between rounded-2xl border border-[#eaded6] bg-[#fffdfb] p-4 shadow-sm transition-all duration-200 hover:shadow-md',
                    statusCfg.cardBorder,
                  ].join(' ')}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="rounded-full bg-[#f6eadf] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-accent))]">
                      {difficultyLabels[item.difficulty] || item.difficulty || 'Nivel ' + (item.level || 1)}
                    </span>

                    <span
                      className={[
                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        statusCfg.badgeClass,
                      ].join(' ')}
                    >
                      <span aria-hidden="true">{statusCfg.icon}</span>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="my-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={[
                          'text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-accent))] leading-tight tracking-tight',
                          hasJapanesePrompt ? 'font-jp' : '',
                        ].join(' ')}
                      >
                        {item.japanese || item.hiragana || item.romaji}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakWord(item.japanese || item.hiragana)}
                        className="rounded-full p-1.5 text-[rgb(var(--color-accent))]/50 hover:bg-[#f8ebe6] hover:text-[rgb(var(--color-accent))] transition"
                        title="Escuchar pronunciación"
                        aria-label="Escuchar pronunciación"
                      >
                        🔊
                      </button>
                    </div>

                    {/* Readings */}
                    <div className="mt-1 text-xs text-[rgb(var(--color-neutral))]/70 font-medium">
                      {item.hiragana && item.hiragana !== item.japanese ? (
                        <span>{item.hiragana} · </span>
                      ) : null}
                      <span className="font-mono text-[11px] text-[rgb(var(--color-accent))]/80">
                        {item.romaji}
                      </span>
                    </div>

                    {/* Translation */}
                    <div className="mt-2 text-sm font-semibold text-[rgb(var(--color-neutral))] line-clamp-2">
                      {item.translation}
                    </div>
                  </div>

                  {/* Footer Stats & Mastery Level */}
                  <div className="border-t border-[#f2e7e1] pt-3 text-[11px] text-[rgb(var(--color-neutral))]/60">
                    <div className="flex items-center justify-between">
                      <span>Maestría:</span>
                      <div className="flex items-center gap-0.5" title={`Nivel de maestría: ${item.masteryLevel}/5`}>
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <span
                            key={starIndex}
                            className={
                              starIndex < item.masteryLevel
                                ? 'text-amber-500 font-bold'
                                : 'text-stone-300'
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between">
                      <span>Intentos: <strong>{item.attempts}</strong></span>
                      <span className="truncate max-w-[120px]" title={item.lastAttempt ? new Date(item.lastAttempt).toLocaleString() : ''}>
                        {formatRelativeTime(item.lastAttempt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination controls */}
        {!loading && filteredItems.length > pageSize ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#f2e7e1] pt-4">
            <div className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70 text-center sm:text-left">
              Página <strong>{page}</strong> de <strong>{totalPages}</strong> (
              {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredItems.length)} de{' '}
              {filteredItems.length} palabras)
            </div>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playFlip();
                  setPage((current) => Math.max(1, current - 1));
                }}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-[#eaded6] bg-white px-4 py-1.5 text-xs sm:text-sm font-semibold text-[rgb(var(--color-accent))] active:scale-98 transition-colors disabled:opacity-40"
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => {
                  playFlip();
                  setPage((current) => Math.min(totalPages, current + 1));
                }}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-[rgb(var(--color-accent))] px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm active:scale-98 transition-colors disabled:opacity-40"
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
