# Brand assets

Original SVG geometry from [theSVG](https://thesvg.org/), served locally to avoid runtime network dependencies.
`sources.json` records each upstream URL, variant, brand website, and catalog license.

Use `BrandLogo` for product logos and `components/icons.tsx` for interface icons.
Logos inherit the active text color through CSS masks. Keep them decorative when an adjacent label names the brand; use `decorative={false}` for standalone marks.
