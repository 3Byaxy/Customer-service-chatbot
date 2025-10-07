# Operations – Runbook & Scaling

Run locally
- npm install
- npm run dev

Build & Start
- npm run build
- npm start

Environments
- .env.local for development
- Recommended managed services:
  - Postgres: Supabase/Neon
  - Redis: Upstash
  - Object Storage: S3/Supabase

Telemetry & Logs
- Add OpenTelemetry SDK to capture BFF route spans and DB calls
- Ship logs to a central sink (Logtail, Datadog, or OpenSearch)

Rate Limiting
- Implement Redis-based limiters per tenant API key
- Suggested libraries: Upstash Rate Limit / custom token-bucket

Background Jobs
- Use a single worker process pulling from Redis streams/queues
- Jobs: transcription, analytics roll-ups, exports, email notifications

Disaster Recovery
- Postgres PITR enabled
- Redis snapshotting for queue at-least-once semantics
- Regular data exports to object storage

Security
- No secrets in code; environment variables only
- Short-lived embed tokens (JWT) with tenant_id and exp
- CORS restricted per tenant (approved origins)
