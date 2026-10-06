"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { marked } from "marked";
import {
  AccentActive,
  AccentCTA,
  BorderStack,
  DensityText,
  Divider,
  GapPixelCell,
  GapPixelGrid,
  MonoLabel,
  SigilSection,
  TabularValue,
} from "@sigil-ui/components";
import {
  compileDesignMd,
  type DesignDocument,
  type SigilPreset,
} from "@sigil-ui/tokens";
import { presetCatalog } from "@sigil-ui/presets";
import { ArrowLeft, Check, Copy, Download } from "@/components/icons";
import { LandingFooter } from "@/components/landing/footer";
import { LandingNavbar } from "@/components/landing/navbar";
import { SigilFrame } from "@/components/landing/sigil-frame";
import { SigilTokensProvider } from "@/components/sandbox/token-provider";
import { TextureBg } from "@/components/texture-bg";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";

type ViewMode = "preview" | "source";

const SKELETON_WIDTHS = [92, 74, 84, 61, 96, 70, 88, 65, 79, 94, 68, 86];

function resolveLight(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "light" in value) {
    return String((value as { light: unknown }).light);
  }
  return "var(--s-background)";
}

function createDesignDocument(preset: SigilPreset): DesignDocument {
  const entry = presetCatalog.find((item) => item.name === preset.name);
  const label = entry?.label ?? preset.name;
  const density = preset.tokens.pageRhythm?.density;

  return {
    metadata: {
      brand: label,
      tagline: preset.metadata.description,
      theme: "adaptive",
      preset: preset.name,
      density:
        density === "compact" || density === "editorial" ? density : "balanced",
      description: [preset.metadata.mood, preset.metadata.description]
        .filter(Boolean)
        .join(". "),
    },
    tokens: preset.tokens,
    components: [
      { name: "Button", description: "Primary action surface driven by button, color, border, radius, and motion tokens." },
      { name: "Card", description: "Content surface driven by card, spacing, shadow, border, and typography tokens." },
      { name: "Input", description: "Form control driven by input, focus, control, border, and color tokens." },
      { name: "Navigation", description: "Site navigation driven by navigation, alignment, and component-surface tokens." },
      { name: "Hero", description: "Page opening driven by hero, heading, layout, and section tokens." },
    ],
    surfaces: [
      { level: 0, name: "Background", value: resolveLight(preset.tokens.colors.background), purpose: "Base page canvas" },
      { level: 1, name: "Surface", value: resolveLight(preset.tokens.colors.surface), purpose: "Cards and grouped content" },
      { level: 2, name: "Elevated", value: resolveLight(preset.tokens.colors["surface-elevated"]), purpose: "Menus, popovers, and overlays" },
    ],
    dos: [
      "Edit token intent before component styling.",
      "Use var(--s-*) custom properties for every visual value.",
      "Keep spacing on the preset scale and layout on the Sigil rail grid.",
      "Use the preset motion durations and easing curves.",
      "Preserve all 33 token categories in custom presets.",
    ],
    donts: [
      "Do not hardcode colors, radii, spacing, shadows, or animation durations in components.",
      "Do not add a second border where a section or grid primitive already owns the edge.",
      "Do not collapse structural gutter space because its decorative pattern is hidden.",
      "Do not ship a partial preset or a partial DESIGN.md export.",
    ],
    imagery: "Use restrained, high-contrast imagery that follows the media radius, border, outline, shadow, and object-fit tokens.",
    layout: "Compose pages with SigilPage/SigilFrame, SigilSection, token-driven gutters, and explicit divider bands. Content aligns to the shared rail grid.",
    similarBrands: entry
      ? [`${entry.category}: ${entry.mood}`, `${entry.fonts.display} / ${entry.fonts.body} / ${entry.fonts.mono}`]
      : [],
  };
}

