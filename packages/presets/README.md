# @sigil-ui/presets

46 curated design system presets for Sigil UI. Each preset controls **everything** about a project's visual identity — colors, fonts, spacing, radius, shadows, motion, buttons, cards, headings, navigation, backgrounds, and code blocks — through a single `SigilPreset` object.

## The Core Principle

**Swap the preset, swap the entire aesthetic.** Every component downstream reads from the preset's tokens. An agent should never manually restyle components when it can switch or edit a preset instead.

```
Wrong:  open Card.tsx → change rounded-lg to rounded-none → open Button.tsx → change bg-indigo to bg-yellow → repeat
Right:  sigil preset anvil       (every component updates to a heavy industrial aesthetic)
Right:  edit the preset file's radius.md value from "8px" to "0px", or override --s-radius-md in your token CSS   (every rounded corner goes sharp)
```

## Installation

```bash
pnpm add @sigil-ui/presets
```

## 46 Presets in 7 Categories

### Structural / Precision
| Preset | Mood | Display Font | Hue |
|--------|------|-------------|-----|
| `sigil` | precise, engineered | PP Neue Montreal | Indigo |
| `kova` | forged, disciplined | PP Acma | Blue |
| `cobalt` | metallic, chemical | PP Telegraf | Cobalt |
| `helix` | biological, organic-tech | PP Gatwick | Teal |
| `hex` | geometric, hexagonal | PP Fuji | Magenta |

### Minimal / Clean
| Preset | Mood | Display Font | Hue |
|--------|------|-------------|-----|
| `crux` | minimal, decisive | TT Commons Classic | Red |
| `axiom` | mathematical, pure | PP Eiko | Blue |
| `arc` | flowing, curved | PP Pangram Sans | Violet |
| `mono` | monochrome, terminal | PP Supply Mono | Neutral |

### Dark / Cinematic
| Preset | Mood | Display Font | Hue |
|--------|------|-------------|-----|
| `basalt` | volcanic, grounded | PP Monument Extended | Slate |
| `onyx` | obsidian, premium | PP Neue Machina | Purple |
| `fang` | fierce, aggressive | PP Mondwest | Lime |
| `obsid` | volcanic, reflective | PP Stellar | Rose |
| `cipher` | encrypted, mysterious | PP Neue Bit | Green |
| `noir` | cinematic, dramatic | PP Hatton | Amber |

### Colorful / Expressive
| Preset | Mood | Display Font | Hue |
|--------|------|-------------|-----|
| `flux` | dynamic, energetic | PP Gosha Sans | Cyan |
| `shard` | crystalline, sharp | PP Fragment Sans | Violet |
| `prism` | spectral, joyful | PP Radio Grotesk | Rainbow |
| `vex` | complex, intricate | PP Formula Condensed | Fuchsia |
| `dsgn` | creative, tool-like | PP Casa | Blue |
| `dusk` | twilight, warm-cool | Vulf Sans | Rose-violet |

### Editorial / Typographic
| Preset | Mood | Display Font | Hue |
|--------|------|-------------|-----|
| `etch` | etched, engraved | Apfel Grotezk | Emerald |
| `rune` | mystical, arcane | PP Rader | Amber |
| `strata` | layered, geological | PP Cirka | Amber |
| `glyph` | typographic, symbolic | Migra | Red |
| `mrkr` | sketched, raw | PP Writer | Gold |

### Industrial / Technical
| Preset | Mood | Display Font | Hue |
|--------|------|-------------|-----|
| `alloy` | metallic, fused | PP Supply Sans | Copper |
| `forge` | molten, industrial | Tex Gyre Heros | Orange |
| `anvil` | heavy, foundational | ABC Monument Grotesk | Blue |
| `rivet` | mechanical, utilitarian | Nacelle | Orange |
| `brass` | warm, vintage | PP Woodland | Gold |

