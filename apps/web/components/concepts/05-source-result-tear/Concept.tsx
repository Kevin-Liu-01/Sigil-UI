"use client";

import { sigilPreset } from "@sigil-ui/presets";
import { GripVertical } from "lucide-react";
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
import { TokenPipeline } from "../shared/ProductProof";
import type { ConceptPageProps } from "../shared/types";

const lines = [
  ["colors.primary", "oklch(0.66 0.18 275)"],
  ["typography.display", "PP Neue Montreal"],
  ["spacing.section", "var(--s-space-64)"],
  ["cards.hover", "lift"],
  ["motion.slow", "600ms"],
] as const;

function SourcePanel() {
  return (
    <div className="h-full bg-[var(--s-code-bg)] p-[var(--s-space-24)] md:p-[var(--s-space-48)]">
      <div className="flex items-center justify-between border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] pb-[var(--s-space-16)]"><span className="font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.18em]">DESIGN.md</span><span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">source</span></div>
      <div className="mt-[var(--s-space-32)] space-y-[var(--s-space-20)]">
        {lines.map(([key, value], index) => <p key={key} className="grid grid-cols-[auto_1fr] gap-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[var(--s-size-xs)]"><span className="tabular-nums text-[var(--s-text-subtle)]">{String(index + 1).padStart(2, "0")}</span><span><b className="text-[var(--s-primary)]">{key}</b>: <span className="text-[var(--s-code-string-color)]">{value}</span></span></p>)}
      </div>
    </div>
  );
}

function ResultPanel() {
  return (
    <div className="grid h-full place-items-center bg-[var(--s-surface)] p-[var(--s-space-24)] sm:grid-cols-2 md:p-[var(--s-space-48)]">
      <article className="w-full max-w-lg rounded-[var(--s-card-radius)] border-[length:var(--s-card-border-width)] border-[style:var(--s-border-style,solid)] border-[var(--s-card-border)] bg-[var(--s-card-background)] p-[var(--s-card-padding)] shadow-[var(--s-card-shadow)] sm:col-start-2">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-primary)]">Result / live surface</span>
        <h3 className="mt-[var(--s-space-20)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">One source of visual truth.</h3>
        <p className="mt-[var(--s-space-12)] max-w-sm text-pretty text-[var(--s-text-muted)]">This card does not know the preset. It only knows the constraints it inherits.</p>
        <div className="mt-[var(--s-space-24)] flex flex-wrap gap-[var(--s-space-12)]"><button type="button" className="min-h-11 bg-[var(--s-primary)] px-[var(--s-button-px)] text-[var(--s-primary-contrast)]">Primary</button><button type="button" className="min-h-11 border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-button-px)]">Outline</button></div>
      </article>
    </div>
  );
}

function SourceResultTear() {
  const [reveal, setReveal] = useState(48);
  const [mobileView, setMobileView] = useState<"source" | "result">("source");

  return (
    <div className="border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[var(--s-background)] shadow-[var(--s-shadow-xl)]">
      <div className="flex min-h-12 items-center justify-between gap-[var(--s-space-12)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em]">
        <span className="text-[var(--s-text-muted)]">Causal layer</span>
        <button
          type="button"
          onClick={() => {
            setMobileView((current) => current === "source" ? "result" : "source");
            setReveal((current) => current > 50 ? 32 : 68);
          }}
          className="min-h-10 px-[var(--s-space-12)] underline decoration-[var(--s-border-strong)] underline-offset-4 focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-[var(--s-focus-ring-color)]"
        >
          Swap source / result
        </button>
      </div>
      <div role="tablist" aria-label="Source and live result" className="grid grid-cols-2 border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] sm:hidden">
        {(["source", "result"] as const).map((view) => (
          <button
            key={view}
            id={`tear-${view}-tab`}
            role="tab"
            type="button"
            aria-controls={`tear-${view}-panel`}
            aria-selected={mobileView === view}
            onClick={() => setMobileView(view)}
            className={mobileView === view ? "min-h-12 bg-[var(--s-primary)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--s-primary-contrast)] focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-[var(--s-focus-ring-color)]" : "min-h-12 border-l-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--s-text-muted)] first:border-l-0 focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-[var(--s-focus-ring-color)]"}
          >
            {view === "source" ? "Source / DESIGN.md" : "Result / UI"}
          </button>
        ))}
      </div>
      <div id={`tear-${mobileView}-panel`} role="tabpanel" aria-labelledby={`tear-${mobileView}-tab`} className="min-h-[28rem] sm:hidden">
        {mobileView === "source" ? <SourcePanel /> : <ResultPanel />}
      </div>

      <div className="hidden sm:block">
        <div className="relative min-h-[32rem] overflow-hidden">
          <div className="absolute inset-0"><ResultPanel /></div>
          <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${reveal}%`, clipPath: "polygon(0 0, calc(100% - var(--s-space-16)) 0, 100% 7%, calc(100% - var(--s-space-8)) 15%, 100% 23%, calc(100% - var(--s-space-16)) 31%, 100% 39%, calc(100% - var(--s-space-8)) 47%, 100% 55%, calc(100% - var(--s-space-16)) 63%, 100% 71%, calc(100% - var(--s-space-8)) 79%, 100% 87%, calc(100% - var(--s-space-16)) 94%, 100% 100%, 0 100%)" }}>
            <div className="h-full min-w-[var(--s-content-max-narrow)]"><SourcePanel /></div>
          </div>
          <span aria-hidden className="pointer-events-none absolute inset-y-0 grid w-10 -translate-x-1/2 place-items-center" style={{ left: `${reveal}%` }}><span className="grid size-10 place-items-center rounded-[var(--s-radius-full)] border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[var(--s-background)] shadow-[var(--s-shadow-md)]"><GripVertical className="size-4" /></span></span>
        </div>
        <label className="flex min-h-14 items-center gap-[var(--s-space-16)] border-t-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em]">
          Less source
          <input type="range" aria-label="Reveal more or less DESIGN.md source" aria-valuetext={`${reveal}% source visible`} min="18" max="82" value={reveal} onChange={(event) => setReveal(Number(event.target.value))} className="h-[var(--s-control-track-height)] flex-1 accent-[var(--s-primary)]" />
          More source
        </label>
      </div>
    </div>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={sigilPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "" : "pt-12"}>
        <ConceptMasthead label="Causal reveal / 05" />
        <section className="grid gap-[var(--s-space-48)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:px-[var(--s-space-48)] lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:px-[var(--s-space-64)]">
          <div className="max-w-xl">
            <Eyebrow>Drag through cause and effect</Eyebrow>
            <h1 data-concept-intro className="mt-[var(--s-space-20)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),6vw,var(--s-heading-display-size))] font-semibold leading-[var(--s-heading-display-leading)]">The interface is inside the specification.</h1>
            <p data-concept-intro className="mt-[var(--s-space-24)] text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Pull back the finished surface and the source stays legible. Sigil removes the gap between written design intent and shipped UI.</p>
            <div data-concept-intro className="mt-[var(--s-space-32)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink>Read the spec</PrimaryLink><SecondaryLink>See components</SecondaryLink></div>
          </div>
          <div data-concept-intro><SourceResultTear /></div>
        </section>
        <StatsRail />
        <section data-concept-reveal className="px-[var(--s-space-16)] py-[var(--s-space-64)] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]"><TokenPipeline /></section>
        <ConceptFooter />
      </main>
    </ConceptRoot>
  );
}
