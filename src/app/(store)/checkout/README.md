## Checkout Page Overview

Esta sección resume todos los bloques funcionales dentro de `fesmex-store-fe/src/app/(store)/checkout/page.tsx`, incluyendo el flujo de pagos y las nuevas fuentes dinámicas de shipping.

### 1. Contexto inicial

- **Gestión de sesión**. `useAuth` expone `accessToken`, `isBootstrapping`, `user`. Si el token se elimina redirige a `/`. También provee `fetchMe` para refrescar datos y `login`/`logout` a nivel global.
- **Carrito y pedidos**. `useCart` devuelve artículos (`items`) y subtotal (`total`); `clearCart` se usa tras confirmación. `useCreateOrder` entrega la función `createOrder` y el flag `isSubmitting`.
- **Direcciones**. `useShippingAddresses` proporciona `addresses`, `isLoading`, `fetchAddresses`. `fetchAddresses` se invoca una sola vez en `useEffect`.
- **Formulario**. `react-hook-form` (hook `useForm`) controla la dirección nueva. `selectedAddressIndex === 'new'` activa el formulario y `isFormReady` agrega validaciones adicionales.

### 2. Estados clave

- `deliveryType`: `'shipping'` vs `'pickup'`. Cambia la UI y determina si se requiere dirección o solo selección de punto de retiro.
- `selectedAddressIndex`: índice numérico para direcciones guardadas o `'new'` para capturar una nueva dirección vía `NewAddressForm`.
- `estimatedShipping` y `selectedStateId`: ya no se usan `SHIPPING_OPTIONS`. El hook `useShippingStates` entrega `stateOptions`, `calculateShipping` y `getStateByName`. Al seleccionar un estado se calcula `subtotal * percentage` y se guarda el `stateId` para validaciones.
- `paymentMethod`: `'CARD'` lanza el flujo de Stripe con `ConfirmModal`; `'TRANSFER'` solo muestra confirmación.
- `isProcessingPayment` y `paymentLoaderMessage` reflejan el estado de Stripe (preparando, procesando, verificando). También se respetan errores (`handlePaymentError`).

## 3. Flujo de creación y confirmación del pedido

- `onSubmit`: con tarjeta crea la orden para obtener `client_secret`; para transferencia guarda los datos y abre el modal sin llamar `createOrder` previo.
- `buildOrderPayload`: incluye `payment_method`, `delivery_type`, `notes` y `shipping_address`. Para direcciones seleccionadas reutiliza el registro existente; para nuevas direcciones usa campos del formulario y `country: 'MX'`.
- `handleConfirmOrder`: con tarjeta invoca `stripePaymentRef.confirmPayment()`, maneja errores (`handlePaymentError`) y hace polling a `ordersApi.getOrderById` hasta que `payment_status === 'PAID'`. Transferencias solo llaman `createOrder` al confirmar.
- Luego se limpia el carrito, muestra toasts `sileo.success` o `sileo.error` y redirige a `/account?tab=orders` tras un delay de 500ms.

### 4. UI principal y componentes

| Sección | Comportamiento |
| --- | --- |
| Entrega | Toggle entre `shipping` y `pickup`. Si es `shipping`, muestra `ShippingAddressSelector` y `NewAddressForm`. Si es `pickup`, muestra `PICKUP_LOCATIONS`. |
| Método de envío | Sección `shippingEstimate` muestra: 1) selector de estado (nuevo `NewAddressForm`). 2) Costo estimado con nota (“El costo final...”). |
| Método de pago | `PaymentMethodControls` permite elegir `CARD` o `TRANSFER`, mostrando instrucciones extra para transferencias. |
| Notas | Campo libre con placeholder y `disabled={isSubmitting}`. |
| Resumen | `SummaryActions` usa `subtotal`, `estimatedShipping`, etiqueta de envío y `grandTotal`, y valida `isFormReady`. |
| Modal | `ConfirmModal` renderiza `<Elements>` + `StripePaymentSection` si hay `clientSecret`, o muestra texto de confirmación para transferencias. |

### 5. Nuevo flujo dinámico de shipping

- `useShippingStates` (módulo `@/features/shipping`) cachea estados (`getActiveStates()`) con `percentage`, `code` y `is_active`. Incluye utilidades `calculateShipping(stateId, subtotal)` y `getStateByName(name)`.
- `NewAddressForm` utiliza `stateOptions`, deshabilita el select mientras carga (`isLoadingStates`) y notifica cambios via `onStateChange`. El select añade opción vacía para evitar selección accidental.
- `handleNewAddressStateChange` y el `useEffect` que observa `selectedAddressIndex` recalculan `estimatedShipping = subtotal * percentage`, actualizan `selectedStateId` y almacenan el id para la validación de `isFormReady`. Si el estado no se encuentra se resetea el estimado a 0 y se muestra warning en consola.
- `SummaryActions` y la UI de envío muestran el costo estimado; el botón principal sólo se habilita cuando `estimatedShipping > 0` o el usuario cambió a pickup. El backend vuelve a calcular `shipping_fee` al confirmar para evitar confiar en el frontend.

### 6. Componentes reutilizados (resumen)

- `ShippingAddressSelector`: lista direcciones guardadas y permite agregar nueva (botón tipo radio).
- `NewAddressForm`: captura fullName, phone, address, city y select de estado con validación condicional.
- `PaymentMethodControls`: toggle CARD/TRANSFER con advertencias para transferencias.
- `SummaryActions`: muestra totales, controla botón y recibe `isFormReady` + `isSubmitting`.
- `StripePaymentSection`: encapsula Stripe `PaymentElement` y expone `confirmPayment` vía `forwardRef`.
- `ConfirmModal` y `PaymentLoader`: modal de confirmación y overlay de procesamiento.

## 7. Puntos rápidos para IA

- Las validaciones se desacoplan en hooks (`useForm`, `useShippingStates`, `useOrdersList`).
- No hay envío de porcentaje desde el frontend: solo se muestra `estimatedShipping`, el backend recalcula `shipping_fee` al crear la orden.
- El componente es declarativo: `activeTab` controla qué sección renderiza sin cambiar la ruta.
