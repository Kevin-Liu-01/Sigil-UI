/**
 * Sigil UI — Complete Design Token Type System
 *
 * A preset controls EVERYTHING about a website's visual identity:
 * colors, typography, spacing, layout, buttons, cards, navigation,
 * backgrounds, code blocks, headings, and motion.
 */

export const TokenLayer = {
  Primitive: "primitive",
  Semantic: "semantic",
  Component: "component",
} as const;

export type TokenLayer = (typeof TokenLayer)[keyof typeof TokenLayer];

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type ColorValue = string;

export type ThemedColor = {
  readonly light: ColorValue;
  readonly dark: ColorValue;
};

// ---------------------------------------------------------------------------
// Color tokens
// ---------------------------------------------------------------------------

export type ColorTokens = {
  readonly background: ThemedColor;
  readonly surface: ThemedColor;
  readonly "surface-elevated": ThemedColor;
  readonly "surface-sunken"?: ThemedColor;

  readonly primary: ColorValue | ThemedColor;
  readonly "primary-hover": ColorValue | ThemedColor;
  readonly "primary-muted": ColorValue | ThemedColor;
  readonly "primary-contrast"?: ColorValue | ThemedColor;
  readonly secondary: ColorValue | ThemedColor;
  readonly "secondary-hover"?: ColorValue | ThemedColor;
  readonly "secondary-muted"?: ColorValue | ThemedColor;
  readonly accent?: ColorValue | ThemedColor;
  readonly "accent-hover"?: ColorValue | ThemedColor;
  readonly "accent-muted"?: ColorValue | ThemedColor;

  readonly text: ThemedColor;
  readonly "text-secondary": ThemedColor;
  readonly "text-muted": ThemedColor;
  readonly "text-subtle": ThemedColor;
  readonly "text-disabled": ThemedColor;
  readonly "text-inverse"?: ThemedColor;

  readonly border: ThemedColor;
  readonly "border-muted": ThemedColor;
  readonly "border-strong": ThemedColor;
  readonly "border-interactive": ThemedColor;

  readonly success: ColorValue | ThemedColor;
  readonly "success-muted"?: ColorValue | ThemedColor;
  readonly warning: ColorValue | ThemedColor;
  readonly "warning-muted"?: ColorValue | ThemedColor;
  readonly error: ColorValue | ThemedColor;
  readonly "error-muted"?: ColorValue | ThemedColor;
  readonly info: ColorValue | ThemedColor;
  readonly "info-muted"?: ColorValue | ThemedColor;

  readonly "gradient-start"?: ColorValue | ThemedColor;
  readonly "gradient-end"?: ColorValue | ThemedColor;
  readonly glow?: ColorValue | ThemedColor;
  readonly highlight?: ColorValue | ThemedColor;
};

// ---------------------------------------------------------------------------
// Typography tokens
// ---------------------------------------------------------------------------

export type TypographyTokens = {
  readonly "font-display": string;
  readonly "font-body": string;
  readonly "font-mono": string;

  readonly "size-xs"?: string;
  readonly "size-sm"?: string;
  readonly "size-base"?: string;
  readonly "size-lg"?: string;
  readonly "size-xl"?: string;
  readonly "size-2xl"?: string;
  readonly "size-3xl"?: string;
  readonly "size-4xl"?: string;
  readonly "size-5xl"?: string;
  readonly "size-6xl"?: string;

  readonly "weight-normal"?: string;
  readonly "weight-medium"?: string;
  readonly "weight-semibold"?: string;
  readonly "weight-bold"?: string;
  readonly "weight-extrabold"?: string;

  readonly "leading-tight"?: string;
  readonly "leading-normal"?: string;
  readonly "leading-relaxed"?: string;
  readonly "leading-loose"?: string;

  readonly "tracking-tighter"?: string;
  readonly "tracking-tight"?: string;
  readonly "tracking-normal"?: string;
  readonly "tracking-wide"?: string;
  readonly "tracking-wider"?: string;

  readonly "heading-weight"?: string;
  readonly "heading-tracking"?: string;
  readonly "heading-transform"?: "none" | "uppercase" | "capitalize" | "lowercase";
  readonly "heading-family"?: string;
};

// ---------------------------------------------------------------------------
// Spacing tokens
// ---------------------------------------------------------------------------

