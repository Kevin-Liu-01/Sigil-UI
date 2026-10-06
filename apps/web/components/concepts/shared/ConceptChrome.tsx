"use client";

import { ArrowLeft, ArrowRight, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import type { ConceptDefinition } from "@/lib/concepts/manifest";
import { getAdjacentConcept } from "@/lib/concepts/manifest";

export function ConceptChrome({ concept }: { concept: ConceptDefinition }) {
  const { resolvedTheme, setTheme } = useTheme();
  const previous = getAdjacentConcept(concept.slug, -1);
  const next = getAdjacentConcept(concept.slug, 1);

  return (
    <nav
      aria-label="Concept review"
      className="fixed inset-x-0 top-0 z-40 mx-auto flex h-12 w-[min(100%-1rem,var(--s-content-max))] items-center justify-between border-x border-b border-[var(--s-border)] bg-[color-mix(in_oklch,var(--s-background)_88%,transparent)] px-2 backdrop-blur-md md:px-3"
    >
      <div className="flex items-center">
        <Link
          href="/concepts"
          className="flex min-h-11 items-center gap-2 px-2 font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)] no-underline hover:text-[var(--s-text)]"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Index
        </Link>
        <span className="hidden border-l border-[var(--s-border)] px-3 font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-text-muted)] sm:block">
          {String(concept.index).padStart(2, "0")} / 20
        </span>
      </div>

      <span className="max-w-[40vw] truncate font-[family-name:var(--s-font-display)] text-xs font-medium">
        {concept.title}
      </span>

      <div className="flex items-center">
        <button
          type="button"
          aria-label="Toggle color mode"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="grid size-11 place-items-center border-l border-[var(--s-border)] bg-transparent text-[var(--s-text-muted)] active:scale-[0.96]"
        >
          <Sun aria-hidden className="hidden size-3.5 dark:block" />
          <Moon aria-hidden className="size-3.5 dark:hidden" />
        </button>
        <Link
          href={`/concepts/${previous.slug}`}
          aria-label={`Previous concept: ${previous.title}`}
          className="grid size-11 place-items-center border-l border-[var(--s-border)] text-[var(--s-text-muted)] no-underline hover:text-[var(--s-text)] active:scale-[0.96]"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
        </Link>
        <Link
          href={`/concepts/${next.slug}`}
          aria-label={`Next concept: ${next.title}`}
          className="grid size-11 place-items-center border-l border-[var(--s-border)] text-[var(--s-text-muted)] no-underline hover:text-[var(--s-text)] active:scale-[0.96]"
        >
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </nav>
  );
}
