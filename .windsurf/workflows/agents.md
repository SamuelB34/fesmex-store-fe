---
description: Roles de agente IA para el proyecto fesmex-store-fe. Usa este archivo para entender el contexto completo del proyecto, su arquitectura, patrones y convenciones antes de hacer cualquier cambio.
---

# FESMEX Store Frontend — Agents

## 1. Resumen del Proyecto

**Nombre:** fesmex-store-fe
**Tipo:** E-commerce B2B/B2C de productos industriales (motores, bombas, válvulas, HVAC, etc.)
**Stack principal:**

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16+ (App Router) | Framework principal, SSR + CSR |
| React | 19.x | UI |
| TypeScript | 5.x | Tipado estricto |
| SCSS Modules | (Sass 1.97) | Estilos por componente |
| react-hook-form | 7.x | Formularios controlados |
| Stripe | @stripe/react-stripe-js 5.x | Pagos con tarjeta |
| Axios | 1.7.x | Cliente HTTP (API REST) |
| Luxon | 3.x | Fechas y zonas horarias |
| sileo | 0.1.x | Toasts/notificaciones |

**Alias de imports:** `@/*` → `./src/*`

---

## 2. Arquitectura de Carpetas

```
src/
├── app/                          # Next.js App Router (páginas y layouts)
│   ├── layout.tsx                # Root layout con providers globales
│   ├── providers.tsx             # Envuelve children en AuthProvider
│   ├── page.tsx                  # Home (Server Component)
│   ├── globals.scss              # Variables CSS globales + reset
│   ├── mock.ts                   # Tipos Section/Product + datos mock
│   ├── (account)/account/        # Ruta agrupada: /account
│   │   ├── page.tsx              # Client Component con tabs (profile, orders, address, payments)
│   │   └── _components/          # ProfileForm, FiscalProfileForm, OrdersPanel
│   ├── (auth)/                   # Rutas agrupadas: /login, /register, /verify-email
│   ├── (store)/checkout/         # Ruta agrupada: /checkout
│   │   ├── page.tsx              # Flujo completo de checkout (618 líneas)
│   │   └── _components/          # CardDetailsForm, NewAddressForm, PaymentMethodControls, etc.
│   ├── productos/                # /productos (listado) + /productos/[id] (detalle)
│   │   ├── page.tsx              # Server Component con SSR fetch
│   │   ├── [id]/page.tsx         # Server Component (detalle artículo)
│   │   └── _components/          # ProductosClient, search
│   └── _components/              # Componentes compartidos de app
│       ├── Nav/                  # Navegación principal + menú mobile + cart drawer
│       ├── Header/               # Header superior
│       ├── Footer/               # Footer global
│       ├── Cover/                # Hero/banner principal
│       ├── Login/                # Modal de login
│       ├── RegisterModal/        # Modal de registro
│       ├── Products/             # Grid de productos
│       ├── ProductsFeatured/     # Productos destacados (carousel)
│       ├── BestBrands/           # Sección de marcas
│       ├── HomeProducts/         # Productos en home
│       ├── IndustrialHero/       # Hero industrial
│       └── CartButton/           # Botón flotante del carrito
│
├── components/                   # Componentes UI reutilizables (design system)
│   ├── Button/                   # Button con variants: primary, secondary, accent + filled/outlined
│   ├── Chip/                     # Chip con estados active/inactive
│   ├── Counter/                  # Counter numérico con min/max
│   ├── Input/                    # Input genérico con estados active/inactive
│   ├── Product/                  # Card de producto con add-to-cart
│   ├── Brand/                    # Card de marca
│   ├── MenuItem/                 # Item de menú de navegación
│   ├── ConfirmModal/             # Modal de confirmación genérico
│   ├── LogosMarquee/             # Marquee de logos
│   └── PaymentLoader/            # Loader animado para pagos
│
├── features/                     # Lógica de negocio por dominio
│   ├── services/                 # API clients (REST, Axios-based)
│   │   ├── auth.api.ts           # Login, register, refresh, logout, me, verify, forgot/reset password
│   │   ├── articles.api.ts       # CRUD artículos, listado paginado, featured, stock
│   │   ├── cart.api.ts           # CRUD carrito (create, get, add/update/delete items)
│   │   ├── customers.api.ts      # CRUD perfil de cliente (me, update, delete)
│   │   ├── brands.api.ts         # Listar marcas
│   │   ├── categories.api.ts     # Listar categorías (activas, roots)
│   │   ├── fiscalProfile.api.ts  # CRUD perfil fiscal (RFC, razón social, CFDI)
│   │   └── health.api.ts         # Health check
│   ├── cart/
│   │   ├── context/CartContext.tsx  # CartProvider global (localStorage + backend sync)
│   │   └── hooks/useCart.ts        # Hook alternativo de carrito (Axios-based)
│   ├── orders/
│   │   ├── services/orders.api.ts  # Crear orden, listar, detalle, shipping addresses
│   │   └── hooks/useOrders.ts      # useOrdersList, useShippingAddresses, useOrderDetail, useCreateOrder
│   ├── shipping/
│   │   ├── services/shipping.api.ts  # Obtener estados activos de envío
│   │   ├── hooks/useShippingStates.ts  # Hook con cálculo de envío por estado
│   │   └── index.ts                    # Barrel export
│   ├── articles/
│   │   └── hooks/useArticles.ts   # Hook para listado paginado de artículos
│   ├── categories/
│   │   ├── context/SectionsContext.tsx  # Contexto global de categorías
│   │   ├── components/SectionsInitializer  # Hidratación SSR → contexto
│   │   └── homeCategories.server.ts   # Fetch SSR de categorías
│   └── brands/
│       ├── context/BrandsContext.tsx  # Contexto global de marcas
│       ├── components/BrandsInitializer  # Hidratación SSR → contexto
│       └── homeBrands.server.ts       # Fetch SSR de marcas
│
├── modules/                      # Módulos legacy/alternativos
│   └── auth/                     # AuthProvider alternativo (parcialmente vacío)
│
├── shared/                       # Utilidades y providers compartidos
│   ├── api/axios.ts              # Instancia Axios global + interceptors + token refresh
│   ├── auth/
│   │   ├── AuthProvider.tsx      # Provider principal de autenticación (ACTIVO)
│   │   └── RequireAuth.tsx       # Guard component para rutas protegidas
│   ├── login-modal/
│   │   ├── LoginModalProvider.tsx  # Contexto para modal login/register
│   │   └── LoginModalRenderer.tsx  # Renderiza Login o RegisterModal según modo
│   └── utils/
│       └── format.ts             # formatCurrency, formatNumber, formatDate, formatDatePT
│
├── lib/                          # Configuraciones de librerías externas
│   ├── http.ts                   # Cliente fetch alternativo (fetch nativo, NO Axios)
│   └── stripe.ts                 # Inicialización de Stripe (loadStripe)
│
└── styles/                       # Design tokens SCSS
    ├── _colors.scss              # Paleta de colores
    ├── _fonts.scss               # Tipografía y tamaños
    ├── _spacing.scss             # Sistema de espaciado
    ├── _sizes.scss               # Tamaños de componentes
    ├── _radius.scss              # Border radius tokens
    └── _responsive.scss          # Breakpoints: mobile(768), desktop(1024), wide(1280)
```

