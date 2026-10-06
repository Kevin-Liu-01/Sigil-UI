"use client";

import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from "react";
import type { GutterPattern } from "@sigil-ui/tokens";
import { cn } from "../utils";
import {
  getSigilPatternStyles,
  usePageGridConfig,
  type SigilPatternStyles,
} from "./SigilPageGrid";

export type DividerPattern = GutterPattern | "vertical";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Divider orientation. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Pattern variant filling the divider band. Defaults to the surrounding page grid pattern. */
  pattern?: DividerPattern;
  /** Band thickness. @default "md" */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Pattern opacity. @default 1 */
  opacity?: number;
  /** Pattern scale multiplier. @default 1 */
  scale?: number;
  /** Show border lines on the band edges. @default true */
  showBorders?: boolean;
  /** Show cross marks at endpoints. @default false */
  showCross?: boolean;
  /** Optional label rendered in the center. */
  label?: ReactNode;
  /** @deprecated Divider edge fades were removed; this prop is now ignored. */
  fadeEdges?: boolean;
  /** If true, this is purely decorative (aria-hidden). @default true */
  decorative?: boolean;
}

function getThickness(size: NonNullable<DividerProps["size"]>, gridCell: number): number {
  const half = Math.round(gridCell / 2);
  switch (size) {
    case "xs": return half;
    case "sm": return half;
    case "md": return gridCell;
    case "lg": return gridCell * 2;
    case "xl": return gridCell * 3;
  }
}

/**
 * Unbordered band = exact multiples of `--s-grid-cell`.
 * Bordered bands are also exact multiples of `--s-grid-cell`; `box-sizing:
 * border-box` keeps the two 1px borders inside the band so stacked section and
 * divider boundaries advance by full cells without cumulative +1px drift.
 */
function gridBandOuterThickness(size: NonNullable<DividerProps["size"]>): string {
  switch (size) {
    case "xs":
    case "sm":
      return "calc(var(--s-grid-cell) / 2)";
    case "md":
      return "var(--s-grid-cell)";
    case "lg":
      return "calc(2 * var(--s-grid-cell))";
    case "xl":
      return "calc(3 * var(--s-grid-cell))";
  }
}

const BORDERED_THICKNESS_VAR: Record<NonNullable<DividerProps["size"]>, string> = {
  xs: "var(--s-divider-thickness-sm, calc(var(--s-grid-cell) / 2))",
  sm: "var(--s-divider-thickness-sm, calc(var(--s-grid-cell) / 2))",
  md: "var(--s-divider-thickness-md, var(--s-grid-cell))",
  lg: "var(--s-divider-thickness-lg, calc(2 * var(--s-grid-cell)))",
  xl: "var(--s-divider-thickness-xl, calc(3 * var(--s-grid-cell)))",
};

const COLOR = "var(--s-grid-line-color, var(--s-border-muted))";

function getLegacyVerticalPatternCSS(
  cell: number,
  scale: number,
): SigilPatternStyles {
  const f = Math.max(0.001, (cell * scale) / Math.max(cell, 1));
  return {
    // Line at the END (right edge) of each tile so it aligns with the
    // structural right-border of cells, matching the SigilPageGrid rail
    // convention (see horizontal patterns: line at bottom of each tile).
    backgroundImage: `linear-gradient(to left, ${COLOR} 1px, transparent 1px)`,
    backgroundSize: `calc(var(--s-grid-cell) * ${f}) 100%`,
  };
}

function resolveDividerPattern(
  pattern: DividerPattern | undefined,
  gridConfig: ReturnType<typeof usePageGridConfig>,
): DividerPattern {
  if (pattern) return pattern;
  if (gridConfig?.marginPattern && gridConfig.marginPattern !== "none") {
    return gridConfig.marginPattern;
  }
  if (gridConfig?.gutterPattern && gridConfig.gutterPattern !== "none") {
    return gridConfig.gutterPattern;
  }
  return "horizontal";
}

function CrossMark() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className="shrink-0"
      aria-hidden
    >
      <line
        x1="0"
        y1="5"
        x2="10"
        y2="5"
        stroke="var(--s-border)"
        strokeWidth="var(--s-cross-stroke, 1)"
      />
      <line
        x1="5"
        y1="0"
        x2="5"
        y2="10"
        stroke="var(--s-border)"
        strokeWidth="var(--s-cross-stroke, 1)"
      />
    </svg>
  );
}

/**
 * Nudge `background-position` / mask-position so repeating rail patterns in the
 * content-column divider stay phase-locked with gutter/margin patterns, which
 * paint from y=0 of the page grid. Dividers start mid-column; without this
 * offset their tiles repeat from the band's local origin and drift.
 */
function mergeStructuralBgYOffset(
  base: string | undefined,
  yPx: number,
): string | undefined {
  if (yPx === 0) return base;
  const v = `${-yPx}px`;
  if (!base?.trim()) return `0px ${v}`;
  const t = base.trim();
  const calcSecond = /^0\s+(calc\(.+\))$/.exec(t);
  if (calcSecond) {
    const inner = calcSecond[1].slice(5, -1);
    return `0 calc(${inner} + ${v})`;
  }
  if (t.endsWith(" 0")) {
    return `${t.slice(0, -2)} ${v}`;
  }
  return `${t} ${v}`;
}

/**
 * Axis-aligned structural patterns share the page grid's vertical origin.
 * Directional textures are self-repeating local fills; applying a document
 * Y offset to them shifts the diagonal phase sideways and makes hatch bands
 * look clipped as their position on the page changes.
 */
function shouldPhaseLockYAxis(pattern: DividerPattern): boolean {
  return pattern !== "diagonal" && pattern !== "crosshatch";
}

