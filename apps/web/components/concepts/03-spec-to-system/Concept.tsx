"use client";

import { cruxPreset } from "@sigil-ui/presets";
import { ArrowRight, GripVertical } from "lucide-react";
import { useState } from "react";
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

const sourceRows = [
  ["primary", "oklch(0.66 0.18 275)"],
  ["display", "PP Neue Montreal"],
  ["card.radius", "8px"],
  ["motion.fast", "160ms"],
] as const;

function SourceView() {
  return (
    <div className="h-full bg-[var(--s-background)] p-[var(--s-space-24)]">
      <div className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]"># DESIGN.md</div>
      <div className="mt-[var(--s-space-24)] space-y-[var(--s-space-16)]">
        {sourceRows.map(([key, value], index) => (
          <div key={key} className="grid grid-cols-[auto_1fr] gap-[var(--s-space-16)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] pb-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[var(--s-size-xs)]">
            <span className="tabular-nums text-[var(--s-text-subtle)]">{String(index + 1).padStart(2, "0")}</span>
            <span><b className="text-[var(--s-primary)]">{key}</b>: {value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultView() {
  return (
    <div className="grid h-full place-items-center bg-[var(--s-code-bg)] p-[var(--s-space-24)] sm:grid-cols-2">
      <article className="w-full max-w-md rounded-[var(--s-card-radius)] border-[length:var(--s-card-border-width)] border-[style:var(--s-border-style,solid)] border-[var(--s-card-border)] bg-[var(--s-card-background)] p-[var(--s-card-padding)] shadow-[var(--s-card-shadow)] sm:col-start-2">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--s-primary)]">Compiled surface</span>
        <h3 className="mt-[var(--s-space-16)] font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)] font-semibold">Every decision has a source.</h3>
        <p className="mt-[var(--s-space-12)] text-[var(--s-text-muted)]">No scattered classes. No visual drift.</p>
        <button type="button" className="mt-[var(--s-space-24)] min-h-11 bg-[var(--s-primary)] px-[var(--s-button-px)] text-[var(--s-primary-contrast)] active:scale-[0.97]">Compile design</button>
      </article>
    </div>
  );
}

function SplitProof() {
  const [split, setSplit] = useState(50);
  const [mobileView, setMobileView] = useState<"source" | "result">("source");

  return (
    <div className="border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[var(--s-surface)]">
      <div className="flex min-h-12 items-center justify-between gap-[var(--s-space-12)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em]">
        <span className="text-[var(--s-text-muted)]">Direct comparison</span>
        <button
          type="button"
          onClick={() => {
            setMobileView((current) => current === "source" ? "result" : "source");
            setSplit((current) => current > 50 ? 35 : 65);
          }}
          className="min-h-10 px-[var(--s-space-12)] underline decoration-[var(--s-border-strong)] underline-offset-4 focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-[var(--s-focus-ring-color)]"
        >
          Flip source / result
        </button>
      </div>
      <div role="tablist" aria-label="Specification and compiled result" className="grid grid-cols-2 border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] sm:hidden">
        {(["source", "result"] as const).map((view) => (
          <button
            key={view}
            id={`spec-${view}-tab`}
            role="tab"
            type="button"
            aria-controls={`spec-${view}-panel`}
            aria-selected={mobileView === view}
            onClick={() => setMobileView(view)}
            className={mobileView === view ? "min-h-12 bg-[var(--s-primary)] px-[var(--s-space-16)] text-[var(--s-primary-contrast)] focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-[var(--s-focus-ring-color)]" : "min-h-12 border-l-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] text-[var(--s-text-muted)] first:border-l-0 focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-[var(--s-focus-ring-color)]"}
          >
            {view === "source" ? "Source / DESIGN.md" : "Result / component"}
          </button>
        ))}
      </div>
      <div id={`spec-${mobileView}-panel`} role="tabpanel" aria-labelledby={`spec-${mobileView}-tab`} className="min-h-96 sm:hidden">
        {mobileView === "source" ? <SourceView /> : <ResultView />}
      </div>

      <div className="hidden sm:block">
        <div className="grid grid-cols-2 border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em]">
          <span className="px-[var(--s-space-16)] py-[var(--s-space-12)]">Source / DESIGN.md</span>
          <span className="border-l-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] py-[var(--s-space-12)]">Result / component</span>
        </div>
        <div className="relative min-h-96 overflow-hidden bg-[var(--s-code-bg)]">
          <div className="absolute inset-0"><ResultView /></div>
          <div className="absolute inset-y-0 left-0 overflow-hidden border-r-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)]" style={{ width: `${split}%` }}>
            <div className="h-full min-w-[var(--s-hero-content-max)]"><SourceView /></div>
          </div>
          <span aria-hidden className="pointer-events-none absolute inset-y-0 grid w-8 -translate-x-1/2 place-items-center" style={{ left: `${split}%` }}><GripVertical className="size-5 bg-[var(--s-background)] text-[var(--s-text)]" /></span>
        </div>
        <label className="flex min-h-14 items-center gap-[var(--s-space-16)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em]">
          Less source
          <input aria-label="Reveal more or less DESIGN.md source" aria-valuetext={`${split}% source visible`} type="range" min="20" max="80" value={split} onChange={(event) => setSplit(Number(event.target.value))} className="h-[var(--s-control-track-height)] flex-1 accent-[var(--s-primary)]" />
          More source
        </label>
      </div>
    </div>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={cruxPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "" : "pt-12"}>
        <ConceptMasthead label="Direct comparison / 03" />
        <section className="grid gap-[var(--s-space-48)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:px-[var(--s-space-48)] lg:grid-cols-[0.72fr_1.28fr] lg:px-[var(--s-space-64)]">
          <div className="max-w-xl lg:sticky lg:top-[var(--s-space-64)] lg:self-start">
            <Eyebrow>Specification <ArrowRight aria-hidden className="ml-[var(--s-space-8)] inline size-3" /> system</Eyebrow>
            <h1 data-concept-intro className="mt-[var(--s-space-20)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),6vw,var(--s-heading-display-size))] font-semibold leading-[var(--s-heading-display-leading)]">Source on the left. Proof on the right.</h1>
            <p data-concept-intro className="mt-[var(--s-space-24)] text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Drag the divider. The mechanism stays in view: written constraints become production UI without a translation layer.</p>
            <div data-concept-intro className="mt-[var(--s-space-32)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink>Read DESIGN.md</PrimaryLink><SecondaryLink>Browse output</SecondaryLink></div>
          </div>
          <div data-concept-intro><SplitProof /></div>
        </section>
        <StatsRail />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[1fr_0.9fr] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]"><TokenPipeline vertical /><ComponentProof /></section>
        <ConceptFooter />
      </main>
    </ConceptRoot>
  );
}
