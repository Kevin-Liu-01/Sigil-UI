"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONCEPTS, type ConceptDefinition } from "@/lib/concepts/manifest";

function getFrameScrollTarget(frame: HTMLIFrameElement | null) {
  const frameWindow = frame?.contentWindow;
  const root = frame?.contentDocument?.querySelector<HTMLElement>("[data-concept]");
  let current = root?.parentElement ?? null;
  while (current && current !== frame?.contentDocument?.body) {
    const overflow = frameWindow?.getComputedStyle(current).overflowY;
    if ((overflow === "auto" || overflow === "scroll") && current.scrollHeight > current.clientHeight) {
      return {
        target: current as EventTarget,
        read: () => current!.scrollTop,
        write: (top: number) => { current!.scrollTop = top; },
      };
    }
    current = current.parentElement;
  }
  if (!frameWindow) return null;
  return {
    target: frameWindow as EventTarget,
    read: () => frameWindow.scrollY,
    write: (top: number) => frameWindow.scrollTo({ top }),
  };
}

export function ConceptCompare({ left, right }: { left: ConceptDefinition; right: ConceptDefinition }) {
  const router = useRouter();
  const leftFrame = useRef<HTMLIFrameElement>(null);
  const rightFrame = useRef<HTMLIFrameElement>(null);
  const [sync, setSync] = useState(true);
  const [frameEpoch, setFrameEpoch] = useState(0);

  useEffect(() => {
    if (!sync) return;
    const leftScroll = getFrameScrollTarget(leftFrame.current);
    const rightScroll = getFrameScrollTarget(rightFrame.current);
    if (!leftScroll || !rightScroll) return;

    let active: "left" | "right" | null = null;
    const syncFromLeft = () => {
      if (active === "right") return;
      active = "left";
      rightScroll.write(leftScroll.read());
      requestAnimationFrame(() => { active = null; });
    };
    const syncFromRight = () => {
      if (active === "left") return;
      active = "right";
      leftScroll.write(rightScroll.read());
      requestAnimationFrame(() => { active = null; });
    };

    leftScroll.target.addEventListener("scroll", syncFromLeft, { passive: true });
    rightScroll.target.addEventListener("scroll", syncFromRight, { passive: true });
    return () => {
      leftScroll.target.removeEventListener("scroll", syncFromLeft);
      rightScroll.target.removeEventListener("scroll", syncFromRight);
    };
  }, [frameEpoch, left.slug, right.slug, sync]);

  const update = (side: "a" | "b", slug: string) => {
    const params = new URLSearchParams({ a: left.slug, b: right.slug });
    params.set(side, slug);
    router.replace(`/concepts/compare?${params.toString()}`);
  };

  return (
    <main className="flex min-h-[100dvh] flex-col bg-[var(--s-background)] text-[var(--s-text)]">
      <h1 className="sr-only">Compare Sigil redesign concepts</h1>
      <header className="grid border-b border-[var(--s-border)] md:grid-cols-[1fr_1fr_auto]">
        <label className="flex min-h-12 items-center gap-[var(--s-space-12)] border-b border-[var(--s-border)] px-[var(--s-space-16)] md:border-b-0 md:border-r">
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">A</span>
          <select
            value={left.slug}
            onChange={(event) => update("a", event.target.value)}
            className="h-10 min-w-0 flex-1 bg-transparent font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)] outline-none"
          >
            {CONCEPTS.map((concept) => <option key={concept.slug} value={concept.slug}>{concept.title}</option>)}
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-[var(--s-space-12)] px-[var(--s-space-16)] md:border-r">
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">B</span>
          <select
            value={right.slug}
            onChange={(event) => update("b", event.target.value)}
            className="h-10 min-w-0 flex-1 bg-transparent font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)] outline-none"
          >
            {CONCEPTS.map((concept) => <option key={concept.slug} value={concept.slug}>{concept.title}</option>)}
          </select>
        </label>
        <button
          type="button"
          aria-pressed={sync}
          onClick={() => setSync((value) => !value)}
          className="min-h-12 border-t border-[var(--s-border)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em] md:border-t-0"
        >
          Scroll sync {sync ? "on" : "off"}
        </button>
      </header>
      <section className="grid flex-1 md:grid-cols-2">
        <iframe
          ref={leftFrame}
          onLoad={() => setFrameEpoch((value) => value + 1)}
          src={`/concepts/${left.slug}?compare=1`}
          title={`${left.title} comparison`}
          className="h-[calc(100dvh-9rem)] w-full border-0 border-b border-[var(--s-border)] md:h-[calc(100dvh-3rem)] md:border-b-0 md:border-r"
        />
        <iframe
          ref={rightFrame}
          onLoad={() => setFrameEpoch((value) => value + 1)}
          src={`/concepts/${right.slug}?compare=1`}
          title={`${right.title} comparison`}
          className="h-[calc(100dvh-9rem)] w-full border-0 md:h-[calc(100dvh-3rem)]"
        />
      </section>
    </main>
  );
}
