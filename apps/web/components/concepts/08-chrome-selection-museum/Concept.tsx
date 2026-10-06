"use client";

import { brassPreset } from "@sigil-ui/presets";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

const specimens = [
  { name: "Brass", finish: "Machined / warm", preset: "brass", category: "Industrial" },
  { name: "Alloy", finish: "Cold / structural", preset: "alloy", category: "Industrial" },
  { name: "Obsid", finish: "Black / monolithic", preset: "obsid", category: "Dark" },
  { name: "Etch", finish: "Paper / engraved", preset: "etch", category: "Editorial" },
  { name: "Kova", finish: "Optical / precise", preset: "kova", category: "Structural" },
  { name: "Axiom", finish: "White / reduced", preset: "axiom", category: "Minimal" },
] as const;

function SpecimenStage({ active }: { active: number }) {
  const specimen = specimens[active];
  return (
    <div className="relative grid min-h-[32rem] h-full place-items-center overflow-hidden border border-[var(--s-border)] bg-[var(--s-surface-sunken)] p-[var(--s-space-24)]">
      <div aria-hidden className="absolute inset-x-[var(--s-space-24)] top-1/2 border-t border-dashed border-[var(--s-border-muted)]" />
      <div aria-hidden className="absolute inset-y-[var(--s-space-24)] left-1/2 border-l border-dashed border-[var(--s-border-muted)]" />
      <div
        data-concept-parallax
        className="relative aspect-square w-[min(72vw,22rem)] rounded-[var(--s-radius-full)] border-[length:var(--s-border-thin)] border-[var(--s-border-strong)] bg-[conic-gradient(from_225deg,var(--s-background),var(--s-text-muted),var(--s-surface-elevated),var(--s-primary),var(--s-text-secondary),var(--s-background))] p-[var(--s-space-16)] shadow-[var(--s-shadow-xl)]"
      >
        <div className="grid size-full place-items-center rounded-[var(--s-radius-full)] border border-[var(--s-border)] bg-[radial-gradient(circle_at_38%_30%,var(--s-surface-elevated),var(--s-surface)_48%,var(--s-background))]">
          <div className="text-center">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--s-text-muted)]">
              Specimen {String(active + 1).padStart(2, "0")}
            </span>
            <p className="mt-[var(--s-space-8)] font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-semibold tracking-[var(--s-tracking-tight)]">
              {specimen.name}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-[var(--s-space-16)] bottom-[var(--s-space-16)] flex justify-between font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">
        <span>{specimen.category}</span>
        <span>{specimen.finish}</span>
      </div>
    </div>
  );
}

function SpecimenControls({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const move = (step: number) => onSelect((active + step + specimens.length) % specimens.length);
  return (
    <div className="border border-[var(--s-border)] bg-[var(--s-background)]">
      <div className="flex items-center justify-between border-b border-[var(--s-border)] p-[var(--s-space-12)]">
        <Eyebrow>Preset collection</Eyebrow>
        <div className="flex">
          <button type="button" aria-label="Previous specimen" onClick={() => move(-1)} className="grid size-11 place-items-center border border-[var(--s-border)] transition-transform duration-[var(--s-duration-fast)] active:scale-[0.96]">
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button type="button" aria-label="Next specimen" onClick={() => move(1)} className="grid size-11 place-items-center border-y border-r border-[var(--s-border)] transition-transform duration-[var(--s-duration-fast)] active:scale-[0.96]">
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
      <ol className="grid grid-cols-2">
        {specimens.map((specimen, index) => (
          <li key={specimen.name} className={cn(index % 2 === 1 && "border-l border-[var(--s-border)]", index > 1 && "border-t border-[var(--s-border)]")}>
            <button
              type="button"
              aria-pressed={active === index}
              onClick={() => onSelect(index)}
              className={cn(
                "min-h-24 w-full p-[var(--s-space-16)] text-left transition-[background-color,transform] duration-[var(--s-duration-fast)] active:scale-[0.98]",
                active === index ? "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]" : "hover:bg-[var(--s-component-surface-hover-bg)]",
              )}
            >
              <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums opacity-70">{String(index + 1).padStart(2, "0")}</span>
              <span className="mt-[var(--s-space-16)] block font-[family-name:var(--s-font-display)] text-[var(--s-size-lg)] font-semibold">{specimen.name}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MuseumBody() {
  const [active, setActive] = useState(0);
  return (
    <>
      <ConceptMasthead label="Collection 46 / permanent" />
      <main>
        <section className="grid border-b border-[var(--s-border)] lg:min-h-[calc(100dvh-3rem)] lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]">
          <div className="flex flex-col p-[var(--s-space-24)] pt-[var(--s-space-48)] md:p-[var(--s-space-48)] md:pt-[var(--s-space-64)]">
            <div data-concept-intro>
              <Eyebrow>Chrome Selection Museum</Eyebrow>
              <h1 className="mt-[var(--s-space-20)] max-w-xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),8vw,var(--s-size-6xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)]">
                Forty-six identities. One architecture.
              </h1>
              <p className="mt-[var(--s-space-24)] max-w-md text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">
                Every curated preset fills all 519 fields. Select a specimen to inspect how finish changes while the system beneath it holds.
              </p>
            </div>
            <div data-concept-intro className="mt-[var(--s-space-32)] flex flex-wrap gap-[var(--s-space-12)]">
              <PrimaryLink href="/presets">Browse presets</PrimaryLink>
              <SecondaryLink href="/docs/presets">Read the spec</SecondaryLink>
            </div>
          </div>
          <div className="grid content-stretch gap-[var(--s-space-16)] p-[var(--s-space-16)] md:p-[var(--s-space-24)] lg:grid-cols-[1.3fr_0.7fr]">
            <SpecimenStage active={active} />
            <SpecimenControls active={active} onSelect={setActive} />
          </div>
        </section>
        <StatsRail />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] p-[var(--s-space-24)] md:p-[var(--s-space-48)] lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Eyebrow>Acquisition card</Eyebrow>
            <h2 className="mt-[var(--s-space-16)] max-w-lg text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">Take the complete collection into your project.</h2>
          </div>
          <CopyCommand command={`npx @sigil-ui/cli preset ${specimens[active].preset}`} />
        </section>
      </main>
      <ConceptFooter />
    </>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={brassPreset} compare={mode === "compare"} className="pt-12">
      <MuseumBody />
    </ConceptRoot>
  );
}
