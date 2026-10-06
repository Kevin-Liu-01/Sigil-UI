"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils";

/* -------------------------------- Context -------------------------------- */

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({ collapsed: false, setCollapsed: () => {} });

function useSidebar() {
  return useContext(SidebarContext);
}

/* -------------------------------- Sidebar -------------------------------- */

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Start in collapsed (icon-only) mode. */
  defaultCollapsed?: boolean;
  /** Show the collapse control. Disable for a persistent navigation sidebar. */
  collapsible?: boolean;
  children?: ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { defaultCollapsed = false, collapsible = true, className, children, ...rest },
  ref,
) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsible && collapsed;

  return (
    <SidebarContext.Provider value={{ collapsed: isCollapsed, setCollapsed }}>
      <aside
        ref={ref}
        data-slot="sidebar"
        data-collapsed={isCollapsed || undefined}
        className={cn(
          "sticky top-0 flex h-dvh flex-col border-r [border-color:var(--s-border)] [border-style:var(--s-border-style,solid)]",
          "bg-[var(--s-surface)] text-[var(--s-text)]",
          "transition-[width] duration-[var(--s-duration-normal,200ms)] ease-[var(--s-ease-out)]",
          isCollapsed ? "w-[var(--s-sidebar-collapsed,48px)]" : "w-[var(--s-sidebar-width,256px)]",
          className,
        )}
        {...rest}
      >
        {children}

        {collapsible && <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-[var(--s-space-3,12px)] top-[var(--s-space-6,24px)] z-10 inline-flex size-[var(--s-space-6,24px)] items-center justify-center rounded-[var(--s-radius-full)]",
            "border [border-color:var(--s-border)] [border-style:var(--s-border-style,solid)] bg-[var(--s-surface)] text-[var(--s-text-muted)]",
            "shadow-[var(--s-shadow-sm)] transition-colors duration-[var(--s-duration-fast,150ms)]",
            "hover:bg-[var(--s-primary)]/10 hover:text-[var(--s-text)]",
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d={collapsed ? "M4.5 3l3 3-3 3" : "M7.5 3l-3 3 3 3"}
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>}
      </aside>
    </SidebarContext.Provider>
  );
});

/* ------------------------------ SidebarHeader ---------------------------- */

export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, ...rest }, ref) {
    return (
      <div ref={ref} data-slot="sidebar-header" className={cn("flex items-center gap-[var(--s-space-2,8px)] px-[var(--s-space-4,16px)] py-[var(--s-space-4,16px)] border-b [border-color:var(--s-border)] [border-style:var(--s-border-style,solid)]", className)} {...rest} />
    );
  },
);

/* ----------------------------- SidebarContent ---------------------------- */

export const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarContent({ className, ...rest }, ref) {
    return (
      <div ref={ref} data-slot="sidebar-content" className={cn("flex-1 overflow-y-auto px-[var(--s-space-2,8px)] py-[var(--s-space-2,8px)]", className)} {...rest} />
    );
  },
);

/* ------------------------------ SidebarFooter ---------------------------- */

export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, ...rest }, ref) {
    return (
      <div ref={ref} data-slot="sidebar-footer" className={cn("border-t [border-color:var(--s-border)] [border-style:var(--s-border-style,solid)] px-[var(--s-space-4,16px)] py-[var(--s-space-3,12px)]", className)} {...rest} />
    );
  },
);

/* ------------------------------ SidebarGroup ----------------------------- */

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  function SidebarGroup({ className, ...rest }, ref) {
    return <div ref={ref} data-slot="sidebar-group" className={cn("py-[var(--s-space-2,8px)]", className)} {...rest} />;
  },
);

/* --------------------------- SidebarGroupLabel --------------------------- */

export interface SidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  function SidebarGroupLabel({ className, children, ...rest }, ref) {
    const { collapsed } = useSidebar();

    if (collapsed) return null;

    return (
      <div
        ref={ref}
        data-slot="sidebar-group-label"
        className={cn("px-[var(--s-space-3,12px)] py-[var(--s-space-1,4px)] text-[length:var(--s-size-xs)] font-[var(--s-weight-semibold)] uppercase tracking-[var(--s-tracking-wider)] text-[var(--s-text-muted)]", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* ------------------------------ SidebarItem ------------------------------ */

export interface SidebarItemProps extends HTMLAttributes<HTMLButtonElement> {
  /** Icon element shown in both collapsed and expanded modes. */
  icon?: ReactNode;
  /** Active/selected state. */
  active?: boolean;
  children?: ReactNode;
}

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  function SidebarItem({ icon, active = false, className, children, ...rest }, ref) {
    const { collapsed } = useSidebar();

    return (
      <button
        ref={ref}
        type="button"
        data-slot="sidebar-item"
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex w-full items-center gap-[var(--s-space-3,12px)] rounded-[var(--s-nav-sidebar-item-radius,var(--s-radius-md))]",
          "[padding:var(--s-nav-sidebar-item-padding,8px_12px)]",
          "text-[length:var(--s-size-sm)] font-[var(--s-weight-medium)]",
          "transition-colors duration-[var(--s-duration-fast,150ms)]",
          active
            ? "bg-[var(--s-primary)]/10 text-[var(--s-primary)]"
            : "text-[var(--s-text-muted)] hover:bg-[var(--s-primary)]/5 hover:text-[var(--s-text)]",
          collapsed && "justify-center [padding:var(--s-space-2,8px)_0]",
          className,
        )}
        {...rest}
      >
        {icon && <span className="shrink-0 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>}
        {!collapsed && <span className="truncate">{children}</span>}
      </button>
    );
  },
);
