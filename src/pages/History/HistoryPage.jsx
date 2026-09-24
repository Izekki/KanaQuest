import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import { getUser } from '../../services/supabase/auth';
import { fetchWordsForHistory } from '../../services/supabase/words';
import { fetchUserProgress } from '../../services/supabase/progress';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import Icon from '../../components/ui/Icon';

const containsJapaneseScript = (value = '') => /[\u3040-\u30ff\u3400-\u9fff]/.test(value);

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
    dotColor: 'bg-emerald-500',
    textColor: 'text-emerald-800',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  wrong: {
    label: 'Por repasar',
    dotColor: 'bg-rose-500',
    textColor: 'text-rose-800',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  pending: {
    label: 'Pendiente',
    dotColor: 'bg-stone-300',
    textColor: 'text-stone-600',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-200',
  },
};

const modeLabels = {
  recognize: 'Reconocer',
  translate: 'Traducir',
  pair_match: 'Par-Parejas',
};

export default function HistoryPage() {
  const { user } = useAuthSession();
  const { playFlip } = useSoundEffects();
  const navigate = useNavigate();

  const [mode, setMode] = useState('recognize');
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [progressRows, setProgressRows] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'pending'
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // 'all' | 'beginner' | 'intermediate' | 'advanced'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
        // Fallback for guest mode or browsing
        const { data: wordsData, error: wordsErr } = await fetchWordsForHistory();
        if (wordsErr) throw wordsErr;
        setWords(wordsData ?? []);
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
      console.warn('Error al cargar vocabulario:', error?.message ?? error);
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
  }, [mode, searchQuery, statusFilter, difficultyFilter]);

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
      };
    });
  }, [words, progressMap]);

  // 3. Dynamic Counts
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

    return { total, correct, wrong, pending };
  }, [allItems]);

  // 4. Filtering
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((item) => {
        const matchesJp = item.japanese?.toLowerCase().includes(q);
        const matchesHiragana = item.hiragana?.toLowerCase().includes(q);
        const matchesKatakana = item.katakana?.toLowerCase().includes(q);
        const matchesRomaji = item.romaji?.toLowerCase().includes(q);
        const matchesTranslation = item.translation?.toLowerCase().includes(q);
        return matchesJp || matchesHiragana || matchesKatakana || matchesRomaji || matchesTranslation;
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

    return result;
  }, [allItems, searchQuery, statusFilter, difficultyFilter]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-8 space-y-5 sm:space-y-6">
      {/* 1. HEADER: Title & Mode Switcher */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#eaded6]/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#6b2832]">
            Vocabulario
          </h1>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70 mt-0.5">
            Diccionario de aprendizaje y registro de palabras.
          </p>
        </div>

        {/* Practice Mode Tabs */}
        <div className="inline-flex items-center p-1 bg-[#f5ebe6]/80 border border-[#eaded6] rounded-xl text-xs font-semibold self-start sm:self-auto">
          {['recognize', 'translate', 'pair_match'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                playFlip();
                setMode(option);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === option
                  ? 'bg-[#6b2832] text-white shadow-xs'
                  : 'text-[#6b2832]/70 hover:text-[#6b2832]'
              }`}
            >
              {modeLabels[option]}
            </button>
          ))}
        </div>
      </header>

      {/* 2. SEARCH & STREAMLINED STATUS FILTERS */}
      <section className="space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por kanji, kana, romaji o significado en español..."
            className="w-full min-h-[48px] rounded-2xl border border-[#eaded6] bg-white px-4 pl-11 text-sm sm:text-base text-[rgb(var(--color-neutral))] outline-none transition focus:border-[#6b2832] focus:ring-2 focus:ring-[#6b2832]/10 placeholder:text-[rgb(var(--color-neutral))]/40"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
            <Icon name="magnifier" className="w-4 h-4 text-[#6b2832]/50" />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-stone-400 hover:text-[#6b2832]"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Primary Status Tabs & Summary Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center p-0.5 bg-[#f5ebe6]/60 border border-[#eaded6] rounded-xl text-xs font-medium">
            {[
              { id: 'all', label: 'Todos', count: totals.total },
              { id: 'correct', label: 'Aprendidas', count: totals.correct },
              { id: 'wrong', label: 'Por repasar', count: totals.wrong },
              { id: 'pending', label: 'Pendientes', count: totals.pending },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-[#6b2832] text-white font-bold shadow-2xs'
                    : 'text-[#6b2832]/75 hover:text-[#6b2832]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="opacity-70 font-mono text-[11px]">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Advanced Difficulty Filter Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters((p) => !p)}
              className="text-xs font-semibold text-[#6b2832]/75 hover:text-[#6b2832] py-1 px-2 rounded-lg hover:bg-black/5 transition"
            >
              {showAdvancedFilters ? 'Ocultar nivel ▲' : 'Filtrar nivel ▼'}
            </button>
            <span className="text-xs text-[rgb(var(--color-neutral))]/60">
              {filteredItems.length} palabras
            </span>
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        {showAdvancedFilters && (
          <div className="p-3 bg-[#fdfaf8] border border-[#eaded6] rounded-2xl flex flex-wrap items-center gap-3 animate-fadeIn text-xs">
            <span className="font-bold text-[#6b2832]">Nivel JLPT:</span>
            {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficultyFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  difficultyFilter === lvl
                    ? 'bg-[#6b2832] text-white'
                    : 'bg-white border border-[#eaded6] text-[#6b2832]/70 hover:text-[#6b2832]'
                }`}
              >
                {lvl === 'all'
                  ? 'Todos'
                  : lvl === 'beginner'
                  ? 'N5 (Principiante)'
                  : lvl === 'intermediate'
                  ? 'N4 (Intermedio)'
                  : 'N3+ (Avanzado)'}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 3. VOCABULARY GRID: High legibility, dominant Japanese prompt */}
      <main>
        {loading ? (
          <div className="py-20 text-center text-sm font-semibold text-[#6b2832]/60 animate-pulse">
            Cargando diccionario de palabras...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-[#eaded6] rounded-3xl bg-[#fdfbf9] space-y-2">
            <div className="text-3xl text-stone-300">📖</div>
            <h3 className="text-base font-bold text-[#6b2832]">No se encontraron palabras</h3>
            <p className="text-xs text-[rgb(var(--color-neutral))]/70">
              Prueba cambiando el filtro de búsqueda o el estado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {pagedItems.map((item) => {
              const statusCfg = statusConfig[item.status] || statusConfig.pending;
              const hasJapanese = containsJapaneseScript(item.japanese || item.hiragana);

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#eaded6] bg-white p-4 shadow-2xs hover:shadow-md hover:border-[#6b2832]/30 transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Top Bar: Kanji/Word Protagonist + Audio */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div
                        className={`text-3xl sm:text-4xl font-bold text-[#6b2832] tracking-tight leading-tight select-none ${
                          hasJapanese ? 'font-jp' : ''
                        }`}
                      >
                        {item.japanese || item.hiragana || item.romaji}
                      </div>

                      {/* Reading: Hiragana & Romaji */}
                      <div className="mt-1 text-xs text-[rgb(var(--color-neutral))]/70 font-medium">
                        {item.hiragana && item.hiragana !== item.japanese ? (
                          <span>{item.hiragana} · </span>
                        ) : null}
                        <span className="font-mono text-[#6b2832]/80">{item.romaji}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakWord(item.japanese || item.hiragana)}
                      className="rounded-full p-2 text-[#6b2832]/60 hover:text-[#6b2832] hover:bg-[#f5ebe6] transition cursor-pointer shrink-0"
                      title="Escuchar pronunciación"
                      aria-label="Escuchar pronunciación"
                    >
                      <Icon name="volume-high" className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Translation: Spanish Meaning */}
                  <div className="text-sm sm:text-base font-semibold text-[rgb(var(--color-neutral))] leading-snug">
                    {item.translation}
                  </div>

                  {/* Clean Status Dot & Label */}
                  <div className="pt-2 border-t border-[#f2e7e1] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className={`h-2 w-2 rounded-full ${statusCfg.dotColor}`} />
                      <span className={statusCfg.textColor}>{statusCfg.label}</span>
                    </div>

                    {item.difficulty && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-neutral))]/50">
                        {item.difficulty === 'beginner'
                          ? 'N5'
                          : item.difficulty === 'intermediate'
                          ? 'N4'
                          : 'N3+'}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 4. PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-[#eaded6]/60 text-xs sm:text-sm">
            <span className="text-[rgb(var(--color-neutral))]/70">
              Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-[#eaded6] bg-white font-semibold text-[#6b2832] disabled:opacity-40 hover:bg-[#faf4f2] transition cursor-pointer"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-[#6b2832] font-semibold text-white disabled:opacity-40 hover:bg-[#581f27] transition cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
