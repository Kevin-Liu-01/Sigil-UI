import type { SigilTokens } from "../types";
import { resolveSigilTokens } from "../validation";
import { isThemedColor } from "./merge";

type W3CTokenValue = {
  $value: unknown;
  $type: string;
  $description?: string;
};

type W3CGroup = {
  [key: string]: W3CTokenValue | W3CGroup;
};

/**
 * Compiles SigilTokens to W3C Design Tokens Community Group JSON format.
 * Follows the spec at https://design-tokens.github.io/community-group/format/
 */
export function compileToW3CJson(
  tokens: SigilTokens | Partial<SigilTokens>,
): string {
  const resolved = resolveSigilTokens(tokens, { partial: true }).tokens;
  const output: W3CGroup = {};

  // Colors
  const colorGroup: W3CGroup = {};
  for (const [key, value] of Object.entries(resolved.colors)) {
    if (isThemedColor(value)) {
      colorGroup[key] = {
        $value: { light: value.light, dark: value.dark },
        $type: "color",
        $description: `Color token: ${key}`,
      };
    } else if (value !== undefined) {
      colorGroup[key] = {
        $value: value,
        $type: "color",
        $description: `Color token: ${key}`,
      };
    }
  }
  output.color = colorGroup;

  // Typography
  const fontGroup: W3CGroup = {};
  for (const [key, value] of Object.entries(resolved.typography)) {
    if (value !== undefined) {
      const type = key.startsWith("font-") ? "fontFamily"
        : key.startsWith("size-") ? "dimension"
        : key.startsWith("weight-") ? "number"
        : key.startsWith("leading-") ? "number"
        : key.startsWith("tracking-") ? "dimension"
        : "string";
      fontGroup[key] = { $value: value, $type: type };
    }
  }
  output.typography = fontGroup;

  // Spacing
  const spacingGroup: W3CGroup = {};
  for (const step of resolved.spacing.scale) {
    spacingGroup[`${step}`] = {
      $value: `${step}${resolved.spacing.unit}`,
      $type: "dimension",
    };
  }
  output.spacing = spacingGroup;

  // Radius
  const radiusGroup: W3CGroup = {};
  for (const [key, value] of Object.entries(resolved.radius)) {
    if (value !== undefined) {
      radiusGroup[key] = { $value: value, $type: "dimension" };
    }
  }
  output.radius = radiusGroup;

  // Shadows
  const shadowGroup: W3CGroup = {};
  for (const [key, value] of Object.entries(resolved.shadows)) {
    if (value !== undefined) {
      shadowGroup[key] = { $value: value, $type: "shadow" };
    }
  }
  output.shadow = shadowGroup;

  // Motion
  const motionGroup: W3CGroup = { duration: {}, easing: {} };
  for (const [key, value] of Object.entries(resolved.motion.duration)) {
    if (value !== undefined) {
      (motionGroup.duration as W3CGroup)[key] = { $value: value, $type: "duration" };
    }
  }
  for (const [key, value] of Object.entries(resolved.motion.easing)) {
    if (value !== undefined) {
      (motionGroup.easing as W3CGroup)[key] = { $value: value, $type: "cubicBezier" };
    }
  }
  output.motion = motionGroup;

  // Borders
  const borderGroup: W3CGroup = { width: {} };
  for (const [key, value] of Object.entries(resolved.borders.width)) {
    if (value !== undefined) {
      (borderGroup.width as W3CGroup)[key] = { $value: value, $type: "dimension" };
    }
  }
  output.border = borderGroup;

  // Layout
  if (resolved.layout) {
    const layoutGroup: W3CGroup = {};
    for (const [key, value] of Object.entries(resolved.layout)) {
      if (value !== undefined) {
        layoutGroup[key] = { $value: value, $type: "dimension" };
      }
    }
    output.layout = layoutGroup;
  }

  // Optional block tokens as flat groups
  const optionalGroups: [string, Record<string, unknown> | undefined][] = [
    ["buttons", resolved.buttons],
    ["cards", resolved.cards],
    ["headings", resolved.headings],
    ["navigation", resolved.navigation],
    ["inputs", resolved.inputs],
    ["code", resolved.code],
    ["backgrounds", resolved.backgrounds],
    ["hero", resolved.hero],
    ["cta", resolved.cta],
    ["footer", resolved.footer],
    ["banner", resolved.banner],
    ["sections", resolved.sections],
    ["pageRhythm", resolved.pageRhythm],
    ["alignment", resolved.alignment],
    ["dividers", resolved.dividers],
    ["gridVisuals", resolved.gridVisuals],
    ["focus", resolved.focus],
    ["overlays", resolved.overlays],
    ["dataViz", resolved.dataViz],
    ["media", resolved.media],
    ["controls", resolved.controls],
    ["componentSurfaces", resolved.componentSurfaces],
    ["cursor", resolved.cursor],
    ["scrollbar", resolved.scrollbar],
  ];

  for (const [groupName, group] of optionalGroups) {
    if (!group) continue;
    const g: W3CGroup = {};
    for (const [key, value] of Object.entries(group)) {
      if (value === undefined) continue;
      const type = typeof value === "boolean" ? "boolean" : "string";
      g[key] = { $value: value, $type: type };
    }
    output[groupName] = g;
  }

  // Extension metadata
  output.$extensions = {
    "com.sigil-ui": {
      version: "1.0",
      format: "design.md",
      totalTokens: 519,
      categories: 33,
    },
  } as unknown as W3CGroup;

  return JSON.stringify(output, null, 2) + "\n";
}
