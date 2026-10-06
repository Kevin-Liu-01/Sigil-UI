"use client";

import { anvilPreset } from "@sigil-ui/presets";
import { RotateCw } from "lucide-react";
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
import { DesignSpecPanel } from "../shared/ProductProof";
import type { ConceptPageProps } from "../shared/types";

function LatheControl() {
  const [value, setValue] = useState(42);
  const rotation = -132 + value * 2.64;

  return (
    <div className="grid gap-[var(--s-space-24)] border-[length:var(--s-border-medium)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[var(--s-surface)] p-[var(--s-space-24)] shadow-[var(--s-shadow-xl)] md:grid-cols-[1fr_0.72fr]">
      <div className="relative mx-auto aspect-square w-full max-w-lg rounded-[var(--s-radius-full)] border-[length:var(--s-border-thick)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[repeating-conic-gradient(from_0deg,var(--s-border-muted)_0deg,var(--s-border-muted)_1deg,transparent_1deg,transparent_12deg)] p-[var(--s-space-32)]">
        <div className="grid size-full place-items-center rounded-[var(--s-radius-full)] border-[length:var(--s-border-medium)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] bg-[var(--s-background)] shadow-[var(--s-shadow-inner)]">
          <div
            aria-label={`Central specimen at ${value} percent roundness`}
            className="grid size-1/2 place-items-center border-[length:var(--s-border-thick)] border-[style:var(--s-border-style,solid)] border-[var(--s-primary)] bg-[var(--s-surface-elevated)] transition-[border-radius] duration-[var(--s-duration-fast)] ease-[var(--s-ease-out)] motion-reduce:transition-none"
            style={{ borderRadius: `${value / 2}%` }}
          >
            <div className="text-center">
              <p className="font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-bold tabular-nums">{value}</p>
              <p className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">radius index</p>
            </div>
          </div>
        </div>
        <span aria-hidden className="absolute inset-[var(--s-space-12)] rounded-[var(--s-radius-full)]" style={{ transform: `rotate(${rotation}deg)` }}><span className="absolute left-1/2 top-0 h-[var(--s-space-24)] w-[var(--s-border-thick)] -translate-x-1/2 bg-[var(--s-primary)]" /></span>
      </div>
      <div className="flex flex-col justify-between border-l-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] pl-[var(--s-space-24)]">
        <div>
          <div className="flex items-center justify-between"><span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em]">Master control</span><RotateCw aria-hidden className="size-4 text-[var(--s-primary)]" /></div>
          <label className="mt-[var(--s-space-48)] block font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--s-text-muted)]">
            Turn the token
            <input aria-label="Radius intensity" aria-valuetext={`${value} percent roundness`} type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-[var(--s-space-16)] h-[var(--s-control-track-height)] w-full accent-[var(--s-primary)]" />
          </label>
        </div>
        <dl className="mt-[var(--s-space-48)] space-y-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px]">
          <div className="flex justify-between border-t-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] pt-[var(--s-space-12)]"><dt>Cards</dt><dd className="tabular-nums text-[var(--s-primary)]">{Math.round(value / 5)}px</dd></div>
          <div className="flex justify-between border-t-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] pt-[var(--s-space-12)]"><dt>Inputs</dt><dd className="tabular-nums text-[var(--s-primary)]">{Math.round(value / 8)}px</dd></div>
          <div className="flex justify-between border-t-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] pt-[var(--s-space-12)]"><dt>Overlays</dt><dd className="tabular-nums text-[var(--s-primary)]">{Math.round(value / 4)}px</dd></div>
        </dl>
      </div>
    </div>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={anvilPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "" : "pt-12"}>
        <ConceptMasthead label="Machining station / 04" />
        <section className="grid gap-[var(--s-space-48)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:px-[var(--s-space-48)] lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:px-[var(--s-space-64)]">
          <div className="max-w-xl">
            <Eyebrow>High-leverage control</Eyebrow>
            <h1 data-concept-intro className="mt-[var(--s-space-20)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),6.2vw,var(--s-heading-display-size))] font-bold uppercase leading-[var(--s-heading-display-leading)]">Turn one token. Reshape everything.</h1>
            <p data-concept-intro className="mt-[var(--s-space-24)] text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Sigil machines global decisions at the source. Radius, type, spacing, and motion stay mechanically related across 350+ components.</p>
            <div data-concept-intro className="mt-[var(--s-space-32)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink>Open token docs</PrimaryLink><SecondaryLink href="/presets">View presets</SecondaryLink></div>
          </div>
          <div data-concept-intro><LatheControl /></div>
        </section>
        <StatsRail />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[0.7fr_1.3fr] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
          <div><Eyebrow>Machine-readable taste</Eyebrow><h2 className="mt-[var(--s-space-16)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-heading-h2-size)] font-[var(--s-heading-h2-weight)] leading-[var(--s-heading-h2-leading)]">The tooling is the visual language.</h2></div>
          <DesignSpecPanel />
        </section>
        <ConceptFooter />
      </main>
    </ConceptRoot>
  );
}
