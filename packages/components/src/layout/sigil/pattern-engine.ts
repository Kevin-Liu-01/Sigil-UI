import type { GutterPattern } from "@sigil-ui/tokens";

/**
 * Pattern math for the structural-visibility grid.
 *
 * Pure functions only — no React, no DOM. Each named pattern resolves
 * to a `SigilPatternStyles` descriptor that the gutter / margin / divider
 * components feed into a CSS background-image.
 *
 * `side: "right"` mirrors the pattern horizontally so the inside edge
 * (closest to content) reads symmetrically across both rails.
 */

const STRUCTURAL_LINE_COLOR =
  "var(--s-grid-line-color, var(--s-border-muted))";
const COLOR = STRUCTURAL_LINE_COLOR;

const SVG_STROKE_MASK = "white";

export type PatternSide = "left" | "right";

export type SigilPatternStyles = {
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition?: string;
  isMask?: boolean;
};

export const STRUCTURAL_LINE_COLOR_VAR = STRUCTURAL_LINE_COLOR;
export const PATTERN_COLOR = COLOR;

const PATTERN_CELL_SCALE: Partial<Record<GutterPattern, number>> = {
  grid: 0.5,
  dots: 0.5,
  // Diagonal rules read better as a denser texture in 1-cell divider bands.
  // Half-cell spacing (25px at the default 50px grid cell) looked too sparse
  // and made the band feel like disconnected slashes instead of a hatch.
  crosshatch: 0.25,
  diagonal: 0.25,
  diamond: 0.5,
  hexagon: 0.5,
  triangle: 0.5,
  zigzag: 0.5,
  checker: 0.5,
  plus: 0.5,
  brick: 0.5,
  wave: 0.5,
};

function buildLineSvg(
  tileW: number,
  tileH: number,
  lines: number[][],
): string {
  const lineEls = lines
    .map(
      ([x1, y1, x2, y2]) =>
        `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='${SVG_STROKE_MASK}' stroke-width='1'/>`,
    )
    .join("");
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${tileW}' height='${tileH}'>${lineEls}</svg>`;
}

function mirrorLinesX(lines: number[][], tileW: number): number[][] {
  return lines.map(([x1, y1, x2, y2]) => [tileW - x1, y1, tileW - x2, y2]);
}

function getHexLines(cell: number): { w: number; h: number; lines: number[][] } {
  const s = Math.round(cell * 0.5);
  const w = Math.round(s * 1.732);
  const tileH = s * 3;
  const halfS = Math.round(s / 2);
  const threeHalfS = Math.round(s * 1.5);
  return {
    w,
    h: tileH,
    lines: [
      [w / 2, 0, w, halfS],
      [w, halfS, w, threeHalfS],
      [w, threeHalfS, w / 2, s * 2],
      [w / 2, s * 2, 0, threeHalfS],
      [0, threeHalfS, 0, halfS],
      [0, halfS, w / 2, 0],
      [w / 2, s * 2, w / 2, tileH],
    ],
  };
}

function getTriangleLines(
  cell: number,
): { w: number; h: number; lines: number[][] } {
  const side = cell;
  const h = Math.round(side * 0.866);
  const half = Math.round(side / 2);
  return {
    w: side,
    h: h * 2,
    lines: [
      [0, 0, side, 0],
      [0, h, side, h],
      [0, h * 2, side, h * 2],
      [0, 0, half, h],
      [half, h, 0, h * 2],
      [half, h, side, h * 2],
      [side, 0, half, h],
    ],
  };
}

function getBrickLines(
  cell: number,
): { w: number; h: number; lines: number[][] } {
  const rowH = Math.round(cell / 2);
  const half = Math.round(cell / 2);
  return {
    w: cell,
    h: rowH * 2,
    lines: [
      [0, rowH, cell, rowH],
      [0, rowH * 2, cell, rowH * 2],
      [0, 0, 0, rowH],
      [half, rowH, half, rowH * 2],
    ],
  };
}

/**
 * Snap a desired tile period to the largest integer divisor of `cell`
 * that's `<= target`. Same idea as the `horizontal-thin` repeat strategy
 * but for 2D patterns (diamond, etc.) whose tile size depends on `cell`.
 * Using a cell-divisor guarantees the tile is integer pixels AND that
 * the pattern re-aligns with the `cell` grid at every cell boundary,
 * instead of drifting subpixel-by-subpixel from a fractional period.
 *
 * Example: `cell=50, target=12.5` (the historic `s/2` for diamond) is
 * fractional and would rasterize as alternating 12/13px tiles. Snapping
 * picks `10` (50/5), so 5 diamonds per cell, every cell boundary clean.
 */
function snapPeriod(cell: number, target: number, min = 4): number {
  const c = Math.max(1, Math.round(cell));
  const t = Math.max(min, Math.floor(target));
  for (let d = t; d >= min; d--) {
    if (c % d === 0) return d;
  }
  return min;
}

