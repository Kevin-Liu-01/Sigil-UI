"use client";

import { useMemo, type ReactNode, Children } from "react";
import { Delaunay } from "d3-delaunay";
import { cn } from "../utils";

export interface VoronoiBentoProps {
  /** Number of Voronoi cells. @default 8 */
  seeds?: number;
  /** Gutter between cells in px. Falls back to --s-bento-gap. @default 8 */
  gap?: number;
  /** Border-radius on the outer container. @default 0 */
  rounded?: number;
  /** Container width in px. Uses 100% when omitted. */
  width?: number;
  /** Container height in px. @default 500 */
  height?: number;
  className?: string;
  children?: ReactNode;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function insetPolygon(
  polygon: number[][],
  amount: number,
  w: number,
  h: number,
): number[][] {
  if (amount <= 0 || polygon.length < 3) return polygon;

  let cx = 0;
  let cy = 0;
  for (const [px, py] of polygon) {
    cx += px;
    cy += py;
  }
  cx /= polygon.length;
  cy /= polygon.length;

  return polygon.map(([px, py]) => {
    const dx = px - cx;
    const dy = py - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return [px, py];
    const ratio = Math.max(0, dist - amount) / dist;
    const nx = cx + dx * ratio;
    const ny = cy + dy * ratio;
    return [
      Math.max(0, Math.min(w, nx)),
      Math.max(0, Math.min(h, ny)),
    ];
  });
}

function computeCells(
  seedCount: number,
  w: number,
  h: number,
  gap: number,
) {
  const rng = seededRandom(seedCount * 7919 + 31);

  const margin = Math.max(w, h) * 0.08;
  const points: [number, number][] = [];
  for (let i = 0; i < seedCount; i++) {
    points.push([
      margin + rng() * (w - margin * 2),
      margin + rng() * (h - margin * 2),
    ]);
  }

  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, w, h]);

  const cells: { polygon: number[][]; clipPath: string }[] = [];

  for (let i = 0; i < seedCount; i++) {
    const rawCell = voronoi.cellPolygon(i);
    if (!rawCell) continue;

    const polygon = rawCell.slice(0, -1).map(([x, y]: [number, number]) => [x, y]);
    const inset = insetPolygon(polygon, gap / 2, w, h);

    const clipPath =
      "polygon(" +
      inset
        .map(([x, y]) => `${((x / w) * 100).toFixed(3)}% ${((y / h) * 100).toFixed(3)}%`)
        .join(", ") +
      ")";

    cells.push({ polygon: inset, clipPath });
  }

  return cells;
}

export function VoronoiBento({
  seeds = 8,
  gap = 8,
  rounded = 0,
  width,
  height = 500,
  className,
  children,
}: VoronoiBentoProps) {
  const childArray = Children.toArray(children);
  const containerWidth = width ?? 0;

  const cells = useMemo(
    () => computeCells(seeds, containerWidth || 1000, height, gap),
    [seeds, containerWidth, height, gap],
  );

  const w = containerWidth || 1000;

  return (
    <div
      data-slot="voronoi-bento"
      className={cn("relative overflow-hidden", className)}
      style={{
        width: width ? `${width}px` : "100%",
        height: `${height}px`,
        borderRadius: rounded ? `${rounded}px` : undefined,
      }}
    >
      {cells.map((cell, i) => {
        const hasChild = i < childArray.length;
        const xs = cell.polygon.map(([x]) => x);
        const ys = cell.polygon.map(([, y]) => y);
        const left = Math.min(...xs);
        const top = Math.min(...ys);
        const cellWidth = Math.max(...xs) - left;
        const cellHeight = Math.max(...ys) - top;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{ clipPath: cell.clipPath }}
          >
            <div
              className={cn(
                "w-full h-full",
                hasChild
                  ? "bg-[var(--s-surface,_var(--s-bg-elevated))]"
                  : "ring-1 ring-inset ring-[var(--s-border)]",
              )}
            >
              {hasChild && <div className="absolute" style={{ left: `${left / w * 100}%`, top: `${top / height * 100}%`, width: `${cellWidth / w * 100}%`, height: `${cellHeight / height * 100}%` }}>{childArray[i]}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function VoronoiCell({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full h-full items-center justify-center overflow-hidden p-[var(--s-space-12)] text-center", className)}>
      {children}
    </div>
  );
}
