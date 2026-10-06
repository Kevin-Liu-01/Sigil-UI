/**
 * WCAG AA Contrast Audit for Sigil Presets
 *
 * Checks all color pairs in every preset against WCAG 2.0 AA thresholds:
 *   - Normal text:   >= 4.5:1
 *   - Large text:    >= 3:1
 *   - UI components: >= 3:1
 *
 * Usage: pnpm audit:contrast
 */

import { parse, converter } from "culori";
import { presetCatalog } from "../packages/presets/src/catalog";
import * as presetExports from "../packages/presets/src/index";
import type { SigilPreset } from "../packages/tokens/src/types";

// ---------------------------------------------------------------------------
// All presets
// ---------------------------------------------------------------------------

const exportedPresets = Object.values(presetExports).filter(isSigilPreset);
const catalogNames = new Set(presetCatalog.map((preset) => preset.name));
const catalogPresetNames = new Set<string>();
const ALL_PRESETS: SigilPreset[] = [];

for (const preset of exportedPresets) {
  if (preset.name === "default") {
    ALL_PRESETS.push(preset);
    continue;
  }
  if (catalogNames.has(preset.name)) {
    catalogPresetNames.add(preset.name);
    ALL_PRESETS.push(preset);
  }
}

const missingExports = [...catalogNames].filter((name) => !catalogPresetNames.has(name)).sort();
if (missingExports.length > 0) {
  console.error(`Preset catalog entries missing token exports: ${missingExports.join(", ")}`);
  process.exit(1);
}

function isSigilPreset(value: unknown): value is SigilPreset {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "tokens" in value &&
    "metadata" in value
  );
}

// ---------------------------------------------------------------------------
// Color conversion
// ---------------------------------------------------------------------------

const toRgb = converter("rgb");

