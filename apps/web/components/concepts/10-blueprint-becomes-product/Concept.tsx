"use client";

import { cobaltPreset } from "@sigil-ui/presets";
import { useState } from "react";
import { cn } from "@sigil-ui/components";
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

function BlueprintDrawing({ resolved }: { resolved: boolean }) {
  const [monitoring, setMonitoring] = useState(true);
  const [deployed, setDeployed] = useState(false);

  return (
    <div className="relative min-h-[32rem] overflow-hidden border border-[var(--s-border-strong)] bg-[var(--s-surface-sunken)] p-[var(--s-space-20)]">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(var(--s-grid-line-color)_1px,transparent_1px),linear-gradient(90deg,var(--s-grid-line-color)_1px,transparent_1px)] bg-[size:var(--s-grid-cell)_var(--s-grid-cell)] opacity-[var(--s-bg-pattern-opacity)]" />
      <div className="relative grid min-h-[28rem] place-items-center">
        <article
          className={cn(
            "w-[min(100%,32rem)] border border-[var(--s-border-strong)] p-[var(--s-space-20)] transition-[background-color,border-radius,box-shadow,transform] duration-[var(--s-duration-slow)]",
            resolved
              ? "rotate-0 rounded-[var(--s-card-radius)] bg-[var(--s-card-background)] shadow-[var(--s-card-shadow)]"
              : "-rotate-2 rounded-none bg-transparent shadow-none",
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--s-border)] pb-[var(--s-space-12)]">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-primary)]">Component / 014</span>
            <span aria-live="polite" className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{resolved ? (deployed ? "DEPLOYED" : "LIVE") : "SCHEMA"}</span>
          </div>
          <div className="mt-[var(--s-space-24)] flex items-start gap-[var(--s-space-16)]">
            <span className={cn("grid size-12 shrink-0 place-items-center border transition-[background-color,border-radius] duration-[var(--s-duration-slow)]", resolved ? "rounded-[var(--s-radius-md)] border-[var(--s-primary)] bg-[var(--s-primary)] text-[var(--s-primary-contrast)]" : "rounded-none border-dashed border-[var(--s-border-strong)] text-[var(--s-text-muted)]")}>
              <span className="font-[family-name:var(--s-font-mono)] text-[10px] font-bold">S</span>
            </span>
            <div className="min-w-0 flex-1">
              <div className={cn("h-[var(--s-space-8)] w-2/3 transition-[background-color] duration-[var(--s-duration-slow)]", resolved ? "bg-[var(--s-primary)]" : "border border-dashed border-[var(--s-border-strong)]")} />
              <h2 className={cn("mt-[var(--s-space-12)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)] font-semibold transition-colors duration-[var(--s-duration-slow)]", !resolved && "text-[var(--s-text-muted)]")}>
                Production surface
              </h2>
              <p className="mt-[var(--s-space-8)] max-w-sm text-pretty text-[var(--s-size-sm)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">The exact same geometry receives color, radius, shadow, content, and behavior.</p>
            </div>
          </div>

          <dl className="mt-[var(--s-space-24)] grid grid-cols-3 gap-px bg-[var(--s-border)]">
            {[["TOKENS", "519"], ["COMPONENTS", "350+"], ["STATUS", resolved ? "VALID" : "BOUND"]].map(([label, value]) => (
              <div key={label} className={cn("min-w-0 bg-[var(--s-background)] p-[var(--s-space-12)] transition-colors duration-[var(--s-duration-slow)]", !resolved && "bg-transparent")}>
                <dt className="truncate font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">{label}</dt>
                <dd className={cn("mt-[var(--s-space-8)] font-[family-name:var(--s-font-display)] text-[var(--s-size-lg)] font-semibold tabular-nums", !resolved && "text-[var(--s-text-muted)]")}>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-[var(--s-space-20)] flex min-h-11 items-center justify-between border border-[var(--s-border)] px-[var(--s-space-12)]">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em]">Live monitoring</span>
            <button
              type="button"
              disabled={!resolved}
              aria-label="Toggle live monitoring"
              aria-pressed={monitoring}
              onClick={() => setMonitoring((value) => !value)}
              className={cn("relative h-6 w-11 border border-[var(--s-border-strong)] transition-colors duration-[var(--s-duration-fast)] disabled:cursor-default", resolved && monitoring ? "bg-[var(--s-primary)]" : "bg-[var(--s-surface-sunken)]")}
            >
              <span className={cn("absolute top-1/2 size-4 -translate-y-1/2 bg-[var(--s-text)] transition-transform duration-[var(--s-duration-fast)]", monitoring && resolved ? "translate-x-5" : "translate-x-1")} />
            </button>
          </div>

          <div className="mt-[var(--s-space-16)] grid grid-cols-[1fr_auto] gap-[var(--s-space-8)]">
            <button
              type="button"
              disabled={!resolved}
              onClick={() => setDeployed((value) => !value)}
              className={cn("min-h-11 border px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.14em] transition-[background-color,color,transform] duration-[var(--s-duration-fast)] active:scale-[0.98] disabled:cursor-default", resolved ? "border-[var(--s-primary)] bg-[var(--s-primary)] text-[var(--s-primary-contrast)]" : "border-dashed border-[var(--s-border-strong)] text-[var(--s-text-muted)]")}
            >
              {resolved ? (deployed ? "Rollback" : "Deploy component") : "Primary action"}
            </button>
            <button type="button" disabled={!resolved} className="min-h-11 border border-[var(--s-border)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase disabled:cursor-default disabled:text-[var(--s-text-muted)]">
              Inspect
            </button>
          </div>
        </article>
        <span className="absolute left-0 top-0 font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--s-text-muted)]">A / content plane</span>
        <span className="absolute bottom-0 right-0 font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--s-text-muted)]">Scale 1:1</span>
      </div>
    </div>
  );
}

function BlueprintControls({ resolved, onChange }: { resolved: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-px bg-[var(--s-border)]">
      <button
        type="button"
        aria-pressed={!resolved}
        onClick={() => onChange(false)}
        className={cn("min-h-14 bg-[var(--s-background)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] transition-[background-color,transform] duration-[var(--s-duration-fast)] active:scale-[0.98]", !resolved && "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]")}
      >
        Blueprint
      </button>
      <button
        type="button"
        aria-pressed={resolved}
        onClick={() => onChange(true)}
        className={cn("min-h-14 bg-[var(--s-background)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] transition-[background-color,transform] duration-[var(--s-duration-fast)] active:scale-[0.98]", resolved && "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]")}
      >
        Product
      </button>
    </div>
  );
}

function BlueprintHero() {
  const [resolved, setResolved] = useState(false);
  return (
    <section className="grid border-b border-[var(--s-border)] lg:grid-cols-[0.78fr_1.22fr]">
      <div className="flex flex-col justify-between p-[var(--s-space-24)] pt-[var(--s-space-64)] md:p-[var(--s-space-48)] md:pt-[var(--s-space-80)]">
        <div data-concept-intro>
          <Eyebrow>Blueprint Becomes Product</Eyebrow>
          <h1 className="mt-[var(--s-space-20)] max-w-xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),7vw,var(--s-size-6xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)]">
            Watch constraints become components.
          </h1>
          <p className="mt-[var(--s-space-24)] max-w-lg text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-secondary)]">
            Sigil turns a legible specification into production CSS, Tailwind v4, W3C JSON, and a complete React surface.
          </p>
        </div>
        <div data-concept-intro className="mt-[var(--s-space-48)] flex flex-wrap gap-[var(--s-space-12)]">
          <PrimaryLink href="/docs/installation">Build from the spec</PrimaryLink>
          <SecondaryLink href="/docs/theming">Inspect tokens</SecondaryLink>
        </div>
      </div>
      <div className="grid gap-px bg-[var(--s-border)] p-[var(--s-space-16)] md:p-[var(--s-space-24)]">
        <BlueprintDrawing resolved={resolved} />
        <BlueprintControls resolved={resolved} onChange={setResolved} />
      </div>
    </section>
  );
}

function ProofSection() {
  const outputs = [
    ["01", "CSS custom properties", "Runtime-ready semantic variables"],
    ["02", "Tailwind v4", "A generated @theme block"],
    ["03", "W3C JSON", "Portable design-token output"],
    ["04", "React components", "350+ constrained consumers"],
  ] as const;
  return (
    <section data-concept-reveal className="grid border-b border-[var(--s-border)] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="p-[var(--s-space-24)] md:p-[var(--s-space-48)]">
        <Eyebrow>Drawing set B</Eyebrow>
        <h2 className="mt-[var(--s-space-16)] max-w-lg text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">The specification stays readable at the top of the chain.</h2>
        <DesignSpecPanel className="mt-[var(--s-space-32)]" />
      </div>
      <ol className="grid gap-px bg-[var(--s-border)] sm:grid-cols-2">
        {outputs.map(([number, title, description]) => (
          <li key={number} className="min-h-48 bg-[var(--s-background)] p-[var(--s-space-24)]">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-primary)]">{number}</span>
            <h3 className="mt-[var(--s-space-32)] font-[family-name:var(--s-font-display)] text-[var(--s-size-xl)] font-semibold">{title}</h3>
            <p className="mt-[var(--s-space-8)] max-w-xs text-pretty text-[var(--s-size-sm)] text-[var(--s-text-muted)]">{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BlueprintBody() {
  return (
    <>
      <ConceptMasthead label="Drawing 10 / revision D" />
      <main>
        <BlueprintHero />
        <StatsRail />
        <ProofSection />
      </main>
      <ConceptFooter />
    </>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={cobaltPreset} compare={mode === "compare"} className="pt-12">
      <BlueprintBody />
    </ConceptRoot>
  );
}
