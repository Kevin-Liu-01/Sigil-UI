"use client";

import { dsgnPreset } from "@sigil-ui/presets";
import { useState, type CSSProperties } from "react";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
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

const accentOptions = [
  ["primary", "var(--s-primary)"],
  ["ink", "var(--s-text)"],
  ["signal", "var(--s-info)"],
] as const;

const radiusOptions = [
  ["none", "var(--s-radius-none)"],
  ["medium", "var(--s-radius-md)"],
  ["large", "var(--s-radius-lg)"],
] as const;

type LivingStyle = CSSProperties & {
  "--living-accent": string;
  "--living-radius": string;
};

function DocumentEditor({
  accent,
  radius,
  title,
  setAccent,
  setRadius,
  setTitle,
}: {
  accent: number;
  radius: number;
  title: string;
  setAccent: (value: number) => void;
  setRadius: (value: number) => void;
  setTitle: (value: string) => void;
}) {
  return (
    <section aria-label="Editable DESIGN.md" className="border border-[var(--s-border)] bg-[var(--s-code-bg)] shadow-[var(--s-shadow-lg)]">
      <div className="flex items-center justify-between border-b border-[var(--s-border)] px-[var(--s-space-16)] py-[var(--s-space-12)]">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.18em]">DESIGN.md</span>
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-text-muted)]">live / {SIGIL_PRODUCT_STATS.tokenCount}</span>
      </div>
      <div className="space-y-[var(--s-space-24)] p-[var(--s-space-16)] md:p-[var(--s-space-24)]">
        <label className="block font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-code-comment-color)]">
          # Product sentence
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-[var(--s-space-8)] min-h-11 w-full border border-[var(--s-border-interactive)] bg-[var(--s-background)] px-[var(--s-space-12)] text-[var(--s-size-sm)] text-[var(--s-code-string-color)] outline-none focus:ring-[length:var(--s-focus-ring-width)] focus:ring-[var(--s-focus-ring-color)]"
          />
        </label>
        <TokenChoice label="colors.primary" options={accentOptions} selected={accent} onChange={setAccent} />
        <TokenChoice label="radius.card" options={radiusOptions} selected={radius} onChange={setRadius} />
        <div className="grid grid-cols-[auto_1fr] gap-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px]">
          <span className="text-[var(--s-code-comment-color)]">33</span>
          <span><b className="text-[var(--s-code-keyword-color)]">categories</b>: complete</span>
        </div>
      </div>
    </section>
  );
}

