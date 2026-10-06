"use client";

import { basaltPreset } from "@sigil-ui/presets";
import { Activity, CheckCircle2, Cpu, Radio, ScanLine } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import {
  ConceptFooter,
  ConceptMasthead,
  CopyCommand,
  Eyebrow,
  PrimaryLink,
  StatsRail,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
import type { ConceptPageProps } from "../shared/types";

const diagnostics = [
  { label: "Token graph", value: `${SIGIL_PRODUCT_STATS.tokenCount} synced`, Icon: Cpu },
  { label: "Preset matrix", value: `${SIGIL_PRODUCT_STATS.presetCount} valid`, Icon: ScanLine },
  { label: "Component bus", value: `${SIGIL_PRODUCT_STATS.componentCountLabel} online`, Icon: Radio },
] as const;

function DiagnosticConsole() {
  const [active, setActive] = useState(0);
  const selected = diagnostics[active]!;
  const selectTab = (index: number) => {
    const next = (index + diagnostics.length) % diagnostics.length;
    setActive(next);
    document.getElementById(`oxide-tab-${next}`)?.focus();
  };
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTab(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectTab(diagnostics.length - 1);
    }
  };

  return (
    <div className="border-[length:var(--s-border-medium)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[var(--s-code-bg)] shadow-[var(--s-shadow-xl)]">
      <div className="flex items-center justify-between border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] py-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em]"><span className="flex items-center gap-[var(--s-space-8)]"><Activity aria-hidden className="size-3 text-[var(--s-primary)]" />Sigil diagnostic</span><span className="text-[var(--s-success)]">● live</span></div>
      <div className="grid md:grid-cols-[0.58fr_1.42fr]">
        <div role="tablist" aria-label="System diagnostics" className="border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] md:border-b-0 md:border-r">
          {diagnostics.map(({ label, value, Icon }, index) => (
            <button
              key={label}
              id={`oxide-tab-${index}`}
              role="tab"
              type="button"
              aria-controls="oxide-diagnostic-panel"
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
              className={index === active ? "grid min-h-20 w-full grid-cols-[auto_1fr] items-center gap-[var(--s-space-12)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] bg-[var(--s-primary)] px-[var(--s-space-16)] text-left text-[var(--s-primary-contrast)] last:border-b-0 focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-offset-[var(--s-focus-ring-offset)] focus-visible:outline-[var(--s-focus-ring-color)]" : "grid min-h-20 w-full grid-cols-[auto_1fr] items-center gap-[var(--s-space-12)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] px-[var(--s-space-16)] text-left text-[var(--s-text-muted)] last:border-b-0 hover:text-[var(--s-text)] focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-offset-[var(--s-focus-ring-offset)] focus-visible:outline-[var(--s-focus-ring-color)]"}
            >
              <Icon aria-hidden className="size-4" /><span><b className="block font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)]">{label}</b><small className="mt-[var(--s-space-4)] block font-[family-name:var(--s-font-mono)] text-[10px]">{value}</small></span>
            </button>
          ))}
        </div>
        <div id="oxide-diagnostic-panel" role="tabpanel" aria-labelledby={`oxide-tab-${active}`} tabIndex={0} className="flex min-h-96 flex-col justify-between p-[var(--s-space-24)] focus-visible:outline focus-visible:outline-[var(--s-focus-ring-width)] focus-visible:outline-offset-[calc(var(--s-focus-ring-offset)*-1)] focus-visible:outline-[var(--s-focus-ring-color)]">
          <div>
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-primary)]">Channel 0{active + 1}</span>
            <h3 className="mt-[var(--s-space-16)] font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">{selected.label}</h3>
            <div className="mt-[var(--s-space-32)] grid h-32 grid-cols-12 items-end gap-[var(--s-space-4)] border-b-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)]">
              {[28, 44, 38, 68, 52, 76, 62, 88, 70, 92, 84, 96].map((height, index) => <span key={`${active}-${index}`} aria-hidden className="bg-[var(--s-primary)] opacity-70" style={{ height: `${Math.max(20, height - active * 8)}%` }} />)}
            </div>
          </div>
          <div className="mt-[var(--s-space-32)] flex items-center justify-between border-t-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] pt-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em]"><span>{selected.value}</span><span className="flex items-center gap-[var(--s-space-8)] text-[var(--s-success)]"><CheckCircle2 aria-hidden className="size-3" />nominal</span></div>
        </div>
      </div>
    </div>
  );
}

function ReadoutGrid() {
  return (
    <div className="grid gap-[var(--s-space-12)] sm:grid-cols-[1.2fr_0.8fr]">
      <div className="border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] p-[var(--s-space-20)]"><span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">Compile route</span><p className="mt-[var(--s-space-20)] font-[family-name:var(--s-font-display)] text-[var(--s-size-xl)] font-semibold">Markdown → CSS → components</p></div>
      <div className="border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] p-[var(--s-space-20)]"><span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">Drift</span><p className="mt-[var(--s-space-12)] font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-semibold tabular-nums">0.00</p></div>
    </div>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={basaltPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "" : "pt-12"}>
        <ConceptMasthead label="System telemetry / 07" />
        <section className="grid gap-[var(--s-space-48)] px-[var(--s-space-16)] py-[var(--s-space-48)] md:px-[var(--s-space-48)] lg:grid-cols-[0.68fr_1.32fr] lg:items-center lg:px-[var(--s-space-64)]">
          <div className="max-w-xl">
            <Eyebrow>Inspect the system like hardware</Eyebrow>
            <h1 data-concept-intro className="mt-[var(--s-space-20)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),6vw,var(--s-heading-display-size))] font-semibold leading-[var(--s-heading-display-leading)]">Every stage exposed. Every signal legible.</h1>
            <p data-concept-intro className="mt-[var(--s-space-24)] text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Sigil treats design as operational infrastructure: inspectable constraints, validated presets, deterministic compilers, and components that cannot drift.</p>
            <div data-concept-intro className="mt-[var(--s-space-32)]"><PrimaryLink>Open diagnostics</PrimaryLink></div>
            <div data-concept-intro className="mt-[var(--s-space-20)]"><CopyCommand /></div>
          </div>
          <div data-concept-intro className="space-y-[var(--s-space-12)]"><DiagnosticConsole /><ReadoutGrid /></div>
        </section>
        <StatsRail />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[0.72fr_1.28fr] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]"><div><Eyebrow>Instrument, not ornament</Eyebrow><h2 className="mt-[var(--s-space-16)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-heading-h2-size)] font-[var(--s-heading-h2-weight)] leading-[var(--s-heading-h2-leading)]">The interface explains its own architecture.</h2></div><p className="max-w-2xl text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">All 33 categories stay observable from source to surface. Agents edit the same constraints humans review.</p></section>
        <ConceptFooter />
      </main>
    </ConceptRoot>
  );
}
