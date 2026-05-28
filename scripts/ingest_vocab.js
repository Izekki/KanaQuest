import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { toHiragana, toKatakana, toRomaji } from 'wanakana';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] ?? null;
};

const kanjiRegex = /\p{Script=Han}/gu;
const kanaOnlyRegex = /^[\p{Script=Hiragana}\p{Script=Katakana}ー々]+$/u;

const sampleData = [
  {
    japanese: '猫',
    hiragana: 'ねこ',
    katakana: '',
    romaji: 'neko',
    translation: 'cat',
    type: 'noun',
    difficulty: 'beginner',
    image_url: null,
    audio_url: null,
  },
];

const options = {
  limit: Number.parseInt(getArg('--limit') ?? '10', 10),
  dryRun: hasFlag('--dry-run'),
  writeKanjiJson: hasFlag('--write-kanji-json'),
  kanjiOutput: getArg('--kanji-out') ?? 'data/kanji.json',
};

const readTermsFile = async (filePath) => {
  const contents = await fs.readFile(filePath, 'utf8');
  return contents.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
};

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDifficultyNum = (jlptTags) => {
  const tag = jlptTags?.[0] ?? '';
  const match = tag.match(/jlpt-n(\d)/i);
  return match ? Number.parseInt(match[1], 10) : null;
};

const mapDifficultyText = (level) => {
  if (level == null) return null;
  if (level === 5) return 'beginner';
  if (level === 4 || level === 3) return 'intermediate';
  return 'advanced';
};

const normalizeTranslationSourceText = (text) =>
  (text ?? '')
    .replace(/\([^)]*\)/g, '')
    .split(/[,;/]/)[0]
    .trim();

const parseJishoEntry = (entry) => {
  const primary = entry?.japanese?.[0] ?? {};
  const japanese = primary.word ?? primary.reading ?? '';
  const readingCandidate = primary.reading ?? (kanaOnlyRegex.test(japanese) ? japanese : '');
  const hiragana = readingCandidate ? toHiragana(readingCandidate) : '';
  const katakana = hiragana ? toKatakana(hiragana) : '';
  const romaji = hiragana ? toRomaji(hiragana) : '';
  const translation = entry?.senses?.[0]?.english_definitions?.[0] ?? '';
  const type = (entry?.senses?.[0]?.parts_of_speech?.[0] ?? 'unknown').toLowerCase();

  if (!japanese || !translation) return null;

  return {
    japanese,
    hiragana,
    katakana,
    romaji,
    translation,
    type,
    difficulty_num: getDifficultyNum(entry?.jlpt),
    image_url: null,
    audio_url: null,
  };
};

const fetchJisho = async (term) => {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(term)}`);
    if (response.ok) {
      const payload = await response.json();
      return (payload.data ?? []).slice(0, options.limit).map(parseJishoEntry).filter(Boolean);
    }

    if (response.status !== 429 || attempt === maxAttempts) {
      throw new Error(`Jisho request failed (${response.status})`);
    }

    const retryAfter = Number.parseInt(response.headers.get('retry-after') ?? '0', 10);
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : attempt * 1000;
    await sleep(waitMs);
  }

  return [];
};

const extractKanji = (word) => {
  if (!word) return [];
  const matches = word.match(kanjiRegex);
  return matches ? [...new Set(matches)] : [];
};

const writeKanjiOutput = async (kanjiSet, outputPath) => {
  const output = [];
  for (const kanji of kanjiSet) {
    try {
      const response = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(kanji)}`);
      if (response.ok) {
        output.push(await response.json());
      }
    } catch (error) {
      console.warn(`Failed to fetch kanji ${kanji}:`, error?.message ?? error);
    }
  }

  const resolvedPath = path.resolve(__dirname, '..', outputPath);
  await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fs.writeFile(resolvedPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Kanji enrichment saved to ${outputPath}`);
};

const translateWithMyMemory = async (text, target) => {
  const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${encodeURIComponent(target)}`);
  if (!response.ok) {
    throw new Error(`mymemory ${response.status}`);
  }

  const payload = await response.json();
  const translated = payload?.responseData?.translatedText ?? '';
  if (!translated) {
    throw new Error('mymemory returned empty translation');
  }

  return translated;
};

