"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  SigilSection,
  Divider,
  MonoLabel,
  TabularValue,
  DensityText,
  AccentActive,
  AccentCTA,
  BorderStack,
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  GapPixelGrid,
  GapPixelCell,
} from "@sigil-ui/components";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { SigilFrame } from "@/components/landing/sigil-frame";
import { SigilTokensProvider } from "@/components/sandbox/token-provider";
import { TextureBg } from "@/components/texture-bg";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
import {
  Palette,
  Type,
  Ruler,
  LayoutGrid,
  Crosshair,
  Circle,
  Layers,
  Zap,
  Square,
  MousePointerClick,
  CreditCard,
  Heading,
  Compass,
  Image,
  Code2,
  TextCursorInput,
  MousePointer,
  GripVertical,
  AlignCenter,
  Rows3,
  Minus,
  Grid3X3,
  Focus,
  Blend,
  BarChart3,
  ImageIcon,
  SlidersHorizontal,
  Box,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from "@/components/icons";
import type { SigilPreset, SigilTokens } from "@sigil-ui/tokens";
import { presetCatalog } from "@sigil-ui/presets";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CategoryMeta = {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
};

type ThemedValue = { light: string; dark: string };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_META: CategoryMeta[] = [
  { key: "colors", label: "Colors", icon: Palette, description: "Backgrounds, surfaces, text, borders, brand, status, gradients, glow" },
  { key: "typography", label: "Typography", icon: Type, description: "Font stacks, size scale, weight scale, leading, tracking" },
  { key: "spacing", label: "Spacing", icon: Ruler, description: "Base scale, component padding, section spacing" },
  { key: "layout", label: "Layout", icon: LayoutGrid, description: "Content widths, margins, gutters, grid, bento, sidebar" },
  { key: "sigil", label: "Sigil Grid", icon: Crosshair, description: "Grid cell, cross marks, rail gap, structural visibility" },
  { key: "radius", label: "Radius", icon: Circle, description: "Scale from none to full, per-component radius overrides" },
  { key: "shadows", label: "Shadows", icon: Layers, description: "Elevation scale, glow, colored, inner, per-component shadows" },
  { key: "motion", label: "Motion", icon: Zap, description: "Durations, easings, hover/press/stagger presets" },
  { key: "borders", label: "Borders", icon: Square, description: "Width scale, style, per-component border definitions" },
  { key: "buttons", label: "Buttons", icon: MousePointerClick, description: "Font weight, transform, spacing, hover effect, active scale" },
  { key: "cards", label: "Cards", icon: CreditCard, description: "Border style, hover effect, padding, title/description sizing" },
  { key: "headings", label: "Headings", icon: Heading, description: "H1–H4 + display sizes, weights, tracking, leading" },
  { key: "navigation", label: "Navigation", icon: Compass, description: "Navbar height/blur/border, link style, sidebar, pagination" },
  { key: "backgrounds", label: "Backgrounds", icon: Image, description: "Pattern type/opacity, noise, gradient, hero pattern, dividers" },
  { key: "code", label: "Code", icon: Code2, description: "Font, sizing, syntax highlighting colors" },
  { key: "inputs", label: "Inputs", icon: TextCursorInput, description: "Heights, focus ring, placeholder, error state, labels" },
  { key: "cursor", label: "Cursor", icon: MousePointer, description: "Custom pointer variant, size, colors, glow" },
  { key: "scrollbar", label: "Scrollbar", icon: GripVertical, description: "Width, track/thumb colors, Firefox support" },
  { key: "alignment", label: "Alignment", icon: AlignCenter, description: "Rail system, content/hero/section/navbar alignment" },
  { key: "sections", label: "Sections", icon: Rows3, description: "Section padding, max-width, gap, divider control" },
  { key: "dividers", label: "Dividers", icon: Minus, description: "Line style, width, color, ornament, full-bleed" },
  { key: "gridVisuals", label: "Grid Visuals", icon: Grid3X3, description: "Lines, dots, cell background, hover effects" },
  { key: "focus", label: "Focus", icon: Focus, description: "Ring width, color, offset, outline" },
  { key: "overlays", label: "Overlays", icon: Blend, description: "Backdrop blur, surface, border, shadow, z-index" },
  { key: "dataViz", label: "Data Viz", icon: BarChart3, description: "Series colors, positive/negative, grid, tooltip" },
  { key: "media", label: "Media", icon: ImageIcon, description: "Radius, border, outline, shadow, object-fit" },
  { key: "controls", label: "Controls", icon: SlidersHorizontal, description: "Heights, hit area, track/thumb styling" },
  { key: "componentSurfaces", label: "Component Surfaces", icon: Box, description: "Background, border, text, hover/active/selected states" },
  { key: "hero", label: "Hero", icon: Heading, description: "Hero height, layout, content width, typography, and actions" },
  { key: "cta", label: "CTA", icon: MousePointerClick, description: "Call-to-action layout, spacing, typography, and action sizing" },
  { key: "footer", label: "Footer", icon: Rows3, description: "Footer columns, gaps, logo, links, socials, and bottom bar" },
  { key: "banner", label: "Banner", icon: Compass, description: "Announcement height, position, typography, icon, and dismissal" },
  { key: "pageRhythm", label: "Page Rhythm", icon: LayoutGrid, description: "Page density, section rhythm, alternation, dividers, and scroll behavior" },
];

const TABS = ["Preview", "Colors", "Typography", "Shapes", "Tokens", "Output", "DESIGN.md"] as const;
type Tab = (typeof TABS)[number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isOklchColor(value: string): boolean {
  return typeof value === "string" && value.startsWith("oklch(");
}

function isColorLike(value: string): boolean {
  return (
    typeof value === "string" &&
    (isOklchColor(value) || /^#[0-9a-fA-F]{3,8}$/.test(value) || value.startsWith("rgb"))
  );
}

function isThemed(v: unknown): v is ThemedValue {
  return typeof v === "object" && v !== null && "light" in v && "dark" in v;
}

function resolveColor(v: unknown): string | null {
  if (typeof v === "string" && isColorLike(v)) return v;
  if (isThemed(v) && isColorLike(v.light)) return v.light;
  return null;
}

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ColorSwatch({ value }: { value: string }) {
  if (!isColorLike(value)) return null;
  return (
    <span
      className="inline-block shrink-0 border border-[var(--s-border-muted)]"
      style={{ width: 12, height: 12, borderRadius: "2px", background: value }}
      aria-hidden
    />
  );
}

function TokenRow({ tokenKey, value }: { tokenKey: string; value: unknown }) {
  if (value === undefined || value === null) return null;

  if (isThemed(value)) {
    return (
      <div className="grid grid-cols-[1fr_1fr] gap-x-4 border-b border-[var(--s-border-muted)] py-2 last:border-b-0">
        <div className="flex items-center gap-2 min-w-0">
          <MonoLabel size="sm" className="truncate">{tokenKey}</MonoLabel>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-[family-name:var(--s-font-mono)] uppercase tracking-[0.1em] text-[var(--s-text-subtle)]">L</span>
            <ColorSwatch value={value.light} />
            <TabularValue size="xs" muted className="truncate">{value.light}</TabularValue>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-[family-name:var(--s-font-mono)] uppercase tracking-[0.1em] text-[var(--s-text-subtle)]">D</span>
            <ColorSwatch value={value.dark} />
            <TabularValue size="xs" muted className="truncate">{value.dark}</TabularValue>
          </div>
        </div>
      </div>
    );
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      <>
        <div className="pt-2 pb-1">
          <MonoLabel size="sm" variant="accent">{tokenKey}</MonoLabel>
        </div>
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <TokenRow key={k} tokenKey={k} value={v} />
        ))}
      </>
    );
  }

  const display = Array.isArray(value) ? value.join(", ") : String(value);
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-x-4 border-b border-[var(--s-border-muted)] py-2 last:border-b-0">
      <div className="flex items-center gap-2 min-w-0">
        <MonoLabel size="sm" className="truncate">{tokenKey}</MonoLabel>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <ColorSwatch value={display} />
        <TabularValue size="xs" muted className="truncate">{display}</TabularValue>
      </div>
    </div>
  );
}