function colorToSrgb(raw: string): { r: number; g: number; b: number } | null {
  const trimmed = raw.trim();

  // Handle oklch(L C H) or oklch(L C H / A)
  if (trimmed.startsWith("oklch(")) {
    const inner = trimmed.slice(6, -1).split("/")[0]!.trim();
    const parts = inner.split(/\s+/);
    if (parts.length >= 3) {
      const L = parseFloat(parts[0]!);
      const C = parseFloat(parts[1]!);
      const H = parseFloat(parts[2]!);
      const rgb = toRgb({ mode: "oklch", l: L, c: C, h: H });
      if (rgb) return { r: clamp01(rgb.r), g: clamp01(rgb.g), b: clamp01(rgb.b) };
    }
  }

  // Try parsing with culori (handles hex, rgb(), hsl(), etc.)
  const parsed = parse(trimmed);
  if (parsed) {
    const rgb = toRgb(parsed);
    if (rgb) return { r: clamp01(rgb.r), g: clamp01(rgb.g), b: clamp01(rgb.b) };
  }

  return null;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// ---------------------------------------------------------------------------
// WCAG 2.0 contrast ratio
// ---------------------------------------------------------------------------

function srgbToLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg: { r: number; g: number; b: number }, bg: { r: number; g: number; b: number }): number {
  const l1 = srgbToLuminance(fg.r, fg.g, fg.b);
  const l2 = srgbToLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Themed color helpers
// ---------------------------------------------------------------------------

type ThemedColor = { light: string; dark: string };

function isThemed(v: unknown): v is ThemedColor {
  return typeof v === "object" && v !== null && "light" in v && "dark" in v;
}

function getColor(colors: Record<string, unknown>, key: string, mode: "light" | "dark"): string | null {
  const val = colors[key];
  if (!val) return null;
  if (isThemed(val)) return val[mode];
  if (typeof val === "string") return val;
  return null;
}

// ---------------------------------------------------------------------------
// Audit definitions
// ---------------------------------------------------------------------------

interface CheckDef {
  fg: string;
  bg: string;
  minRatio: number;
  label: string;
  severity: "fail" | "warn";
}

const CHECKS: CheckDef[] = [
  { fg: "text",           bg: "background",  minRatio: 4.5, label: "text on bg", severity: "fail" },
  { fg: "text-secondary", bg: "background",  minRatio: 4.5, label: "text-secondary on bg", severity: "fail" },
  { fg: "text-muted",     bg: "background",  minRatio: 4.5, label: "text-muted on bg", severity: "warn" },
  { fg: "text-subtle",    bg: "background",  minRatio: 3.0, label: "text-subtle on bg (large)", severity: "warn" },
  { fg: "text",           bg: "surface",     minRatio: 4.5, label: "text on surface", severity: "fail" },
  { fg: "text-secondary", bg: "surface",     minRatio: 4.5, label: "text-secondary on surface", severity: "fail" },
  { fg: "text-muted",     bg: "surface",     minRatio: 3.0, label: "text-muted on surface", severity: "warn" },
  { fg: "primary",        bg: "background",  minRatio: 3.0, label: "primary on bg (UI)", severity: "warn" },
  { fg: "border",         bg: "background",  minRatio: 3.0, label: "border on bg (UI)", severity: "warn" },
  { fg: "border-strong",  bg: "background",  minRatio: 3.0, label: "border-strong on bg", severity: "warn" },
  { fg: "success",        bg: "background",  minRatio: 3.0, label: "success on bg", severity: "warn" },
  { fg: "warning",        bg: "background",  minRatio: 3.0, label: "warning on bg", severity: "warn" },
  { fg: "error",          bg: "background",  minRatio: 3.0, label: "error on bg", severity: "warn" },
  { fg: "info",           bg: "background",  minRatio: 3.0, label: "info on bg", severity: "warn" },
];

// Captions and status labels are normal text, including on tinted cards.
for (const bg of ["background", "surface", "surface-elevated", "surface-sunken"]) {
  for (const fg of ["text", "text-secondary", "text-muted", "text-subtle", "success", "warning", "error", "info"]) {
    CHECKS.push({ fg, bg, minRatio: 4.5, label: `${fg} on ${bg}`, severity: "fail" });
  }
}
CHECKS.push({ fg: "primary-contrast", bg: "primary-hover", minRatio: 4.5, label: "button text on hover", severity: "fail" });

// primary-contrast on primary (button text)
const BUTTON_CHECK: CheckDef = {
  fg: "primary-contrast", bg: "primary", minRatio: 4.5, label: "primary-contrast on primary (btn)", severity: "fail"
};

// ---------------------------------------------------------------------------
// Run audit
// ---------------------------------------------------------------------------

interface Failure {
  preset: string;
  mode: "light" | "dark";
  label: string;
  ratio: number;
  required: number;
  fgColor: string;
  bgColor: string;
  severity: "fail" | "warn";
}

const failures: Failure[] = [];
let totalChecks = 0;

for (const preset of ALL_PRESETS) {
  const colors = preset.tokens.colors as Record<string, unknown>;

  for (const mode of ["light", "dark"] as const) {
    // Standard checks (themed fg on themed bg)
    for (const check of CHECKS) {
      const fgRaw = getColor(colors, check.fg, mode);
      const bgRaw = getColor(colors, check.bg, mode);
      if (!fgRaw || !bgRaw) continue;

      const fg = colorToSrgb(fgRaw);
      const bg = colorToSrgb(bgRaw);
      if (!fg || !bg) continue;

      totalChecks++;
      const ratio = contrastRatio(fg, bg);
      if (ratio < check.minRatio) {
        failures.push({
          preset: preset.name,
          mode,
          label: check.label,
          ratio: Math.round(ratio * 100) / 100,
          required: check.minRatio,
          fgColor: fgRaw,
          bgColor: bgRaw,
          severity: check.severity,
        });
      }
    }

    // Button check: primary-contrast on primary
    const pcRaw = getColor(colors, "primary-contrast", mode);
    const pRaw = getColor(colors, "primary", mode);
    if (pcRaw && pRaw) {
      const pc = colorToSrgb(pcRaw);
      const p = colorToSrgb(pRaw);
      if (pc && p) {
        totalChecks++;
        const ratio = contrastRatio(pc, p);
        if (ratio < BUTTON_CHECK.minRatio) {
          failures.push({
            preset: preset.name,
            mode,
            label: BUTTON_CHECK.label,
            ratio: Math.round(ratio * 100) / 100,
            required: BUTTON_CHECK.minRatio,
            fgColor: pcRaw,
            bgColor: pRaw,
            severity: BUTTON_CHECK.severity,
          });
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(`\nWCAG AA Contrast Audit — ${ALL_PRESETS.length} presets, ${totalChecks} checks\n`);

const hardFailures = failures.filter((failure) => failure.severity === "fail");
const warnings = failures.filter((failure) => failure.severity === "warn");

if (failures.length === 0) {
  console.log("ALL CHECKS PASSED\n");
  process.exit(0);
}

console.log(`FAILURES: ${hardFailures.length}`);
console.log(`WARNINGS: ${warnings.length}\n`);
console.log("Preset          | Mode  | Sev  | Check                              | Ratio | Req   | FG → BG");
console.log("----------------|-------|------|------------------------------------|-------|-------|--------");

for (const f of failures) {
  const name = f.preset.padEnd(15);
  const mode = f.mode.padEnd(5);
  const severity = f.severity.padEnd(4);
  const label = f.label.padEnd(34);
  const ratio = f.ratio.toFixed(2).padStart(5);
  const req = f.required.toFixed(1).padStart(5);
  console.log(`${name} | ${mode} | ${severity} | ${label} | ${ratio} | ${req} | ${f.fgColor} → ${f.bgColor}`);
}

console.log(`\n${hardFailures.length} hard failures and ${warnings.length} warnings out of ${totalChecks} checks.\n`);
process.exit(hardFailures.length > 0 ? 1 : 0);
