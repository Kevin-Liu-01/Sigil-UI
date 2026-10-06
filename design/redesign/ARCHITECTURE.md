# Redesign Concept Architecture

## Isolation boundary

The experiment lives entirely under `/concepts`. The production homepage,
documentation, packages, presets, and tokens are checksum-protected. Concept
routes are `noindex, nofollow` and are excluded from the sitemap.

## Route map

- `/concepts` — native-scroll review gallery for exactly 20 concepts
- `/concepts/[slug]` — one lazily loaded, full homepage direction
- `/concepts/compare?a=<slug>&b=<slug>` — synchronized side-by-side review

## Source map

- `apps/web/lib/concepts/manifest.ts` — server-safe canonical registry
- `apps/web/components/concepts/loaders.tsx` — lazy component boundary
- `apps/web/components/concepts/shared/` — motion runtime and product-proof parts
- `apps/web/components/concepts/01-*` through `20-*` — independently owned pages
- `apps/web/public/concepts/previews/` — deterministic gallery captures
- `scripts/audit-redesign-concepts.mjs` — route, theme, viewport, and motion audit

## Token and motion policy

Each concept mounts a complete curated preset through a scoped
`SigilTokensProvider`. No component package or preset source is edited. GSAP and
ScrollTrigger are isolated inside client scene leaves. Lenis runs only on the
individual concept route, never on docs, the production homepage, the gallery,
or the comparison route. Every effect cleans up on unmount and respects
`prefers-reduced-motion`.

## Loading policy

The gallery renders static preview images and metadata; it never mounts 20 live
homepages or iframes. The detail loader imports only the requested concept.
Comparison uses two review frames with reduced motion enabled.

## Acceptance gates

1. Registry contains exactly 20 unique slugs and indices 1–20.
2. Every route returns 2xx with one semantic `main` and one visible `h1`.
3. Desktop, tablet, and mobile have no horizontal overflow.
4. Light and dark mode preserve text and material contrast.
5. Console, page, hydration, image, and link errors are zero.
6. Reduced motion removes displacement and scrubbed motion.
7. Navigating away removes Lenis, ScrollTrigger, and scoped token artifacts.
8. Protected checksums match the pre-build baseline.
