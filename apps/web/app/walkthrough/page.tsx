"use client";

import { useState } from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { OklchText } from "@/components/oklch-text";
import { SigilFrame } from "@/components/landing/sigil-frame";
import { Terminal } from "@/components/landing/terminal";
import { TokenPipelineDiagram } from "@/components/landing/token-pipeline";
import { LayerStackDiagram } from "@/components/landing/layer-stack";
import { ComponentAnatomyDiagram } from "@/components/landing/component-anatomy";
import { PresetComparisonView } from "@/components/landing/preset-comparison";
import { MarkdownEditorPreview } from "@/components/landing/markdown-editor";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
import { TextureBg } from "@/components/texture-bg";

import {
  SigilSection,
  Divider,
  GapPixelGrid,
  GapPixelCell,
  MonoLabel,
  TabularValue,
  DensityText,
  AccentCTA,
  CardCell,
  BorderStack,
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Switch,
  Progress,
} from "@sigil-ui/components";

/* ================================================================ */
/* Step component                                                      */
/* ================================================================ */

function Step({
  number,
  label,
  heading,
  description,
  children,
}: {
  number: string;
  label: string;
  heading: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <SigilSection>
      <div
        className="flex items-start gap-6"
        style={{
          marginBottom: "var(--s-section-header-block-margin-bottom, calc(1 * var(--s-grid-cell)))",
        }}
      >
        <div
          className="shrink-0 w-12 h-12 flex items-center justify-center border border-[var(--s-primary)]"
          style={{ background: "color-mix(in oklch, var(--s-primary) 10%, transparent)" }}
        >
          <TabularValue size="lg" className="font-bold text-[var(--s-primary)]">{number}</TabularValue>
        </div>
        <div>
          <MonoLabel variant="accent" className="block mb-2">{label}</MonoLabel>
          <h2 className="font-[family-name:var(--s-font-display)] text-[clamp(20px,3vw,32px)] font-bold tracking-tight leading-[1.15] text-[var(--s-text)] mb-2">
            {heading}
          </h2>
          <DensityText role="body" as="p" muted className="leading-relaxed max-w-xl">
            {description}
          </DensityText>
        </div>
      </div>
      {children}
    </SigilSection>
  );
}

/* ================================================================ */
/* Code block                                                          */
/* ================================================================ */

function CodeBlock({
  filename,
  children,
}: {
  filename?: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="overflow-hidden"
      style={{ border: "1px solid var(--s-border)", background: "var(--s-surface)" }}
    >
      {filename && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid var(--s-border)" }}
        >
          <MonoLabel size="xs">{filename}</MonoLabel>
          <button
            type="button"
            onClick={handleCopy}
            className="bg-transparent border-0 cursor-pointer p-0"
          >
            <MonoLabel size="xs" variant={copied ? "accent" : "muted"}>
              {copied ? "Copied!" : "Copy"}
            </MonoLabel>
          </button>
        </div>
      )}
      <pre
        className="font-[family-name:var(--s-font-mono)] text-[13px] leading-[1.8] p-4 m-0 overflow-x-auto"
        style={{ color: "var(--s-text)" }}
      >
        {children}
      </pre>
    </div>
  );
}

/* ================================================================ */
/* Terminal data for each step                                         */
/* ================================================================ */

const INIT_LINES = [
  { text: "npx create-sigil-app my-app", prefix: "$", color: "var(--s-text)", delay: 600 },
  { text: "", delay: 300 },
  { text: "? What is your project about?  SaaS product", prefix: "?", color: "var(--s-primary)", delay: 500 },
  { text: "? Which preset?  sigil (structural, engineering)", prefix: "?", color: "var(--s-primary)", delay: 500 },
  { text: "", delay: 200 },
  { text: "Scaffolding project...", prefix: "◌", color: "var(--s-text-muted)", delay: 600 },
  { text: "Created sigil.config.ts", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Created sigil.tokens.md", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Generated token CSS (300+ variables)", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Installed @sigil-ui/components", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Installed @sigil-ui/presets", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "", delay: 200 },
  { text: "Done in 3.2s. Run: cd my-app && npm run dev", prefix: "✓", color: "var(--s-success)", delay: 300 },
];

