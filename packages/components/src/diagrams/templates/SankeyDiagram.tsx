"use client";

import { forwardRef, type SVGAttributes } from "react";
import { cn } from "../../utils";

export interface SankeyNode {
  label: string;
  value: number;
  color?: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyDiagramProps extends Omit<SVGAttributes<SVGSVGElement>, "width" | "height"> {
  sources: SankeyNode[];
  targets: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
}

export const SankeyDiagram = forwardRef<SVGSVGElement, SankeyDiagramProps>(
  function SankeyDiagram({ sources, targets, links, width: w = 400, height: h = 200, className, ...props }, ref) {
    const safeSources = sources ?? [];
    const safeTargets = targets ?? [];
    const safeLinks = links ?? [];
    const nodeW = 16;
    const pad = 40;
    const innerH = h - pad * 2;

    const srcTotal = safeSources.reduce((s, n) => s + n.value, 0) || 1;
    const tgtTotal = safeTargets.reduce((s, n) => s + n.value, 0) || 1;

    let srcY = pad;
    const srcPositions = safeSources.map(n => {
      const barH = (n.value / srcTotal) * innerH;
      const pos = { y: srcY, h: barH };
      srcY += barH + 4;
      return pos;
    });

    let tgtY = pad;
    const tgtPositions = safeTargets.map(n => {
      const barH = (n.value / tgtTotal) * innerH;
      const pos = { y: tgtY, h: barH };
      tgtY += barH + 4;
      return pos;
    });

    return (
      <svg
        ref={ref}
        data-slot="sankey-diagram"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className={cn("shrink-0", className)}
        {...props}
      >
        {safeLinks.map((link, i) => {
          const sp = srcPositions[link.source];
          const tp = tgtPositions[link.target];
          if (!sp || !tp) return null;
          const bandH = Math.max(2, (link.value / srcTotal) * innerH * 0.8);
          const x1 = nodeW + 4;
          const y1 = sp.y + sp.h / 2;
          const x2 = w - nodeW - 4;
          const y2 = tp.y + tp.h / 2;
          const mx = w / 2;
          return (
            <path
              key={i}
              d={`M ${x1} ${y1 - bandH / 2} C ${mx} ${y1 - bandH / 2}, ${mx} ${y2 - bandH / 2}, ${x2} ${y2 - bandH / 2} L ${x2} ${y2 + bandH / 2} C ${mx} ${y2 + bandH / 2}, ${mx} ${y1 + bandH / 2}, ${x1} ${y1 + bandH / 2} Z`}
              fill={sources[link.source]?.color ?? "var(--s-primary)"}
              opacity={0.35}
            />
          );
        })}

        {safeSources.map((n, i) => (
          <g key={`s${i}`}>
            <rect x={0} y={srcPositions[i].y} width={nodeW} height={srcPositions[i].h} rx={2} fill={n.color ?? "var(--s-primary)"} opacity={0.8} />
            <text x={nodeW + 6} y={srcPositions[i].y + srcPositions[i].h / 2 + 3} fontSize="var(--s-size-xs)" fill="var(--s-text)" stroke="var(--s-background)" strokeWidth="var(--s-border-thick)" paintOrder="stroke" fontFamily="var(--s-font-mono, monospace)">
              {n.label}
            </text>
          </g>
        ))}

        {safeTargets.map((n, i) => (
          <g key={`t${i}`}>
            <rect x={w - nodeW} y={tgtPositions[i].y} width={nodeW} height={tgtPositions[i].h} rx={2} fill={n.color ?? "var(--s-primary)"} opacity={0.8} />
            <text x={w - nodeW - 6} y={tgtPositions[i].y + tgtPositions[i].h / 2 + 3} fontSize="var(--s-size-xs)" fill="var(--s-text)" stroke="var(--s-background)" strokeWidth="var(--s-border-thick)" paintOrder="stroke" fontFamily="var(--s-font-mono, monospace)" textAnchor="end">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    );
  },
);
