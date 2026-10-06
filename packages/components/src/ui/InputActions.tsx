"use client";

import { forwardRef, useRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "../utils";
import { useCopyToClipboard } from "../use-copy-to-clipboard";
import { Button } from "./Button";
import { Input } from "./Input";

export interface StepperFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onIncrement?: () => void;
  onDecrement?: () => void;
}

/** Numeric input with native stepping, form events, and optional action overrides. */
export const StepperField = forwardRef<HTMLInputElement, StepperFieldProps>(function StepperField(
  { onIncrement, onDecrement, onChange, disabled, readOnly, className, value, defaultValue, min, max, ...props },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [current, setCurrent] = useState(String(defaultValue ?? ""));
  const number = Number(value ?? current);
  const blocked = disabled || readOnly;

  function step(direction: 1 | -1) {
    const override = direction === 1 ? onIncrement : onDecrement;
    if (override) return override();
    const input = inputRef.current;
    if (!input) return;
    const previous = input.value;
    const originalStep = input.step;
    if (originalStep === "any") input.step = "1";
    input.stepUp(direction);
    input.step = originalStep;
    if (input.value !== previous) input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  return (
    <div className="sigil-stepper-field flex w-full items-center gap-[var(--s-space-8)]">
      <Button type="button" variant="outline" size="icon" onClick={() => step(-1)} aria-label="Decrease" disabled={blocked || (min !== undefined && number <= Number(min))}>−</Button>
      <Input
        {...props}
        ref={(node) => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
        type="number" value={value} defaultValue={defaultValue} min={min} max={max}
        disabled={disabled} readOnly={readOnly}
        className={cn("text-center tabular-nums", className)}
        onChange={(event) => { setCurrent(event.target.value); onChange?.(event); }}
      />
      <Button type="button" variant="outline" size="icon" onClick={() => step(1)} aria-label="Increase" disabled={blocked || (max !== undefined && number >= Number(max))}>+</Button>
    </div>
  );
});

export interface CopyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Called after the current input value is successfully copied. */
  onCopyValue?: (value: string) => void;
}

/** Copy the current field value with visible success and failure feedback. */
export const CopyInput = forwardRef<HTMLInputElement, CopyInputProps>(function CopyInput(
  { value, defaultValue, onCopyValue, onChange, disabled, className, ...props },
  ref,
) {
  const [current, setCurrent] = useState(String(defaultValue ?? ""));
  const text = String(value ?? current);
  const { copy, copied, error } = useCopyToClipboard(text);
  return (
    <div className="sigil-copy-input flex gap-[var(--s-space-8)]">
      <Input {...props} ref={ref} value={value} defaultValue={defaultValue} disabled={disabled} className={className}
        onChange={(event) => { setCurrent(event.target.value); onChange?.(event); }} />
      <Button type="button" variant="outline" disabled={disabled} aria-live="polite"
        onClick={async () => { if (await copy()) onCopyValue?.(text); }}>
        {error ? "Copy failed — retry" : copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
});
