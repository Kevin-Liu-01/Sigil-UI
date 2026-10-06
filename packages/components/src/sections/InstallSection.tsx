"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils";
import { useCopyToClipboard } from "../use-copy-to-clipboard";

export interface InstallCommand {
  label: string;
  command: string;
}

export interface InstallSectionProps extends HTMLAttributes<HTMLElement> {
  label?: string;
  title?: string;
  description?: string;
  note?: string;
  commands: InstallCommand[];
}

export const InstallSection = forwardRef<HTMLElement, InstallSectionProps>(
  function InstallSection({ label, title = "Get started", description, note, commands, className, ...props }, ref) {
    const safeCommands = commands ?? [];

    return (
      <section
        ref={ref}
        data-slot="install-section"
        className={cn("py-[var(--s-section-py,64px)]", className)}
        {...props}
      >
        <div className="mx-auto max-w-[var(--s-content-max,1200px)] px-[var(--s-page-margin,24px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              {label && (
                <p className="font-[family-name:var(--s-font-mono)] text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[var(--s-primary)] mb-4">
                  {label}
                </p>
              )}
              <h2 className="font-[family-name:var(--s-font-display)] text-2xl font-semibold leading-tight tracking-tight text-[var(--s-text)]">
                {title}
              </h2>
              {description && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--s-text-muted)]">{description}</p>
              )}
              {note && (
                <p className="mt-4 text-xs text-[var(--s-text-subtle)] font-[family-name:var(--s-font-mono)]">{note}</p>
              )}
            </div>

            <div className="flex flex-col gap-0">
              {safeCommands.map((cmd, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-[var(--s-radius-md,0px)] border border-[color:var(--s-border)] overflow-hidden",
                    i > 0 && "mt-3",
                  )}
                >
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--s-surface)] border-b border-[color:var(--s-border-muted)]">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--s-text-muted)] font-[family-name:var(--s-font-mono)]">
                      {cmd.label}
                    </span>
                    <CommandCopy command={cmd} />
                  </div>
                  <div className="px-4 py-3 bg-[var(--s-background)]">
                    <code className="text-sm font-[family-name:var(--s-font-mono)] text-[var(--s-text)]">
                      <span className="text-[var(--s-text-muted)]">$ </span>{cmd.command}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
);

function CommandCopy({ command }: { command: InstallCommand }) {
  const { copy, copied, error } = useCopyToClipboard(command.command);
  return (
    <button type="button" onClick={copy} aria-label={`Copy ${command.label} command`} aria-live="polite"
      className="sigil-install-copy inline-flex items-center justify-center min-h-[var(--s-control-hit-area)] px-[var(--s-space-12)] text-[length:var(--s-size-xs)] text-[var(--s-text-muted)] hover:text-[var(--s-text)] focus-visible:outline-[var(--s-focus-ring-color)]">
      {error ? "Copy failed — retry" : copied ? "Copied" : "Copy"}
    </button>
  );
}
