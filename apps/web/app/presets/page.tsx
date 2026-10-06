"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SigilSection,
  Divider,
  GapPixelGrid,
  GapPixelCell,
  MonoLabel,
  TabularValue,
  DensityText,
  AccentCTA,
  AccentActive,
  CardCell,
  Button,
} from "@sigil-ui/components";
import { presetCatalog, type PresetCatalogEntry } from "@sigil-ui/presets";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { SigilFrame } from "@/components/landing/sigil-frame";
import { PresetComparisonView } from "@/components/landing/preset-comparison";
import { TextureBg } from "@/components/texture-bg";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";

const CATEGORIES = [
  "All",
  "Structural",
  "Minimal",
  "Dark",
  "Colorful",
  "Editorial",
  "Industrial",
  "Edgeless",
] as const;

type Category = (typeof CATEGORIES)[number];

const HUE_COLORS: Record<string, string> = {
  indigo: "oklch(0.55 0.18 280)",
  neutral: "oklch(0.30 0 0)",
  copper: "oklch(0.60 0.14 50)",
  slate: "oklch(0.40 0.02 260)",
  orange: "oklch(0.65 0.20 50)",
  purple: "oklch(0.55 0.20 300)",
  "blue-purple": "oklch(0.55 0.18 270)",
  teal: "oklch(0.60 0.14 185)",
  emerald: "oklch(0.55 0.15 160)",
  iron: "oklch(0.45 0.02 60)",
  amber: "oklch(0.70 0.16 80)",
  cyan: "oklch(0.65 0.15 200)",
  violet: "oklch(0.50 0.20 290)",
  red: "oklch(0.55 0.22 25)",
  cobalt: "oklch(0.50 0.18 250)",
  gold: "oklch(0.65 0.15 85)",
  blue: "oklch(0.55 0.18 250)",
  green: "oklch(0.55 0.17 155)",
  rainbow: "linear-gradient(135deg, oklch(0.65 0.2 0), oklch(0.65 0.2 120), oklch(0.65 0.2 240))",
  sky: "oklch(0.65 0.14 220)",
  fuchsia: "oklch(0.55 0.22 320)",
  black: "oklch(0.20 0 0)",
  "rose-violet": "oklch(0.55 0.18 330)",
  terracotta: "oklch(0.58 0.14 40)",
  coral: "oklch(0.65 0.16 25)",
  magenta: "oklch(0.55 0.20 340)",
  rose: "oklch(0.60 0.14 350)",
};

function getHueColor(hue: string): string {
  return HUE_COLORS[hue] ?? "oklch(0.55 0.15 280)";
}

const STEPS = [
  {
    number: "01",
    title: "Start or create",
    description: "sigil preset <name> to start from a curated base, or sigil preset create to build your own from scratch.",
  },
  {
    number: "02",
    title: "Customize your token file",
    description: `DESIGN.md is yours — change any of ${SIGIL_PRODUCT_STATS.tokenCount} fields to match your brand exactly. Compiles to CSS + Tailwind.`,
  },
  {
    number: "03",
    title: "Everything updates",
    description: `CSS recompiles, ${SIGIL_PRODUCT_STATS.componentCountLabel} token-driven components refresh — zero component-level edits required.`,
  },
] as const;

function PresetCard({ preset }: { preset: PresetCatalogEntry }) {
  const hueColor = getHueColor(preset.primaryHue);
  const isGradient = hueColor.startsWith("linear-gradient");

  return (
    <Link
      href={`/presets/${preset.name}`}
      className="no-underline text-inherit"
    >
      <GapPixelCell className="flex flex-col h-full transition-colors duration-[var(--s-duration-fast,150ms)] hover:bg-[var(--s-surface-elevated)]">
        <div
          style={{
            height: "var(--s-space-24)",
            background: hueColor,
            borderBottom: "var(--s-border-thin) var(--s-border-style) var(--s-border-muted)",
          }}
          aria-hidden
        />

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <DensityText role="nav" className="font-semibold">
              {preset.label}
            </DensityText>
            {!isGradient && (
              <span
                className="inline-block shrink-0 border border-[var(--s-border-muted)]"
                style={{
                  width: "var(--s-size-sm)",
                  height: "var(--s-size-sm)",
                  borderRadius: "var(--s-radius-full)",
                  background: hueColor,
                }}
                aria-hidden
              />
            )}
          </div>

          <MonoLabel size="sm">
            {preset.category}
          </MonoLabel>

          <TabularValue size="xs" muted as="p" className="line-clamp-2">
            {preset.description}
          </TabularValue>

          <div className="flex items-center justify-between pt-1 border-t border-[var(--s-border-muted)]">
            <TabularValue size="xs" muted>
              {preset.fonts.display}
            </TabularValue>
            <TabularValue size="xs" muted>
              {preset.mood.split(",")[0]}
            </TabularValue>
          </div>
        </div>
      </GapPixelCell>
    </Link>
  );
}

