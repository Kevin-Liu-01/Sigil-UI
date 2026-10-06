"use client";

import { rivetPreset } from "@sigil-ui/presets";
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
import type { ConceptPageProps } from "../shared/types";

const regions = [
  { name: "Foundation", count: 5, coordinate: "A-08", code: "colors · typography · spacing · layout · sigil", result: "Every surface begins here.", placement: "col-span-5 col-start-1 row-start-1 md:col-span-4" },
  { name: "Material", count: 4, coordinate: "C-22", code: "radius · shadows · borders · backgrounds", result: "Edges, depth, and atmosphere.", placement: "col-span-5 col-start-8 row-start-1 md:col-span-3 md:col-start-6" },
  { name: "Behavior", count: 4, coordinate: "B-31", code: "motion · cursor · focus · scrollbar", result: "Every response uses one motion language.", placement: "col-span-4 col-start-1 row-start-2" },
  { name: "Components", count: 8, coordinate: "D-47", code: "buttons · cards · inputs · controls · overlays · media · surfaces · code", result: "Primitives inherit the same contract.", placement: "col-span-7 col-start-6 row-start-2" },
  { name: "Composition", count: 6, coordinate: "F-63", code: "alignment · sections · dividers · grid · hero · rhythm", result: "Whole pages remain structurally coherent.", placement: "col-span-7 col-start-1 row-start-3" },
  { name: "Blocks", count: 4, coordinate: "G-78", code: "navigation · CTA · footer · banner", result: "High-level product moments stay editable.", placement: "col-span-4 col-start-9 row-start-3" },
  { name: "Signal", count: 2, coordinate: "H-92", code: "dataViz · headings", result: "Information retains hierarchy.", placement: "col-span-6 col-start-4 row-start-4" },
] as const;

const horizontalTicks = ["000", "020", "040", "060", "080", "100"] as const;
const verticalTicks = ["08", "31", "63", "92"] as const;

