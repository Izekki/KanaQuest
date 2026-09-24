import { toHiragana, toRomaji } from 'wanakana';

/**
 * gameplayLogic.js — Central exercise generation engine for KanaQuest.
 *
 * This module encapsulates ALL pedagogical and linguistic logic.
 * GamePage.jsx should never contain item_type checks or linguistic rules;
 * it must only render the exercise object returned by createExercise().
 *
 * Architecture (from plan §25):
 *
 *   words → createExercise() → { questionType, presentation, options?, ... }
 *                                    ↓
 *                               GamePage renders
 */

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Checks if a string contains any Kanji (CJK Unified Ideographs).
 */
export const containsKanji = (str) => {
  if (!str) return false;
  return /[\u4e00-\u9faf]/u.test(str);
};

/**
 * Checks if a string is pure Kana (Hiragana or Katakana, plus prolonged marks).
 */
export const isPureKana = (str) => {
  if (!str) return false;
  return /^[\u3040-\u309f\u30a0-\u30ffー\s]+$/u.test(str);
};

/**
 * Checks if a string contains any Japanese script (kana or kanji).
 */
export const containsJapaneseScript = (str) => {
  if (!str) return false;
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(str);
};

/**
 * Detects the dominant script of a Japanese string.
 * Returns: 'kanji', 'katakana', 'hiragana', 'mixed', or 'latin'
 */
export const detectItemScript = (japanese) => {
  if (!japanese) return 'latin';
  if (containsKanji(japanese)) return 'kanji';
  if (/^[\u30a0-\u30ffー]+$/u.test(japanese)) return 'katakana';
  if (/^[\u3040-\u309fー]+$/u.test(japanese)) return 'hiragana';
  if (/[\u3040-\u30ff]/.test(japanese)) return 'mixed';
  return 'latin';
};

/**
 * Normalizes user text for comparison: lowercases, trims, strips accents,
 * collapses whitespace, and applies NFKC normalization for kana consistency.
 */
export const normalizeAnswer = (text = '') => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ');
};

/**
 * Evaluates whether a user input matches any of the expected answers.
 * Uses wanakana to seamlessly match Romaji to Kana and vice-versa,
 * avoiding false negatives for learners without a Japanese keyboard.
 */
export const isAnswerCorrect = (userInput = '', exercise) => {
  if (!userInput || !userInput.toString().trim() || !exercise) return false;

  const raw = userInput.toString().trim();
  const normalized = normalizeAnswer(raw);
  const asHiragana = normalizeAnswer(toHiragana(raw));
  const asRomaji = normalizeAnswer(toRomaji(raw));

  const accepted = (exercise.expectedAnswers ?? exercise.answers ?? []).map((a) =>
    normalizeAnswer(a)
  );

  return accepted.some((ans) => {
    if (ans === normalized) return true;
    if (ans === asHiragana) return true;
    if (ans === asRomaji) return true;

    // Cross-convert accepted answer with wanakana
    const ansKana = normalizeAnswer(toHiragana(ans));
    const ansRom = normalizeAnswer(toRomaji(ans));

    if (ansKana === asHiragana || ansKana === normalized) return true;
    if (ansRom === asRomaji || ansRom === normalized) return true;

    return false;
  });
};

// ─── XP Calculation ────────────────────────────────────────────────────────────

/**
 * Calculates XP reward according to the selected difficulty mode.
 * Master mode grants a 1.5x multiplier (plan §18).
 */
export const calculateAwardXp = (baseXp = 10, difficultyMode = 'apprentice') => {
  if (difficultyMode === 'master') {
    return Math.round(baseXp * 1.5);
  }
  return baseXp;
};

// ─── Normalize Accepted Answers (plan §10) ─────────────────────────────────────

