---
description: Add a new API endpoint client following the project's Axios + unwrap pattern
---

1. Determine the domain folder in /src/features/services/:
   - If extending an existing domain (auth, articles, cart, etc.), edit the existing *.api.ts
   - If new domain, create a new file: src/features/services/domain.api.ts

2. Define types matching the backend response shape:
   ```typescript
   export type NewEntity = {
     _id: string
     name: string
     // ...fields matching backend
   }
   ```

3. Use the unwrap pattern for all API calls:
   ```typescript
   const unwrap = async <T>(
     promise: Promise<AxiosResponse<ApiResponse<T>>>,
   ): Promise<ApiResponse<T>> => {
     const res = await promise
     return res.data
   }
   ```
   Note: unwrap should eventually be centralized in src/shared/api/unwrap.ts

4. Implement the endpoint:
   ```typescript
   const list = (query?: ListQuery) =>
     unwrap<ListResponse>(api.get('/endpoint', { params: query }))

   const getById = (id: string) =>
     unwrap<{ item: Entity }>(api.get(`/endpoint/${id}`))

   const create = (payload: CreatePayload) =>
     unwrap<{ item: Entity }>(api.post('/endpoint', payload))

   const update = (id: string, payload: UpdatePayload) =>
     unwrap<{ item: Entity }>(api.put(`/endpoint/${id}`, payload))
   ```

5. For public endpoints (no auth needed), add skipAuth:
   ```typescript
   api.post('/endpoint', payload, { skipAuth: true } as AuthRequestConfig)
   ```

6. Export as a named object:
   ```typescript
   export const domainApi = { list, getById, create, update }
   ```

7. If the endpoint needs a client-side hook, create one in /src/features/domain/hooks/:
   - Follow the pattern in useArticles.ts or useOrders.ts
   - Use useState + useCallback for manual state management
   - Or use SWR/TanStack Query if migrating to cached fetching

8. If the endpoint needs server-side fetching, create a *.server.ts file:
   - Use native fetch (not Axios) — see articles.server.ts
   - Use API_BASE_URL env var for the backend URL
   - Set cache: 'no-store' for dynamic data

9. Run the build to verify:
   // turbo
   ```bash
   pnpm build
   ```
