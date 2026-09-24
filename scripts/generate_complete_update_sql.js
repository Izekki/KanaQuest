import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const jsonPath = path.join(rootDir, 'supabase', 'functions', 'words_types_actualizar.json');
const words = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const escapeSqlStr = (val) => {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
};

const escapeSqlArray = (arr) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 'NULL';
  const elements = arr.map((item) => `'${String(item).replace(/'/g, "''")}'`).join(', ');
  return `ARRAY[${elements}]`;
};

const escapeSqlJson = (obj) => {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  const jsonStr = JSON.stringify(obj).replace(/'/g, "''");
  return `'${jsonStr}'::jsonb`;
};

let sql = `-- ==============================================================================
-- KanaQuest: Migración Integral de public.words (DDL + DML)
-- Fecha: 2026-09-24
-- Total registros actualizados: ${words.length}
-- ==============================================================================

BEGIN;

-- 1. RESPALDO INTERNO DE SEGURIDAD (Por si necesitas restaurar)
DROP TABLE IF EXISTS public.words_backup_20260924;
CREATE TABLE public.words_backup_20260924 AS 
SELECT * FROM public.words;

COMMENT ON TABLE public.words_backup_20260924 IS 
'Snapshot de seguridad de public.words tomado el 2026-09-24 antes de la migración de item_type.';

-- 2. AÑADIR NUEVAS COLUMNAS ESTRUCTURALES
ALTER TABLE public.words 
ADD COLUMN IF NOT EXISTS item_type text DEFAULT 'vocabulary' 
CHECK (item_type IN ('kana', 'kanji', 'vocabulary'));

ALTER TABLE public.words 
ADD COLUMN IF NOT EXISTS kunyomi text[] DEFAULT NULL;

ALTER TABLE public.words 
ADD COLUMN IF NOT EXISTS onyomi text[] DEFAULT NULL;

ALTER TABLE public.words 
ADD COLUMN IF NOT EXISTS target_question_type text DEFAULT NULL;

-- 3. AJUSTAR LA RESTRICCIÓN UNIQUE (Opción A: UNIQUE por japonés y tipo)
ALTER TABLE public.words DROP CONSTRAINT IF EXISTS words_japanese_key;
ALTER TABLE public.words DROP CONSTRAINT IF EXISTS words_japanese_item_type_key;
ALTER TABLE public.words ADD CONSTRAINT words_japanese_item_type_key UNIQUE (japanese, item_type);

-- 4. ACTUALIZACIÓN MASIVA DE LOS ${words.length} REGISTROS (DML)
`;

for (const w of words) {
  sql += `UPDATE public.words SET
  japanese = ${escapeSqlStr(w.japanese)},
  hiragana = ${escapeSqlStr(w.hiragana)},
  katakana = ${escapeSqlStr(w.katakana)},
  romaji = ${escapeSqlStr(w.romaji)},
  translation = ${escapeSqlStr(w.translation)},
  part_of_speech = ${escapeSqlStr(w.part_of_speech)},
  difficulty = ${escapeSqlStr(w.difficulty)},
  item_type = ${escapeSqlStr(w.item_type)},
  kunyomi = ${escapeSqlArray(w.kunyomi)},
  onyomi = ${escapeSqlArray(w.onyomi)},
  accepted_answers = ${escapeSqlJson(w.accepted_answers)},
  target_question_type = ${escapeSqlStr(w.target_question_type)}
WHERE id = '${w.id}';
`;
}

sql += `
COMMIT;

-- 5. VERIFICACIÓN FINAL
SELECT item_type, count(*) AS total_palabras 
FROM public.words 
GROUP BY item_type;
`;

const outputPath = path.join(rootDir, 'supabase', 'migrations', '20260924130000_apply_words_update_dataset.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

const rootOutputPath = path.join(rootDir, 'ejecutar_en_supabase_actualizar_palabras.sql');
fs.writeFileSync(rootOutputPath, sql, 'utf8');

console.log(`✅ Generated SQL file with ${words.length} updates at:`);
console.log(`   - ${outputPath}`);
console.log(`   - ${rootOutputPath}`);
