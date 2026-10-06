"use client";

import { etchPreset } from "@sigil-ui/presets";
import { useState } from "react";
import { cn } from "@sigil-ui/components";
import {
  ConceptFooter,
  ConceptMasthead,
  CopyCommand,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import { DesignSpecPanel } from "../shared/ProductProof";
import type { ConceptPageProps } from "../shared/types";

function MaterialSwitch({ carbonFirst, onToggle }: { carbonFirst: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={carbonFirst}
      onClick={onToggle}
      className="inline-flex min-h-11 items-center gap-[var(--s-space-12)] border border-[var(--s-border-strong)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] transition-transform duration-[var(--s-duration-fast)] active:scale-[0.96]"
    >
      <span className={cn("size-[var(--s-space-12)] border border-[var(--s-border-strong)]", carbonFirst ? "bg-[var(--s-text)]" : "bg-[var(--s-background)]")} />
      Invert materials
    </button>
  );
}

function BonePage({ carbon }: { carbon: boolean }) {
  return (
    <article className={cn("flex min-h-[34rem] flex-col justify-between p-[var(--s-space-24)] transition-[background-color,color] duration-[var(--s-duration-normal)] md:p-[var(--s-space-48)]", carbon ? "bg-[var(--s-text)] text-[var(--s-background)]" : "bg-[var(--s-background)] text-[var(--s-text)]")}>
      <div>
        <span className={cn("font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.2em]", carbon ? "opacity-70" : "text-[var(--s-text-muted)]")}>
          {carbon ? <><span className="dark:hidden">Carbon</span><span className="hidden dark:inline">Bone</span></> : <><span className="dark:hidden">Bone</span><span className="hidden dark:inline">Carbon</span></>} / readable source
        </span>
        <h2 className="mt-[var(--s-space-32)] max-w-md text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-semibold leading-[var(--s-leading-tight)]">The softest surface can hold the hardest rules.</h2>
        <p className={cn("mt-[var(--s-space-20)] max-w-md text-pretty leading-[var(--s-leading-relaxed)]", carbon ? "opacity-75" : "text-[var(--s-text-secondary)]")}>DESIGN.md remains plain enough to read, review, diff, and hand to another agent.</p>
      </div>
      <blockquote className="mt-[var(--s-space-48)] border-l-[length:var(--s-border-thick)] border-[var(--s-primary)] pl-[var(--s-space-20)] font-[family-name:var(--s-font-display)] text-[var(--s-size-xl)] italic">
        “Edit the token spec. Not the components.”
      </blockquote>
    </article>
  );
}

function CarbonPage({ bone }: { bone: boolean }) {
  return (
    <article className={cn("flex min-h-[34rem] flex-col p-[var(--s-space-24)] transition-[background-color,color] duration-[var(--s-duration-normal)] md:p-[var(--s-space-48)]", bone ? "bg-[var(--s-background)] text-[var(--s-text)]" : "bg-[var(--s-text)] text-[var(--s-background)]")}>
      <div className="flex items-center justify-between border-b border-[currentColor] pb-[var(--s-space-12)] opacity-80">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.2em]">
          {bone ? <><span className="dark:hidden">Bone</span><span className="hidden dark:inline">Carbon</span></> : <><span className="dark:hidden">Carbon</span><span className="hidden dark:inline">Bone</span></>} / enforced output
        </span>
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums">519 / 519</span>
      </div>
      <div className="grid flex-1 place-items-center">
        <div className="w-full max-w-md border border-[currentColor] p-[var(--s-space-20)]">
          <div className="grid grid-cols-[auto_1fr] gap-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px]">
            <span className="opacity-50">01</span><span>colors.primary → every accent</span>
            <span className="opacity-50">02</span><span>radius.card → every card</span>
            <span className="opacity-50">03</span><span>motion.fast → every response</span>
            <span className="opacity-50">04</span><span>pageRhythm → every section</span>
          </div>
          <div className="mt-[var(--s-space-32)] h-[var(--s-space-8)] w-full bg-[currentColor] opacity-80" />
        </div>
      </div>
      <p className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em] opacity-70">No component overrides detected</p>
    </article>
  );
}

function MaterialSpread() {
  const [carbonFirst, setCarbonFirst] = useState(false);
  return (
    <section data-concept-reveal className="border-b border-[var(--s-border)]">
      <div className="flex items-center justify-between border-b border-[var(--s-border)] p-[var(--s-space-16)] md:px-[var(--s-space-48)]">
        <Eyebrow>Material spread 01</Eyebrow>
        <MaterialSwitch carbonFirst={carbonFirst} onToggle={() => setCarbonFirst((value) => !value)} />
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="border-b border-[var(--s-border)] lg:border-b-0 lg:border-r"><BonePage carbon={carbonFirst} /></div>
        <div><CarbonPage bone={carbonFirst} /></div>
      </div>
    </section>
  );
}

function EditorialHero() {
  return (
    <section className="grid border-b border-[var(--s-border)] lg:grid-cols-[1.2fr_0.8fr]">
      <div className="p-[var(--s-space-24)] pt-[var(--s-space-64)] md:p-[var(--s-space-48)] md:pt-[var(--s-space-80)]">
        <div data-concept-intro>
          <Eyebrow>Carbon + Bone / issue 13</Eyebrow>
          <h1 className="mt-[var(--s-space-20)] max-w-3xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),8vw,var(--s-size-6xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)]">
            Soft paper. Hard constraints.
          </h1>
          <p className="mt-[var(--s-space-24)] max-w-xl text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">A design system should be pleasant to read and impossible to misunderstand. Sigil keeps the source human while the output stays exact.</p>
        </div>
        <div data-concept-intro className="mt-[var(--s-space-48)] flex flex-wrap gap-[var(--s-space-12)]">
          <PrimaryLink href="/docs/theming">Read the specification</PrimaryLink>
          <SecondaryLink href="/components">See the result</SecondaryLink>
        </div>
      </div>
      <div className="border-t border-[var(--s-border)] p-[var(--s-space-16)] md:p-[var(--s-space-24)] lg:border-l lg:border-t-0">
        <DesignSpecPanel className="h-full" />
      </div>
    </section>
  );
}

function CarbonBody() {
  return (
    <>
      <ConceptMasthead label="Editorial system / volume 01" />
      <main>
        <EditorialHero />
        <MaterialSpread />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] p-[var(--s-space-24)] md:p-[var(--s-space-48)] lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Start a system</Eyebrow>
            <h2 className="mt-[var(--s-space-16)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">Write once. Keep the surface coherent.</h2>
          </div>
          <CopyCommand />
        </section>
      </main>
      <ConceptFooter />
    </>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={etchPreset} compare={mode === "compare"} className="pt-12">
      <CarbonBody />
    </ConceptRoot>
  );
}
