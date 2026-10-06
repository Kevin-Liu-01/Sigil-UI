"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { MagnifyingGlassIcon as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { UploadSimpleIcon as UploadIcon } from "@phosphor-icons/react/dist/ssr/UploadSimple";
import { cn } from "../utils";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Combobox, type ComboboxOption } from "./Combobox";
import { DateRangePicker, type DateRange } from "./DatePicker";
import { Input } from "./Input";
import { Label } from "./Label";
import { Popover, PopoverContent, PopoverTrigger } from "../overlays/Popover";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Slider, type SliderProps } from "./Slider";
import { Switch } from "./Switch";
import { TagsInput, type TagsInputProps } from "./TagsInput";

export const SearchInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function SearchInput(
  { className, ...props },
  ref,
) {
  return (
    <div className="relative w-full">
      <SearchIcon weight="fill" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--s-text-muted)]" />
      <Input ref={ref} type="search" className={cn("pl-9", className)} {...props} />
    </div>
  );
});

export interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  currency?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  { currency = "$", className, ...props },
  ref,
) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--s-text-muted)]">{currency}</span>
      <Input ref={ref} inputMode="decimal" className={cn("pl-7 tabular-nums", className)} {...props} />
    </div>
  );
});

export const PhoneInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function PhoneInput(
  { className, ...props },
  ref,
) {
  return <Input ref={ref} type="tel" inputMode="tel" autoComplete="tel" className={className} {...props} />;
});

export const TimePicker = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, "type">>(
  function TimePicker({ className, ...props }, ref) {
    return <Input ref={ref} type="time" className={cn("tabular-nums", className)} {...props} />;
  },
);

export const DateTimePicker = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, "type">>(
  function DateTimePicker({ className, ...props }, ref) {
    return <Input ref={ref} type="datetime-local" className={cn("tabular-nums", className)} {...props} />;
  },
);

export interface DateRangeFieldProps extends ComponentPropsWithoutRef<typeof DateRangePicker> {
  label?: ReactNode;
  description?: ReactNode;
}

export const DateRangeField = forwardRef<HTMLButtonElement, DateRangeFieldProps>(function DateRangeField(
  { label, description, className, ...props },
  ref,
) {
  return (
    <div className="grid gap-2">
      {label && <Label>{label}</Label>}
      <DateRangePicker ref={ref} className={cn("w-full", className)} {...props} />
      {description && <p className="text-xs text-[var(--s-text-muted)]">{description}</p>}
    </div>
  );
});

export interface MultiSelectProps extends Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value" | "defaultValue"> {
  options: ComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  { options, value, defaultValue = [], onValueChange, placeholder = "Select options", className, ...props },
  ref,
) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const selected = options.filter((option) => currentValue.includes(option.value));
  const toggle = (optionValue: string) => {
    const next = currentValue.includes(optionValue)
      ? currentValue.filter((item) => item !== optionValue)
      : [...currentValue, optionValue];
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          className={cn(
            "flex min-h-10 w-full flex-wrap items-center gap-1 rounded-[var(--s-radius-input,var(--s-radius-md,6px))] border border-[color:var(--s-border)] bg-[var(--s-background)] px-3 py-2 text-left text-sm",
            className,
          )}
          {...props}
        >
          {selected.length ? selected.map((item) => (
            <span key={item.value} className="rounded-[var(--s-radius-sm,4px)] bg-[var(--s-surface)] px-2 py-0.5 text-xs">
              {item.label}
            </span>
          )) : <span className="text-[var(--s-text-muted)]">{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1">
        {options.map((option) => {
          const isChecked = currentValue.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isChecked}
              disabled={option.disabled}
              onClick={() => toggle(option.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-[var(--s-radius-sm,4px)] px-2 py-2 text-left text-sm",
                "hover:bg-[var(--s-surface)] disabled:opacity-50",
              )}
            >
              {/* Visual checkbox indicator. Cannot be a real Checkbox here
                  because that renders a <button> which can't nest inside
                  this row button. */}
              <span
                aria-hidden
                data-state={isChecked ? "checked" : "unchecked"}
                className={cn(
                  "inline-flex size-4 shrink-0 items-center justify-center",
                  "rounded-[var(--s-radius-sm,3px)]",
                  "border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)]",
                  "bg-[var(--s-background)] text-[var(--s-primary-contrast)]",
                  "data-[state=checked]:bg-[var(--s-primary)] data-[state=checked]:border-[color:var(--s-primary)]",
                )}
              >
                {isChecked ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M2.5 6l2.5 2.5 4.5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              {option.label}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
});

export interface AutocompleteProps extends ComponentPropsWithoutRef<typeof Combobox> {}

export const Autocomplete = Combobox;

export interface CreatableSelectProps extends AutocompleteProps {
  onCreate?: (value: string) => void;
  createLabel?: string;
  createPlaceholder?: string;
}

export function CreatableSelect({
  options,
  onCreate,
  createLabel = "Create",
  createPlaceholder = "New option…",
  ...props
}: CreatableSelectProps) {
  const [items, setItems] = useState(options);
  const [newValue, setNewValue] = useState("");
  useEffect(() => setItems(options), [options]);
  const createOption = () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    const option = { value: trimmed, label: trimmed };
    setItems((prev) => [...prev, option]);
    setNewValue("");
    onCreate?.(trimmed);
  };
  return (
    <div className="grid gap-2">
      <Combobox options={items} {...props} />
      <div className="flex gap-2">
        <Input
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              createOption();
            }
          }}
          placeholder={createPlaceholder}
        />
        <Button type="button" variant="outline" size="sm" disabled={!newValue.trim()} onClick={createOption}>
          {createLabel}
        </Button>
      </div>
    </div>
  );
}

