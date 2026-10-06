"use client";

import { axiomPreset } from "@sigil-ui/presets";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
import {
  ConceptFooter,
  ConceptMasthead,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import type { ConceptPageProps } from "../shared/types";

type RevealStyle = CSSProperties & {
  "--reveal-x": string;
  "--reveal-y": string;
};

function HiddenProof({ pinned, setPinned }: { pinned: boolean; setPinned: (value: boolean) => void }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCoarsePointer(coarse.matches);
      if (coarse.matches || reduced.matches) setPinned(true);
    };
    sync();
    coarse.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      coarse.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [setPinned]);

  const reveal = (event: PointerEvent<HTMLDivElement>) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    const index = rect.width < 640
      ? (y >= rect.height / 2 ? 2 : 0) + (x >= rect.width / 2 ? 1 : 0)
      : Math.min(3, Math.floor((x / rect.width) * 4));
    setActive(index);
    if (event.pointerType !== "mouse") setPinned(true);
    if (pinned || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    field.style.setProperty("--reveal-x", `${x}px`);
    field.style.setProperty("--reveal-y", `${y}px`);
  };

  const style: RevealStyle = { "--reveal-x": "50%", "--reveal-y": "50%" };
  const facts = [
    ["SOURCE", "DESIGN.md"],
    ["TOKENS", String(SIGIL_PRODUCT_STATS.tokenCount)],
    ["SURFACES", SIGIL_PRODUCT_STATS.componentCountLabel],
    ["EDITS", "one file"],
  ];

  return (
    <section
      ref={fieldRef}
      style={style}
      onPointerMove={reveal}
      onPointerDown={reveal}
      tabIndex={0}
      aria-label="Interactive product proof landmarks"
      className="group relative min-h-[34rem] overflow-hidden border-y border-[var(--s-border)] bg-[var(--s-background)] outline-none focus:ring-inset focus:ring-[length:var(--s-focus-ring-width)] focus:ring-[var(--s-focus-ring-color)]"
    >
      <div className="absolute inset-x-0 top-0 z-[1] flex justify-center p-[var(--s-space-16)]">
        <p className="max-w-xl text-center font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--s-text-subtle)]">{coarsePointer ? "Tap a landmark · proof stays open on touch" : "Move across a landmark to reveal its proof"}</p>
      </div>
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
        {facts.map(([label, value], index) => (
          <button key={label} type="button" onClick={() => { setActive(index); setPinned(true); }} aria-pressed={active === index} className="min-h-36 border-r border-[var(--s-border-muted)] p-[var(--s-space-16)] text-left text-[var(--s-text-subtle)] opacity-30 transition-[color,opacity] duration-[var(--s-duration-fast)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)] aria-pressed:opacity-60">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em]">{String(index + 1).padStart(2, "0")} / {label}</span>
            <strong className="mt-[var(--s-space-32)] block font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)] font-semibold tabular-nums">{value}</strong>
          </button>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid bg-[var(--s-text)] text-[var(--s-background)] transition-[clip-path] duration-[var(--s-duration-slow)] motion-reduce:[clip-path:inset(0)]"
        style={{ clipPath: pinned ? "inset(0)" : "circle(var(--s-space-80) at var(--reveal-x) var(--reveal-y))" }}
      >
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(var(--s-background)_1px,transparent_1px),linear-gradient(90deg,var(--s-background)_1px,transparent_1px)] [background-size:var(--s-grid-cell)_var(--s-grid-cell)] opacity-10" />
        <div className="relative m-auto grid w-[min(90%,var(--s-content-max))] grid-cols-2 gap-px bg-[var(--s-background)] md:grid-cols-4">
          {facts.map(([label, value], index) => (
            <div key={label} className={`min-h-36 bg-[var(--s-text)] p-[var(--s-space-16)] transition-opacity duration-[var(--s-duration-fast)] ${active === index ? "opacity-100" : "opacity-25"}`}>
              <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] opacity-60">{label}</span>
              <strong className="mt-[var(--s-space-32)] block font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)] font-semibold tabular-nums">{value}</strong>
            </div>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{facts[active]![0]}: {facts[active]![1]}</p>
      <button type="button" onClick={() => setPinned(!pinned)} aria-pressed={pinned} className="absolute bottom-[var(--s-space-16)] right-[var(--s-space-16)] z-[1] min-h-11 border border-[var(--s-border-strong)] bg-[var(--s-background)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text)] shadow-[var(--s-shadow-md)] active:scale-[0.96]">
        {pinned ? (coarsePointer ? "Close proof" : "Release proof") : "Hold proof open"}
      </button>
    </section>
  );
}

function NullSequence() {
  const steps = ["Write the constraint.", "Compile the contract.", "Inherit the result."];
  return (
    <ol className="mx-auto max-w-[var(--s-content-max)] border-x border-[var(--s-border)]">
      {steps.map((step, index) => (
        <li key={step} className="grid min-h-36 grid-cols-[auto_1fr] items-center gap-[var(--s-space-24)] border-b border-[var(--s-border)] px-[var(--s-space-16)] first:border-t md:px-[var(--s-space-32)]">
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-primary)]">0{index + 1}</span>
          <p className="text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)]">{step}</p>
        </li>
      ))}
    </ol>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  const [pinned, setPinned] = useState(false);

  return (
    <ConceptRoot concept={concept} preset={axiomPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "pt-0" : "pt-12"}>
        <ConceptMasthead label="Null / causality only" />
        <section className="mx-auto grid min-h-[42rem] max-w-[var(--s-content-max)] content-between px-[var(--s-space-16)] py-[var(--s-space-64)] md:px-[var(--s-space-32)] md:py-[var(--s-space-80)]">
          <div data-concept-intro><Eyebrow>Null Surface</Eyebrow></div>
          <div data-concept-intro className="grid items-end gap-[var(--s-space-48)] md:grid-cols-[1.45fr_0.55fr]">
            <h1 className="max-w-5xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(3.5rem,9vw,9rem)] font-medium leading-[0.86] tracking-[var(--s-tracking-tight)]">Remove everything but causality.</h1>
            <div>
              <p className="max-w-sm text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">One readable file changes every visual property across the system.</p>
              <div className="mt-[var(--s-space-24)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink>Read the system</PrimaryLink><SecondaryLink>View components</SecondaryLink></div>
            </div>
          </div>
        </section>
        <div data-concept-reveal><HiddenProof pinned={pinned} setPinned={setPinned} /></div>
        <section data-concept-reveal className="mx-auto max-w-[var(--s-content-max)] px-[var(--s-space-16)] py-[var(--s-space-80)] text-center md:px-[var(--s-space-32)]">
          <p className="mx-auto max-w-4xl text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] leading-[var(--s-leading-tight)]">The interface is the evidence. The token is the cause.</p>
        </section>
        <NullSequence />
      </main>
      <ConceptFooter />
    </ConceptRoot>
  );
}