---

## 3. Agente: Frontend Store

**Contexto:** Cualquier cambio en páginas, componentes visuales, UX, y layouts del e-commerce.

### Reglas Críticas

- **Estilos:** Siempre SCSS Modules (`Nombre.module.scss`). NUNCA Tailwind, CSS-in-JS, ni CSS plano.
- **Componentes:** Cada componente vive en su propia carpeta: `NombreComponente/NombreComponente.tsx` + `NombreComponente.module.scss`.
- **Componentes de página:** Van en `_components/` dentro de la ruta correspondiente.
- **Componentes reutilizables (design system):** Van en `src/components/`.
- **'use client':** Obligatorio en todo componente que use hooks, estado, eventos, o contexto.
- **Server Components:** Las páginas `page.tsx` son Server Components por defecto en Next.js App Router. Usar `async` y fetch directamente.
- **Imports:** Siempre usar alias `@/` (ej: `@/components/Button/Button`).
- **Iconos:** Archivos SVG en `/public/icons/`. Usar `next/image` con `Image`.
- **Imágenes:** `next/image` con `fill` + `sizes` para responsive, o `width`/`height` fijos.
- **Notificaciones:** Usar `sileo` → `sileo.success()`, `sileo.error()`.
- **Formularios:** `react-hook-form` con `useForm`.
- **Navegación:** `next/navigation` → `useRouter`, `useSearchParams`, `Link`.

