"use client";

import { forwardRef, useEffect, useRef, useState, type ComponentProps } from "react";
import { DayPicker, getDefaultClassNames, type DayButton, type DropdownProps } from "react-day-picker";
import { CaretDownIcon as ChevronDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CaretLeftIcon as ChevronLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { CaretRightIcon as ChevronRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { cn } from "../utils";

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  className?: string;
};

/* ------------------------------------------------------------------ */
/* The calendar uses div-based layout (no <table>) to avoid the      */
/* spreadsheet feel. Rows of seven days share even spacing and the   */
/* selected/today states sit inside the day cell as a pill.          */
/* ------------------------------------------------------------------ */

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    className,
    classNames,
    showOutsideDays = true,
    fixedWeeks = true,
    captionLayout = "dropdown",
    startMonth,
    endMonth,
    components,
    ...rest
  },
  _ref,
) {
  const defaultClassNames = getDefaultClassNames();
  const defaultStart = startMonth ?? new Date(new Date().getFullYear() - 100, 0);
  const defaultEnd = endMonth ?? new Date(new Date().getFullYear() + 10, 11);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks={fixedWeeks}
      captionLayout={captionLayout}
      startMonth={defaultStart}
      endMonth={defaultEnd}
      className={cn(
        "group/calendar",
        "bg-[var(--s-background)] text-[var(--s-text)]",
        "rounded-[var(--s-card-radius,var(--s-radius-md,8px))]",
        "border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)]",
        "p-4 [--cell-size:2.25rem]",
        className,
      )}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 pointer-events-none",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          "pointer-events-auto z-[1]",
          "inline-flex h-8 w-8 items-center justify-center",
          "rounded-[var(--s-radius-sm,4px)]",
          "text-[var(--s-text-muted)]",
          "transition-[color,background-color] duration-[var(--s-duration-fast,150ms)]",
          "hover:bg-[var(--s-surface)] hover:text-[var(--s-text)]",
          "select-none aria-disabled:opacity-30 aria-disabled:pointer-events-none",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          "pointer-events-auto z-[1]",
          "inline-flex h-8 w-8 items-center justify-center",
          "rounded-[var(--s-radius-sm,4px)]",
          "text-[var(--s-text-muted)]",
          "transition-[color,background-color] duration-[var(--s-duration-fast,150ms)]",
          "hover:bg-[var(--s-surface)] hover:text-[var(--s-text)]",
          "select-none aria-disabled:opacity-30 aria-disabled:pointer-events-none",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center px-9",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-8 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn("relative", defaultClassNames.dropdown_root),
        dropdown: cn(
          "absolute inset-0 opacity-0 pointer-events-none",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-medium text-[var(--s-text)] select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded-[var(--s-radius-md,6px)] pr-1 pl-2 text-sm",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none",
          "font-[family-name:var(--s-font-mono,inherit)]",
          "text-[10px] font-medium uppercase tracking-[0.08em]",
          "text-[var(--s-text-muted)]",
          "h-6 inline-flex items-center justify-center",
          defaultClassNames.weekday,
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-[var(--cell-size)] select-none", defaultClassNames.week_number_header),
        week_number: cn("text-xs text-[var(--s-text-muted)] select-none", defaultClassNames.week_number),
        day: cn(
          "group/day relative aspect-square flex-1 p-0 text-center select-none",
          defaultClassNames.day,
        ),
        range_start: cn("z-[1] bg-[color-mix(in_oklch,var(--s-primary)_18%,transparent)] rounded-l-[var(--s-radius-sm,4px)]", defaultClassNames.range_start),
        range_middle: cn("bg-[color-mix(in_oklch,var(--s-primary)_18%,transparent)]", defaultClassNames.range_middle),
        range_end: cn("z-[1] bg-[color-mix(in_oklch,var(--s-primary)_18%,transparent)] rounded-r-[var(--s-radius-sm,4px)]", defaultClassNames.range_end),
        outside: cn("text-[var(--s-text-subtle,var(--s-text-muted))] opacity-50", defaultClassNames.outside),
        disabled: cn("text-[var(--s-text-muted)] opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootCn, rootRef, ...rootProps }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(rootCn)} {...rootProps} />
        ),
        Chevron: ({ className: chevronCn, orientation, ...chevronProps }) => {
          const Icon =
            orientation === "left" ? ChevronLeftIcon : orientation === "right" ? ChevronRightIcon : ChevronDownIcon;
          return <Icon weight="fill" className={cn("h-4 w-4", chevronCn)} {...chevronProps} />;
        },
        Dropdown: CalendarDropdown,
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...wnProps }) => (
          <td {...wnProps}>
            <div className="flex h-[var(--cell-size)] w-[var(--cell-size)] items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...rest}
    />
  );
});

