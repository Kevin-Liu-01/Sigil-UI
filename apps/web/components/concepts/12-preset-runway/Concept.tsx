"use client";

import { onyxPreset } from "@sigil-ui/presets";
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

const identities = [
  { name: "Onyx", category: "Dark", voice: "Cinematic / monolithic", structure: "Layered scene" },
  { name: "Etch", category: "Editorial", voice: "Printed / measured", structure: "Hairline column" },
  { name: "Kova", category: "Structural", voice: "Optical / engineered", structure: "Locked rails" },
  { name: "Alloy", category: "Industrial", voice: "Machined / dense", structure: "Production frame" },
] as const;

function StageHeading({ active }: { active: number }) {
  const identity = identities[active];
  return (
    <div className="flex items-center justify-between border-b border-[var(--s-border-strong)] px-[var(--s-space-16)] py-[var(--s-space-12)]">
      <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)]">Cut {String(active + 1).padStart(2, "0")} / {identity.structure}</span>
      <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase text-[var(--s-primary)]">{identity.category}</span>
    </div>
  );
}

function OnyxCut() {
  return (
    <div className="relative grid min-h-[29rem] grid-cols-[1fr_0.42fr] gap-[var(--s-space-12)] overflow-hidden bg-[var(--s-background)] p-[var(--s-space-20)]">
      <div className="relative z-10 flex flex-col justify-end border border-[var(--s-border-strong)] bg-[linear-gradient(145deg,var(--s-surface-elevated),var(--s-background))] p-[var(--s-space-24)] shadow-[var(--s-shadow-xl)]">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-primary)]">Layer 01 / hero</span>
        <h2 className="mt-[var(--s-space-16)] max-w-sm text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-semibold">Night, held in depth.</h2>
        <p className="mt-[var(--s-space-12)] max-w-xs text-[var(--s-size-sm)] text-[var(--s-text-secondary)]">Large cinematic field. One controlled reading path.</p>
      </div>
      <div className="grid grid-rows-[0.7fr_1fr] gap-[var(--s-space-12)] pt-[var(--s-space-48)]">
        <div className="border border-[var(--s-border)] bg-[var(--s-surface-sunken)]" />
        <div className="border border-[var(--s-primary)] bg-[var(--s-primary)] opacity-80" />
      </div>
      <div aria-hidden className="absolute -right-[var(--s-space-48)] -top-[var(--s-space-48)] size-64 rounded-[var(--s-radius-full)] border border-[var(--s-primary)] opacity-30" />
    </div>
  );
}

function EtchCut() {
  return (
    <div className="grid min-h-[29rem] grid-cols-[4rem_1fr] bg-[var(--s-background)]">
      <div className="flex flex-col items-center justify-between border-r border-[var(--s-border-strong)] py-[var(--s-space-20)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)] [writing-mode:vertical-rl]">
        <span>Editorial proof</span><span>Vol. 46</span>
      </div>
      <div className="p-[var(--s-space-24)]">
        <div className="border-y-[length:var(--s-border-medium)] border-[var(--s-border-strong)] py-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em]">Hairline column / Edition 02</div>
        <h2 className="mt-[var(--s-space-32)] max-w-lg text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-semibold leading-[var(--s-leading-tight)]">A system that reads like a printed argument.</h2>
        <div className="mt-[var(--s-space-32)] columns-2 gap-[var(--s-space-24)] text-[var(--s-size-sm)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">
          <p>Typography establishes the hierarchy before any surface treatment appears. Hairlines, folios, and measured columns make the source inspectable.</p>
          <p>Every choice remains downstream of the same complete preset contract.</p>
        </div>
        <div className="mt-[var(--s-space-32)] h-px bg-[var(--s-border-strong)]" />
      </div>
    </div>
  );
}

function KovaCut() {
  return (
    <div className="relative min-h-[29rem] overflow-hidden bg-[var(--s-surface-sunken)] p-[var(--s-space-20)]">
      <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-[var(--s-primary)] opacity-50" />
      <div aria-hidden className="absolute inset-y-0 left-1/2 border-l border-dashed border-[var(--s-primary)] opacity-50" />
      <div className="relative grid min-h-[26rem] grid-cols-[0.34fr_1fr_0.34fr] grid-rows-[3.5rem_1fr_3.5rem] gap-px bg-[var(--s-border-strong)]">
        <div className="col-span-3 flex items-center justify-between bg-[var(--s-background)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase"><span>Rail A</span><span className="text-[var(--s-primary)]">Locked</span></div>
        <div className="bg-[var(--s-background)]" />
        <div className="grid place-items-center bg-[var(--s-background)] p-[var(--s-space-20)] text-center">
          <div>
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)]">Optical center</span>
            <h2 className="mt-[var(--s-space-12)] font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">Every edge resolves.</h2>
          </div>
        </div>
        <div className="bg-[var(--s-background)]" />
        <div className="col-span-3 grid grid-cols-4 gap-px bg-[var(--s-border-strong)]">
          {["COLOR", "TYPE", "SPACE", "MOTION"].map((label) => <span key={label} className="grid place-items-center bg-[var(--s-background)] font-[family-name:var(--s-font-mono)] text-[10px]">{label}</span>)}
        </div>
      </div>
    </div>
  );
}

