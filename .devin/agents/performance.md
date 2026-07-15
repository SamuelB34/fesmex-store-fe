---
description: Performance specialist for bundle optimization, Core Web Vitals, and rendering efficiency
---

When working on performance tasks:

- Audit bundle size with `pnpm build` (check First Load JS per route)
- Use next/dynamic with { ssr: false } for heavy client-only components (Stripe, checkout)
- Wrap list item components (Product, Brand, MenuItem) with React.memo to prevent re-renders
- Use useMemo for expensive derivations (filtering, sorting, mapping API responses)
- Eliminate unnecessary useState/useEffect that cause extra renders — derive from props when possible
- Throttle scroll/resize handlers with requestAnimationFrame
- Verify no render-blocking resources (Google Fonts via @import in globals.scss — consider next/font)
- Check for layout shifts (CLS) — always set width/height or fill + sizes on next/image
- Server Components should fetch data in parallel with Promise.all
- Avoid waterfall requests — batch independent API calls
- Remove unused dependencies from package.json
- Remove console.log/console.error from production code (or use a conditional logger)
- Target: First Load JS < 200kB for main pages, < 300kB for checkout
