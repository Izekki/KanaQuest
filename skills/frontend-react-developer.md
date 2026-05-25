# Skill: Frontend React Developer — KanaQuest

Purpose: Persona and best-practices for an AI coding agent implementing frontend features for KanaQuest.

Core responsibilities
- Implement UI in React + Vite + TailwindCSS following the project's design tokens and layout rules.
- Keep components small, reusable, and testable; separate business logic (hooks/services) from presentation.
- Integrate with Supabase via `src/services/supabase/` for auth, data, storage.

How to start
1. Inspect `package.json` and use the repository package manager (`pnpm`/`npm`/`yarn`) accordingly.
2. Run install and dev command (adapt from `package.json`):
```
pnpm install
pnpm run dev
```
3. Open `src/services/supabase/` to confirm client initialization and required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

Conventions
- Files: pages in `src/pages/`, components in `src/components/`, hooks in `src/hooks/`, utilities in `src/utils/`.
- Follow visual rules in `Frontend_Visual_System_and_Color_Palette.md` for color, spacing, and component behavior.
- Prefer controlled components, avoid global singletons, and do not add a backend service — Supabase is the only backend.

When to modify UI vs. data
- UI-only tweaks: proceed with PR and include screenshots or storybook stories.
- Schema or policy changes: open an issue and request human approval before changing Supabase schema or policies.

Testing & QA
- Add lightweight unit tests for pure functions and hooks when practicable.
- Manually verify flows that touch Supabase using a test account and environment variables.

Questions to ask humans
- Which package manager should we standardize on? (pnpm/npm/yarn)
- Do you want CI or tests scaffolded now?

Related files
- AGENTS.md — high-level agent guidance.
- AI_Development_Specification.md — project goals and constraints.