function TokenChoice({ label, onChange, options, selected }: {
  label: string;
  onChange: (value: number) => void;
  options: readonly (readonly [string, string])[];
  selected: number;
}) {
  return (
    <fieldset>
      <legend className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-code-keyword-color)]">{label}</legend>
      <div className="mt-[var(--s-space-8)] grid grid-cols-3 gap-px bg-[var(--s-border)]">
        {options.map(([name], index) => (
          <button key={name} type="button" onClick={() => onChange(index)} aria-pressed={selected === index} className="min-h-11 bg-[var(--s-background)] px-[var(--s-space-8)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--s-text-muted)] aria-pressed:bg-[var(--living-accent)] aria-pressed:text-[var(--s-primary-contrast)] active:scale-[0.96]">
            {name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function DrivenSurface({ title }: { title: string }) {
  return (
    <section aria-label="Live compiled interface" className="relative overflow-hidden border border-[var(--s-border)] bg-[var(--s-surface)] p-[var(--s-space-16)] md:p-[var(--s-space-24)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[var(--living-accent)]" />
      <div className="flex items-center justify-between font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">
        <span>Compiled surface</span><span className="tabular-nums">0 errors</span>
      </div>
      <article className="mt-[var(--s-space-64)] rounded-[var(--living-radius)] border border-[var(--s-border-strong)] bg-[var(--s-card-background)] p-[var(--s-space-24)] shadow-[var(--s-card-shadow)]">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--living-accent)]">Token-driven</span>
        <h2 className="mt-[var(--s-space-16)] max-w-lg text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold leading-[var(--s-leading-tight)]">{title || "One document. Every surface."}</h2>
        <p className="mt-[var(--s-space-16)] max-w-md text-pretty text-[var(--s-size-sm)] text-[var(--s-text-muted)]">The sentence, accent, and radius above are live. In Sigil, the same causal chain reaches every component.</p>
        <button type="button" className="mt-[var(--s-space-32)] min-h-11 rounded-[var(--living-radius)] bg-[var(--living-accent)] px-[var(--s-space-20)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--s-primary-contrast)] active:scale-[0.96]">Compile design</button>
      </article>
      <div className="mt-[var(--s-space-24)] grid grid-cols-[1fr_auto] border-t border-[var(--s-border)] pt-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">
        <span>CSS · Tailwind v4 · W3C JSON</span><span className="tabular-nums">{SIGIL_PRODUCT_STATS.categoryCount}/33</span>
      </div>
    </section>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  const [title, setTitle] = useState("One document. Every surface.");
  const [accent, setAccent] = useState(0);
  const [radius, setRadius] = useState(1);
  const style: LivingStyle = {
    "--living-accent": accentOptions[accent]![1],
    "--living-radius": radiusOptions[radius]![1],
  };

  return (
    <ConceptRoot concept={concept} preset={dsgnPreset} compare={mode === "compare"}>
      <main style={style} className={mode === "compare" ? "pt-0" : "pt-12"}>
        <ConceptMasthead label="Document / runtime" />
        <section className="mx-auto grid max-w-[var(--s-content-max)] gap-[var(--s-space-48)] px-[var(--s-space-16)] py-[var(--s-space-64)] lg:grid-cols-[0.78fr_1.22fr] lg:px-[var(--s-space-32)] lg:py-[var(--s-space-80)]">
          <div data-concept-intro className="self-center">
            <Eyebrow>Living DESIGN.md</Eyebrow>
            <h1 className="mt-[var(--s-space-20)] max-w-2xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(3rem,13vw,5.25rem)] font-normal leading-[0.9] tracking-[var(--s-tracking-normal)] sm:text-[clamp(4rem,9vw,7.5rem)] sm:leading-[0.88] sm:tracking-[var(--s-tracking-tight)]">
              <span className="block sm:inline">Edit the</span>{" "}
              <span className="block sm:inline">sentence.</span>{" "}
              <span className="block sm:inline">Change the</span>{" "}
              <span className="block sm:inline">surface.</span>
            </h1>
            <p className="mt-[var(--s-space-24)] max-w-xl text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">The design document is not a PDF at the end of the process. It is the control surface at the beginning.</p>
            <div className="mt-[var(--s-space-32)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink href="/docs">Read DESIGN.md</PrimaryLink><SecondaryLink>View components</SecondaryLink></div>
          </div>
          <div data-concept-intro className="grid gap-[var(--s-space-16)] md:grid-cols-[0.86fr_1.14fr]">
            <DocumentEditor {...{ accent, radius, title, setAccent, setRadius, setTitle }} />
            <DrivenSurface title={title} />
          </div>
        </section>
        <StatsRail />
        <section data-concept-reveal className="mx-auto max-w-[var(--s-content-max)] px-[var(--s-space-16)] py-[var(--s-space-80)] lg:px-[var(--s-space-32)]">
          <div className="grid gap-[var(--s-space-32)] border-l border-[var(--s-border)] pl-[var(--s-space-24)] md:grid-cols-[0.65fr_1.35fr]">
            <Eyebrow>Cause → effect</Eyebrow>
            <p className="max-w-3xl text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] leading-[var(--s-leading-tight)]">Humans edit a readable spec. Agents inherit enforceable constraints. Components stay downstream.</p>
          </div>
        </section>
      </main>
      <ConceptFooter />
    </ConceptRoot>
  );
}