export type SpacingScale = readonly number[];

export type SpacingTokens = {
  readonly scale: SpacingScale;
  readonly unit: "px" | "rem";

  readonly "button-px"?: string;
  readonly "button-py"?: string;
  readonly "button-px-sm"?: string;
  readonly "button-py-sm"?: string;
  readonly "button-px-lg"?: string;
  readonly "button-py-lg"?: string;

  readonly "card-padding"?: string;
  readonly "card-padding-sm"?: string;
  readonly "card-padding-lg"?: string;

  readonly "input-px"?: string;
  readonly "input-py"?: string;

  readonly "badge-px"?: string;
  readonly "badge-py"?: string;

  readonly "section-py"?: string;
  readonly "section-py-lg"?: string;

  readonly "navbar-height"?: string;
  readonly "navbar-px"?: string;

  readonly "footer-py"?: string;

  readonly "modal-padding"?: string;
  readonly "popover-padding"?: string;
  readonly "tooltip-padding"?: string;

  readonly "table-cell-px"?: string;
  readonly "table-cell-py"?: string;
};

// ---------------------------------------------------------------------------
// Layout tokens
// ---------------------------------------------------------------------------

export type LayoutTokens = {
  readonly "content-max": string;
  readonly "content-max-narrow": string;
  readonly "content-max-wide": string;

  readonly "page-margin": string;
  readonly "page-margin-sm": string;
  readonly "page-margin-lg": string;

  readonly gutter: string;
  readonly "gutter-sm": string;
  readonly "gutter-lg": string;

  readonly "grid-columns": string;
  readonly "grid-gap": string;

  readonly "bento-gap": string;
  readonly "bento-radius": string;
  readonly "bento-min-height": string;

  readonly "section-gap": string;

  readonly "sidebar-width": string;
  readonly "sidebar-collapsed": string;

  readonly "footer-columns": string;

  readonly "stack-gap": string;
  readonly "stack-gap-sm": string;
  readonly "stack-gap-lg": string;

  readonly "prose-max": string;
};

// ---------------------------------------------------------------------------
// Sigil grid tokens (structural-visibility system)
// ---------------------------------------------------------------------------

export type GutterPattern =
  | "grid"
  | "dots"
  | "crosshatch"
  | "diagonal"
  | "diamond"
  | "horizontal"
  | "horizontal-thin"
  | "horizontal-fine"
  | "horizontal-wide"
  | "hexagon"
  | "triangle"
  | "zigzag"
  | "checker"
  | "plus"
  | "brick"
  | "wave"
  | "none";

export type SigilGridTokens = {
  readonly "grid-cell": string;
  readonly "cross-arm": string;
  readonly "cross-stroke": string;
  readonly "rail-gap": string;
  readonly "card-radius": string;
  readonly "gutter-pattern"?: GutterPattern;
  readonly "margin-pattern"?: GutterPattern;
  readonly "gutter-border"?: string;
  readonly "margin-border"?: string;
  readonly "gutter-visible"?: boolean;
  /**
   * Outer height of a structural horizontal band (navbar inner row, release
   * banner) that occupies exactly one `grid-cell` of vertical space.
   *
   * **Rule of thumb: `band-height = grid-cell` (no `+ 1px`).**
   *
   * The band has a single 1px border (typically `border-bottom`). With
   * `box-sizing: border-box` and `height = grid-cell`, the band's bottom
   * border lands EXACTLY on the rail grid line for the next cell — i.e.
   * the structural border IS the grid line, not a stripe past it.
   *
   * Stacking two such bands (navbar + banner) yields `2 × grid-cell`, which
   * is also a clean grid multiple. The hero section below then aligns to
   * the rail by construction.
   *
   * Components MUST use `var(--s-band-height)` directly. NEVER write
   * `var(--s-grid-cell)` or `+ 1px`/`- 1px` adjustments inside
   * a component — the calculation lives in the preset.
   */
  readonly "band-height"?: string;
  /**
   * Legacy optional override for divider band height (px/rem). Prefer
   * leaving this unset: `<Divider>` derives outer thickness from
   * `calc(N × var(--s-grid-cell))` with `border-box` borders inside the
   * band so the stack stays phase-locked to the rail grid across zoom and
   * root font-size changes.
   */
  readonly "divider-thickness-sm"?: string;
  /** @see divider-thickness-sm */
  readonly "divider-thickness-md"?: string;
  /** @see divider-thickness-sm */
  readonly "divider-thickness-lg"?: string;
  /** @see divider-thickness-sm */
  readonly "divider-thickness-xl"?: string;
};