function TokenSection({ meta, tokens, forceOpen }: { meta: CategoryMeta; tokens: Record<string, unknown>; forceOpen: boolean }) {
  const [manualToggle, setManualToggle] = useState<boolean | null>(null);
  const prevForceOpen = useRef(forceOpen);
  useEffect(() => {
    if (prevForceOpen.current !== forceOpen) { setManualToggle(null); prevForceOpen.current = forceOpen; }
  }, [forceOpen]);
  const open = manualToggle ?? forceOpen;
  const Icon = meta.icon;
  const count = Object.keys(tokens).length;

  return (
    <div className="border border-[var(--s-border-muted)]">
      <button
        type="button"
        onClick={() => setManualToggle(open ? false : true)}
        className="flex w-full items-center gap-3 bg-[var(--s-surface)] px-4 py-3 cursor-pointer text-left transition-colors duration-[var(--s-duration-fast,150ms)] hover:bg-[var(--s-surface-elevated)]"
      >
        <Icon size={16} className="shrink-0 text-[var(--s-primary)]" />
        <DensityText role="nav" className="font-semibold flex-1">{meta.label}</DensityText>
        <TabularValue size="xs" muted>{count} tokens</TabularValue>
        {open ? <ChevronDown size={14} className="shrink-0 text-[var(--s-text-muted)]" /> : <ChevronRight size={14} className="shrink-0 text-[var(--s-text-muted)]" />}
      </button>
      {open && (
        <div className="border-t border-[var(--s-border-muted)] bg-[var(--s-background)] px-4 py-2">
          <p className="text-[11px] font-[family-name:var(--s-font-mono)] text-[var(--s-text-subtle)] mb-3 tracking-wide">{meta.description}</p>
          {Object.entries(tokens).map(([key, val]) => <TokenRow key={key} tokenKey={key} value={val} />)}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component Preview
// ---------------------------------------------------------------------------

function ComponentPreview() {
  return (
    <div className="border border-[style:var(--s-border-style)] border-[color:var(--s-border-muted)] bg-[var(--s-surface)] p-[var(--s-card-padding)]">
      <div className="grid grid-cols-1 gap-[var(--s-grid-gap)] md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <MonoLabel size="sm" className="mb-1">Buttons</MonoLabel>
          <div className="flex flex-wrap gap-2">
            <Button>Primary Action</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <MonoLabel size="sm" className="mb-1">Input</MonoLabel>
          <Input aria-label="Preset component preview input" placeholder="Search or type a command…" />
          <Input aria-label="Preset component preview error input" defaultValue="Token-driven input" error="Example validation message" />
        </div>

        <div className="flex flex-col gap-3">
          <MonoLabel size="sm" className="mb-1">Card</MonoLabel>
          <Card>
            <CardHeader>
              <CardTitle>Token-driven card</CardTitle>
              <CardDescription>Typography, borders, radius, spacing, and shadow all come from this preset.</CardDescription>
            </CardHeader>
            <CardContent>
              <TabularValue size="xs" muted>var(--s-card-*)</TabularValue>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <MonoLabel size="sm" className="mb-1">Badges & Tags</MonoLabel>
          <div className="flex flex-wrap gap-2">
            <Badge>Active</Badge>
            <Badge variant="outline">Default</Badge>
            <Badge variant="secondary">Muted</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Color Palette
// ---------------------------------------------------------------------------

function ColorPalette({ tokens }: { tokens: SigilTokens }) {
  const colors = tokens.colors;
  const entries = Object.entries(colors).filter(([, v]) => v !== undefined);

  const COLOR_ROLES: Record<string, string> = {
    background: "Base page background",
    surface: "Card and panel surfaces",
    "surface-elevated": "Raised surfaces (modals, popovers)",
    primary: "Primary actions and links",
    "primary-hover": "Hover state for primary",
    "primary-muted": "Subtle primary backgrounds",
    secondary: "Secondary accent color",
    text: "Full-contrast body text",
    "text-secondary": "Secondary text",
    "text-muted": "Muted labels and captions",
    "text-subtle": "Subtle placeholders",
    "text-disabled": "Disabled text",
    border: "Default borders",
    "border-muted": "Subtle dividers",
    "border-strong": "Strong/focused borders",
    "border-interactive": "Interactive element borders",
    success: "Success state",
    warning: "Warning state",
    error: "Error state",
    info: "Informational state",
    highlight: "Highlight/selection",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {entries.map(([key, value]) => {
        const lightColor = isThemed(value) ? value.light : typeof value === "string" ? value : null;
        const darkColor = isThemed(value) ? value.dark : null;
        if (!lightColor) return null;

        return (
          <div key={key} className="flex items-start gap-3 p-3 border border-[var(--s-border-muted)] bg-[var(--s-surface)]">
            <div className="flex flex-col gap-1">
              <div
                className="shrink-0 border border-[var(--s-border)]"
                style={{ width: 40, height: 40, borderRadius: "4px", background: lightColor }}
                aria-hidden
              />
              {darkColor && (
                <div
                  className="shrink-0 border border-[var(--s-border)]"
                  style={{ width: 40, height: 20, borderRadius: "2px", background: darkColor }}
                  aria-hidden
                />
              )}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <MonoLabel size="sm">{key}</MonoLabel>
              <TabularValue size="xs" muted className="truncate">{lightColor}</TabularValue>
              {darkColor && <TabularValue size="xs" muted className="truncate">Dark: {darkColor}</TabularValue>}
              {COLOR_ROLES[key] && (
                <span className="text-[10px] text-[var(--s-text-subtle)] mt-0.5">{COLOR_ROLES[key]}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typography Showcase
// ---------------------------------------------------------------------------

function TypographyShowcase({ tokens }: { tokens: SigilTokens }) {
  const display = tokens.typography["font-display"];
  const body = tokens.typography["font-body"];
  const mono = tokens.typography["font-mono"];
  const headings = tokens.headings;

  return (
    <div className="flex flex-col gap-6">
      {/* Font stacks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Display", value: display, token: "--s-font-display" },
          { label: "Body", value: body, token: "--s-font-body" },
          { label: "Mono", value: mono, token: "--s-font-mono" },
        ].map((f) => (
          <div key={f.label} className="p-4 border border-[var(--s-border-muted)] bg-[var(--s-surface)]">
            <MonoLabel size="sm" className="mb-2 block text-[var(--s-text-muted)]">{f.label}</MonoLabel>
            <p className="text-[20px] leading-tight mb-2" style={{ fontFamily: f.value }}>
              The quick brown fox
            </p>
            <TabularValue size="xs" muted className="break-all">{f.value.split(",")[0].replace(/['"]/g, "")}</TabularValue>
            <br />
            <TabularValue size="xs" muted>{f.token}</TabularValue>
          </div>
        ))}
      </div>

      {/* Heading scale */}
      {headings && (
        <div className="p-4 border border-[var(--s-border-muted)] bg-[var(--s-surface)]">
          <MonoLabel size="sm" className="mb-4 block text-[var(--s-text-muted)]">Heading Scale</MonoLabel>
          <div className="flex flex-col gap-3">
            {headings["display-size"] && (
              <div className="flex items-baseline gap-3 border-b border-[var(--s-border-muted)] pb-2">
                <span className="shrink-0 w-16"><TabularValue size="xs" muted>Display</TabularValue></span>
                <span style={{ fontSize: headings["display-size"], fontWeight: headings["display-weight"], letterSpacing: headings["display-tracking"], lineHeight: headings["display-leading"], fontFamily: display }}>Display</span>
              </div>
            )}
            {(["h1", "h2", "h3", "h4"] as const).map((level) => {
              const size = headings[`${level}-size`];
              if (!size) return null;
              return (
                <div key={level} className="flex items-baseline gap-3 border-b border-[var(--s-border-muted)] pb-2 last:border-b-0">
                  <span className="shrink-0 w-16"><TabularValue size="xs" muted>{level.toUpperCase()}</TabularValue></span>
                  <span style={{ fontSize: size, fontWeight: headings[`${level}-weight`], letterSpacing: headings[`${level}-tracking`] ?? "0", fontFamily: display }}>{level.toUpperCase()} Heading</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shapes Preview
// ---------------------------------------------------------------------------

function ShapesPreview({ tokens }: { tokens: SigilTokens }) {
  const radius = tokens.radius;
  const shadows = tokens.shadows;

  return (
    <div className="flex flex-col gap-6">
      {/* Radius scale */}
      <div>
        <MonoLabel size="sm" className="mb-3 block text-[var(--s-text-muted)]">Border Radius Scale</MonoLabel>
        <div className="flex flex-wrap gap-4">
          {Object.entries(radius).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                className="border-2 border-[var(--s-primary)] bg-[var(--s-surface)]"
                style={{ width: 48, height: 48, borderRadius: value }}
              />
              <TabularValue size="xs" muted>{key}</TabularValue>
              <TabularValue size="xs" muted>{value}</TabularValue>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow scale */}
      <div>
        <MonoLabel size="sm" className="mb-3 block text-[var(--s-text-muted)]">Shadow Elevation Scale</MonoLabel>
        <div className="flex flex-wrap gap-4">
          {Object.entries(shadows).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                className="bg-[var(--s-surface)]"
                style={{ width: 64, height: 64, borderRadius: radius.md, boxShadow: value }}
              />
              <TabularValue size="xs" muted>{key}</TabularValue>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CSS/Tailwind Output
// ---------------------------------------------------------------------------

function OutputSection({ tokens, name }: { tokens: SigilTokens; name: string }) {
  const { copied, copy } = useCopyToClipboard();
  const [outputTab, setOutputTab] = useState<"css" | "tailwind">("css");

  const cssOutput = useMemo(() => {
    const lines: string[] = [`:root {`];
    const colors = tokens.colors;
    for (const [key, value] of Object.entries(colors)) {
      if (value === undefined) continue;
      if (isThemed(value)) {
        lines.push(`  --s-${key}: ${value.light};`);
      } else {
        lines.push(`  --s-${key}: ${value};`);
      }
    }
    lines.push("");
    lines.push(`  /* Typography */`);
    lines.push(`  --s-font-display: ${tokens.typography["font-display"]};`);
    lines.push(`  --s-font-body: ${tokens.typography["font-body"]};`);
    lines.push(`  --s-font-mono: ${tokens.typography["font-mono"]};`);
    lines.push("");
    lines.push(`  /* Spacing */`);
    for (const step of tokens.spacing.scale) {
      lines.push(`  --s-space-${step}: ${step}${tokens.spacing.unit};`);
    }
    lines.push("");
    lines.push(`  /* Radius */`);
    for (const [key, value] of Object.entries(tokens.radius)) {
      lines.push(`  --s-radius-${key}: ${value};`);
    }
    lines.push("");
    lines.push(`  /* Shadows */`);
    for (const [key, value] of Object.entries(tokens.shadows)) {
      lines.push(`  --s-shadow-${key}: ${value};`);
    }
    lines.push("");
    lines.push(`  /* Motion */`);
    for (const [key, value] of Object.entries(tokens.motion.duration)) {
      lines.push(`  --s-duration-${key}: ${value};`);
    }
    for (const [key, value] of Object.entries(tokens.motion.easing)) {
      lines.push(`  --s-ease-${key}: ${value};`);
    }
    lines.push(`}`);

    const darkLines: string[] = [`\n[data-theme='dark'] {`];
    for (const [key, value] of Object.entries(colors)) {
      if (isThemed(value)) {
        darkLines.push(`  --s-${key}: ${value.dark};`);
      }
    }
    darkLines.push(`}`);

    return lines.join("\n") + darkLines.join("\n");
  }, [tokens]);

  const tailwindOutput = useMemo(() => {
    const lines: string[] = [`@theme {`];
    for (const key of Object.keys(tokens.colors)) {
      lines.push(`  --color-${key}: var(--s-${key});`);
    }
    lines.push("");
    lines.push(`  --font-display: var(--s-font-display);`);
    lines.push(`  --font-body: var(--s-font-body);`);
    lines.push(`  --font-mono: var(--s-font-mono);`);
    lines.push("");
    for (const step of tokens.spacing.scale) {
      lines.push(`  --spacing-${step}: var(--s-space-${step});`);
    }
    lines.push("");
    for (const key of Object.keys(tokens.radius)) {
      lines.push(`  --radius-${key}: var(--s-radius-${key});`);
    }
    lines.push("");
    for (const key of Object.keys(tokens.shadows)) {
      lines.push(`  --shadow-${key}: var(--s-shadow-${key});`);
    }
    lines.push("");
    for (const key of Object.keys(tokens.motion.duration)) {
      lines.push(`  --duration-${key}: var(--s-duration-${key});`);
    }
    for (const key of Object.keys(tokens.motion.easing)) {
      lines.push(`  --ease-${key}: var(--s-ease-${key});`);
    }
    lines.push(`}`);
    return lines.join("\n");
  }, [tokens]);

  const output = outputTab === "css" ? cssOutput : tailwindOutput;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["css", "tailwind"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setOutputTab(t)}
              className="border-0 cursor-pointer bg-transparent p-0"
            >
              <AccentActive active={outputTab === t} className="px-3 py-1.5">
                <MonoLabel size="sm" variant={outputTab === t ? "accent" : "muted"}>
                  {t === "css" ? "CSS Custom Properties" : "Tailwind v4"}
                </MonoLabel>
              </AccentActive>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => copy(output)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-[family-name:var(--s-font-mono)] uppercase tracking-[0.08em] text-[var(--s-text-muted)] border border-[var(--s-border-muted)] bg-[var(--s-surface)] cursor-pointer hover:bg-[var(--s-surface-elevated)] transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 border border-[var(--s-border-muted)] bg-[var(--s-background)] overflow-x-auto text-[11px] leading-[1.6] font-[family-name:var(--s-font-mono)] text-[var(--s-text-secondary)] max-h-[480px] overflow-y-auto">
        {output}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function PresetDetailPage() {
  const params = useParams();
  const name = params.name as string;

  const [preset, setPreset] = useState<SigilPreset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Preview");

  const catalogEntry = useMemo(() => presetCatalog.find((p) => p.name === name), [name]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    import("@sigil-ui/presets")
      .then((mod) => {
        const loaders = mod.presets as Record<string, () => Promise<SigilPreset>>;
        const loader = loaders[name];
        if (!loader) throw new Error(`Preset "${name}" not found`);
        return loader();
      })
      .then((p) => { if (!cancelled) { setPreset(p); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [name]);

  const sections = useMemo(() => {
    if (!preset) return [];
    return CATEGORY_META.filter((meta) => (preset.tokens as Record<string, unknown>)[meta.key] != null)
      .map((meta) => ({ meta, tokens: (preset.tokens as Record<string, unknown>)[meta.key] as Record<string, unknown> }));
  }, [preset]);

  const totalTokens = SIGIL_PRODUCT_STATS.tokenCount;

  const [filterText, setFilterText] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  const filteredSections = useMemo(() => {
    if (!filterText.trim()) return sections;
    const q = filterText.toLowerCase();
    return sections
      .map((s) => {
        if (s.meta.label.toLowerCase().includes(q)) return s;
        const filtered = Object.fromEntries(
          Object.entries(s.tokens).filter(([key, val]) => {
            const valStr = typeof val === "object" ? JSON.stringify(val) : String(val);
            return key.toLowerCase().includes(q) || valStr.toLowerCase().includes(q);
          }),
        );
        if (Object.keys(filtered).length === 0) return null;
        return { ...s, tokens: filtered };
      })
      .filter(Boolean) as typeof sections;
  }, [sections, filterText]);

  const page = (
    <SigilFrame>
      <LandingNavbar />
      <BorderStack borders="none">
        {/* Hero */}
        <SigilSection borderTop space="hero" className="relative overflow-hidden">
          <TextureBg opacity={0.3} />
          <div className="relative z-[1] max-w-3xl">
            <Link href="/presets" className="inline-flex items-center gap-1.5 mb-6 text-[var(--s-text-muted)] hover:text-[var(--s-text)] transition-colors duration-[var(--s-duration-fast,150ms)] no-underline">
              <ArrowLeft size={14} />
              <MonoLabel size="sm">All Presets</MonoLabel>
            </Link>

            {loading ? (
              <div className="space-y-3">
                <div className="h-12 w-48 bg-[var(--s-surface)] animate-pulse" />
                <div className="h-6 w-96 bg-[var(--s-surface)] animate-pulse" />
              </div>
            ) : error ? (
              <div>
                <h1 className="mb-4 font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-3xl),5vw,var(--s-size-5xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)] text-[var(--s-text)]">Preset not found</h1>
                <DensityText role="body" as="p" muted>{error}</DensityText>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-3xl),5vw,var(--s-size-5xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)] text-[var(--s-text)]">{catalogEntry?.label ?? name}</h1>
                  {preset && (
                    <span
                      className="inline-block h-5 w-5 rounded-full border border-[var(--s-border)]"
                      style={{ background: resolveColor(preset.tokens.colors.primary) ?? undefined }}
                      aria-hidden
                    />
                  )}
                </div>
                <DensityText role="body" as="p" muted className="mb-3 max-w-[560px]">{preset?.metadata.description}</DensityText>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {catalogEntry && <MonoLabel variant="accent" size="sm">{catalogEntry.category}</MonoLabel>}
                  {preset?.metadata.mood && <TabularValue size="xs" muted>{preset.metadata.mood}</TabularValue>}
                  <TabularValue size="xs" muted>{SIGIL_PRODUCT_STATS.categoryCount} categories &middot; {totalTokens} tokens</TabularValue>
                </div>
                {preset?.metadata.tags && preset.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {preset.metadata.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 text-[10px] font-[family-name:var(--s-font-mono)] uppercase tracking-[0.08em] text-[var(--s-text-muted)] border border-[var(--s-border-muted)] bg-[var(--s-surface)]">{tag}</span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </SigilSection>

        <Divider pattern="vertical" size="md" showBorders />

        {/* Quick stats */}
        {preset && !loading && (
          <>
            <SigilSection space="compact">
              <GapPixelGrid columns={{ sm: 2, md: 4, lg: 6 }}>
                <GapPixelCell className="p-4">
                  <MonoLabel size="sm" className="mb-1 block text-[var(--s-text-muted)]">Display Font</MonoLabel>
                  <TabularValue size="xs">{preset.tokens.typography["font-display"].split(",")[0].replace(/['"]/g, "")}</TabularValue>
                </GapPixelCell>
                <GapPixelCell className="p-4">
                  <MonoLabel size="sm" className="mb-1 block text-[var(--s-text-muted)]">Body Font</MonoLabel>
                  <TabularValue size="xs">{preset.tokens.typography["font-body"].split(",")[0].replace(/['"]/g, "")}</TabularValue>
                </GapPixelCell>
                <GapPixelCell className="p-4">
                  <MonoLabel size="sm" className="mb-1 block text-[var(--s-text-muted)]">Mono Font</MonoLabel>
                  <TabularValue size="xs">{preset.tokens.typography["font-mono"].split(",")[0].replace(/['"]/g, "")}</TabularValue>
                </GapPixelCell>
                <GapPixelCell className="p-4">
                  <MonoLabel size="sm" className="mb-1 block text-[var(--s-text-muted)]">Base Radius</MonoLabel>
                  <TabularValue size="xs">{preset.tokens.radius.md}</TabularValue>
                </GapPixelCell>
                <GapPixelCell className="p-4">
                  <MonoLabel size="sm" className="mb-1 block text-[var(--s-text-muted)]">Motion Speed</MonoLabel>
                  <TabularValue size="xs">{preset.tokens.motion.duration.fast}</TabularValue>
                </GapPixelCell>
                <GapPixelCell className="p-4">
                  <MonoLabel size="sm" className="mb-1 block text-[var(--s-text-muted)]">Categories</MonoLabel>
                  <TabularValue size="xs">{sections.length} / {SIGIL_PRODUCT_STATS.categoryCount}</TabularValue>
                </GapPixelCell>
              </GapPixelGrid>
            </SigilSection>
            <Divider pattern="diagonal" size="md" showBorders />
          </>
        )}

        {/* Tabbed content */}
        {preset && !loading && (
          <SigilSection space="hero">
            {/* Tab bar */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-[var(--s-border-muted)] pb-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="border-0 cursor-pointer bg-transparent p-0"
                >
                  <AccentActive active={activeTab === tab} className="px-3 py-1.5">
                    <MonoLabel size="sm" variant={activeTab === tab ? "accent" : "muted"}>{tab}</MonoLabel>
                  </AccentActive>
                </button>
              ))}
            </div>

            {/* Preview tab */}
            {activeTab === "Preview" && <ComponentPreview />}

            {/* Colors tab */}
            {activeTab === "Colors" && <ColorPalette tokens={preset.tokens} />}

            {/* Typography tab */}
            {activeTab === "Typography" && <TypographyShowcase tokens={preset.tokens} />}

            {/* Shapes tab */}
            {activeTab === "Shapes" && <ShapesPreview tokens={preset.tokens} />}

            {/* Tokens tab */}
            {activeTab === "Tokens" && (
              <>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <DensityText role="body" as="p" muted>
                    Full token specification — {totalTokens} tokens across {sections.length} categories.
                  </DensityText>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      placeholder="Filter tokens…"
                      className="h-8 w-48 border border-[var(--s-border)] bg-[var(--s-background)] px-3 text-[12px] font-[family-name:var(--s-font-mono)] text-[var(--s-text)] placeholder:text-[var(--s-text-subtle)] outline-none focus:border-[var(--s-primary)] transition-colors"
                    />
                    <button type="button" onClick={() => setExpandAll(!expandAll)} className="border-0 cursor-pointer bg-transparent p-0">
                      <AccentActive active={expandAll} className="px-3 py-1.5">
                        <MonoLabel size="sm" variant={expandAll ? "accent" : "muted"}>{expandAll ? "Collapse" : "Expand All"}</MonoLabel>
                      </AccentActive>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {filteredSections.map(({ meta, tokens }) => (
                    <TokenSection key={meta.key} meta={meta} tokens={tokens} forceOpen={expandAll || !!filterText} />
                  ))}
                  {filteredSections.length === 0 && filterText && (
                    <div className="py-12 text-center">
                      <DensityText role="body" as="p" muted>No tokens match &ldquo;{filterText}&rdquo;</DensityText>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Output tab */}
            {activeTab === "Output" && <OutputSection tokens={preset.tokens} name={name} />}

            {/* DESIGN.md tab */}
            {activeTab === "DESIGN.md" && (
              <div className="flex flex-col gap-4">
                <DensityText role="body" as="p" muted>
                  The full <strong>DESIGN.md</strong> for this preset — a single file that compiles to both CSS custom properties and Tailwind v4.
                  Drop it into your project and run <code className="text-[var(--s-primary)]">sigil design compile</code>.
                </DensityText>
                <AccentCTA asChild>
                  <Link href={`/presets/${name}/design`}>
                    View Full DESIGN.md
                  </Link>
                </AccentCTA>
              </div>
            )}
          </SigilSection>
        )}

        {loading && (
          <SigilSection space="compact">
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-[var(--s-surface)] animate-pulse" />
              ))}
            </div>
          </SigilSection>
        )}

        <Divider pattern="diagonal" size="md" showBorders />
      </BorderStack>
      <LandingFooter />
    </SigilFrame>
  );

  return preset ? (
    <SigilTokensProvider initialPreset={preset} styleTagAttr="data-sigil-preset-detail">
      {page}
    </SigilTokensProvider>
  ) : page;
}
