---
description: Write tests for components, hooks, and utilities
---

1. Identify what needs testing:
   - Utility functions (formatCurrency, formatDate, formatProductName)
   - Hooks (useArticles, useOrders, useCart, useAuth)
   - Context providers (CartContext, AuthProvider)
   - Component rendering and interactions (Product add-to-cart, Nav menu toggle)
   - Critical user flows (login → add to cart → checkout)

2. Use Vitest + React Testing Library for unit/integration tests

3. Use Playwright for e2e tests on critical flows:
   - Login flow
   - Search and filter products
   - Add to cart → checkout → payment

4. For utility functions, test edge cases:
   - Empty inputs, null, undefined
   - Boundary values (0, negative numbers, very large numbers)
   - Invalid date strings

5. For hooks, test:
   - Initial state
   - State transitions after API calls (mock axios)
   - Error handling

6. For components, test:
   - Renders without crashing
   - Props are displayed correctly
   - User interactions trigger expected callbacks
   - State changes reflect in UI

7. Mock external dependencies:
   - Mock axios instance for API calls
   - Mock next/navigation (useRouter, useSearchParams)
   - Mock sileo notifications
   - Mock Stripe (loadStripe, Elements)

8. Run tests:
   // turbo
   ```bash
   pnpm test
   ```