/* ──────────────────────────── Dropdown ──────────────────────────── */

function CalendarDropdown({
  options,
  className: _className,
  components: _components,
  classNames: _classNames,
  value,
  onChange,
  disabled,
  ...rest
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const numericValue = Number(value);
  const selectedOption = options?.find((o) => o.value === numericValue);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector("[data-active=true]")?.scrollIntoView({ block: "nearest" });

    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSelect = (optionValue: number) => {
    const syntheticEvent = {
      target: { value: String(optionValue) },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(syntheticEvent);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-label={rest["aria-label"]}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 items-center gap-1 rounded-[var(--s-radius-md,6px)] px-2 text-sm font-medium",
          "text-[var(--s-text)] bg-transparent",
          "border border-transparent",
          "transition-[color,background-color,border-color] duration-[var(--s-duration-fast,150ms)]",
          "hover:bg-[var(--s-surface)] hover:border-[color:var(--s-border)]",
          "focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "cursor-pointer select-none",
        )}
      >
        {selectedOption?.label}
        <ChevronDownIcon weight="fill"
          className={cn(
            "h-3.5 w-3.5 text-[var(--s-text-muted)] transition-transform duration-[var(--s-duration-fast,150ms)]",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div
          className={cn(
            "absolute left-1/2 top-[calc(100%+4px)] z-50 -translate-x-1/2",
            "min-w-[8rem] overflow-hidden p-1",
            "rounded-[var(--s-card-radius,var(--s-radius-md,8px))]",
            "border border-[color:var(--s-border)] border-[style:var(--s-border-style,solid)]",
            "bg-[var(--s-surface)] text-[var(--s-text)] shadow-[var(--s-shadow-lg)]",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
          )}
        >
          <div ref={listRef} role="listbox" className="max-h-[280px] overflow-y-auto">
            {options?.map(({ value: optValue, label, disabled: optDisabled }) => (
              <button
                key={optValue}
                type="button"
                role="option"
                disabled={optDisabled}
                aria-selected={optValue === numericValue}
                data-active={optValue === numericValue}
                onClick={() => handleSelect(optValue)}
                className={cn(
                  "relative flex h-8 w-full cursor-default select-none items-center",
                  "rounded-[var(--s-radius-sm,4px)] pl-8 pr-3 text-sm outline-none",
                  "text-[var(--s-text)] transition-colors duration-[var(--s-duration-fast,100ms)]",
                  "hover:bg-[var(--s-background)] focus-visible:bg-[var(--s-background)]",
                  "disabled:pointer-events-none disabled:opacity-50",
                  optValue === numericValue && "font-medium",
                )}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {optValue === numericValue && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M3 7l3 3 5-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── Day button ──────────────────────────── */

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelected =
    modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle;
  const isToday = modifiers.today && !modifiers.selected;

  return (
    <button
      ref={ref}
      type="button"
      data-slot="calendar-day"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSelected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={isToday}
      className={cn(
        "relative inline-flex h-full w-full items-center justify-center",
        "font-[family-name:var(--s-font-body,inherit)] tabular-nums",
        "text-sm font-normal leading-none",
        "text-[var(--s-text)]",
        "transition-[background-color,color,opacity] duration-[var(--s-duration-fast,150ms)]",
        "rounded-[var(--s-radius-sm,4px)]",
        "outline-none",
        "focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]",
        "hover:bg-[var(--s-surface)]",
        // selected (single)
        "data-[selected-single=true]:bg-[var(--s-primary)] data-[selected-single=true]:text-[var(--s-primary-contrast)] data-[selected-single=true]:font-medium data-[selected-single=true]:hover:bg-[var(--s-primary)]",
        // range start / end
        "data-[range-start=true]:bg-[var(--s-primary)] data-[range-start=true]:text-[var(--s-primary-contrast)] data-[range-start=true]:font-medium",
        "data-[range-end=true]:bg-[var(--s-primary)] data-[range-end=true]:text-[var(--s-primary-contrast)] data-[range-end=true]:font-medium",
        // range middle
        "data-[range-middle=true]:rounded-[var(--s-radius-none)] data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-[var(--s-text)]",
        // today indicator: subtle dot under the number
        "data-[today=true]:after:absolute data-[today=true]:after:bottom-1 data-[today=true]:after:left-1/2 data-[today=true]:after:size-[var(--s-control-track-height)] data-[today=true]:after:-translate-x-1/2 data-[today=true]:after:rounded-[var(--s-radius-full)] data-[today=true]:after:bg-[var(--s-primary)]",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { CalendarDayButton };
