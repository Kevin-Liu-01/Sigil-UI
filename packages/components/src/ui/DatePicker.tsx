"use client";

import { forwardRef, useState, type ButtonHTMLAttributes } from "react";
import { CalendarBlankIcon as CalendarIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import type { DateRange as RDPDateRange } from "react-day-picker";

export type DateRange = RDPDateRange;
import { Calendar } from "./Calendar";
import { Button } from "./Button";
import { Popover, PopoverContent, PopoverTrigger } from "../overlays/Popover";
import { cn } from "../utils";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Single DatePicker                                                  */
/* ------------------------------------------------------------------ */

export interface DatePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue"> {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  props,
  ref,
) {
  const { value: controlledValue, defaultValue, onValueChange, placeholder = "Pick a date", className, ...rest } = props;
  const isControlled = "value" in props;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          data-slot="date-picker"
          data-empty={!value}
          className={cn(
            "w-[240px] justify-between text-left font-normal",
            "data-[empty=true]:text-[var(--s-text-muted)]",
            className,
          )}
          {...rest}
        >
          <span className="flex items-center gap-2 truncate">
            <CalendarIcon weight="fill" className="size-4 shrink-0 text-[var(--s-text-muted)]" />
            {value ? formatDate(value) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(day) => {
            if (!isControlled) setInternalValue(day);
            onValueChange?.(day);
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
});

/* ------------------------------------------------------------------ */
/*  Range DatePicker                                                   */
/* ------------------------------------------------------------------ */

export interface DateRangePickerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue"> {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  /** Number of calendar months to show side-by-side. */
  numberOfMonths?: number;
}

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  function DateRangePicker(
    props,
    ref,
  ) {
    const { value: controlledValue, defaultValue, onValueChange, placeholder = "Pick a date range", numberOfMonths = 2, className, ...rest } = props;
    const isControlled = "value" in props;
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = isControlled ? controlledValue : internalValue;

    const label =
      value?.from && value?.to
        ? `${formatDate(value.from)} – ${formatDate(value.to)}`
        : value?.from
          ? formatDate(value.from)
          : null;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            data-slot="date-range-picker"
            data-empty={!value?.from}
            className={cn(
              "w-[300px] justify-between text-left font-normal",
              "data-[empty=true]:text-[var(--s-text-muted)]",
              className,
            )}
            {...rest}
          >
            <span className="flex items-center gap-2 truncate">
              <CalendarIcon weight="fill" className="size-4 shrink-0 text-[var(--s-text-muted)]" />
              {label ?? placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={value}
            defaultMonth={value?.from}
            onSelect={(range) => {
              if (!isControlled) setInternalValue(range);
              onValueChange?.(range);
              if (range?.from && range?.to) {
                setOpen(false);
              }
            }}
            numberOfMonths={numberOfMonths}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
);
