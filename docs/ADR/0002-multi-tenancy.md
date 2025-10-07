# ADR 0002 – Multi-Tenancy Model

Status: Accepted
Date: 2025-09-22

Context
Each business should embed the chatbot and get an isolated dashboard and data. We need a robust but simple tenancy model now, with room to evolve.

Decision
Use per-tenant row scoping in Postgres with a tenant resolver at the BFF. Tenants receive public embed keys and server API keys; the widget uses short-lived embed tokens. Admin data/metrics are filtered by tenant_id. Rate limiting and quotas are tracked per tenant key in Redis.

Consequences
- Clear isolation and auditability
- Easy to add billing/quotas later
- Compatible with Supabase RLS or custom policies