### Paleta de Colores (variables CSS)

| Variable | Hex | Uso |
|---|---|---|
| `--primary` | #364b60 | Azul industrial principal |
| `--primary-shade` | #59738c | Variante clara |
| `--accent` | #d35400 | Naranja, CTAs, highlights |
| `--text` | #201e1c | Texto principal |
| `--secondary-text` | #6b7280 | Texto secundario |
| `--light-gray` | #ebebeb | Fondos claros, bordes |
| `--disabled` | #cccccc | Estados deshabilitados |

### Breakpoints

| Nombre | Valor | Mixin |
|---|---|---|
| mobile | 768px | `@include responsive.respond-down(mobile)` |
| desktop | 1024px | `@include responsive.respond-up(desktop)` |
| wide | 1280px | `@include responsive.respond-up(wide)` |

---

## 4. Agente: Auth & Seguridad

**Contexto:** Login, registro, verificación de email, refresh tokens, guards.

### Flujo de Autenticación

1. **Bootstrap:** `AuthProvider` intenta `POST /refresh` al montar → obtiene `accessToken`.
2. **Token storage:** En memoria (variable `accessToken` en `axios.ts`), NO en localStorage.
3. **Refresh automático:** Interceptor de Axios detecta 401, ejecuta `performRefresh()` con dedup via `refreshPromise`.
4. **Login:** `POST /login` → guarda token → `fetchMe()` → redirect a `/account`.
5. **Registro:** `POST /register` → toast éxito → redirect a `/`.
6. **Logout:** `POST /logout` → limpia token + user → redirect a `/`.
7. **Guard:** `RequireAuth` component o verificación manual `if (!accessToken) router.push('/')`.

### Archivos Clave

| Archivo | Responsabilidad |
|---|---|
| `shared/auth/AuthProvider.tsx` | Provider principal, useAuth hook |
| `shared/api/axios.ts` | Instancia Axios, interceptors, token management |
| `shared/auth/RequireAuth.tsx` | Guard component |
| `features/services/auth.api.ts` | Endpoints: login, register, refresh, logout, me, verify, forgot/reset password |
| `shared/login-modal/` | Modal global de login/register |

### Tipos de Usuario

```typescript
type AuthUser = {
  id?: string
  _id?: string
  email: string
  first_name?: string
  last_name?: string
  mobile?: string
  status?: string
}
```

---

## 5. Agente: Cart & Checkout

**Contexto:** Carrito de compras, proceso de pago, órdenes.

### Patrón del Carrito (Dual-mode)

1. **Sin login:** Items se guardan en `localStorage` (`cartItems` key).
2. **Con login:** Items se sincronizan con backend via `cart.api.ts`.
3. **Al login:** Items locales migran al backend, luego se elimina localStorage.
4. **Al logout:** Se limpia estado local y localStorage.
5. **Operaciones optimistas:** El UI se actualiza inmediatamente, backend sync en background.

### CartContext API

```typescript
type CartContextValue = {
  items: CartItem[]
  total: number
  subtotal: number
  cartCount: number
  addItem: (item: CartItem, options?: { maxStock?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number, options?: { maxStock?: number }) => void
  clearCart: () => void
  refreshCart: () => Promise<void>
}
```

### Checkout Flow

