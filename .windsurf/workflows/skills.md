---
description: Habilidades, recetas y patrones paso a paso para tareas comunes en fesmex-store-fe. Consultar antes de implementar cualquier cambio para seguir las convenciones del proyecto.
---

# FESMEX Store Frontend — Skills

---

## Skill 1: Crear un Componente UI Reutilizable

**Cuándo:** Necesitas un componente genérico que se use en múltiples páginas (botón, card, modal, etc.).

**Ubicación:** `src/components/NombreComponente/`

**Pasos:**

1. Crear carpeta: `src/components/NombreComponente/`
2. Crear archivo TSX: `NombreComponente.tsx`
3. Crear archivo de estilos: `NombreComponente.module.scss`
4. Seguir este template:

```tsx
// src/components/NombreComponente/NombreComponente.tsx
import styles from './NombreComponente.module.scss'
import { type ReactNode } from 'react'

interface NombreComponenteProps {
  // Definir props tipadas
  text: string
  variant?: 'primary' | 'secondary'
  children?: ReactNode
}

export const NombreComponente = ({
  text,
  variant = 'primary',
}: NombreComponenteProps) => {
  return (
    <div className={styles[variant]}>
      <span>{text}</span>
    </div>
  )
}
```

```scss
// src/components/NombreComponente/NombreComponente.module.scss
@use '../../styles/colors' as colors;
@use '../../styles/responsive' as responsive;

.primary {
  color: var(--primary);
}

.secondary {
  color: var(--secondary-text);
}
```

**Checklist:**
- [ ] El componente NO tiene `'use client'` a menos que use hooks/estado/eventos
- [ ] Props tipadas con `interface`, no `type` (convención del proyecto)
- [ ] Estilos en SCSS Module, nunca inline styles
- [ ] Export nombrado (`export const`), no default export
- [ ] Importar con alias: `@/components/NombreComponente/NombreComponente`

---

## Skill 2: Crear un Componente de Página

**Cuándo:** Necesitas un componente que solo se usa dentro de una página específica.

**Ubicación:** `src/app/[ruta]/_components/NombreComponente/`

**Pasos:**

1. Crear carpeta: `src/app/(grupo)/ruta/_components/NombreComponente/`
2. Crear `NombreComponente.tsx` + `NombreComponente.module.scss`
3. Agregar `'use client'` si usa hooks, estado, o eventos
4. Importar desde la página:

```tsx
import { NombreComponente } from './_components/NombreComponente/NombreComponente'
```

**Convención de nombres:**
- Carpeta y archivo: PascalCase
- Estilos: PascalCase.module.scss
- Clases CSS: snake_case o BEM (`component__element`)

---

## Skill 3: Crear un Nuevo API Service

**Cuándo:** Necesitas consumir un nuevo endpoint del backend.

**Ubicación:** `src/features/services/[dominio].api.ts`

**Template completo:**

```tsx
import { AxiosResponse } from 'axios'
import { api } from '@/shared/api/axios'

// --- Types ---
export type MiEntidad = {
  _id: string
  nombre: string
  created_at?: string
}

export type CreateMiEntidadPayload = {
  nombre: string
}

// --- Unwrap helper ---
type ApiResponse<T> = {
  ok: boolean
  data?: T
  error?: { code?: string; message?: string; requestId?: string }
}

const unwrap = async <T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<ApiResponse<T>> => {
  const res = await promise
  return res.data
}

// --- Endpoints ---
const list = () =>
  unwrap<{ items: MiEntidad[] }>(api.get('/mi-entidad'))

const getById = (id: string) =>
  unwrap<{ item: MiEntidad }>(api.get(`/mi-entidad/${id}`))

const create = (payload: CreateMiEntidadPayload) =>
  unwrap<{ item: MiEntidad }>(api.post('/mi-entidad', payload))

const update = (id: string, payload: Partial<CreateMiEntidadPayload>) =>
  unwrap<{ item: MiEntidad }>(api.patch(`/mi-entidad/${id}`, payload))

const remove = (id: string) =>
  unwrap(api.delete(`/mi-entidad/${id}`))

// --- Export ---
export const miEntidadApi = {
  list,
  getById,
  create,
  update,
  remove,
}
```

**Reglas:**
- Siempre usar `api` de `@/shared/api/axios` (incluye interceptors y auto-refresh)
- Nunca crear una nueva instancia de Axios
- Respuesta siempre tiene estructura `{ ok, data?, error? }`
- IDs de MongoDB son `_id`, no `id`
- Para endpoints sin auth: pasar `{ skipAuth: true } as AuthRequestConfig`

