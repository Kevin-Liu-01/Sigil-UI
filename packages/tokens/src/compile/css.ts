import type {
  ColorTokens,
  ColorValue,
  CssCompileOptions,
  SigilTokens,
  ThemedColor,
  TokenValidationIssue,
} from "../types";
import { SigilTokenValidationError, resolveSigilTokens } from "../validation";
import { isThemedColor } from "./merge";
import {
  convertVarsToRem,
  cssVar,
  emitTokenGroup,
  indent,
} from "./emit";

/**
 * Generates CSS custom property declarations for `:root` (light) and a dark
 * mode selector. Themed colors emit both a light and dark value; static
 * values emit once in `:root`.
 */
export function compileToCss(
  tokens: SigilTokens | Partial<SigilTokens>,
  options: CssCompileOptions = {},
): string {
  const resolution = resolveSigilTokens(tokens, { partial: true });
  const diagnostics: TokenValidationIssue[] = [...resolution.issues];
  const {
    prefix: requestedPrefix = "s",
    includeLight = true,
    includeDark = true,
    selector: requestedSelector = ":root",
    darkSelector: requestedDarkSelector = "[data-theme='dark']",
    validation = "repair",
    onDiagnostic,
  } = options;
  const prefix = /^[a-z][a-z0-9-]*$/i.test(requestedPrefix)
    ? requestedPrefix
    : "s";
  const safeSelector = (value: string) => value.trim().length > 0 && !/[{};\n\r]/.test(value);
  const selector = safeSelector(requestedSelector) ? requestedSelector : ":root";
  const darkSelector = safeSelector(requestedDarkSelector)
    ? requestedDarkSelector
    : "[data-theme='dark']";

  if (prefix !== requestedPrefix) {
    diagnostics.push({
      code: "invalid-string",
      path: "options.prefix",
      message: "CSS variable prefix was unsafe and reset to 's'.",
    });
  }
  if (selector !== requestedSelector) {
    diagnostics.push({
      code: "invalid-string",
      path: "options.selector",
      message: "Light-mode selector was unsafe and reset to ':root'.",
    });
  }
  if (darkSelector !== requestedDarkSelector) {
    diagnostics.push({
      code: "invalid-string",
      path: "options.darkSelector",
      message: "Dark-mode selector was unsafe and reset to the default.",
    });
  }
  if (diagnostics.length > 0) {
    onDiagnostic?.(diagnostics);
    if (validation === "strict") throw new SigilTokenValidationError(diagnostics);
  }

  const resolvedTokens = resolution.tokens;

  const lightVars: string[] = [];
  const darkVars: string[] = [];

  function emitColor(name: string, value: ColorValue | ThemedColor): void {
    if (isThemedColor(value)) {
      lightVars.push(`${cssVar(prefix, name)}: ${value.light};`);
      darkVars.push(`${cssVar(prefix, name)}: ${value.dark};`);
    } else {
      lightVars.push(`${cssVar(prefix, name)}: ${value};`);
    }
  }

  // Colors
  const colors = resolvedTokens.colors;
  for (const [key, value] of Object.entries(colors) as [
    keyof ColorTokens,
    ColorValue | ThemedColor,
  ][]) {
    emitColor(key, value);
  }

  // Typography
  for (const [key, value] of Object.entries(resolvedTokens.typography)) {
    lightVars.push(`${cssVar(prefix, key)}: ${value};`);
  }

  // Spacing scale → --s-space-{value}
  for (const step of resolvedTokens.spacing.scale) {
    lightVars.push(
      `${cssVar(prefix, "space", String(step))}: ${step}${resolvedTokens.spacing.unit};`,
    );
  }

  // Sigil grid
  for (const [key, value] of Object.entries(resolvedTokens.sigil)) {
    if (typeof value === "boolean") {
      lightVars.push(`${cssVar(prefix, key)}: ${value ? "1" : "0"};`);
    } else {
      lightVars.push(`${cssVar(prefix, key)}: ${value};`);
    }
  }

  // Radius
  for (const [key, value] of Object.entries(resolvedTokens.radius)) {
    lightVars.push(`${cssVar(prefix, "radius", key)}: ${value};`);
  }

  // Shadows
  for (const [key, value] of Object.entries(resolvedTokens.shadows)) {
    lightVars.push(`${cssVar(prefix, "shadow", key)}: ${value};`);
  }

  // Motion durations
  for (const [key, value] of Object.entries(resolvedTokens.motion.duration)) {
    lightVars.push(`${cssVar(prefix, "duration", key)}: ${value};`);
  }

  // Motion easings
  for (const [key, value] of Object.entries(resolvedTokens.motion.easing)) {
    lightVars.push(`${cssVar(prefix, "ease", key)}: ${value};`);
  }

  // Borders — widths
  for (const [key, value] of Object.entries(resolvedTokens.borders.width)) {
    lightVars.push(`${cssVar(prefix, "border", key)}: ${value};`);
  }
  // Borders — style + per-component
  if (resolvedTokens.borders.style) lightVars.push(`${cssVar(prefix, "border-style")}: ${resolvedTokens.borders.style};`);
  if (resolvedTokens.borders["card-border"]) lightVars.push(`${cssVar(prefix, "card-border")}: ${resolvedTokens.borders["card-border"]};`);
  if (resolvedTokens.borders["card-border-hover"]) lightVars.push(`${cssVar(prefix, "card-border-hover")}: ${resolvedTokens.borders["card-border-hover"]};`);
  if (resolvedTokens.borders["button-border"]) lightVars.push(`${cssVar(prefix, "button-border")}: ${resolvedTokens.borders["button-border"]};`);
  if (resolvedTokens.borders["input-border"]) lightVars.push(`${cssVar(prefix, "input-border")}: ${resolvedTokens.borders["input-border"]};`);
  if (resolvedTokens.borders["divider-style"]) lightVars.push(`${cssVar(prefix, "divider-style")}: ${resolvedTokens.borders["divider-style"]};`);
  if (resolvedTokens.borders["divider-width"]) lightVars.push(`${cssVar(prefix, "divider-width")}: ${resolvedTokens.borders["divider-width"]};`);

  // Buttons
  if (resolvedTokens.buttons) {
    for (const [key, value] of Object.entries(resolvedTokens.buttons)) {
      lightVars.push(`${cssVar(prefix, "button", key)}: ${value};`);
    }

    const hoverEffect = resolvedTokens.buttons["hover-effect"];
    const hoverTransform = hoverEffect === "lift"
      ? `translateY(calc(-1 * var(${cssVar(prefix, "hover-lift")}, 2px)))`
      : "none";
    const hoverFilter = hoverEffect === "darken" || hoverEffect === "fill"
      ? "brightness(0.92)"
      : "none";
    const hoverShadow = hoverEffect === "glow"
      ? `var(${cssVar(prefix, "shadow", "glow")}, var(${cssVar(prefix, "shadow", "button-hover")}, none))`
      : hoverEffect === "outline"
        ? `0 0 0 var(${cssVar(prefix, "border", "thin")}, 1px) var(${cssVar(prefix, "primary")})`
        : `var(${cssVar(prefix, "shadow", "button-hover")}, var(${cssVar(prefix, "shadow", "button")}, none))`;
    lightVars.push(`${cssVar(prefix, "button", "hover-transform")}: ${hoverTransform};`);
    lightVars.push(`${cssVar(prefix, "button", "hover-filter")}: ${hoverFilter};`);
    lightVars.push(`${cssVar(prefix, "button", "hover-shadow")}: ${hoverShadow};`);
  }

  // Cards
  if (resolvedTokens.cards) {
    for (const [key, value] of Object.entries(resolvedTokens.cards)) {
      if (typeof value === "boolean") {
        lightVars.push(`${cssVar(prefix, "card", key)}: ${value ? "1" : "0"};`);
      } else if (key === "background") {
        const backgroundValue = value === "transparent"
          ? "transparent"
          : value === "elevated"
            ? `var(${cssVar(prefix, "surface-elevated")})`
            : value === "sunken"
              ? `var(${cssVar(prefix, "surface-sunken")})`
              : `var(${cssVar(prefix, "surface")})`;
        lightVars.push(`${cssVar(prefix, "card", key)}: ${backgroundValue};`);
      } else if (key === "shadow") {
        const shadowValue = value === "none"
          ? "none"
          : `var(${cssVar(prefix, "shadow", String(value))})`;
        lightVars.push(`${cssVar(prefix, "card", key)}: ${shadowValue};`);
      } else {
        lightVars.push(`${cssVar(prefix, "card", key)}: ${value};`);
      }
    }

    const hoverEffect = resolvedTokens.cards["hover-effect"];
    const hoverTransform = hoverEffect === "lift"
      ? `translateY(calc(-1 * var(${cssVar(prefix, "hover-lift")}, 2px)))`
      : hoverEffect === "scale"
        ? `scale(var(${cssVar(prefix, "hover-scale")}, 1.02))`
        : "none";
    const hoverShadow = hoverEffect === "glow"
      ? `var(${cssVar(prefix, "shadow", "glow")}, var(${cssVar(prefix, "card", "shadow")}, none))`
      : hoverEffect === "lift"
        ? `var(${cssVar(prefix, "shadow", "md")}, var(${cssVar(prefix, "card", "shadow")}, none))`
        : `var(${cssVar(prefix, "card", "shadow")}, none)`;
    const hoverBorder = hoverEffect === "border"
      ? resolvedTokens.cards["hover-border-color"]
      : `var(${cssVar(prefix, "border")})`;
    lightVars.push(`${cssVar(prefix, "card", "hover-transform")}: ${hoverTransform};`);
    lightVars.push(`${cssVar(prefix, "card", "hover-shadow")}: ${hoverShadow};`);
    lightVars.push(`${cssVar(prefix, "card", "hover-border-color")}: ${hoverBorder};`);
  }

  // Headings
  if (resolvedTokens.headings) {
    for (const [key, value] of Object.entries(resolvedTokens.headings)) {
      lightVars.push(`${cssVar(prefix, "heading", key)}: ${value};`);
    }
  }

  // Navigation
  if (resolvedTokens.navigation) {
    for (const [key, value] of Object.entries(resolvedTokens.navigation)) {
      lightVars.push(`${cssVar(prefix, key)}: ${value};`);
    }
  }

  // Inputs
  if (resolvedTokens.inputs) {
    for (const [key, value] of Object.entries(resolvedTokens.inputs)) {
      lightVars.push(`${cssVar(prefix, "input", key)}: ${value};`);
    }
  }

  // Cursor
  if (resolvedTokens.cursor) {
    for (const [key, value] of Object.entries(resolvedTokens.cursor)) {
      if (value !== undefined) {
        if (typeof value === "boolean") {
          lightVars.push(`${cssVar(prefix, "cursor", key)}: ${value ? "1" : "0"};`);
        } else {
          lightVars.push(`${cssVar(prefix, "cursor", key)}: ${value};`);
        }
      }
    }
  }

  // Scrollbar
  if (resolvedTokens.scrollbar) {
    for (const [key, value] of Object.entries(resolvedTokens.scrollbar)) {
      if (value !== undefined) {
        lightVars.push(`${cssVar(prefix, "scrollbar", key)}: ${value};`);
      }
    }
  }

  // Code
  if (resolvedTokens.code) {
    for (const [key, value] of Object.entries(resolvedTokens.code)) {
      lightVars.push(`${cssVar(prefix, "code", key)}: ${value};`);
    }
  }

  // Backgrounds
  if (resolvedTokens.backgrounds) {
    for (const [key, value] of Object.entries(resolvedTokens.backgrounds)) {
      if (typeof value === "boolean") {
        lightVars.push(`${cssVar(prefix, "bg", key)}: ${value ? "1" : "0"};`);
      } else {
        lightVars.push(`${cssVar(prefix, "bg", key)}: ${value};`);
      }
    }
  }

  // Spacing — non-scale fields
  for (const [key, value] of Object.entries(resolvedTokens.spacing)) {
    if (key === "scale" || key === "unit") continue;
    lightVars.push(`${cssVar(prefix, key)}: ${value};`);
  }

  // Motion — non-duration/easing fields
  for (const [key, value] of Object.entries(resolvedTokens.motion)) {
    if (key === "duration" || key === "easing") continue;
    if (value !== undefined) lightVars.push(`${cssVar(prefix, key)}: ${value};`);
  }

  // Layout
  if (resolvedTokens.layout) {
    for (const [key, value] of Object.entries(resolvedTokens.layout)) {
      lightVars.push(`${cssVar(prefix, key)}: ${value};`);
    }
  }

  // Alignment
  if (resolvedTokens.alignment) {
    for (const [key, value] of Object.entries(resolvedTokens.alignment)) {
      if (value !== undefined) {
        if (typeof value === "boolean") {
          lightVars.push(`${cssVar(prefix, "align", key)}: ${value ? "1" : "0"};`);
        } else {
          lightVars.push(`${cssVar(prefix, "align", key)}: ${value};`);
        }
      }
    }
  }

  // Sections
  if (resolvedTokens.sections) {
    for (const [key, value] of Object.entries(resolvedTokens.sections)) {
      if (value !== undefined) {
        if (typeof value === "boolean") {
          lightVars.push(`${cssVar(prefix, "section", key)}: ${value ? "1" : "0"};`);
        } else {
          lightVars.push(`${cssVar(prefix, "section", key)}: ${value};`);
        }
      }
    }
  }

  // Dividers
  if (resolvedTokens.dividers) {
    for (const [key, value] of Object.entries(resolvedTokens.dividers)) {
      if (value !== undefined) {
        if (typeof value === "boolean") {
          lightVars.push(`${cssVar(prefix, "divider", key)}: ${value ? "1" : "0"};`);
        } else {
          lightVars.push(`${cssVar(prefix, "divider", key)}: ${value};`);
        }
      }
    }
  }

  // Grid visuals
  if (resolvedTokens.gridVisuals) {
    for (const [key, value] of Object.entries(resolvedTokens.gridVisuals)) {
      if (value !== undefined) {
        if (typeof value === "boolean") {
          lightVars.push(`${cssVar(prefix, "grid", key)}: ${value ? "1" : "0"};`);
        } else {
          lightVars.push(`${cssVar(prefix, "grid", key)}: ${value};`);
        }
      }
    }
    const cellBackground = resolvedTokens.gridVisuals["cell-background"];
    const cellBackgroundValue = cellBackground === "surface"
      ? `var(${cssVar(prefix, "surface")})`
      : cellBackground === "alternate"
        ? `var(${cssVar(prefix, "surface-elevated")})`
        : "transparent";
    lightVars.push(`${cssVar(prefix, "grid", "cell-background-color")}: ${cellBackgroundValue};`);
  }

  emitTokenGroup(lightVars, prefix, "focus", resolvedTokens.focus);
  emitTokenGroup(lightVars, prefix, "overlay", resolvedTokens.overlays);
  emitTokenGroup(lightVars, prefix, "chart", resolvedTokens.dataViz);
  emitTokenGroup(lightVars, prefix, "media", resolvedTokens.media);
  emitTokenGroup(lightVars, prefix, "control", resolvedTokens.controls);
  emitTokenGroup(lightVars, prefix, "component-surface", resolvedTokens.componentSurfaces);

  emitTokenGroup(lightVars, prefix, "hero", resolvedTokens.hero);
  if (resolvedTokens.hero) {
    const layout = resolvedTokens.hero.layout;
    const heroColumns = layout === "split"
      ? `minmax(0, var(${cssVar(prefix, "hero", "content-basis")}, 1fr)) minmax(0, var(${cssVar(prefix, "hero", "media-width")}, 1fr))`
      : layout === "asymmetric"
        ? "minmax(0, 0.8fr) minmax(0, 1.2fr)"
        : "minmax(0, 1fr)";
    lightVars.push(`${cssVar(prefix, "hero", "grid-columns")}: ${heroColumns};`);
    lightVars.push(`${cssVar(prefix, "hero", "content-justify-self")}: ${layout === "centered" ? "center" : "stretch"};`);
  }

  emitTokenGroup(lightVars, prefix, "cta", resolvedTokens.cta);
  if (resolvedTokens.cta) {
    const split = resolvedTokens.cta.layout === "split";
    lightVars.push(`${cssVar(prefix, "cta", "grid-columns")}: ${split ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)"};`);
    lightVars.push(`${cssVar(prefix, "cta", "text-align")}: ${split ? "left" : "center"};`);
    lightVars.push(`${cssVar(prefix, "cta", "actions-justify")}: ${split ? "flex-start" : "center"};`);
    lightVars.push(`${cssVar(prefix, "cta", "description-margin-inline")}: ${split ? "0" : "auto"};`);
  }
  emitTokenGroup(lightVars, prefix, "footer", resolvedTokens.footer);
  emitTokenGroup(lightVars, prefix, "banner", resolvedTokens.banner);
  emitTokenGroup(lightVars, prefix, "rhythm", resolvedTokens.pageRhythm);

  // Convert px → rem for accessibility (spacing, sizing, typography).
  // Borders, shadows, strokes, and timing stay in px.
  const finalLight = convertVarsToRem(lightVars);
  const finalDark = convertVarsToRem(darkVars);

  // Assemble
  const lines: string[] = [];

  if (includeLight) {
    lines.push(`${selector} {`);
    for (const v of finalLight) {
      lines.push(`${indent(1)}${v}`);
    }
    lines.push("}");
  }

  if (includeDark && finalDark.length > 0) {
    lines.push("");
    lines.push(`${darkSelector} {`);
    for (const v of finalDark) {
      lines.push(`${indent(1)}${v}`);
    }
    lines.push("}");
  }

  return lines.join("\n") + "\n";
}