// ---------------------------------------------------------------------------
// Radius tokens
// ---------------------------------------------------------------------------

export type RadiusTokens = {
  readonly none: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly "2xl": string;
  readonly full: string;

  readonly button?: string;
  readonly card?: string;
  readonly input?: string;
  readonly badge?: string;
  readonly modal?: string;
  readonly popover?: string;
  readonly tooltip?: string;
  readonly image?: string;
  readonly bento?: string;
};

// ---------------------------------------------------------------------------
// Shadow tokens
// ---------------------------------------------------------------------------

export type ShadowTokens = {
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly "2xl"?: string;
  readonly glow?: string;
  readonly "glow-sm"?: string;
  readonly colored?: string;
  readonly inner?: string;
  readonly card?: string;
  readonly button?: string;
  readonly "button-hover"?: string;
  readonly dropdown?: string;
  readonly modal?: string;
};

// ---------------------------------------------------------------------------
// Motion tokens
// ---------------------------------------------------------------------------

export type MotionDurations = {
  readonly instant: string;
  readonly fast: string;
  readonly normal: string;
  readonly slow: string;
  readonly slower: string;
  readonly slowest?: string;
};

export type MotionEasings = {
  readonly default: string;
  readonly in: string;
  readonly out: string;
  readonly "in-out": string;
  readonly spring: string;
  readonly bounce?: string;
};

export type MotionTokens = {
  readonly duration: MotionDurations;
  readonly easing: MotionEasings;
  readonly "enter-preset"?: string;
  readonly "exit-preset"?: string;
  readonly "hover-scale"?: string;
  readonly "press-scale"?: string;
  readonly "hover-lift"?: string;
  readonly "stagger-interval"?: string;
  readonly "stagger-interval-fast"?: string;
};

// ---------------------------------------------------------------------------
// Border tokens
// ---------------------------------------------------------------------------

export type BorderTokens = {
  readonly width: {
    readonly none: string;
    readonly thin: string;
    readonly medium: string;
    readonly thick: string;
  };
  readonly style?: "solid" | "dashed" | "dotted" | "double" | "none";
  readonly "card-border"?: string;
  readonly "card-border-hover"?: string;
  readonly "button-border"?: string;
  readonly "input-border"?: string;
  readonly "divider-style"?: "solid" | "dashed" | "dotted";
  readonly "divider-width"?: string;
};

// ---------------------------------------------------------------------------
// Button tokens
// ---------------------------------------------------------------------------

export type ButtonTokens = {
  readonly "font-weight": string;
  readonly "text-transform": "none" | "uppercase" | "capitalize" | "lowercase";
  readonly "letter-spacing": string;
  readonly "font-family": string;
  readonly "border-width": string;
  readonly "hover-effect": "glow" | "lift" | "darken" | "outline" | "fill" | "none";
  readonly "active-scale": string;
  readonly "icon-gap": string;
  readonly "min-width": string;
};

// ---------------------------------------------------------------------------
// Card tokens
// ---------------------------------------------------------------------------

export type CardTokens = {
  readonly "border-style": "solid" | "dashed" | "dotted" | "none";
  readonly "border-width": string;
  readonly "hover-effect": "lift" | "glow" | "border" | "scale" | "none";
  readonly "hover-border-color": string;
  readonly padding: string;
  readonly "header-padding": string;
  readonly "footer-padding": string;
  readonly "title-size": string;
  readonly "title-weight": string;
  readonly "description-size": string;
  readonly "background"?: "surface" | "transparent" | "elevated" | "sunken";
  readonly "shadow"?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  readonly "outline"?: boolean;
  readonly "outline-on-hover-only"?: boolean;
  readonly "gap-between"?: string;
  readonly "aspect-ratio"?: "auto" | "1/1" | "4/3" | "16/9";
  readonly "content-padding-x"?: string;
  readonly "content-padding-y"?: string;
};