function AlloyCut() {
  return (
    <div className="min-h-[29rem] bg-[repeating-linear-gradient(105deg,var(--s-surface-sunken)_0,var(--s-surface-sunken)_2px,var(--s-surface-elevated)_3px,var(--s-surface-sunken)_6px)] p-[var(--s-space-20)]">
      <div className="grid min-h-[26rem] grid-cols-[0.38fr_1fr] border-[length:var(--s-border-medium)] border-[var(--s-border-strong)] bg-[var(--s-background)] shadow-[var(--s-shadow-xl)]">
        <div className="flex flex-col justify-between border-r border-[var(--s-border-strong)] p-[var(--s-space-16)]">
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase text-[var(--s-text-muted)]">Production frame</span>
          <p className="font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-semibold tabular-nums">519</p>
          <div className="grid grid-cols-3 gap-[var(--s-space-8)]">{[0, 1, 2, 3, 4, 5].map((index) => <span key={index} className="aspect-square border border-[var(--s-border-strong)] bg-[var(--s-surface-sunken)]" />)}</div>
        </div>
        <div className="grid grid-rows-[1fr_auto] p-[var(--s-space-24)]">
          <div className="grid place-items-center border border-[var(--s-border)] bg-[var(--s-surface-sunken)] text-center">
            <div>
              <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-primary)]">Assembly verified</span>
              <h2 className="mt-[var(--s-space-12)] font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">Built for the line.</h2>
            </div>
          </div>
          <div className="mt-[var(--s-space-16)] grid grid-cols-3 gap-[var(--s-space-8)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase"><span>Input</span><span>Compile</span><span>Ship</span></div>
        </div>
      </div>
    </div>
  );
}

function RunwayStage({ active }: { active: number }) {
  return (
    <div aria-live="polite" className="overflow-hidden border border-[var(--s-border)] bg-[var(--s-surface-sunken)]">
      <StageHeading active={active} />
      <div key={active} className="transition-opacity duration-[var(--s-duration-normal)]">
        {active === 0 && <OnyxCut />}
        {active === 1 && <EtchCut />}
        {active === 2 && <KovaCut />}
        {active === 3 && <AlloyCut />}
      </div>
      <p className="sr-only">Showing {identities[active].name}: {identities[active].voice}</p>
    </div>
  );
}

function RunwaySelector({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-px bg-[var(--s-border)] md:grid-cols-4">
      {identities.map((identity, index) => (
        <button
          key={identity.name}
          type="button"
          aria-pressed={active === index}
          onClick={() => onSelect(index)}
          className={cn(
            "min-h-14 bg-[var(--s-background)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em] transition-[background-color,transform] duration-[var(--s-duration-fast)] active:scale-[0.98]",
            active === index && "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]",
          )}
        >
          {identity.name}
        </button>
      ))}
    </div>
  );
}

function RunwayHero() {
  const [active, setActive] = useState(0);
  return (
    <section className="border-b border-[var(--s-border)]">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-between p-[var(--s-space-24)] pt-[var(--s-space-64)] md:p-[var(--s-space-48)] md:pt-[var(--s-space-80)]">
          <div data-concept-intro>
            <Eyebrow>Preset Runway</Eyebrow>
            <h1 className="mt-[var(--s-space-20)] max-w-xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),7vw,var(--s-size-6xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)]">
              Structure changes with identity.
            </h1>
            <p className="mt-[var(--s-space-24)] max-w-lg text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">
              Presets do more than recolor. Each complete identity controls layout, typography, motion, sections, controls, and page rhythm.
            </p>
          </div>
          <div data-concept-intro className="mt-[var(--s-space-48)] flex flex-wrap gap-[var(--s-space-12)]">
            <PrimaryLink href="/presets">View all 46</PrimaryLink>
            <SecondaryLink href="/docs/presets">How presets work</SecondaryLink>
          </div>
        </div>
        <div className="grid gap-px bg-[var(--s-border)] p-[var(--s-space-16)] md:p-[var(--s-space-24)]">
          <RunwayStage active={active} />
          <RunwaySelector active={active} onSelect={setActive} />
        </div>
      </div>
    </section>
  );
}

function RunwayBody() {
  return (
    <>
      <ConceptMasthead label="Runway / complete identities" />
      <main>
        <RunwayHero />
        <StatsRail />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] p-[var(--s-space-24)] md:p-[var(--s-space-48)] lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Change the whole system</Eyebrow>
            <h2 className="mt-[var(--s-space-16)] max-w-md text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">One command. No component surgery.</h2>
          </div>
          <CopyCommand command="npx @sigil-ui/cli preset onyx" />
        </section>
      </main>
      <ConceptFooter />
    </>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={onyxPreset} compare={mode === "compare"} className="pt-12">
      <RunwayBody />
    </ConceptRoot>
  );
}
