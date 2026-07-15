---
description: Refactor code for better structure and maintainability
---

1. Identify the code to refactor and its dependencies

2. Check for duplicated logic that can be centralized:
   - ApiResponse<T> → move to src/shared/types/api.ts
   - unwrap() → move to src/shared/api/unwrap.ts
   - ProductView → move to src/shared/types/product.ts
   - Article → ProductView mapper → move to src/features/articles/mappers.ts

3. Extract reusable logic into:
   - /src/shared/types/ — shared TypeScript types
   - /src/shared/utils/ — utility functions
   - /src/shared/hooks/ — reusable hooks
   - /src/components/ — reusable UI components
   - /src/features/*/hooks/ — domain-specific hooks

4. Before creating new components, check /src/components/ for existing ones:
   - Button — styled button with variants
   - Chip — pill/tag with active state
   - Counter — numeric stepper with min/max
   - Input — text input with states
   - ConfirmModal — confirmation dialog
   - Product — product card with add-to-cart
   - Reuse these instead of building new UI from scratch

5. Simplify state management:
   - Replace useState + useEffect with derived values when possible
   - Move state up only when needed for sibling communication
   - Use useRef for values that don't trigger re-renders
   - Consider SWR or TanStack Query for server state (cache, revalidation)

6. Improve type safety:
   - Replace `any` with proper types
   - Add interfaces for all component props
   - Use union types instead of strings for known values

7. Verify the refactor doesn't change behavior:
   // turbo
   ```bash
   pnpm build
   ```

8. Check for unused imports, variables, and dead code
