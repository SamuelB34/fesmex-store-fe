---
description: Create a new component following FESMEX project conventions
---

1. Before creating a new component, check /src/components/ for existing ones:
   - Button, Chip, Counter, Input, ConfirmModal, Product, Brand, MenuItem
   - Reuse these instead of building new UI from scratch
   - Only create a new component if the existing ones truly don't fit

2. Determine the component location:
   - Reusable across pages → src/components/ComponentName/
   - Page-specific → src/app/[route]/_components/ComponentName/

3. Create the component file: ComponentName.tsx

4. Add 'use client' directive ONLY if the component uses:
   - useState, useEffect, useRef, useReducer
   - Event handlers (onClick, onChange, etc.)
   - Browser APIs (document, window, localStorage)
   - Context consumers (useAuth, useCart, useSections, etc.)
   - next/navigation hooks (useRouter, useSearchParams)

5. Create the SCSS module: ComponentName.module.scss

6. Use @use (never @import) for shared SCSS:
   ```scss
   @use '../../styles/colors' as colors;
   @use '../../styles/responsive' as responsive;
   @use '../../styles/spacing' as *;
   ```

7. Use BEM naming convention in SCSS classes

8. Use next/image for all images (never <img>):
   ```tsx
   <Image src="/icons/example.svg" alt="description" width={24} height={24} />
   ```

9. Use CSS variables for colors and spacing:
   - var(--primary), var(--accent), var(--text), var(--secondary-text)
   - var(--Spacing-md), var(--Size-lg), var(--Radius-md)

10. Use sileo for user notifications (not alert/console):
    ```tsx
    import { sileo } from 'sileo'
    sileo.success({ title: 'Éxito', description: 'Operación completada' })
    ```

11. Export as named export (not default):
    ```tsx
    export const ComponentName = ({ prop }: ComponentNameProps) => { ... }
    ```

12. Run the build to verify:
    // turbo
    ```bash
    pnpm build
    ```