// ---------------------------------------------------------------------------
// Heading tokens
// ---------------------------------------------------------------------------

export type HeadingTokens = {
  readonly "h1-size": string;
  readonly "h1-weight": string;
  readonly "h1-tracking": string;
  readonly "h1-leading": string;
  readonly "h2-size": string;
  readonly "h2-weight": string;
  readonly "h2-tracking": string;
  readonly "h2-leading"?: string;
  readonly "h3-size": string;
  readonly "h3-weight": string;
  readonly "h3-tracking"?: string;
  readonly "h3-leading"?: string;
  readonly "h4-size": string;
  readonly "h4-weight": string;
  readonly "h4-tracking"?: string;
  readonly "h4-leading"?: string;
  readonly "display-size": string;
  readonly "display-weight": string;
  readonly "display-tracking": string;
  readonly "display-leading": string;
};

// ---------------------------------------------------------------------------
// Navigation tokens
// ---------------------------------------------------------------------------

export type NavigationTokens = {
  readonly "navbar-height": string;
  readonly "navbar-backdrop-blur": string;
  readonly "navbar-border": string;
  readonly "navbar-bg-opacity": string;
  readonly "navbar-padding-x"?: string;
  readonly "navbar-position"?: "sticky" | "fixed" | "static";
  readonly "navbar-logo-height"?: string;
  readonly "navbar-logo-gap"?: string;
  readonly "navbar-item-gap"?: string;
  readonly "navbar-item-padding-x"?: string;
  readonly "navbar-item-padding-y"?: string;
  readonly "navbar-item-size"?: string;
  readonly "navbar-cta-variant"?: "primary" | "secondary" | "ghost";
  readonly "navbar-shadow"?: string;
  readonly "navbar-height-scrolled"?: string;
  readonly "navbar-mobile-breakpoint"?: string;
  readonly "nav-link-weight": string;
  readonly "nav-link-size": string;
  readonly "nav-link-hover": "underline" | "color" | "background" | "none";
  readonly "breadcrumb-separator": string;
  readonly "pagination-radius": string;
  readonly "sidebar-width": string;
  readonly "sidebar-item-radius": string;
  readonly "sidebar-item-padding": string;
};

// ---------------------------------------------------------------------------
// Background / decoration tokens
// ---------------------------------------------------------------------------

export type BackgroundTokens = {
  readonly pattern: "none" | "dots" | "grid" | "crosshatch" | "diagonal" | "diamond" | "hexagon" | "triangle" | "zigzag" | "checker" | "plus" | "brick" | "wave";
  readonly "pattern-opacity": string;
  readonly "pattern-scale": string;
  readonly noise: boolean;
  readonly "noise-opacity": string;
  readonly "gradient-angle": string;
  readonly "gradient-type": "none" | "linear" | "radial" | "conic";
  readonly "hero-pattern": "none" | "grid" | "radial-glow" | "gradient" | "noise" | "crosshatch";
  readonly "section-divider": "none" | "line" | "diagonal" | "wave" | "zigzag";
};

// ---------------------------------------------------------------------------
// Code block tokens
// ---------------------------------------------------------------------------

export type CodeTokens = {
  readonly "font-family": string;
  readonly "font-size": string;
  readonly "line-height": string;
  readonly "bg": string;
  readonly "border": string;
  readonly "border-radius": string;
  readonly padding: string;
  readonly "tab-size": string;
  readonly "selection-bg": string;
  readonly "comment-color": string;
  readonly "keyword-color": string;
  readonly "string-color": string;
  readonly "number-color": string;
  readonly "function-color": string;
};

// ---------------------------------------------------------------------------
// Input / form tokens
// ---------------------------------------------------------------------------

export type InputTokens = {
  readonly height: string;
  readonly "height-sm": string;
  readonly "height-lg": string;
  readonly "border-width": string;
  readonly "focus-ring-width": string;
  readonly "focus-ring-color": string;
  readonly "focus-ring-offset": string;
  readonly "placeholder-color": string;
  readonly "error-border-color": string;
  readonly "label-size": string;
  readonly "label-weight": string;
  readonly "label-spacing": string;
  readonly "helper-size": string;
};

// ---------------------------------------------------------------------------
// Cursor tokens — opt-in custom pointer system
// ---------------------------------------------------------------------------

