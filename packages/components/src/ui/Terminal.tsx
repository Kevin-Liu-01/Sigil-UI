"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";
import { useCopyToClipboard } from "../use-copy-to-clipboard";

export interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
  /** Terminal title (shown in the title bar). */
  title?: string;
  /** Code/text lines to display. */
  lines?: string[];
  /** Show line numbers. @default true */
  showLineNumbers?: boolean;
  /** Render arbitrary children instead of lines. */
  children?: ReactNode;
}

/** Terminal/code display with line numbers and copy button. */
export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(function Terminal(
  { title = "Terminal", lines, showLineNumbers = true, className, children, ...rest },
  ref,
) {

  const { copy: handleCopy, copied, error } = useCopyToClipboard(lines?.join("\n") ?? "");

  return (
    <div
      ref={ref}
      data-slot="terminal"
      className={cn(
        "rounded-[var(--s-radius-card,8px)] border border-[color:var(--s-border)] border-[style:var(--s-border-style,solid)] overflow-hidden",
        "bg-[var(--s-background)] font-[family:var(--s-code-font-family,ui-monospace,SFMono-Regular,monospace)] text-sm",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-[color:var(--s-border)] border-[style:var(--s-border-style,solid)] bg-[var(--s-surface)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-[var(--s-radius-full)] bg-[var(--s-error)]" />
            <span className="w-3 h-3 rounded-[var(--s-radius-full)] bg-[var(--s-warning)]" />
            <span className="w-3 h-3 rounded-[var(--s-radius-full)] bg-[var(--s-success)]" />
          </div>
          <span className="text-xs text-[var(--s-text-muted)] ml-2">{title}</span>
        </div>
        {lines && (
          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer text-xs text-[var(--s-text-muted)] hover:text-[var(--s-text)] transition-colors duration-[var(--s-duration-fast,150ms)] px-2 py-1 rounded-[var(--s-radius-sm,4px)] focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]"
            aria-label={error ? "Copy failed. Retry" : copied ? "Copied to clipboard" : "Copy to clipboard"}
            aria-live="polite"
          >
            {error ? "Copy failed — retry" : copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <div className="p-4 overflow-x-auto">
        {lines ? (
          <pre className="m-0">
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right mr-4 text-[var(--s-text-muted)] select-none shrink-0">
                      {i + 1}
                    </span>
                  )}
                  <span className="text-[var(--s-text)]">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        ) : (
          <div className="text-[var(--s-text)]">{children}</div>
        )}
      </div>
    </div>
  );
});
