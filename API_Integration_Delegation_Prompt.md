# API Integration Delegation Prompt — Japanese Learning Platform

## Objective

You are responsible for implementing the vocabulary ingestion and enrichment system for a Japanese learning platform built with:

- React
- Vite
- Supabase
- Vercel

The system uses:

- Jisho API
- KanjiAPI

to retrieve Japanese vocabulary, readings, and kanji information.

Your implementation **MUST** follow the architecture and constraints defined below.

## IMPORTANT ARCHITECTURE RULE

The APIs are **NOT** the primary backend.

The APIs are **ONLY** used for:

- Vocabulary import
- Kanji enrichment
- Data generation
- Initial content population

The gameplay itself **MUST** use:

- Supabase
- Local database content

The frontend should **NEVER** depend on real-time API gameplay requests.

## REQUIRED FLOW
