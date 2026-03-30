# Verify Email Page Overview

Este README describe con detalle el comportamiento de `fesmex-store-fe/src/app/(auth)/verify-email/page.tsx`, incluyendo estados, efectos y las distintas pantallas reenfocadas.

## 1. Propósito general

- Esta ruta se utiliza después de que el backend envía un link de verificación al correo del usuario. El link incluye `token` como query param.
- No hay formularios ni inputs; solo se muestra feedback visual mientras el token se valida contra `/email/verify`.
- `VerifyEmailPage` renderiza `VerifyEmailContent` dentro de un `Suspense` para mantener la compatibilidad con la arquitectura de App Router.

## 2. Hooks y estado interno

- `useSearchParams` lee `token` desde la URL.
- `useState<VerifyStatus>` mantiene `status` con valores `'loading' | 'success' | 'error' | 'no-token'`.
- `errorMessage` almacena mensajes devueltos por la API (o una cadena por defecto).
- `useRef(hasVerified)` evita reintentos redundantes si el efecto se ejecuta varias veces.

## 3. Efecto de verificación (`useEffect`)

1. Si no hay `token`, el status se inicializa como `'no-token'` y no se hace llamada.
2. Si hay token y `hasVerified.current` es `false`, se activa `verifyEmail` que:
   - Hace `api.post('/email/verify', { token })`.
   - Actualiza `status` a `'success'` si la petición es exitosa.
   - Captura errores y setea `status = 'error'` junto con el mensaje (`err.message` o texto genérico).
3. `hasVerified.current` se pone en `true` para que el efecto no vuelva a dispararse tras re-render.

## 4. Pantallas según estado

| Status     | UI renderizada                                                                                                             | Notas                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `loading`  | Spinner dentro de `.iconContainer`, título `Verificando tu correo...` y descripción. Se muestra mientras llega respuesta.  | Este estado solo ocurre inmediatamente después de llegar con token válido.                    |
| `success`  | Ícono de check, título `¡Correo verificado!`, mensaje de confirmación y link a `/` con la clase `.button`.                 | No hay redirección automática. El link permite volver al login.                               |
| `error`    | Ícono de error, título `Error de verificación`, muestra `errorMessage`, hint sobre link expirado y botón secundario a `/`. | Aquí se muestra un texto adicional `El enlace puede haber expirado...` para guiar al usuario. |
| `no-token` | Se comporta igual que `error` con mensaje `Token de verificación no encontrado` (estado inicial cuando falta query param). | La UI idéntica ayuda a reutilizar el layout.                                                  |

## 5. Estilos y estructura

- `.container` y `.card` centran el contenido. `.iconContainer` contiene el spinner, check o cross según status.
- `.title`, `.message`, `.hint` y `.actions` separan la información principal, secundario y acciones del usuario.
- El spinner es un div animado (`.spinner`), `successIcon` muestra `✓`, `errorIcon` `✕`.

## 6. Consideraciones para IA

- La única petición de red es `api.post('/email/verify')`; no envía headers adicionales ni depende de contexto.
- La página es puramente determinista: si hay token, intenta verificar una sola vez; de lo contrario muestra error sin intentar llamadas.
- Para tests, se puede mockear `api.post` y el hook `useSearchParams` para simular token válido/ inválido y verificar los estados renderizados.

## 7. Menciones extras

- Si deseas extenderla, podrías incorporar un botón de reenvío que use `/auth/resend-verification` y mantenga el mismo layout de error.
- También se puede vincular a un proceso de soporte si el token ha expirado y el usuario no recibe correo.
