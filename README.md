<p align="center">
  <img src=".github/readme-hero.svg" alt="Sigil UI — one file, everything recompiles" width="100%">
</p>

<p align="center">
  <strong>One markdown file controls your entire design system.</strong><br>
  A token-driven React design system where one DESIGN.md defines every color, font, radius, shadow, and animation.<br>
  350+ components. 46 presets. 519 tokens. 33 categories. Compiles to CSS + Tailwind v4.<br>
  Edit the markdown. Everything recompiles. Switch presets for a completely different visual identity.
</p>

<p align="center">
  <a href="MANIFESTO.md"><strong>Read the Manifesto →</strong></a> ·
  <a href="DESIGN.md"><strong>View DESIGN.md →</strong></a>
</p>

---

## The Concept

```
DESIGN.md (human/agent-editable markdown — 519 tokens, 33 categories)
    ↓ sigil design compile
CSS Custom Properties (:root { --s-primary: oklch(0.65 0.15 280); ... })
Tailwind v4 (@theme { --color-primary: var(--s-primary); ... })
W3C Design Tokens (JSON)
    ↓ consumed by
350+ Components (read var(--s-*), never hardcode values)
```

One file at the top. Everything downstream updates.

---

## DESIGN.md Format

Your entire design system lives in a single markdown file. It contains:

- **Brand header** — name, tagline, theme, density, description
- **33 token categories** — colors (OKLCH), typography, spacing, layout, radius, shadows, motion, borders, backgrounds, buttons, cards, headings, navigation, inputs, code, hero, CTA, footer, banner, sections, page rhythm, alignment, dividers, grid visuals, cursor, scrollbar, focus, overlays, data visualization, media, controls, component surfaces
- **Component recipes** — how components consume tokens
- **Do's and Don'ts** — guardrails for agents and humans
- **Compile sections** — auto-generated CSS, Tailwind v4, and W3C JSON output

```bash
# Generate a DESIGN.md from a preset
sigil design generate --preset basalt

# Compile DESIGN.md to output files
sigil design compile

# Update compile sections after editing tokens
sigil design sync

# Extract a DESIGN.md from any URL
sigil design extract https://example.com
```

Browse every preset's DESIGN.md at [sigil.kevinliu.studio/presets](https://sigil.kevinliu.studio/presets).

---

## Quick Start

```bash
# New project
npx create-sigil-app@latest

# Existing project
pnpm dlx @sigil-ui/cli init

# Add components
sigil add button card input dialog

# Switch preset
sigil preset basalt
```

---

## Preset System (46 Presets)

Each preset is a complete 500+ token visual identity. Swap one, and every component updates.

| Category | Presets | Aesthetic |
|----------|---------|-----------|
| Structural | sigil, kova, cobalt, helix, hex | Engineering precision, grids |
| Minimal | crux, axiom, arc, mono | Maximum whitespace, clean |
| Dark | basalt, onyx, fang, obsid, cipher, noir | Deep blacks, cinematic |
| Colorful | flux, shard, prism, vex, dsgn, dusk | Gradients, vibrant |
| Editorial | etch, rune, strata, glyph, mrkr | Typography-forward |
| Industrial | alloy, forge, anvil, rivet, brass | Metallic, utilitarian |
| Edgeless | vast, aura, field, clay, sage, ink, sand, plum, moss, coral, dune, ocean, rose | Atmospheric, organic |

---

## Token System (519 Fields, 33 Categories)

| Category | Fields | Controls |
|----------|--------|----------|
| colors | 36 | Backgrounds, surfaces, text, borders, brand, status |
| typography | 31 | Font stacks, size scale, weight, leading, tracking |
| spacing | 25 | Base scale, component padding, section spacing |
| layout | 22 | Content widths, margins, gutters, grid, bento |
| radius | 16 | Scale (none→full) + per-component radius |
| shadows | 14 | Elevation scale, glow, colored, per-component |
| motion | 19 | Durations, easings, hover/press/stagger presets |
| borders | 11 | Width scale, style, per-component borders |
| buttons | 9 | Weight, transform, hover effect, active scale |
| cards | 18 | Border style, hover effect, padding, sizing |
| headings | 15 | H1–H4 + display sizes, weights, tracking |
| navigation | 24 | Navbar, sidebar, pagination |
| backgrounds | 9 | Patterns, noise, gradients, hero patterns |
| hero | 25 | Min-height, padding, layout, title sizing |
| cta | 15 | Padding, layout, title, actions |
| footer | 15 | Columns, gaps, links, social |
| pageRhythm | 14 | Density, section gaps, scroll snap |
| + 16 more | ... | inputs, code, cursor, scrollbar, alignment, sections, dividers, gridVisuals, focus, overlays, dataViz, media, controls, componentSurfaces, sigil, banner |

