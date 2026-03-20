# Register Page Overview

Guía detallada para entender `fesmex-store-fe/src/app/(auth)/register/page.tsx` y su UI/state flow.

## 1. Hooks y estado local

- **`useAuth.register`**: único punto que llama a la API. Espera payload `{ email, password, first_name, last_name, mobile? }` y lanza errores con mensaje (p. ej. correo ya usado).
- **Estados locales (`useState`)**:
  - `email`, `password`, `firstName`, `lastName`, `mobile`: inputs controlados.
  - `error`: string para mostrar mensajes del backend o validaciones.
  - `success`: muestra pantalla alternativa cuando el registro fue exitoso.
  - `isSubmitting`: deshabilita inputs/botón durante la petición.

## 2. Validaciones y manejo de errores

- `handleSubmit` previene el reload y limpia `error`/`success` al inicio.
- Validación mínima: la contraseña debe tener al menos 8 caracteres; si falla se asigna el mensaje y no se dispara `register`.
- Se valida que todos los campos requeridos (email, password, first name, last name) no estén vacíos; el input `mobile` es opcional.
- Los inputs y el botón se deshabilitan cuando `isSubmitting` es `true`, previniendo múltiples envíos.
- Si `register` arroja un error, se muestra `err.message` (cuando es `Error`) o “Registration failed”.

## 3. Flujo de submit y payload

1. Se construye el payload con `email`, `password`, `first_name`, `last_name` y `mobile` (solo si tiene valor).\
2. `register` envía la petición y, si hay éxito, activa `success` (sin redirección inmediata); solo muestra la pantalla de agradecimiento.\
3. En caso de error, se habilita el formulario (`setIsSubmitting(false)`) y se muestra el mensaje retornado.

## 4. UI/UX y estados visibles

- Mientras `success` es `false`, se renderiza la tarjeta de registro con título, formulario y mensaje de error (`styles.error`).
- Cada input está dentro de `.formGroup` con su `label` y `input` estilizados (`login.module.scss`).
- El botón muestra “Registering...” cuando `isSubmitting` está activo.
- Texto adicional al pie del formulario ofrece enlace a `/` para usuarios existentes.
- Cuando `success` es `true`, se renderiza una pantalla distinta indicando que el usuario debe verificar su correo.

## 5. Consideraciones IA-friendly

- Toda la lógica de registro está contenida en este componente; el resto se maneja via `useAuth`.\
- Todos los errores vienen del backend; el frontend solo los renderiza.\
- El flag `isSubmitting` sirve para evitar dobles envíos y para mostrar estados de carga en la UI.
- Las validaciones adicionales (regex, confirm password, etc.) pueden agregarse antes o después de la verificación de longitud de contraseña en `handleSubmit`.

- La tarjeta central contiene el título “Register”, el formulario y un mensaje de error opcional (`styles.error`).
- Cada campo está envuelto en `.formGroup`, con `label` e `input` estilizados via `register.module.scss`.
- El botón muestra “Registering...” cuando se envía. Tras un registro exitoso no se redirige automáticamente; simplemente se muestra la pantalla de éxito.
- Al final se ofrece un enlace a `/` (login) para usuarios existentes.

## 5. Flujo de éxito

El estado `success` muestra otra tarjeta con un mensaje que indica que se creó la cuenta y que debe verificarse el correo. No se permite volver al formulario en ese estado.

## 6. Consideraciones IA-friendly

- Esta página es controlada: todo el estado vive en `useState` y la única dependencia externa es `useAuth.register`.
- El backend es el que valida y persiste usuarios; el frontend solo muestra mensajes (`error`, `success`).
- Para extender, se puede agregar validación adicional (p. ej. regex para el email o el teléfono) directamente dentro de `handleSubmit` antes de llamar a `register`.
