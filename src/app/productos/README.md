# Productos Page Overview

Este documento describe en detalle `src/app/productos/page.tsx`, una página server component que inicializa categorías, marcas y productos para `ProductosClient`.

## 1. Estructura general

- La página se exporta como async Next.js page y recibe `searchParams` (category, brand, q) para filtrar la vista inicial.
- Se importa `fetchAllCategories`, `fetchHomeBrands` y `articlesApi` para construir los datos necesarios antes de renderizar.
- `ProductosClient` es el componente cliente que maneja la paginación, filtros y listados en el navegador.
- `IndustrialHero` se renderiza en la parte inferior como sección estática promocional.

## 2. Obtención de datos (`fetchInitialProducts`)

1. Construye un objeto `query` con `page: 1`, `limit: 12` y opcionalmente `category_id`, `brand` y `q` según los parámetros de búsqueda.
2. Llama a `articlesApi.list(query)` (servicio REST centralizado) para obtener artículos.
3. Si la respuesta no es `ok` o no trae datos, retorna `{ products: [], total: 0 }` para evitar caídas.
4. Si hay datos, mapea cada `ArticleListItem` a un objeto `ProductView` con `id`, `name`, `brand`, `price`, `currency: 'MXN'`, `stock` (usa `stock_web` o fallback general), y `image` (llamando `getArticleImageUrl`).

## 3. Parsing de query params

- Extrae `category`, `brand` y `q` de `searchParams` y solo toma el primer valor si vienen como array (Next.js a veces lo representa así).
- Convierte `searchQuery` a string o cadena vacía para mantener compatibilidad con `ProductosClient`.

## 4. Server rendering y composición

- Usa `Promise.all` para ejecutar simultáneamente:
  1. `fetchAllCategories()` → sección de categorías para el filtro horizontal.
  2. `fetchHomeBrands()` → inicializa el listado de marcas disponibles.
  3. `fetchInitialProducts(...)` → obtiene los primeros 12 productos filtrados.
- Todos los datos se preparan antes de devolver la UI para evitar flicker de carga.

## 5. Layout final

```tsx
<div className={styles.products}>
  <SectionsInitializer sections={sections} />
  <BrandsInitializer brands={brands} />
  <ProductosClient
    brands={brands}
    initialProducts={initialProducts.products}
    initialSearch={searchQuery}
  />
  <div className="content">
    <IndustrialHero />
  </div>
</div>
```

- `SectionsInitializer` y `BrandsInitializer` preparan el contexto global (`SectionsProvider`, `BrandsProvider`) reutilizado por `ProductosClient`.
- `ProductosClient` recibe las marcas + productos iniciales y se encarga de renderizar el listado completo, manejar paginación y aplicar filtros sin realizar nuevas llamadas iniciales.
- `IndustrialHero` se monta sobre un `div.content` con estilo para mantener separación estética.

## 6. Consideraciones IA-friendly

- Toda petición de datos ocurre del lado del servidor; el cliente solo renderiza y mantiene estado local.
- No se hace caching manual: al ser `force-dynamic`, cada visita vuelve a ejecutar la data fetching.
- Para extender filtros se puede enriquecer `fetchInitialProducts` con nuevos query params y pasarlos también a `ProductosClient`.
