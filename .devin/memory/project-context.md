---
description: Project context, tech stack, and key architectural decisions for fesmex-store-fe
---

# FESMEX Store Frontend — Project Context

## Tech Stack
- Next.js 16 (App Router, SSR + CSR)
- React 19.x
- TypeScript 5.x (strict mode)
- SCSS Modules with @use (Sass 1.97)
- react-hook-form 7.x (forms)
- Stripe @stripe/react-stripe-js 5.x (card payments)
- Axios 1.7.x (HTTP client with interceptors + token refresh)
- Luxon 3.x (dates and timezones)
- sileo 0.1.x (toast notifications)
- pnpm as package manager

## Architecture
- page.tsx files are Server Components by default (async + fetch)
- Client logic extracted into dedicated 'use client' components
- API proxy: /api/:path* → backend (next.config.ts rewrites)
- Auth: in-memory access token + HTTP-only refresh cookie
- Cart: dual-mode (localStorage for guests, backend sync for logged-in)
- Context providers: Auth → Sections → Brands → Cart → LoginModal (nested in layout.tsx)
- Design system: src/components/ (Button, Chip, Counter, Input, Product, Brand, etc.)
- Feature modules: src/features/ (cart, orders, shipping, articles, categories, brands)
- API clients: src/features/services/*.api.ts (Axios-based, unwrap pattern)
- Server-side fetch: src/features/*/​*.server.ts (native fetch, API_BASE_URL env)

## Backend
- Production: https://fesmex-store-be-api-production.up.railway.app
- Development: http://localhost:5001
- API response envelope: { ok: boolean, data?: T, error?: { code, message, requestId } }

## Environment Variables
- NEXT_PUBLIC_API_PROXY_TARGET — backend URL for API proxy
- API_BASE_URL — backend URL for server-side fetch (articles.server.ts)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Stripe publishable key

## Key Decisions
- Token in memory (not localStorage) for XSS protection
- Optimistic cart updates with backend sync
- SSR fetch for initial product data (no client waterfall on page load)
- Sections/Brands contexts hydrated via Initializer components (SSR → CSR)
- Google Ads tracking via next/script (AW-842448825)

## Known Tech Debt (from audit)
- src/lib/http.ts is dead code (unused fetch-based API client)
- src/modules/auth/AuthProvider.tsx is a duplicate of src/shared/auth/AuthProvider.tsx
- src/app/mock.ts contains mock data but types (Section, Product) are still imported in production
- No error.tsx, loading.tsx, or not-found.tsx in any route
- No tests configured (no Vitest, Jest, or Playwright)
- Checkout page.tsx is 705 lines (monolithic, needs decomposition)
- ApiResponse<T> type duplicated across all *.api.ts files
- ProductView type duplicated between Products.tsx and HomeProducts.tsx
- html lang="en" but content is in Spanish (should be "es")
- Both pnpm-lock.yaml and package-lock.json present
