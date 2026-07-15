---
description: Review code for bugs, performance, accessibility, and best practices
---

1. Check for TypeScript errors and ESLint warnings:
   // turbo
   ```bash
   pnpm lint
   ```

2. Verify no direct state mutations (never mutate React state without setState)

3. Check for unnecessary re-renders:
   - useState that could be derived from props
   - useEffect that could be computed inline
   - State that duplicates parent state

4. Verify 'use client' directives:
   - Present on components using hooks, events, or browser APIs
   - Absent on components that can be server components

5. Check for accessibility:
   - All images have meaningful alt text
   - Interactive elements have proper roles + keyboard handlers (onKeyDown, tabIndex)
   - Buttons with only icons have aria-label
   - Color contrast meets WCAG standards

6. Verify no duplicated code (functions, components, types, API patterns):
   - ApiResponse<T> should be defined once, not per *.api.ts file
   - ProductView should be a shared type, not re-declared
   - unwrap() should be centralized, not copied per API client

7. Check for performance issues:
   - List item components wrapped with React.memo
   - Heavy client-only components loaded with next/dynamic
   - No unnecessary dependencies in useEffect arrays
   - Images use next/image instead of <img>
   - No console.log in production code

8. Check for security issues:
   - No sensitive data in console.log
   - No hardcoded credentials or API keys
   - Stripe key loaded from env, not hardcoded

9. Verify error handling:
   - API errors caught and surfaced via sileo notifications
   - Optimistic updates have rollback on failure
   - No unhandled promise rejections

10. Report findings categorized by severity: Critical, High, Medium, Low