/**
 * Converts heterogeneous `accepted_answers` formats from the database
 * into a consistent internal structure:
 *
 *   { reading: [], romaji: [], kunyomi: [], onyomi: [], meaning: [] }
 *
 * Supports:
 *  - Array format: ["kara"] → all go to reading/romaji
 *  - Object with recognize/translate keys (legacy vocabulary)
 *  - Object with reading/meaning keys (newer kanji/vocabulary)
 *  - Object with kunyomi/onyomi keys (kanji-specific)
 */
/**
 * Safely parses a reading column value (kunyomi/onyomi) that may be
 * a string (comma-separated), an array, or null/undefined.
 */
const parseReadingColumn = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [String(value)];
};

export const normalizeAcceptedAnswers = (item) => {
  const result = {
    reading: [],
    romaji: [],
    kunyomi: [],
    onyomi: [],
    meaning: [],
  };

  const aa = item.accepted_answers;

  if (!aa) {
    // Fallback: build from individual columns
    if (item.hiragana) result.reading.push(item.hiragana);
    if (item.romaji) result.romaji.push(item.romaji);
    if (item.kunyomi) {
      result.kunyomi.push(...parseReadingColumn(item.kunyomi));
    }
    if (item.onyomi) {
      result.onyomi.push(...parseReadingColumn(item.onyomi));
    }
    if (item.translation) result.meaning.push(item.translation);
    return result;
  }

  // Format 1: Plain array (e.g. ["kara", "ka ra"])
  if (Array.isArray(aa)) {
    result.romaji.push(...aa);
    return result;
  }

  // Format 2: Object with various key patterns
  if (typeof aa === 'object') {
    // Legacy vocabulary: { recognize: [...], translate: [...] }
    if (Array.isArray(aa.recognize)) {
      result.reading.push(...aa.recognize);
    }
    if (Array.isArray(aa.translate)) {
      result.meaning.push(...aa.translate);
    }

    // Newer format: { reading: [...], meaning: [...] }
    if (Array.isArray(aa.reading)) {
      result.reading.push(...aa.reading);
    }
    if (Array.isArray(aa.meaning)) {
      result.meaning.push(...aa.meaning);
    }

    // Kanji-specific: { kunyomi: [...], onyomi: [...] }
    if (Array.isArray(aa.kunyomi)) {
      result.kunyomi.push(...aa.kunyomi);
    }
    if (Array.isArray(aa.onyomi)) {
      result.onyomi.push(...aa.onyomi);
    }
  }

  // Supplement from individual columns if the object didn't have them
  if (result.kunyomi.length === 0 && item.kunyomi) {
    result.kunyomi.push(...parseReadingColumn(item.kunyomi));
  }
  if (result.onyomi.length === 0 && item.onyomi) {
    result.onyomi.push(...parseReadingColumn(item.onyomi));
  }
  if (result.reading.length === 0 && item.hiragana) {
    result.reading.push(item.hiragana);
  }
  if (result.romaji.length === 0 && item.romaji) {
    result.romaji.push(item.romaji);
  }
  if (result.meaning.length === 0 && item.translation) {
    result.meaning.push(item.translation);
  }

  return result;
};

// ─── Question Type Resolution ──────────────────────────────────────────────────

/**
 * Selects the best questionType for an item based on its item_type
 * and target_question_type field from the database (plan §3).
 *
 * Returns one of: 'romaji', 'meaning', 'reading', 'kunyomi', 'onyomi'
 */
const resolveQuestionType = (item) => {
  const itemType = item.item_type || (containsKanji(item.japanese) ? 'kanji' : 'vocabulary');
  const targetQT = item.target_question_type;

  // If the DB specifies a target, respect it
  if (targetQT && ['reading', 'meaning', 'romaji', 'kunyomi', 'onyomi'].includes(targetQT)) {
    return targetQT;
  }

  // Auto-resolve based on item_type
  switch (itemType) {
    case 'kana':
      return 'romaji';

    case 'kanji': {
      // If kanji has kunyomi/onyomi data, randomly pick one reading type
      const normalized = normalizeAcceptedAnswers(item);
      const hasKunyomi = normalized.kunyomi.length > 0;
      const hasOnyomi = normalized.onyomi.length > 0;
      if (hasKunyomi && hasOnyomi) {
        return Math.random() > 0.5 ? 'kunyomi' : 'onyomi';
      }
      if (hasKunyomi) return 'kunyomi';
      if (hasOnyomi) return 'onyomi';
      // Fallback: meaning
      return 'meaning';
    }

    case 'vocabulary':
    default: {
      const hasKanji = containsKanji(item.japanese);
      if (hasKanji) {
        // Words with kanji: ask for reading (hiragana/romaji)
        return 'reading';
      }
      // Pure kana vocabulary: ask for meaning (never ask to retype kana!)
      return 'meaning';
    }
  }
};

