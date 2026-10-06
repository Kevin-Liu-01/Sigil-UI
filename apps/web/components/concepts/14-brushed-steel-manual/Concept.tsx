"use client";

import { rivetPreset } from "@sigil-ui/presets";
import { useState } from "react";
import { cn } from "@sigil-ui/components";
import {
  ConceptFooter,
  ConceptMasthead,
  CopyCommand,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
  StatsRail,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import type { ConceptPageProps } from "../shared/types";

const chapters = [
  { number: "01", title: "Source", label: "Author DESIGN.md", detail: "A readable specification defines all 519 fields across 33 categories." },
  { number: "02", title: "Compile", label: "Generate outputs", detail: "Compile the same source into CSS custom properties, Tailwind v4, and W3C JSON." },
  { number: "03", title: "Consume", label: "Bind components", detail: "More than 350 React components inherit the active constraints without local overrides." },
  { number: "04", title: "Verify", label: "Run the doctor", detail: "Validate configuration, tokens, dependencies, imports, and preset integrity before shipping." },
] as const;

function ManualDiagram({ active }: { active: number }) {
  const chapter = chapters[active];
  return (
    <figure className="relative min-h-[26rem] overflow-hidden border border-[var(--s-border-strong)] bg-[repeating-linear-gradient(104deg,var(--s-surface-sunken)_0,var(--s-surface-sunken)_1px,var(--s-surface-elevated)_2px,var(--s-surface-sunken)_5px)] p-[var(--s-space-20)] shadow-[var(--s-shadow-lg)]">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(var(--s-grid-line-color)_var(--s-border-thin),transparent_var(--s-border-thin))] opacity-[var(--s-bg-pattern-opacity)] [background-size:100%_var(--s-grid-cell)]" />
      <div className="relative flex min-h-[22rem] flex-col justify-between border border-[var(--s-border)] bg-[var(--s-background)] p-[var(--s-space-16)]">
        <div className="flex items-start justify-between">
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)]">Figure {chapter.number}.A</span>
          <span className="border border-[var(--s-border)] px-[var(--s-space-8)] py-[var(--s-space-4)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase">{chapter.title}</span>
        </div>
        <div className="mx-auto grid w-full max-w-lg grid-cols-[1fr_auto_1fr] items-center gap-[var(--s-space-12)]">
          <div className="border border-[var(--s-border-strong)] bg-[var(--s-background)] p-[var(--s-space-16)]">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-primary)]">INPUT</span>
            <p className="mt-[var(--s-space-16)] font-[family-name:var(--s-font-display)] text-[var(--s-size-lg)] font-semibold">{active === 0 ? "DESIGN.md" : "Validated tokens"}</p>
          </div>
          <div aria-hidden className="flex items-center">
            <span className="h-px w-[var(--s-space-24)] bg-[var(--s-border-strong)]" />
            <span className="size-[var(--s-space-12)] rotate-45 border-r border-t border-[var(--s-border-strong)]" />
          </div>
          <div className="border-[length:var(--s-border-medium)] border-[var(--s-primary)] bg-[var(--s-primary)] p-[var(--s-space-16)] text-[var(--s-primary-contrast)] shadow-[var(--s-shadow-lg)]">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] opacity-70">OUTPUT</span>
            <p className="mt-[var(--s-space-16)] font-[family-name:var(--s-font-display)] text-[var(--s-size-lg)] font-semibold">{chapter.label}</p>
          </div>
        </div>
        <figcaption className="max-w-lg text-pretty text-[var(--s-size-sm)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">{chapter.detail}</figcaption>
      </div>
    </figure>
  );
}

function ChapterTabs({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <nav aria-label="Manual chapters" className="border border-[var(--s-border)] bg-[var(--s-background)]">
      {chapters.map((chapter, index) => (
        <button
          key={chapter.number}
          type="button"
          aria-pressed={active === index}
          onClick={() => onSelect(index)}
          className={cn(
            "grid min-h-16 w-full grid-cols-[auto_1fr] items-center gap-[var(--s-space-16)] px-[var(--s-space-16)] text-left transition-[background-color,transform] duration-[var(--s-duration-fast)] active:scale-[0.98]",
            index > 0 && "border-t border-[var(--s-border)]",
            active === index && "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]",
          )}
        >
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums opacity-70">{chapter.number}</span>
          <span>
            <strong className="block font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)]">{chapter.title}</strong>
            <small className="mt-[var(--s-space-4)] block font-[family-name:var(--s-font-mono)] text-[10px] uppercase opacity-60">{chapter.label}</small>
          </span>
        </button>
      ))}
    </nav>
  );
}

