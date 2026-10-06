import type { SigilTokens } from "../types";
import { resolveSigilTokens } from "../validation";
import { indent } from "./emit";

/**
 * Generates a Tailwind CSS v4 `@theme` block that maps CSS variables
 * to Tailwind utility names.
 */
export function compileToTailwind(
  tokens: SigilTokens | Partial<SigilTokens>,
): string {
  const resolvedTokens = resolveSigilTokens(tokens, { partial: true }).tokens;
  const lines: string[] = ["@theme {"];
  const p = "s";

  // Colors → --color-*
  for (const key of Object.keys(resolvedTokens.colors)) {
    lines.push(`${indent(1)}--color-${key}: var(--${p}-${key});`);
  }

  // Typography → --font-*
  lines.push("");
  lines.push(`${indent(1)}--font-display: var(--${p}-font-display);`);
  lines.push(`${indent(1)}--font-body: var(--${p}-font-body);`);
  lines.push(`${indent(1)}--font-mono: var(--${p}-font-mono);`);
  for (const key of ["tighter", "tight", "normal", "wide", "wider"] as const) {
    lines.push(`${indent(1)}--tracking-${key}: var(--${p}-tracking-${key});`);
  }

  // Spacing → --spacing-*
  lines.push("");
  for (const step of resolvedTokens.spacing.scale) {
    lines.push(
      `${indent(1)}--spacing-${step}: var(--${p}-space-${step});`,
    );
  }

  // Radius → --radius-*
  lines.push("");
  for (const key of Object.keys(resolvedTokens.radius)) {
    lines.push(`${indent(1)}--radius-${key}: var(--${p}-radius-${key});`);
  }

  // Shadows → --shadow-*
  lines.push("");
  for (const key of Object.keys(resolvedTokens.shadows)) {
    lines.push(`${indent(1)}--shadow-${key}: var(--${p}-shadow-${key});`);
  }

  // Motion durations → --duration-*
  lines.push("");
  for (const key of Object.keys(resolvedTokens.motion.duration)) {
    lines.push(
      `${indent(1)}--duration-${key}: var(--${p}-duration-${key});`,
    );
  }

  // Motion easings → --ease-*
  lines.push("");
  for (const key of Object.keys(resolvedTokens.motion.easing)) {
    lines.push(`${indent(1)}--ease-${key}: var(--${p}-ease-${key});`);
  }

  lines.push("}");

  return lines.join("\n") + "\n";
}