// ─── Prompt Resolver ─────────────────────────────────────────────────────────

/**
 * Resolves the main prompt to display to the user.
 * In 'recognize' mode: Japanese text (e.g. 「ありがとう」 or 「水」).
 * In 'translate' mode: Spanish translation / meaning (e.g. "Gracias" or "Agua").
 */
const resolvePrompt = (item, gameMode = 'recognize') => {
  if (gameMode === 'translate') {
    if (item.item_type === 'kana') {
      return item.translation || (item.romaji ? `Sonido "${item.romaji}"` : item.japanese);
    }
    return item.translation || item.romaji || item.japanese || '...';
  }
  return item.japanese || item.hiragana || '';
};

// ─── Instruction Generator ─────────────────────────────────────────────────────

/**
 * Generates the pedagogical instruction string and display category
 * based on questionType, difficultyMode, and gameMode (plan §6-§9, §14).
 */
const resolveInstruction = (item, questionType, difficultyMode, gameMode = 'recognize', prompt = '') => {
  const itemType = item.item_type || 'vocabulary';
  const isApprentice = difficultyMode === 'apprentice';

  let instruction = '';
  let displayCategory = '';

  if (gameMode === 'translate') {
    switch (itemType) {
      case 'kana':
        displayCategory = 'Traducción • Kana';
        instruction = isApprentice
          ? `¿Qué carácter corresponde a 「${prompt || item.romaji}」?`
          : `Escribe el kana o romaji para 「${prompt || item.romaji}」`;
        break;

      case 'kanji':
        displayCategory = 'Traducción • Kanji';
        instruction = isApprentice
          ? `¿Cuál es el kanji para 「${prompt || item.translation}」?`
          : `Escribe el kanji o su lectura (kana/romaji)`;
        break;

      case 'vocabulary':
      default:
        displayCategory = 'Traducción • Vocabulario';
        instruction = isApprentice
          ? `¿Cómo se dice 「${prompt || item.translation}」 en japonés?`
          : 'Escribe la palabra en japonés o romaji';
        break;
    }

    return { instruction, displayCategory };
  }

  // recognize mode
  switch (itemType) {
    case 'kana':
      displayCategory = 'Kana Silabario';
      instruction = isApprentice
        ? `¿Qué sonido representa 「${item.japanese}」?`
        : 'Escribe el sonido en romaji';
      break;

    case 'kanji':
      displayCategory = 'Kanji';
      switch (questionType) {
        case 'kunyomi':
          instruction = isApprentice
            ? `¿Cuál es la lectura KUNYOMI de 「${item.japanese}」?`
            : 'Escribe la lectura KUNYOMI';
          break;
        case 'onyomi':
          instruction = isApprentice
            ? `¿Cuál es la lectura ONYOMI de 「${item.japanese}」?`
            : 'Escribe la lectura ONYOMI';
          break;
        case 'meaning':
          instruction = isApprentice
            ? `¿Qué significa 「${item.japanese}」?`
            : 'Escribe el significado';
          break;
        case 'reading':
        default:
          instruction = isApprentice
            ? `¿Cómo se lee 「${item.japanese}」?`
            : 'Escribe una lectura';
          break;
      }
      break;

    case 'vocabulary':
    default: {
      const hasKanji = containsKanji(item.japanese);
      displayCategory = hasKanji ? 'Vocabulario (Kanji)' : 'Vocabulario (Kana)';
      switch (questionType) {
        case 'reading':
          instruction = isApprentice
            ? `¿Cómo se lee 「${item.japanese}」?`
            : 'Escribe la lectura (hiragana o romaji)';
          break;
        case 'romaji':
          instruction = isApprentice
            ? `¿Qué sonido tiene 「${item.japanese}」?`
            : 'Escribe la lectura en romaji';
          break;
        case 'meaning':
        default:
          instruction = isApprentice
            ? `¿Qué significa 「${item.japanese}」?`
            : 'Escribe el significado';
          break;
      }
      break;
    }
  }

  return { instruction, displayCategory };
};

