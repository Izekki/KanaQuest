import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../services/supabase/client';

const reviewItems = [
  { id: 1, thumbnail: '🐱', word: 'ねこ', translation: 'gato', correct: true },
  { id: 2, thumbnail: '🏫', word: '学校', translation: 'escuela', correct: true },
  { id: 3, thumbnail: '🍎', word: 'りんご', translation: 'manzana', correct: true },
  { id: 4, thumbnail: '🚗', word: '車', translation: 'coche', correct: false },
  { id: 5, thumbnail: '💧', word: '水', translation: 'agua', correct: true },
  { id: 6, thumbnail: '🌸', word: '花', translation: 'flor', correct: false },
];

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

  const expanded = new Set();

  base.forEach((item) => {
    expanded.add(item);
    expanded.add(toHiragana(item));
    expanded.add(toKatakana(item));
  });

  return [...expanded];
};

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
  const [mode, setMode] = useState('recognize');
  const [deckData, setDeckData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);

  const normalizeWords = (payload) => {
    if (!Array.isArray(payload)) {
      return [];
    }

    return payload.filter((row) => row && typeof row === 'object' && !Array.isArray(row));
  };

  useEffect(() => {
    let isMounted = true;

    const loadWords = async () => {
      try {
        const query = supabase
          .from('words')
          .select('id,japanese,hiragana,katakana,romaji,translation,difficulty,type_id,image_url,audio_url,created_at')
          .order('created_at', { ascending: true });

        const { data, error } = await query;
        if (error) throw error;

        const rows = normalizeWords(data);
        if (!rows.length) {
          throw new Error('Supabase returned an empty or invalid words payload.');
        }

        const shuffled = [...rows].sort(() => Math.random() - 0.5);

        const recognize = shuffled.map((row) => ({
          prompt: row.japanese || row.hiragana || row.katakana || row.romaji || row.translation,
          answers: [row.translation, row.romaji, row.hiragana, row.katakana].filter(Boolean),
          instruction: 'Escribe el significado o la lectura correcta.',
        }));

        const translate = shuffled.map((row) => ({
          prompt: row.translation || row.romaji || row.japanese || row.hiragana || row.katakana,
          answers: [row.japanese, row.hiragana, row.katakana, row.romaji].filter(Boolean),
          instruction: 'Escribe la palabra en japonés (kanji, hiragana o katakana).',
        }));

        if (isMounted) {
          setDeckData({ recognize, translate });
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
        { prompt: '猫', answers: ['gato', 'neko', 'cat', 'ねこ', 'ネコ'], instruction: 'Escribe el significado o la lectura correcta.' },
        { prompt: '水', answers: ['agua', 'mizu', 'water', 'みず', 'ミズ'], instruction: 'Escribe el significado o la lectura correcta.' },
      ],
      translate: [
        { prompt: 'gato', answers: ['猫', 'ねこ', 'ネコ', 'neko'], instruction: 'Escribe la palabra en japonés (kanji, hiragana o katakana).' },
        { prompt: 'agua', answers: ['水', 'みず', 'ミズ', 'mizu'], instruction: 'Escribe la palabra en japonés (kanji, hiragana o katakana).' },
      ],
    }),
    []
  );

  const deck = deckData?.[mode] ?? fallbackDeck[mode];
  const currentQuestion = deck[index] ?? deck[0];
  const reviewItems = useMemo(() => {
    const source = deckData?.recognize ?? fallbackDeck.recognize;
    return source.slice(0, 6).map((item, itemIndex) => ({
      id: itemIndex + 1,
      thumbnail: '🀄',
      word: item.prompt,
      translation: item.answers[0] ?? '',
      correct: true,
    }));
  }, [deckData, fallbackDeck]);

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
      description: 'Kana / Kanji / Romaji → significado o lectura',
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (canAdvance) {
      return;
    }

    const normalizedAnswer = normalize(answer);
    const acceptedAnswers = getAcceptedAnswers(currentQuestion?.answers ?? []);
    const isCorrect = acceptedAnswers.some((item) => item && normalize(item) === normalizedAnswer);

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
    <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:gap-4">
      <aside className="rounded-[1.8rem] bg-[rgb(var(--color-accent))] p-4 text-white shadow-[0_18px_40px_rgba(128,43,56,0.2)]">
        <div className="px-2 pt-1">
          <h2 className="text-2xl font-semibold tracking-tight">Repaso</h2>
          <p className="mt-1 text-sm text-white/80">Últimas preguntas</p>
        </div>

          <div className="mt-4 grid gap-3">
          {reviewItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 text-[rgb(var(--color-neutral))] shadow-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f6eadf] text-2xl shadow-inner">
                {item.thumbnail}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold leading-none text-[rgb(var(--color-accent))]">{item.word}</div>
                <div className="mt-1 text-sm text-[rgb(var(--color-neutral))]/75">{item.translation}</div>
              </div>
              <div
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  item.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600',
                ].join(' ')}
              >
                {item.correct ? '✓' : '✕'}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition-transform hover:-translate-y-0.5">
          Ver todos
        </button>
      </aside>

      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-4 px-2 py-1 text-sm font-medium text-[rgb(var(--color-neutral))]">
          <span>Racha: {sessionStats.streak} 🔥</span>
          <span className="text-center">Pregunta {sessionStats.questionNumber} de {sessionStats.totalQuestions}</span>
          <span>Puntuación: {sessionStats.score} XP</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#ecd8d0]">
          <div className="h-full rounded-full bg-[rgb(var(--color-accent))]" style={{ width: `${sessionStats.progress}%` }} />
        </div>

        <section className="rounded-[1.9rem] border border-[#eaded6] bg-white p-5 shadow-[0_18px_42px_rgba(128,43,56,0.08)] lg:p-6">
          {loading ? <p className="mb-4 text-center text-sm text-[rgb(var(--color-neutral))]/70">Cargando palabras desde Supabase...</p> : null}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-center">
            <div className="flex items-start justify-center xl:justify-start">
              <div className={[
                'pt-6 font-semibold leading-none text-[rgb(var(--color-accent))]',
                promptSizeClass,
              ].join(' ')}>
                {currentQuestion?.prompt ?? '...'}
              </div>
            </div>

            <div className="flex justify-center xl:justify-end">
              <CatIllustration />
            </div>
          </div>

          <form className="mx-auto mt-4 max-w-2xl" onSubmit={handleSubmit}>
            <p className="text-center text-lg font-semibold text-[rgb(var(--color-neutral))]">{currentQuestion?.instruction ?? 'Escribe la respuesta:'}</p>

            <div className="relative mt-3">
              <input
                className="w-full rounded-[1.2rem] border border-[rgba(128,43,56,0.22)] bg-[#fffdfb] px-5 py-4 pr-14 text-lg text-[rgb(var(--color-neutral))] outline-none transition focus:border-[rgb(var(--color-accent))] focus:ring-2 focus:ring-[rgba(128,43,56,0.12)]"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Escribe aquí..."
                autoComplete="off"
              />

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6e7e0]">
                  <KeyboardIcon />
                </div>
              </div>
            </div>

            {feedback ? (
              <p className={['mt-3 text-center text-sm font-medium', feedback.tone === 'success' ? 'text-emerald-700' : 'text-red-600'].join(' ')}>{feedback.message}</p>
            ) : null}

            <div className="mt-5 flex justify-center">
              <button
                type="submit"
                className="inline-flex min-w-36 items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(128,43,56,0.18)] transition hover:bg-[rgb(var(--color-accent-dark))]"
              >
                Verificar
              </button>
            </div>
          </form>
        </section>

        <div className="grid grid-cols-2 gap-4 px-1">
          <button type="button" onClick={handlePrev} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.28)] bg-white px-5 py-3 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0]">
            <span aria-hidden="true">←</span>
            Atrás
          </button>
          <button type="button" onClick={handleNext} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.28)] bg-white px-5 py-3 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0]">
            Siguiente
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <aside className="grid gap-4">
        <section className="rounded-[1.4rem] border border-[#eaded6] bg-white p-4 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-accent))]">Jugadores en la sala</h3>
            <span className="text-sm font-medium text-emerald-600">3 en línea</span>
          </div>

          <div className="mt-4 grid gap-3">
            {players.map((player) => (
              <div key={player.name} className="flex items-center gap-3 rounded-2xl border border-[#f0e2db] bg-[#fffdfb] px-3 py-2.5">
                <Avatar label={player.name.charAt(0)} tone={player.tone} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[rgb(var(--color-neutral))]">{player.name}</div>
                </div>
                <div className="text-sm font-semibold text-[rgb(var(--color-neutral))]">{player.xp} XP</div>
              </div>
            ))}
          </div>

          <button className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-accent-dark))]">
            Ver ranking completo
          </button>
        </section>

        <section className="rounded-[1.4rem] border border-[#eaded6] bg-[#fbefe8] p-4 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
          <h3 className="text-lg font-semibold text-[rgb(var(--color-accent))]">Modo de juego</h3>

          <div className="mt-4 grid gap-3">
            {modeCards.map((mode) => (
              <div
                key={mode.id}
                className={[
                  'rounded-2xl border p-4',
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
                <p className={['mt-1 text-sm', mode.active ? 'text-white/80' : 'text-[rgb(var(--color-neutral))]/70'].join(' ')}>{mode.description}</p>
              </div>
            ))}
          </div>

          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.22)] bg-white px-4 py-3 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0]">
            <span aria-hidden="true">⚙</span>
            Configuración del modo
          </button>
        </section>
      </aside>
    </section>
  );
}