export interface AsyncSelectProps extends Omit<AutocompleteProps, "options"> {
  loadOptions?: (query: string) => Promise<ComboboxOption[]>;
}

export function AsyncSelect({
  loadOptions,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results.",
  className,
}: AsyncSelectProps) {
  const fallbackOptions = useMemo<ComboboxOption[]>(
    () => [
      { value: "modal", label: "Modal" },
      { value: "multi-select", label: "MultiSelect" },
      { value: "status-badge", label: "StatusBadge" },
    ],
    [],
  );
  const [options, setOptions] = useState<ComboboxOption[]>(fallbackOptions);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? "";
  useEffect(() => {
    if (!loadOptions) {
      setOptions(
        fallbackOptions.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase()),
        ),
      );
      return;
    }
    let active = true;
    loadOptions(query).then((next) => {
      if (active) setOptions(next);
    });
    return () => {
      active = false;
    };
  }, [fallbackOptions, loadOptions, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between font-normal", !selectedLabel && "text-[var(--s-text-muted)]", className)}
        >
          {selectedLabel || placeholder}
          <span aria-hidden>⌄</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="mb-2"
        />
        <div className="grid max-h-56 gap-1 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-2 py-3 text-sm text-[var(--s-text-muted)]">{emptyText}</div>
          ) : options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                onValueChange?.(option.value);
                setOpen(false);
              }}
              className={cn(
                "rounded-[var(--s-radius-sm,4px)] px-2 py-2 text-left text-sm",
                "hover:bg-[var(--s-surface)] focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]",
                option.value === value && "bg-[var(--s-surface)] font-medium",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface SegmentedTabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items?: Array<{ value: string; label: ReactNode }>;
}

export const SegmentedTabs = forwardRef<HTMLDivElement, SegmentedTabsProps>(function SegmentedTabs(
  { value, defaultValue, onValueChange, items, children, className, ...props },
  ref,
) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? items?.[0]?.value);
  const currentValue = value ?? internalValue;
  const handleChange = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  return (
    <div
      ref={ref}
      data-slot="segmented-tabs"
      role="tablist"
      className={cn("inline-flex rounded-[var(--s-radius-md,8px)] border border-[color:var(--s-border)] bg-[var(--s-surface)] p-1", className)}
      {...props}
    >
      {items
        ? items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={item.value === currentValue}
            onClick={() => handleChange(item.value)}
            className="rounded-[var(--s-radius-sm,4px)] px-3 py-1 text-sm text-[var(--s-text-muted)] aria-selected:bg-[var(--s-background)] aria-selected:text-[var(--s-text)]"
          >
            {item.label}
          </button>
        ))
        : children}
    </div>
  );
});

export interface RangeSliderProps extends SliderProps {
  label?: ReactNode;
  valueLabel?: ReactNode;
}

export const RangeSlider = forwardRef<ComponentRef<typeof Slider>, RangeSliderProps>(function RangeSlider(
  { label, valueLabel, className, ...props },
  ref,
) {
  return (
    <div className={cn("grid gap-2", className)}>
      {(label || valueLabel) && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-[var(--s-text)]">{label}</span>
          <span className="text-[var(--s-text-muted)] tabular-nums">{valueLabel}</span>
        </div>
      )}
      <Slider ref={ref} aria-label={typeof label === "string" ? label : undefined} {...props} />
    </div>
  );
});

export const DualRangeSlider = forwardRef<ComponentRef<typeof Slider>, SliderProps>(function DualRangeSlider(
  { defaultValue = [25, 75], ...props },
  ref,
) {
  return <Slider ref={ref} defaultValue={defaultValue} {...props} />;
});

export interface FileDropzoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
}

export const FileDropzone = forwardRef<HTMLInputElement, FileDropzoneProps>(function FileDropzone(
  { label = "Drop files here or browse", description, className, ...props },
  ref,
) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--s-card-radius,10px)] border border-dashed border-[color:var(--s-border)] bg-[var(--s-surface)] p-6 text-center",
        className,
      )}
    >
      <UploadIcon weight="fill" className="size-5 text-[var(--s-text-muted)]" />
      <span className="text-sm font-medium text-[var(--s-text)]">{label}</span>
      {description && <span className="text-xs text-[var(--s-text-muted)]">{description}</span>}
      <input ref={ref} id={id} type="file" className="sr-only" {...props} />
    </label>
  );
});

