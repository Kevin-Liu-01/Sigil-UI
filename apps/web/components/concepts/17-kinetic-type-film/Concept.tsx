"use client";

import { vexPreset } from "@sigil-ui/presets";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
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

const frames = [
  { word: "EDIT", sub: "a readable specification", count: "01" },
  { word: "TOKENS.", sub: `${SIGIL_PRODUCT_STATS.tokenCount} visual constraints`, count: "02" },
  { word: "NOT", sub: `${SIGIL_PRODUCT_STATS.componentCountLabel} downstream surfaces`, count: "03" },
  { word: "COMPONENTS.", sub: "zero visual drift", count: "04" },
] as const;

type FrameAction =
  | { type: "delta"; value: -1 | 1 }
  | { type: "set"; value: number };

function FilmStage({ frame, navigate }: { frame: number; navigate: (action: FrameAction) => void }) {
  const stageRef = useRef<HTMLElement>(null);
  const lastWheel = useRef(0);
  const pointerStart = useRef<{ id: number; x: number } | null>(null);
  const current = frames[frame]!;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handleWheel = (event: globalThis.WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const now = performance.now();
      if (Math.abs(delta) < 24 || now - lastWheel.current < 240) return;
      event.preventDefault();
      event.stopPropagation();
      lastWheel.current = now;
      navigate({ type: "delta", value: delta > 0 ? 1 : -1 });
    };
    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [navigate]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      navigate({ type: "delta", value: 1 });
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      navigate({ type: "delta", value: -1 });
    } else if (event.key === "Home") {
      event.preventDefault();
      navigate({ type: "set", value: 0 });
    } else if (event.key === "End") {
      event.preventDefault();
      navigate({ type: "set", value: frames.length - 1 });
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStart.current = { id: event.pointerId, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.id !== event.pointerId) return;
    const distance = event.clientX - start.x;
    if (Math.abs(distance) >= 48) {
      navigate({ type: "delta", value: distance < 0 ? 1 : -1 });
    }
  };

  return (
    <section
      ref={stageRef}
      aria-label="Kinetic type sequence. Use the mouse wheel, arrow keys, swipe, buttons, or slider to change frames."
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative min-h-[32rem] touch-pan-y overflow-hidden border-y border-[var(--s-border-strong)] bg-[var(--s-text)] text-[var(--s-background)] outline-none focus-visible:ring-inset focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]"
    >
      <div aria-hidden className="absolute inset-y-0 left-[12%] w-px bg-[var(--s-background)] opacity-20" />
      <div aria-hidden className="absolute inset-y-0 right-[12%] w-px bg-[var(--s-background)] opacity-20" />
      <div key={current.word} className="grid min-h-[32rem] place-items-center px-[var(--s-space-16)] text-center transition-[opacity,transform,filter] duration-[var(--s-duration-slow)] motion-reduce:transition-none">
        <div>
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums tracking-[0.2em] opacity-60">FRAME {current.count} / 04</span>
          <p className="mt-[var(--s-space-24)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(4rem,14vw,12rem)] font-semibold leading-[0.78] tracking-[var(--s-tracking-tighter)]">{current.word}</p>
          <p className="mx-auto mt-[var(--s-space-32)] max-w-sm font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] opacity-70">{current.sub}</p>
        </div>
      </div>
      <div className="absolute inset-x-[var(--s-space-16)] bottom-[var(--s-space-16)] flex items-center gap-[var(--s-space-12)] md:inset-x-[var(--s-space-24)]">
        <button type="button" onClick={() => navigate({ type: "delta", value: -1 })} className="min-h-11 border border-[var(--s-background)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] active:scale-[0.96]">Previous</button>
        <label className="flex flex-1 items-center gap-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em]">
          <span className="sr-only">Sequence frame</span>
          <input aria-label="Sequence frame" type="range" min={0} max={frames.length - 1} value={frame} onChange={(event) => navigate({ type: "set", value: Number(event.target.value) })} className="min-h-11 w-full accent-[var(--s-background)]" />
        </label>
        <button type="button" onClick={() => navigate({ type: "delta", value: 1 })} className="min-h-11 border border-[var(--s-background)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] active:scale-[0.96]">Next</button>
      </div>
    </section>
  );
}

function ArgumentStrip() {
  const claims = [
    ["Input", "DESIGN.md"],
    ["Compile", "CSS · Tailwind · W3C"],
    ["Output", `${SIGIL_PRODUCT_STATS.componentCountLabel} components`],
  ];
  return (
    <section className="grid gap-px bg-[var(--s-border)] md:grid-cols-[0.8fr_1.2fr_0.8fr]">
      {claims.map(([label, value], index) => (
        <div key={label} className="min-h-48 bg-[var(--s-background)] p-[var(--s-space-24)]">
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-primary)]">0{index + 1} / {label}</span>
          <p className="mt-[var(--s-space-48)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)] font-semibold">{value}</p>
        </div>
      ))}
    </section>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  const [frame, setFrame] = useState(0);
  const navigate = useCallback((action: FrameAction) => {
    setFrame((current) => {
      if (action.type === "set") return Math.max(0, Math.min(frames.length - 1, action.value));
      return (current + action.value + frames.length) % frames.length;
    });
  }, []);

  return (
    <ConceptRoot concept={concept} preset={vexPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "pt-0" : "pt-12"}>
        <ConceptMasthead label="Type / sequence 00:18" />
        <section className="mx-auto grid max-w-[var(--s-content-max)] items-end gap-[var(--s-space-48)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[1.3fr_0.7fr] md:px-[var(--s-space-32)] md:py-[var(--s-space-80)]">
          <div data-concept-intro>
            <Eyebrow>Kinetic Type Film</Eyebrow>
            <h1 className="mt-[var(--s-space-20)] max-w-4xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.84] tracking-[var(--s-tracking-tighter)]">The architecture, in four hard cuts.</h1>
          </div>
          <div data-concept-intro>
            <p className="max-w-md text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">Wheel across the frame or use the scrubber. Every cut reduces the product to a causal statement.</p>
            <div className="mt-[var(--s-space-24)] flex flex-wrap gap-[var(--s-space-12)]"><PrimaryLink>Start with Sigil</PrimaryLink><SecondaryLink>View components</SecondaryLink></div>
          </div>
        </section>
        <FilmStage frame={frame} navigate={navigate} />
        <div data-concept-reveal><ArgumentStrip /></div>
        <section data-concept-reveal className="mx-auto max-w-[var(--s-content-max)] px-[var(--s-space-16)] py-[var(--s-space-80)] md:px-[var(--s-space-32)]">
          <div className="grid gap-[var(--s-space-24)] md:grid-cols-[auto_1fr]">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--s-primary)]">Final frame</span>
            <p className="max-w-4xl text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-4xl)] font-semibold leading-[var(--s-leading-tight)]">A reference shows taste. A constraint system keeps it.</p>
          </div>
        </section>
      </main>
      <ConceptFooter />
    </ConceptRoot>
  );
}
