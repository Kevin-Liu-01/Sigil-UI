"use client";

import { ArrowUpRight, Check, GitCompareArrows } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@sigil-ui/components";
import { CONCEPTS, type ConceptDefinition } from "@/lib/concepts/manifest";
import { SigilMark } from "./shared/SigilMark";

const families = ["all", "material", "industrial", "editorial", "instrument", "spatial"] as const;
type Family = (typeof families)[number];

function ConceptCard({
  concept,
  selected,
  onSelect,
}: {
  concept: ConceptDefinition;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article className="group grid border-b border-r border-[var(--s-border)] bg-[var(--s-background)]">
      <Link
        href={`/concepts/${concept.slug}`}
        className="relative aspect-[16/10] overflow-hidden border-b border-[var(--s-border)] bg-[var(--s-surface)] no-underline"
      >
        <img
          src={`/concepts/previews/${concept.slug}-desktop-dark.png`}
          alt={`${concept.title} desktop preview`}
          loading="lazy"
          className="size-full object-cover object-top outline outline-1 -outline-offset-1 outline-[color-mix(in_oklch,var(--s-text)_10%,transparent)] transition-transform duration-[var(--s-duration-slow)] group-hover:scale-[1.015] motion-reduce:transition-none"
        />
        <span className="absolute right-[var(--s-space-12)] top-[var(--s-space-12)] grid size-10 place-items-center border border-[color-mix(in_oklch,var(--s-text)_18%,transparent)] bg-[color-mix(in_oklch,var(--s-background)_82%,transparent)] text-[var(--s-text)] backdrop-blur-md">
          <ArrowUpRight aria-hidden className="size-4" />
        </span>
      </Link>
      <div className="grid grid-cols-[1fr_auto]">
        <Link href={`/concepts/${concept.slug}`} className="min-w-0 p-[var(--s-space-16)] text-inherit no-underline md:p-[var(--s-space-20)]">
          <div className="flex items-center gap-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">
            <span className="tabular-nums">{String(concept.index).padStart(2, "0")}</span>
            <span>{concept.family}</span>
            <span>{concept.preset}</span>
          </div>
          <h2 className="mt-[var(--s-space-12)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-xl)] font-semibold">
            {concept.title}
          </h2>
          <p className="mt-[var(--s-space-8)] max-w-[40ch] text-pretty text-[var(--s-size-sm)] leading-relaxed text-[var(--s-text-muted)]">
            {concept.thesis}
          </p>
        </Link>
        <button
          type="button"
          aria-pressed={selected}
          aria-label={`${selected ? "Remove" : "Add"} ${concept.title} ${selected ? "from" : "to"} comparison`}
          onClick={onSelect}
          className={cn(
            "grid min-h-12 w-14 place-items-center border-l border-[var(--s-border)] transition-colors duration-[var(--s-duration-fast)] active:scale-[0.96]",
            selected
              ? "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]"
              : "bg-transparent text-[var(--s-text-muted)] hover:text-[var(--s-text)]",
          )}
        >
          <Check aria-hidden className={cn("size-4", !selected && "opacity-20")} />
        </button>
      </div>
    </article>
  );
}

export function ConceptGallery() {
  const [family, setFamily] = useState<Family>("all");
  const [selection, setSelection] = useState<string[]>([CONCEPTS[0].slug, CONCEPTS[1].slug]);
  const filtered = useMemo(
    () => (family === "all" ? CONCEPTS : CONCEPTS.filter((concept) => concept.family === family)),
    [family],
  );
  const compareHref = `/concepts/compare?a=${selection[0] ?? CONCEPTS[0].slug}&b=${selection[1] ?? CONCEPTS[1].slug}`;

  const toggleSelection = (slug: string) => {
    setSelection((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length < 2) return [...current, slug];
      return [current[1]!, slug];
    });
  };

  return (
    <main className="min-h-[100dvh] bg-[var(--s-background)] text-[var(--s-text)]">
      <header className="border-b border-[var(--s-border)]">
        <div className="mx-auto flex max-w-[var(--s-content-max-wide)] items-center justify-between px-[var(--s-space-16)] py-[var(--s-space-16)] md:px-[var(--s-space-24)]">
          <Link href="/" className="flex min-h-11 items-center gap-[var(--s-space-12)] text-inherit no-underline">
            <SigilMark className="size-7" />
            <span className="font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)] font-semibold">Sigil UI</span>
          </Link>
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)]">
            Redesign study / 20
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-[var(--s-content-max-wide)] border-x border-[var(--s-border)] lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)]">
        <div className="p-[var(--s-space-24)] md:p-[var(--s-space-48)] lg:p-[var(--s-space-64)]">
          <p className="font-[family-name:var(--s-font-mono)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--s-primary)]">
            Site redesign gauntlet
          </p>
          <h1 className="mt-[var(--s-space-20)] max-w-[12ch] text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),7vw,var(--s-size-6xl))] font-semibold leading-[0.94] tracking-[var(--s-heading-display-tracking)]">
            Twenty ways to make constraints visible.
          </h1>
        </div>
        <div className="flex flex-col justify-end border-t border-[var(--s-border)] p-[var(--s-space-24)] lg:border-l lg:border-t-0 lg:p-[var(--s-space-32)]">
          <p className="max-w-[44ch] text-pretty text-[var(--s-size-sm)] leading-relaxed text-[var(--s-text-muted)]">
            Each route is a complete Sigil homepage direction. Review product clarity, composition, material, motion, and system fidelity—then compare two side by side.
          </p>
          <Link
            href={compareHref}
            aria-disabled={selection.length !== 2}
            className={cn(
              "mt-[var(--s-space-24)] inline-flex min-h-11 items-center justify-between border border-[var(--s-primary)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] no-underline",
              selection.length === 2
                ? "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]"
                : "pointer-events-none opacity-40",
            )}
          >
            Compare selection
            <GitCompareArrows aria-hidden className="size-4" />
          </Link>
        </div>
      </section>

      <nav aria-label="Filter concepts" className="sticky top-0 z-30 border-y border-[var(--s-border)] bg-[color-mix(in_oklch,var(--s-background)_92%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[var(--s-content-max-wide)] overflow-x-auto border-x border-[var(--s-border)]">
          {families.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFamily(item)}
              className={cn(
                "min-h-11 shrink-0 border-r border-[var(--s-border)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em] transition-colors duration-[var(--s-duration-fast)]",
                family === item
                  ? "bg-[var(--s-text)] text-[var(--s-background)]"
                  : "text-[var(--s-text-muted)] hover:text-[var(--s-text)]",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      <section className="mx-auto grid max-w-[var(--s-content-max-wide)] border-l border-t border-[var(--s-border)] md:grid-cols-2">
        {filtered.map((concept) => (
          <ConceptCard
            key={concept.slug}
            concept={concept}
            selected={selection.includes(concept.slug)}
            onSelect={() => toggleSelection(concept.slug)}
          />
        ))}
      </section>
    </main>
  );
}
