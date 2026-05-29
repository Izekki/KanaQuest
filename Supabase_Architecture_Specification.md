# Supabase Architecture Specification — Japanese Learning Platform

# Purpose

This document defines the structure, responsibilities, and organization of the Supabase backend used by the Japanese learning platform.

Supabase is the ONLY backend service used in the project.

---

# Supabase Responsibilities

Supabase will handle:

- Authentication
- PostgreSQL Database
- Storage
- User sessions
- Security policies
- User progress
- Vocabulary persistence

---

# Supabase Main Structure

# Authentication

Supabase Auth will manage:

- Register
- Login
- Sessions
- Password recovery
- Persistent login

The frontend must NEVER create custom auth logic.

---

# Database Tables

# users

Purpose:
Store public user information.

## Fields

```sql
id
username
avatar_url
created_at
```

---

# profiles

Purpose:
Store user gameplay data.

## Fields

```sql
id
user_id
level
experience
games_played
correct_answers
wrong_answers
created_at
```

---

# words

Purpose:
Main vocabulary database.

## Fields

```sql
id
japanese
hiragana
katakana
romaji
translation
type
difficulty
image_url
audio_url
created_at
```

---

# word_types

Purpose:
Categorize vocabulary.

## Example Values

- object
- animal
- food
- kanji
- verb
- adjective

---

# progress

Purpose:
Track user progress per word.

## Fields

```sql
id
user_id
word_id
status
correct
attempts
last_attempt
mastery_level
```

Notes:
- One row per user and word.
- `status` represents the current learning state for that word, while `correct` and `mastery_level` remain useful for scoring and review logic.

---

# game_sessions

Purpose:
Track gameplay sessions.

## Fields

```sql
id
user_id
mode
score
correct_answers
wrong_answers
duration
created_at
```

---

# review_queue

Purpose:
Store difficult or failed words for repetition.

## Fields

```sql
id
user_id
word_id
priority
created_at
```

---

# Storage Structure

# Bucket: word-images

Purpose:
Store educational images.

Examples:
- apple.png
- cat.png
- water.png

---

# Bucket: avatars

Purpose:
Store user profile images.

---

# Bucket: audio

Purpose:
Store pronunciation audio files.

Future feature.

---

# Security Rules

# Required Policies

The system MUST:

- Protect user data
- Restrict progress access to owners
- Restrict profile editing to owners
- Allow public read for vocabulary

---

# Public Access

Allowed:
- words table
- word images

---

# Private Access

Protected:
- progress
- sessions
- review queues
- profiles

---

# Frontend Connection

# Environment Variables

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

# Supabase Client Location

Required path:

```txt
src/services/supabase/
```

---

# Required Files

```txt
src/services/supabase/
│
├── client.js
├── auth.js
├── words.js
├── progress.js
└── storage.js
```

---

# Responsibilities per File

# client.js

Handles:
- Supabase initialization

---

# auth.js

Handles:
- Login
- Register
- Logout
- Session management

---

# words.js

Handles:
- Fetch vocabulary
- Fetch by difficulty
- Fetch by mode

---

# progress.js

Handles:
- Save progress
- Retrieve statistics
- Update mastery

---

# storage.js

Handles:
- Image retrieval
- Audio retrieval
- Upload utilities

---

# Vocabulary System Rules

The vocabulary system MUST support:

- Hiragana
- Katakana
- Kanji
- Romaji
- Translations
- Image association

---

# Difficulty Rules

# Beginner

Allow:
- Romaji
- Simple vocabulary

---

# Intermediate

Use:
- Hiragana
- Katakana

---

# Advanced

Use:
- Kanji
- Mixed writing systems
- Timed challenges

---

# AI Responsibilities

The AI working on this project MUST:

- Respect this database structure
- Avoid modifying schema unnecessarily
- Maintain scalability
- Keep queries modular
- Separate concerns properly

---

# Forbidden Practices

DO NOT:

- Hardcode credentials
- Duplicate database logic
- Mix storage logic with UI
- Put Supabase queries directly inside components

Use services instead.

---

# Final Goal

Supabase should act as:

- Database
- Authentication provider
- Storage manager
- Persistent progression system

while the frontend remains responsible for gameplay and presentation.
