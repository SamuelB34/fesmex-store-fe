# Product Detail Page Overview

Este README documenta `fesmex-store-fe/src/app/productos/[id]/page.tsx`. Describe cómo se obtiene el artículo, se transforman sus datos y se delega al cliente.

## 1. Estrategia de renderizado

- `export const dynamic = 'force-dynamic'` obliga a que cada petición genere contenido fresco (no se cachea). Esto es importante porque los precios/stock pueden variar.
- La página recibe `params` como `Promise<{ id: string }>` y usa `await params` para desestructurar el `id` del artículo.

## 2. Carga de datos y manejo de errores

1. Llama a `articlesApi.getById(id)` para traer el artículo desde `FESMEX API`.
2. Si la petición lanza `ApiError` con estado 404, invoca `notFound()` de Next.js para mostrar la página 404.
3. Si ocurre cualquier otro error se vuelve a lanzar para que la capa de error boundary lo capture.
4. Si la respuesta viene vacía (`article` no existe), también se llama a `notFound()`.

## 3. Transformación del producto

- Calcula `price` de `articleRes.data?.price` o `article.price`, con fallback 0.
- Calcula el stock en web (`stock_web.count`) o general (`stock.count`).
- Usa `getArticleImageUrl(article)` para obtener la URL de la imagen (resuelve CDN o path por estado del artículo).
- Construye un objeto `Product` con `id`, `name`, `brand`, `price`, `currency: 'MXN'`, `stock` e `image`.

## 4. Composición visual

- En el contenedor principal (`<div className={styles.detail}>`):
  - `ViewTracker`: registra la vista del artículo para analytics; solo necesita `articleId`.
  - `ProductDetailClient`: componente cliente que dibuja la información detallada y permite agregar al carrito.
  - `ProductFeatured`: sección de productos recomendados que se renderiza al lado (layout en `.product_featured`).

## 5. Consideraciones adicionales

- Toda la lógica de datos ocurre en el servidor (server component). `ProductDetailClient` recibe un objeto ya normalizado y no vuelve a llamar a la API.
- El módulo `articlesApi` centraliza las llamadas REST; la página solo maneja errores HTTP para devolver `notFound()` cuando corresponde.
- `ViewTracker` y `ProductFeatured` son componentes puros que no dependen del `articlesApi` directamente.
- Si se quiere extender la lógica para manejar variantes o promociones se puede enriquecer el objeto `product` antes de pasarlo al cliente.
