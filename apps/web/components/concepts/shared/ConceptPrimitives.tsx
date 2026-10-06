"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { cn } from "@sigil-ui/components";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
import { SigilMark } from "./SigilMark";

export function ConceptMasthead({ label }: { label?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--s-border)] px-[var(--s-space-16)] py-[var(--s-space-12)] md:px-[var(--s-space-24)]">
      <div className="flex items-center gap-[var(--s-space-12)]">
        <SigilMark className="size-6" />
        <span className="font-[family-name:var(--s-font-display)] text-[var(--s-size-sm)] font-semibold">
          Sigil UI
        </span>
      </div>
      <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--s-text-muted)]">
        {label ?? "One file controls everything"}
      </span>
    </header>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--s-font-mono)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--s-primary)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PrimaryLink({ children, href = "/docs" }: { children: ReactNode; href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-[var(--s-space-12)] border border-[var(--s-primary)] bg-[var(--s-primary)] px-[var(--s-space-20)] py-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--s-primary-contrast)] no-underline transition-transform duration-[var(--s-duration-fast)] active:scale-[0.96]"
    >
      {children}
      <ArrowUpRight aria-hidden className="size-3.5" />
    </Link>
  );
}

export function SecondaryLink({ children, href = "/components" }: { children: ReactNode; href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-[var(--s-space-12)] border border-[var(--s-border)] px-[var(--s-space-20)] py-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--s-text)] no-underline transition-[border-color,transform] duration-[var(--s-duration-fast)] hover:border-[var(--s-border-strong)] active:scale-[0.96]"
    >
      {children}
    </Link>
  );
}

export function StatsRail({ className }: { className?: string }) {
  const stats = [
    [SIGIL_PRODUCT_STATS.componentCountLabel, "Components"],
    [String(SIGIL_PRODUCT_STATS.presetCount), "Presets"],
    [String(SIGIL_PRODUCT_STATS.tokenCount), "Tokens"],
    [String(SIGIL_PRODUCT_STATS.categoryCount), "Categories"],
  ];
  return (
    <dl className={cn("grid grid-cols-2 border-y border-[var(--s-border)] md:grid-cols-4", className)}>
      {stats.map(([value, label], index) => (
        <div
          key={label}
          className={cn(
            "px-[var(--s-space-16)] py-[var(--s-space-20)]",
            index > 0 && "border-l border-[var(--s-border)]",
          )}
        >
          <dt className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">
            {label}
          </dt>
          <dd className="mt-[var(--s-space-8)] font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)] font-semibold tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

async function writeClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return;
  } catch {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
}

export function CopyCommand({ command = "npx create-sigil-app@latest" }: { command?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await writeClipboard(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex min-h-12 w-full items-center justify-between border border-[var(--s-border)] bg-[var(--s-code-bg)] px-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[var(--s-size-xs)] text-[var(--s-code-string-color)] transition-[border-color,transform] duration-[var(--s-duration-fast)] hover:border-[var(--s-border-strong)] active:scale-[0.99]"
    >
      <span className="truncate">{command}</span>
      {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
      <span className="sr-only">{copied ? "Copied" : "Copy command"}</span>
    </button>
  );
}

export function ConceptFooter() {
  return (
    <footer className="grid border-t border-[var(--s-border)] md:grid-cols-[1fr_auto]">
      <div className="flex items-center gap-[var(--s-space-12)] px-[var(--s-space-16)] py-[var(--s-space-20)] md:px-[var(--s-space-24)]">
        <SigilMark className="size-6" />
        <p className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--s-text-muted)]">
          Edit tokens. Not components.
        </p>
      </div>
      <div className="flex items-center border-t border-[var(--s-border)] px-[var(--s-space-16)] py-[var(--s-space-20)] md:border-l md:border-t-0 md:px-[var(--s-space-24)]">
        <Link href="/docs" className="inline-flex min-h-11 items-center text-[var(--s-size-xs)] text-[var(--s-text)] underline-offset-4 hover:underline">
          Read the architecture
        </Link>
      </div>
    </footer>
  );
}
