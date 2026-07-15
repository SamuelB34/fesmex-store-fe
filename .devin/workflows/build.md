---
description: Build the FESMEX store frontend project
---

1. Install dependencies:
   // turbo
   ```bash
   pnpm install
   ```

2. Run the build:
   // turbo
   ```bash
   pnpm build
   ```

3. Verify no errors in the output (warnings are acceptable)

4. If there are TypeScript errors, fix them before proceeding

5. Check First Load JS size for key routes:
   - / (home) should be under 200kB
   - /checkout should be under 300kB (Stripe is heavy)
   - /productos should be under 200kB

6. If the build fails due to stale cache, clean and rebuild:
   // turbo
   ```bash
   rm -rf .next && pnpm build
   ```

7. Run ESLint to check for warnings:
   // turbo
   ```bash
   pnpm lint
   ```