/**
 * Ruler subdivisions inside one vertical period of height `f × --s-grid-cell`.
 * Uses `var(--s-grid-cell)` so the pattern tracks zoom / root font-size like
 * the rail tokens, instead of hard-coded px from JS.
 */
function buildSubdividedHorizontalVar(
  color: string,
  subdivisions: number,
  f: number,
): { backgroundImage: string; backgroundSize: string } {
  const n = Math.max(1, Math.round(subdivisions));
  const factor = Math.max(0.001, f);
  const stops: string[] = [];
  for (let i = 1; i <= n; i++) {
    const lineEnd = `calc(var(--s-grid-cell) * ${factor} * ${i} / ${n})`;
    const lineStart = `calc(var(--s-grid-cell) * ${factor} * ${i} / ${n} - 1px)`;
    if (i === 1) {
      stops.push("transparent 0px", `transparent ${lineStart}`);
    } else {
      const prevEnd = `calc(var(--s-grid-cell) * ${factor} * ${i - 1} / ${n})`;
      stops.push(`transparent ${prevEnd}`, `transparent ${lineStart}`);
    }
    stops.push(`${color} ${lineStart}`, `${color} ${lineEnd}`);
  }
  return {
    backgroundImage: `repeating-linear-gradient(to bottom, ${stops.join(", ")})`,
    backgroundSize: `100% calc(var(--s-grid-cell) * ${factor})`,
  };
}

/**
 * Resolve a `GutterPattern` to CSS background styles.
 *
 * @param patternBase - Effective pattern period in the same "px space" as the
 *   active preset (e.g. full `gridCell`, or a thinner divider band).
 * @param referenceCell - Preset `gridCell` (unscaled). Used to form
 *   `calc(var(--s-grid-cell) * factor)` so patterns track `--s-grid-cell`
 *   (rem) under zoom and font-size. Also used for diamond snap + SVG tiles.
 * @param side - Mirrors the pattern for right-hand rails.
 */