export const ImageUpload = forwardRef<HTMLInputElement, FileDropzoneProps>(function ImageUpload(props, ref) {
  return <FileDropzone ref={ref} accept="image/*" {...props} />;
});

export interface AvatarUploadProps extends FileDropzoneProps {
  previewUrl?: string;
}

export const AvatarUpload = forwardRef<HTMLInputElement, AvatarUploadProps>(function AvatarUpload(
  { previewUrl, label = "Upload avatar", ...props },
  ref,
) {
  return (
    <div className="flex items-center gap-4">
      <div className="size-16 overflow-hidden rounded-[var(--s-radius-full,9999px)] bg-[var(--s-surface)]">
        {previewUrl && <img src={previewUrl} alt="" className="size-full object-cover" />}
      </div>
      <ImageUpload ref={ref} label={label} className="min-h-20 flex-1" {...props} />
    </div>
  );
});

export const ColorField = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, "type">>(
  function ColorField({ className, ...props }, ref) {
    return <Input ref={ref} type="color" className={cn("h-[var(--s-input-height,40px)] p-1", className)} {...props} />;
  },
);

export interface ComboboxFieldProps extends AutocompleteProps {
  label?: ReactNode;
  description?: ReactNode;
}

export function ComboboxField({ label, description, ...props }: ComboboxFieldProps) {
  return (
    <div className="grid gap-2">
      {label && <Label>{label}</Label>}
      <Combobox {...props} />
      {description && <p className="text-xs text-[var(--s-text-muted)]">{description}</p>}
    </div>
  );
}

export interface CheckboxCardProps extends Omit<ComponentPropsWithoutRef<"label">, "title"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
}

export const CheckboxCard = forwardRef<HTMLLabelElement, CheckboxCardProps>(function CheckboxCard(
  { checked, defaultChecked, onCheckedChange, title, description, children, className, ...props },
  ref,
) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const isChecked = checked ?? internalChecked;
  const toggle = () => {
    const next = !isChecked;
    if (checked === undefined) setInternalChecked(next);
    onCheckedChange?.(next);
  };
  return (
    <label
      ref={ref}
      data-checked={isChecked || undefined}
      className={cn(
        "flex cursor-pointer gap-3 rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)] bg-[var(--s-background)] p-4",
        "data-[checked=true]:border-[color:var(--s-primary)] data-[checked=true]:bg-[color-mix(in_oklch,var(--s-primary)_8%,transparent)]",
        className,
      )}
      {...props}
    >
      <Checkbox checked={isChecked} onCheckedChange={(next) => {
        const bool = Boolean(next);
        if (checked === undefined) setInternalChecked(bool);
        onCheckedChange?.(bool);
      }} onClick={(event) => event.stopPropagation()} />
      <span className="grid gap-1">
        {title && <span className="font-medium text-[var(--s-text)]">{title}</span>}
        {description && <span className="text-sm text-[var(--s-text-muted)]">{description}</span>}
        {children}
      </span>
      <input type="checkbox" checked={isChecked} onChange={toggle} className="sr-only" tabIndex={-1} aria-label={typeof title === "string" ? title : "Select option"} />
    </label>
  );
});

export interface RadioCardProps extends Omit<ComponentPropsWithoutRef<"label">, "title"> {
  value: string;
  title?: ReactNode;
  description?: ReactNode;
}

export const RadioCard = forwardRef<HTMLLabelElement, RadioCardProps>(function RadioCard(
  { value, title, description, children, className, ...props },
  ref,
) {
  return (
    <label ref={ref} className={cn("flex cursor-pointer gap-3 rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)] p-4", className)} {...props}>
      <RadioGroupItem value={value} />
      <span className="grid gap-1">
        {title && <span className="font-medium text-[var(--s-text)]">{title}</span>}
        {description && <span className="text-sm text-[var(--s-text-muted)]">{description}</span>}
        {children}
      </span>
    </label>
  );
});

export interface SwitchFieldProps extends Omit<ComponentPropsWithoutRef<typeof Switch>, "label"> {
  label?: ReactNode;
  description?: ReactNode;
}

export const SwitchField = forwardRef<ComponentRef<typeof Switch>, SwitchFieldProps>(function SwitchField(
  { label, description, className, ...props },
  ref,
) {
  return (
    <label className={cn("flex items-center justify-between gap-4", className)}>
      <span className="grid gap-1">
        {label && <span className="text-sm font-medium text-[var(--s-text)]">{label}</span>}
        {description && <span className="text-xs text-[var(--s-text-muted)]">{description}</span>}
      </span>
      <Switch ref={ref} {...props} />
    </label>
  );
});

export const SliderField = RangeSlider;

export { StepperField, CopyInput, type StepperFieldProps, type CopyInputProps } from "./InputActions";

export const TagsField = forwardRef<HTMLDivElement, TagsInputProps>(function TagsField(props, ref) {
  return <TagsInput ref={ref} {...props} />;
});

