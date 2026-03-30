# API Proxy Configuration

## Overview

The frontend uses Next.js rewrites to proxy all API requests through `/api`, making them same-origin. This fixes mobile cookie issues (httpOnly `refresh_token` cookies).

## Environment Configuration

### Local Development

Create `.env.local`:

```env
NEXT_PUBLIC_API_PROXY_TARGET=http://localhost:5001
```

This proxies all `/api/*` requests to your local backend running on port 5001.

### Production (Railway)

Set environment variable in Railway dashboard:

```
NEXT_PUBLIC_API_PROXY_TARGET=https://fesmex-store-be-api-production.up.railway.app
```

Or it will default to this value if not set.

## How It Works

### Request Flow

```
Browser Request
    ↓
/api/login → Next.js Rewrite
    ↓
${NEXT_PUBLIC_API_PROXY_TARGET}/login
    ↓
Backend Response (with Set-Cookie: refresh_token)
    ↓
Browser stores cookie as FIRST-PARTY (same-origin)
```

### Cookie Handling

- **Before proxy**: Cookies were third-party (cross-origin) → blocked by mobile browsers
- **After proxy**: Cookies are first-party (same-origin) → accepted by all browsers

## Configuration Details

**File**: `next.config.ts`

```typescript
const API_PROXY_TARGET =
  process.env.NEXT_PUBLIC_API_PROXY_TARGET ||
  'https://fesmex-store-be-api-production.up.railway.app'

async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${API_PROXY_TARGET}/:path*`,
    },
  ]
}
```

## API Base URLs

All API clients use `/api` as the base URL:

- `src/shared/api/axios.ts`: `const API_BASE_URL = '/api'`
- `src/lib/http.ts`: `const API_BASE = '/api'`
- `src/modules/auth/api.ts`: `const API_BASE = '/api'`

## Testing

### Local Development

1. Start local backend: `npm run dev` (port 5001)
2. Create `.env.local` with `NEXT_PUBLIC_API_PROXY_TARGET=http://localhost:5001`
3. Start frontend: `npm run dev`
4. Test login → session should persist after refresh

### Production

1. Railway automatically sets `NEXT_PUBLIC_API_PROXY_TARGET`
2. All requests proxy to production backend
3. Cookies work correctly on mobile browsers

## Troubleshooting

### "Cannot reach backend" error

- Check `NEXT_PUBLIC_API_PROXY_TARGET` is set correctly
- Verify backend is running at that URL
- Check CORS is enabled on backend

### Cookies not being sent

- Ensure axios/fetch has `withCredentials: true`
- Verify cookie is being set by backend (`Set-Cookie` header)
- Check browser DevTools → Application → Cookies

### Local backend not responding

- Ensure `.env.local` has correct `NEXT_PUBLIC_API_PROXY_TARGET=http://localhost:5001`
- Restart Next.js dev server after changing `.env.local`
- Verify backend is running: `curl http://localhost:5001/health`

## Security Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for URLs)
- Backend URL is not hardcoded, making it environment-agnostic
- No sensitive data in environment variables
- HTTPS required in production (Railway enforces this)
