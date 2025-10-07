# Multi-Tenancy Plan

Goal
Each business (tenant) embeds the chatbot and gets an isolated dashboard, data, keys, and approvals.

Data model (Postgres)
- tenants(id, name, status[pending|approved|suspended], created_at)
- tenant_api_keys(id, tenant_id, name, hashed_key, created_at, revoked_at)
- users(id, email, name)
- tenant_members(id, tenant_id, user_id, role[owner|admin|agent|viewer])
- conversations(id, tenant_id, user_external_id, messages jsonb, language, business_type, created_at)
- approvals(id, tenant_id, conversation_id, status, priority, created_at, resolved_at)
- dashboards(id, tenant_id, settings jsonb, created_at)

Provisioning flow
1) Signup → create tenant(status=pending) and owner membership.
2) Platform admin approves → status=approved; generate API keys and public embed key.
3) Tenant receives embed snippet + docs; widget works in approved mode.

Tenant resolution in server routes
- From user session for platform UI (admin pages).
- From x-kyaku-api-key for server-to-server calls.
- From short-lived embed token for widget routes.

Embedding
- Serve a small loader script (e.g., /embed/widget.js).
- Tenants place the snippet on their site; loader mounts the compact widget and passes tenant token.

Security
- Short-lived signed embed tokens (JWT) with tenant_id, exp, minimal claims.
- Rate-limit and quota per tenant_api_keys.
- Row-Level Security if using Supabase Postgres.

Next steps in this repo
- Implement lib/tenant.ts (resolver) and call it in app/api/* routes.
- Add /api/embed/token to mint short-lived tokens.
- Add /embed/widget.js to mount the widget in third-party sites.
- Scope /admin data queries by tenant_id.

Operational monitoring per tenant
- Track events: escalations, voice calls, sentiment, language breakdown.
- Show metrics on /admin using the existing dashboard components.