// ─── Expected Answers Resolution ───────────────────────────────────────────────

/**
 * Resolves the valid expected answers for a given questionType and gameMode.
 * In 'translate' mode: accepts all valid Japanese script and Romaji forms.
 * In 'recognize' mode: follows strict type boundaries (e.g. kunyomi vs onyomi).
 */
const resolveExpectedAnswers = (item, questionType, gameMode = 'recognize') => {
  const normalized = normalizeAcceptedAnswers(item);

  if (gameMode === 'translate') {
    const answers = new Set();

    // 1. Japanese forms
    if (item.japanese) answers.add(item.japanese);
    if (item.hiragana) answers.add(item.hiragana);
    if (item.katakana) answers.add(item.katakana);

    // 2. Romaji forms
    if (item.romaji) {
      answers.add(item.romaji);
      const clean = item.romaji.toLowerCase();
      if (clean.includes('ou')) answers.add(clean.replace(/ou/g, 'o'));
      if (clean.includes('uu')) answers.add(clean.replace(/uu/g, 'u'));
    }

    // 3. Accepted readings from DB
    normalized.reading.forEach((r) => answers.add(r));
    normalized.romaji.forEach((r) => answers.add(r));
    normalized.kunyomi.forEach((k) => answers.add(k));
    normalized.onyomi.forEach((o) => answers.add(o));

    const result = Array.from(answers).filter(Boolean);
    return result.length > 0 ? result : [item.japanese, item.hiragana, item.romaji].filter(Boolean);
  }

  // recognize mode
  switch (questionType) {
    case 'romaji':
      return normalized.romaji.length > 0
        ? normalized.romaji
        : [item.romaji].filter(Boolean);

    case 'kunyomi':
      return normalized.kunyomi.length > 0
        ? normalized.kunyomi
        : normalized.reading.filter((r) => !normalized.onyomi.includes(r));

    case 'onyomi':
      return normalized.onyomi.length > 0
        ? normalized.onyomi
        : normalized.reading.filter((r) => !normalized.kunyomi.includes(r));

    case 'reading':
      return [
        ...normalized.reading,
        ...normalized.romaji,
        ...normalized.kunyomi,
        ...normalized.onyomi,
      ].filter(Boolean);

    case 'meaning':
      return normalized.meaning.length > 0
        ? normalized.meaning
        : [item.translation].filter(Boolean);

    default:
      return [item.romaji, item.translation, item.hiragana].filter(Boolean);
  }
};

// ─── Smart Distractors (plan §15-§16) ──────────────────────────────────────────

/**
 * Generates intelligent distractors for Multiple Choice mode.
 * In 'translate' mode: picks 3 distinct Japanese words from the pool.
 * In 'recognize' mode: picks 3 distinct translations or readings.
 */