1. Verificar auth → redirect si no logueado.
2. Seleccionar tipo de entrega: `shipping` | `pickup`.
3. Si shipping: seleccionar dirección existente o crear nueva.
4. Calcular envío por estado (usa `useShippingStates` → porcentaje sobre subtotal).
5. Seleccionar método de pago: `CARD` | `TRANSFER`.
6. Si CARD: Stripe Elements → `confirmPayment`.
7. Crear orden → `POST /orders` → retorna `order` + `paymentIntent`.
8. Al éxito: `clearCart()` + redirect.

### Tipos de Orden

```typescript
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled' | 'completed'
type PaymentMethod = 'CARD' | 'TRANSFER'
type PaymentStatus = 'UNPAID' | 'PENDING_TRANSFER' | 'PAID' | 'REFUNDED'
type DeliveryType = 'shipping' | 'pickup'
```

---

## 6. Agente: Products & Catalog

**Contexto:** Listado de productos, detalle, búsqueda, categorías, marcas.

### Patrón SSR → Client Hydration

1. **Server Component** (`page.tsx`) hace fetch directo al backend con `fetch()` nativo.
2. Datos se pasan a **Initializer components** (`SectionsInitializer`, `BrandsInitializer`) que hidratan contextos.
3. **Client Components** consumen los contextos ya hidratados.

### Flujo de Productos

- **Listado:** `productos/page.tsx` (Server) → `fetchInitialProducts()` → `ProductosClient` (Client).
- **Detalle:** `productos/[id]/page.tsx` (Server) → `articlesApi.getById()` → `ProductDetailClient` (Client).
  - El server debe pasar `article.content?.details` al `product` prop.
  - El client renderiza el bloque `Overview` a partir de ese markdown o del texto `Uso General`.
- **Búsqueda:** Query params `?q=`, `?category=`, `?brand=` en URL.

### Tipos de Artículo

```typescript
type Article = {
  _id: string
  name: string
  description?: string
  brand?: string
  unit?: string
  price: number
  group_id?: string
  sku?: string
  barcode?: string
  image_url?: string
  files?: { images?: ArticleFile[]; datasheets?: ArticleFile[] }
  stock_web?: { count: number; warehouse_id: string } | null
  is_featured?: boolean
}
```

### Imagen Priority

```typescript
// Prioridad para obtener URL de imagen:
article.files?.images?.[0]?.url ?? article.image_url ?? ''
```

---

## 7. Agente: API Services

**Contexto:** Comunicación con el backend REST.

### Patrón de API Service

Todos los servicios en `features/services/` siguen el mismo patrón:

```typescript
// 1. Definir tipos
type ApiResponse<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string } }

// 2. Función unwrap genérica
const unwrap = async <T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> => {
  const res = await promise
  return res.data
}

// 3. Funciones del servicio
const list = () => unwrap<ListResponse>(api.get('/endpoint'))
const getById = (id: string) => unwrap<ItemResponse>(api.get(`/endpoint/${id}`))

// 4. Export como namespace
export const servicioApi = { list, getById }
```

### Clientes HTTP (¡Hay dos!)

| Cliente | Archivo | Uso |
|---|---|---|
| **Axios** (principal) | `shared/api/axios.ts` | Todos los servicios en `features/services/`. Incluye interceptors, auto-refresh. |
| **Fetch nativo** | `lib/http.ts` | Server components y fetch SSR. Token desde localStorage (legacy). |

### Endpoints Backend

| Servicio | Base | Métodos |
|---|---|---|
| Auth | `/login`, `/register`, `/refresh`, `/logout` | POST |
| Me | `/me` | GET |
| Customer | `/customers/me` | GET, PATCH, DELETE |
| Articles | `/articles` | GET (list, by id, brands) |
| Cart | `/cart`, `/cart/items` | GET, POST, PATCH, DELETE |
| Orders | `/orders` | GET, POST |
| Shipping | `/shipping/states` | GET |
| Categories | `/categories` | GET |
| Fiscal | `/customers/me/fiscal-profile` | GET, POST, PATCH |
| Health | `/health` | GET |

### Respuesta Estándar del Backend

