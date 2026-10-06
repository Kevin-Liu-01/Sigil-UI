"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";
import { Box3D, type Box3DProps } from "./Box3D";

export interface Box3DGridItem extends Omit<Box3DProps, "children"> {
  /** Unique key for the item. */
  key: string;
  /** Content rendered inside the Box3D. */
  children?: ReactNode;
}

export interface Box3DGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Items to display in the grid. */
  items?: Box3DGridItem[];
  /** Number of columns. @default 3 */
  columns?: number;
  /** Gap between boxes. @default "1.5rem" */
  gap?: string | number;
}

/** Grid layout of 3D boxes. */
export const Box3DGrid = forwardRef<HTMLDivElement, Box3DGridProps>(function Box3DGrid(
  { items = [], columns = 3, gap = "var(--s-grid-gap, 1.5rem)", className, style, ...rest },
  ref,
) {
  const resolvedGap = typeof gap === "number" ? `${gap}px` : gap;
  const resolvedColumns = Number.isFinite(columns) ? Math.max(1, Math.floor(columns)) : 3;

  return (
    <div
      ref={ref}
      data-slot="box-3d-grid"
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(${resolvedColumns}, minmax(0, 1fr))`,
        gap: resolvedGap,
        ...style,
      }}
      {...rest}
    >
      {items.map(({ key, children, className: boxClassName, ...boxProps }) => (
        <Box3D
          key={key}
          className={cn("w-full [&>div]:block [&>div>div:last-child]:w-full", boxClassName)}
          {...boxProps}
        >
          {children}
        </Box3D>
      ))}
    </div>
  );
});
