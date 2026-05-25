# AGENTS — KanaQuest agent instructions

Purpose: Quick orientation and behavioral constraints for AI coding agents working on KanaQuest. Keep this file minimal — link to detailed docs for specifics.

## Quick links
- Project overview: [AI_Development_Specification.md](AI_Development_Specification.md)
- Supabase architecture: [Supabase_Architecture_Specification.md](Supabase_Architecture_Specification.md)
- Visual system & palette: [Frontend_Visual_System_and_Color_Palette.md](Frontend_Visual_System_and_Color_Palette.md)

## First steps for an agent
- Locate repository manifest(s) (e.g. `package.json`, `vite.config.js`) and `README.md`.
- If `package.json` exists: run `pnpm install` then `pnpm run dev` (or inspect `scripts` for the dev command).
- Verify Supabase client code under `src/services/supabase/` and validate required env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Read the linked specs before making architectural changes.

## Key conventions and constraints (must-follow)
- Frontend-only application: do NOT create backend servers. Supabase is the ONLY backend (see Supabase spec).
- Use React + Vite + TailwindCSS patterns; prefer small, reusable components and separate business logic from UI.
- Do NOT store secrets in source; use environment variables and Supabase policies.
- Target deployment: Vercel (keep builds frontend-oriented).

## Where to make changes
- UI components: `src/components/`
- Pages / routes: `src/pages/`
- Supabase integration: `src/services/supabase/`
- Shared utilities/hooks: `src/hooks/`, `src/utils/`

## Useful commands (run after inspection)
```
pnpm install
pnpm run dev
pnpm run build
```
(Only run commands that exist in `package.json`.)

## When to ask the human
- If you need to add or change backend behavior beyond Supabase capabilities.
- If a task requires secrets, credentials, or deployment access.

## Suggested next agent customizations
- `create-skill component-scaffold` — scaffold new components following the design tokens and folder conventions.
- `create-skill supabase-check` — validate Supabase table schemas and policies against `Supabase_Architecture_Specification.md`.

----
Maintainers: refer to the top-level docs linked above for deeper context.