export const generateDistractors = (
  currentItem,
  allWords,
  questionType,
  count = 3,
  gameMode = 'recognize'
) => {
  const isTranslate = gameMode === 'translate';
  const correctOption = normalizeAnswer(resolveCorrectOptionLabel(currentItem, questionType, gameMode));
  const correctAnswers = resolveExpectedAnswers(currentItem, questionType, gameMode).map(normalizeAnswer);
  const itemType = currentItem.item_type || 'vocabulary';

  const getLabel = (word) => {
    if (isTranslate) {
      return word.japanese || word.hiragana;
    }

    switch (questionType) {
      case 'romaji':
        return word.romaji;
      case 'kunyomi':
        return parseReadingColumn(word.kunyomi)[0] || word.hiragana;
      case 'onyomi':
        return parseReadingColumn(word.onyomi)[0] || word.hiragana;
      case 'reading':
        return word.hiragana || word.romaji;
      case 'meaning':
        return word.translation;
      default:
        return word.translation || word.romaji;
    }
  };

  const candidates = allWords
    .filter((w) => {
      if (w.id === currentItem.id) return false;
      const label = getLabel(w);
      if (!label) return false;
      const norm = normalizeAnswer(label);
      if (norm === correctOption) return false;
      if (!isTranslate && correctAnswers.includes(norm)) return false;
      return true;
    })
    .map((w) => {
      let score = 0;
      if (w.item_type === itemType) score += 3;
      if (w.level === currentItem.level) score += 2;
      if (w.difficulty === currentItem.difficulty) score += 1;
      return { word: w, label: getLabel(w), score };
    });

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Math.random() - 0.5;
  });

  const seen = new Set();
  const unique = [];
  for (const c of candidates) {
    const norm = normalizeAnswer(c.label);
    if (!seen.has(norm)) {
      seen.add(norm);
      unique.push(c);
    }
    if (unique.length >= count) break;
  }

  return unique.map((c) => c.label);
};

// ─── Generate Multiple Choice Options ──────────────────────────────────────────

/**
 * Builds the 4 shuffled option objects for Apprentice mode.
 */
export const generateMultipleChoiceOptions = (
  exercise,
  allWords,
  gameMode = exercise?.gameMode || 'recognize'
) => {
  if (!exercise) return [];

  const correctLabel =
    exercise.correctOptionLabel ||
    (gameMode === 'translate'
      ? exercise._rawItem?.japanese || exercise._rawItem?.hiragana
      : exercise.expectedAnswers?.[0] || '');

  const distractors = generateDistractors(
    exercise._rawItem,
    allWords,
    exercise.questionType,
    3,
    gameMode
  );

  const rawOptions = [
    { label: correctLabel, isCorrect: true },
    ...distractors.map((d) => ({ label: d, isCorrect: false })),
  ];

  const shuffled = rawOptions.sort(() => Math.random() - 0.5);

  return shuffled.map((opt, index) => ({
    id: `opt-${index}`,
    keyIndex: index + 1,
    label: opt.label,
    isCorrect: opt.isCorrect,
  }));
};

// ─── Exercise Validation (plan §5) ─────────────────────────────────────────────

/**
 * Validates that an exercise is NOT redundant.
 * Returns true if the exercise is valid (should be shown).
 * Returns false if the prompt === expected answer (plan §4).
 */
export const validateExercise = (exercise) => {
  if (!exercise) return false;

  const normalizedPrompt = normalizeAnswer(exercise.prompt);

  if (!normalizedPrompt || !exercise.expectedAnswers || exercise.expectedAnswers.length === 0) {
    return false;
  }

  for (const ans of exercise.expectedAnswers) {
    const normalizedAns = normalizeAnswer(ans);
    // If prompt and answer are the same text, it's redundant
    if (normalizedPrompt === normalizedAns) {
      return false;
    }
  }

  return true;
};

// ─── Kanji Feedback Generator ──────────────────────────────────────────────────

/**
 * Generates educational feedback for kanji questions (plan §9).
 * Shows available readings when the question involves kanji.
 */
const generateKanjiFeedback = (item, questionType) => {
  if (item.item_type !== 'kanji') return null;

  const normalized = normalizeAcceptedAnswers(item);
  const parts = [];

  if (normalized.kunyomi.length > 0) {
    parts.push(`Kunyomi: ${normalized.kunyomi.join(', ')}`);
  }
  if (normalized.onyomi.length > 0) {
    parts.push(`Onyomi: ${normalized.onyomi.join(', ')}`);
  }
  if (normalized.meaning.length > 0) {
    parts.push(`Significado: ${normalized.meaning.join(', ')}`);
  }

  if (parts.length === 0) return null;

  return `「${item.japanese}」 — ${parts.join(' | ')}`;
};

