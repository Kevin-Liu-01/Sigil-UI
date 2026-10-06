"use client";

import { forwardRef, type HTMLAttributes, type ReactNode, type CSSProperties } from "react";
import { cn } from "../utils";

/* -------------------------------------------------------------------------- */
/*  BentoGrid                                                                 */
/* -------------------------------------------------------------------------- */

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Responsive column count. @default { base: 1, md: 3 } */
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Show the dot-grid background pattern behind cells. @default false */
  dotGrid?: boolean;
  /** Gap between cells. Reads --s-bento-gap by default. */
  gap?: string | number;
  children?: ReactNode;
}

/**
 * Token-driven bento grid with per-cell borders and hover states.
 *
 * Consumes `gridVisuals` tokens (`--s-grid-cell-radius`, `--s-grid-cell-padding`,
 * `--s-grid-hover-effect`) and `layout` tokens (`--s-bento-gap`).
 *
 * Unlike `GapPixelGrid` (gap-bleed hairlines), BentoGrid uses per-cell borders
 * so cells support independent radius, hover, and span.
 */
export const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  function BentoGrid(
    {
      columns = { base: 1, md: 3 },
      dotGrid = false,
      gap,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const baseColumns = columns.base ?? 1;
    const smColumns = columns.sm ?? baseColumns;
    const mdColumns = columns.md ?? smColumns;
    const lgColumns = columns.lg ?? mdColumns;
    const xlColumns = columns.xl ?? lgColumns;
    const resolvedGap =
      typeof gap === "number"
        ? `${gap}px`
        : gap ?? "var(--s-bento-gap, 4px)";

    return (
      <div
        ref={ref}
        data-slot="bento-grid"
        className={cn(
          "sigil-bento-grid grid",
          "grid-cols-[repeat(var(--s-bento-columns-base),minmax(0,1fr))] sm:grid-cols-[repeat(var(--s-bento-columns-sm),minmax(0,1fr))] md:grid-cols-[repeat(var(--s-bento-columns-md),minmax(0,1fr))] lg:grid-cols-[repeat(var(--s-bento-columns-lg),minmax(0,1fr))] xl:grid-cols-[repeat(var(--s-bento-columns-xl),minmax(0,1fr))]",
          dotGrid && "s-dot-grid",
          className,
        )}
        style={{
          "--s-bento-columns-base": baseColumns,
          "--s-bento-columns-sm": smColumns,
          "--s-bento-columns-md": mdColumns,
          "--s-bento-columns-lg": lgColumns,
          "--s-bento-columns-xl": xlColumns,
          gap: resolvedGap,
          ...style,
        } as CSSProperties}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  BentoCell                                                                 */
/* -------------------------------------------------------------------------- */

export interface BentoCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns this cell spans. */
  colSpan?: 1 | 2 | 3;
  /** Number of rows this cell spans. */
  rowSpan?: 1 | 2 | 3;
  children?: ReactNode;
}

const spanColClasses: Record<number, string> = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-3",
};

const spanRowClasses: Record<number, string> = {
  1: "",
  2: "md:row-span-2",
  3: "md:row-span-3",
};

/**
 * A cell within a `BentoGrid`. Renders a bordered container with
 * subtle-to-visible hover transition — the chanhdai "ghost grid" effect.
 *
 * Border color transitions from `--s-border-muted` → `--s-border` on hover.
 * Radius reads `--s-grid-cell-radius`. Padding reads `--s-grid-cell-padding`.
 */
export const BentoCell = forwardRef<HTMLDivElement, BentoCellProps>(
  function BentoCell(
    { colSpan = 1, rowSpan = 1, className, style, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="bento-cell"
        className={cn(
          "sigil-bento-cell flex items-center justify-center",
          "border border-[var(--s-line,var(--s-border-muted))] bg-[var(--s-background)]",
          "transition-[border-color] duration-[var(--s-duration-fast,150ms)]",
          "hover:border-[var(--s-border)]",
          spanColClasses[colSpan],
          spanRowClasses[rowSpan],
          className,
        )}
        style={{
          borderRadius: "var(--s-grid-cell-radius, var(--s-radius-sm, 8px))",
          padding: "var(--s-grid-cell-padding, 1rem)",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
