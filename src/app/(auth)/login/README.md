# Login Page Overview

Este README documenta `fesmex-store-fe/src/app/(auth)/login/page.tsx` y su flujo principal.

## 1. Composición general

- `LoginPage` envuelve `LoginContent` con `Suspense` para encajar en App Router.
- `LoginContent` usa `useAuth` (`login`), `useRouter`, `useSearchParams` y controla `email`, `password`, `error`, `isSubmitting`.
- `handleSubmit` previene el evento, resetea errores, habilita el loading, invoca `login({ email, password })` y redirige a `next` o `/account`.

## 2. Interfaz y validaciones

- Inputs de email y password (required) se deshabilitan mientras `isSubmitting` es `true`.
- El botón muestra “Logging in...” durante el submit para evitar múltiples clicks.
- Los errores se capturan desde `login` y se muestran vía `<div className={styles.error}>`.

## 3. UX secundario

- Texto debajo del formulario dirige a `/register` para nuevos usuarios.
- Si `login` lanza excepción sin mensaje, se usa “Login failed”.

## 4. Consideraciones IA-friendly

- Este componente no almacena tokens: `useAuth.login` debe gestionar la persistencia.
- Todo el estado es local; no depende de contextos adicionales.
- La ruta de regreso usa `searchParams.get('next')` para mantener el flujo previo.
