"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Make the navbar sticky at the top. */
  sticky?: boolean;
  /** Transparent background (useful for hero overlays). */
  transparent?: boolean;
  children?: ReactNode;
}

/** Navigation bar with configurable sticky/transparent behavior. */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { sticky = true, transparent = false, className, children, style, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      data-slot="navbar"
      className={cn(
        "w-full z-50 flex items-center justify-between",
        "px-[var(--s-navbar-padding-x,24px)] h-[var(--s-navbar-height,64px)]",
        "shadow-[var(--s-navbar-shadow,none)]",
        sticky && "sticky top-0 left-0 right-0",
        transparent
          ? "bg-transparent"
          : "bg-[var(--s-background)] backdrop-blur-[var(--s-navbar-backdrop-blur,12px)] backdrop-saturate-[1.8]",
        className,
      )}
      style={{
        borderBottom: transparent
          ? "none"
          : "var(--s-navbar-border, var(--s-border-thin, 1px) var(--s-border-style, solid))",
        borderBottomColor: transparent ? undefined : "var(--s-border)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </nav>
  );
});

export interface NavbarLogoProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Navbar logo slot. */
export const NavbarLogo = forwardRef<HTMLDivElement, NavbarLogoProps>(
  function NavbarLogo({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} data-slot="navbar-logo" className={cn("flex items-center gap-[var(--s-navbar-logo-gap,8px)] font-semibold text-[var(--s-text)] [&_img]:h-[var(--s-navbar-logo-height,24px)] [&_svg]:h-[var(--s-navbar-logo-height,24px)]", className)} {...rest}>
        {children}
      </div>
    );
  },
);

export interface NavbarLinksProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Navbar links container. */
export const NavbarLinks = forwardRef<HTMLDivElement, NavbarLinksProps>(
  function NavbarLinks({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} data-slot="navbar-links" className={cn("hidden md:flex items-center gap-[var(--s-navbar-item-gap,24px)]", className)} {...rest}>
        {children}
      </div>
    );
  },
);

export interface NavbarActionsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Navbar actions slot (buttons, auth, etc). */
export const NavbarActions = forwardRef<HTMLDivElement, NavbarActionsProps>(
  function NavbarActions({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} data-slot="navbar-actions" className={cn("flex items-center gap-3", className)} {...rest}>
        {children}
      </div>
    );
  },
);