/**
 * Generates opt-in native interaction styling for token-driven scrollbars and
 * the custom cursor host attribute.
 */
export function compileInteractionCss(options: CssCompileOptions = {}): string {
  const { prefix = "s" } = options;
  const p = `--${prefix}`;

  return [
    ".sigil-scrollbar, [data-sigil-scrollbar] {",
    `  scrollbar-width: var(${p}-scrollbar-firefox-width, thin);`,
    `  scrollbar-color: var(${p}-scrollbar-thumb, var(${p}-border)) var(${p}-scrollbar-track, transparent);`,
    `  scrollbar-gutter: var(${p}-scrollbar-gutter, auto);`,
    "}",
    "",
    ".sigil-scrollbar::-webkit-scrollbar, [data-sigil-scrollbar]::-webkit-scrollbar {",
    `  width: var(${p}-scrollbar-width, 10px);`,
    `  height: var(${p}-scrollbar-height, 10px);`,
    "}",
    "",
    ".sigil-scrollbar::-webkit-scrollbar-track, [data-sigil-scrollbar]::-webkit-scrollbar-track {",
    `  background: var(${p}-scrollbar-track, transparent);`,
    `  border-radius: var(${p}-scrollbar-radius, var(${p}-radius-full));`,
    "}",
    "",
    ".sigil-scrollbar::-webkit-scrollbar-thumb, [data-sigil-scrollbar]::-webkit-scrollbar-thumb {",
    `  background: var(${p}-scrollbar-thumb, var(${p}-border));`,
    `  border: var(${p}-scrollbar-padding, 2px) solid var(${p}-scrollbar-track, transparent);`,
    `  border-radius: var(${p}-scrollbar-radius, var(${p}-radius-full));`,
    "  background-clip: padding-box;",
    "}",
    "",
    ".sigil-scrollbar::-webkit-scrollbar-thumb:hover, [data-sigil-scrollbar]::-webkit-scrollbar-thumb:hover {",
    `  background: var(${p}-scrollbar-thumb-hover, var(${p}-border-strong));`,
    "  background-clip: padding-box;",
    "}",
    "",
    ".sigil-scrollbar::-webkit-scrollbar-thumb:active, [data-sigil-scrollbar]::-webkit-scrollbar-thumb:active {",
    `  background: var(${p}-scrollbar-thumb-active, var(${p}-primary));`,
    "  background-clip: padding-box;",
    "}",
    "",
    ".sigil-scrollbar::-webkit-scrollbar-corner, [data-sigil-scrollbar]::-webkit-scrollbar-corner {",
    `  background: var(${p}-scrollbar-corner, transparent);`,
    "}",
    "",
    ".sigil-scrollbar-hidden, [data-sigil-scrollbar='hidden'] {",
    "  scrollbar-width: none;",
    "}",
    "",
    ".sigil-scrollbar-hidden::-webkit-scrollbar, [data-sigil-scrollbar='hidden']::-webkit-scrollbar {",
    "  display: none;",
    "}",
    "",
    "[data-sigil-cursor='custom'], [data-sigil-cursor='custom'] * {",
    "  cursor: none !important;",
    "}",
    "",
  ].join("\n");
}