```json
{
  "ok": true,
  "data": { ... }
}
```

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "requestId": "..."
  }
}
```

---

## 8. Agente: Hooks

**Contexto:** Patrones de hooks en el proyecto.

### Patrón Estándar de Hook

```typescript
type UseXxxState = {
  items: Item[]
  isLoading: boolean
  error: string | null
}

export function useXxx() {
  const [state, setState] = useState<UseXxxState>({ items: [], isLoading: false, error: null })

  const fetchItems = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const data = await servicioApi.list()
      setState({ items: data, isLoading: false, error: null })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load'
      setState(prev => ({ ...prev, isLoading: false, error: message }))
    }
  }, [])

  return { ...state, fetchItems }
}
```

### Reglas de Hooks

- Siempre `'use client'` al inicio del archivo.
- Estado con `useState`, acciones con `useCallback`.
- Error handling: `instanceof ApiError` o `instanceof ApiRequestError`.
- Spread state en return: `return { ...state, fetchXxx }`.
- Nunca hacer fetch en el hook directamente; exponer funciones para que el componente decida cuándo llamar.

### Hooks Disponibles

| Hook | Archivo | Funciones expuestas |
|---|---|---|
| `useAuth` | `shared/auth/AuthProvider.tsx` | `login`, `logout`, `register`, `fetchMe` |
| `useCart` / `useCartContext` | `features/cart/context/CartContext.tsx` | `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `refreshCart` |
| `useArticles` | `features/articles/hooks/useArticles.ts` | `fetchArticles` |
| `useOrdersList` | `features/orders/hooks/useOrders.ts` | `fetchOrders` |
| `useShippingAddresses` | `features/orders/hooks/useOrders.ts` | `fetchAddresses` |
| `useOrderDetail` | `features/orders/hooks/useOrders.ts` | `fetchOrder`, `updateShippingFee` |
| `useCreateOrder` | `features/orders/hooks/useOrders.ts` | `createOrder` |
| `useShippingStates` | `features/shipping/hooks/useShippingStates.ts` | `fetchStates`, `calculateShipping`, `calculateShippingByName` |
| `useSections` | `features/categories/context/SectionsContext.tsx` | `sections`, `setSections` |
| `useBrands` | `features/brands/context/BrandsContext.tsx` | `brands`, `setBrands` |
| `useLoginModal` | `shared/login-modal/LoginModalProvider.tsx` | `openLogin`, `openRegister`, `close` |

---

## 9. Agente: Estilos & Design System

**Contexto:** Sistema de diseño, tokens, componentes visuales.

### Reglas de Estilos

1. **Siempre SCSS Modules** — archivo `Componente.module.scss` junto al `.tsx`.
2. **Variables CSS** definidas en `globals.scss` vía `_colors.scss`, `_spacing.scss`, `_sizes.scss`, `_radius.scss`, `_fonts.scss`.
3. **Responsive** con mixins de `_responsive.scss`:
   - `@include responsive.respond-down(mobile)` — hasta 768px
   - `@include responsive.respond-up(desktop)` — desde 1024px
4. **Importar partials** con `@use`:
   ```scss
   @use '../../../styles/colors' as colors;
   @use '../../../styles/responsive' as responsive;
   ```
5. **Naming convention:** BEM-ish con doble guión bajo: `.product__image`, `.detail__content`.
6. **Fuentes:** IBM Plex Sans (principal), Geist Sans/Mono, Cinzel (decorativa).

### Componentes UI Reutilizables

| Componente | Props Clave | Notas |
|---|---|---|
| `Button` | `text`, `variant`, `filled`, `leftIcon`, `disabled`, `onClick` | Variants: primary, secondary, accent |
| `Chip` | `text`, `type`, `active`, `leftIcon`, `rightIcon` | Toggle visual sin lógica |
| `Counter` | `value`, `onChange`, `min`, `max` | Numérico con +/- |
| `Input` | Extiende `InputHTMLAttributes` | Active/inactive states |
| `Product` | `product`, `short`, `onSelect` | Card de producto con cart toggle |
| `ConfirmModal` | `isOpen`, `onClose`, `onConfirm`, `title`, `message` | Modal genérico |
| `LogosMarquee` | `logos`, `direction`, `onBrandClick?` | Marquee de logos con navegación opcional |

