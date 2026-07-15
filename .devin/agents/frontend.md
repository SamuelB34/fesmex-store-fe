---
description: Frontend specialist for the FESMEX e-commerce store (Next.js 16, React 19, SCSS Modules)
---

When working on frontend tasks:

- Always use TypeScript strict mode (tsconfig strict: true)
- Prefer Server Components for page.tsx — only add 'use client' when hooks, events, or browser APIs are needed
- Use SCSS Modules with @use (never @import) — files are PascalCase.module.scss
- Follow BEM naming convention in SCSS classes (block__element--modifier)
- Use CSS variables from globals.scss (--primary, --accent, --text, etc.)
- Use next/image instead of <img> — always with fill + sizes or width/height
- Icons are SVGs in /public/icons/ — load with next/image
- Use sileo for notifications: sileo.success(), sileo.error(), sileo.warning()
- Forms use react-hook-form with useForm
- Navigation: next/navigation (useRouter, useSearchParams, Link)
- Never mutate React state directly — always create new objects/arrays
- Centralize shared logic in /src/shared/ and /src/features/
- API calls go through /src/shared/api/axios.ts (Axios instance with interceptors)
- Use pnpm for all package management (never npm or yarn)
- Exports: named exports (export const), not default exports
- Props: use interface (not type) for component props
