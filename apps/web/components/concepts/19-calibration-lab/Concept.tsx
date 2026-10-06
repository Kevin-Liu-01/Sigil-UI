"use client";

import { monoPreset } from "@sigil-ui/presets";
import { useState, type CSSProperties } from "react";
import {
  ConceptFooter,
  ConceptMasthead,
  CopyCommand,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import type { ConceptPageProps } from "../shared/types";

const spacing = ["4", "8", "12", "16", "20", "24", "32", "48", "64"] as const;
const radii = ["none", "sm", "md", "lg", "xl"] as const;
const tracking = ["tighter", "tight", "normal", "wide", "wider"] as const;

type LabStyle = CSSProperties & {
  "--lab-gap": string;
  "--lab-radius": string;
  "--lab-tracking": string;
};

function Axis({ current, id, label, max, onChange, value }: { current: number; id: string; label: string; max: number; onChange: (value: number) => void; value: string }) {
  return (
    <div className="border-b border-[var(--s-border)] p-[var(--s-space-16)] last:border-b-0 md:p-[var(--s-space-20)]">
      <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] uppercase">
        <label htmlFor={id} className="text-[10px] tracking-[var(--s-tracking-wider)]">{label}</label>
        <span aria-hidden className="border-t border-dashed border-[var(--s-border)]" />
        <output htmlFor={id} className="text-[var(--s-size-sm)] tabular-nums">{String(current).padStart(2, "0")} / {value}</output>
      </div>
      <input
        id={id}
        aria-label={`${label} calibration: ${value}`}
        type="range"
        min={0}
        max={max}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-[var(--s-space-12)] min-h-11 w-full accent-[var(--s-text)]"
      />
      <div aria-hidden className="grid grid-cols-9">
        {Array.from({ length: 9 }, (_, index) => <span key={index} className="h-[var(--s-space-8)] border-l border-[var(--s-border)] last:border-r" />)}
      </div>
      <div className="mt-[var(--s-space-4)] flex justify-between font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-text-subtle)]"><span>0.000</span><span>1.000</span></div>
    </div>
  );
}

function CalibrationControls({ radius, setRadius, setSpace, setTrack, space, track }: { radius: number; setRadius: (value: number) => void; setSpace: (value: number) => void; setTrack: (value: number) => void; space: number; track: number }) {
  return (
    <section aria-label="Three token calibration rails" className="border border-[var(--s-border-strong)] bg-[var(--s-background)]">
      <div className="flex min-h-12 items-center justify-between border-b border-[var(--s-border-strong)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[var(--s-tracking-wider)]">
        <span>Rail bank / 03 axes</span><span className="tabular-nums text-[var(--s-text-muted)]">CAL-019-B</span>
      </div>
      <Axis id="calibration-spacing" label="A / spacing" value={`space-${spacing[space]}`} max={spacing.length - 1} current={space} onChange={setSpace} />
      <Axis id="calibration-radius" label="B / radius" value={`radius-${radii[radius]}`} max={radii.length - 1} current={radius} onChange={setRadius} />
      <Axis id="calibration-tracking" label="C / tracking" value={`tracking-${tracking[track]}`} max={tracking.length - 1} current={track} onChange={setTrack} />
    </section>
  );
}

function DimensionLine({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-[var(--s-space-8)] font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-text-muted)]">
      <span aria-hidden className="h-[var(--s-space-8)] border-l border-[var(--s-border-strong)]" /><span aria-hidden className="flex-1 border-t border-[var(--s-border)]" /><span>{children}</span><span aria-hidden className="flex-1 border-t border-[var(--s-border)]" /><span aria-hidden className="h-[var(--s-space-8)] border-r border-[var(--s-border-strong)]" />
    </div>
  );
}

function CalibratedSurface({ radius, space, track }: { radius: number; space: number; track: number }) {
  const status = `Spacing ${spacing[space]} pixels, radius ${radii[radius]}, tracking ${tracking[track]}`;
  return (
    <section aria-label="Live calibrated specimen" className="relative overflow-hidden border border-[var(--s-border-strong)] bg-[var(--s-surface-sunken)] p-[var(--s-space-16)] md:p-[var(--s-space-24)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--s-border-muted)_1px,transparent_1px),linear-gradient(90deg,var(--s-border-muted)_1px,transparent_1px)] opacity-[var(--s-bg-pattern-opacity)] [background-size:var(--s-grid-cell)_var(--s-grid-cell)]" />
      <div className="relative flex items-center justify-between border-b border-[var(--s-border-strong)] pb-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[var(--s-tracking-wider)]">
        <span>Specimen / CAL-019-A</span><span className="tabular-nums text-[var(--s-text-muted)]">X 072.4 · Y 031.8</span>
      </div>
      <div className="relative mx-auto mt-[var(--s-space-24)] max-w-2xl">
        <DimensionLine>{`SP ${spacing[space].padStart(2, "0")}`}</DimensionLine>
        <article className="my-[var(--s-space-12)] rounded-[var(--lab-radius)] border border-[var(--s-border-strong)] bg-[var(--s-background)] p-[var(--lab-gap)] shadow-[var(--s-shadow-sm)] transition-[border-radius,padding] duration-[var(--s-duration-normal)]">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[var(--s-tracking-wider)] text-[var(--s-text-muted)]"><span>REF</span><span className="border-t border-dashed border-[var(--s-border)]" /><span className="tabular-nums">R-{String(radius).padStart(2, "0")}</span></div>
          <h2 className="mt-[var(--lab-gap)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-normal leading-[var(--s-leading-tight)] tracking-[var(--lab-tracking)] transition-[letter-spacing] duration-[var(--s-duration-normal)]">One adjustment reaches the whole surface.</h2>
          <p className="mt-[var(--lab-gap)] max-w-lg text-pretty text-[var(--s-size-sm)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">This specimen and both controls read the same live spacing, radius, and tracking coordinates.</p>
          <div className="mt-[var(--lab-gap)] flex flex-wrap gap-[var(--lab-gap)]">
            <button type="button" className="min-h-11 rounded-[var(--lab-radius)] bg-[var(--s-text)] px-[var(--s-space-20)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[var(--lab-tracking)] text-[var(--s-background)] active:scale-[0.96]">Primary action</button>
            <button type="button" className="min-h-11 rounded-[var(--lab-radius)] border border-[var(--s-border-strong)] px-[var(--s-space-20)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[var(--lab-tracking)] active:scale-[0.96]">Secondary</button>
          </div>
        </article>
        <DimensionLine>{`TR ${String(track).padStart(2, "0")}`}</DimensionLine>
      </div>
      <div aria-live="polite" className="relative mt-[var(--s-space-24)] grid grid-cols-[auto_1fr] gap-[var(--s-space-12)] border-t border-[var(--s-border-strong)] pt-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px]">
        <span className="text-[var(--s-success)]">LIVE / 0 DRIFT</span><span className="text-right tabular-nums text-[var(--s-text-muted)]">{status}</span>
      </div>
    </section>
  );
}

