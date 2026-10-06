"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "../utils";
import { useSigilSound } from "../sound-context";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";
type ToastFill = "outline" | "filled" | "soft";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  fill: ToastFill;
  duration: number;
}

let listeners: Array<(t: ToastItem) => void> = [];
let idCounter = 0;

export function toast(options: {
  title: string;
  description?: string;
  variant?: ToastVariant;
  fill?: ToastFill;
  duration?: number;
}) {
  const item: ToastItem = {
    id: `toast-${++idCounter}`,
    title: options.title,
    description: options.description,
    variant: options.variant ?? "default",
    fill: options.fill ?? "outline",
    duration: options.duration ?? 4000,
  };
  listeners.forEach((fn) => fn(item));
}

const variantColors: Record<ToastVariant, string> = {
  default: "var(--s-border)",
  success: "var(--s-success)",
  error: "var(--s-error)",
  warning: "var(--s-warning)",
  info: "var(--s-info)",
};

function toastStyle(variant: ToastVariant, fill: ToastFill): React.CSSProperties {
  const c = variantColors[variant];
  switch (fill) {
    case "filled":
      return { borderColor: c, backgroundColor: c, color: "var(--s-primary-contrast)" };
    case "soft":
      return { borderColor: "transparent", backgroundColor: `color-mix(in oklch, ${c} 10%, var(--s-background))`, color: c };
    case "outline":
    default:
      return { borderColor: c };
  }
}

export interface ToasterProps extends HTMLAttributes<HTMLOListElement> {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

const positionStyles: Record<string, string> = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
};

export const Toaster = forwardRef<HTMLOListElement, ToasterProps>(function Toaster(
  { position = "bottom-right", className, ...props },
  ref,
) {
  const { play } = useSigilSound();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      play("notify");
      setToasts((prev) => [...prev, t]);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, [play]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          duration={t.duration}
          onOpenChange={(open) => { if (!open) remove(t.id); }}
          data-slot="toast"
          className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden",
            "rounded-[var(--s-card-radius,8px)] border border-[style:var(--s-border-style,solid)] p-4",
            "bg-[var(--s-background)] shadow-[var(--s-shadow-md)]",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
            "data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
            "data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full",
            "transition-[transform,opacity] duration-[var(--s-duration-fast)]",
          )}
          style={toastStyle(t.variant, t.fill)}
        >
          <div className="flex-1">
            <ToastPrimitive.Title className="text-sm font-medium text-inherit">{t.title}</ToastPrimitive.Title>
            {t.description && (
              <ToastPrimitive.Description className="mt-1 text-sm text-inherit">{t.description}</ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            className="inline-flex shrink-0 items-center justify-center min-h-[var(--s-control-hit-area)] min-w-[var(--s-control-hit-area)] text-inherit transition-colors"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport
        ref={ref}
        data-slot="toast-viewport"
        className={cn(
          "fixed z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]",
          positionStyles[position],
          className,
        )}
        {...props}
      />
    </ToastPrimitive.Provider>
  );
});