// ─── Solution Display Generator ────────────────────────────────────────────────

/**
 * Generates the formatted solution display for feedback banners.
 * Avoids redundant text (e.g. "Gracias -> Gracias").
 */
const generateSolutionDisplay = (item, gameMode = 'recognize') => {
  if (gameMode === 'translate') {
    const jp = item.japanese || item.hiragana || '';
    const reading = item.hiragana && item.hiragana !== jp ? item.hiragana : '';
    const romaji = item.romaji || '';

    if (reading && romaji) {
      return `${jp} (${reading} / ${romaji})`;
    }
    if (reading) {
      return `${jp} (${reading})`;
    }
    if (romaji) {
      return `${jp} (${romaji})`;
    }
    return jp;
  }

  // recognize mode
  const trans = item.translation || '';
  const romaji = item.romaji ? ` [${item.romaji}]` : '';
  const reading = item.hiragana && !containsKanji(item.japanese) ? '' : (item.hiragana ? ` (${item.hiragana})` : '');
  return `${trans}${reading}${romaji}`.trim() || item.translation || '';
};

// ─── Correct Option Label for Apprentice ───────────────────────────────────────

/**
 * Determines the label for the correct option in multiple choice.
 * In 'translate' mode: Japanese word (e.g. 「ありがとう」 or 「水」).
 * In 'recognize' mode: Meaning or reading according to questionType.
 */
const resolveCorrectOptionLabel = (item, questionType, gameMode = 'recognize') => {
  if (gameMode === 'translate') {
    return item.japanese || item.hiragana || '';
  }

  switch (questionType) {
    case 'romaji':
      return item.romaji || resolveExpectedAnswers(item, questionType, gameMode)[0] || '';

    case 'kunyomi': {
      const normalized = normalizeAcceptedAnswers(item);
      return normalized.kunyomi[0] || item.hiragana || '';
    }
    case 'onyomi': {
      const normalized = normalizeAcceptedAnswers(item);
      return normalized.onyomi[0] || '';
    }
    case 'reading':
      return item.hiragana || item.romaji || '';

    case 'meaning':
      return item.translation || '';

    default:
      return item.translation || item.romaji || '';
  }
};

// ─── createExercise (plan §2) ──────────────────────────────────────────────────

/**
 * THE main function. Creates a complete, validated exercise object
 * ready to be rendered by GamePage.jsx (plan §2, §5).
 *
 * @param {object} item           - A word row from the database.
 * @param {array}  allWords       - All loaded words (for distractors).
 * @param {string} difficultyMode - 'apprentice' or 'master'.
 * @param {string} gameMode       - 'recognize' or 'translate'.
 * @returns {object} Complete exercise object.
 */
