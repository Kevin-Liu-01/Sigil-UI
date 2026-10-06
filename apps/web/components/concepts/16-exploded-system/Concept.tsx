"use client";

import { helixPreset } from "@sigil-ui/presets";
import { useRef, useState, type PointerEvent } from "react";
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

const layers = [
  { id: "tokens", index: "01", title: "Tokens", note: "519 constraints across 33 categories", detail: "Colors, type, space, motion, composition" },
  { id: "primitives", index: "02", title: "Primitives", note: "Behavior without visual drift", detail: "Radix and Base UI foundations" },
  { id: "components", index: "03", title: "Components", note: "350+ production-ready surfaces", detail: "Every visual value reads var(--s-*)" },
  { id: "composition", index: "04", title: "Composition", note: "Page rhythm with visible structure", detail: "Rails, sections, gutters, dividers" },
] as const;

const layerOffsets = [
  "calc(0px - var(--s-space-16))",
  "calc(0px - var(--s-space-8))",
  "var(--s-space-8)",
  "var(--s-space-16)",
] as const;

const layerDepths = [
  "0px",
  "calc(0px - var(--s-space-8))",
  "calc(0px - var(--s-space-16))",
  "calc(0px - var(--s-space-24))",
] as const;

function LayerStage({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const stageRef = useRef<HTMLDivElement>(null);

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
  };

  const reset = () => {
    if (stageRef.current) stageRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div onPointerMove={tilt} onPointerLeave={reset} className="relative min-h-[34rem] overflow-hidden border border-[var(--s-border)] bg-[var(--s-surface)] p-[var(--s-space-16)] [perspective:900px] md:p-[var(--s-space-24)]">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(var(--s-border-muted)_1px,transparent_1px),linear-gradient(90deg,var(--s-border-muted)_1px,transparent_1px)] opacity-[var(--s-bg-pattern-opacity)] [background-size:var(--s-grid-cell)_var(--s-grid-cell)]" />
      <div ref={stageRef} className="relative mx-auto grid max-w-2xl origin-center gap-[var(--s-space-12)] py-[var(--s-space-32)] transition-transform duration-[var(--s-duration-slow)] ease-[var(--s-ease-out)] motion-reduce:transform-none [transform-style:preserve-3d]">
        {layers.map((layer, index) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => onSelect(index)}
            onFocus={() => onSelect(index)}
            onPointerEnter={() => onSelect(index)}
            aria-pressed={active === index}
            className="relative grid min-h-24 grid-cols-[auto_1fr_auto] items-center gap-[var(--s-space-16)] border border-[var(--s-border-strong)] bg-[color-mix(in_oklch,var(--s-surface-elevated)_94%,transparent)] px-[var(--s-space-16)] py-[var(--s-space-12)] text-left shadow-[var(--s-shadow-lg)] backdrop-blur-sm transition-[background-color,border-color,opacity,transform] duration-[var(--s-duration-normal)] focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)] aria-pressed:border-[var(--s-primary)] aria-pressed:bg-[var(--s-primary-muted)] md:px-[var(--s-space-24)]"
            style={{
              opacity: active === index ? 1 : 0.78,
              transform: `translateX(${layerOffsets[index]}) translateZ(${active === index ? "var(--s-space-24)" : layerDepths[index]})`,
            }}
          >
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-primary)]">{layer.index}</span>
            <span>
              <strong className="block font-[family-name:var(--s-font-display)] text-[var(--s-size-xl)] font-semibold md:text-[var(--s-size-2xl)]">{layer.title}</strong>
              <span className="mt-[var(--s-space-4)] block text-[var(--s-size-xs)] text-[var(--s-text-muted)]">{layer.note}</span>
            </span>
            <span aria-hidden className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{active === index ? "SELECTED" : "FOCUS"}</span>
          </button>
        ))}
      </div>
      <p className="absolute bottom-[var(--s-space-16)] left-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">Hover, focus, or select a plane</p>
    </div>
  );
}

function LayerIndex({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return (
    <ol className="border-y border-[var(--s-border)]">
      {layers.map((layer, index) => (
        <li key={layer.id} className="border-b border-[var(--s-border)] last:border-b-0">
          <button type="button" onClick={() => onSelect(index)} aria-current={active === index ? "step" : undefined} className="grid min-h-24 w-full grid-cols-[auto_1fr_auto] items-center gap-[var(--s-space-16)] px-[var(--s-space-16)] text-left transition-colors duration-[var(--s-duration-fast)] hover:bg-[var(--s-component-surface-hover-bg)] aria-[current=step]:bg-[var(--s-primary-muted)] md:px-[var(--s-space-24)]">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-primary)]">{layer.index}</span>
            <span><strong className="block font-[family-name:var(--s-font-display)] text-[var(--s-size-lg)]">{layer.title}</strong><span className="mt-[var(--s-space-4)] block text-[var(--s-size-xs)] text-[var(--s-text-muted)]">{layer.detail}</span></span>
            <span aria-hidden className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{active === index ? "OPEN" : "+"}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  const [active, setActive] = useState(2);

  return (
    <ConceptRoot concept={concept} preset={helixPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "pt-0" : "pt-12"}>
        <ConceptMasthead label="System / exploded view" />
        <section className="mx-auto grid max-w-[var(--s-content-max)] gap-[var(--s-space-48)] px-[var(--s-space-16)] py-[var(--s-space-64)] lg:grid-cols-[0.72fr_1.28fr] lg:px-[var(--s-space-32)] lg:py-[var(--s-space-80)]">
          <div data-concept-intro className="self-center">
            <Eyebrow>Exploded System</Eyebrow>
            <h1 className="mt-[var(--s-space-20)] max-w-xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(3.25rem,7vw,7rem)] font-semibold leading-[0.88] tracking-[var(--s-tracking-tight)]">Every layer has a reason.</h1>
            <p className="mt-[var(--s-space-24)] max-w-lg text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Separate the architecture and the contract becomes obvious: constraints descend; consistency compounds.</p>
            <div className="mt-[var(--s-space-32)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink href="/docs">Inspect architecture</PrimaryLink><SecondaryLink>View components</SecondaryLink></div>
          </div>
          <div data-concept-intro><LayerStage active={active} onSelect={setActive} /></div>
        </section>
        <StatsRail />
        <section data-concept-reveal className="mx-auto grid max-w-[var(--s-content-max)] gap-[var(--s-space-32)] py-[var(--s-space-80)] md:grid-cols-[0.65fr_1.35fr]">
          <div className="px-[var(--s-space-16)] md:px-[var(--s-space-24)]">
            <Eyebrow>Layer index</Eyebrow>
            <h2 className="mt-[var(--s-space-16)] max-w-sm text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] leading-[var(--s-leading-tight)]">Select a plane. Trace its responsibility.</h2>
          </div>
          <LayerIndex active={active} onSelect={setActive} />
        </section>
      </main>
      <ConceptFooter />
    </ConceptRoot>
  );
}
