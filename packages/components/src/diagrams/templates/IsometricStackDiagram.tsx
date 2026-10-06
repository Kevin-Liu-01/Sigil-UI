"use client";

import { forwardRef, type SVGAttributes } from "react";
import { cn } from "../../utils";

export interface IsoStackLayer {
  label: string;
  color?: string;
  hatched?: boolean;
}

export interface IsometricStackDiagramProps extends Omit<SVGAttributes<SVGSVGElement>, "width" | "height"> {
  layers: IsoStackLayer[];
  width?: number;
  layerHeight?: number;
  gap?: number;
}

function iso(x: number, y: number, z: number): [number, number] {
  return [(x - z) * Math.cos(Math.PI / 6), (x + z) * Math.sin(Math.PI / 6) - y];
}

export const IsometricStackDiagram = forwardRef<SVGSVGElement, IsometricStackDiagramProps>(
  function IsometricStackDiagram({ layers, width: w = 120, layerHeight: lh = 20, gap = 4, className, ...props }, ref) {
    const d = w;
    const margin = 40;

    const allPts: [number, number][] = [];
    layers.forEach((_, i) => {
      const y0 = i * (lh + gap);
      [[0, y0, 0], [w, y0, 0], [w, y0, d], [0, y0, d], [0, y0 + lh, 0], [w, y0 + lh, 0], [w, y0 + lh, d], [0, y0 + lh, d]].forEach(([x, y, z]) => {
        allPts.push(iso(x, y, z));
      });
    });
    const xs = allPts.map(p => p[0]);
    const ys = allPts.map(p => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const svgW = maxX - minX + margin * 2;
    const svgH = maxY - minY + margin * 2;
    const ox = -minX + margin;
    const oy = -minY + margin;

    const pt = (p: [number, number]) => `${p[0] + ox},${p[1] + oy}`;

    return (
      <svg
        ref={ref}
        data-slot="isometric-stack-diagram"
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className={cn("shrink-0", className)}
        {...props}
      >
        {layers.map((layer, i) => {
          const y0 = i * (lh + gap);
          const color = layer.color ?? (i === 0 ? "var(--s-primary)" : "var(--s-surface)");
          const t = [iso(0, y0 + lh, 0), iso(w, y0 + lh, 0), iso(w, y0 + lh, d), iso(0, y0 + lh, d)];
          const l = [iso(0, y0 + lh, 0), iso(0, y0 + lh, d), iso(0, y0, d), iso(0, y0, 0)];
          const r = [iso(0, y0 + lh, d), iso(w, y0 + lh, d), iso(w, y0, d), iso(0, y0, d)];

          return (
            <g key={i}>
              <polygon points={l.map(pt).join(" ")} fill={color} opacity={0.85} stroke="var(--s-border)" strokeWidth={0.5} />
              <polygon points={r.map(pt).join(" ")} fill={color} opacity={0.7} stroke="var(--s-border)" strokeWidth={0.5} />
              <polygon points={t.map(pt).join(" ")} fill={color} stroke="var(--s-border)" strokeWidth={0.5} />
              {layer.hatched && (
                <polygon points={t.map(pt).join(" ")} fill="url(#iso-hatch)" opacity={0.15} />
              )}
              <text
                x={(t[0][0] + t[2][0]) / 2 + ox}
                y={(t[0][1] + t[2][1]) / 2 + oy + 4}
                textAnchor="middle"
                fill={i === 0 && !layer.color ? "var(--s-primary-contrast)" : "var(--s-text)"}
                fontSize={9}
                fontFamily="var(--s-font-mono, monospace)"
                fontWeight={600}
              >
                {layer.label}
              </text>
            </g>
          );
        })}
        <defs>
          <pattern id="iso-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
      </svg>
    );
  },
);
