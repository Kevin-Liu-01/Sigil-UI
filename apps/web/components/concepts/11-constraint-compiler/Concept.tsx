"use client";

import { cipherPreset } from "@sigil-ui/presets";
import { Check, LoaderCircle, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@sigil-ui/components";
import {
  ConceptFooter,
  ConceptMasthead,
  CopyCommand,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
} from "../shared/ConceptPrimitives";
import { ConceptRoot } from "../shared/ConceptRoot";
import type { ConceptPageProps } from "../shared/types";

const trace = [
  ["001", "read", "DESIGN.md"],
  ["002", "parse", "33 token categories"],
  ["003", "validate", "519 required fields"],
  ["004", "emit", "CSS + Tailwind + W3C JSON"],
  ["005", "bind", "350+ React components"],
] as const;

const outputStreams = [
  {
    label: "CSS variables",
    file: "tokens.css",
    lines: [
      ":root {",
      "  --s-primary: oklch(0.72 0.16 145);",
      "  --s-radius-md: 8px;",
      "}",
    ],
  },
  {
    label: "Tailwind theme",
    file: "theme.css",
    lines: [
      "@theme {",
      "  --color-primary: var(--s-primary);",
      "  --radius-md: var(--s-radius-md);",
      "}",
    ],
  },
  {
    label: "W3C JSON",
    file: "tokens.json",
    lines: [
      '"primary": {',
      '  "$value": "oklch(0.72 0.16 145)",',
      '  "$type": "color"',
      "}",
    ],
  },
] as const;

function OutputStreams() {
  return (
    <div className="grid border-t border-[var(--s-primary)] lg:grid-cols-3">
      {outputStreams.map((stream, streamIndex) => (
        <section
          key={stream.file}
          className={cn(
            "min-w-0 bg-[var(--s-code-bg)]",
            streamIndex > 0 && "border-t border-[var(--s-primary)] lg:border-l lg:border-t-0",
          )}
        >
          <div className="flex min-h-11 items-center justify-between border-b border-[var(--s-border)] px-[var(--s-space-16)]">
            <span className="font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-base)] font-bold uppercase tracking-[var(--s-tracking-wide)] text-[var(--s-text)]">
              {stream.label}
            </span>
            <span className="font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-base)] text-[var(--s-text-muted)]">
              {stream.file}
            </span>
          </div>
          <pre className="overflow-x-auto p-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-xl)] leading-[var(--s-leading-relaxed)] text-[var(--s-text)]">
            <code>{stream.lines.join("\n")}</code>
          </pre>
        </section>
      ))}
    </div>
  );
}

function CompilerTrace({ completedCount, running }: { completedCount: number; running: boolean }) {
  const compiled = completedCount === trace.length;
  return (
    <div aria-live="polite" className="border border-[var(--s-primary)] bg-[var(--s-background)] text-[var(--s-text)] shadow-[var(--s-shadow-lg)]">
      <div className="flex min-h-12 items-center justify-between gap-[var(--s-space-16)] border-b border-[var(--s-primary)] px-[var(--s-space-16)] md:px-[var(--s-space-20)]">
        <span className="font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-base)] font-bold uppercase tracking-[var(--s-tracking-wide)] text-[var(--s-text)]">
          constraint-compiler
        </span>
        <span className={cn("font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-base)] font-bold uppercase tracking-[var(--s-tracking-wide)]", compiled ? "text-[var(--s-success)]" : running ? "text-[var(--s-primary)]" : "text-[var(--s-warning)]")}>
          {compiled ? "PASS / 3 outputs" : running ? `${completedCount} / ${trace.length}` : "READY"}
        </span>
      </div>
      <div aria-hidden className="grid grid-cols-5 gap-px bg-[var(--s-border)]">
        {trace.map(([line], index) => (
          <span
            key={line}
            className={cn(
              "h-[var(--s-space-8)] bg-[var(--s-surface)] transition-colors duration-[var(--s-duration-fast)]",
              index < completedCount && "bg-[var(--s-success)]",
              running && index === completedCount && "bg-[var(--s-primary)]",
            )}
          />
        ))}
      </div>
      <ol className="divide-y divide-[var(--s-border)]">
        {trace.map(([line, operation, value], index) => (
          <li
            key={line}
            className={cn(
              "grid min-h-14 grid-cols-[auto_5.5rem_1fr_auto] items-center gap-[var(--s-space-12)] px-[var(--s-space-16)] py-[var(--s-space-12)] font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-xl)] transition-colors duration-[var(--s-duration-fast)] md:px-[var(--s-space-20)]",
              running && index === completedCount && "bg-[var(--s-primary-muted)]",
            )}
          >
            <span className="tabular-nums text-[var(--s-text)] opacity-80">{line}</span>
            <span className="font-semibold text-[var(--s-primary)]">{operation}</span>
            <span className="min-w-0 truncate font-medium text-[var(--s-text)]">{value}</span>
            {index < completedCount ? (
              <Check aria-label="passed" className="size-4 text-[var(--s-success)]" />
            ) : running && index === completedCount ? (
              <LoaderCircle aria-label="compiling" className="size-4 animate-spin text-[var(--s-primary)]" />
            ) : (
              <span aria-hidden className="size-2 border border-[var(--s-border-strong)]" />
            )}
          </li>
        ))}
      </ol>
      {compiled && <OutputStreams />}
    </div>
  );
}

function CompilerControl() {
  const [completedCount, setCompletedCount] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const compile = () => {
    if (running) return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setCompletedCount(0);
    setRunning(true);

    let nextCount = 1;
    const advance = () => {
      setCompletedCount(nextCount);
      if (nextCount === trace.length) {
        setRunning(false);
        timerRef.current = null;
        return;
      }
      nextCount += 1;
      timerRef.current = window.setTimeout(advance, 360);
    };

    timerRef.current = window.setTimeout(advance, 360);
  };

  const compiled = completedCount === trace.length;
  return (
    <div className="grid gap-[var(--s-space-12)]">
      <div className="flex flex-col gap-[var(--s-space-12)] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-lg)] text-[var(--s-text-secondary)]">
          One source enters. Three synchronized formats leave.
        </p>
        <button
          type="button"
          onClick={compile}
          disabled={running}
          className="flex min-h-11 shrink-0 items-center justify-between gap-[var(--s-space-20)] border border-[var(--s-primary)] bg-[var(--s-primary)] px-[var(--s-space-20)] font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-base)] font-bold uppercase tracking-[var(--s-tracking-wide)] text-[var(--s-primary-contrast)] transition-[opacity,transform] duration-[var(--s-duration-fast)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          <span>{running ? "Compiling constraints" : compiled ? "Compile again" : "Compile constraints"}</span>
          {running ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Play aria-hidden className="size-4" />}
        </button>
      </div>
      <CompilerTrace completedCount={completedCount} running={running} />
    </div>
  );
}

function CompilerHero() {
  return (
    <section className="border-b border-[var(--s-border)]">
      <div className="p-[var(--s-space-24)] pt-[var(--s-space-64)] md:p-[var(--s-space-48)] md:pt-[var(--s-space-80)]">
        <div data-concept-intro className="max-w-5xl">
          <Eyebrow>Constraint Compiler</Eyebrow>
          <h1 className="mt-[var(--s-space-20)] max-w-4xl text-balance font-[family-name:var(--s-font-display)] text-[clamp(var(--s-size-4xl),7vw,var(--s-size-6xl))] font-[var(--s-heading-display-weight)] leading-[var(--s-heading-display-leading)] tracking-[var(--s-heading-display-tracking)]">
            Taste, compiled into rails.
          </h1>
        </div>
        <div data-concept-intro className="mt-[var(--s-space-32)] grid gap-[var(--s-space-24)] border-t border-[var(--s-border)] pt-[var(--s-space-24)] md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-2xl text-pretty text-[var(--s-size-lg)] leading-[var(--s-leading-relaxed)] text-[var(--s-text)] opacity-80">
            References suggest. Constraints decide. Sigil converts a human-readable system into rules every agent and component must obey.
          </p>
          <div className="flex flex-wrap gap-[var(--s-space-12)]">
            <PrimaryLink href="/docs/installation">Install Sigil</PrimaryLink>
            <SecondaryLink href="/docs/cli">Read CLI docs</SecondaryLink>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--s-border)] bg-[var(--s-surface)] p-[var(--s-space-16)] md:p-[var(--s-space-32)]">
        <CompilerControl />
      </div>
    </section>
  );
}