function MeasurementLedger({ radius, space, track }: { radius: number; space: number; track: number }) {
  const measurements = [
    ["A", "spacing", `${spacing[space]} px`],
    ["B", "radius", radii[radius]],
    ["C", "tracking", tracking[track]],
    ["Σ", "propagation", "3 / 519 live"],
  ];
  return (
    <dl className="grid border-y border-[var(--s-border)] sm:grid-cols-2 lg:grid-cols-4">
      {measurements.map(([axis, label, value]) => <div key={axis} className="grid min-h-28 grid-cols-[auto_1fr] gap-[var(--s-space-16)] border-b border-[var(--s-border)] p-[var(--s-space-16)] sm:border-r lg:border-b-0"><dt className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{axis}</dt><dd><span className="block font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[var(--s-tracking-wider)] text-[var(--s-text-muted)]">{label}</span><strong className="mt-[var(--s-space-16)] block font-[family-name:var(--s-font-mono)] text-[var(--s-size-xl)] font-normal tabular-nums">{value}</strong></dd></div>)}
    </dl>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  const [space, setSpace] = useState(4);
  const [radius, setRadius] = useState(2);
  const [track, setTrack] = useState(2);
  const style: LabStyle = {
    "--lab-gap": `var(--s-space-${spacing[space]})`,
    "--lab-radius": `var(--s-radius-${radii[radius]})`,
    "--lab-tracking": `var(--s-tracking-${tracking[track]})`,
  };

  return (
    <ConceptRoot concept={concept} preset={monoPreset} compare={mode === "compare"}>
      <main style={style} className={mode === "compare" ? "pt-0" : "pt-12"}>
        <ConceptMasthead label="Lab / three live axes" />
        <section className="mx-auto max-w-[var(--s-content-max)] px-[var(--s-space-16)] py-[var(--s-space-32)] md:px-[var(--s-space-32)] md:py-[var(--s-space-48)]">
          <header data-concept-intro className="grid gap-[var(--s-space-20)] border-y border-[var(--s-border-strong)] py-[var(--s-space-20)] md:grid-cols-[0.74fr_1.26fr] md:items-end">
            <div><Eyebrow>Calibration Lab / 019</Eyebrow><h1 className="mt-[var(--s-space-12)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(2.25rem,6vw,5rem)] font-normal uppercase leading-[0.94] tracking-[var(--s-tracking-wide)]">Measure identity.</h1></div>
            <div className="grid gap-[var(--s-space-16)] md:grid-cols-[1fr_auto] md:items-end"><p className="max-w-xl text-pretty text-[var(--s-size-sm)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Three calibrated rails propagate spacing, edge, and type readings into a live interface specimen.</p><div className="flex flex-wrap gap-[var(--s-space-8)]"><PrimaryLink href="/docs/presets">Open presets</PrimaryLink><SecondaryLink>Components</SecondaryLink></div></div>
          </header>
          <div data-concept-intro className="mt-[var(--s-space-20)] grid gap-[var(--s-space-16)] lg:grid-cols-[1.28fr_0.72fr]"><CalibratedSurface {...{ radius, space, track }} /><CalibrationControls {...{ radius, setRadius, setSpace, setTrack, space, track }} /></div>
        </section>
        <div data-concept-reveal><MeasurementLedger {...{ radius, space, track }} /></div>
        <section data-concept-reveal className="mx-auto grid max-w-[var(--s-content-max)] gap-[var(--s-space-24)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[0.72fr_1.28fr] md:px-[var(--s-space-32)]">
          <div><Eyebrow>Commit the reading</Eyebrow><p className="mt-[var(--s-space-12)] max-w-md text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] uppercase leading-[var(--s-leading-tight)] tracking-[var(--s-tracking-wide)]">The measured state belongs in source control.</p></div>
          <div className="self-center"><CopyCommand command="npx @sigil-ui/cli preset mono" /></div>
        </section>
      </main>
      <ConceptFooter />
    </ConceptRoot>
  );
}
