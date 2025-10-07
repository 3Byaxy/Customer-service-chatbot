# Developer Guide

Overview
This guide explains how the project is structured, how to run it locally, how to extend features, and how to contribute safely.

Prereqs
- Node.js 18+
- npm
- (Optional) PostgreSQL for real DB integration

Install & Run
- Install: npm install
- Dev server (Next.js): npm run dev
- Optional backend (Express): npm run backend:dev
- Build: npm run build
- Start prod: npm start
- Lint: npm run lint
- Type-check: npx tsc --noEmit

Project structure (high level)
- app/: Next.js App Router pages and API routes
  - app/page.tsx: main landing + tabs (Compact Chat, Full Chat, Voice, Admin, Dashboard, Settings)
  - app/admin/page.tsx: full admin dashboard (role-gated controls wired as demo)
  - app/api/*: serverless routes (chat, voice, approvals, admin metrics)
- components/: React UI (chat interfaces, admin widgets, shadcn/ui primitives)
- environment/: services and cross-cutting concerns
  - language-detection.ts: keyword/dictionary-based detection for en/lg/sw
  - approval-system.ts: tracks approval requests and conversation logs
  - realtime-apis.ts: event bus with SSE/WebSocket helpers
  - voice-integration.ts: TTS/calls integration points
  - logging.ts: centralized logger with memory store + DB attempt via executeQuery
  - database.ts: health checks and a dev-safe executeQuery stub
- backend/: optional Express server for standalone use

Key UX components
- components/compact-chatbot-widget.tsx
  - Interactive chat widget designed for embedding
  - Adds quick actions, Stop streaming, Regenerate, Copy
  - Live language detection feedback (English/Luganda/Swahili)
- components/chat-interface.tsx
  - Full chat with analysis panel and streaming controls

AI routing
- app/api/chat/route.ts chooses providers based on configured API keys and analysis complexity. Falls back to local responses when no keys are set. Headers expose model provider.

Extending the code
- Add an API route: create app/api/<name>/route.ts with exported HTTP methods (GET/POST). Keep business logic in environment/* where possible.
- Add a UI tab: edit app/page.tsx, create a lazy-loaded component in components/ and mount inside TabsContent.
- Add a new language rule: extend dictionaries in environment/language-detection.ts; update UI language lists if needed.
- Add quick actions: update quickActionsByBusiness in chat components.
- Add a new AI provider: wire its SDK into app/api/chat/route.ts alongside existing checks.

Streaming and cancellation
- UI uses AbortController to stop in-flight streams (Stop button). Always pass signal to fetch in routes that stream.

Logs and DB
- In development, environment/database.ts exports executeQuery as a stub to avoid build failures. Replace this function with a real pg client in production. logging.ts will automatically use the DB when available.

Testing
- No formal test runner is configured yet. Recommended next steps:
  - Add Playwright or Cypress for UI interactions
  - Add Vitest/Jest for service modules (environment/*)

Code style
- ESLint via Next.js config; Tailwind for styles; shadcn/ui components for consistency.

Contributing workflow
- Create a feature branch
- Run: npm run lint and npx tsc --noEmit
- Verify dev build: npm run dev and exercise updated flows
- Open a PR with a summary of:
  - What changed
  - Any migrations or env var needs
  - Dev testing steps

Security
- Never commit secrets; use .env.local
- Keep API keys referenced via env vars; never hard-code fallbacks

Where to look first
- New Devs: app/page.tsx, components/compact-chatbot-widget.tsx, app/api/chat/route.ts, environment/language-detection.ts
- Admin UI: app/admin/page.tsx and components/admin/*