---

## Skill 4: Crear un Custom Hook

**Cuándo:** Necesitas encapsular lógica de estado + API call para un dominio.

**Ubicación:** `src/features/[dominio]/hooks/use[Nombre].ts`

**Template:**

```tsx
'use client'

import { useState, useCallback } from 'react'
import { miEntidadApi, MiEntidad } from '@/features/services/miEntidad.api'
import { ApiError } from '@/shared/api/axios'

type UseMiEntidadState = {
  items: MiEntidad[]
  isLoading: boolean
  error: string | null
}

export function useMiEntidad() {
  const [state, setState] = useState<UseMiEntidadState>({
    items: [],
    isLoading: false,
    error: null,
  })

  const fetchItems = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const res = await miEntidadApi.list()
      if (res.ok && res.data) {
        setState({ items: res.data.items, isLoading: false, error: null })
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: res.error?.message ?? 'Error al cargar',
        }))
      }
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Error al cargar'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [])

  return { ...state, fetchItems }
}
```

**Reglas:**
- Siempre `'use client'` al inicio
- Estado: `{ items/data, isLoading, error }`
- Acciones con `useCallback`
- Error handling: check `instanceof ApiError` o `instanceof ApiRequestError`
- Return spread state + funciones: `{ ...state, fetchItems, createItem }`
- El hook NO hace fetch automático en mount — el componente decide cuándo

---

## Skill 5: Crear un Context Provider

**Cuándo:** Necesitas compartir estado global entre múltiples componentes.

**Ubicación:** `src/features/[dominio]/context/[Nombre]Context.tsx`

**Template:**

```tsx
'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react'

// --- Types ---
export type MiContextValue = {
  items: MiItem[]
  setItems: (items: MiItem[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// --- Context ---
const MiContext = createContext<MiContextValue | undefined>(undefined)

// --- Provider ---
export function MiProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<MiItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const setItems = useCallback((next: MiItem[]) => {
    setItemsState(next)
  }, [])

  const value = useMemo<MiContextValue>(
    () => ({ items, setItems, isLoading, setIsLoading }),
    [items, setItems, isLoading],
  )

  return <MiContext.Provider value={value}>{children}</MiContext.Provider>
}

// --- Hook ---
export function useMiContext(): MiContextValue {
  const context = useContext(MiContext)
  if (!context) {
    throw new Error('useMiContext must be used within a MiProvider')
  }
  return context
}

// Alias
export const useMi = useMiContext
```

**Si es global:**
1. Agregar el Provider en `src/app/layout.tsx` dentro del árbol existente
2. Respetar el orden: AuthProvider > SectionsProvider > BrandsProvider > CartProvider > LoginModalProvider

---

## Skill 6: Crear una Nueva Página

**Cuándo:** Necesitas agregar una nueva ruta al e-commerce.

### Página Server Component (con SSR data)

```tsx
// src/app/mi-ruta/page.tsx
import styles from './MiRuta.module.scss'
import { miEntidadApi } from '@/features/services/miEntidad.api'

export default async function MiRutaPage() {
  const response = await miEntidadApi.list()
  const items = response.ok ? response.data?.items ?? [] : []

  return (
    <div className={styles.container}>
      {/* Contenido */}
    </div>
  )
}
```

### Página Client Component (con interactividad)

```tsx
// src/app/mi-ruta/page.tsx
'use client'

import { useEffect } from 'react'
import styles from './MiRuta.module.scss'
import { useMiEntidad } from '@/features/[dominio]/hooks/useMiEntidad'

export default function MiRutaPage() {
  const { items, isLoading, error, fetchItems } = useMiEntidad()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  if (isLoading) return <div className={styles.loading}>Cargando...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.container}>
      {/* Contenido */}
    </div>
  )
}
```

### Ruta agrupada (sin afectar URL)

Para rutas con layout compartido, usar route groups:
- `(store)/checkout/` → URL: `/checkout`
- `(account)/account/` → URL: `/account`
- `(auth)/login/` → URL: `/login`

---

## Skill 7: Agregar Producto al Carrito

**Cuándo:** Cualquier componente que necesite interactuar con el carrito.

