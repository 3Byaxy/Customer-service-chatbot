# Changelog

## 2025-09-21
- UI polish on landing page
  - Recolored feature badges (black/red/brown/orange).
  - Distinct active colors for Voice/Admin/Dashboard tabs.
  - Added "Open Full Admin Dashboard" link in Admin tab to navigate to /admin.
- Chat UX improvements
  - Full chat: language detection feedback, Stop streaming, Regenerate, Copy.
  - Compact widget: language detection feedback (class-based), quick action chips per business, Stop/Regenerate/Copy actions.
- Build stability
  - Added dev-safe executeQuery stub in environment/database.ts to avoid build warnings when a real DB isn’t configured.
- Documentation
  - Added WARP.md with commands and architecture overview.
  - Added docs/DEVELOPERS.md (developer guide).
  - Added docs/MULTI_TENANCY.md (multi-tenant plan and data model).
  - Added docs/EMBED.md (embedding guide and token flow).
