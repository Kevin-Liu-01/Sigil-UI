# Product iconography

Use named imports from `@/components/icons` for interface icons. The shared adapter defaults to Phosphor's filled weight, inherits `currentColor`, sizes from `--s-control-icon-size`, and hides decorative icons from assistive technology. Give icon-only controls a text label with `aria-label`.

Add icons with individual `@phosphor-icons/react/dist/ssr/<Name>` imports to keep imports compatible with server rendering and avoid loading the entire catalog. Product aliases stay stable across the landing page, docs, presets, and studio controls. The component package uses the same filled family through direct imports.

Use `BrandLogo` for brand marks. Its local SVG assets come from [theSVG](https://thesvg.org/); original URLs and catalog licenses live in `public/brands/sources.json`. Adjacent text should name the brand. Set `decorative={false}` when the logo stands alone.

Keep icon spacing, color, and size in tokens. The hero's compact demo scale is specified centrally in `app/global.css`; it does not change the sizing of the main product controls.
