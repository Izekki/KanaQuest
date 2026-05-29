# KanaQuest

KanaQuest is a frontend-first Japanese learning platform built with React, Vite, TailwindCSS, and Supabase.

## Start

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Environment

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Vocabulary ingestion (Jisho + KanjiAPI)

This project includes a local ingestion script for importing vocabulary into Supabase.

Required environment variables (set in your shell, not committed):

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Dry run (no network, no Supabase write):

```bash
pnpm run ingest:dry
```

Ingest a term:

```bash
pnpm run ingest:vocab -- --term "猫" --limit 5
```

By default, imported `translation` values are converted to Spanish (`--translate-to es`). If you want to reseed vocabulary from scratch and remove older imported rows first, truncate `public.words` in Supabase; use `TRUNCATE public.words RESTART IDENTITY CASCADE;` if you also want to clear dependent `progress` and `review_queue` rows.

Ingest multiple terms from file:

```bash
pnpm run ingest:vocab -- --terms-file ./terms.txt --limit 10 --write-kanji-json
```

Quick verification in Supabase SQL editor (step 2):

```sql
select
	japanese,
	hiragana,
	katakana,
	romaji,
	translation,
	created_at
from public.words
order by created_at desc
limit 30;
```
