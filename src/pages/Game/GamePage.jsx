import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase/client';
import { useAuthSession } from '../../hooks/useAuthSession';

const players = [
  { name: 'Hana (Tú)', xp: 2350, tone: 'from-[#d95f76] to-[#8b2d3f]' },
  { name: 'Kenji', xp: 1980, tone: 'from-[#5d95c7] to-[#2f5375]' },
  { name: 'Yuki', xp: 1570, tone: 'from-[#c97b8a] to-[#7f4f63]' },
];

const modeCards = [
  {
    id: 'recognize',
    label: 'Reconocer',
    crown: true,
    active: true,
    description: 'Imagen / Kanji → Escribir lectura',
  },
  {
    id: 'translate',
    label: 'Traducir',
    crown: false,
    active: false,
    description: 'Kana / Kanji → Escribir significado',
  },
];

const sessionStats = {
  streak: 7,
  questionNumber: 4,
  totalQuestions: 10,
  score: 2350,
  progress: 40,
};

const currentQuestion = {
  kanji: '猫',
  reading: 'ねこ',
  imageLabel: 'Gato atigrado amistoso',
};

const normalize = (value) => value.trim().toLowerCase().normalize('NFKC');

const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const HIRAGANA_START = 0x3041;
const HIRAGANA_END = 0x3096;
const KANA_SHIFT = 0x60;

const containsJapaneseScript = (value = '') => /[\u3040-\u30ff\u3400-\u9fff]/.test(value);

const toHiragana = (value = '') =>
  Array.from(value)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= KATAKANA_START && code <= KATAKANA_END) {
        return String.fromCharCode(code - KANA_SHIFT);
      }
      return char;
    })
    .join('');

const toKatakana = (value = '') =>
  Array.from(value)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= HIRAGANA_START && code <= HIRAGANA_END) {
        return String.fromCharCode(code + KANA_SHIFT);
      }
      return char;
    })
    .join('');

const getAcceptedAnswers = (answers, mode) => {
  const base = (answers ?? []).filter(Boolean).map((item) => item.toString());

  if (mode !== 'translate') {
    return base;
  }

  const expanded = new Set();

  base.forEach((item) => {
    expanded.add(item);
    expanded.add(toHiragana(item));
    expanded.add(toKatakana(item));
  });

  return [...expanded];
};

const getAnswersFromWord = (word, mode) => {
  const modeAnswers = word?.accepted_answers?.[mode];

  if (Array.isArray(modeAnswers) && modeAnswers.length) {
    return modeAnswers;
  }

  if (mode === 'translate') {
    return [word?.japanese, word?.hiragana, word?.katakana, word?.romaji].filter(Boolean);
  }

  return [word?.translation, word?.romaji].filter(Boolean);
};

const getModeLabel = (value) => (value === 'translate' ? 'Traducir' : 'Reconocer');