const PRESET_CREATE_LINES = [
  { text: "sigil preset create", prefix: "$", color: "var(--s-text)", delay: 600 },
  { text: "", delay: 300 },
  { text: "? Preset name:  meridian", prefix: "?", color: "var(--s-primary)", delay: 500 },
  { text: "? Start from:  sigil (structural)", prefix: "?", color: "var(--s-primary)", delay: 500 },
  { text: "? Primary color:  #4f46e5 → oklch(0.53 0.21 275)", prefix: "?", color: "var(--s-primary)", delay: 500 },
  { text: "? Display font:  \"Inter\", system-ui, sans-serif", prefix: "?", color: "var(--s-primary)", delay: 500 },
  { text: "? Border radius:  8px (rounded)", prefix: "?", color: "var(--s-primary)", delay: 500 },
  { text: "", delay: 200 },
  { text: "Created presets/meridian.ts", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Updated sigil.tokens.md (519 fields)", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Regenerated CSS variables", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "", delay: 200 },
  { text: "Custom preset meridian is now active.", prefix: "✓", color: "var(--s-success)", delay: 300 },
];

const PRESET_LIST_LINES = [
  { text: "sigil preset list", prefix: "$", color: "var(--s-text)", delay: 600 },
  { text: "", delay: 200 },
  { text: "Structural   sigil · kova · cobalt · helix · hex", prefix: " ", color: "var(--s-text-muted)", delay: 200 },
  { text: "Minimal      crux · axiom · arc · mono", prefix: " ", color: "var(--s-text-muted)", delay: 200 },
  { text: "Dark         basalt · onyx · fang · obsid · cipher · noir", prefix: " ", color: "var(--s-text-muted)", delay: 200 },
  { text: "Colorful     flux · shard · prism · vex · dsgn · dusk", prefix: " ", color: "var(--s-text-muted)", delay: 200 },
  { text: "Editorial    etch · rune · strata · glyph · mrkr", prefix: " ", color: "var(--s-text-muted)", delay: 200 },
  { text: "Industrial   alloy · forge · anvil · rivet · brass", prefix: " ", color: "var(--s-text-muted)", delay: 200 },
  { text: "Custom       meridian (active)", prefix: "★", color: "var(--s-primary)", delay: 400 },
];

const ADD_LINES = [
  { text: "sigil add button card input badge", prefix: "$", color: "var(--s-text)", delay: 600 },
  { text: "", delay: 200 },
  { text: "Added Button → src/components/ui/Button.tsx", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Added Card → src/components/ui/Card.tsx", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Added Input → src/components/ui/Input.tsx", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "Added Badge → src/components/ui/Badge.tsx", prefix: "✓", color: "var(--s-success)", delay: 400 },
  { text: "", delay: 200 },
  { text: "4 components added. All read from var(--s-*).", prefix: "✓", color: "var(--s-success)", delay: 300 },
];

const DOCTOR_LINES = [
  { text: "sigil doctor", prefix: "$", color: "var(--s-text)", delay: 600 },
  { text: "", delay: 200 },
  { text: "Config        sigil.config.ts found", prefix: "✓", color: "var(--s-success)", delay: 300 },
  { text: "Tokens        sigil.tokens.md (519 fields)", prefix: "✓", color: "var(--s-success)", delay: 300 },
  { text: "CSS           Token CSS imported in layout", prefix: "✓", color: "var(--s-success)", delay: 300 },
  { text: "Components    4 installed, 0 outdated", prefix: "✓", color: "var(--s-success)", delay: 300 },
  { text: "Dependencies  @sigil-ui/components@1.0.0", prefix: "✓", color: "var(--s-success)", delay: 300 },
  { text: "Preset        noir (active)", prefix: "✓", color: "var(--s-success)", delay: 300 },
  { text: "", delay: 200 },
  { text: "All checks passed. Project is healthy.", prefix: "✓", color: "var(--s-success)", delay: 300 },
];

/* ================================================================ */
/* Page                                                               */
/* ================================================================ */