export default function PresetsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? presetCatalog
      : presetCatalog.filter(
          (p) => p.category === activeCategory.toLowerCase(),
        );

  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] =
        cat === "All"
          ? presetCatalog.length
          : presetCatalog.filter((p) => p.category === cat.toLowerCase()).length;
      return acc;
    },
    {} as Record<Category, number>,
  );

  return (
    <SigilFrame>
      <LandingNavbar />

      <>
        {/* Hero */}
        <SigilSection borderTop space="hero" className="relative overflow-hidden">
          <TextureBg opacity={0.3} />
          <div className="relative z-[1] mb-12 max-w-3xl">

            <h1 className="mb-4 font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-3xl),5vw,var(--s-size-5xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)] text-[var(--s-text)]">
              {presetCatalog.length} Curated Presets.<br />
              <span className="text-[var(--s-primary)]">{SIGIL_PRODUCT_STATS.tokenCount} tokens each.</span>
            </h1>

            <DensityText
              role="body"
              as="p"
              muted
              className="mb-6 max-w-[560px]"
            >
              Each preset applies a complete visual identity — colors, typography,
              radius, shadows, motion, borders, page composition, and more — across
              all 33 token categories. Pick one, customize your{" "}
              <code className="text-[var(--s-primary)]">DESIGN.md</code>,
              or create a fully custom preset from scratch.
            </DensityText>

            <div className="flex gap-3">
              <AccentCTA asChild>
                <a href="/docs/presets">Preset Docs</a>
              </AccentCTA>
              <Button asChild variant="outline" size="lg">
                <a href="/docs/cli#preset-create">Create Custom Preset</a>
              </Button>
            </div>
          </div>
        </SigilSection>

        <Divider pattern="vertical" size="md" showBorders />

        {/* Category filter + grid */}
        <SigilSection space="compact">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className="cursor-pointer border-0 bg-transparent p-0"
              >
                <AccentActive
                  active={activeCategory === cat}
                  className="px-3 py-1.5"
                >
                  <MonoLabel
                    size="sm"
                    variant={activeCategory === cat ? "accent" : "muted"}
                  >
                    {cat} ({categoryCounts[cat]})
                  </MonoLabel>
                </AccentActive>
              </button>
            ))}
          </div>

          <GapPixelGrid columns={{ sm: 2, md: 3, lg: 4 }} data-stagger>
            {filtered.map((preset) => (
              <PresetCard key={preset.name} preset={preset} />
            ))}
          </GapPixelGrid>
        </SigilSection>

        <Divider pattern="diagonal" size="md" showBorders />

        {/* Comparison */}
        <SigilSection space="compact">
          <div className="mb-8 max-w-2xl">
            <MonoLabel className="mb-3 block">Compare Presets</MonoLabel>
            <DensityText role="headline" as="h2" className="mb-3">
              Same components. Different identity.
            </DensityText>
            <DensityText role="body" as="p" muted>
              Every preset applies a complete visual identity to the exact same
              component tree. Pick two and see the difference.
            </DensityText>
          </div>
          <PresetComparisonView />
        </SigilSection>

        <Divider pattern="vertical" size="md" showBorders />

        {/* How It Works */}
        <SigilSection space="hero">
          <div
            className="max-w-2xl"
            style={{
              marginBottom: "var(--s-section-header-block-margin-bottom, calc(1 * var(--s-grid-cell)))",
            }}
          >
            <MonoLabel
              className="block"
              style={{
                marginBottom: "var(--s-section-label-row-margin-bottom)",
              }}
            >
              How It Works
            </MonoLabel>
            <DensityText role="headline" as="h2">
              Three steps. Zero component edits.
            </DensityText>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-[5fr_4fr_3fr] gap-px"
            style={{
              background: "var(--s-border)",
              marginBottom: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))",
            }}
          >
            {STEPS.map((step) => (
              <CardCell
                key={step.number}
                title={step.title}
                footer={<MonoLabel variant="accent">{step.number}</MonoLabel>}
              >
                <TabularValue size="xs" muted as="div">
                  {step.description}
                </TabularValue>
              </CardCell>
            ))}
          </div>

          <AccentCTA asChild>
            <a href="/sandbox">Try in Sandbox</a>
          </AccentCTA>
        </SigilSection>

        <Divider pattern="diagonal" size="md" showBorders />
      </>

      <LandingFooter />
    </SigilFrame>
  );
}
