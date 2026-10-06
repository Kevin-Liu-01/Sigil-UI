"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../utils";
import { useSigilSound } from "../sound-context";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive"
  | "success"
  | "warning"
  | "soft"
  | "link";

export type ButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "icon-xs"
  | "icon-sm"
  | "icon"
  | "icon-lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. @default "primary" */
  variant?: ButtonVariant;
  /** Button size. @default "md" */
  size?: ButtonSize;
  /** Render as child element (Radix Slot pattern for links). */
  asChild?: boolean;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--s-primary)] text-[var(--s-primary-contrast)]",
    "hover:bg-[var(--s-primary-hover)]",
    "active:brightness-90 active:scale-[var(--s-button-active-scale,0.97)]",
  ].join(" "),
  secondary: [
    "bg-[var(--s-surface)] text-[var(--s-text)]",
    "border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)]",
    "hover:bg-[var(--s-surface-elevated)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--s-text)]",
    "hover:bg-[var(--s-surface)]",
  ].join(" "),
  outline: [
    "bg-transparent text-[var(--s-text)]",
    "border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)]",
    "hover:bg-[var(--s-surface)]",
  ].join(" "),
  destructive: [
    "bg-[var(--s-error)] text-[var(--s-primary-contrast)]",
    "hover:brightness-110",
    "active:brightness-90",
  ].join(" "),
  success: [
    "bg-[var(--s-success)] text-[var(--s-primary-contrast)]",
    "hover:brightness-110",
    "active:brightness-90",
  ].join(" "),
  warning: [
    "bg-[var(--s-warning)] text-[var(--s-primary-contrast)]",
    "hover:brightness-110",
    "active:brightness-90",
  ].join(" "),
  soft: [
    "bg-[color-mix(in_oklch,var(--s-primary)_12%,transparent)] text-[var(--s-primary)]",
    "hover:bg-[color-mix(in_oklch,var(--s-primary)_20%,transparent)]",
    "active:bg-[color-mix(in_oklch,var(--s-primary)_28%,transparent)]",
  ].join(" "),
  link: "text-[var(--s-primary)] underline-offset-4 hover:underline bg-transparent p-0 h-auto font-medium",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-xs rounded-[var(--s-radius-button,var(--s-radius-sm,0px))]",
  sm: "h-8 px-3 text-xs rounded-[var(--s-radius-button,var(--s-radius-sm,0px))]",
  md: "h-9 px-4 text-sm rounded-[var(--s-radius-button,var(--s-radius-md,0px))]",
  lg: "h-11 px-6 text-base rounded-[var(--s-radius-button,var(--s-radius-md,0px))]",
  "icon-xs": "h-7 w-7 rounded-[var(--s-radius-button,var(--s-radius-md,0px))] p-0 inline-flex items-center justify-center",
  "icon-sm": "h-8 w-8 rounded-[var(--s-radius-button,var(--s-radius-md,0px))] p-0 inline-flex items-center justify-center",
  icon: "h-9 w-9 rounded-[var(--s-radius-button,var(--s-radius-md,0px))] p-0 inline-flex items-center justify-center",
  "icon-lg": "h-11 w-11 rounded-[var(--s-radius-button,var(--s-radius-md,0px))] p-0 inline-flex items-center justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", asChild = false, className, children, onClick, style, ...rest },
  ref,
) {
  const { play } = useSigilSound();
  const Component = asChild ? Slot : "button";

  return (
    <Component
      ref={ref}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex min-w-[var(--s-button-min-width,0px)] items-center justify-center gap-[var(--s-button-icon-gap,8px)] whitespace-nowrap",
        "font-[family-name:var(--s-button-font-family,var(--s-font-body))] font-[var(--s-button-font-weight,500)] tracking-[var(--s-button-letter-spacing,0em)] [text-transform:var(--s-button-text-transform,none)]",
        "cursor-pointer select-none",
        "shadow-[var(--s-shadow-button,none)] transition-all duration-[var(--s-duration-fast,150ms)] ease-out",
        "hover:[filter:var(--s-button-hover-filter,none)] hover:[transform:var(--s-button-hover-transform,none)] hover:shadow-[var(--s-button-hover-shadow,var(--s-shadow-button,none))]",
        "focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)] focus-visible:ring-offset-[var(--s-focus-ring-offset)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([data-icon])]:size-4",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      style={{ borderWidth: "var(--s-button-border-width, 1px)", ...style }}
      onClick={(e) => { play("tap"); onClick?.(e); }}
      {...rest}
    >
      {children}
    </Component>
  );
});
