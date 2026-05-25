# Skill: Supabase Helper — KanaQuest

Purpose: Guidance for agents performing Supabase-related checks, small migrations, and integrations for KanaQuest.

Scope
- Validate Supabase client usage in the frontend and ensure environment variables are present.
- Verify table usage matches `Supabase_Architecture_Specification.md` (e.g., `words`, `progress`, `profiles`).
- Recommend using the Supabase VS Code extension or the Supabase CLI for migrations, but prefer human approval for schema changes.

Checks to run
1. Confirm `src/services/supabase/` exists and exports a configured client.
2. Ensure environment variables referenced: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Search codebase for table names used (`words`, `progress`, `profiles`, `game_sessions`, `review_queue`) and report mismatches.
4. Verify public-read policies for `words` and restricted policies for `progress` and `profiles` align with the spec.

When to use Supabase extension or CLI
- Use the Supabase VS Code extension to inspect tables and rows locally in the editor.
- Use `supabase` CLI for migrations only if a migration system exists; otherwise prefer database changes via Supabase dashboard.

Commands (run only after review)
```
# install supabase CLI (if needed)
pnpm install -g supabase
# login (manual step)
supabase login
# pull db schema (if project is configured)
supabase db pull
```

When to ask the human
- Any schema migration or policy change.
- Need for service role keys or other secrets.

Related files
- Supabase_Architecture_Specification.md — canonical schema and policies.