function Avatar({ label, tone }) {
  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-sm font-semibold text-white shadow-sm`}>
      {label}
    </div>
  );
}

function CatIllustration() {
  return (
    <div className="relative flex h-[220px] w-[220px] items-center justify-center rounded-full bg-[#f5dbe0] shadow-[0_10px_25px_rgba(128,43,56,0.12)]">
      <svg viewBox="0 0 220 220" className="h-[180px] w-[180px] drop-shadow-[0_10px_12px_rgba(128,43,56,0.15)]" aria-hidden="true">
        <defs>
          <linearGradient id="catFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d7c0a7" />
            <stop offset="50%" stopColor="#b99778" />
            <stop offset="100%" stopColor="#8f6b53" />
          </linearGradient>
        </defs>
        <ellipse cx="110" cy="117" rx="58" ry="68" fill="url(#catFur)" />
        <path d="M68 64 89 94 76 98 58 74c4-5 6-8 10-10Z" fill="url(#catFur)" />
        <path d="M152 64 131 94 144 98 162 74c-4-5-6-8-10-10Z" fill="url(#catFur)" />
        <circle cx="110" cy="84" r="42" fill="#dfc8ab" />
        <path d="M110 107c-11 0-18 6-18 12h36c0-6-7-12-18-12Z" fill="#6f4e3d" opacity="0.7" />
        <circle cx="92" cy="83" r="5" fill="#4b3429" />
        <circle cx="128" cy="83" r="5" fill="#4b3429" />
        <path d="M86 78h-12l-10-7M134 78h12l10-7" stroke="#6f4e3d" strokeWidth="4" strokeLinecap="round" />
        <path d="M99 92h22" stroke="#6f4e3d" strokeWidth="4" strokeLinecap="round" />
        <path d="M110 101v12" stroke="#6f4e3d" strokeWidth="4" strokeLinecap="round" />
        <path d="M78 56c8-8 17-12 32-13" stroke="#7f5d47" strokeWidth="5" strokeLinecap="round" />
        <path d="M142 56c-8-8-17-12-32-13" stroke="#7f5d47" strokeWidth="5" strokeLinecap="round" />
        <path d="M80 110c7-4 13-5 20-3M140 110c-7-4-13-5-20-3" stroke="#a0795e" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        <path d="M76 145c10 11 25 17 34 17s24-6 34-17" stroke="#7a5d4b" strokeWidth="6" strokeLinecap="round" />
        <path d="M93 122c4-4 9-6 17-6s13 2 17 6" stroke="#7c5a47" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
        <path d="M89 152c6 4 13 6 21 6s15-2 21-6" stroke="#6e4f40" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <path d="M79 92l-28-8M79 100l-30 0M141 92l28-8M141 100l30 0" stroke="#8f6a52" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </svg>
    </div>
  );
}

function KeyboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-[rgb(var(--color-accent))]">
      <path
        fill="currentColor"
        d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2v8h16V8H4Zm2 1h2v2H6V9Zm3 0h2v2H9V9Zm3 0h2v2h-2V9Zm3 0h2v2h-2V9Zm3 0h2v2h-2V9ZM6 12h2v2H6v-2Zm3 0h8v2H9v-2Zm9 0h2v2h-2v-2Zm-12 3h12v2H6v-2Z"
      />
    </svg>
  );
}

export default function GamePage() {
  const { user } = useAuthSession();
  const [mode, setMode] = useState('recognize');
  const [deckData, setDeckData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewItems, setReviewItems] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadWords = async () => {
      try {
        const { data, error } = await supabase
          .from('words')
          .select('id,japanese,hiragana,katakana,romaji,translation,accepted_answers,difficulty,type_id')
          .limit(200);
        if (error) throw error;

        const rows = data ?? [];
        const shuffled = [...rows].sort(() => Math.random() - 0.5);

        const recognize = shuffled.map((row) => ({
          wordId: row.id,
          prompt: row.japanese || row.hiragana || row.katakana || row.romaji || row.translation,
          answers: getAnswersFromWord(row, 'recognize'),
          instruction: 'Escribe el significado (español o romaji).',
        }));

        const translate = shuffled.map((row) => ({
          wordId: row.id,
          prompt: row.translation || row.romaji || row.japanese,
          answers: getAnswersFromWord(row, 'translate'),
          instruction: 'Escribe la palabra en japonés (hiragana, katakana o kanji).',
        }));

        if (isMounted) {
          setDeckData(recognize.length || translate.length ? { recognize, translate } : null);
        }
      } catch (error) {
        console.warn('No se pudo cargar el deck desde Supabase:', error?.message ?? error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWords();

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackDeck = useMemo(
    () => ({
      recognize: [
        { prompt: '猫', answers: ['gato', 'neko', 'cat'], instruction: 'Escribe el significado (español o romaji).' },
        { prompt: '水', answers: ['agua', 'mizu', 'water'], instruction: 'Escribe el significado (español o romaji).' },
      ],
      translate: [
        { prompt: 'gato', answers: ['猫', 'ねこ', 'ネコ', 'neko'], instruction: 'Escribe la palabra en japonés (hiragana, katakana o kanji).' },
        { prompt: 'agua', answers: ['水', 'みず', 'ミズ', 'mizu'], instruction: 'Escribe la palabra en japonés (hiragana, katakana o kanji).' },
      ],
    }),
    []
  );

  const activeDeckData = deckData?.[mode]?.length ? deckData : null;
  const deck = activeDeckData?.[mode] ?? fallbackDeck[mode];
  const currentQuestion = deck[index] ?? deck[0];
  useEffect(() => {
    let isMounted = true;

    const loadReviewItems = async () => {
      if (!user?.id) {
        if (isMounted) {
          setReviewItems([]);
          setReviewLoading(false);
        }
        return;
      }

      setReviewLoading(true);

      try {
        const { data, error } = await supabase
          .from('progress')
          .select(
            'id,mode,correct,last_attempt,word:word_id(id,japanese,hiragana,katakana,romaji,translation)'
          )
          .eq('user_id', user.id)
          .order('last_attempt', { ascending: false })
          .limit(6);

        if (error) throw error;

        const items = (data ?? []).map((row) => {
          const word = row.word ?? {};
          const wordLabel = word.japanese || word.hiragana || word.katakana || word.romaji || word.translation || '—';
          const translation = word.translation || word.romaji || word.japanese || word.hiragana || word.katakana || '';

          return {
            id: row.id,
            thumbnail: '🀄',
            word: wordLabel,
            translation,
            correct: Boolean(row.correct),
            mode: row.mode,
          };
        });

        if (isMounted) {
          setReviewItems(items);
        }
      } catch (error) {
        console.warn('No se pudo cargar el historial desde Supabase:', error?.message ?? error);
        if (isMounted) {
          setReviewItems([]);
        }
      } finally {
        if (isMounted) {
          setReviewLoading(false);
        }
      }
    };

    loadReviewItems();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const sessionStats = {
    streak,
    questionNumber: deck.length ? index + 1 : 0,
    totalQuestions: deck.length,
    score,
    progress: deck.length ? ((index + 1) / deck.length) * 100 : 0,
  };

  const modeCards = [
    {
      id: 'recognize',
      label: 'Reconocer',
      crown: true,
      active: mode === 'recognize',
      description: 'Kana / Kanji → significado',
    },
    {
      id: 'translate',
      label: 'Traducir',
      crown: false,
      active: mode === 'translate',
      description: 'Español / Romaji → palabra japonesa',
    },
  ];

  const promptIsJapanese = containsJapaneseScript(currentQuestion?.prompt ?? '');
  const promptSizeClass = promptIsJapanese ? 'text-[6.25rem] sm:text-[7.5rem]' : 'text-[2.4rem] sm:text-[3.2rem]';

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setIndex(0);
    setAnswer('');
    setFeedback(null);
    setCanAdvance(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (canAdvance) {
      return;
    }

    const normalizedAnswer = normalize(answer);
    const acceptedAnswers = getAcceptedAnswers(currentQuestion?.answers ?? [], mode);
    const isCorrect = acceptedAnswers.some((item) => item && normalize(item) === normalizedAnswer);

    if (currentQuestion?.wordId) {
      const modeLabel = getModeLabel(mode);
      const translation = currentQuestion?.answers?.[0] ?? '';

      setReviewItems((items) => {
        const next = [
          {
            id: `${currentQuestion.wordId}-${mode}-${Date.now()}`,
            thumbnail: '🀄',
            word: currentQuestion?.prompt ?? '—',
            translation,
            correct: isCorrect,
            mode,
            modeLabel,
          },
          ...items.filter((item) => item.word !== currentQuestion?.prompt || item.mode !== mode),
        ];

        return next.slice(0, 6);
      });
    }

    if (user?.id && currentQuestion?.wordId) {
      const payload = {
        user_id: user.id,
        word_id: currentQuestion.wordId,
        mode,
        correct: isCorrect,
        attempts: 1,
        mastery_level: isCorrect ? 1 : 0,
        last_attempt: new Date().toISOString(),
      };

      const { data: existing, error: fetchError } = await supabase
        .from('progress')
        .select('attempts,mastery_level')
        .eq('user_id', user.id)
        .eq('word_id', currentQuestion.wordId)
        .eq('mode', mode)
        .maybeSingle();

      if (!fetchError) {
        const attempts = (existing?.attempts ?? 0) + 1;
        const masteryLevel = isCorrect ? (existing?.mastery_level ?? 0) + 1 : existing?.mastery_level ?? 0;

        const { error: upsertError } = await supabase
          .from('progress')
          .upsert({
            ...payload,
            attempts,
            mastery_level: masteryLevel,
          }, {
            onConflict: 'user_id,word_id,mode',
          });

        if (upsertError) {
          console.warn('No se pudo guardar progreso:', upsertError.message);
        } else {
          const modeLabel = getModeLabel(mode);
          const translation = currentQuestion?.answers?.[0] ?? '';
          setReviewItems((items) => {
            const next = [
              {
                id: `${currentQuestion.wordId}-${mode}-${Date.now()}`,
                thumbnail: '🀄',
                word: currentQuestion?.prompt ?? '—',
                translation,
                correct: isCorrect,
                mode,
                modeLabel,
              },
              ...items.filter((item) => item.word !== currentQuestion?.prompt || item.mode !== mode),
            ];

            return next.slice(0, 6);
          });
        }
      } else {
        console.warn('No se pudo leer progreso:', fetchError.message);
      }
    }

    if (isCorrect) {
      setFeedback({ tone: 'success', message: 'Correcto. Sigue con la siguiente pregunta.' });
      setScore((value) => value + 50);
      setStreak((value) => value + 1);
      setCanAdvance(true);
      return;
    }

    setFeedback({ tone: 'error', message: 'Respuesta incorrecta. Revisa la lectura.' });
    setStreak(0);
    setCanAdvance(false);
  };

  const handleNext = () => {
    if (!deck.length) return;
    setIndex((value) => (value + 1) % deck.length);
    setAnswer('');
    setFeedback(null);
    setCanAdvance(false);
  };

  const handlePrev = () => {
    if (!deck.length) return;
    setIndex((value) => (value - 1 + deck.length) % deck.length);
    setAnswer('');
    setFeedback(null);
    setCanAdvance(false);
  };

  return (
    <section className="grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)_320px] lg:gap-4 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="rounded-[1.6rem] bg-[rgb(var(--color-accent))] p-3 text-white shadow-[0_16px_34px_rgba(128,43,56,0.18)] lg:p-4">
        <div className="px-2 pt-1">
          <h2 className="text-[1.35rem] font-semibold tracking-tight">Repaso</h2>
          <p className="mt-1 text-xs text-white/80">Últimas preguntas</p>
        </div>

        <div className="mt-3 grid gap-2.5">
          {reviewLoading ? (
            <div className="rounded-2xl bg-white px-3 py-4 text-center text-xs text-[rgb(var(--color-neutral))]/70 shadow-sm">
              Cargando historial...
            </div>
          ) : null}

          {!reviewLoading && reviewItems.length === 0 ? (
            <div className="rounded-2xl bg-white px-3 py-4 text-center text-xs text-[rgb(var(--color-neutral))]/70 shadow-sm">
              Aun no hay respuestas registradas.
            </div>
          ) : null}

          {!reviewLoading
            ? reviewItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 text-[rgb(var(--color-neutral))] shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f6eadf] text-xl shadow-inner">
                    {item.thumbnail}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[1rem] font-semibold leading-none text-[rgb(var(--color-accent))]">{item.word}</div>
                    <div className="mt-1 text-xs text-[rgb(var(--color-neutral))]/75">
                      {item.mode ? getModeLabel(item.mode) : item.translation}
                    </div>
                  </div>
                  <div
                    className={[
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                      item.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600',
                    ].join(' ')}
                  >
                    {item.correct ? '✓' : '✕'}
                  </div>
                </div>
              ))
            : null}
        </div>

        <Link
          to="/historial"
          className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Ver todos
        </Link>
      </aside>

      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 text-xs font-medium text-[rgb(var(--color-neutral))] sm:text-sm">
          <span>Racha: {sessionStats.streak} 🔥</span>
          <span className="text-center">Pregunta {sessionStats.questionNumber} de {sessionStats.totalQuestions}</span>
          <span>Puntuación: {sessionStats.score} XP</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#ecd8d0]">
          <div className="h-full rounded-full bg-[rgb(var(--color-accent))]" style={{ width: `${sessionStats.progress}%` }} />
        </div>

        <section className="rounded-[1.6rem] border border-[#eaded6] bg-white p-4 shadow-[0_14px_32px_rgba(128,43,56,0.08)] sm:p-5 lg:p-5">
          {loading ? <p className="mb-4 text-center text-sm text-[rgb(var(--color-neutral))]/70">Cargando palabras desde Supabase...</p> : null}
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_210px] xl:items-center">
            <div className="flex items-start justify-center xl:justify-start">
              <div className={[
                'pt-2 font-semibold leading-none text-[rgb(var(--color-accent))] sm:pt-3',
                promptSizeClass,
              ].join(' ')}>
                {currentQuestion?.prompt ?? '...'}
              </div>
            </div>

            <div className="flex justify-center xl:justify-end">
              <CatIllustration />
            </div>
          </div>

          <form className="mx-auto mt-3 max-w-2xl" onSubmit={handleSubmit}>
            <p className="text-center text-base font-semibold text-[rgb(var(--color-neutral))] sm:text-lg">{currentQuestion?.instruction ?? 'Escribe la respuesta:'}</p>

            <div className="relative mt-2.5">
              <input
                className="w-full rounded-[1.1rem] border border-[rgba(128,43,56,0.22)] bg-[#fffdfb] px-4 py-3.5 pr-14 text-base text-[rgb(var(--color-neutral))] outline-none transition placeholder:text-[rgb(var(--color-neutral))]/35 focus:border-[rgb(var(--color-accent))] focus:ring-2 focus:ring-[rgba(128,43,56,0.12)] sm:px-5 sm:py-4 sm:text-lg"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Escribe aquí..."
                autoComplete="off"
              />

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f6e7e0] sm:h-10 sm:w-10">
                  <KeyboardIcon />
                </div>
              </div>
            </div>

            {feedback ? (
              <p className={['mt-3 text-center text-sm font-medium', feedback.tone === 'success' ? 'text-emerald-700' : 'text-red-600'].join(' ')}>{feedback.message}</p>
            ) : null}

            <div className="mt-4 flex justify-center sm:mt-5">
              <button
                type="submit"
                className="inline-flex min-w-32 items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(128,43,56,0.18)] transition hover:bg-[rgb(var(--color-accent-dark))] sm:min-w-36 sm:px-6 sm:py-3"
              >
                Verificar
              </button>
            </div>
          </form>
        </section>

        <div className="grid grid-cols-2 gap-3 px-1 sm:gap-4">
          <button type="button" onClick={handlePrev} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.28)] bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0] sm:px-5 sm:py-3">
            <span aria-hidden="true">←</span>
            Atrás
          </button>
          <button type="button" onClick={handleNext} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.28)] bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0] sm:px-5 sm:py-3">
            Siguiente
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <aside className="grid gap-3">
        <section className="rounded-[1.3rem] border border-[#eaded6] bg-white p-3.5 shadow-[0_12px_30px_rgba(128,43,56,0.08)] sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[rgb(var(--color-accent))] sm:text-lg">Jugadores en la sala</h3>
            <span className="text-sm font-medium text-emerald-600">3 en línea</span>
          </div>

          <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3">
            {players.map((player) => (
              <div key={player.name} className="flex items-center gap-2.5 rounded-2xl border border-[#f0e2db] bg-[#fffdfb] px-3 py-2.5">
                <Avatar label={player.name.charAt(0)} tone={player.tone} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[rgb(var(--color-neutral))]">{player.name}</div>
                </div>
                <div className="text-sm font-semibold text-[rgb(var(--color-neutral))]">{player.xp} XP</div>
              </div>
            ))}
          </div>

          <button className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-accent-dark))] sm:mt-4 sm:py-3">
            Ver ranking completo
          </button>
        </section>

        <section className="rounded-[1.3rem] border border-[#eaded6] bg-[#fbefe8] p-3.5 shadow-[0_12px_30px_rgba(128,43,56,0.08)] sm:p-4">
          <h3 className="text-base font-semibold text-[rgb(var(--color-accent))] sm:text-lg">Modo de juego</h3>

          <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3">
            {modeCards.map((mode) => (
              <div
                key={mode.id}
                className={[
                  'rounded-2xl border p-3.5 sm:p-4',
                  mode.active ? 'border-transparent bg-[rgb(var(--color-accent))] text-white shadow-md' : 'border-[#eaded6] bg-white text-[rgb(var(--color-neutral))]',
                ].join(' ')}
                role="button"
                tabIndex={0}
                onClick={() => handleModeChange(mode.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleModeChange(mode.id);
                  }
                }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>{mode.label}</span>
                  {mode.crown ? <span aria-hidden="true">👑</span> : null}
                </div>
                <p className={['mt-1 text-xs sm:text-sm', mode.active ? 'text-white/80' : 'text-[rgb(var(--color-neutral))]/70'].join(' ')}>{mode.description}</p>
              </div>
            ))}
          </div>

          <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.22)] bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0] sm:mt-4 sm:py-3">
            <span aria-hidden="true">⚙</span>
            Configuración del modo
          </button>
        </section>
      </aside>
    </section>
  );
}
