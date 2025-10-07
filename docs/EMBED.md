# Embed the Compact Widget

Overview
This document shows how tenants can embed the compact chatbot widget and authenticate it to their tenant.

Simple snippet (to be sent after approval)
```html
<div id="kizuna-ai-widget" data-tenant="{{TENANT_ID}}"></div>
<script async src="https://your-domain.com/embed/widget.js"
        data-tenant="{{TENANT_ID}}"
        data-key="{{PUBLIC_EMBED_KEY}}"></script>
```

How it will work
- widget.js will request a short-lived embed token from /api/embed/token using the tenant id and public embed key.
- It will mount a Shadow DOM container and render the compact widget, passing the token.
- All API calls from the widget will include the token (cookie or header).

Local testing (before widget.js exists)
- You can simulate embedding by rendering the compact widget directly with the right props on the main page.
- For multi-tenant simulation in dev, send an x-kyaku-tenant header in requests.

Security notes
- Never expose server API keys client-side.
- Use short-lived tokens for embeds (JWT with tenant_id and exp).
- Enable CORS only for approved origins (per tenant).
