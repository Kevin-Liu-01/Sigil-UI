"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Button, type ButtonProps } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./Command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./DropdownMenu";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Tooltip, TooltipProvider } from "../ui/Tooltip";
import { cn } from "../utils";

export interface ModalProps extends ComponentPropsWithoutRef<typeof Dialog> {
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  contentClassName?: string;
}

export function Modal({ trigger, title, description, footer, children, contentClassName, ...props }: ModalProps) {
  return (
    <Dialog {...props}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={contentClassName}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export interface ConfirmDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  title: ReactNode;
  description?: ReactNode;
  trigger?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export function ConfirmDialog({
  title,
  description,
  trigger,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  ...props
}: ConfirmDialogProps) {
  return (
    <AlertDialog {...props}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export interface PromptDialogProps extends Omit<ConfirmDialogProps, "onConfirm"> {
  placeholder?: string;
  defaultValue?: string;
  onConfirm?: (value: string) => void;
}

export function PromptDialog({ placeholder, defaultValue = "", onConfirm, ...props }: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);
  return (
    <ConfirmDialog
      {...props}
      onConfirm={() => onConfirm?.(value)}
      description={
        <div className="grid gap-3">
          {props.description}
          <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} />
        </div>
      }
    />
  );
}

export function ResponsiveDialog(props: ModalProps) {
  return <Modal contentClassName={cn("sm:max-w-lg", props.contentClassName)} {...props} />;
}

export interface LightboxProps extends ComponentPropsWithoutRef<typeof Dialog> {
  src: string;
  alt: string;
  caption?: ReactNode;
  trigger?: ReactNode;
}

export function Lightbox({ src, alt, caption, trigger, ...props }: LightboxProps) {
  return (
    <Dialog {...props}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-5xl p-2">
        <DialogTitle className="sr-only">{caption ?? alt}</DialogTitle>
        <img src={src} alt={alt} className="max-h-[80vh] w-full rounded-[var(--s-radius-md,8px)] object-contain" />
        {caption && <p className="px-2 pb-2 text-sm text-[var(--s-text-muted)]">{caption}</p>}
      </DialogContent>
    </Dialog>
  );
}

export interface ImagePreviewProps extends ComponentPropsWithoutRef<"button"> {
  src: string;
  alt: string;
  caption?: ReactNode;
}

export const ImagePreview = forwardRef<HTMLButtonElement, ImagePreviewProps>(function ImagePreview(
  { src, alt, caption, className, ...props },
  ref,
) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={alt}
        className={cn("overflow-hidden rounded-[var(--s-radius-md,8px)] border border-[color:var(--s-border)]", className)}
        onClick={() => setOpen(true)}
        {...props}
      >
        <img src={src} alt={alt} className="size-full object-cover" />
      </button>
      <Lightbox open={open} onOpenChange={setOpen} src={src} alt={alt} caption={caption} />
    </>
  );
});

export interface SpotlightItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  onSelect?: () => void;
}

export interface SpotlightProps extends Omit<ComponentPropsWithoutRef<typeof CommandDialog>, "children"> {
  items: SpotlightItem[];
  placeholder?: string;
}

export function Spotlight({ items, placeholder = "Search commands...", ...props }: SpotlightProps) {
  return (
    <CommandDialog {...props}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem key={item.value} value={item.value} onSelect={item.onSelect}>
              <div className="grid gap-0.5">
                <span>{item.label}</span>
                {item.description && <span className="text-xs text-[var(--s-text-muted)]">{item.description}</span>}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export const CommandMenu = Spotlight;

export interface ActionMenuItem {
  label: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface ActionMenuProps {
  trigger: ReactNode;
  items: ActionMenuItem[];
  align?: ComponentPropsWithoutRef<typeof DropdownMenuContent>["align"];
}

export function ActionMenu({ trigger, items, align = "end" }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item, index) => (
          <DropdownMenuItem key={index} disabled={item.disabled} onSelect={item.onSelect}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OverflowMenu(props: Omit<ActionMenuProps, "trigger"> & { label?: string }) {
  return <ActionMenu trigger={<Button aria-label={props.label ?? "More actions"} size="icon" variant="ghost">⋯</Button>} {...props} />;
}

export const MegaMenu = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function MegaMenu(
  { className, ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      data-slot="mega-menu"
      className={cn(
        "grid gap-4 rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)] bg-[var(--s-surface)] p-4 shadow-[var(--s-shadow-lg)] md:grid-cols-3",
        className,
      )}
      {...props}
    />
  );
});

export interface ContextPanelProps extends ComponentPropsWithoutRef<typeof PopoverContent> {
  trigger: ReactNode;
}

export function ContextPanel({ trigger, children, ...props }: ContextPanelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent {...props}>{children}</PopoverContent>
    </Popover>
  );
}

export interface PopoverFormProps extends Omit<ContextPanelProps, "onSubmit"> {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function PopoverForm({ trigger, children, onSubmit, ...props }: PopoverFormProps) {
  return (
    <ContextPanel trigger={trigger} {...props}>
      <form className="grid gap-3" onSubmit={onSubmit}>{children}</form>
    </ContextPanel>
  );
}

export const FloatingPanel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function FloatingPanel(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="floating-panel"
      className={cn(
        "rounded-[var(--s-card-radius,10px)] border border-[color:var(--s-border)] bg-[var(--s-overlay-surface,var(--s-surface))] p-4 shadow-[var(--s-overlay-shadow,var(--s-shadow-lg))]",
        className,
      )}
      {...props}
    />
  );
});

export interface TooltipGroupProps {
  children: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}

export function TooltipGroup({ children, delayDuration = 300, skipDelayDuration = 0 }: TooltipGroupProps) {
  return (
    <TooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      {children}
    </TooltipProvider>
  );
}

export interface TourStepConfig {
  title: ReactNode;
  description?: ReactNode;
}

export interface TourProps extends ComponentPropsWithoutRef<typeof Dialog> {
  steps: TourStepConfig[];
  step?: number;
  onStepChange?: (step: number) => void;
  finishLabel?: string;
  trigger?: ReactNode;
}

export function Tour({ steps, step = 0, onStepChange, finishLabel = "Done", trigger, ...props }: TourProps) {
  const current = steps[step];
  if (!current) return null;
  const isLast = step >= steps.length - 1;
  return (
    <Modal
      {...props}
      trigger={trigger}
      title={current.title}
      description={current.description}
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-xs text-[var(--s-text-muted)]">{step + 1} / {steps.length}</span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={step === 0} onClick={() => onStepChange?.(step - 1)}>Back</Button>
            <Button onClick={() => isLast ? props.onOpenChange?.(false) : onStepChange?.(step + 1)}>
              {isLast ? finishLabel : "Next"}
            </Button>
          </div>
        </div>
      }
    />
  );
}

