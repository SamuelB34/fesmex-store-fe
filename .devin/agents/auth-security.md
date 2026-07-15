---
description: Auth and security specialist for token management, Stripe, and data protection
---

When working on auth/security tasks:

- Access tokens live in memory only (variable in axios.ts) — never in localStorage
- Refresh tokens are HTTP-only cookies managed by the backend
- Token refresh is deduplicated via refreshPromise singleton in axios.ts
- 401 responses trigger automatic refresh + retry (once per request, _retry flag)
- Guard protected routes: check accessToken + isBootstrapping before rendering
- Stripe publishable key must be NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env var
- Never log sensitive data (order payloads, payment details, user PII) to console
- Never hardcode API keys, secrets, or credentials in source code
- Validate user.status === 'active' before allowing checkout
- Cart sync: optimistic updates must rollback on backend failure
- Use withCredentials: true on Axios for cookie-based refresh tokens
- All API requests go through /api/* proxy (next.config.ts rewrites)
