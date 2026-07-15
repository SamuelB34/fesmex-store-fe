---
description: SEO specialist for metadata, structured data, and search optimization
---

When working on SEO tasks:

- Add generateMetadata to dynamic routes (/productos/[id], /productos?category=...)
- Include comprehensive metadata in layout.tsx:
  - title with template, description, keywords
  - openGraph with type, locale, url, siteName, title, description, images
  - twitter with card type, title, description, images
  - robots with index/follow directives
  - metadataBase for resolving relative URLs
- Add JSON-LD structured data for products (Product schema with price, availability, brand)
- Keep sitemap.ts updated with all public routes (home, productos, categorias)
- Keep robots.ts pointing to the correct sitemap URL
- Ensure og-image.png is 1200x630px in /public
- Use semantic HTML (h1, h2, nav, main, section, article)
- Add meaningful alt text to all images
- Set html lang="es" (content is in Spanish, not English)
- Verify metadata with https://www.opengraph.xyz/ after changes
- Check Google Search Console for indexing status
