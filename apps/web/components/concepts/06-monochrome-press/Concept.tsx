"use client";

import { monoPreset } from "@sigil-ui/presets";
import { ArrowDownRight } from "lucide-react";
import {
  ConceptFooter,
  CopyCommand,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
import type { ConceptPageProps } from "../shared/types";

const pressFacts = [
  [SIGIL_PRODUCT_STATS.componentCountLabel, "production components"],
  [String(SIGIL_PRODUCT_STATS.presetCount), "complete visual identities"],
  [String(SIGIL_PRODUCT_STATS.tokenCount), "fields in one specification"],
] as const;

function PressMasthead() {
  return (
    <header className="grid border-b-[length:var(--s-border-thick)] border-[style:var(--s-border-style,solid)] border-[var(--s-text)] md:grid-cols-[1fr_auto]">
      <div className="px-[var(--s-space-16)] py-[var(--s-space-12)] md:px-[var(--s-space-24)]"><span className="font-[family-name:var(--s-font-display)] text-[var(--s-size-xl)] font-black uppercase tracking-[var(--s-heading-tracking)]">Sigil System Press</span></div>
      <div className="border-t-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-text)] px-[var(--s-space-16)] py-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] md:border-l md:border-t-0">Vol. 01 / Design as constraints</div>
    </header>
  );
}

function PressFacts() {
  return (
    <section id="press-facts" className="scroll-mt-[var(--s-space-48)] border-y-[length:var(--s-border-thick)] border-[style:var(--s-border-style,solid)] border-[var(--s-text)]">
      {pressFacts.map(([value, label], index) => (
        <article key={label} data-concept-reveal className="grid gap-[var(--s-space-16)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-text)] px-[var(--s-space-16)] py-[var(--s-space-32)] last:border-b-0 md:grid-cols-[0.45fr_1fr] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
          <span className="font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),10vw,calc(var(--s-heading-display-size)_+_var(--s-size-4xl)))] font-black leading-[var(--s-heading-display-leading)] tabular-nums">{value}</span>
          <div className="flex items-end justify-between gap-[var(--s-space-24)]"><p className="max-w-xl font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)] font-semibold uppercase leading-tight">{label}</p><span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums">0{index + 1}</span></div>
        </article>
      ))}
    </section>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={monoPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "" : "pt-12"}>
        <PressMasthead />
        <section className="grid min-h-[calc(100dvh-var(--s-band-height)-var(--s-space-64))] border-b-[length:var(--s-border-thick)] border-[style:var(--s-border-style,solid)] border-[var(--s-text)] lg:grid-cols-[1.35fr_0.65fr]">
          <div className="flex flex-col justify-between px-[var(--s-space-16)] py-[var(--s-space-48)] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
            <Eyebrow className="text-[var(--s-text)]">Edition / 06 / Monochrome Press</Eyebrow>
            <h1 data-concept-intro className="my-[var(--s-space-32)] max-w-[var(--s-content-max-wide)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),10vw,calc(var(--s-heading-display-size)_+_var(--s-size-4xl)))] font-black uppercase leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-tracking)]">A design system, printed with pressure.</h1>
            <div data-concept-intro className="grid gap-[var(--s-space-24)] md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)]">One markdown file typesets the whole edition: color, typography, spacing, radius, motion, composition, and every production component.</p>
              <ArrowDownRight aria-hidden className="size-12" />
            </div>
            <div data-concept-intro className="mt-[var(--s-space-24)] flex flex-wrap items-center justify-between gap-[var(--s-space-12)] border-t-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-text)] pt-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em]">
              <span className="text-[var(--s-text-muted)]">npx create-sigil-app@latest</span>
              <a href="#press-facts" className="inline-flex min-h-11 items-center gap-[var(--s-space-8)] px-[var(--s-space-8)] underline decoration-[var(--s-border-strong)] underline-offset-4 focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-[var(--s-focus-ring-color)]">
                Scroll / read the proof <ArrowDownRight aria-hidden className="size-3" />
              </a>
            </div>
          </div>
          <aside className="flex flex-col justify-between border-t-[length:var(--s-border-thick)] border-[style:var(--s-border-style,solid)] border-[var(--s-text)] p-[var(--s-space-24)] lg:border-l lg:border-t-0">
            <div className="space-y-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase leading-[var(--s-leading-relaxed)] tracking-[0.14em]"><p>Source: DESIGN.md</p><p>Output: CSS / Tailwind / W3C JSON</p><p>Method: token-only components</p></div>
            <div className="mt-[var(--s-space-48)]"><CopyCommand /></div>
          </aside>
        </section>
        <PressFacts />
        <section data-concept-reveal className="grid gap-[var(--s-space-32)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[0.85fr_1.15fr] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
          <Eyebrow className="text-[var(--s-text)]">The editorial argument</Eyebrow>
          <div><h2 className="text-balance font-[family-name:var(--s-font-display)] text-[var(--s-heading-h2-size)] font-black uppercase leading-[var(--s-heading-h2-leading)]">Constraints make taste repeatable.</h2><p className="mt-[var(--s-space-20)] max-w-2xl text-pretty text-[var(--s-text-muted)]">References explain what good looks like. Sigil makes off-brand output structurally difficult.</p><div className="mt-[var(--s-space-32)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink>Read the architecture</PrimaryLink><SecondaryLink href="/presets">Review every edition</SecondaryLink></div></div>
        </section>
        <ConceptFooter />
      </main>
    </ConceptRoot>
  );
}
