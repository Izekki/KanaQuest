# Frontend Visual System & Color Palette Specification

# Purpose

This document defines:

- The visual identity of the platform
- The color palette usage
- The frontend layout structure
- Component distribution
- UI hierarchy
- Screen organization
- Design behavior
- User experience direction

This document exists to provide permanent visual context for AI-assisted development even when reference images are unavailable.

---

# Visual Identity

The platform should feel:

- Modern
- Educational
- Minimalist
- Elegant
- Japanese-inspired
- Soft and immersive

The interface should prioritize:

- Clarity
- Focus
- Readability
- Gameplay visibility
- Educational usability

Avoid:

- Excessive anime aesthetics
- Neon overload
- Overcomplicated layouts
- Heavy gradients
- Visual clutter

---

# Official Color Palette

## Primary Colors

### Main Accent

```txt
#BF5468
```

Usage:
- Main buttons
- Active states
- Important highlights
- Selected modes
- Hover accents
- Progress highlights

Visual meaning:
- Warm Japanese-inspired accent
- Emotional but elegant
- Core identity color

---

### Secondary Accent

```txt
#73273B
```

Usage:
- Sidebar backgrounds
- Dark cards
- Header sections
- Strong contrast areas
- Navigation background

Visual meaning:
- Deep wine tone
- Calm and focused
- Strong visual structure

---

## Soft Support Colors

### Cream Tone

```txt
#F2D0BD
```

Usage:
- Secondary cards
- Soft highlights
- Hover backgrounds
- Decorative sections
- Subtle containers

Visual meaning:
- Warm and friendly
- Educational softness
- Japanese paper-inspired tone

---

### Muted Rose

```txt
#A67272
```

Usage:
- Borders
- Secondary buttons
- Disabled states
- Dividers
- Neutral highlights

Visual meaning:
- Balance
- Soft transitions
- Reduced visual aggression

---

## Neutral Color

### Main Neutral

```txt
#F2F2F2
```

Usage:
- Main text
- Primary readable elements
- Inputs
- General UI contrast

Visual meaning:
- Clean readability
- Minimalist structure
- Soft white tone

---

# Visual Behavior Rules

# Background Strategy

The platform should use:

- Dark primary backgrounds
- Light readable content
- Warm accent colors
- Soft contrast transitions

---

# Contrast Rules

The interface MUST:

- Maintain readability
- Keep gameplay visible
- Avoid low-contrast text
- Prioritize educational clarity

---

# Animation Rules

Animations should be:

- Soft
- Minimal
- Responsive
- Quick

Avoid:
- Excessive motion
- Distracting transitions
- Heavy animated backgrounds

---

# Typography Direction

Recommended:

- Sans-serif modern typography
- Clean Japanese-compatible fonts

Examples:
- Inter
- Noto Sans JP
- Poppins

---

# Frontend Layout Structure

# Main Layout Distribution

The application uses a three-panel structure.

```txt
-------------------------------------------------------
|                    TOP BAR                          |
-------------------------------------------------------
| LEFT PANEL |         CENTER PANEL      | RIGHT PANEL |
|             |                           |             |
|             |                           |             |
|             |                           |             |
-------------------------------------------------------
```

---

# Top Bar

# Purpose

The top bar provides global session information.

---

# Contains

- Logo
- Current mode
- Progress bar
- User profile shortcut
- Current score
- Session indicators

---

# Behavior

Must remain:
- Fixed or sticky
- Minimal height
- Always visible during gameplay

---

# Left Panel — Review Section

# Purpose

Acts as the learning memory system.

This section reinforces repetition and review.

---

# Contains

- Failed words
- Recent exercises
- Review queue
- Weak vocabulary
- Retry buttons
- History cards

---

# Recommended Components

```txt
components/history/
├── ReviewList
├── FailedWordsCard
├── RecentAttempts
├── RetryButton
└── ReviewStats
```

---

# Visual Behavior

Should:
- Be scrollable
- Compact
- Information-dense
- Easy to scan

---

# Center Panel — Main Gameplay Area

# Purpose

This is the PRIMARY interaction area.

The entire educational experience revolves around this section.

---

# Contains

- Main image
- Kanji display
- Word display
- Input field
- Verify button
- Feedback system
- Navigation controls
- Progress indicators

---

# Recommended Components

```txt
components/gameplay/
├── QuestionCard
├── GameImage
├── KanaDisplay
├── AnswerInput
├── VerifyButton
├── FeedbackMessage
├── ProgressBar
└── GameControls
```

---

# Layout Priority

The center panel MUST:

- Occupy most screen space
- Be visually dominant
- Keep focus on learning interaction

---

# Gameplay Flow

The user should naturally follow:

1. Look at image/word
2. Think
3. Type answer
4. Verify
5. Receive feedback
6. Continue

---

# Input Section

# Purpose

The answer area is critical.

It should feel:
- Responsive
- Clean
- Fast
- Focused

---

# Contains

- Text input
- Validation state
- Verify action

---

# Input Behavior

Must support:

- Hiragana
- Katakana
- Romaji (beginner only)

Validation should happen:
- On submit
- Possibly real-time later

---

# Feedback System

# Purpose

Provide immediate learning reinforcement.

---

# States

Correct:
- Positive highlight
- Soft success animation

Incorrect:
- Clear correction
- Show correct answer
- Add to review queue

---

# Right Panel — User & Modes

# Purpose

Acts as the control and status panel.

---

# Contains

- Game modes
- Difficulty selector
- User stats
- Session information
- Future multiplayer section
- Future achievements

---

# Recommended Components

```txt
components/layout/
├── ModeSelector
├── DifficultySelector
├── UserStats
├── ProfileCard
└── SessionInfo
```

---

# Game Modes Visual Structure

# Reconocer Mode

Visual emphasis:
- Large image or kanji
- Strong visual focus

Expected flow:
Image/Kanji → Japanese reading

---

# Traducir Mode

Visual emphasis:
- Kana readability
- Clean typography

Expected flow:
Japanese word → Meaning

---

# Responsive Behavior

# Desktop

Use:
- Full three-panel layout

---

# Tablet

Possible:
- Collapsible side panels

---

# Mobile

Transform into:
- Stacked layout
- Focus-first interaction

Recommended order:
1. Gameplay
2. Review
3. Modes/settings

---

# UI Philosophy

The platform should feel like:

- A modern educational tool
- A polished language trainer
- A focused study environment
- A lightweight game

NOT:
- A chaotic anime game
- A generic quiz app
- A social media interface

---

# Component Organization Philosophy

Each component MUST:

- Have one responsibility
- Be reusable
- Be visually isolated
- Avoid excessive internal logic

---

# Styling Rules

Recommended:
- TailwindCSS utility-first styling
- Reusable UI primitives
- Shared spacing system
- Shared border radius system

---

# Spacing Direction

Preferred:
- Medium spacing
- Breathing room
- Non-crowded layout

Avoid:
- Dense UI
- Tiny components
- Excessively large empty spaces

---

# Final Frontend Objective

The final interface should communicate:

- Learning
- Focus
- Clarity
- Progression
- Calm immersion
- Educational quality

The user should immediately understand:

- What to do
- Where to interact
- What they are learning
- How they are progressing
