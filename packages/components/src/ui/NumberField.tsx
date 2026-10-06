"use client";

import { forwardRef, useCallback, useState, type HTMLAttributes } from "react";
import { cn } from "../utils";
import { useSigilSound } from "../sound-context";

export interface NumberFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const NumberField = forwardRef<HTMLDivElement, NumberFieldProps>(function NumberField(
  props,
  ref,
) {
  const { value: controlledValue, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled, className, ...rest } = props;
  const isControlled = "value" in props;
  const { play } = useSigilSound();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const rawValue = (isControlled ? controlledValue : internalValue) ?? 0;
  const value = Math.min(max, Math.max(min, Number.isFinite(rawValue) ? rawValue : 0));
  const incrementBy = Number.isFinite(step) && step > 0 ? step : 1;

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max],
  );

  const update = (next: number) => {
    if (disabled) return;
    const clamped = clamp(next);
    if (!isControlled) setInternalValue(clamped);
    play("tap");
    onValueChange?.(clamped);
  };
  const decrement = () => update(value - incrementBy);
  const increment = () => update(value + incrementBy);

  const btnBase = cn(
    "inline-flex h-full w-10 cursor-pointer items-center justify-center shrink-0",
    "text-[var(--s-text-muted)] transition-colors duration-[var(--s-duration-fast,150ms)]",
    "hover:bg-[var(--s-surface-elevated)] hover:text-[var(--s-text)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  );

  return (
    <div
      ref={ref}
      data-slot="number-field"
      className={cn(
        "inline-flex h-[var(--s-input-height,36px)] items-center overflow-hidden",
        "rounded-[var(--s-radius-input,0px)] border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)]",
        "bg-[var(--s-background)] text-sm",
        "focus-within:ring-[length:var(--s-input-focus-ring-width)] focus-within:ring-[var(--s-input-focus-ring-color)]/20 focus-within:border-[color:var(--s-input-focus-ring-color)]",
        className,
      )}
      {...rest}
    >
      <button type="button" disabled={disabled || value <= min} onClick={decrement} className={cn(btnBase, "border-r border-[color:var(--s-border)]")} aria-label="Decrease">
        <svg width="14" height="2" viewBox="0 0 14 2" fill="currentColor" aria-hidden><rect width="14" height="2" rx="1" /></svg>
      </button>
      <span className="min-w-[3rem] px-2 text-center tabular-nums font-medium text-[var(--s-text)] select-none">
        {value}
      </span>
      <button type="button" disabled={disabled || value >= max} onClick={increment} className={cn(btnBase, "border-l border-[color:var(--s-border)]")} aria-label="Increase">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
          <rect y="6" width="14" height="2" rx="1" />
          <rect x="6" width="2" height="14" rx="1" />
        </svg>
      </button>
    </div>
  );
});