### Edgeless / Atmospheric
| Preset | Mood | Display Font | Hue |
|--------|------|-------------|-----|
| `vast` | expansive, warm, editorial | Fraunces | Terracotta |
| `aura` | ethereal, luminous, ambient | General Sans | Violet |
| `field` | open, functional, utilitarian | Space Grotesk | Green |
| `clay` | warm, earthy, handcrafted | DM Serif Display | Terracotta |
| `sage` | botanical, calm, natural | Libre Baskerville | Green |
| `ink` | creative, deep, immersive | Plus Jakarta Sans | Indigo |
| `sand` | warm, sunny, inviting | Instrument Serif | Amber |
| `plum` | luxurious, rich, dramatic | Playfair Display | Magenta |
| `moss` | forest, deep, organic-tech | Space Grotesk | Green |
| `coral` | warm, friendly, approachable | Outfit | Coral |
| `dune` | warm, golden, vast-feeling | Instrument Serif | Amber |
| `ocean` | deep, calming, oceanic | General Sans | Teal |
| `rose` | elegant, feminine, refined | Fraunces | Rose |

## Usage

### Import a preset directly

```typescript
import { sigilPreset } from "@sigil-ui/presets/sigil";
import { noirPreset } from "@sigil-ui/presets/noir";
```

### Lazy-load from the preset map

```typescript
import { presets } from "@sigil-ui/presets";

const preset = await presets.noir();
```

### Import the catalog (lightweight metadata, no token objects)

```typescript
import { presetCatalog, getCatalogEntry } from "@sigil-ui/presets/catalog";

const noir = getCatalogEntry("noir");
// { name: "noir", label: "Noir", description: "Film noir...", category: "dark", mood: "cinematic, dramatic", ... }
```

## Preset Structure

Every preset is a `SigilPreset` containing up to 519 tokens:

```typescript
type SigilPreset = {
  name: string;
  tokens: {
    colors: { ... },           // 36 tokens: backgrounds, surfaces, text, borders, brand, status
    typography: { ... },        // 31 tokens: font stacks, sizes, weights, leading, tracking
    spacing: { ... },           // 25 tokens: scale, component-specific padding
    layout: { ... },            // 22 tokens: content widths, gutters, grid, bento, sidebar
    sigil: { ... },             // 10 tokens: structural-visibility grid
    radius: { ... },            // 16 tokens: scale + per-component radius
    shadows: { ... },           // 14 tokens: scale + glow, colored, component-specific
    motion: { ... },            // 19 tokens: durations, easings, interaction presets
    borders: { ... },           // 11 tokens: widths, styles, component-specific
    buttons: { ... },           // 9 tokens: weight, transform, hover effect, active scale
    cards: { ... },             // 18 tokens: border style, hover effect, padding, title/desc
    headings: { ... },          // 15 tokens: h1-h4 + display sizes/weights/tracking
    navigation: { ... },        // 24 tokens: navbar, sidebar, breadcrumb, pagination
    backgrounds: { ... },       // 9 tokens: patterns, noise, gradients, hero, dividers
    code: { ... },              // 14 tokens: font, colors, padding, syntax highlighting
    inputs: { ... },            // 13 tokens: heights, focus ring, placeholder, labels
    cursor: { ... },            // 15 tokens: variant, size, colors, glow, blend mode
    scrollbar: { ... },         // 13 tokens: width, track, thumb, radius, firefox compat
    alignment: { ... },         // 13 tokens: rail width/columns/gutter, content alignment
    sections: { ... },          // 25 tokens: padding, heading/description sizing, grid
    dividers: { ... },          // 15 tokens: style, width, color, gradients, ornaments
    gridVisuals: { ... },       // 10 tokens: lines, dots, cell background/border
    focus: { ... },             // 5 tokens: ring width/color/offset, shadow
    overlays: { ... },          // 8 tokens: background, blur, surface, border, shadow
    dataViz: { ... },           // 13 tokens: series colors, positive/negative, grid, axis
    media: { ... },             // 6 tokens: radius, border, outline, shadow, object-fit
    controls: { ... },          // 11 tokens: heights, hit area, track/thumb styling
    componentSurfaces: { ... }, // 12 tokens: bg, border, text, hover/active/selected states
    hero: { ... },              // 25 tokens: min-height, padding, layout, title/action sizing
    cta: { ... },               // 15 tokens: padding, max-width, layout, title/action sizing
    footer: { ... },            // 15 tokens: padding, columns, gaps, logo/link/social sizing
    banner: { ... },            // 12 tokens: height, padding, font, icon, border, position
    pageRhythm: { ... },        // 14 tokens: density, section gaps, dividers, scroll snap
  },
  metadata: {
    description: string,
    author?: string,
    version?: string,
    tags?: string[],
    mood?: string,
    inspiration?: string,
  },
};
```

