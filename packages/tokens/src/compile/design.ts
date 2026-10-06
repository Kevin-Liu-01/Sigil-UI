import type { DesignDocument, SigilTokens } from "../types";
import { resolveSigilTokens } from "../validation";
import { isThemedColor } from "./merge";
import { compileToCss } from "./css";
import { compileToTailwind } from "./tailwind";
import { compileToW3CJson } from "./w3c";

function mdTable(headers: string[], rows: string[][]): string {
  const sep = headers.map(() => "---");
  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
    ...rows.map((r) => `| ${r.join(" | ")} |`),
  ];
  return lines.join("\n");
}

function tokenRow(token: string, value: string, role?: string): string[] {
  return [`\`${token}\``, `\`${value}\``, role ?? ""];
}

/**
 * Generates a full DESIGN.md string from a DesignDocument.
 * Includes all token tables, prose sections, and compiled output blocks.
 */
export function compileDesignMd(doc: DesignDocument): string {
  const { metadata, tokens } = doc;
  const resolved = resolveSigilTokens(tokens).tokens;

  const out: string[] = [];

  // Header
  out.push(`# ${metadata.brand} — Style Reference`);
  out.push(`> ${metadata.tagline}`);
  out.push("");
  out.push(`**Theme:** ${metadata.theme}  `);
  out.push(`**Preset:** ${metadata.preset}  `);
  out.push(`**Density:** ${metadata.density}`);
  out.push("");
  if (metadata.description) out.push(metadata.description);
  out.push("");

  // Colors
  out.push("## Tokens — Colors");
  out.push("");
  out.push("All color values use OKLCH for perceptual uniformity and wide-gamut display support.");
  out.push("");
  const colorRows: string[][] = [];
  for (const [key, value] of Object.entries(resolved.colors)) {
    if (value === undefined) continue;
    if (isThemedColor(value)) {
      colorRows.push([`\`${key}\``, `\`${value.light}\``, `\`${value.dark}\``, key.replace(/-/g, " ")]);
    } else {
      colorRows.push([`\`${key}\``, `\`${value}\``, `\`${value}\``, key.replace(/-/g, " ")]);
    }
  }
  out.push(mdTable(["Token", "Light", "Dark", "Role"], colorRows));
  out.push("");

  // Typography
  out.push("## Tokens — Typography");
  out.push("");
  const typoRows: string[][] = [];
  for (const [key, value] of Object.entries(resolved.typography)) {
    if (value !== undefined) typoRows.push(tokenRow(key, String(value)));
  }
  out.push(mdTable(["Token", "Value", "Role"], typoRows));
  out.push("");

  // Spacing
  out.push("## Tokens — Spacing");
  out.push("");
  const spacingRows = resolved.spacing.scale.map((s) =>
    tokenRow(`space-${s}`, `${s}`, `${s}${resolved.spacing.unit} step`),
  );
  out.push(mdTable(["Token", "Value", "Role"], spacingRows));
  out.push("");

  // Layout
  out.push("## Tokens — Layout");
  out.push("");
  if (resolved.layout) {
    const layoutRows = Object.entries(resolved.layout).map(([k, v]) => tokenRow(k, String(v)));
    out.push(mdTable(["Token", "Value", "Role"], layoutRows));
  }
  out.push("");

  // Sigil Grid
  out.push("## Tokens — Sigil Grid");
  out.push("");
  const sigilRows = Object.entries(resolved.sigil).map(([k, v]) => tokenRow(k, String(v)));
  out.push(mdTable(["Token", "Value", "Role"], sigilRows));
  out.push("");

  // Radius
  out.push("## Tokens — Radius");
  out.push("");
  const radiusRows = Object.entries(resolved.radius).map(([k, v]) => tokenRow(k, String(v)));
  out.push(mdTable(["Token", "Value", "Role"], radiusRows));
  out.push("");

  // Shadows
  out.push("## Tokens — Shadows");
  out.push("");
  const shadowRows = Object.entries(resolved.shadows).map(([k, v]) => tokenRow(k, String(v)));
  out.push(mdTable(["Token", "Value", "Role"], shadowRows));
  out.push("");

  // Motion
  out.push("## Tokens — Motion");
  out.push("");
  out.push("### Durations");
  out.push("");
  const durRows = Object.entries(resolved.motion.duration).map(([k, v]) => tokenRow(k, v));
  out.push(mdTable(["Token", "Value", "Role"], durRows));
  out.push("");
  out.push("### Easings");
  out.push("");
  const easeRows = Object.entries(resolved.motion.easing).map(([k, v]) => tokenRow(k, v));
  out.push(mdTable(["Token", "Value", "Role"], easeRows));
  out.push("");
  out.push("### Presets");
  out.push("");
  const motionPresetKeys = Object.keys(resolved.motion).filter((k) => k !== "duration" && k !== "easing");
  if (motionPresetKeys.length > 0) {
    const presetRows = motionPresetKeys.map((k) =>
      tokenRow(k, String((resolved.motion as Record<string, unknown>)[k])),
    );
    out.push(mdTable(["Token", "Value", "Role"], presetRows));
  }
  out.push("");

  // Borders
  out.push("## Tokens — Borders");
  out.push("");
  const borderRows = Object.entries(resolved.borders.width).map(([k, v]) => tokenRow(k, v));
  const borderExtras = Object.entries(resolved.borders)
    .filter(([k]) => k !== "width")
    .map(([k, v]) => tokenRow(k, String(v)));
  out.push(mdTable(["Token", "Value", "Role"], [...borderRows, ...borderExtras]));
  out.push("");

  // Backgrounds
  out.push("## Tokens — Backgrounds");
  out.push("");
  if (resolved.backgrounds) {
    const bgRows = Object.entries(resolved.backgrounds).map(([k, v]) => tokenRow(k, String(v)));
    out.push(mdTable(["Token", "Value", "Role"], bgRows));
  }
  out.push("");

  // Block token helper
  function emitBlockSection(heading: string, group: Record<string, unknown> | undefined) {
    out.push(`## ${heading}`);
    out.push("");
    if (group) {
      const rows = Object.entries(group)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => tokenRow(k, String(v)));
      out.push(mdTable(["Token", "Value", "Role"], rows));
    }
    out.push("");
  }

  emitBlockSection("Block Tokens — Buttons", resolved.buttons);
  emitBlockSection("Block Tokens — Cards", resolved.cards);
  emitBlockSection("Block Tokens — Headings", resolved.headings);
  emitBlockSection("Block Tokens — Navigation", resolved.navigation);
  emitBlockSection("Block Tokens — Inputs", resolved.inputs);
  emitBlockSection("Block Tokens — Code", resolved.code);
  emitBlockSection("Block Tokens — Hero", resolved.hero);
  emitBlockSection("Block Tokens — CTA", resolved.cta);
  emitBlockSection("Block Tokens — Footer", resolved.footer);
  emitBlockSection("Block Tokens — Banner", resolved.banner);
  emitBlockSection("Block Tokens — Sections", resolved.sections);

  // Composition tokens
  emitBlockSection("Composition — Page Rhythm", resolved.pageRhythm);
  emitBlockSection("Composition — Grid & Alignment", resolved.alignment);
  emitBlockSection("Composition — Dividers", resolved.dividers);
  emitBlockSection("Composition — Grid Visuals", resolved.gridVisuals);

  // Cursor + Scrollbar combined
  out.push("## Composition — Cursor & Scrollbar");
  out.push("");
  const cursorScrollRows = [
    ...Object.entries(resolved.cursor ?? {}).filter(([, v]) => v !== undefined).map(([k, v]) => tokenRow(k, String(v))),
    ...Object.entries(resolved.scrollbar ?? {}).filter(([, v]) => v !== undefined).map(([k, v]) => tokenRow(k, String(v))),
  ];
  out.push(mdTable(["Token", "Value", "Role"], cursorScrollRows));
  out.push("");

  // Focus + Overlays combined
  out.push("## Composition — Focus & Overlays");
  out.push("");
  const focusOverlayRows = [
    ...Object.entries(resolved.focus ?? {}).filter(([, v]) => v !== undefined).map(([k, v]) => tokenRow(k, String(v))),
    ...Object.entries(resolved.overlays ?? {}).filter(([, v]) => v !== undefined).map(([k, v]) => tokenRow(k, String(v))),
  ];
  out.push(mdTable(["Token", "Value", "Role"], focusOverlayRows));
  out.push("");

  emitBlockSection("Composition — Data Visualization", resolved.dataViz);
  emitBlockSection("Composition — Media", resolved.media);
  emitBlockSection("Composition — Controls", resolved.controls);
  emitBlockSection("Composition — Component Surfaces", resolved.componentSurfaces);

  // Components
  out.push("## Components");
  out.push("");
  for (const comp of doc.components) {
    out.push(`### ${comp.name}`);
    out.push(comp.description);
    out.push("");
  }

  // Surfaces
  out.push("## Surfaces");
  out.push("");
  if (doc.surfaces.length > 0) {
    const surfRows = doc.surfaces.map((s) => [String(s.level), s.name, `\`${s.value}\``, s.purpose]);
    out.push(mdTable(["Level", "Name", "Value", "Purpose"], surfRows));
  }
  out.push("");

  // Do's and Don'ts
  out.push("## Do's and Don'ts");
  out.push("");
  out.push("### Do");
  for (const d of doc.dos) out.push(`- ${d}`);
  out.push("");
  out.push("### Don't");
  for (const d of doc.donts) out.push(`- ${d}`);
  out.push("");

  // Imagery
  out.push("## Imagery");
  out.push("");
  out.push(doc.imagery || "No specific imagery guidelines defined.");
  out.push("");

  // Layout
  out.push("## Layout");
  out.push("");
  out.push(doc.layout || "No specific layout guidelines defined.");
  out.push("");

  // Similar Brands
  out.push("## Similar Brands");
  out.push("");
  for (const b of doc.similarBrands) out.push(`- ${b}`);
  out.push("");

  // Compile — CSS
  out.push("## Compile — CSS");
  out.push("");
  out.push("```css");
  out.push(compileToCss(resolved));
  out.push("```");
  out.push("");

  // Compile — Tailwind v4
  out.push("## Compile — Tailwind v4");
  out.push("");
  out.push("```css");
  out.push(compileToTailwind(resolved));
  out.push("```");
  out.push("");

  // Compile — W3C Design Tokens
  out.push("## Compile — W3C Design Tokens");
  out.push("");
  out.push("```json");
  out.push(compileToW3CJson(resolved));
  out.push("```");
  out.push("");

  return out.join("\n");
}