const translateWithLibreTranslate = async (text, target) => {
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ q: text, source: 'en', target, format: 'text' }),
  });

  if (!response.ok) {
    throw new Error(`libretranslate ${response.status}`);
  }

  const payload = await response.json();
  const translated = payload.translatedText ?? '';
  if (!translated) {
    throw new Error('libretranslate returned empty translation');
  }

  return translated;
};

const translateText = async (text, target) => {
  const translators = [translateWithMyMemory, translateWithLibreTranslate];
  let lastError = null;

  for (const translator of translators) {
    try {
      return await translator(text, target);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Translation failed for "${text}": ${lastError?.message ?? lastError}`);
};

const run = async () => {
  const randomCount = Number.parseInt(getArg('--random') ?? '0', 10);
  const termArg = getArg('--term');
  const termsFile = getArg('--terms-file');
  const translateTo = getArg('--translate-to') ?? 'es';

  let terms = [];
  if (termArg) terms.push(termArg);
  if (termsFile) terms.push(...(await readTermsFile(termsFile)));

  if (randomCount > 0) {
    if (!terms.length) {
      console.error('To use --random you must provide --terms-file with seed terms.');
      process.exit(1);
    }
    terms = shuffle(terms).slice(0, randomCount);
  }

  if (options.dryRun) {
    console.log('Dry run payload example:');
    console.log(JSON.stringify(sampleData, null, 2));
    return;
  }

  if (!terms.length) {
    console.error('Provide --term or --terms-file (or use --random with --terms-file).');
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY in env.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const rows = [];
  for (const term of terms) {
    try {
      const entries = await fetchJisho(term);
      rows.push(...entries);
      await sleep(250);
    } catch (error) {
      console.warn(`Failed fetch for ${term}:`, error?.message ?? error);
    }
  }

  const deduped = Object.values(
    rows.reduce((accumulator, row) => {
      accumulator[row.japanese] = accumulator[row.japanese] ?? row;
      return accumulator;
    }, {})
  );

  if (!deduped.length) {
    console.log('No entries found.');
    return;
  }

  const { data: existingTypes, error: typeError } = await supabase.from('word_types').select('id,name');
  if (typeError) {
    throw typeError;
  }

  const typeMap = new Map((existingTypes ?? []).map((type) => [type.name.toLowerCase(), type.id]));
  const missingTypes = Array.from(new Set(deduped.map((row) => row.type.toLowerCase()))).filter((name) => !typeMap.has(name));

  if (missingTypes.length) {
    const insertResult = await supabase.from('word_types').insert(missingTypes.map((name) => ({ name }))).select('id,name');
    if (insertResult.error) {
      throw insertResult.error;
    }
    for (const typeRow of insertResult.data ?? []) {
      typeMap.set(typeRow.name.toLowerCase(), typeRow.id);
    }
  }

  let payload = deduped.map((row) => ({
    japanese: row.japanese,
    hiragana: row.hiragana || null,
    katakana: row.katakana || null,
    romaji: row.romaji || null,
    translation: row.translation || null,
    type_id: typeMap.get((row.type || 'unknown').toLowerCase()) ?? null,
    difficulty: mapDifficultyText(row.difficulty_num),
    image_url: row.image_url,
    audio_url: row.audio_url,
  }));

  if (translateTo) {
    for (const row of payload) {
      if (row.translation) {
        const sourceText = normalizeTranslationSourceText(row.translation);
        row.translation = await translateText(sourceText || row.translation, translateTo);
      }
    }
  }

  const japaneseList = payload.map((row) => row.japanese).filter(Boolean);
  const existingWordsResult = await supabase.from('words').select('japanese').in('japanese', japaneseList);
  if (existingWordsResult.error) {
    throw existingWordsResult.error;
  }

  const existingJapanese = new Set((existingWordsResult.data ?? []).map((row) => row.japanese));
  const newRows = payload.filter((row) => !existingJapanese.has(row.japanese));

  if (!newRows.length) {
    console.log('No new words to insert (all already exist).');
  } else {
    const insertResult = await supabase.from('words').insert(newRows);
    if (insertResult.error) {
      throw insertResult.error;
    }
    console.log(`Inserted ${newRows.length} new vocabulary items.`);
  }

  if (options.writeKanjiJson) {
    const sourceRows = newRows.length ? newRows : payload;
    const kanjiSet = new Set(sourceRows.flatMap((row) => extractKanji(row.japanese)));
    await writeKanjiOutput(kanjiSet, options.kanjiOutput);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
