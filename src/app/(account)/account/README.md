# Account Page Overview

Breve guía para entender `fesmex-store-fe/src/app/(account)/account/page.tsx` y sus `_components`.

## 1. Entry points

- **Auth guard**: `useAuth` expone `accessToken`, `user`, `fetchMe` y `isBootstrapping`; se redirige a `/` si no hay token.
- **Tab selection**: `useSearchParams` alimenta `activeTab` (`profile`, `orders`, `address`, `payments`).
- **Hooks**: `useOrdersList` y `useShippingAddresses` recuperan órdenes/direcciones al montar con (`fetchOrders`, `fetchAddresses`).
- **Resiliencia**: `handleRefresh` reintenta `fetchMe` cuando no se carga `user`; durante la carga (`isBootstrapping`) se muestra pantalla blanca con spinner.

## 2. UI principal

| Área | Comportamiento |
| --- | --- |
| Header | Saluda al usuario (nombre completo o email) y expone chips que actualizan `activeTab`; el chip de órdenes muestra el total (`ordersState.total`). |
| profile | Rinde `ProfileForm` + `FiscalProfileForm` para editar datos personales y fiscales en paralelo. Ambos comparten la validación y envían cambios a la API a través de hooks internos. |
| orders | Renderiza `OrdersPanel` con `ordersState`; el hook ya maneja paginado/fetch y la UI solo muestra cards, filtros y estados (`payment_status`, `total`, etc.). |
| address | Lista `addressesState.addresses` o mensajes de carga/error/empty; cada `li` muestra nombre, dirección (line1/line2), ciudad/estado/CP y teléfono. |

## 3. `_components` responsibilities

1. **`ProfileForm`** – Formulario controlado (`react-hook-form`) para nombre, apellido, email, teléfono. Usa `useEffect` para cargar datos y muestra estados de saving/loading.
2. **`FiscalProfileForm`** – Captura razón social, RFC, régimen fiscal y uso de CFDI. Envía peticiones a la API de usuarios para persistencia y valida campos con reglas de negocio.
3. **`OrdersPanel`** – Renderiza lista de órdenes con `ordersState`, maneja paginación, refrescos y casos de carga/empty. Cada orden muestra ID, estado, método de pago, fecha y total.

## 4. Estado/UX adicionales

- `isRefreshing` deshabilita el botón de reintento cuando se solicita `fetchMe` para evitar peticiones duplicadas.
- `router.push('/')` asegura salida si el token caduca durante la navegación.
- Los chips usan `styles.pointer` para convertirlos en toggles, y el chip de órdenes incluye un badge (`styles.count`).

## 5. Puntos clave para IA

- Cualquier IA que revise este README debe notar que los datos se cargan desde `useOrdersList` y `useShippingAddresses`; el componente principal solo hace render condicional según `activeTab`.
- Todos los formularios son puros: sus `onSubmit` dependen de los hooks para hacer persistencia.
- La navegación de chips no usa rutas adicionales; solo actualiza `activeTab`, por lo que no hay refresh de página.
