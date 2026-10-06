"use client";

import {
  forwardRef,
  useCallback,
  useState,
  useRef,
  type KeyboardEvent,
  type HTMLAttributes,
} from "react";
import { cn } from "../utils";

export interface TagsInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  max?: number;
  inputLabel?: string;
}

export const TagsInput = forwardRef<HTMLDivElement, TagsInputProps>(function TagsInput(
  { value: controlledValue, defaultValue = [], onChange, placeholder = "Add tag...", disabled, max, inputLabel = "Add tag", className, ...props },
  ref,
) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const tags = controlledValue ?? internalValue;

  const update = useCallback(
    (next: string[]) => {
      if (controlledValue === undefined) setInternalValue(next);
      onChange?.(next);
    },
    [controlledValue, onChange],
  );

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed || tags.includes(trimmed)) return;
      if (max && tags.length >= max) return;
      update([...tags, trimmed]);
    },
    [tags, max, update],
  );

  const removeTag = useCallback(
    (index: number) => {
      update(tags.filter((_, i) => i !== index));
    },
    [tags, update],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const val = (e.target as HTMLInputElement).value;
    if ((e.key === "Enter" || e.key === ",") && val) {
      e.preventDefault();
      addTag(val);
      (e.target as HTMLInputElement).value = "";
    }
    if (e.key === "Backspace" && !val && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div
      ref={ref}
      data-slot="tags-input"
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "flex flex-wrap items-center gap-1.5 min-h-[var(--s-input-height,36px)] px-2 py-1.5",
        "rounded-[var(--s-radius-input,var(--s-radius-md,6px))]",
        "border border-[color:var(--s-border)] border-[style:var(--s-border-style,solid)]",
        "bg-[var(--s-background)]",
        "focus-within:ring-[length:var(--s-input-focus-ring-width)] focus-within:ring-[var(--s-input-focus-ring-color)]/20 focus-within:border-[color:var(--s-input-focus-ring-color)]",
        "transition-all duration-[var(--s-duration-fast,150ms)]",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          data-slot="tags-input-tag"
          className={cn(
            "inline-flex items-center gap-1 h-6 px-2",
            "rounded-[var(--s-radius-sm,3px)]",
            "bg-[var(--s-surface)] text-[var(--s-text)] text-xs font-medium",
            "border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)]",
          )}
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="-mr-1 ml-0.5 inline-flex size-5 items-center justify-center text-[var(--s-text-muted)] transition-colors hover:text-[var(--s-text)]"
              aria-label={`Remove ${tag}`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        aria-label={inputLabel}
        disabled={disabled}
        placeholder={tags.length === 0 ? placeholder : ""}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          if (e.target.value) {
            addTag(e.target.value);
            e.target.value = "";
          }
        }}
        className={cn(
          "flex-1 min-w-[60px] bg-transparent text-sm text-[var(--s-text)]",
          "placeholder:text-[var(--s-text-muted)]",
          "focus:outline-none",
          "disabled:cursor-not-allowed",
        )}
      />
    </div>
  );
});
