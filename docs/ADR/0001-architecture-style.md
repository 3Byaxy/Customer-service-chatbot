# ADR 0001 – Architecture Style

Status: Accepted
Date: 2025-09-22

Context
We need a scalable, developer-friendly architecture that supports multi-tenancy, streaming UX, and cost-aware AI provider routing without premature microservices.

Decision
Adopt a modular monolith using Next.js App Router as the BFF (Backend For Frontend) with explicit service boundaries (ports & adapters) and per-tenant isolation. Keep service contracts in core/ and adapters in environment/; use Postgres + Redis + Object Storage; add Redis queue for background jobs when needed.

Consequences
- Faster iteration and simpler deployment in the short term
- Clear seams to split out services later (workers, realtime server)
- Works well on Vercel or in containers