export const TourStep = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function TourStep(
  { className, ...props },
  ref,
) {
  return <FloatingPanel ref={ref} data-slot="tour-step" className={cn("max-w-sm", className)} {...props} />;
});

export interface CoachmarkProps extends Omit<ComponentPropsWithoutRef<typeof PopoverContent>, "title"> {
  trigger: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}

export function Coachmark({ trigger, title, description, children, ...props }: CoachmarkProps) {
  return (
    <ContextPanel trigger={trigger} {...props}>
      <div className="grid gap-2">
        {title && <h3 className="text-sm font-semibold text-[var(--s-text)]">{title}</h3>}
        {description && <p className="text-sm text-[var(--s-text-muted)]">{description}</p>}
        {children}
      </div>
    </ContextPanel>
  );
}

export interface Hotkey {
  keys: string[];
  onTrigger: () => void;
  disabled?: boolean;
}

const HotkeyContext = createContext<Hotkey[]>([]);

export function useHotkeys() {
  return useContext(HotkeyContext);
}

export function HotkeyProvider({ hotkeys, children }: { hotkeys: Hotkey[]; children: ReactNode }) {
  const normalized = useMemo(
    () => hotkeys.map((hotkey) => ({ ...hotkey, keys: hotkey.keys.map((key) => key.toLowerCase()) })),
    [hotkeys],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = typeof event.key === "string" ? event.key.toLowerCase() : "";
      const pressed = [
        event.metaKey && "meta",
        event.ctrlKey && "ctrl",
        event.altKey && "alt",
        event.shiftKey && "shift",
        key,
      ].filter(Boolean) as string[];

      for (const hotkey of normalized) {
        if (!hotkey.disabled && hotkey.keys.every((key) => pressed.includes(key))) {
          event.preventDefault();
          hotkey.onTrigger();
          break;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [normalized]);

  return <HotkeyContext.Provider value={normalized}>{children}</HotkeyContext.Provider>;
}

export interface ShortcutRecorderProps extends Omit<ButtonProps, "onChange"> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (keys: string[]) => void;
}

export const ShortcutRecorder = forwardRef<HTMLButtonElement, ShortcutRecorderProps>(function ShortcutRecorder(
  { value, defaultValue = [], onValueChange, children, onClick, ...props },
  ref,
) {
  const [recording, setRecording] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const keysValue = value ?? internalValue;
  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      aria-pressed={recording}
      {...props}
      onClick={(event) => {
        setRecording(true);
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        if (!recording && event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (event.key === "Escape") {
          setRecording(false);
          return;
        }
        const keys = [
          event.metaKey && "Meta",
          event.ctrlKey && "Ctrl",
          event.altKey && "Alt",
          event.shiftKey && "Shift",
          event.key.length === 1 ? event.key.toUpperCase() : event.key,
        ].filter(Boolean) as string[];
        const next = [...new Set(keys)];
        if (value === undefined) setInternalValue(next);
        onValueChange?.(next);
        setRecording(false);
      }}
    >
      {children ?? (recording ? "Press keys…" : keysValue.length ? keysValue.join(" + ") : "Record shortcut")}
    </Button>
  );
});