function DesignPage({ preset, loading }: { preset: SigilPreset | null; loading: boolean }) {
  const params = useParams();
  const name = params.name as string;
  const entry = useMemo(() => presetCatalog.find((item) => item.name === name), [name]);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  const designMd = useMemo(
    () => (preset ? compileDesignMd(createDesignDocument(preset)) : ""),
    [preset],
  );
  const renderedMarkdown = useMemo(
    () => marked.parse(designMd, { gfm: true }) as string,
    [designMd],
  );
  const lineCount = designMd ? designMd.split("\n").length : 0;

  async function copyToClipboard() {
    await navigator.clipboard.writeText(designMd);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function downloadFile() {
    const url = URL.createObjectURL(new Blob([designMd], { type: "text/markdown" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "DESIGN.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <SigilFrame>
      <LandingNavbar />
      <BorderStack borders="none">
        <SigilSection borderTop space="hero" className="relative overflow-hidden">
          <TextureBg opacity={0.2} />
          <div className="relative z-[1] max-w-4xl">
            <Link
              href={`/presets/${name}`}
              className="mb-6 inline-flex items-center gap-1.5 text-[var(--s-text-muted)] no-underline transition-colors duration-[var(--s-duration-fast)] hover:text-[var(--s-text)]"
            >
              <ArrowLeft size={14} />
              <MonoLabel size="sm">{entry?.label ?? name} Preset</MonoLabel>
            </Link>

            <h1 className="mb-3 font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-3xl),4vw,var(--s-size-5xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)] text-[var(--s-text)]">
              <span className="text-[var(--s-primary)]">DESIGN.md</span>{" "}
              <span className="text-[var(--s-text-muted)]">/ {entry?.label ?? name}</span>
            </h1>

            <DensityText role="body" as="p" muted className="mb-5 max-w-[var(--s-prose-max)]">
              The canonical, compilable design reference for this preset. It includes every token category plus CSS, Tailwind v4, and W3C output.
            </DensityText>

            {!loading && preset && (
              <div className="flex flex-wrap items-center gap-3">
                <AccentCTA onClick={downloadFile}>
                  <Download size={14} /> Download DESIGN.md
                </AccentCTA>
                <button type="button" onClick={copyToClipboard} className="border-0 bg-transparent p-0">
                  <AccentActive className="inline-flex min-h-[var(--s-control-height)] items-center gap-2 px-[var(--s-button-px)]">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <MonoLabel size="sm">{copied ? "Copied" : "Copy Source"}</MonoLabel>
                  </AccentActive>
                </button>
                <TabularValue size="xs" muted>
                  {lineCount} lines · {SIGIL_PRODUCT_STATS.tokenCount} tokens · {SIGIL_PRODUCT_STATS.categoryCount} categories
                </TabularValue>
              </div>
            )}
          </div>
        </SigilSection>

        <Divider pattern="vertical" size="md" showBorders />

        {!loading && preset && (
          <SigilSection space="compact">
            <GapPixelGrid columns={{ md: 3 }}>
              {[
                ["1. Download", "Save the canonical file as DESIGN.md in your project root."],
                ["2. Compile", "Run sigil design compile for CSS, Tailwind, and W3C output."],
                ["3. Customize", "Edit token intent in markdown, then run sigil design sync."],
              ].map(([title, body]) => (
                <GapPixelCell key={title} className="p-[var(--s-card-padding-sm)]">
                  <MonoLabel size="sm" className="mb-2 block text-[var(--s-text-muted)]">{title}</MonoLabel>
                  <TabularValue size="xs" muted as="p">{body}</TabularValue>
                </GapPixelCell>
              ))}
            </GapPixelGrid>
          </SigilSection>
        )}

        <Divider pattern="diagonal" size="md" showBorders />

        <SigilSection space="normal">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <MonoLabel variant="accent" className="mb-2 block">Canonical output</MonoLabel>
              <DensityText role="headline" as="h2">The complete design specification.</DensityText>
            </div>
            {!loading && (
              <div className="flex gap-2" role="tablist" aria-label="DESIGN.md view">
                {(["preview", "source"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="tab"
                    aria-selected={viewMode === mode}
                    onClick={() => setViewMode(mode)}
                    className="border-0 bg-transparent p-0"
                  >
                    <AccentActive active={viewMode === mode} className="px-3 py-1.5">
                      <MonoLabel size="sm" variant={viewMode === mode ? "accent" : "muted"}>{mode}</MonoLabel>
                    </AccentActive>
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col gap-3" aria-label="Loading DESIGN.md">
              {SKELETON_WIDTHS.map((width, index) => (
                <div key={index} className="h-4 animate-pulse bg-[var(--s-surface)]" style={{ width: `${width}%` }} />
              ))}
            </div>
          ) : !preset ? (
            <DensityText role="body" muted>Preset not found.</DensityText>
          ) : viewMode === "preview" ? (
            <article
              className="design-markdown border border-[style:var(--s-border-style)] border-[color:var(--s-border-muted)] bg-[var(--s-surface)]"
              dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
            />
          ) : (
            <pre className="overflow-x-auto whitespace-pre-wrap break-words border border-[style:var(--s-border-style)] border-[color:var(--s-border-muted)] bg-[var(--s-surface)] p-[var(--s-card-padding)] font-[family-name:var(--s-font-mono)] text-[var(--s-code-font-size)] leading-[var(--s-code-line-height)] text-[var(--s-text-secondary)]">
              {designMd}
            </pre>
          )}
        </SigilSection>

        <Divider pattern="diagonal" size="md" showBorders />
      </BorderStack>
      <LandingFooter />
    </SigilFrame>
  );
}

export default function PresetDesignClient() {
  const params = useParams();
  const name = params.name as string;
  const [preset, setPreset] = useState<SigilPreset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    import("@sigil-ui/presets")
      .then((mod) => {
        const loader = (mod.presets as Record<string, () => Promise<SigilPreset>>)[name];
        if (!loader) throw new Error(`Preset "${name}" not found`);
        return loader();
      })
      .then((nextPreset) => {
        if (!cancelled) setPreset(nextPreset);
      })
      .catch(() => {
        if (!cancelled) setPreset(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (!preset) return <DesignPage preset={null} loading={loading} />;

  return (
    <SigilTokensProvider initialPreset={preset} styleTagAttr="data-sigil-preset-design">
      <DesignPage preset={preset} loading={false} />
    </SigilTokensProvider>
  );
}
