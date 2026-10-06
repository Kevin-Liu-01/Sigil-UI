"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface SigilGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns. @default 3 */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Gap between cells. */
  gap?: string | number;
  children?: ReactNode;
}

const colMap: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

/**
 * Grid with visible cross marks at cell intersections.
 * Uses a pseudo-element background to render the sigil pattern.
 */
export const SigilGrid = forwardRef<HTMLDivElement, SigilGridProps>(function SigilGrid(
  { columns = 3, gap, className, style, children, ...rest },
  ref,
) {
  const resolvedGap = typeof gap === "number" ? `${gap}px` : gap ?? "var(--s-grid-cell, 1rem)";

  return (
    <div
      ref={ref}
      data-slot="grid" className={cn("grid relative", colMap[columns], className)}
      style={{
        gap: resolvedGap,
        backgroundImage: `
          linear-gradient(color-mix(in oklab, var(--s-grid-line-color, var(--s-border)) calc(var(--s-grid-show-lines, 0) * 100%), transparent) var(--s-grid-line-width, 1px), transparent var(--s-grid-line-width, 1px)),
          linear-gradient(90deg, color-mix(in oklab, var(--s-grid-line-color, var(--s-border)) calc(var(--s-grid-show-lines, 0) * 100%), transparent) var(--s-grid-line-width, 1px), transparent var(--s-grid-line-width, 1px)),
          radial-gradient(circle, color-mix(in oklab, var(--s-border) calc(var(--s-grid-show-dots, 0) * 100%), transparent) var(--s-grid-dot-size, 1px), transparent var(--s-grid-dot-size, 1px))
        `,
        backgroundSize: `${resolvedGap} ${resolvedGap}`,
        backgroundPosition: `calc(${resolvedGap} / 2) calc(${resolvedGap} / 2)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export interface SigilGridCellProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Individual grid cell with hover highlight. */
export const SigilGridCell = forwardRef<HTMLDivElement, SigilGridCellProps>(
  function SigilGridCell({ className, children, style, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="grid" className={cn(
          "relative p-4 rounded-[var(--s-grid-cell-radius,var(--s-radius-sm))] transition-colors duration-[var(--s-duration-normal)]",
          "hover:bg-[var(--s-surface-elevated)]",
          className,
        )}
        style={{
          background: "var(--s-grid-cell-background-color, transparent)",
          border: "calc(var(--s-grid-cell-border, 0) * 1px) solid var(--s-grid-line-color, var(--s-border))",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
