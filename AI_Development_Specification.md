# AI Development Specification — Japanese Learning Web Platform

# Project Overview

This project is a gamified Japanese learning web platform focused on:

- Hiragana
- Katakana
- Basic Kanji
- Vocabulary association
- Visual memory
- Active writing
- Reading comprehension

The system is educational-first and uses gameplay mechanics to improve memorization and active recall.

---

# Primary Goal

The platform must help users learn Japanese through:

- Visual recognition
- Active response writing
- Translation exercises
- Progressive difficulty
- Repetition systems

The focus is NOT entertainment only.
The focus is educational gamification.

---

# Technical Stack

## Frontend

- React
- Vite
- React Router
- TailwindCSS

## Backend Services

- Supabase ONLY

No traditional backend server should be created.

DO NOT create:

- Express server
- Node REST API
- Custom authentication backend

Supabase will handle:

- Authentication
- Database
- Storage
- Security
- User data

---

# Deployment

The project MUST be deployable directly to:

- Vercel

Architecture must remain frontend-oriented.

---

# Development Rules

## Important Constraints

The AI MUST:

- Use component-based architecture
- Keep components reusable
- Separate business logic from UI
- Avoid massive files
- Avoid duplicated logic
- Keep folders organized
- Use clean naming conventions
- Keep scalability in mind

---

# Forbidden Practices

DO NOT:

- Mix all logic inside pages
- Create giant components
- Hardcode repeated data
- Create backend servers
- Store secrets in frontend
- Use unnecessary libraries
- Create overly complex state management

---

# Application Structure

## Required Folder Structure

```txt
project/
│
├── public/
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── sounds/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── gameplay/
│   │   ├── history/
│   │   ├── forms/
│   │   ├── ui/
│   │   └── common/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Game/
│   │   ├── Login/
│   │   ├── Register/
│   │   └── Profile/
│   │
│   ├── hooks/
│   │
│   ├── services/
│   │   ├── supabase/
│   │   ├── game/
│   │   └── validation/
│   │
│   ├── context/
│   │
│   ├── data/
│   │
│   ├── utils/
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

# Application Architecture

# Frontend Responsibilities

The frontend is responsible for:

- Rendering UI
- Handling gameplay
- Validating answers
- Managing navigation
- Showing progress
- Showing history
- Managing local state
- Connecting to Supabase

---

# Supabase Responsibilities

Supabase is responsible for:

- Authentication
- Database
- Image storage
- User progress
- Security policies
- User sessions

---

# Core Gameplay Modes

# 1. Reconocer

## Objective

The user must identify an image or kanji and write its reading.

---

## Example

🍎 → りんご

猫 → ねこ

---

## Accepted Inputs

Beginner difficulty:
- Romaji
- Hiragana

Intermediate:
- Hiragana only

Advanced:
- Kana + Kanji combinations

---

## Educational Focus

This mode reinforces:

- Reading
- Active recall
- Kana memorization
- Visual association

---

# 2. Traducir

## Objective

The user must translate Japanese words into their meaning.

---

## Example

ねこ → gato

水 → agua

---

## Educational Focus

This mode reinforces:

- Vocabulary
- Reading comprehension
- Semantic association
- Kanji recognition

---

# Progressive Difficulty System

## Beginner

Allow:
- Romaji
- Hiragana

Provide:
- Visual help
- No timer

---

## Intermediate

Allow:
- Hiragana
- Katakana

Provide:
- Less assistance
- Moderate challenge

---

## Advanced

Use:
- Kanji
- Mixed kana
- Timers
- No hints

---

# Main UI Sections

# Left Panel — Review

Purpose:
- Show failed words
- Recent exercises
- History
- Review items

Potential features:
- Retry failed exercises
- Favorites
- Weak words tracking

---

# Center Panel — Main Gameplay

Must contain:
- Main image or kanji
- Answer input
- Verify button
- Navigation buttons
- Progress bar

This is the PRIMARY focus area.

---

# Right Panel — User & Modes

Contains:
- Game modes
- User information
- Quick stats
- Difficulty settings

---

# Required Components

# Layout Components

- Sidebar
- Topbar
- MainLayout
- GameLayout

---

# Gameplay Components

- QuestionCard
- AnswerInput
- VerifyButton
- ProgressBar
- GameControls
- GameImage
- KanaDisplay

---

# History Components

- ReviewList
- RecentAttempts
- FailedWordsCard

---

# UI Components

- Button
- Input
- Card
- Modal
- Loader
- Badge

---

# Services Layer

# Supabase Service

Handles:
- Auth
- Queries
- Storage access
- User session

---

# Validation Service

Handles:
- Answer normalization
- Kana validation
- Romaji conversion
- Correctness checking

---

# Game Service

Handles:
- Question generation
- Difficulty scaling
- Progress calculations
- Scoring logic

---

# Validation Requirements

The system MUST:

- Ignore case sensitivity
- Normalize spaces
- Support kana comparisons
- Validate equivalent answers
- Detect beginner romaji answers

---

# State Management

Recommended:
- React Context
- Custom Hooks

Avoid:
- Redux unless absolutely necessary

---

# Visual Direction

The interface should be:

- Minimalist
- Clean
- Modern
- Japanese-inspired
- Soft dark theme preferred

Avoid:
- Overly saturated anime styles
- Cluttered UI
- Excessive animations

---

# AI Development Priorities

The AI should prioritize:

1. Clean architecture
2. Component reusability
3. Gameplay functionality
4. Educational clarity
5. Responsive UI
6. Maintainable code

---

# Final Objective

The final product should feel like:

- A professional learning platform
- A gamified Japanese trainer
- A scalable educational application

The system should prioritize learning effectiveness over visual complexity.