/** Decorative patterned divider band — horizontal between sections or vertical between panes. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    orientation = "horizontal",
    pattern,
    size = "md",
    scale = 1,
    opacity = 1,
    showBorders = true,
    showCross = false,
    label,
    fadeEdges: _fadeEdges,
    decorative = true,
    className,
    style,
    ...rest
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [patternYPx, setPatternYPx] = useState(0);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref && typeof ref === "object") {
        (ref as MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref],
  );

  const gridConfig = usePageGridConfig();
  if (gridConfig?.edgeless) return null;
  const rawCell = gridConfig?.gridCell ?? 48;
  const thickness = getThickness(size, rawCell);
  const cell = Math.min(rawCell, thickness);
  const isHorizontal = orientation === "horizontal";
  const outerThickness: string | number = showBorders
    ? BORDERED_THICKNESS_VAR[size]
    : gridBandOuterThickness(size);
  const resolvedPattern = resolveDividerPattern(pattern, gridConfig);
  const patternCss =
    resolvedPattern === "vertical"
      ? getLegacyVerticalPatternCSS(rawCell, scale)
      : getSigilPatternStyles(resolvedPattern, cell * scale, "left", rawCell);
  const phase = (cell * scale) / (2 * Math.max(rawCell, 1));
  const legacyPatternOffset = isHorizontal
    ? `calc(var(--s-grid-cell) * ${phase}) 0`
    : `0 calc(var(--s-grid-cell) * ${phase})`;
  const patternPositionRaw = patternCss?.backgroundPosition
    ?? (resolvedPattern === "vertical" ? legacyPatternOffset : undefined);
  const patternPosition = shouldPhaseLockYAxis(resolvedPattern)
    ? mergeStructuralBgYOffset(patternPositionRaw, patternYPx)
    : patternPositionRaw;
  const bandStroke = gridConfig?.bandStroke ?? "visual";
  const structuralStrokeShadow = showBorders && bandStroke === "visual"
    ? isHorizontal
      ? `0 -1px 0 ${COLOR}, inset 0 -1px 0 ${COLOR}`
      : `-1px 0 0 ${COLOR}, inset -1px 0 0 ${COLOR}`
    : undefined;
  const structuralBorder = showBorders && bandStroke === "border"
    ? isHorizontal
      ? {
          borderTop: `var(--s-border-width-thin, 1px) var(--s-border-style, solid) ${COLOR}`,
          borderBottom: `var(--s-border-width-thin, 1px) var(--s-border-style, solid) ${COLOR}`,
        }
      : {
          borderLeft: `var(--s-border-width-thin, 1px) var(--s-border-style, solid) ${COLOR}`,
          borderRight: `var(--s-border-width-thin, 1px) var(--s-border-style, solid) ${COLOR}`,
        }
    : undefined;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const content = root.closest("[data-layout='sigil-content']") as HTMLElement | null;
    if (!content) return;

    const measure = () => {
      const r = rootRef.current;
      if (!r) return;
      const cr = content.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      // Phase-lock Y offset with gutters (same origin as section snap). Keep
      // sub-pixel precision — rounding here visibly shifts thin ruler patterns.
      const yPx = rr.top - cr.top;
      setPatternYPx((prev) => (Math.abs(prev - yPx) < 1e-6 ? prev : yPx));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(content);
    ro.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [gridConfig?.gridCell, resolvedPattern, size, showBorders]);

  const patternInset = { top: 0, right: 0, bottom: 0, left: 0 };

  return (
    <div
      ref={setRefs}
      data-slot="divider"
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      aria-hidden={decorative ? true : undefined}
      className={cn(
        "sigil-divider relative shrink-0 overflow-hidden",
        isHorizontal ? "w-full" : "h-full",
        className,
      )}
      style={{
        [isHorizontal ? "height" : "width"]: outerThickness,
        boxSizing: "border-box",
        boxShadow: structuralStrokeShadow,
        ...structuralBorder,
        ...style,
      }}
      {...rest}
    >

      <div
        className="absolute"
        style={{
          ...patternInset,
          ...(patternCss?.isMask
            ? {
              backgroundColor: COLOR,
              WebkitMaskImage: patternCss.backgroundImage,
              WebkitMaskSize: patternCss.backgroundSize,
              WebkitMaskRepeat: "repeat",
              WebkitMaskOrigin: "border-box",
              maskImage: patternCss.backgroundImage,
              maskSize: patternCss.backgroundSize,
              maskRepeat: "repeat",
              maskOrigin: "border-box",
              ...(patternPosition
                ? {
                  WebkitMaskPosition: patternPosition,
                  maskPosition: patternPosition,
                }
                : {}),
            }
            : {
              backgroundImage: patternCss?.backgroundImage,
              backgroundSize: patternCss?.backgroundSize,
              backgroundOrigin: "border-box",
              ...(patternPosition ? { backgroundPosition: patternPosition } : {}),
            }),
          opacity,
        }}
      />

      {showCross && (
        <>
          <div
            className={cn(
              "absolute z-[2]",
              isHorizontal
                ? "left-2 top-1/2 -translate-y-1/2"
                : "left-1/2 top-2 -translate-x-1/2",
            )}
          >
            <CrossMark />
          </div>
          <div
            className={cn(
              "absolute z-[2]",
              isHorizontal
                ? "right-2 top-1/2 -translate-y-1/2"
                : "bottom-2 left-1/2 -translate-x-1/2",
            )}
          >
            <CrossMark />
          </div>
        </>
      )}

      {label && (
        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <span
            className={cn(
              "bg-[var(--s-background)] px-3 py-0.5 text-xs text-[var(--s-text-muted)] font-[family-name:var(--s-font-mono)]",
              !isHorizontal && "[writing-mode:vertical-rl]",
            )}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
});
