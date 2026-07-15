---
description: Deploy the FESMEX store frontend to production
---

1. Verify the build passes:
   // turbo
   ```bash
   pnpm build
   ```

2. Verify environment variables are set:
   - NEXT_PUBLIC_API_PROXY_TARGET — backend API URL
   - API_BASE_URL — backend URL for server-side fetch
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Stripe publishable key

3. Check that Google Ads tracking is present in layout.tsx (AW-842448825)

4. Verify the API proxy in next.config.ts points to the correct backend:
   - Production: https://fesmex-store-be-api-production.up.railway.app
   - Development: http://localhost:5001

5. Deploy the app using your hosting provider (Vercel, Railway, etc.)

6. Verify the site is live and functional:
   - Home page loads with products
   - Login/register flow works
   - Product listing and detail pages render
   - Cart add/remove works
   - Checkout flow completes (test with transfer payment)

7. Test critical user flows:
   - Search and filter products
   - Add to cart as guest → login → cart migrates
   - Checkout with saved address
   - Checkout with new address + shipping calculation

8. Verify no console errors in production (check browser DevTools)
