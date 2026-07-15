---
description: Optimize and manage images for the FESMEX store
---

1. Check all images in /public for optimization opportunities:
   - /public/icons/ — UI icons (SVG, should be minified)
   - /public/illustrations/ — Decorative illustrations (SVG)
   - /public/images/ — Product images and placeholders

2. For SVG files:
   - Verify they are minified (no editor metadata like Inkscape/Illustrator comments)
   - Remove unused defs, gradients, and hidden layers
   - Ensure viewBox is set for responsive scaling

3. For raster images (PNG, JPG) in /public:
   - Convert to WebP or AVIF if possible
   - Compress without visible quality loss
   - Ensure OG image is 1200x630px (if adding one)

4. Product images come from the backend (t3.storageapi.dev):
   - Already configured in next.config.ts remotePatterns
   - Use next/image with fill + sizes for responsive loading
   - Always provide a fallback: src={item.image || '/images/placeholder-product.png'}

5. Replace any <img> tags with next/image <Image /> component

6. Verify all <Image /> components have meaningful alt text (not just "image")

7. For images above the fold (hero, cover):
   - Use priority prop on next/image
   - Ensure no layout shift (set width/height or use fill with container)

8. Run the build to verify everything works:
   // turbo
   ```bash
   pnpm build
   ```