```tsx
'use client'

import { useCart } from '@/features/cart/context/CartContext'
import { sileo } from 'sileo'

// Dentro del componente:
const { addItem, removeItem, items } = useCart()

// Verificar si ya está en carrito
const inCart = items.some((i) => i.id === productId)

// Agregar
addItem(
  {
    id: product._id,        // Siempre usar _id del backend
    image: imageUrl,
    name: product.name,
    brand: product.brand ?? '',
    unitPrice: product.price,
    quantity: 1,
  },
  { maxStock: product.stock },  // Opcional: limitar por stock
)

sileo.success({
  title: 'Producto añadido',
  description: `${product.name} fue agregado al carrito`,
})

// Remover
removeItem(product._id)
```

---

## Skill 8: Proteger una Ruta (Auth Guard)

**Cuándo:** Una página requiere autenticación.

### Opción A: Guard manual en el componente

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/auth/AuthProvider'

export default function ProtectedPage() {
  const { accessToken, isBootstrapping } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isBootstrapping && !accessToken) {
      router.push('/')
    }
  }, [accessToken, isBootstrapping, router])

  if (isBootstrapping) return <div>Loading...</div>
  if (!accessToken) return null

  return <div>{/* Contenido protegido */}</div>
}
```

### Opción B: Wrapper RequireAuth

```tsx
import { RequireAuth } from '@/shared/auth/RequireAuth'

export default function ProtectedPage() {
  return (
    <RequireAuth>
      {/* Contenido protegido */}
    </RequireAuth>
  )
}
```

---

## Skill 9: Trabajar con Formularios

**Cuándo:** Necesitas un formulario con validación.

**Librería:** `react-hook-form` (ya instalada)

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/Input/Input'
import { Button } from '@/components/Button/Button'
import { sileo } from 'sileo'

type FormValues = {
  nombre: string
  email: string
}

export const MiFormulario = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    try {
      // Llamar API
      sileo.success({ title: 'Guardado', description: 'Datos actualizados' })
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo guardar' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('nombre', { required: 'Nombre requerido' })}
        placeholder="Nombre"
      />
      {errors.nombre && <span>{errors.nombre.message}</span>}

      <Input
        {...register('email', {
          required: 'Email requerido',
          pattern: { value: /^\S+@\S+$/, message: 'Email inválido' },
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <Button
        type="submit"
        text={isSubmitting ? 'Guardando...' : 'Guardar'}
        disabled={isSubmitting}
      />
    </form>
  )
}
```

---

## Skill 10: Patrón SSR → Context Hydration

**Cuándo:** Necesitas cargar datos en el servidor y compartirlos con client components.

**Patrón usado por categorías y marcas:**

### 1. Server fetch function

```typescript
// src/features/[dominio]/[dominio].server.ts
export async function fetchMiData(): Promise<MiItem[]> {
  const apiUrl = process.env.API_BASE_URL  // Server-only var (sin NEXT_PUBLIC_)
  if (!apiUrl) return []

  try {
    const response = await fetch(`${apiUrl}/mi-endpoint`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) return []
    const result = await response.json()
    return result.data.items
  } catch {
    return []
  }
}
```

### 2. Initializer component (client bridge)

```tsx
// src/features/[dominio]/components/MiInitializer.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useMiContext } from '../context/MiContext'

export function MiInitializer({ items }: { items: MiItem[] }) {
  const { setItems } = useMiContext()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && items.length > 0) {
      setItems(items)
      initialized.current = true
    }
  }, [items, setItems])

  return null
}
```

### 3. Uso en Server Component page

```tsx
// src/app/mi-ruta/page.tsx
import { fetchMiData } from '@/features/[dominio]/[dominio].server'
import { MiInitializer } from '@/features/[dominio]/components/MiInitializer'

export default async function MiPage() {
  const items = await fetchMiData()
  return (
    <>
      <MiInitializer items={items} />
      {/* Client components que consumen useMiContext() */}
    </>
  )
}
```

---

## Skill 11: Manejo de Errores API

**Cuándo:** Necesitas manejar errores del backend correctamente.

### En hooks (patrón estándar)

```tsx
import { ApiError } from '@/shared/api/axios'

try {
  const res = await servicioApi.metodo()
  if (res.ok && res.data) {
    // Éxito
  } else {
    // Error controlado del backend
    const message = res.error?.message ?? 'Error desconocido'
  }
} catch (err) {
  if (err instanceof ApiError) {
    // Error HTTP con status/code/message
    console.error(`[${err.status}] ${err.code}: ${err.message}`)
    if (err.status === 401) {
      // Token expirado — el interceptor ya intentó refresh
    }
    if (err.status === 404) {
      // Recurso no encontrado
    }
  }
}
```

### En Server Components

```tsx
import { ApiError } from '@/shared/api/axios'
import { notFound } from 'next/navigation'

try {
  const res = await servicioApi.getById(id)
} catch (err) {
  if (err instanceof ApiError && err.status === 404) {
    return notFound()
  }
  throw err
}
```