export type CursorVariant = "sigil" | "ring" | "dot" | "crosshair";

export type CursorTokens = {
  readonly variant?: CursorVariant;
  readonly size?: string;
  readonly "dot-size"?: string;
  readonly "stroke-width"?: string;
  readonly "tick-size"?: string;
  readonly gap?: string;
  readonly radius?: string;
  readonly color?: string;
  readonly "ring-color"?: string;
  readonly "dot-color"?: string;
  readonly glow?: string;
  readonly opacity?: string;
  readonly "blend-mode"?: string;
  readonly "z-index"?: string;
  readonly "hide-native"?: boolean;
};

// ---------------------------------------------------------------------------
// Scrollbar tokens — native and Radix ScrollArea styling
// ---------------------------------------------------------------------------

export type ScrollbarVisibility = "auto" | "stable" | "hidden";

export type ScrollbarTokens = {
  readonly width?: string;
  readonly height?: string;
  readonly padding?: string;
  readonly radius?: string;
  readonly track?: string;
  readonly thumb?: string;
  readonly "thumb-hover"?: string;
  readonly "thumb-active"?: string;
  readonly corner?: string;
  readonly border?: string;
  readonly "firefox-width"?: "auto" | "thin" | "none";
  readonly gutter?: "auto" | "stable" | "stable both-edges";
  readonly visibility?: ScrollbarVisibility;
};

// ---------------------------------------------------------------------------
// Alignment rail tokens — unified grid system for page-level alignment
// ---------------------------------------------------------------------------