export default function WalkthroughPage() {
  return (
    <SigilFrame>
      <LandingNavbar />

      {/* Hero */}
      <SigilSection borderTop space="hero" className="relative overflow-hidden">
        <TextureBg opacity={0.3} />
        <div className="relative z-[1]">

        <h1 className="font-[family-name:var(--s-font-display)] font-bold text-[clamp(32px,5vw,56px)] leading-[1.08] tracking-[-0.03em] text-[var(--s-text)] mb-4 max-w-3xl">
          From Zero to Production in 7 Steps.
        </h1>

        <DensityText
          role="body"
          as="p"
          muted
          className="max-w-xl leading-relaxed"
          style={{
            marginBottom: "var(--s-section-header-block-margin-bottom, calc(1 * var(--s-grid-cell)))",
          }}
        >
          A complete walkthrough of building with Sigil — from first install to
          shipping a fully token-driven product page. Each step includes interactive
          visualizations so you understand the system, not just the commands.
        </DensityText>

        {/* Progress bar */}
        <GapPixelGrid columns={{ sm: 2, md: 4, lg: 7 }} className="mb-4">
          {["Install", "Understand", "Define Preset", "Add Components", "Fine-Tune", "Build Pages", "Ship"].map((step, i) => (
            <GapPixelCell key={step} className="p-3 text-center">
              <TabularValue size="xs" className="block">{String(i + 1).padStart(2, "0")}</TabularValue>
              <MonoLabel size="xs" className="mt-1 block">{step}</MonoLabel>
            </GapPixelCell>
          ))}
        </GapPixelGrid>
        </div>
      </SigilSection>

      <Divider pattern="vertical" size="md" showBorders />

      {/* ---- Step 1: Install ---- */}
      <Step
        number="01"
        label="INSTALL"
        heading="Create a new Sigil project."
        description="One command scaffolds everything: config file, token markdown, CSS variables, and your first preset. Works with Next.js, Remix, Vite, Astro, and more."
      >
        <GapPixelGrid columns={{ md: 2 }}>
          <GapPixelCell className="p-0">
            <Terminal lines={INIT_LINES} title="~/ — zsh" />
          </GapPixelCell>
          <GapPixelCell className="p-6">
            <MonoLabel variant="accent" className="block mb-4">WHAT JUST HAPPENED</MonoLabel>
            <div className="flex flex-col gap-4">
              {[
                { file: "sigil.config.ts", desc: "Project config — framework detection, component output path, active preset" },
                { file: "sigil.tokens.md", desc: `Markdown overrides for the ${SIGIL_PRODUCT_STATS.tokenCount}-token system` },
                { file: "globals.css", desc: "CSS custom properties compiled from your token layer" },
                { file: "package.json", desc: "@sigil-ui/components and @sigil-ui/presets added as dependencies" },
              ].map((item) => (
                <div key={item.file} className="border-b border-[var(--s-border)] pb-3">
                  <MonoLabel size="sm" className="block mb-1">{item.file}</MonoLabel>
                  <DensityText role="body" as="p" muted className="text-xs">{item.desc}</DensityText>
                </div>
              ))}
            </div>
          </GapPixelCell>
        </GapPixelGrid>
      </Step>

      <Divider pattern="diagonal" size="md" showBorders />

      {/* ---- Step 2: Understand the system ---- */}
      <Step
        number="02"
        label="UNDERSTAND"
        heading="Same components you trust. One layer for agents to edit."
        description="Sigil's components are built on Radix + Base UI primitives — accessible, composable headless patterns. The token layer is the thin, agent-friendly control surface on top. Humans and AI agents both edit sigil.tokens.md; the components never change."
      >
        <LayerStackDiagram />

        <div className="mt-12">
          <MonoLabel variant="accent" className="block mb-4">THE COMPILATION PIPELINE</MonoLabel>
          <DensityText
            role="body"
            as="p"
            muted
            className="max-w-xl leading-relaxed"
            style={{ marginBottom: "var(--s-section-content-gap)" }}
          >
            Your token markdown file compiles into CSS custom properties. Every component
            reads those properties via <code className="text-[var(--s-primary)]">var(--s-*)</code>.
            Change the source, everything downstream updates.
          </DensityText>
          <TokenPipelineDiagram />
        </div>
      </Step>

      <Divider pattern="diagonal" size="md" showBorders />

      {/* ---- Step 3: Define your preset ---- */}
      <Step
        number="03"
        label="DEFINE YOUR PRESET"
        heading={`Create your own — or start from ${SIGIL_PRODUCT_STATS.presetCount}.`}
        description="Your project needs its own visual identity. Create a custom preset interactively, fork a curated one as a starting point, or edit sigil.tokens.md directly. The file is yours — presets are just starting points."
      >
        {/* Three paths */}
        <GapPixelGrid columns={{ md: 3 }} className="mb-12">
          <GapPixelCell className="p-6 border-l-2 border-l-[var(--s-primary)]">
            <MonoLabel variant="accent" className="block mb-3">RECOMMENDED: CREATE CUSTOM</MonoLabel>
            <DensityText role="body" as="p" muted className="mb-3">
              Interactive scaffolding asks for your brand colors, fonts, and radius preference.
              Generates a complete token preset that you own.
            </DensityText>
            <div
              className="font-[family-name:var(--s-font-mono)] text-[12px] p-2"
              style={{ background: "var(--s-surface)", border: "1px solid var(--s-border)" }}
            >
              $ sigil preset create
            </div>
          </GapPixelCell>
          <GapPixelCell className="p-6">
            <MonoLabel className="block mb-3">FORK A CURATED PRESET</MonoLabel>
            <DensityText role="body" as="p" muted className="mb-3">
              Start from one of {SIGIL_PRODUCT_STATS.presetCount} presets, then customize. The preset writes to your
              token file — you can change any value afterward.
            </DensityText>
            <div
              className="font-[family-name:var(--s-font-mono)] text-[12px] p-2"
              style={{ background: "var(--s-surface)", border: "1px solid var(--s-border)" }}
            >
              $ sigil preset noir
            </div>
          </GapPixelCell>
          <GapPixelCell className="p-6">
            <MonoLabel className="block mb-3">EDIT TOKENS DIRECTLY</MonoLabel>
            <DensityText role="body" as="p" muted className="mb-3">
              Open sigil.tokens.md and set core values yourself. Full control through the token
              layer — from colors to motion.
            </DensityText>
            <div
              className="font-[family-name:var(--s-font-mono)] text-[12px] p-2"
              style={{ background: "var(--s-surface)", border: "1px solid var(--s-border)" }}
            >
              vim sigil.tokens.md
            </div>
          </GapPixelCell>
        </GapPixelGrid>

        {/* Custom preset creation terminal */}
        <MonoLabel variant="accent" className="block mb-4">CREATING A CUSTOM PRESET</MonoLabel>
        <DensityText
          role="body"
          as="p"
          muted
          className="max-w-xl leading-relaxed"
          style={{ marginBottom: "var(--s-section-content-gap)" }}
        >
          <code className="text-[var(--s-primary)]">sigil preset create</code> walks you through
          naming your preset, choosing a base, setting brand colors and fonts, and writing the result
          to your token file. Your project uses <em>your</em> preset — not a library preset.
        </DensityText>
        <div
          className="max-w-[720px]"
          style={{ marginBottom: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))" }}
        >
          <Terminal lines={PRESET_CREATE_LINES} title="~/ my-app — zsh" />
        </div>

        {/* What your token file looks like after */}
        <GapPixelGrid
          columns={{ md: 2 }}
          style={{ marginBottom: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))" }}
        >
          <GapPixelCell className="p-6">
            <MonoLabel variant="accent" className="block mb-3">YOUR sigil.tokens.md (AFTER)</MonoLabel>
            <div
              className="font-[family-name:var(--s-font-mono)] text-[11px] leading-[1.8] p-4"
              style={{ background: "var(--s-surface)", border: "1px solid var(--s-border)" }}
            >
              <div className="font-semibold text-[var(--s-text)]">## Colors</div>
              <div className="text-[var(--s-text-muted)]">primary: <span className="text-[var(--s-primary)]"><OklchText>{"oklch(0.53 0.21 275)"}</OklchText></span></div>
              <div className="text-[var(--s-text-muted)]"><OklchText>{"primary-hover: oklch(0.48 0.21 275)"}</OklchText></div>
              <div className="text-[var(--s-text-muted)]"><OklchText>{"background: oklch(0.13 0.02 260)"}</OklchText></div>
              <div className="text-[var(--s-text-muted)]"><OklchText>{"surface: oklch(0.17 0.02 260)"}</OklchText></div>
              <div className="text-[var(--s-text-muted)]"><OklchText>{"border: oklch(0.25 0.02 260)"}</OklchText></div>
              <div>&nbsp;</div>
              <div className="font-semibold text-[var(--s-text)]">## Typography</div>
              <div className="text-[var(--s-text-muted)]">font-display: <span className="text-[var(--s-primary)]">{'"Inter", system-ui, sans-serif'}</span></div>
              <div className="text-[var(--s-text-muted)]">font-body: "Inter", system-ui, sans-serif</div>
              <div className="text-[var(--s-text-muted)]">font-mono: "JetBrains Mono", monospace</div>
              <div>&nbsp;</div>
              <div className="font-semibold text-[var(--s-text)]">## Radius</div>
              <div className="text-[var(--s-text-muted)]">md: <span className="text-[var(--s-primary)]">8px</span></div>
              <div className="text-[var(--s-text-muted)]">...</div>
              <div className="text-[var(--s-text-subtle)] text-[10px] mt-2">519 fields total — you control all of them</div>
            </div>
          </GapPixelCell>
          <GapPixelCell className="p-6">
            <MonoLabel variant="accent" className="block mb-3">WHY THIS IS FASTER</MonoLabel>
            <div className="flex flex-col gap-4">
              {[
                { label: "One file vs. dozens", desc: "Edit 1 markdown file instead of hunting through 350+ token-driven components. One change propagates everywhere." },
                { label: "Agent-friendly", desc: "AI agents read sigil.tokens.md, make targeted edits, and get deterministic visual output. Fewer LLM tokens, zero drift." },
                { label: "No vendor lock-in", desc: "Your preset lives in your repo. Not a config in someone else's library — a markdown file you can read, diff, and version." },
                { label: "Instant visual refresh", desc: "Change a token, CSS recompiles, every component updates. No manual search-and-replace across files." },
              ].map((item) => (
                <div key={item.label} className="border-b border-[var(--s-border)] pb-3">
                  <DensityText role="detail" as="span" className="font-semibold block mb-1">{item.label}</DensityText>
                  <DensityText role="chrome" as="span" muted>{item.desc}</DensityText>
                </div>
              ))}
            </div>
          </GapPixelCell>
        </GapPixelGrid>

        {/* Curated presets as secondary option */}
        <MonoLabel className="block mb-4">OR BROWSE 44 CURATED PRESETS</MonoLabel>
        <DensityText
            role="body"
            as="p"
            muted
            className="max-w-xl leading-relaxed"
            style={{ marginBottom: "var(--s-section-content-gap)" }}
          >
          Don't want to start from scratch? Use a curated preset as your base — then customize.
          Click the preset pills below to compare visual identities.
        </DensityText>
        <PresetComparisonView />

        <div
          className="max-w-[720px]"
          style={{ marginTop: "var(--s-section-gap)" }}
        >
          <Terminal lines={PRESET_LIST_LINES} title="~/ my-app — zsh" />
        </div>

        <div style={{ marginTop: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))" }}>
          <GapPixelGrid columns={{ md: 3 }}>
            {[
              { family: "Structural", presets: "sigil · kova · cobalt · helix · hex", desc: "Engineering precision, grids, measurements" },
              { family: "Minimal", presets: "crux · axiom · arc · mono", desc: "Maximum whitespace, clean, few elements" },
              { family: "Dark", presets: "basalt · onyx · fang · obsid · cipher · noir", desc: "Deep blacks, cinematic, dramatic" },
              { family: "Colorful", presets: "flux · shard · prism · vex · dsgn · dusk", desc: "Gradients, vibrant accents, playful" },
              { family: "Editorial", presets: "etch · rune · strata · glyph · mrkr", desc: "Typography-forward, print-inspired" },
              { family: "Industrial", presets: "alloy · forge · anvil · rivet · brass", desc: "Metallic, mechanical, utilitarian" },
            ].map((cat) => (
              <GapPixelCell key={cat.family} className="p-5">
                <DensityText role="nav" as="h3" className="font-semibold mb-1">{cat.family}</DensityText>
                <MonoLabel size="xs" className="block mb-2">{cat.presets}</MonoLabel>
                <DensityText role="body" as="p" muted className="text-xs">{cat.desc}</DensityText>
              </GapPixelCell>
            ))}
          </GapPixelGrid>
        </div>
      </Step>

      <Divider pattern="vertical" size="md" showBorders />

      {/* ---- Step 4: Add components ---- */}
      <Step
        number="04"
        label="ADD COMPONENTS"
        heading="Import what you need."
        description="Components are copied into your project so you own the code. Every component reads from var(--s-*) tokens — no hardcoded colors, fonts, or spacing."
      >
        <div
          className="max-w-[720px]"
          style={{ marginBottom: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))" }}
        >
          <Terminal lines={ADD_LINES} title="~/ my-app — zsh" />
        </div>

        <MonoLabel variant="accent" className="block mb-4">HOW COMPONENTS CONSUME TOKENS</MonoLabel>
        <DensityText
            role="body"
            as="p"
            muted
            className="max-w-xl leading-relaxed"
            style={{ marginBottom: "var(--s-section-content-gap)" }}
          >
          A Button reads <code className="text-[var(--s-primary)]">--s-primary</code> for fill,{" "}
          <code className="text-[var(--s-primary)]">--s-radius-md</code> for corners,{" "}
          <code className="text-[var(--s-primary)]">--s-duration-fast</code> for transitions.
          Change any token and the button updates instantly.
        </DensityText>
        <ComponentAnatomyDiagram />

        <div style={{ marginTop: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))" }}>
          <GapPixelGrid columns={{ md: 4 }}>
            {[
              { name: "Button", variants: "9 variants", cat: "UI" },
              { name: "Card", variants: "5 parts", cat: "UI" },
              { name: "Input", variants: "3 sizes", cat: "Forms" },
              { name: "Badge", variants: "6 variants", cat: "UI" },
              { name: "Tabs", variants: "4 parts", cat: "Navigation" },
              { name: "Dialog", variants: "7 parts", cat: "Overlays" },
              { name: "GapPixelGrid", variants: "responsive", cat: "Layout" },
              { name: "Terminal", variants: "animated", cat: "UI" },
            ].map((comp) => (
              <GapPixelCell key={comp.name} className="p-4">
                <DensityText role="detail" as="span" className="font-semibold block">{comp.name}</DensityText>
                <div className="flex items-center justify-between mt-2">
                  <MonoLabel size="xs">{comp.variants}</MonoLabel>
                  <MonoLabel size="xs" variant="accent">{comp.cat}</MonoLabel>
                </div>
              </GapPixelCell>
            ))}
          </GapPixelGrid>
          <DensityText role="body" as="p" muted className="mt-4">
            350+ token-driven components across 14 categories. <a href="/components" className="text-[var(--s-primary)] no-underline">Browse the full library →</a>
          </DensityText>
        </div>
      </Step>

      <Divider pattern="diagonal" size="md" showBorders />

      {/* ---- Step 5: Edit tokens ---- */}
      <Step
        number="05"
        label="FINE-TUNE YOUR PRESET"
        heading="Your token file is your design system."
        description="Whether you created a custom preset or forked a curated one, sigil.tokens.md is now yours to fine-tune. Change any of 519 fields — colors, fonts, spacing, radius, shadows, motion — and every component updates instantly. This is how you build a unique visual identity without touching component code."
      >
        <MarkdownEditorPreview />

        <div style={{ marginTop: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))" }}>
          <MonoLabel variant="accent" className="block mb-4">519 CONFIGURABLE FIELDS</MonoLabel>
          <GapPixelGrid columns={{ sm: 2, md: 4 }}>
            {[
              { category: "Colors", count: "35", example: "primary, surface, border, text, status" },
              { category: "Typography", count: "31", example: "font stacks, sizes, weights, leading" },
              { category: "Spacing", count: "25", example: "button, card, input, section padding" },
              { category: "Layout", count: "22", example: "content widths, margins, grid, bento" },
              { category: "Radius", count: "16", example: "none → sm → md → lg → xl → full" },
              { category: "Shadows", count: "14", example: "sm, md, lg, glow, colored, inner" },
              { category: "Motion", count: "18", example: "durations, easings, hover, press, stagger" },
              { category: "Borders", count: "11", example: "widths, styles, card, button, input" },
            ].map((cat) => (
              <GapPixelCell key={cat.category} className="p-4">
                <div className="flex items-baseline justify-between mb-2">
                  <DensityText role="detail" as="span" className="font-semibold">{cat.category}</DensityText>
                  <TabularValue size="xs">{cat.count}</TabularValue>
                </div>
                <MonoLabel size="xs" className="block">{cat.example}</MonoLabel>
              </GapPixelCell>
            ))}
          </GapPixelGrid>
        </div>
      </Step>

      <Divider pattern="vertical" size="md" showBorders />

      {/* ---- Step 6: Build pages ---- */}
      <Step
        number="06"
        label="BUILD PAGES"
        heading="Compose with the playbook."
        description="Ten compositional rules that make any page 'just work'. Gap-pixel grids, mono labels, border stacks, density text — the structural vocabulary of every Sigil page."
      >
        <GapPixelGrid
          columns={{ md: 2 }}
          style={{ marginBottom: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))" }}
        >
          <GapPixelCell className="p-0">
            <CodeBlock filename="app/pricing/page.tsx">
{`import {
  SigilFrame, SigilSection, GapPixelGrid,
  GapPixelCell, MonoLabel, TabularValue,
  AccentCTA, DensityText, CardCell,
} from "@sigil-ui/components";

export default function PricingPage() {
  return (
    <SigilFrame>
      <SigilSection borderTop>
        <MonoLabel variant="accent">/ Pricing</MonoLabel>
        <DensityText role="headline" as="h1">
          Simple, transparent pricing.
        </DensityText>

        <GapPixelGrid columns={{ md: 3 }}>
          <CardCell
            title="Starter"
            footer={<MonoLabel>Free forever</MonoLabel>}
          >
            <TabularValue size="xl">$0</TabularValue>
          </CardCell>
          <CardCell
            title="Pro"
            footer={<MonoLabel>Per month</MonoLabel>}
          >
            <TabularValue size="xl">$49</TabularValue>
          </CardCell>
          <CardCell
            title="Enterprise"
            footer={<MonoLabel>Custom</MonoLabel>}
          >
            <TabularValue size="xl">Custom</TabularValue>
          </CardCell>
        </GapPixelGrid>

        <AccentCTA>Get Started</AccentCTA>
      </SigilSection>
    </SigilFrame>
  );
}`}
            </CodeBlock>
          </GapPixelCell>
          <GapPixelCell className="p-6">
            <MonoLabel variant="accent" className="block mb-4">THE 10 PLAYBOOK RULES</MonoLabel>
            <div className="flex flex-col gap-3">
              {[
                { num: "01", name: "Gap-Pixel Grid", desc: "Hairline-divided cells via gap-px" },
                { num: "02", name: "Mono Label", desc: "Uppercase mono for all chrome text" },
                { num: "03", name: "Border Stack", desc: "Sections separated by borders, not spacing" },
                { num: "04", name: "Accent Singleton", desc: "One color breaks the monochrome" },
                { num: "05", name: "Tabular Values", desc: "Mono tabular-nums for all data" },
                { num: "06", name: "Featured Grid", desc: "Hero item + collection layout" },
                { num: "07", name: "Density DNA", desc: "Type scale: 10px chrome → 2xl headline" },
                { num: "08", name: "Frosted Panel", desc: "Backdrop-blur drawers and navbars" },
                { num: "09", name: "Card Cell", desc: "Cards designed for gap-pixel grids" },
                { num: "10", name: "Universal Shell", desc: "5-column: margin|gutter|content|gutter|margin" },
              ].map((rule) => (
                <div key={rule.num} className="flex items-start gap-3 border-b border-[var(--s-border)] pb-2">
                  <TabularValue size="xs" className="text-[var(--s-primary)] shrink-0 mt-0.5">{rule.num}</TabularValue>
                  <div>
                    <DensityText role="detail" as="span" className="font-semibold block">{rule.name}</DensityText>
                    <DensityText role="chrome" as="span" muted>{rule.desc}</DensityText>
                  </div>
                </div>
              ))}
            </div>
          </GapPixelCell>
        </GapPixelGrid>

        <DensityText role="body" as="p" muted className="mt-6">
          See the playbook in action across <a href="/demos" className="text-[var(--s-primary)] no-underline">17 production templates →</a>
        </DensityText>
      </Step>

      <Divider pattern="diagonal" size="md" showBorders />

      {/* ---- Step 7: Ship ---- */}
      <Step
        number="07"
        label="VALIDATE & SHIP"
        heading="Run doctor. Deploy."
        description="sigil doctor validates your entire setup — config, tokens, CSS, components, dependencies, and active preset. Green across the board means you're ready to ship."
      >
        <div
          className="max-w-[720px]"
          style={{ marginBottom: "var(--s-section-subsection-gap, calc(2 * var(--s-grid-cell)))" }}
        >
          <Terminal lines={DOCTOR_LINES} title="~/ my-app — zsh" />
        </div>

        <GapPixelGrid columns={{ md: 3 }}>
          <GapPixelCell className="p-5">
            <MonoLabel variant="accent" className="block mb-3">PRE-SHIP CHECKLIST</MonoLabel>
            <div className="flex flex-col gap-2">
              {[
                "sigil doctor passes",
                "No hardcoded hex in components",
                `All text uses font-[family-name:var(--s-font-${"*"})]`,
                "Spacing uses var(--s-space-*) or var(--s-*-padding)",
                "Radius uses var(--s-radius-*)",
                "Shadows use var(--s-shadow-*)",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-[var(--s-success)] text-xs">✓</span>
                  <DensityText role="chrome" as="span" muted>{item}</DensityText>
                </div>
              ))}
            </div>
          </GapPixelCell>
          <GapPixelCell className="p-5">
            <MonoLabel variant="accent" className="block mb-3">ONGOING MAINTENANCE</MonoLabel>
            <div className="flex flex-col gap-2">
              {[
                "sigil diff → see token changes since last sync",
                "sigil preset <name> → switch visual identity",
                "sigil add <component> → add new components",
                "Edit sigil.tokens.md → rebuild token CSS",
                "sigil doctor → revalidate health",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-[var(--s-text-muted)] text-xs mt-0.5">→</span>
                  <DensityText role="chrome" as="span" muted>{item}</DensityText>
                </div>
              ))}
            </div>
          </GapPixelCell>
          <GapPixelCell className="p-5">
            <MonoLabel variant="accent" className="block mb-3">AGENT-FRIENDLY</MonoLabel>
            <DensityText role="body" as="p" muted className="text-xs mb-3">
              AI agents use sigil.tokens.md as a contract. They edit the markdown,
              the compiler produces deterministic CSS, and components update without drift.
            </DensityText>
            <DensityText role="body" as="p" muted className="text-xs">
              <code className="text-[var(--s-primary)]">sigil init</code> generates{" "}
              <code className="text-[var(--s-primary)]">.sigil/AGENTS.md</code> with
              instructions for any AI coding agent.
            </DensityText>
          </GapPixelCell>
        </GapPixelGrid>
      </Step>

      <Divider pattern="vertical" size="md" showBorders />

      {/* Final CTA */}
      <SigilSection space="normal">
        <div className="text-center mx-auto max-w-xl">
          <h2 className="font-[family-name:var(--s-font-display)] text-[clamp(28px,4vw,48px)] font-bold tracking-tight leading-[1.1] text-[var(--s-text)] mb-4">
            Ready to build?
          </h2>
          <DensityText
            role="body"
            as="p"
            muted
            className="mx-auto max-w-md leading-relaxed"
            style={{
              marginBottom: "var(--s-section-header-block-margin-bottom, calc(1 * var(--s-grid-cell)))",
            }}
          >
            You've seen the full workflow. One file, {SIGIL_PRODUCT_STATS.tokenCount} tokens, {SIGIL_PRODUCT_STATS.componentCountLabel} token-driven components, {SIGIL_PRODUCT_STATS.presetCount} presets.
            The design system that compiles from a token layer.
          </DensityText>
          <div
            className="flex items-center justify-center gap-3 flex-wrap"
            style={{
              marginBottom: "var(--s-section-header-block-margin-bottom, calc(1 * var(--s-grid-cell)))",
            }}
          >
            <AccentCTA size="lg" asChild>
              <a href="/docs" className="no-underline">Get Started</a>
            </AccentCTA>
            <a
              href="/sandbox"
              className="inline-flex items-center px-6 py-3 bg-transparent text-[var(--s-text)] font-[family-name:var(--s-font-mono)] text-[14px] font-medium border border-[var(--s-border)] no-underline transition-all duration-[var(--s-duration-fast,200ms)] hover:bg-[var(--s-surface)]"
            >
              Open Sandbox
            </a>
          </div>

          <CodeBlock>npx create-sigil-app</CodeBlock>
        </div>
      </SigilSection>

      <LandingFooter />
    </SigilFrame>
  );
}