All colors use OKLCH. All presets support light + dark themes.

---

## CLI Commands

| Command | Purpose |
|---------|---------|
| `sigil init` | Interactive project setup |
| `sigil convert` | Convert existing project end-to-end |
| `sigil add <name>` | Copy components into your project |
| `sigil preset <name>` | Switch preset (regenerates tokens) |
| `sigil preset create` | Scaffold a custom preset |
| `sigil design generate` | Create DESIGN.md from current preset |
| `sigil design compile` | Parse DESIGN.md → CSS + Tailwind + JSON |
| `sigil design sync` | Update compile sections in-place |
| `sigil design extract <url>` | Extract DESIGN.md from a reference URL |
| `sigil inspire <url>` | Draft token colors from a reference |
| `sigil docs` | Generate local docs + llms.txt |
| `sigil adapter <name>` | Bridge shadcn/Bootstrap/Material variables |
| `sigil diff` | Show token changes since last sync |
| `sigil doctor` | Validate project health |

---

## Context vs Constraints

Reference tools give agents design context — screenshots, patterns, guidelines.
Sigil gives agents design **constraints** — tokens, components, presets.

The difference matters. Agents are good at following structure. They're bad at exercising taste.

```
Reference approach:
┌──────────────────────────────────────────────────┐
│  What agent gets:    DESIGN.md, screenshots,     │
│                      pattern references           │
│  What agent does:    Creates every component      │
│                      from scratch                 │
│  Result:             Same generic output,         │
│                      but with better references   │
└──────────────────────────────────────────────────┘

Sigil:
┌──────────────────────────────────────────────────┐
│  What agent gets:    519 tokens + 350+ components │
│                      + 46 presets + CLI           │
│  What agent does:    Composes pages from          │
│                      constrained parts            │
│  Result:             On-brand by construction     │
└──────────────────────────────────────────────────┘
```

Context tells an agent *what good looks like*. Constraints make it *impossible to produce bad output*. An agent with a reference screenshot still has to implement every button, card, input, and layout from zero — and that's where taste evaporates. With Sigil, those components already exist, already consume the token spec, and already enforce the visual identity. The agent assembles. It doesn't create.

This is the core architectural bet: **integrated design philosophy > reference material**. Tokens + components + presets as a single system, not a markdown file the agent reads and then ignores when it starts writing Tailwind classes.

---

## vs Competitors

| | shadcn/ui | Chakra UI | Radix Themes | Reference tools | **Sigil UI** |
|---|---|---|---|---|---|
| Token count | ~0 | ~40 | ~20 | 0 | **519** |
| Categories | 0 | 5 | 3 | 0 | **33** |
| Presets | 0 | 0 | 0 | 0 | **46** |
| Components | Copy-paste | Runtime | Styled | None (context only) | **350+ token-driven** |
| Color space | Hex/HSL | Hex | Hex | N/A | **OKLCH** |
| Agent interface | None | None | None | Screenshots / MCP | **DESIGN.md + tokens + CLI** |
| What agent builds from | Scratch | Scratch | Scratch | Scratch (with references) | **Pre-built constrained parts** |
| Motion tokens | No | No | No | No | **Yes (19 fields)** |
| Page composition | No | No | No | No | **Yes (hero/CTA/footer/rhythm)** |
| Output formats | — | — | — | — | **CSS + Tailwind + JSON + TS** |

---

## Packages

| Package | Description |
|---------|-------------|
| `@sigil-ui/tokens` | 519 tokens, 33 categories. Compiles to CSS, Tailwind v4, W3C JSON, TypeScript. |
| `@sigil-ui/presets` | 46 curated visual identities. Each preset = 500+ resolved tokens. |
| `@sigil-ui/components` | 350+ token-driven React components. Read from `var(--s-*)`. |
| `@sigil-ui/primitives` | 40+ headless behavior primitives (Radix UI + Base UI). |
| `@sigil-ui/cli` | Full workflow: init, design, preset, add, inspire, docs, doctor. |
| `create-sigil-app` | One-command project scaffolding. |

---

## Repository Structure