function ConstraintLedger() {
  const rows = [
    ["Color", "OKLCH semantic roles", "Every surface"],
    ["Type", "Display / body / mono", "Every text node"],
    ["Space", "4px internals / 8px layout", "Every rhythm"],
    ["Motion", "Purpose + reduced mode", "Every transition"],
    ["Layout", "Rails / gutters / cells", "Every page"],
  ] as const;
  return (
    <section data-concept-reveal className="border-b border-[var(--s-border)] p-[var(--s-space-24)] md:p-[var(--s-space-48)]">
      <div className="grid gap-[var(--s-space-32)] lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <Eyebrow>Constraint table</Eyebrow>
          <h2 className="mt-[var(--s-space-16)] max-w-md text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-3xl)] font-semibold">The source stays small. Its reach does not.</h2>
        </div>
        <div className="border border-[var(--s-border)]">
          {rows.map(([domain, rule, reach], index) => (
            <div key={domain} className={cn("grid gap-[var(--s-space-8)] p-[var(--s-space-16)] sm:grid-cols-[0.5fr_1fr_0.7fr]", index > 0 && "border-t border-[var(--s-border)]")}>
              <strong className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-[0.14em]">{domain}</strong>
              <span className="text-[var(--s-size-sm)] text-[var(--s-text-secondary)]">{rule}</span>
              <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase text-[var(--s-text-muted)]">{reach}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompilerBody() {
  return (
    <>
      <ConceptMasthead label="Compiler / deterministic" />
      <main>
        <CompilerHero />
        <ConstraintLedger />
        <section data-concept-reveal className="grid gap-[var(--s-space-24)] p-[var(--s-space-24)] md:grid-cols-[1fr_1.2fr] md:p-[var(--s-space-48)]">
          <div>
            <Eyebrow>Run locally</Eyebrow>
            <h2 className="mt-[var(--s-space-16)] text-balance font-[family-name:var(--s-font-display)] text-[var(--s-size-2xl)] font-semibold">Validate before the interface drifts.</h2>
          </div>
          <CopyCommand command="npx @sigil-ui/cli doctor" />
        </section>
      </main>
      <ConceptFooter />
    </>
  );
}

export function Concept({ concept, mode = "detail" }: ConceptPageProps) {
  return (
    <ConceptRoot concept={concept} preset={cipherPreset} compare={mode === "compare"} className="pt-12">
      <CompilerBody />
    </ConceptRoot>
  );
}
