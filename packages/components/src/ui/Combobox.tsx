"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "../utils";
import { useSigilSound } from "../sound-context";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  props,
  ref,
) {
  const { options, value: controlledValue, defaultValue = "", onValueChange, placeholder = "Select…", searchPlaceholder = "Search…", emptyText = "No results.", className } = props;
  const isControlled = "value" in props;
  const { play } = useSigilSound();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  const setOpenWithSound = useCallback((nextOrFn: boolean | ((prev: boolean) => boolean)) => {
    setOpen((prev) => {
      const next = typeof nextOrFn === "function" ? nextOrFn(prev) : nextOrFn;
      if (next !== prev) play(next ? "open" : "close");
      return next;
    });
  }, [play]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );
  const enabledIndexes = filtered.flatMap((option, index) => option.disabled ? [] : [index]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const select = useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onValueChange?.(val);
      setOpenWithSound(false);
      setQuery("");
      setActiveIndex(-1);
    },
    [isControlled, onValueChange, setOpenWithSound],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => enabledIndexes[Math.min(enabledIndexes.indexOf(i) + 1, enabledIndexes.length - 1)] ?? -1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => enabledIndexes[Math.max(enabledIndexes.indexOf(i) - 1, 0)] ?? -1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) select(item.value);
    } else if (e.key === "Escape") {
      setOpenWithSound(false);
      setQuery("");
    }
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenWithSound(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpenWithSound]);

  useEffect(() => {
    if (open && listRef.current && activeIndex >= 0) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  return (
    <div ref={setRootRef} data-slot="combobox" className={cn("relative w-full", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          setOpenWithSound((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-[var(--s-radius-md,6px)] border border-[style:var(--s-border-style,solid)] px-3 py-2",
          "bg-[var(--s-background)] border-[color:var(--s-border)]",
          "transition-colors duration-[var(--s-duration-fast,150ms)]",
          "cursor-pointer focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]",
        )}
      >
        <span className={value ? "" : "text-[var(--s-text-muted)]"}>
          {selectedLabel || placeholder}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-[var(--s-text-muted)]">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className={cn(
          "absolute z-50 mt-1 w-full rounded-[var(--s-radius-md,6px)] border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)] outline-none",
          "bg-[var(--s-surface)] shadow-[var(--s-shadow-md)]",
        )}>
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              role="searchbox"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className={cn(
                "flex h-8 w-full rounded-[var(--s-radius-sm,4px)] border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)] px-2 text-sm",
                "bg-[var(--s-background)] text-[var(--s-text)] placeholder:text-[var(--s-text-muted)]",
                "focus-visible:outline-none focus-visible:ring-[length:var(--s-input-focus-ring-width)] focus-visible:ring-[var(--s-input-focus-ring-color)]",
              )}
            />
          </div>

          <ul ref={listRef} role="listbox" className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--s-text-muted)]">{emptyText}</li>
            ) : (
              filtered.map((option, i) => {
                const isActive = i === activeIndex;
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    data-active={isActive || undefined}
                    onClick={() => !option.disabled && select(option.value)}
                    onMouseEnter={() => !option.disabled && setActiveIndex(i)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-[var(--s-radius-sm,4px)] px-3 py-2",
                      "transition-colors duration-[var(--s-duration-fast,150ms)]",
                      option.disabled && "cursor-not-allowed opacity-50",
                      isActive && "bg-[var(--s-primary)]/10 text-[var(--s-text)]",
                      !isActive && "text-[var(--s-text)] hover:bg-[var(--s-primary)]/5",
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
});