```
DESIGN.md                    ← Canonical design reference (this repo's own)
AGENTS.md                    ← Agent instructions for working in this repo
sigil.tokens.md              ← Legacy token overrides (still supported)

packages/
  tokens/                    ← Source of truth: types, defaults, compiler
  presets/                   ← 46 curated preset bundles
  components/                ← 350+ token-driven React components
  primitives/                ← 40+ headless behavior primitives (Radix UI + Base UI)
  cli/                       ← CLI: init, design, preset, add, inspire, doctor
  create-sigil-app/          ← npx create-sigil-app bootstrapper

apps/
  web/                       ← Product site + sandbox
  docs/                      ← Documentation (Fumadocs)
  demos/                     ← 17 demo templates + 7 showcase clones

skills/
  sigil-tokens/              ← Edit/extend tokens
  sigil-preset/              ← Create/modify presets
  sigil-design/              ← Generate/compile DESIGN.md
  sigil-messaging/           ← Copy, positioning, stats source of truth
  sigil-component/           ← Create/modify components
  sigil-layout/              ← Page layout with grid system
  sigil-playbook/            ← Page composition rules
  sigil-migration/           ← Migrate from shadcn/ui
  sigil-polish/              ← Interface polish

style/
  design.md                  ← Motion and animation guide
  ux-principles.md           ← Product UX rules
  style.md                   ← Engineering philosophy
```

---

## Clean Layout API

Sigil layout should read like page structure. Token math, grid snap, divider
stroke placement, and gutter phase alignment live inside the component package.

```tsx
<SigilPage rhythm="locked" chrome="rails">
  <SigilHero>
    <SigilHeroLayout>
      <SigilHeroContent>
        <SigilSectionHeader
          label="Components"
          heading="Browse the full component system."
          description="Sections, dividers, and rails stay aligned automatically."
        />
        <SigilActionRow>
          <AccentCTA>Browse Components</AccentCTA>
          <SigilGhostLink href="/docs">Read Docs</SigilGhostLink>
        </SigilActionRow>
      </SigilHeroContent>
      <SigilHeroMedia>{/* product visual */}</SigilHeroMedia>
    </SigilHeroLayout>
  </SigilHero>
  <SigilDivider />
</SigilPage>
```

Use `rhythm="locked"` for structural pages with full-cell snap. Use
`rhythm="hairline"` with `<Hairline />` for editorial or free-flow layouts.
Application code should not carry local `grid` maps or repeated
`calc(var(--s-grid-cell) / n)` rhythm math.

---

## Agent-First

Sigil is designed for AI agents to use — not just to read, but to operate within.

Other tools give agents context (screenshots, guidelines, reference markdown). Sigil gives agents an **execution surface**: pre-built components that read from tokens, presets that constrain the visual space, and a CLI that validates the result. The agent doesn't need taste. The system has taste. The agent follows the spec.

- **DESIGN.md** — one file, all tokens, readable markdown tables
- **AGENTS.md** — generated instructions for any project
- **Skills** — task-specific knowledge (tokens, presets, components, layout, polish)
- **`sigil docs`** — generates `llms.txt` and project context for agents
- **Token-first principle** — agents edit one file, not hundreds of components
- **Constrained output** — components enforce the token spec; agents can't go off-brand

---

## Auditors

Quality is validated at every layer, not just at the end.

| Auditor | What it checks | When to run |
|---------|---------------|-------------|
| `sigil doctor` | Config, tokens, components, deps, CSS imports, preset validity | After any change |
| `sigil diff` | Token CSS changes since last sync | Before committing |
| **Preset validation** | All 519 fields present, OKLCH validity, spacing scale progression, duration ordering | CI / on preset create |
| **Type-level guarantees** | Every preset satisfies `SigilPreset` via TypeScript `satisfies` | Build time |
| **WCAG contrast audit** | All text/background token combinations meet AA (4.5:1 normal, 3:1 large) | Per-preset |
| **Component conventions** | `forwardRef`, `className`, `var(--s-*)` only, `sigil-` prefix | PR review / lint |
| **Design system rules** | `.cursor/rules/sigil-design-system.mdc` — OKLCH-only, token-only, spacing grid, motion limits | Agent enforcement |

---

## Tech Stack

- React 19 + Next.js 15
- Tailwind CSS v4 (native CSS-first)
- OKLCH color space (perceptual uniformity, wide-gamut)
- Radix UI + Base UI (accessible primitives)
- GSAP + Motion (animation)
- TypeScript 5.8

---

## License

MIT

---

<p align="center">
  <a href="MANIFESTO.md">Manifesto</a> ·
  <a href="DESIGN.md">DESIGN.md</a> ·
  <a href="https://sigil.kevinliu.studio">Website</a> ·
  <a href="https://sigil.kevinliu.studio/docs">Docs</a> ·
  <a href="https://sigil.kevinliu.studio/presets">Presets</a>
</p>
