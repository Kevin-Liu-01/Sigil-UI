"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils";
import { useCopyToClipboard } from "../use-copy-to-clipboard";

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Code content. */
  code: string;
  /** Language label. */
  language?: string;
  /** Show line numbers. @default true */
  showLineNumbers?: boolean;
  /** File name to display. */
  fileName?: string;
}

/** Code block with language label, line numbers, and copy button. */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { code, language, showLineNumbers = true, fileName, className, ...rest },
  ref,
) {
  const safeCode = code ?? "";
  const lines = safeCode.split("\n");

  const { copy: handleCopy, copied, error } = useCopyToClipboard(safeCode);

  return (
    <div
      ref={ref}
      data-slot="code-block"
      className={cn(
        "rounded-[var(--s-radius-card,8px)] border border-[color:var(--s-border)] border-[style:var(--s-border-style,solid)] overflow-hidden",
        "bg-[var(--s-code-bg,var(--s-background))] font-[family:var(--s-code-font-family,ui-monospace,SFMono-Regular,monospace)] text-sm",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-[color:var(--s-border)] border-[style:var(--s-border-style,solid)] bg-[var(--s-surface)]">
        <div className="flex items-center gap-2 text-xs text-[var(--s-text-muted)]">
          {fileName && <span>{fileName}</span>}
          {language && !fileName && <span>{language}</span>}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-[var(--s-text-muted)] hover:text-[var(--s-text)] transition-colors duration-[var(--s-duration-fast,150ms)] px-2 py-1 rounded-[var(--s-radius-sm,4px)]"
          aria-label={error ? "Copy failed. Retry copying code" : copied ? "Code copied" : "Copy code"}
          aria-live="polite"
        >
          {error ? "Copy failed — retry" : copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="m-0">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="inline-block w-8 text-right mr-4 text-[var(--s-text-muted)] select-none shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                )}
                <span className="text-[var(--s-text)]">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
});
