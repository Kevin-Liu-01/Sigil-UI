"use client";

import { kovaPreset } from "@sigil-ui/presets";
import { useState } from "react";
import { cn } from "@sigil-ui/components";
import {
  ConceptFooter,
  ConceptMasthead,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
  StatsRail,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import { ComponentProof, TokenPipeline } from "../shared/ProductProof";
import type { ConceptPageProps } from "../shared/types";

const nodes = [
  "colors.primary",
  "typography.display",
  "spacing.section",
  "layout.gutter",
  "radius.card",
  "shadows.panel",
  "motion.fast",
  "borders.strong",
  "buttons.active-scale",
  "cards.hover-effect",
  "navigation.height",
  "backgrounds.pattern",
  "focus.ring",
  "dataViz.series-1",
  "hero.grid-columns",
  "pageRhythm.density",
] as const;

function ReticleGrid({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <div className="relative w-full border border-[var(--s-border-strong)] bg-[var(--s-surface-sunken)] p-[var(--s-space-20)] shadow-[var(--s-shadow-lg)]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-[var(--s-primary)] opacity-40" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-dashed border-[var(--s-primary)] opacity-40" />
      <div className="relative grid grid-cols-4 gap-px bg-[var(--s-border)]">
        {nodes.map((node, index) => (
          <button
            key={node}
            type="button"
            aria-label={`Inspect ${node}`}
            aria-pressed={active === index}
            onClick={() => onSelect(index)}
            className={cn(
              "group relative aspect-square min-h-20 bg-[var(--s-background)] transition-[background-color,transform] duration-[var(--s-duration-fast)] active:scale-[0.96]",
              active === index && "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]",
            )}
          >
            <span aria-hidden className="absolute left-1/2 top-1/2 size-[var(--s-cross-arm)] -translate-x-1/2 -translate-y-1/2 border border-[currentColor] opacity-60" />
            <span className="absolute bottom-[var(--s-space-8)] left-[var(--s-space-8)] font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums opacity-60">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DiagnosticReadout({ active }: { active: number }) {
  const token = nodes[active];
  return (
    <aside aria-live="polite" className="self-stretch border border-[var(--s-border)] bg-[var(--s-code-bg)]">
      <div className="flex items-center justify-between border-b border-[var(--s-border)] p-[var(--s-space-12)]">
        <Eyebrow>Reticle target</Eyebrow>
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-success)]">LOCKED</span>
      </div>
      <div className="p-[var(--s-space-20)]">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)]">Signal {String(active + 1).padStart(2, "0")}</span>
        <p className="mt-[var(--s-space-16)] break-words font-[family-name:var(--s-font-mono)] text-[var(--s-size-lg)] text-[var(--s-code-string-color)]">{token}</p>
        <dl className="mt-[var(--s-space-32)] grid grid-cols-2 gap-px bg-[var(--s-border)]">
          <div className="bg-[var(--s-background)] p-[var(--s-space-12)]">
            <dt className="text-[10px] uppercase text-[var(--s-text-muted)]">Status</dt>
            <dd className="mt-[var(--s-space-8)] font-[family-name:var(--s-font-mono)] text-[var(--s-size-sm)]">Inherited</dd>
          </div>
          <div className="bg-[var(--s-background)] p-[var(--s-space-12)]">
            <dt className="text-[10px] uppercase text-[var(--s-text-muted)]">Consumers</dt>
            <dd className="mt-[var(--s-space-8)] font-[family-name:var(--s-font-mono)] text-[var(--s-size-sm)] tabular-nums">System-wide</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

function MachineHero() {
  const [active, setActive] = useState(10);
  return (
    <section className="grid min-h-[calc(100dvh-3rem)] border-b border-[var(--s-border)] lg:grid-cols-[0.72fr_1.28fr]">
      <div className="flex flex-col justify-between border-b border-[var(--s-border)] p-[var(--s-space-24)] pt-[var(--s-space-64)] md:p-[var(--s-space-48)] md:pt-[var(--s-space-80)] lg:border-b-0 lg:border-r">
        <div data-concept-intro>
          <Eyebrow>Reticle Machine Room</Eyebrow>
          <h1 className="mt-[var(--s-space-20)] max-w-xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),7vw,var(--s-size-6xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)]">
            The grid is the machine.
          </h1>
          <p className="mt-[var(--s-space-24)] max-w-lg text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">
            Structural visibility is an active control surface. Target any signal to inspect the constraint feeding every downstream component.
          </p>
        </div>
        <div data-concept-intro className="mt-[var(--s-space-48)] flex flex-wrap gap-[var(--s-space-12)]">
          <PrimaryLink href="/docs/theming">Inspect the system</PrimaryLink>
          <SecondaryLink href="/components">Open components</SecondaryLink>
        </div>
      </div>
      <div className="grid content-start gap-[var(--s-space-16)] p-[var(--s-space-16)] pt-[var(--s-space-32)] md:p-[var(--s-space-24)] md:pt-[var(--s-space-48)] xl:grid-cols-[minmax(30rem,1.45fr)_minmax(15rem,0.55fr)] xl:items-stretch">
        <ReticleGrid active={active} onSelect={setActive} />
        <DiagnosticReadout active={active} />
      </div>
    </section>
  );
}

function MachineBody() {
  return (
    <>
      <ConceptMasthead label="Machine room / systems nominal" />
      <main>
        <MachineHero />
        <StatsRail />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] border-b border-[var(--s-border)] p-[var(--s-space-24)] md:p-[var(--s-space-48)] xl:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Signal path</Eyebrow>
            <h2 className="mt-[var(--s-space-16)] max-w-lg text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">One source. Four verified outputs.</h2>
            <p className="mt-[var(--s-space-16)] max-w-md text-pretty leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">DESIGN.md compiles into CSS custom properties, Tailwind v4, W3C JSON, and the component layer.</p>
          </div>
          <TokenPipeline />
        </section>
        <section data-concept-reveal className="p-[var(--s-space-24)] md:p-[var(--s-space-48)]">
          <ComponentProof />
        </section>
      </main>
      <ConceptFooter />
    </>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={kovaPreset} compare={mode === "compare"} className="pt-12">
      <MachineBody />
    </ConceptRoot>
  );
}
