"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error message — puts the input in error state when truthy. */
  error?: string | boolean;
  /** Icon or element to display on the left. */
  iconLeft?: ReactNode;
  /** Icon or element to display on the right. */
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, iconLeft, iconRight, className, ...rest },
  ref,
) {
  const hasError = Boolean(error);

  return (
    <div className="relative w-full">
      {iconLeft && (
        <span className="absolute left-2.5 top-0 bottom-0 flex items-center text-[var(--s-text-muted)] pointer-events-none [&_svg]:shrink-0 [&_svg:not([data-icon])]:size-4">
          {iconLeft}
        </span>
      )}
      <input
        ref={ref}
        data-slot="input"
        aria-invalid={hasError || undefined}
        className={cn(
          "flex h-[var(--s-input-height,36px)] w-full rounded-[var(--s-radius-input,0px)] border border-[style:var(--s-border-style,solid)] px-3 py-1 text-sm",
          "bg-[var(--s-background)] text-[var(--s-text)]",
          "placeholder:text-[var(--s-text-muted)]",
          "transition-all duration-[var(--s-duration-fast,150ms)]",
          "focus-visible:outline-none focus-visible:border-[color:var(--s-input-focus-ring-color)] focus-visible:ring-[length:var(--s-input-focus-ring-width)] focus-visible:ring-[var(--s-input-focus-ring-color)]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--s-text)]",
          "autofill:shadow-[inset_0_0_0px_1000px_var(--s-surface)]",
          "aria-invalid:border-[color:var(--s-error)] aria-invalid:ring-[var(--s-error)]/20",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([data-icon])]:size-4",
          hasError ? "border-[color:var(--s-error)]" : "border-[color:var(--s-border)]",
          iconLeft && "pl-9",
          iconRight && "pr-9",
          className,
        )}
        {...rest}
      />
      {iconRight && (
        <span className="absolute right-2.5 top-0 bottom-0 flex items-center text-[var(--s-text-muted)] pointer-events-none [&_svg]:shrink-0 [&_svg:not([data-icon])]:size-4">
          {iconRight}
        </span>
      )}
      {typeof error === "string" && error && (
        <p className="mt-1 text-xs text-[var(--s-error)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
