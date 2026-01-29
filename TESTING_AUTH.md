# Guía de Pruebas - Sistema de Autenticación

## Resumen de la Implementación

Se ha implementado un sistema de autenticación robusto con las siguientes características:

### Archivos Creados/Modificados

1. **`src/lib/http.ts`** - Wrapper HTTP con manejo de errores y autenticación automática
2. **`src/modules/auth/AuthProvider.tsx`** - Provider de contexto para autenticación
3. **`src/modules/auth/RequireAuth.tsx`** - Componente para proteger rutas
4. **`src/app/login/page.tsx`** - Página de inicio de sesión
5. **`src/app/(store)/checkout/page.tsx`** - Página protegida de checkout
6. **`src/app/(store)/account/page.tsx`** - Página protegida de cuenta
7. **`src/app/(store)/orders/page.tsx`** - Página protegida de pedidos
8. **`src/app/layout.tsx`** - Layout actualizado con AuthProvider

### Características Implementadas

✅ **apiFetch() wrapper** con:
- Header `Authorization: Bearer <token>` automático
- Clase `ApiError` con status, code, message, details, requestId
- Manejo de 401/403: limpia token y redirige a `/login?next=<ruta>`
- Soporte para client components
- Diferenciación server/client (usa `window.location.href` en client)

✅ **AuthProvider** con:
- Estado `user` y `isLoading`
- Carga de sesión al montar con `GET /auth/me`
- Función `login()`: autentica, guarda token, redirige a `next`
- Función `logout()`: limpia token, redirige a `/login`
- Función `refreshMe()`: recarga datos del usuario

✅ **RequireAuth** componente:
- Protege rutas automáticamente
- Redirige a `/login?next=...` si no hay usuario
- Muestra loading mientras carga

✅ **Código limpio**:
- Sin `any`, usa `unknown` donde es necesario
- TypeScript estricto
- Manejo de errores robusto

## Configuración del Backend

Asegúrate de que tu backend esté corriendo y tenga estos endpoints:

```
POST /auth/login
GET /auth/me
POST /auth/logout (opcional)
```

### Variable de Entorno

Crea o actualiza tu archivo `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
```

## Cómo Probar

### 1. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

### 2. Pruebas en el Navegador

#### Escenario 1: Acceso a Ruta Protegida sin Autenticación

1. Abre el navegador en `http://localhost:3000/checkout`
2. **Resultado esperado**: Redirige automáticamente a `/login?next=%2Fcheckout`

#### Escenario 2: Login Exitoso

1. Ve a `http://localhost:3000/login`
2. Ingresa credenciales válidas (según tu backend)
3. **Resultado esperado**: 
   - Token guardado en localStorage
   - Redirige a la ruta especificada en `next` o a `/`
   - Usuario cargado en el contexto

#### Escenario 3: Acceso a Rutas Protegidas con Autenticación

1. Después de login exitoso, visita:
   - `http://localhost:3000/checkout`
   - `http://localhost:3000/account`
   - `http://localhost:3000/orders`
2. **Resultado esperado**: Acceso permitido, muestra información del usuario

#### Escenario 4: Token Inválido/Expirado

1. En DevTools Console, ejecuta:
   ```javascript
   localStorage.setItem('auth_token', 'token_invalido');
   ```
2. Recarga la página o navega a una ruta protegida
3. **Resultado esperado**:
   - Backend responde 401
   - Token eliminado de localStorage
   - Redirige a `/login?next=...`

#### Escenario 5: Logout

1. En cualquier página protegida, haz clic en "Cerrar Sesión"
2. **Resultado esperado**:
   - Token eliminado
   - Redirige a `/login`
   - Intentar acceder a rutas protegidas redirige a login

### 3. Verificar en DevTools

#### Verificar Token en localStorage

```javascript
// En Console
localStorage.getItem('auth_token')
```

#### Verificar Requests

1. Abre la pestaña **Network**
2. Filtra por `Fetch/XHR`
3. Verifica que las peticiones incluyan:
   - Header `Authorization: Bearer <token>`
   - Content-Type correcto

#### Verificar Estado del AuthProvider

Instala React DevTools y verifica el contexto `AuthContext`:
- `user`: objeto del usuario o `null`
- `isLoading`: `true` durante carga, `false` después

### 4. Pruebas con Postman (Backend)

#### Login
```
POST http://localhost:5001/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

#### Get Me
```
GET http://localhost:5001/auth/me
Authorization: Bearer <token>
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "customer": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

## Estructura de Almacenamiento

**Actualmente usando:** `localStorage`

El token se guarda como:
```
Key: auth_token
Value: <JWT_TOKEN>
```

### Cambiar a Cookies (Opcional)

Si prefieres usar cookies, modifica `src/lib/http.ts`:

```typescript
// Reemplazar funciones de token
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(c => c.startsWith('auth_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Strict`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  document.cookie = 'auth_token=; path=/; max-age=0';
}
```

## Casos de Error Comunes

### Error: "useAuth must be used within AuthProvider"

**Causa**: Intentas usar `useAuth()` fuera del AuthProvider.

**Solución**: Asegúrate de que el componente esté dentro del árbol de AuthProvider (ya está en `layout.tsx`).

### Error: Network request failed

**Causa**: Backend no está corriendo o URL incorrecta.

**Solución**: 
1. Verifica que el backend esté en `http://localhost:5001`
2. Verifica la variable `NEXT_PUBLIC_API_BASE_URL`

### Error: CORS

**Causa**: Backend no permite requests desde `localhost:3000`.

**Solución**: Configura CORS en tu backend para permitir el origen del frontend.

## Extensiones Futuras

### 1. Agregar Zod para Validación

```bash
npm install zod
```

```typescript
import { z } from 'zod';

const LoginResponseSchema = z.object({
  ok: z.literal(true),
  token: z.string(),
  customer: z.record(z.unknown())
});

// En apiFetch
const data = await res.json();
return LoginResponseSchema.parse(data);
```

### 2. Refresh Token

Implementar lógica para refrescar tokens antes de que expiren.

### 3. Persistencia de Sesión

Guardar información adicional del usuario en localStorage para evitar llamadas innecesarias.

### 4. Loading States Mejorados

Usar librerías como `react-loading-skeleton` para mejores UX.

## Checklist de Verificación

- [ ] Backend corriendo en puerto correcto
- [ ] Variable de entorno `NEXT_PUBLIC_API_BASE_URL` configurada
- [ ] Login funciona y guarda token
- [ ] Rutas protegidas redirigen a login sin token
- [ ] Rutas protegidas accesibles con token válido
- [ ] Token inválido limpia y redirige
- [ ] Logout funciona correctamente
- [ ] Parámetro `next` preserva ruta después de login
- [ ] No hay errores en consola
- [ ] Headers de Authorization se envían correctamente

## Soporte

Si encuentras problemas:

1. Verifica la consola del navegador
2. Verifica la pestaña Network en DevTools
3. Verifica que el backend esté respondiendo correctamente
4. Verifica que las rutas del backend coincidan (`/auth/login`, `/auth/me`)
