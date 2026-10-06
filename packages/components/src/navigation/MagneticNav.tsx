"use client";

import { forwardRef, type HTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface MagneticNavProps extends HTMLAttributes<HTMLElement> {
  /** Orientation of the nav list. */
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
}

/**
 * Navigation list with a magnetic highlight indicator that slides
 * to the hovered/focused link using CSS anchor positioning.
 *
 * No JavaScript required for the magnetic effect — pure CSS.
 */
export const MagneticNav = forwardRef<HTMLElement, MagneticNavProps>(
  function MagneticNav({ orientation = "horizontal", className, children, ...rest }, ref) {
    return (
      <nav
        ref={ref}
        data-slot="magnetic-nav"
        data-orientation={orientation}
        className={cn("sigil-magnetic-nav", className)}
        {...rest}
      >
        <ul
          className={cn(
            "sigil-magnetic-nav-list",
            "relative m-0 flex flex-wrap list-none gap-[var(--s-navbar-item-gap,4px)] p-[3px]",
            "rounded-[var(--s-radius-lg,10px)]",
            orientation === "vertical" && "flex-col",
          )}
        >
          {children}
        </ul>
      </nav>
    );
  },
);

export interface MagneticNavItemProps extends HTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
}

export const MagneticNavItem = forwardRef<HTMLLIElement, MagneticNavItemProps>(
  function MagneticNavItem({ className, children, ...rest }, ref) {
    return (
      <li
        ref={ref}
        data-slot="magnetic-nav-item"
        className={cn("sigil-magnetic-nav-item", className)}
        {...rest}
      >
        {children}
      </li>
    );
  },
);

export interface MagneticNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Mark this link as the currently active page. */
  active?: boolean;
  children?: ReactNode;
}

export const MagneticNavLink = forwardRef<HTMLAnchorElement, MagneticNavLinkProps>(
  function MagneticNavLink({ active = false, className, children, ...rest }, ref) {
    return (
      <a
        ref={ref}
        data-slot="magnetic-nav-link"
        data-active={active || undefined}
        aria-current={active ? "page" : undefined}
        className={cn(
          "sigil-magnetic-nav-link",
          "relative z-[1] block px-[var(--s-button-padding-x,14px)] py-[var(--s-spacing-xs,6px)]",
          "rounded-[var(--s-radius-md,8px)]",
          "text-sm font-[var(--s-button-font-weight,500)]",
          "text-[var(--s-text-muted)] no-underline",
          "transition-colors duration-[var(--s-duration-fast,150ms)]",
          "hover:text-[var(--s-text)]",
          "focus-visible:text-[var(--s-text)] focus-visible:outline-none",
          active && "text-[var(--s-text)]",
          className,
        )}
        {...rest}
      >
        {children}
      </a>
    );
  },
);
