"use client";

import { obsidPreset } from "@sigil-ui/presets";
import { useRef, type PointerEvent } from "react";
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
import { DesignSpecPanel, TokenPipeline } from "../shared/ProductProof";
import type { ConceptPageProps } from "../shared/types";

function LiquidSeal() {
  const sealRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);

  const moveLight = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const xRatio = (event.clientX - bounds.left) / bounds.width;
    const yRatio = (event.clientY - bounds.top) / bounds.height;
    const x = xRatio * 100;
    const y = yRatio * 100;
    if (sealRef.current) {
      const rotateX = (0.5 - yRatio) * 4;
      const rotateY = (xRatio - 0.5) * 4;
      sealRef.current.style.transform = `perspective(60rem) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    if (lightRef.current) {
      lightRef.current.style.left = `${x}%`;
      lightRef.current.style.top = `${y}%`;
    }
  };

  const resetLight = () => {
    if (sealRef.current) sealRef.current.style.transform = "perspective(60rem) rotateX(0deg) rotateY(0deg)";
    if (lightRef.current) {
      lightRef.current.style.left = "50%";
      lightRef.current.style.top = "50%";
    }
  };

  return (
    <div data-concept-parallax className="mx-auto w-full max-w-xl">
      <div
        ref={sealRef}
        onPointerMove={moveLight}
        onPointerLeave={resetLight}
        className="group relative aspect-square w-full overflow-hidden rounded-[var(--s-radius-full)] border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[conic-gradient(from_145deg,var(--s-surface),var(--s-text-muted),var(--s-background),var(--s-text),var(--s-surface-elevated),var(--s-primary-muted),var(--s-surface))] shadow-[var(--s-shadow-xl)] transition-transform duration-[var(--s-duration-fast)] ease-[var(--s-ease-out)] motion-reduce:transform-none motion-reduce:transition-none"
        aria-label="Interactive metallic Sigil seal"
      >
        <span className="absolute inset-[8%] rounded-[var(--s-radius-full)] border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border)] bg-[radial-gradient(circle_at_36%_28%,var(--s-surface-elevated),transparent_42%),radial-gradient(circle_at_68%_74%,var(--s-primary-muted),transparent_50%)]" />
        <span className="absolute inset-[24%] rotate-45 border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-border-strong)] bg-[color-mix(in_oklch,var(--s-background)_76%,transparent)] backdrop-blur-md" />
        <span className="absolute inset-[34%] grid -rotate-45 place-items-center border-[length:var(--s-border-thin)] border-[style:var(--s-border-style,solid)] border-[var(--s-text)] font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-lg),4vw,var(--s-size-4xl))] font-semibold">
          S
        </span>
        <span
          ref={lightRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-[var(--s-radius-full)] bg-[radial-gradient(circle,var(--s-surface-elevated),transparent_68%)] opacity-40 mix-blend-screen transition-[left,top,opacity] duration-[var(--s-duration-fast)] group-hover:opacity-70 motion-reduce:left-1/2 motion-reduce:top-1/2 motion-reduce:transition-none"
        />
      </div>
    </div>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={obsidPreset} compare={mode === "compare"}>
      <main className={mode === "compare" ? "" : "pt-12"}>
        <ConceptMasthead label="Material study 01" />
        <section className="grid min-h-[calc(100dvh-var(--s-band-height))] items-center gap-[var(--s-space-48)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[minmax(0,0.82fr)_minmax(20rem,1.18fr)] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
          <div className="max-w-2xl">
            <Eyebrow>Specification / material</Eyebrow>
            <h1 data-concept-intro className="mt-[var(--s-space-20)] text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),7vw,var(--s-heading-display-size))] font-semibold leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-tracking)]">
              The spec becomes material.
            </h1>
            <p data-concept-intro className="mt-[var(--s-space-24)] max-w-xl text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text-muted)]">
              One readable DESIGN.md controls every color, surface, radius, type scale, and motion decision across Sigil UI.
            </p>
            <div data-concept-intro className="mt-[var(--s-space-32)] flex flex-wrap gap-[var(--s-space-12)]">
              <PrimaryLink>Open the system</PrimaryLink>
              <SecondaryLink>Inspect components</SecondaryLink>
            </div>
            <div data-concept-intro className="mt-[var(--s-space-32)] max-w-lg"><CopyCommand /></div>
          </div>
          <LiquidSeal />
        </section>

        <StatsRail />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] px-[var(--s-space-16)] py-[var(--s-space-64)] md:grid-cols-[0.8fr_1.2fr] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
          <div>
            <Eyebrow>Cause, made visible</Eyebrow>
            <h2 className="mt-[var(--s-space-16)] max-w-lg text-balance font-[family-name:var(--s-font-display)] text-[var(--s-heading-h2-size)] font-[var(--s-heading-h2-weight)] leading-[var(--s-heading-h2-leading)]">
              Edit upstream. Watch the entire interface move.
            </h2>
          </div>
          <DesignSpecPanel />
        </section>
        <section data-concept-reveal className="px-[var(--s-space-16)] pb-[var(--s-space-64)] md:px-[var(--s-space-48)] lg:px-[var(--s-space-64)]">
          <TokenPipeline />
        </section>
        <ConceptFooter />
      </main>
    </ConceptRoot>
  );
}