---

## 10. Provider Hierarchy

El árbol de providers en `layout.tsx` es:

```
<Toaster />
<AuthProvider>
  <SectionsProvider>
    <BrandsProvider>
      <CartProvider>
        <LoginModalProvider>
          <Header />
          <Nav />
          {children}
          <Footer />
          <LoginModalRenderer />
        </LoginModalProvider>
      </CartProvider>
    </BrandsProvider>
  </SectionsProvider>
</AuthProvider>
```

**Regla:** Si agregas un nuevo provider global, debe ir dentro de `AuthProvider` y fuera del componente que lo consume.

---

## 11. Variables de Entorno

| Variable | Uso | Dónde |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL del backend API (client-side) | Axios instance |
| `API_BASE_URL` | URL del backend API (server-side only) | Server Components fetch |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | lib/stripe.ts |

---

## 12. Patrón: Búsqueda de Productos con AsyncSelect

**Ubicación:** `src/app/_components/Cover/Cover.tsx`

**Librería:** `react-select/async`

**Características:**
- Búsqueda en tiempo real mientras escribes
- Caching de opciones (`cacheOptions`)
- Imágenes de productos en opciones
- Navegación automática al seleccionar
- Responsive: 556px en desktop, 100% en mobile

**Implementación:**
```tsx
import AsyncSelect from 'react-select/async'
import { articlesApi, getArticleImageUrl } from '@/features/services/articles.api'

const loadOptions = async (inputValue: string) => {
  if (!inputValue || inputValue.trim().length < 2) return []
  const response = await articlesApi.list({ q: inputValue, limit: 8, page: 1 })
  if (!response.ok || !response.data) return []
  return response.data.items.map(article => ({
    value: article._id,
    label: article.description || article.name,
    image: getArticleImageUrl(article),
    description: article.brand || '',
  }))
}

const handleSelectProduct = (option: ProductOption) => {
  router.push(`/productos/${option.value}`)
}

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

---

## 13. Patrón: Navegación de Marcas

**Ubicación:** `BestBrands.tsx`, `Footer.tsx`, `MenuContainer.tsx`

**Flujo:**
1. Usuario hace click en marca
2. `handleBrandClick(brandName)` → `encodeURIComponent(brandName)`
3. Navega a `/productos?brand=ENCODED_NAME`
4. Backend filtra productos por marca
5. Contadores se actualizan correctamente

**Regla importante:** El parámetro `brand=all-brands` se ignora en el servidor para obtener el total sin filtros.

---

## 14. Contadores de Productos

**Problema resuelto:** "Todos los productos" mostraba el total filtrado en lugar del total real.

**Solución:**
- Servidor hace dos llamadas: una con filtros (para productos), otra sin filtros (para total)
- `totalProducts` siempre es el total sin filtros
- `HomeProducts` usa `totalProducts` para el contador "Todos los productos"
- Contadores de categorías/marcas se actualizan dinámicamente

---

## 15. Convenciones de Código

| Área | Convención |
|---|---|
| **IDs de MongoDB** | Siempre `_id`, nunca `id` (excepto en mock.ts y tipos de UI) |
| **Moneda** | `formatCurrency(valor)` → locale `es-MX`, currency `MXN` |
| **Fechas** | `formatDate()` o `formatDatePT()` para zona Pacific Time |
| **Errores API** | Clase `ApiError` con `status`, `code`, `message`, `requestId` |
| **Idioma UI** | Español mexicano (textos en español, código en inglés) |
| **Tabs sin rutas** | Tabs en account usan `activeTab` state, no sub-rutas |
| **Formularios** | `react-hook-form` con `useForm<FormType>()` |
| **URL encoding** | Usar `encodeURIComponent()` para parámetros de marca/búsqueda |
| **searchParams** | Es una Promise en Next.js 15+, debe ser awaited |
