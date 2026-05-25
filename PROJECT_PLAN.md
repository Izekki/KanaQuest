# KanaQuest — Project Plan & Actionable Tasks

Date: 2026-05-25
Package manager: pnpm (confirmed)

Overview
- Tech: React + Vite + TailwindCSS (frontend-only). Supabase is the only backend.
- Primary learning modes: Reconocer (identify/read), Traducir (translate).

MVP Features
- Auth (Supabase): register / login / session
- Gameplay: Game page with Reconocer and Traducir flows
- Progress tracking: per-word progress + review queue
- Profile page: level, XP, stats
- Public vocabulary browsing (words list)

Top-level pages & routes
- `Home` — overview, start game
- `Game` — gameplay surface and answer entry
- `Login` / `Register` — auth flows
- `Profile` — user progress and settings

Core components to implement first
- Layout: `TopBar`, `LeftPanel`, `CenterPanel`, `RightPanel`
- Gameplay: `QuestionCard`, `AnswerInput`, `Timer`, `ScoreBadge`
- Review: `ReviewQueue`, `ProgressList`
- Shared: `Button`, `Card`, `Icon`, `Avatar`, `Modal`

Services & hooks
- `src/services/supabase/` — Supabase client initialization
- `src/services/game/` — game flow + session logic
- Hooks: `useAuth`, `useGameSession`, `useProgress`

Data model checklist (from Supabase_Architecture_Specification.md)
- Tables: `users`, `profiles`, `words`, `word_types`, `progress`, `game_sessions`, `review_queue`
- Buckets: `word-images`, `avatars`, `audio`
- Policies: public read for `words`; restricted access for `progress`, `profiles`, `game_sessions`.

Supabase checklist (developer steps)
1. Confirm `src/services/supabase/` exists and exports a configured client.
2. Ensure environment variables present in dev: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Search code for table usage and align with spec table names.
4. If schema changes are needed, open an issue and request human approval before running migrations.
5. Use Supabase VS Code extension for safe inspection; use `supabase` CLI only with approval.

Design tokens (extracted)
- Primary Accent: `#BF5468`
- Secondary Accent: `#73273B`
- Cream Tone: `#F2D0BD`
- Muted Rose: `#A67272`
- Neutral: `#F2F2F2`

Tailwind / styling notes
- Create a `tokens/colors.js` or extend `tailwind.config.js` with the colors above.
- Use `Inter` / `Noto Sans JP` for typography; ensure font fallback supports Japanese glyphs.

Local dev commands (use `package.json` scripts if present)
```
pnpm install
pnpm run dev
pnpm run build
```

Scaffolding steps (recommended order)
1. Ensure `package.json` exists; if not, run `pnpm init -y`.
2. Install dependencies:
```
pnpm add react react-dom react-router-dom
pnpm add -D vite tailwindcss postcss autoprefixer
```
3. Add `src/` skeleton and folders: `components/`, `pages/`, `services/supabase/`, `hooks/`, `styles/`, `assets/`.
4. Create minimal Supabase client file: `src/services/supabase/client.js` (reads env vars).
5. Add Tailwind config and base CSS importing the tokens.
6. Scaffold `App.jsx` and `main.jsx` with router and layout.

Immediate next actions I can do now (choose one)
- Scaffold the repo skeleton and basic `App.jsx` + `src/services/supabase/client.js` using `pnpm`.
- Create Tailwind config and include the color tokens.
- Run a codebase check to verify the Supabase client and list missing pieces.

Notes
- I saved your preference for `pnpm` and to persist important milestones in memory.