---

## Skill 12: Formateo de Datos

**Cuándo:** Necesitas mostrar moneda, números o fechas.

```tsx
import { formatCurrency, formatNumber, formatDate, formatDatePT } from '@/shared/utils/format'

// Moneda MXN
formatCurrency(1234.5)          // "$1,234.50"
formatCurrency(1234.5, { currency: 'USD' })  // "US$1,234.50"

// Número
formatNumber(1234.5)            // "1,234.5"

// Fecha
formatDate('2024-01-15')        // "15 ene 2024"
formatDate('2024-01-15', {
  options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
})                               // "lunes, 15 de enero de 2024"

// Fecha Pacific Time (para órdenes)
formatDatePT('2024-01-15T20:00:00Z')  // "Lunes 15 enero, 12:00 PT"
```

---

## Skill 13: Responsive Design

**Cuándo:** Necesitas que un componente se adapte a diferentes pantallas.

```scss
@use '../../../styles/responsive' as responsive;

.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  // Tablet y abajo
  @include responsive.respond-down(desktop) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Mobile
  @include responsive.respond-down(mobile) {
    grid-template-columns: 1fr;
  }
}

// Desktop y arriba
.sidebar {
  display: none;

  @include responsive.respond-up(desktop) {
    display: block;
  }
}
```

**Breakpoints:**
- `mobile`: 768px
- `desktop`: 1024px
- `wide`: 1280px

---

## Skill 14: Integración con Stripe

**Cuándo:** Necesitas manejar pagos con tarjeta.

```tsx
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'

// Envolver en Elements provider con clientSecret
<Elements stripe={stripePromise} options={{ clientSecret }}>
  <StripePaymentSection ref={stripePaymentRef} />
</Elements>
```

**Flujo:**
1. Crear orden → backend retorna `paymentIntent.client_secret`
2. Pasar `clientSecret` a Stripe Elements
3. Confirmar pago con `stripe.confirmPayment()`
4. Manejar resultado: éxito → limpiar cart, redirect; error → mostrar mensaje

---

## Skill 15: Agregar Toast/Notificación

**Cuándo:** Necesitas dar feedback visual al usuario.

```tsx
import { sileo } from 'sileo'

// Éxito
sileo.success({
  title: 'Operación exitosa',
  description: 'Los datos se guardaron correctamente.',
})

// Error
sileo.error({
  title: 'Error',
  description: 'No se pudo completar la operación.',
})
```

**Configuración global:** `<Toaster position="top-center" theme="light" />` en `layout.tsx`.

---

## Skill 16: Navegación y Query Params

**Cuándo:** Necesitas navegar o leer parámetros de URL.

```tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Navegación programática
const router = useRouter()
router.push('/productos?category=bombas')

// Leer query params
const searchParams = useSearchParams()
const category = searchParams.get('category')  // string | null
const page = searchParams.get('page') ?? '1'

// Link declarativo
<Link href={`/productos?brand=${encodeURIComponent(brand.id)}`}>
  {brand.text}
</Link>
```

**Patrón de tabs sin rutas (como en account):**
```tsx
const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile')
// Tabs cambian activeTab, no rutas — no hay refresh de página
```

---

## Skill 17: Testing Mental Checklist

Antes de dar por terminada cualquier tarea, verificar:

- [ ] TypeScript compila sin errores (`pnpm build` o revisar IDE)
- [ ] No hay imports sin usar
- [ ] `'use client'` presente si el componente usa hooks/estado/eventos
- [ ] Props tipadas con `interface`
- [ ] Estilos en `.module.scss`, no inline
- [ ] IDs usan `_id` cuando vienen del backend
- [ ] Errores API manejados con try/catch + `instanceof ApiError`
- [ ] Textos de UI en español mexicano
- [ ] Responsive funcional en mobile (768px) y desktop (1024px)
- [ ] No se rompió el árbol de providers en `layout.tsx`
- [ ] Imports usan alias `@/` correctamente

---

## Skill 19: Implementar Búsqueda de Productos con AsyncSelect

**Cuándo:** Necesitas agregar un campo de búsqueda de productos con autocompletar.

**Ubicación:** Típicamente en `Cover.tsx` o componentes de búsqueda.

**Pasos:**

1. Instalar `react-select`: `pnpm add react-select`

