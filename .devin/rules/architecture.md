---
description: Project architecture rules and folder structure conventions
---

# Architecture Rules

## Structure
- /src/app/ — Next.js App Router pages and layouts
  - (account)/ — Grouped route: /account (profile, orders, addresses, payments)
  - (auth)/ — Grouped routes: /login, /register, /verify-email, /reset-password
  - (store)/ — Grouped routes: /checkout, /orders
  - productos/ — /productos (listing) + /productos/[id] (detail)
  - _components/ — Page-specific components (Header, Nav, Footer, Cover, Products, etc.)
- /src/components/ — Reusable UI components (design system: Button, Chip, Counter, etc.)
- /src/features/ — Business logic by domain
  - services/ — API clients (*.api.ts, Axios-based)
  - cart/ — CartContext + hooks
  - orders/ — Order API + hooks (useOrders, useCreateOrder, useShippingAddresses)
  - shipping/ — Shipping API + hooks (useShippingStates)
  - articles/ — Article hooks (useArticles)
  - categories/ — SectionsContext + SSR fetch
  - brands/ — BrandsContext + SSR fetch
- /src/shared/ — Cross-cutting concerns
  - api/axios.ts — Axios instance, interceptors, token management
  - auth/ — AuthProvider, RequireAuth guard
  - login-modal/ — LoginModalProvider + LoginModalRenderer
  - hooks/ — useDebounce
  - utils/ — format.ts (currency, dates, product names)
- /src/lib/ — External library configs (stripe.ts)
- /src/styles/ — Design tokens (_colors, _fonts, _spacing, _sizes, _radius, _responsive)

## Rules
- page.tsx should be a Server Component when possible (async + fetch)
- Client-side logic goes in dedicated 'use client' components
- Never duplicate utility functions or types across files — centralize in /src/shared/
- API clients go in /src/features/services/*.api.ts — use the unwrap pattern
- Server-side fetch goes in /src/features/*/*.server.ts — uses native fetch + API_BASE_URL
- Context providers are nested in layout.tsx: Auth → Sections → Brands → Cart → LoginModal
- State mutations are forbidden — always create new objects/arrays
- SCSS uses @use with namespaces (colors, responsive, etc.)
- Each component has its own folder: ComponentName/ComponentName.tsx + ComponentName.module.scss
- Reusable components go in /src/components/, page-specific in /src/app/.../_components/
