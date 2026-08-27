# KanaQuest 🌸

KanaQuest is a gamified, responsive web application designed for learning Japanese (**Hiragana, Katakana, Kanji, and vocabulary**) through active recall, visual association, and spaced repetition. Built with a modern, decoupled architecture, it offers users an interactive, progress-tracked, and competitive environment to master Japanese characters.

This project is fully deployed and active in production.

---

## 🎮 Core Gameplay & Learning Modes

KanaQuest features three main educational modes designed to reinforce vocabulary, grammar, and character recognition:

1. **Reconocer (Recognition)**
   - **Goal:** Users identify a Japanese word or kanji and write its corresponding reading in Hiragana, Katakana, or Romaji (for beginners).
   - **Tech Integration:** Features real-time input conversion using **Wanakana** to allow direct phonetic typing, normalizing inputs to ignore casing and spaces.

2. **Traducir (Translation)**
   - **Goal:** Users translate Japanese words into their semantic meaning in Spanish.
   - **Educational Focus:** Reinforces word comprehension, vocabulary recall, and reading comprehension.

3. **Constructor de Oraciones (Sentence Builder)**
   - **Goal:** Users construct full Japanese sentences by arranging disordered Hiragana word chips into the correct grammatical order.
   - **Interactive Mechanics:** Fluid drag-and-drop and click-to-place interactions with instant validation and error highlighting.
   - **Curriculum:** Sentences organized by difficulty and thematic topics (Greetings, Introductions & Family, Dining & Restaurants, Housing & Locations).

---

## ✨ Key Features

- **Gamified Progression (XP & Levels):** Users earn Experience Points (XP) and level up as they answer correctly. Levels are calculated dynamically via custom PostgreSQL database functions.
- **User Profile & Customization:** Personalized profiles show stats (XP, level, games played, accuracy). Users can change their usernames and upload profile avatars.
- **Dynamic Leaderboard:** A real-time ranking panel showcases the top 10 players based on accumulated experience points.
- **Streak Tracker:** Encourages daily active recall by tracking consecutive learning streaks.
- **Historical Progress:** Dedicated progress dashboards for vocabulary recall and sentence construction attempts.
- **Sakura Floating Particles:** Immerse users in a beautiful, Japanese-themed design with smooth, custom CSS floating petal animations.

---

## 🛠️ Tech Stack & Services

### Frontend
- **React (v18):** Declarative UI rendering, customized hooks, and state management.
- **Vite:** Next-generation build tool for ultra-fast development and optimized production bundles.
- **TailwindCSS:** A utility-first CSS framework used to build a clean, minimalist, soft dark theme.
- **React Router (v6):** Client-side routing for seamless page navigation.
- **Wanakana:** Utilized for client-side Japanese text detection and conversion.

### Backend & Services (Serverless)
- **Supabase:** The core backend provider (no custom backend server is needed).
  - **PostgreSQL Database:** Relational database storing user metadata, profiles, progress, topics, sentences, and vocabulary words.
  - **Supabase Auth:** Secure, persistent authentication managing user registration, login, and sessions.
  - **Supabase Storage:** Storage buckets containing word images and user profile avatars.
  - **Edge Functions:** Serverless functions to handle secure operations, such as generating temporary signed URLs and bulk data seeding.

---

## 📐 Architecture & Clean Code Patterns

To maintain a highly scalable and professional codebase, KanaQuest follows these design constraints:

- **MVC / Service Layer Separation:** Direct database queries inside components are forbidden. All database and API logic is encapsulated in modular models under `src/services/supabase/`:
  - `auth.js` — Handles authentication, sessions, and state changes.
  - `words.js` — Handles vocabulary fetching.
  - `sentences.js` — Handles sentence topics, relational sentence fetching with ordered blocks, and sentence progress tracking.
  - `progress.js` — Handles profile CRUD, progress tracking, and leaderboard data.
  - `storage.js` — Handles image uploads, removals, and signed URL generation.
- **Row Level Security (RLS):** All Postgres tables enforce RLS policies. Public tables (like `words`, `topics`, `sentences`, `sentence_blocks`) have public read access, whereas private tables (like `progress`, `sentence_progress`, `profiles`) restrict modifications strictly to authenticated resource owners.
- **Database Automation:** Profile experience points and levels are updated automatically in the database via triggers on the `word_experience_awards` table.

---

## 🗃️ Data Ingestion & Seeding

### Vocabulary Ingestion
Vocabulary is populated using a local automated ingestion script (`scripts/ingest_vocab.js`) that:
1. Queries the **Jisho API** to fetch authentic vocabulary, readings, and JLPT levels.
2. Enriches character details by querying the **KanjiAPI.dev** service.
3. Automatically translates English definitions to Spanish using translation endpoints.
4. Inserts deduplicated entries securely using the Supabase Service Role Key.

### Sentence Builder Seeding
Sentence builder datasets are populated from structured datasets (`dataset.json`) containing categorized sentences and grammatical word blocks:
- **Node Script:** `pnpm run seed:sentences` (loads credentials securely from environment variables).
- **Edge Function:** `supabase/functions/seed-sentences` for serverless, on-demand execution.