2. Crear función `loadOptions`:
```tsx
const loadOptions = async (inputValue: string) => {
  if (!inputValue || inputValue.trim().length < 2) return []
  const response = await articlesApi.list({ 
    q: inputValue, 
    limit: 8, 
    page: 1 
  })
  if (!response.ok || !response.data) return []
  return response.data.items.map(article => ({
    value: article._id,
    label: article.description || article.name,
    image: getArticleImageUrl(article),
    description: article.brand || '',
  }))
}
```

3. Crear `formatOptionLabel` para mostrar imágenes:
```tsx
const formatOptionLabel = (option: ProductOption) => (
  <div className={styles.selectOption}>
    {option.image && (
      <div
        className={styles.selectOption__image}
        style={{ backgroundImage: `url(${option.image})` }}
      />
    )}
    <div className={styles.selectOption__content}>
      <div className={styles.selectOption__label}>{option.label}</div>
      {option.description && (
        <div className={styles.selectOption__description}>
          {option.description}
        </div>
      )}
    </div>
  </div>
)
```

4. Usar AsyncSelect con `instanceId` para evitar hydration mismatch:
```tsx
<AsyncSelect
  instanceId="product-search"
  cacheOptions
  loadOptions={loadOptions}
  onChange={handleSelectProduct}
  formatOptionLabel={formatOptionLabel}
  noOptionsMessage={() => 'Sin resultados'}
  loadingMessage={() => 'Buscando...'}
/>
```

5. Estilos en SCSS Module:
```scss
.selectWrapper {
  flex: 1;
  width: 100%;
  
  :global(.product-select__control) {
    width: 100% !important;
    border-radius: var(--Radius-large, 16px) !important;
    border: var(--Stroke-regular, 1.5px) solid var(--light-gray, #EBEBEB) !important;
  }
}

.selectOption {
  display: flex;
  align-items: center;
  gap: 12px;
  
  &__image {
    width: 40px;
    height: 40px;
    background-size: cover;
    border-radius: 4px;
  }
  
  &__label {
    font-weight: 500;
    font-size: 14px;
  }
}
```

---

## Skill 20: Implementar Navegación de Marcas

**Cuándo:** Necesitas hacer clickeable una lista de marcas para filtrar productos.

**Pasos:**

1. Agregar `'use client'` al componente
2. Importar `useRouter` de `next/navigation`
3. Crear `handleBrandClick`:
```tsx
const router = useRouter()

const handleBrandClick = (brandName: string) => {
  const encoded = encodeURIComponent(brandName)
  router.push(`/productos?brand=${encoded}`)
}
```

4. En el elemento clickeable:
```tsx
<li
  onClick={() => handleBrandClick(brand)}
  className={styles.brandLink}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleBrandClick(brand)
    }
  }}
>
  {brand}
</li>
```

5. Estilos:
```scss
.brandLink {
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
    text-decoration: underline;
  }
  
  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }
}
```

---

## Skill 21: Manejar searchParams como Promise (Next.js 15+)

**Cuándo:** Trabajas con query params en Server Components.

**Patrón correcto:**
```tsx
interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await (searchParams || Promise.resolve({}))
  const category = params.category
  const brand = params.brand
  
  // Ignorar valores especiales como 'all-brands'
  const finalBrandId = brand === 'all-brands' ? undefined : brand
}
```

**Regla:** Siempre usar `await` para desempacar `searchParams`.

---

## Skill 22: Debugging Común

### "Cannot find module" o "Module not found"
- Verificar que el alias `@/` apunta correctamente
- Verificar que el archivo existe en la ruta esperada
- Reiniciar dev server: `pnpm dev`

### "Hydration mismatch"
- El componente usa `'use client'` pero accede a `window`/`localStorage` sin guard
- Solución: `if (typeof window === 'undefined') return`
- Para AsyncSelect: usar `instanceId` prop para IDs consistentes

### "useContext must be used within Provider"
- El componente está fuera del árbol de providers
- Verificar orden en `layout.tsx`

### "401 Unauthorized" loops
- El interceptor de refresh puede estar fallando
- Verificar que `/refresh` endpoint funciona
- Revisar `performRefresh()` en `shared/api/axios.ts`

### Estilos no se aplican
- Verificar import correcto: `import styles from './X.module.scss'`
- Verificar que el className usa `styles.nombreClase`
- Si usa variables CSS: verificar que están en `globals.scss`
- Para react-select: usar `:global()` para clases generadas

### Contadores incorrectos en filtros
- Asegurar que el servidor obtiene el total SIN filtros
- Pasar `totalProducts` (sin filtros) al cliente
- Usar ese valor para "Todos los productos", no `products.length`
