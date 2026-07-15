---
description: Naming conventions for files, components, styles, and types
---

# Naming Conventions

- **Components:** PascalCase (MyComponent.tsx)
- **Styles:** PascalCase matching component (MyComponent.module.scss)
- **Functions:** camelCase (formatCurrency, fetchArticles)
- **Constants:** UPPER_SNAKE_CASE (STORAGE_KEY, API_BASE_URL)
- **Files (utilities):** camelCase (format.ts, useDebounce.tsx)
- **Files (components):** PascalCase (Button.tsx, ProductDetailClient.tsx)
- **SCSS classes:** BEM (block__element--modifier)
- **CSS variables:** --kebab-case (--primary, --accent, --body-text)
- **TypeScript interfaces:** PascalCase, descriptive (CartContextValue, ArticleListItem)
- **Props interfaces:** Named `Props` suffix (ProductProps, CheckoutFormValues)
- **API types:** PascalCase matching domain (Article, Order, ShippingAddress)
- **Hooks:** use prefix (useAuth, useCart, useArticles, useOrders)
- **Context files:** XContext.tsx (CartContext.tsx, SectionsContext.tsx)
- **Provider components:** XProvider (AuthProvider, CartProvider)
- **API client files:** domain.api.ts (auth.api.ts, articles.api.ts, cart.api.ts)
- **Server fetch files:** domain.server.ts (articles.server.ts, homeCategories.server.ts)
- **Exports:** Named exports (export const), not default exports
