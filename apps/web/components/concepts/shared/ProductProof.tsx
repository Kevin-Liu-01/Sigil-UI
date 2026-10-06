"use client";

import { useState } from "react";
import { cn } from "@sigil-ui/components";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";

const tokenRows = [
  ["colors.primary", "oklch(0.72 0.16 145)"],
  ["typography.display", "PP Neue Montreal"],
  ["radius.card", "var(--s-radius-md)"],
  ["motion.slow", "var(--s-duration-slow)"],
] as const;

export function DesignSpecPanel({ className }: { className?: string }) {
  return (
    <div className={cn("border border-[var(--s-border)] bg-[var(--s-code-bg)]", className)}>
      <div className="flex items-center justify-between border-b border-[var(--s-border)] px-[var(--s-space-16)] py-[var(--s-space-12)]">
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.18em]">
          DESIGN.md
        </span>
        <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-text-muted)]">
          {SIGIL_PRODUCT_STATS.tokenCount} fields
        </span>
      </div>
      <div className="space-y-[var(--s-space-12)] p-[var(--s-space-16)]">
        {tokenRows.map(([key, value], index) => (
          <div key={key} className="grid grid-cols-[auto_1fr] gap-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px]">
            <span className="tabular-nums text-[var(--s-code-comment-color)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p>
              <span className="text-[var(--s-code-keyword-color)]">{key}</span>
              <span className="text-[var(--s-code-comment-color)]">: </span>
              <span className="text-[var(--s-code-string-color)]">{value}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TokenPipeline({ vertical = false }: { vertical?: boolean }) {
  const stages = ["DESIGN.md", "519 tokens", "CSS + Tailwind", "350+ components"];
  return (
    <ol className={cn("grid border border-[var(--s-border)]", vertical ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4")}>
      {stages.map((stage, index) => (
        <li
          key={stage}
          className={cn(
            "relative min-h-24 p-[var(--s-space-16)]",
            index > 0 && (vertical ? "border-t" : "border-l"),
            "border-[var(--s-border)]",
          )}
        >
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] tabular-nums text-[var(--s-primary)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="mt-[var(--s-space-20)] font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)] font-semibold">
            {stage}
          </p>
        </li>
      ))}
    </ol>
  );
}

const previewTabs = ["Button", "Card", "Input"] as const;

export function ComponentProof({ className }: { className?: string }) {
  const [active, setActive] = useState<(typeof previewTabs)[number]>("Button");
  return (
    <div className={cn("border border-[var(--s-border)] bg-[var(--s-card-background)]", className)}>
      <div className="flex border-b border-[var(--s-border)]">
        {previewTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "min-h-11 flex-1 border-r border-[var(--s-border)] px-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.12em] transition-colors duration-[var(--s-duration-fast)] last:border-r-0",
              active === tab
                ? "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]"
                : "text-[var(--s-text-muted)] hover:text-[var(--s-text)]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid min-h-56 place-items-center p-[var(--s-space-24)]">
        {active === "Button" && (
          <button className="min-h-11 bg-[var(--s-primary)] px-[var(--s-button-px)] py-[var(--s-button-py)] font-[family-name:var(--s-button-font-family)] font-[var(--s-button-font-weight)] text-[var(--s-primary-contrast)] active:scale-[0.96]">
            Compile design
          </button>
        )}
        {active === "Card" && (
          <article className="w-full max-w-xs rounded-[var(--s-card-radius)] border border-[var(--s-card-border)] bg-[var(--s-card-background)] p-[var(--s-card-padding)] shadow-[var(--s-card-shadow)]">
            <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-primary)]">TOKEN-DRIVEN</span>
            <h3 className="mt-[var(--s-space-16)] font-[family-name:var(--s-font-display)] text-[var(--s-card-title-size)] font-[var(--s-card-title-weight)]">One source of truth.</h3>
            <p className="mt-[var(--s-space-8)] text-[var(--s-card-description-size)] text-[var(--s-text-muted)]">Every component reads the same constraints.</p>
          </article>
        )}
        {active === "Input" && (
          <label className="w-full max-w-xs text-[var(--s-size-xs)]">
            Primary token
            <input
              defaultValue="oklch(0.72 0.16 145)"
              className="mt-[var(--s-space-8)] h-[var(--s-input-height)] w-full rounded-[var(--s-radius-input)] border-[length:var(--s-input-border-width)] border-[var(--s-border-interactive)] bg-[var(--s-component-surface-bg)] px-[var(--s-input-px)] text-[var(--s-text)] outline-none focus:ring-[length:var(--s-input-focus-ring-width)] focus:ring-[var(--s-input-focus-ring-color)]"
            />
          </label>
        )}
      </div>
    </div>
  );
}

export function MetalField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative aspect-square overflow-hidden rounded-[var(--s-radius-full)] border border-[var(--s-border-strong)] bg-[conic-gradient(from_210deg_at_48%_44%,var(--s-background),var(--s-text-muted),var(--s-surface),var(--s-text),var(--s-background),var(--s-primary-muted),var(--s-background))] shadow-[var(--s-shadow-xl)]",
        className,
      )}
    >
      <div className="absolute inset-[12%] rounded-[var(--s-radius-full)] border border-[color-mix(in_oklch,var(--s-text)_18%,transparent)] bg-[radial-gradient(circle_at_35%_28%,var(--s-surface-elevated),transparent_44%),radial-gradient(circle_at_65%_72%,var(--s-primary-muted),transparent_50%)]" />
      <div className="absolute inset-[28%] grid place-items-center rounded-[var(--s-radius-full)] border border-[var(--s-border)] bg-[color-mix(in_oklch,var(--s-background)_82%,transparent)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
        Sigil
      </div>
    </div>
  );
}
