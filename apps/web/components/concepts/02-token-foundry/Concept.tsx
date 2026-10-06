"use client";

import { alloyPreset } from "@sigil-ui/presets";
import { Factory, FileCode2, PackageCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  ConceptFooter,
  ConceptMasthead,
  CopyCommand,
  Eyebrow,
  PrimaryLink,
  StatsRail,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import type { ConceptPageProps } from "../shared/types";

const productionStages = [
  { label: "Read DESIGN.md", detail: "33 categories", Icon: FileCode2 },
  { label: "Resolve constraints", detail: "519 fields", Icon: Factory },
  { label: "Compile targets", detail: "CSS · Tailwind · W3C", Icon: Sparkles },
  { label: "Ship components", detail: "350+ ready", Icon: PackageCheck },
] as const;

function ProductionRail() {
  const [complete, setComplete] = useState(1);
  const advance = () => setComplete((current) => (current >= productionStages.length ? 1 : current + 1));

  return (
    <div className="border-[length:var(--s-border-medium)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[var(--s-surface)] shadow-[var(--s-shadow-lg)]">
      <div className="flex items-center justify-between border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] py-[var(--s-space-12)]">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em]">Foundry line / A</span>
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-text-muted)]">{complete}/4 online</span>
      </div>
      <ol>
        {productionStages.map(({ label, detail, Icon }, index) => {
          const isComplete = index < complete;
          return (
            <li key={label} className="grid grid-cols-[auto_1fr_auto] items-center gap-[var(--s-space-16)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] p-[var(--s-space-16)] last:border-b-0">
              <span className={isComplete ? "grid size-10 place-items-center bg-[var(--s-primary)] text-[var(--s-primary-contrast)]" : "grid size-10 place-items-center border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] text-[var(--s-text-muted)]"}>
                <Icon aria-hidden className="size-4" />
              </span>
              <div>
                <p className="font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)] font-semibold">{label}</p>
                <p className="mt-[var(--s-space-4)] font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{detail}</p>
              </div>
              <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--s-text-muted)]">{isComplete ? "ready" : "queued"}</span>
            </li>
          );
        })}
      </ol>
      <button type="button" onClick={advance} className="min-h-12 w-full bg-[var(--s-text)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--s-background)] transition-transform duration-[var(--s-duration-fast)] active:scale-[0.99] motion-reduce:active:scale-100 motion-reduce:transition-none">
        {complete === productionStages.length ? "Reset production line" : "Advance compile"}
      </button>
    </div>
  );
}

function OutputStamp() {
  return (
    <div className="relative min-h-72 overflow-hidden border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] bg-[var(--s-code-bg)] p-[var(--s-space-24)]">
      <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_var(--s-space-12),var(--s-border-muted)_var(--s-space-12),var(--s-border-muted)_var(--s-space-16))] opacity-30" />
      <div className="relative grid min-h-56 place-items-center border-[length:var(--s-border-medium)] border-[style:var(--s-border-style,solid)] border-[var(--s-primary)] text-center">
        <div>
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--s-text-muted)]">Inspection passed</span>
          <p className="mt-[var(--s-space-12)] font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-bold uppercase">Zero drift</p>
        </div>
      </div>
    </div>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={alloyPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "" : "pt-12"}>
        <ConceptMasthead label="Foundry operations / 02" />
        <section className="grid min-h-[calc(100dvh-var(--s-band-height))] gap-[var(--s-space-48)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[0.88fr_1.12fr] md:items-center md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
          <div className="max-w-2xl">
            <Eyebrow>Input / transformation / output</Eyebrow>
            <h1 className="mt-[var(--s-space-20)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),7vw,var(--s-heading-display-size))] font-bold uppercase leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-tracking)]">One file enters. A system leaves.</h1>
            <p className="mt-[var(--s-space-24)] max-w-xl text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Sigil turns a human-readable specification into production constraints every component obeys.</p>
            <div className="mt-[var(--s-space-32)]"><PrimaryLink href="/docs">Tour the foundry</PrimaryLink></div>
            <div className="mt-[var(--s-space-20)] max-w-lg"><CopyCommand /></div>
          </div>
          <div><ProductionRail /></div>
        </section>
        <StatsRail />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[1.15fr_0.85fr] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
          <OutputStamp />
          <div className="flex flex-col justify-between border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] p-[var(--s-space-24)]">
            <Eyebrow>Closed-loop manufacturing</Eyebrow>
            <div>
              <h2 className="text-balance font-[family-name:var(--s-font-display)] text-[var(--s-heading-h2-size)] font-[var(--s-heading-h2-weight)] leading-[var(--s-heading-h2-leading)]">Change the mold once.</h2>
              <p className="mt-[var(--s-space-16)] text-pretty text-[var(--s-text-muted)]">Presets populate every field. Compilers generate every target. Components consume only the result.</p>
            </div>
          </div>
        </section>
        <ConceptFooter />
      </main>
    </ConceptRoot>
  );
}