function AtlasPlate({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <section aria-label="Interactive token category atlas" className="border border-[var(--s-border-strong)] bg-[var(--s-surface-sunken)] text-[var(--s-text)] shadow-[var(--s-shadow-xl)]">
      <div className="grid grid-cols-[auto_1fr] border-b border-[color-mix(in_oklch,var(--s-text)_24%,transparent)]">
        <span className="grid min-h-11 min-w-11 place-items-center border-r border-[color-mix(in_oklch,var(--s-text)_24%,transparent)] font-[family-name:var(--s-font-mono)] text-[10px] opacity-50">N</span>
        <div className="grid grid-cols-6">
          {horizontalTicks.map((tick) => <span key={tick} className="flex min-h-11 items-center border-r border-[color-mix(in_oklch,var(--s-text)_12%,transparent)] px-[var(--s-space-8)] font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums opacity-50 last:border-r-0">{tick}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr]">
        <div className="grid min-w-11 grid-rows-4 border-r border-[color-mix(in_oklch,var(--s-text)_24%,transparent)]">
          {verticalTicks.map((tick) => <span key={tick} className="grid place-items-center border-b border-[color-mix(in_oklch,var(--s-text)_12%,transparent)] font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums opacity-50 last:border-b-0">{tick}</span>)}
        </div>
        <div className="relative grid min-h-[28rem] grid-cols-12 grid-rows-4 gap-[var(--s-space-8)] overflow-hidden p-[var(--s-space-16)] md:p-[var(--s-space-24)]">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(112deg,transparent_18%,color-mix(in_oklch,var(--s-info)_14%,transparent)_48%,color-mix(in_oklch,var(--s-primary)_16%,transparent)_52%,transparent_82%)] opacity-60" />
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path d="M 80 84 L 600 84 L 820 225 L 310 225 L 500 372 L 1010 372 L 615 520" fill="none" stroke="var(--s-text)" strokeOpacity="0.34" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M 820 225 L 1060 84 M 310 225 L 95 372" fill="none" stroke="var(--s-primary)" strokeOpacity="0.72" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          {regions.map((region, index) => (
            <button
              key={region.name}
              type="button"
              onClick={() => onSelect(index)}
              onFocus={() => onSelect(index)}
              onPointerEnter={() => onSelect(index)}
              aria-pressed={active === index}
              className={`${region.placement} relative z-[1] min-h-20 border border-[color-mix(in_oklch,var(--s-text)_34%,transparent)] bg-[color-mix(in_oklch,var(--s-surface-elevated)_84%,transparent)] p-[var(--s-space-12)] text-left shadow-[var(--s-shadow-sm)] backdrop-blur-sm transition-[background-color,border-color,transform] duration-[var(--s-duration-fast)] focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-primary)] active:scale-[0.96] aria-pressed:border-[var(--s-primary)] aria-pressed:bg-[color-mix(in_oklch,var(--s-primary)_28%,var(--s-surface-sunken))]`}
            >
              <span className="flex items-center justify-between font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums opacity-60"><span>{region.coordinate}</span><span>{region.count}</span></span>
              <strong className="mt-[var(--s-space-12)] block font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)] font-semibold uppercase tracking-[var(--s-tracking-wide)] md:text-[var(--s-size-base)]">{region.name}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionReadout({ active }: { active: number }) {
  const region = regions[active]!;
  return (
    <aside aria-live="polite" className="grid border-x border-b border-[var(--s-border-strong)] bg-[var(--s-surface)] md:grid-cols-[auto_0.72fr_1.28fr_auto]">
      <div className="border-b border-[var(--s-border)] p-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-text-muted)] md:border-b-0 md:border-r">
        <span className="block uppercase tracking-[var(--s-tracking-wider)]">Fix</span>
        <strong className="mt-[var(--s-space-8)] block text-[var(--s-size-xl)] font-normal text-[var(--s-text)]">{region.coordinate}</strong>
      </div>
      <div className="border-b border-[var(--s-border)] p-[var(--s-space-16)] md:border-b-0 md:border-r">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[var(--s-tracking-wider)] text-[var(--s-text-muted)]">Selected region</span>
        <p className="mt-[var(--s-space-8)] font-[family-name:var(--s-font-display)] text-[var(--s-size-xl)] font-semibold">{region.name}</p>
      </div>
      <div className="border-b border-[var(--s-border)] p-[var(--s-space-16)] md:border-b-0 md:border-r">
        <p className="text-pretty text-[var(--s-size-sm)] text-[var(--s-text-muted)]">{region.result}</p>
        <p className="mt-[var(--s-space-8)] font-[family-name:var(--s-font-mono)] text-[10px] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">{region.code}</p>
      </div>
      <div className="flex items-center justify-between gap-[var(--s-space-16)] p-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] md:block">
        <span className="text-[var(--s-success)]">ROUTED</span>
        <span className="block tabular-nums text-[var(--s-text-muted)] md:mt-[var(--s-space-8)]">{region.count}/33</span>
      </div>
    </aside>
  );
}

function RouteRegister({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <section className="mx-auto grid max-w-[var(--s-content-max)] border-x border-t border-[var(--s-border)] md:grid-cols-[0.42fr_1.58fr]">
      <div className="border-b border-[var(--s-border)] p-[var(--s-space-24)] md:border-b-0 md:border-r md:p-[var(--s-space-48)]">
        <Eyebrow>Route register</Eyebrow>
        <p className="mt-[var(--s-space-16)] max-w-sm text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] leading-[var(--s-leading-tight)]">Thirty-three categories. One connected coordinate system.</p>
      </div>
      <ol>
        {regions.map((region, index) => (
          <li key={region.name} className="border-b border-[var(--s-border)]">
            <button type="button" onClick={() => onSelect(index)} onFocus={() => onSelect(index)} aria-current={active === index ? "location" : undefined} className="grid min-h-16 w-full grid-cols-[auto_1fr_auto] items-center gap-[var(--s-space-16)] px-[var(--s-space-16)] text-left font-[family-name:var(--s-font-mono)] text-[10px] transition-colors duration-[var(--s-duration-fast)] hover:bg-[var(--s-component-surface-hover-bg)] focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)] aria-[current=location]:bg-[var(--s-primary-muted)] md:px-[var(--s-space-24)]">
              <span className="tabular-nums text-[var(--s-primary)]">{region.coordinate}</span><span className="uppercase tracking-[var(--s-tracking-wide)]">{region.name}</span><span className="tabular-nums text-[var(--s-text-muted)]">{region.count}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  const [active, setActive] = useState(0);

  return (
    <ConceptRoot concept={concept} preset={rivetPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "pt-0" : "pt-12"}>
        <ConceptMasthead label="Atlas / routed coordinates" />
        <section className="mx-auto grid max-w-[var(--s-content-max)] gap-[var(--s-space-32)] px-[var(--s-space-16)] py-[var(--s-space-48)] lg:grid-cols-[0.38fr_1.62fr] lg:px-[var(--s-space-32)] lg:py-[var(--s-space-64)]">
          <header data-concept-intro className="flex flex-col justify-between border-l border-[var(--s-border)] pl-[var(--s-space-20)]">
            <div><Eyebrow>Chrome Atlas</Eyebrow><h1 className="mt-[var(--s-space-20)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(3rem,6vw,5.5rem)] font-semibold uppercase leading-[0.9] tracking-[var(--s-tracking-wide)]">Map the complete system.</h1></div>
            <div className="mt-[var(--s-space-32)]">
              <p className="max-w-sm text-pretty text-[var(--s-size-sm)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Navigate the route from primitive constraint to finished interface. Each coordinate names its downstream destination.</p>
              <div className="mt-[var(--s-space-24)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink href="/docs">Open token map</PrimaryLink><SecondaryLink>View components</SecondaryLink></div>
            </div>
          </header>
          <div data-concept-intro><AtlasPlate active={active} onSelect={setActive} /><RegionReadout active={active} /></div>
        </section>
        <StatsRail />
        <div data-concept-reveal><RouteRegister active={active} onSelect={setActive} /></div>
      </main>
      <ConceptFooter />
    </ConceptRoot>
  );
}
