// scripts/ingest_vocab.js
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);
const getArg = (f) => {
  const i = args.indexOf(f);
  return i === -1 ? null : args[i + 1] ?? null;
};

const kanjiRegex = /\p{Script=Han}/gu;

const sampleData = [ /* ejemplo para dry-run */ ];

const options = {
  limit: Number.parseInt(getArg('--limit') ?? '10', 10),
  dryRun: hasFlag('--dry-run'),
  writeKanjiJson: hasFlag('--write-kanji-json'),
  kanjiOutput: getArg('--kanji-out') ?? 'data/kanji.json',
};

const readTermsFile = async (p) => {
  const txt = await fs.readFile(p, 'utf8');
  return txt.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getDifficultyNum = (jlptTags) => {
  const tag = jlptTags?.[0] ?? '';
  const m = tag.match(/jlpt-n(\d)/i);
  return m ? Number.parseInt(m[1], 10) : null;
};

const mapDifficultyText = (n) => {
  if (n == null) return null;
  if (n === 5) return 'beginner';
  if (n === 4 || n === 3) return 'intermediate';
  return 'advanced';
};

const parseJishoEntry = (entry) => {
  const primary = entry?.japanese?.[0] ?? {};
  const japanese = primary.word ?? primary.reading ?? '';
  const reading = primary.reading ?? '';
  const translation = entry?.senses?.[0]?.english_definitions?.[0] ?? '';
  const type = (entry?.senses?.[0]?.parts_of_speech?.[0] ?? 'unknown').toLowerCase();
  if (!japanese || !translation) return null;
  return {
    japanese,
    hiragana: reading,
    katakana: '',
    romaji: '',
    translation,
    type,
    difficulty_num: getDifficultyNum(entry?.jlpt),
    image_url: null,
    audio_url: null,
  };
};

const fetchJisho = async (term) => {
  const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(term)}`);
  if (!res.ok) throw new Error(`Jisho failed ${res.status}`);
  const payload = await res.json();
  return (payload.data ?? []).slice(0, options.limit).map(parseJishoEntry).filter(Boolean);
};

const extractKanji = (s) => {
  if (!s) return [];
  const m = s.match(kanjiRegex);
  return m ? [...new Set(m)] : [];
};

const writeKanjiOutput = async (kanjiSet, outPath) => {
  const out = [];
  for (const k of kanjiSet) {
    try {
      const r = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(k)}`);
      if (r.ok) out.push(await r.json());
    } catch (e) {
      console.warn('kanji fetch failed', k, e?.message);
    }
  }
  const dest = path.resolve(__dirname, '..', outPath);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, JSON.stringify(out, null, 2), 'utf8');
  console.log('Kanji enrichment saved to', outPath);
};

const run = async () => {
  const randomCount = Number.parseInt(getArg('--random') ?? '0', 10);
  const termArg = getArg('--term');
  const termsFile = getArg('--terms-file');

  let terms = [];
  if (termArg) terms.push(termArg);
  if (termsFile) terms.push(...await readTermsFile(termsFile));

  if (randomCount > 0) {
    if (!terms.length) {
      console.error('To use --random you must provide --terms-file with seeds.');
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

  // fetch entries from Jisho
  const rows = [];
  for (const t of terms) {
    try {
      const r = await fetchJisho(t);
      rows.push(...r);
    } catch (e) {
      console.warn('Failed fetch for', t, e?.message);
    }
  }

  // dedupe by japanese
  const deduped = Object.values(rows.reduce((acc, r) => { acc[r.japanese] = acc[r.japanese] ?? r; return acc; }, {}));

  if (!deduped.length) {
    console.log('No entries found.');
    return;
  }

  // Resolve existing word_types
  const { data: existingTypes } = await supabase.from('word_types').select('id,name');
  const typeMap = new Map((existingTypes ?? []).map(t => [t.name.toLowerCase(), t.id]));

  // find missing types
  const missing = Array.from(new Set(deduped.map(d => d.type.toLowerCase()))).filter(n => !typeMap.has(n));
  if (missing.length) {
    const inserts = missing.map(name => ({ name }));
    const ins = await supabase.from('word_types').insert(inserts).select('id,name');
    if (ins.error) console.warn('Failed to insert missing word_types:', ins.error.message);
    else (ins.data ?? []).forEach(t => typeMap.set(t.name.toLowerCase(), t.id));
  }

  // transform payload for words table
  const payload = deduped.map(r => {
    const difficulty = mapDifficultyText(r.difficulty_num);
    const type_id = typeMap.get((r.type || 'unknown').toLowerCase()) ?? null;
    return {
      japanese: r.japanese,
      hiragana: r.hiragana || null,
      katakana: r.katakana || null,
      romaji: r.romaji || null,
      translation: r.translation || null,
      type_id,
      difficulty,
      image_url: r.image_url,
      audio_url: r.audio_url,
    };
  });

  // upsert using unique constraint on japanese
  const upsertRes = await supabase.from('words').upsert(payload, { onConflict: 'japanese' });
  if (upsertRes.error) {
    console.error('Upsert error:', upsertRes.error.message);
    process.exit(1);
  }
  console.log(`Upserted ${payload.length} rows into words.`);

  if (options.writeKanjiJson) {
    const kanjiSet = new Set(payload.flatMap(p => extractKanji(p.japanese)));
    await writeKanjiOutput(kanjiSet, options.kanjiOutput);
  }
};

run().catch(e => { console.error(e); process.exit(1); });