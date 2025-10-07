# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: KyakuShien – AI Customer Support System

Commands
- Install dependencies
  - npm install
- Run development server (Next.js app router)
  - npm run dev
- Run optional standalone backend server (Express)
  - npm run backend:dev
- Build production bundle
  - npm run build
- Start production server
  - npm start
- Lint (Next.js ESLint)
  - npm run lint
- Database scripts (stubs in this repo)
  - npm run db:migrate
  - npm run db:seed
  - npm run db:reset
- Type-check (if needed)
  - npx tsc --noEmit

Notes
- Some API routes stream responses; when testing via curl, prefer a tool that shows streaming output (curl shows chunks linearly).
- Logs routes use a dev-safe DB stub; replace environment/database.ts executeQuery with a real client for production.

Architecture overview (big picture)
- Next.js 14 app (app/ directory)
  - UI pages and tabs live in app/page.tsx, app/admin/page.tsx, and feature pages under app/...
  - API routes are in app/api/* (chat, voice, approvals, admin stats). They call service modules in environment/ and backend/.
- Compact embeddable widget
  - components/compact-chatbot-widget.tsx renders a small, self-contained chat UI suitable for embedding.
  - It integrates language detection, approval workflow, and quick actions.
- Service layer (environment/)
  - language-detection.ts: rule-based detector for English/Luganda/Swahili + local term extraction.
  - approval-system.ts: tracks requests requiring human approval.
  - realtime-apis.ts: event bus and SSE/WebSocket utilities.
  - voice-integration.ts: VAPI/voice helpers for TTS/calls.
  - database.ts: health checks and a dev fallback for executeQuery.
  - logging.ts: centralized logger; writes to memory and attempts DB insert/select via executeQuery.
- Optional standalone backend (backend/)
  - server.ts provides Express endpoints (health, language detection, approval check) when you need a separate process.
- AI model routing (app/api/chat/route.ts)
  - Dynamically selects providers (Gemini/Groq/OpenAI/Anthropic) based on available keys and analysis needs.
  - Falls back to local rule-based responses if no keys are configured.

Important repository docs
- README.md: quick start, env vars, and high-level feature list.
- docs/DEVELOPERS.md: dev workflows, code organization, how to extend routes and UI.
- docs/MULTI_TENANCY.md: plan to support per-tenant dashboards and embed tokens.
- docs/EMBED.md: how to embed the widget and pass a tenant token.
- CHANGELOG.md: recent changes and UI improvements.

Environment
- Primary environment variables (see .env.example or README):
  - GOOGLE_GENERATIVE_AI_API_KEY, GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY
  - DATABASE_URL (if you plug a real DB)

Conventions
- Use app/api for route handlers and environment/* for reusable services.
- Keep streaming responses non-blocking and guard with AbortController on the client.
- UI components follow Tailwind and shadcn/ui patterns.
