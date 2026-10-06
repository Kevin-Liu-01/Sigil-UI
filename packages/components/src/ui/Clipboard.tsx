"use client";

import {
  forwardRef,
  useCallback,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils";
import { useCopyToClipboard } from "../use-copy-to-clipboard";
import { useSigilSound } from "../sound-context";

export interface ClipboardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  value: string;
  /** Time in ms before resetting to idle state. @default 2000 */
  timeout?: number;
  children?: (state: { copied: boolean; error: boolean; copy: () => void }) => ReactNode;
}

export const Clipboard = forwardRef<HTMLButtonElement, ClipboardProps>(function Clipboard(
  { value, timeout = 2000, children, className, onClick, ...props },
  ref,
) {
  const { play } = useSigilSound();
  const { copy: copyValue, copied, error } = useCopyToClipboard(value, timeout);
  const copy = useCallback(async () => {
    if (await copyValue()) play("success");
  }, [copyValue, play]);

  if (children) {
    return <>{children({ copied, error, copy })}</>;
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-live="polite"
      data-slot="clipboard"
      data-copied={copied || undefined}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) void copy();
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5",
        "rounded-[var(--s-radius-sm,4px)] px-2 py-1",
        "text-xs font-medium text-[var(--s-text-muted)]",
        "border border-[color:var(--s-border)] border-[style:var(--s-border-style,solid)]",
        "bg-[var(--s-surface)]",
        "hover:bg-[var(--s-surface-elevated)]",
        "transition-colors duration-[var(--s-duration-fast,150ms)]",
        "focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]",
        className,
      )}
      {...props}
    >
      {error ? "Copy failed — retry" : copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <rect x="5" y="5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9 5V3.5A1.5 1.5 0 007.5 2h-4A1.5 1.5 0 002 3.5v4A1.5 1.5 0 003.5 9H5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
});