## Rhythm Modes In Presets

Every preset now declares how pages should flow:

```ts
pageRhythm: {
  mode: "locked",      // or "hairline"
  snap: true,
  "band-stroke": "visual",
  "hairline-width": "1px",
  "hairline-spacing": "var(--s-section-gap, 0px)",
  "hairline-style": "solid",
}
```

Use `locked` for structural presets (`sigil`, `cobalt`, `kova`, `helix`, `hex`,
industrial systems) where rails and divider bands should align to full
`--s-grid-cell` intervals. Use `hairline` for edgeless/editorial presets where
content should flow naturally and separators are rules instead of bands.

If a visual change affects rhythm, density, divider style, border feel, or page
chrome, update the preset. Do not patch app pages with local spacing maps or
component overrides.

## Deriving a Custom Preset

Use `mergePresets` from `@sigil-ui/tokens` to override specific values without rewriting everything:

```typescript
import { mergePresets } from "@sigil-ui/tokens";
import { sigilPreset } from "@sigil-ui/presets/sigil";

const myPreset = mergePresets(sigilPreset, {
  colors: {
    primary: "oklch(0.60 0.20 150)",        // Change primary to emerald
    "primary-hover": "oklch(0.55 0.22 150)",
  },
  typography: {
    "font-display": "'Geist', system-ui, sans-serif",
  },
  radius: {
    md: "12px",  // Rounder
    lg: "16px",
  },
}, "my-brand");
```

## Preset quality checks

All switchable presets keep body text at 16px or larger, compact text at 14px or larger, and captions at 12px or larger. Text and status colors are checked against the background and all three card surfaces in light and dark mode. Status colors accept `{ light, dark }` values, as primary colors do.

Run `pnpm audit:presets` to verify complete tokens and accurate font metadata, and `pnpm audit:contrast` to check readable text and button states. Decorative border contrast is reported separately as a warning.

After editing a preset, run `pnpm exec tsx scripts/sync-preset-previews.ts` to refresh the catalog, these font tables, and the website's color swatches. The optional `pnpm exec tsx scripts/refine-presets.ts --write` authoring tool adjusts lightness and minimum type sizes in the source files; it never modifies presets at runtime.

## For AI Agents

When building UI in a Sigil project:

1. **Check the active preset first** — read `sigil.config.ts` for the preset name, then understand its mood and aesthetic
2. **To change the look, edit the preset or token CSS** — do not add Tailwind utility overrides to components
3. **To change the entire aesthetic, switch presets** — `npx @sigil-ui/cli preset <name>`
4. **To make targeted changes, use CSS variable overrides** in the token CSS file:
   ```css
   :root { --s-primary: oklch(0.65 0.18 150); }
   ```
5. **To create a new aesthetic from scratch**, scaffold a custom preset: `npx @sigil-ui/cli preset create`
6. **Never hardcode colors** — use `var(--s-*)` in all styling
7. **For layout feel, update `pageRhythm`, `sections`, `sigil`, and `dividers`** before touching React components