function ManualWorkbench() {
  const [active, setActive] = useState(0);
  return (
    <section data-concept-reveal className="grid gap-[var(--s-space-16)] border-b border-[var(--s-border)] bg-[var(--s-surface-sunken)] p-[var(--s-space-16)] md:p-[var(--s-space-24)] lg:grid-cols-[16rem_1fr]">
      <ChapterTabs active={active} onSelect={setActive} />
      <ManualDiagram active={active} />
    </section>
  );
}

function ManualHero() {
  return (
    <section className="grid border-b border-[var(--s-border)] lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="p-[var(--s-space-24)] pt-[var(--s-space-64)] md:p-[var(--s-space-48)] md:pt-[var(--s-space-80)]">
        <div data-concept-intro>
          <Eyebrow>Brushed Steel Manual / rev. 14</Eyebrow>
          <h1 className="mt-[var(--s-space-20)] max-w-3xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),8vw,var(--s-size-6xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)]">
            The product manual is the product.
          </h1>
          <p className="mt-[var(--s-space-24)] max-w-xl text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">Sigil exposes the mechanism. Every input, transformation, and output is documented well enough for humans and agents to operate safely.</p>
        </div>
        <div data-concept-intro className="mt-[var(--s-space-48)] flex flex-wrap gap-[var(--s-space-12)]">
          <PrimaryLink href="/docs">Open the manual</PrimaryLink>
          <SecondaryLink href="/components">Inspect parts</SecondaryLink>
        </div>
      </div>
      <aside className="relative overflow-hidden border-t border-[var(--s-border)] bg-[repeating-linear-gradient(104deg,var(--s-surface-sunken)_0,var(--s-surface-sunken)_1px,var(--s-surface-elevated)_2px,var(--s-surface-sunken)_5px)] p-[var(--s-space-16)] lg:border-l lg:border-t-0 lg:p-[var(--s-space-24)]">
        <span aria-hidden className="absolute left-[var(--s-space-8)] top-[var(--s-space-8)] size-2 rounded-[var(--s-radius-full)] border border-[var(--s-border-strong)] bg-[var(--s-background)]" />
        <span aria-hidden className="absolute bottom-[var(--s-space-8)] right-[var(--s-space-8)] size-2 rounded-[var(--s-radius-full)] border border-[var(--s-border-strong)] bg-[var(--s-background)]" />
        <div className="grid h-full grid-cols-[auto_1fr] items-end gap-x-[var(--s-space-20)] gap-y-[var(--s-space-8)] border border-[var(--s-border-strong)] bg-[var(--s-background)] p-[var(--s-space-16)] shadow-[var(--s-shadow-lg)] lg:min-h-64 lg:grid-cols-1 lg:items-stretch lg:p-[var(--s-space-20)]">
          <span className="col-span-2 font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)] lg:col-span-1">Field guide / plate 14</span>
          <p className="font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-semibold tabular-nums lg:self-end">519</p>
          <p className="max-w-xs text-pretty text-[var(--s-size-sm)] text-[var(--s-text-muted)] lg:self-end">Configurable fields, maintained as one coherent operating system.</p>
        </div>
      </aside>
    </section>
  );
}

function ManualBody() {
  return (
    <>
      <ConceptMasthead label="Operating instructions / issue 14" />
      <main>
        <ManualHero />
        <StatsRail />
        <ManualWorkbench />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] p-[var(--s-space-24)] md:p-[var(--s-space-48)] lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Eyebrow>Routine inspection</Eyebrow>
            <h2 className="mt-[var(--s-space-16)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">Run the doctor before release.</h2>
          </div>
          <CopyCommand command="npx @sigil-ui/cli doctor" />
        </section>
      </main>
      <ConceptFooter />
    </>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={rivetPreset} compare={mode === "compare"} className="pt-12">
      <ManualBody />
    </ConceptRoot>
  );
}
