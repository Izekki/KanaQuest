import { useEffect, useMemo, useState } from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import { supabase } from '../../services/supabase/client';

const containsJapaneseScript = (value = '') => /[\u3040-\u30ff\u3400-\u9fff]/.test(value);

const statusStyles = {
  correct: 'bg-emerald-100 text-emerald-700',
  wrong: 'bg-red-100 text-red-600',
  pending: 'bg-amber-100 text-amber-700',
};

const statusLabels = {
  correct: 'Correcta',
  wrong: 'Fallada',
  pending: 'Pendiente',
};

export default function HistoryPage() {
  const { user } = useAuthSession();
  const [mode, setMode] = useState('recognize');
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [progressRows, setProgressRows] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      if (!user?.id) {
        if (isMounted) {
          setWords([]);
          setProgressRows([]);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
      }

      try {
        const [wordsResult, progressResult] = await Promise.all([
          supabase
            .from('words')
            .select('id,japanese,hiragana,katakana,romaji,translation,created_at')
            .order('created_at', { ascending: true }),
          supabase
            .from('progress')
            .select('word_id,mode,correct,attempts,last_attempt')
            .eq('user_id', user.id),
        ]);

        if (wordsResult.error) throw wordsResult.error;
        if (progressResult.error) throw progressResult.error;

        if (isMounted) {
          setWords(wordsResult.data ?? []);
          setProgressRows(progressResult.data ?? []);
        }
      } catch (error) {
        console.warn('No se pudo cargar el historial:', error?.message ?? error);
        if (isMounted) {
          setWords([]);
          setProgressRows([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    setPage(1);
  }, [mode]);

  const progressMap = useMemo(() => {
    return progressRows
      .filter((row) => row?.mode === mode)
      .reduce((accumulator, row) => {
        if (row?.word_id) {
          accumulator[row.word_id] = row;
        }
        return accumulator;
      }, {});
  }, [progressRows, mode]);

  const historyItems = useMemo(() => {
    return words.map((word) => {
      const progress = progressMap[word.id];
      const attempts = progress?.attempts ?? 0;
      const correct = Boolean(progress?.correct);
      const status = correct ? 'correct' : attempts > 0 ? 'wrong' : 'pending';

      return {
        id: word.id,
        prompt: word.japanese || word.hiragana || word.katakana || word.romaji || word.translation,
        translation: word.translation,
        status,
        attempts,
        lastAttempt: progress?.last_attempt ?? null,
      };
    });
  }, [progressMap, words]);

  const totals = useMemo(() => {
    return historyItems.reduce(
      (accumulator, item) => {
        accumulator.total += 1;
        accumulator[item.status] += 1;
        return accumulator;
      },
      { total: 0, correct: 0, wrong: 0, pending: 0 }
    );
  }, [historyItems]);

  const totalPages = Math.max(1, Math.ceil(historyItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return historyItems.slice(startIndex, startIndex + pageSize);
  }, [historyItems, page, pageSize]);

  return (
    <section className="grid gap-5">
      <div className="rounded-[1.75rem] border border-[#eaded6] bg-white p-6 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[rgb(var(--color-accent))]/70">Historial</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold text-[rgb(var(--color-accent))] md:text-4xl">Palabras y avances</h1>
          <div className="flex gap-2">
            {['recognize', 'translate'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  mode === option
                    ? 'bg-[rgb(var(--color-accent))] text-white'
                    : 'border border-[#eaded6] bg-white text-[rgb(var(--color-accent))]',
                ].join(' ')}
              >
                {option === 'recognize' ? 'Reconocer' : 'Traducir'}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-[rgb(var(--color-neutral))]/70 sm:grid-cols-4">
          <div className="rounded-2xl bg-[#f9efe9] p-4">
            <div>Total</div>
            <div className="mt-1 text-2xl font-semibold text-[rgb(var(--color-accent))]">{totals.total}</div>
          </div>
          <div className="rounded-2xl bg-[#f3f9f3] p-4">
            <div>Correctas</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-700">{totals.correct}</div>
          </div>
          <div className="rounded-2xl bg-[#fdf1f1] p-4">
            <div>Falladas</div>
            <div className="mt-1 text-2xl font-semibold text-red-600">{totals.wrong}</div>
          </div>
          <div className="rounded-2xl bg-[#fef6e6] p-4">
            <div>Pendientes</div>
            <div className="mt-1 text-2xl font-semibold text-amber-700">{totals.pending}</div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[#eaded6] bg-white p-6 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        {loading ? (
          <p className="text-sm text-[rgb(var(--color-neutral))]/70">Cargando historial...</p>
        ) : null}
        {!loading && !historyItems.length ? (
          <p className="text-sm text-[rgb(var(--color-neutral))]/70">Aun no hay palabras para mostrar.</p>
        ) : null}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {pagedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#eaded6] bg-[#fffdfb] p-4">
              <div>
                <div className={['text-lg font-semibold text-[rgb(var(--color-accent))]', containsJapaneseScript(item.prompt) ? 'font-jp' : ''].join(' ')}>{item.prompt}</div>
                <div className="text-sm text-[rgb(var(--color-neutral))]/70">{item.translation}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[rgb(var(--color-neutral))]/50">
                  Intentos: {item.attempts}
                </div>
              </div>
              <span className={['rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', statusStyles[item.status]].join(' ')}>
                {statusLabels[item.status]}
              </span>
            </div>
          ))}
        </div>

        {historyItems.length > pageSize ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-[rgb(var(--color-neutral))]/70">
              Pagina {page} de {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-full border border-[#eaded6] bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--color-accent))]"
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="rounded-full bg-[rgb(var(--color-accent))] px-4 py-2 text-sm font-semibold text-white"
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