export function getSigilPatternStyles(
  pattern: GutterPattern,
  patternBase: number,
  side: PatternSide = "left",
  referenceCell: number = patternBase,
): SigilPatternStyles | null {
  const C = COLOR;
  const R = side === "right";
  const tileScale = PATTERN_CELL_SCALE[pattern] ?? 1;
  const ref = Math.max(1, referenceCell);
  const f = Math.max(0.001, patternBase / ref);
  const s = Math.max(Math.round(patternBase * tileScale), 8);
  const varTile = `max(8px, calc(var(--s-grid-cell) * ${tileScale * f}))`;
  switch (pattern) {
    case "grid": {
      // Lines at the END of each tile (bottom-right) so they coincide
      // with the 1px structural border on a `box-sizing: border-box`
      // band of height = grid-cell. A line at the TOP would sit 1px
      // below where bands actually end.
      return {
        backgroundImage: [
          `linear-gradient(${R ? "to right" : "to left"}, ${C} 1px, transparent 1px)`,
          `linear-gradient(to top, ${C} 1px, transparent 1px)`,
        ].join(", "),
        backgroundSize: `${varTile} ${varTile}`,
      };
    }
    case "dots": {
      const halfTile = `calc(${varTile} / 2)`;
      return {
        backgroundImage: `radial-gradient(circle, ${C} 1px, transparent 1px)`,
        backgroundSize: `${varTile} ${varTile}`,
        backgroundPosition: R ? `left ${halfTile}` : `right ${halfTile}`,
      };
    }
    case "crosshatch": {
      const a = R ? -45 : 45;
      const b = R ? 45 : -45;
      const period = `calc(${varTile} - 1px)`;
      const end = varTile;
      return {
        backgroundImage: [
          `repeating-linear-gradient(${a}deg, transparent, transparent ${period}, ${C} ${period}, ${C} ${end})`,
          `repeating-linear-gradient(${b}deg, transparent, transparent ${period}, ${C} ${period}, ${C} ${end})`,
        ].join(", "),
        backgroundSize: "auto, auto",
      };
    }
    case "diagonal": {
      const angle = R ? -45 : 45;
      const period = `calc(${varTile} - 1px)`;
      const end = varTile;
      return {
        backgroundImage: `repeating-linear-gradient(${angle}deg, transparent, transparent ${period}, ${C} ${period}, ${C} ${end})`,
        // The gradient owns its repeat period. Sizing the image to the whole
        // divider made its phase depend on the band's document position and
        // produced visibly clipped / crawling hatch lines.
        backgroundSize: "auto",
      };
    }
    case "diamond": {
      // `s/2` is fractional whenever `s` is odd (cell=50 → s=25 → 12.5),
      // which makes the browser rasterize each diamond tile as alternating
      // 12/13 px blocks. Snap to the largest cell-divisor `<= s/2` so the
      // tile is integer pixels AND the diamond grid re-aligns with the
      // structural cell grid at every cell boundary.
      const h = snapPeriod(ref, s / 2);
      const a = R ? -45 : 45;
      const b = R ? 45 : -45;
      return {
        backgroundImage: [
          `linear-gradient(${a}deg, ${C} 25%, transparent 25%, transparent 75%, ${C} 75%)`,
          `linear-gradient(${b}deg, ${C} 25%, transparent 25%, transparent 75%, ${C} 75%)`,
        ].join(", "),
        backgroundSize: `${h}px ${h}px`,
      };
    }
    // Horizontal patterns: line at the END of each tile (bottom) so it
    // lines up with the 1px structural border of bands/dividers above.
    // `to top` puts the color stop at the bottom of each tile.
    case "horizontal":
      return {
        backgroundImage: `linear-gradient(to top, ${C} 1px, transparent 1px)`,
        backgroundSize: `100% calc(var(--s-grid-cell) * ${f})`,
      };
    case "horizontal-thin": {
      // 3 lines per cell — matches the dedalus reticle (which gets 3
      // cleanly because gridCell=48). For cell=50 the inner stops sit at
      // 16.67 / 33.33 (fractional), but `repeating-linear-gradient` repeats
      // the entire 50px block from a clean integer boundary, so each cell
      // renders the same 3 lines at the same relative positions — no
      // cumulative drift, and the bottom line lands exactly on every cell
      // boundary alongside the `horizontal` margin pattern.
      return buildSubdividedHorizontalVar(C, 3, f);
    }
    case "horizontal-fine": {
      // 5 lines per cell — denser than `horizontal-thin` for an
      // instrument-ruler feel. Same drift-free repeat strategy: the
      // 5th line lands exactly on every cell boundary.
      return buildSubdividedHorizontalVar(C, 5, f);
    }
    case "horizontal-wide": {
      return {
        backgroundImage: `linear-gradient(to top, ${C} 1px, transparent 1px)`,
        backgroundSize: `100% calc(var(--s-grid-cell) * ${3 * f})`,
      };
    }
    case "hexagon": {
      const { w, h, lines } = getHexLines(s);
      const svg = buildLineSvg(w, h, R ? mirrorLinesX(lines, w) : lines);
      return {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: `${w}px ${h}px`,
        isMask: true,
      };
    }
    case "triangle": {
      const { w, h, lines } = getTriangleLines(s);
      const svg = buildLineSvg(w, h, R ? mirrorLinesX(lines, w) : lines);
      return {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: `${w}px ${h}px`,
        isMask: true,
      };
    }
    case "zigzag": {
      const [a1, a2, a3, a4] = R ? [45, 315, 225, 135] : [135, 225, 315, 45];
      return {
        backgroundImage: [
          `linear-gradient(${a1}deg, ${C} 25%, transparent 25%)`,
          `linear-gradient(${a2}deg, ${C} 25%, transparent 25%)`,
          `linear-gradient(${a3}deg, ${C} 25%, transparent 25%)`,
          `linear-gradient(${a4}deg, ${C} 25%, transparent 25%)`,
        ].join(", "),
        backgroundSize: `${varTile} ${varTile}`,
      };
    }
    case "checker": {
      const halfTile = `calc(${varTile} / 2)`;
      const a = R ? -45 : 45;
      return {
        backgroundImage: [
          `linear-gradient(${a}deg, ${C} 25%, transparent 25%, transparent 75%, ${C} 75%)`,
          `linear-gradient(${a}deg, ${C} 25%, transparent 25%, transparent 75%, ${C} 75%)`,
        ].join(", "),
        backgroundSize: `${varTile} ${varTile}`,
        backgroundPosition: R
          ? `left ${halfTile} top ${halfTile}, left top`
          : `right top, right ${halfTile} top ${halfTile}`,
      };
    }
    case "plus": {
      const dir = R ? "to left" : "to right";
      const vDir = R ? "to top" : "to bottom";
      return {
        backgroundImage: [
          `linear-gradient(${dir}, transparent 49.5%, ${C} 49.5%, ${C} 50.5%, transparent 50.5%)`,
          `linear-gradient(${vDir}, transparent 49.5%, ${C} 49.5%, ${C} 50.5%, transparent 50.5%)`,
        ].join(", "),
        backgroundSize: `${varTile} ${varTile}`,
      };
    }
    case "brick": {
      const { w, h, lines } = getBrickLines(s);
      const svg = buildLineSvg(w, h, R ? mirrorLinesX(lines, w) : lines);
      return {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: `${w}px ${h}px`,
        isMask: true,
      };
    }
    case "wave": {
      const w = s;
      const h = s;
      const a = h * 0.35;
      const mid = h / 2;
      const pts: string[] = [];
      const steps = 40;
      const sign = R ? -1 : 1;
      for (let i = 0; i <= steps; i++) {
        const x = R ? w - (i / steps) * w : (i / steps) * w;
        const y = mid + sign * a * Math.sin((i / steps) * Math.PI * 2);
        pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><path d='${pts.join(" ")}' fill='none' stroke='${SVG_STROKE_MASK}' stroke-width='1'/></svg>`;
      return {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: `${w}px ${h}px`,
        isMask: true,
      };
    }
    case "none":
    default:
      return null;
  }
}