export const createExercise = (
  item,
  allWords = [],
  difficultyMode = 'apprentice',
  gameMode = 'recognize'
) => {
  if (!item) return null;

  const itemType = item.item_type || (containsKanji(item.japanese) ? 'kanji' : 'vocabulary');
  const questionType = gameMode === 'translate' ? 'translate' : resolveQuestionType(item);
  const prompt = resolvePrompt(item, gameMode);
  const { instruction, displayCategory } = resolveInstruction(
    item,
    questionType,
    difficultyMode,
    gameMode,
    prompt
  );
  const expectedAnswers = resolveExpectedAnswers(item, questionType, gameMode);
  const isApprentice = difficultyMode === 'apprentice';
  const hasKanji = containsKanji(item.japanese);

  const exercise = {
    id: item.id,
    wordId: item.id,
    gameMode,
    prompt,
    questionType,
    instruction,
    displayCategory,
    expectedAnswers,
    presentation: isApprentice ? 'multiple_choice' : 'open_input',
    options: null,
    xpMultiplier: difficultyMode === 'master' ? 1.5 : 1,
    correctOptionLabel: resolveCorrectOptionLabel(item, questionType, gameMode),
    solutionDisplay: generateSolutionDisplay(item, gameMode),
    kanjiFeedback: generateKanjiFeedback(item, questionType),
    placeholder:
      gameMode === 'translate'
        ? 'Escribe en japonés o romaji...'
        : 'Escribe la respuesta exacta...',

    // Metadata for rendering
    itemType,
    hasKanji,
    hiragana: item.hiragana,
    katakana: item.katakana,
    romaji: item.romaji,
    translation: item.translation,
    difficulty: item.difficulty,
    experienceReward: item.experience_reward ?? 10,
    answers: expectedAnswers, // alias for backward compatibility

    _rawItem: item,
    rawRow: item, // alias for backward compatibility
  };

  // Validate the exercise (plan §5) — if invalid, try fallback for recognize mode
  if (!validateExercise(exercise)) {
    if (gameMode === 'recognize') {
      const fallbackQT = questionType === 'meaning' ? 'romaji' : 'meaning';
      const fallbackAnswers = resolveExpectedAnswers(item, fallbackQT, gameMode);
      const fallbackInstruction = resolveInstruction(
        item,
        fallbackQT,
        difficultyMode,
        gameMode,
        prompt
      );

      exercise.questionType = fallbackQT;
      exercise.expectedAnswers = fallbackAnswers;
      exercise.answers = fallbackAnswers;
      exercise.instruction = fallbackInstruction.instruction;
      exercise.correctOptionLabel = resolveCorrectOptionLabel(item, fallbackQT, gameMode);
      exercise.solutionDisplay = generateSolutionDisplay(item, gameMode);
      exercise.kanjiFeedback = generateKanjiFeedback(item, fallbackQT);

      if (!validateExercise(exercise)) {
        console.warn(
          `[gameplayLogic] Exercise still invalid after fallback for item "${item.japanese}" (id: ${item.id})`
        );
      }
    }
  }

  // Generate MC options for Apprentice mode
  if (isApprentice) {
    exercise.options = generateMultipleChoiceOptions(exercise, allWords, gameMode);
  }

  return exercise;
};

// ─── Backward-Compatible Exports ───────────────────────────────────────────────

/**
 * @deprecated Use `createExercise()` instead. Kept for backward compatibility
 * during the transition period.
 */
export const resolveQuestionDetails = (row, targetMode = 'recognize', difficultyMode = 'apprentice') => {
  const exercise = createExercise(row, [], difficultyMode, targetMode);
  if (!exercise) {
    return {
      wordId: row?.id,
      prompt: row?.japanese || '',
      instruction: 'Escribe la respuesta',
      displayCategory: '',
      itemType: row?.item_type || 'vocabulary',
      hasKanji: containsKanji(row?.japanese),
      hiragana: row?.hiragana,
      katakana: row?.katakana,
      romaji: row?.romaji,
      translation: row?.translation,
      difficulty: row?.difficulty,
      experienceReward: row?.experience_reward ?? 10,
      answers: [],
      rawRow: row,
    };
  }

  return {
    wordId: exercise.wordId,
    prompt: exercise.prompt,
    instruction: exercise.instruction,
    displayCategory: exercise.displayCategory,
    itemType: exercise.itemType,
    hasKanji: exercise.hasKanji,
    hiragana: exercise.hiragana,
    katakana: exercise.katakana,
    romaji: exercise.romaji,
    translation: exercise.translation,
    difficulty: exercise.difficulty,
    experienceReward: exercise.experienceReward,
    answers: exercise.expectedAnswers,
    rawRow: row,
    questionType: exercise.questionType,
    kanjiFeedback: exercise.kanjiFeedback,
    correctOptionLabel: exercise.correctOptionLabel,
    solutionDisplay: exercise.solutionDisplay,
    _rawItem: row,
  };
};