export type AlignmentTokens = {
  readonly "rail-width"?: string;
  readonly "rail-columns"?: string;
  readonly "rail-gutter"?: string;
  readonly "rail-margin"?: string;
  readonly "rail-visible"?: boolean;
  readonly "rail-color"?: string;
  readonly "content-align"?: "center" | "left" | "wide";
  readonly "hero-align"?: "center" | "left" | "full-bleed";
  readonly "section-align"?: "center" | "left" | "inset";
  readonly "navbar-align"?: "full" | "content" | "inset";
  readonly "footer-align"?: "full" | "content" | "inset";
  readonly "title-align"?: "left" | "center";
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// Section tokens — per-section layout control
// ---------------------------------------------------------------------------

export type SectionStyleTokens = {
  readonly "padding-y"?: string;
  readonly "padding-y-sm"?: string;
  readonly "padding-y-hero"?: string;
  readonly "padding-y-lg"?: string;
  readonly "padding-y-xl"?: string;
  readonly "padding-x"?: string;
  readonly "max-width"?: string;
  readonly "gap"?: string;
  readonly "title-align"?: "left" | "center";
  readonly "heading-size"?: string;
  readonly "heading-align"?: "left" | "center";
  readonly "heading-max-width"?: string;
  readonly "heading-margin-bottom"?: string;
  /** Space below the whole section title stack (label + heading + description). Snap: multiples of `--s-grid-cell`. */
  readonly "header-block-margin-bottom"?: string;
  /** Space below the mono label row before the heading. Often `calc(var(--s-grid-cell) / 3)` for ~1rem at G=48px. */
  readonly "label-row-margin-bottom"?: string;
  /** Gap between major blocks inside a section (replaces ad-hoc `mt-20`). Typically `calc(2 * var(--s-grid-cell))`. */
  readonly "subsection-gap"?: string;
  readonly "description-max-width"?: string;
  readonly "description-gap"?: string;
  readonly "content-gap"?: string;
  readonly "grid-columns"?: string;
  readonly "grid-gap"?: string;
  readonly "alternate-bg"?: string;
  readonly "alternate-bg-mode"?: "none" | "surface" | "sunken" | "elevated";
  readonly "divider-above"?: boolean;
  readonly "divider-below"?: boolean;
  readonly "background-alt"?: boolean;
  readonly "indent"?: string;
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// Divider tokens — structural line appearance
// ---------------------------------------------------------------------------

export type DividerStyleTokens = {
  readonly "style"?: "solid" | "dashed" | "dotted" | "double" | "groove" | "none";
  readonly "width"?: string;
  readonly "color"?: string;
  readonly "spacing"?: string;
  readonly "opacity"?: string;
  readonly "max-width"?: string;
  readonly "margin-y"?: string;
  readonly "thickness"?: string;
  readonly "gradient-start"?: string;
  readonly "gradient-end"?: string;
  readonly "show-cross"?: boolean;
  readonly "show-label"?: boolean;
  readonly "full-bleed"?: boolean;
  readonly "background-alt"?: boolean;
  readonly "ornament"?: "none" | "cross" | "dot" | "diamond" | "dash";
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// Grid visual tokens — how grids look beyond just layout
// ---------------------------------------------------------------------------

export type GridVisualTokens = {
  readonly "rail-visible"?: boolean;
  readonly "rail-columns"?: string;
  readonly "show-lines"?: boolean;
  readonly "line-color"?: string;
  readonly "line-width"?: string;
  readonly "show-dots"?: boolean;
  readonly "dot-size"?: string;
  readonly "cell-background"?: "none" | "surface" | "alternate";
  readonly "cell-border"?: boolean;
  readonly "cell-radius"?: string;
  readonly "cell-padding"?: string;
  readonly "hover-effect"?: "highlight" | "lift" | "border" | "glow" | "none";
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// Deep component control tokens
// ---------------------------------------------------------------------------

export type FocusTokens = {
  readonly "ring-width"?: string;
  readonly "ring-color"?: string;
  readonly "ring-offset"?: string;
  readonly "ring-shadow"?: string;
  readonly "outline-color"?: string;
  readonly [key: string]: string | undefined;
};

export type OverlayTokens = {
  readonly bg?: string;
  readonly blur?: string;
  readonly surface?: string;
  readonly border?: string;
  readonly shadow?: string;
  readonly radius?: string;
  readonly padding?: string;
  readonly "z-index"?: string;
  readonly [key: string]: string | undefined;
};

export type DataVizTokens = {
  readonly "series-1"?: string;
  readonly "series-2"?: string;
  readonly "series-3"?: string;
  readonly "series-4"?: string;
  readonly "series-5"?: string;
  readonly positive?: string;
  readonly negative?: string;
  readonly neutral?: string;
  readonly grid?: string;
  readonly axis?: string;
  readonly label?: string;
  readonly "tooltip-bg"?: string;
  readonly "tooltip-border"?: string;
  readonly [key: string]: string | undefined;
};

export type MediaTokens = {
  readonly radius?: string;
  readonly border?: string;
  readonly outline?: string;
  readonly shadow?: string;
  readonly bg?: string;
  readonly "object-fit"?: "cover" | "contain" | "fill" | "none" | "scale-down";
  readonly [key: string]: string | undefined;
};

export type ControlTokens = {
  readonly height?: string;
  readonly "height-sm"?: string;
  readonly "height-lg"?: string;
  readonly "hit-area"?: string;
  readonly "icon-size"?: string;
  readonly "handle-size"?: string;
  readonly "track-height"?: string;
  readonly "track-bg"?: string;
  readonly "track-fill"?: string;
  readonly "thumb-bg"?: string;
  readonly "thumb-border"?: string;
  readonly [key: string]: string | undefined;
};

export type ComponentSurfaceTokens = {
  readonly bg?: string;
  readonly "bg-elevated"?: string;
  readonly "bg-muted"?: string;
  readonly border?: string;
  readonly "border-muted"?: string;
  readonly "border-strong"?: string;
  readonly text?: string;
  readonly "text-muted"?: string;
  readonly contrast?: string;
  readonly "hover-bg"?: string;
  readonly "active-bg"?: string;
  readonly "selected-bg"?: string;
  readonly [key: string]: string | undefined;
};

// ---------------------------------------------------------------------------
// Hero tokens — above-the-fold layout control
// ---------------------------------------------------------------------------

export type HeroTokens = {
  readonly "min-height"?: string;
  readonly "padding-y"?: string;
  readonly "padding-y-sm"?: string;
  readonly "padding-x"?: string;
  readonly "content-max"?: string;
  readonly "content-basis"?: string;
  readonly "content-align"?: "center" | "left" | "right";
  readonly "layout"?: "centered" | "split" | "stacked" | "asymmetric";
  readonly "media-position"?: "right" | "left" | "behind" | "below";
  readonly "media-width"?: string;
  readonly "media-radius"?: string;
  readonly "split-gap"?: string;
  readonly "title-size"?: string;
  readonly "title-max-width"?: string;
  readonly "description-size"?: string;
  readonly "description-max-width"?: string;
  readonly "description-gap"?: string;
  readonly "actions-gap"?: string;
  readonly "actions-margin-top"?: string;
  readonly "action-padding-x"?: string;
  readonly "action-padding-y"?: string;
  readonly "badge-gap"?: string;
  readonly "overlay-opacity"?: string;
  readonly "scroll-indicator"?: boolean;
  readonly "gradient-overlay"?: string;
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// CTA tokens — call-to-action section layout
// ---------------------------------------------------------------------------

export type CTATokens = {
  readonly "padding-y"?: string;
  readonly "padding-x"?: string;
  readonly "max-width"?: string;
  readonly "layout"?: "centered" | "split";
  readonly "border"?: boolean;
  readonly "border-radius"?: string;
  readonly "bg"?: string;
  readonly "title-size"?: string;
  readonly "description-max-width"?: string;
  readonly "description-gap"?: string;
  readonly "actions-gap"?: string;
  readonly "actions-margin-top"?: string;
  readonly "action-padding-x"?: string;
  readonly "action-padding-y"?: string;
  readonly "split-gap"?: string;
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// Footer tokens — page footer layout
// ---------------------------------------------------------------------------

export type FooterTokens = {
  readonly "padding-y"?: string;
  readonly "border-top"?: string;
  readonly "columns"?: string;
  readonly "column-gap"?: string;
  readonly "row-gap"?: string;
  readonly "logo-height"?: string;
  readonly "tagline-max-width"?: string;
  readonly "link-size"?: string;
  readonly "link-gap"?: string;
  readonly "group-title-size"?: string;
  readonly "group-title-weight"?: string;
  readonly "social-icon-size"?: string;
  readonly "social-gap"?: string;
  readonly "bottom-bar-padding"?: string;
  readonly "bottom-bar-border"?: string;
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// Banner tokens — announcement bar / banner layout
// ---------------------------------------------------------------------------

export type BannerTokens = {
  readonly "height"?: string;
  readonly "padding-y"?: string;
  readonly "padding-x"?: string;
  readonly "font-size"?: string;
  readonly "font-weight"?: string;
  readonly "icon-size"?: string;
  readonly "icon-gap"?: string;
  readonly "border-width"?: string;
  readonly "border-position"?: "bottom" | "top" | "none";
  readonly "position"?: "top" | "bottom" | "inline";
  readonly "dismiss-size"?: string;
  readonly "radius"?: string;
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// Page rhythm tokens — composition-level page flow
// ---------------------------------------------------------------------------

export type PageRhythmTokens = {
  /**
   * `locked` means page bands snap to full `--s-grid-cell` intervals and
   * structural dividers occupy exact cell multiples. `hairline` means the page
   * can flow freely and dividers are visual rules, not layout bands.
   */
  readonly "mode"?: "locked" | "hairline";
  /** Enable section-bottom snap in locked mode. */
  readonly "snap"?: boolean;
  /** Paint policy for locked band strokes. `visual` avoids border layout drift. */
  readonly "band-stroke"?: "visual" | "border" | "none";
  /** Default thickness for free-flow hairline rules. */
  readonly "hairline-width"?: string;
  /** Default spacing around free-flow hairline rules. */
  readonly "hairline-spacing"?: string;
  /** Default style for free-flow hairline rules. */
  readonly "hairline-style"?: "solid" | "dashed" | "dotted" | "none";
  readonly "density"?: "compact" | "normal" | "spacious" | "editorial";
  readonly "section-gap"?: string;
  readonly "section-gap-sm"?: string;
  readonly "section-gap-lg"?: string;
  readonly "first-section-offset"?: string;
  readonly "last-section-margin"?: string;
  readonly "alternate-bg"?: boolean;
  readonly "alternate-bg-color"?: string;
  readonly "divider-between"?: boolean;
  readonly "max-content-width"?: string;
  readonly "vertical-rhythm-unit"?: string;
  readonly "scroll-snap"?: boolean;
  readonly "responsive-scale"?: string;
  readonly "responsive-breakpoint"?: string;
  readonly [key: string]: string | boolean | undefined;
};

// ---------------------------------------------------------------------------
// Composite token object
// ---------------------------------------------------------------------------

export type SigilTokens = {
  readonly colors: ColorTokens;
  readonly typography: TypographyTokens;
  readonly spacing: SpacingTokens;
  readonly layout: LayoutTokens;
  readonly sigil: SigilGridTokens;
  readonly radius: RadiusTokens;
  readonly shadows: ShadowTokens;
  readonly motion: MotionTokens;
  readonly borders: BorderTokens;
  readonly buttons: ButtonTokens;
  readonly cards: CardTokens;
  readonly headings: HeadingTokens;
  readonly navigation: NavigationTokens;
  readonly backgrounds: BackgroundTokens;
  readonly code: CodeTokens;
  readonly inputs: InputTokens;
  readonly cursor: CursorTokens;
  readonly scrollbar: ScrollbarTokens;
  readonly alignment: AlignmentTokens;
  readonly sections: SectionStyleTokens;
  readonly dividers: DividerStyleTokens;
  readonly gridVisuals: GridVisualTokens;
  readonly focus: FocusTokens;
  readonly overlays: OverlayTokens;
  readonly dataViz: DataVizTokens;
  readonly media: MediaTokens;
  readonly controls: ControlTokens;
  readonly componentSurfaces: ComponentSurfaceTokens;
  readonly hero: HeroTokens;
  readonly cta: CTATokens;
  readonly footer: FooterTokens;
  readonly banner: BannerTokens;
  readonly pageRhythm: PageRhythmTokens;
};

export type MarkdownTokenOverrides = Pick<
  SigilTokens,
  "colors" | "typography" | "spacing" | "sigil" | "radius" | "shadows" | "motion" | "borders"
>;

// ---------------------------------------------------------------------------
// DESIGN.md — unified design reference document
// ---------------------------------------------------------------------------

export type DesignTheme = "light" | "dark" | "adaptive";
export type DesignDensity = "compact" | "balanced" | "editorial";

export type DesignMetadata = {
  readonly brand: string;
  readonly tagline: string;
  readonly theme: DesignTheme;
  readonly preset: string;
  readonly density: DesignDensity;
  readonly description: string;
};

export type DesignComponent = {
  readonly name: string;
  readonly description: string;
};

export type DesignSurface = {
  readonly level: number;
  readonly name: string;
  readonly value: string;
  readonly purpose: string;
};

export type DesignDocument = {
  readonly metadata: DesignMetadata;
  readonly tokens: SigilTokens;
  readonly components: readonly DesignComponent[];
  readonly surfaces: readonly DesignSurface[];
  readonly dos: readonly string[];
  readonly donts: readonly string[];
  readonly imagery: string;
  readonly layout: string;
  readonly similarBrands: readonly string[];
};

// ---------------------------------------------------------------------------
// Preset
// ---------------------------------------------------------------------------

export type PresetMetadata = {
  readonly description: string;
  readonly author?: string;
  readonly version?: string;
  readonly tags?: readonly string[];
  readonly mood?: string;
  readonly inspiration?: string;
};

export type SigilPreset = {
  readonly name: string;
  readonly tokens: SigilTokens;
  readonly metadata: PresetMetadata;
};

// ---------------------------------------------------------------------------
// Compiler options
// ---------------------------------------------------------------------------

export type TokenValidationMode = "repair" | "strict";

export type TokenValidationIssueCode =
  | "invalid-root"
  | "missing-key"
  | "unknown-key"
  | "unsafe-key"
  | "type-mismatch"
  | "invalid-string"
  | "invalid-number"
  | "invalid-scale"
  | "invalid-color"
  | "invalid-patch";

export type TokenValidationIssue = {
  readonly code: TokenValidationIssueCode;
  readonly path: string;
  readonly message: string;
};

export type CssCompileOptions = {
  readonly prefix?: string;
  readonly includeLight?: boolean;
  readonly includeDark?: boolean;
  readonly selector?: string;
  readonly darkSelector?: string;
  /** Repair malformed values with canonical defaults, or throw in strict mode. */
  readonly validation?: TokenValidationMode;
  /** Receives every repaired or rejected input finding. */
  readonly onDiagnostic?: (issues: readonly TokenValidationIssue[]) => void;
};
