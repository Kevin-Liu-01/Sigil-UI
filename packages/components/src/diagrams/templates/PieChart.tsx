"use client";

import { forwardRef, type SVGAttributes } from "react";
import { cn } from "../../utils";

export interface PieSlice {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps extends Omit<SVGAttributes<SVGSVGElement>, "width" | "height"> {
  slices: PieSlice[];
  width?: number;
  height?: number;
  /** Show percentage labels on slices. @default true */
  showLabels?: boolean;
  /** Show legend below chart. @default true */
  showLegend?: boolean;
}

const defaultColors = [
  "var(--s-chart-series-1, oklch(0.65 0.19 250))",
  "var(--s-chart-series-2, oklch(0.7 0.18 160))",
  "var(--s-chart-series-3, oklch(0.65 0.2 310))",
  "var(--s-chart-series-4, oklch(0.72 0.16 60))",
  "var(--s-chart-series-5, oklch(0.6 0.22 30))",
  "var(--s-chart-neutral, oklch(0.55 0.02 250))",
];

export const PieChart = forwardRef<SVGSVGElement, PieChartProps>(
  function PieChart({ slices, width: w = 220, height: h = 220, showLabels = true, showLegend = true, className, ...props }, ref) {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 4;
    const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;

    let cumAngle = -90;
    const sliceData = slices.map((sl, i) => {
      const angle = (sl.value / total) * 360;
      const startAngle = cumAngle;
      cumAngle += angle;
      return { ...sl, startAngle, angle, color: sl.color ?? defaultColors[i % defaultColors.length] };
    });

    function polarXY(angle: number, radius: number) {
      const rad = (angle * Math.PI) / 180;
      return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
    }

    return (
      <div className={cn("inline-flex flex-col items-center gap-3", className)}>
        <svg
          ref={ref}
          data-slot="pie-chart"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="max-w-full h-auto"
          {...props}
        >
          {sliceData.map((sl, i) => {
            if (sl.angle <= 0) return null;
            const a = Math.min(sl.angle, 359.99);
            const start = polarXY(sl.startAngle, r);
            const end = polarXY(sl.startAngle + a, r);
            const large = a > 180 ? 1 : 0;
            const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;

            const midAngle = sl.startAngle + a / 2;
            const labelPos = polarXY(midAngle, r * 0.6);
            const pct = ((sl.value / total) * 100).toFixed(0);

            return (
              <g key={i}>
                <path d={d} fill={sl.color} opacity={0.85} />
                {showLabels && a > 15 && (
                  <g>
                  <rect x={labelPos.x - 18} y={labelPos.y - 10} width={36} height={20} rx={4} fill="var(--s-chart-tooltip-bg, var(--s-surface))" />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="var(--s-size-xs)"
                    fontWeight="var(--s-weight-semibold)"
                    fill="var(--s-chart-tooltip-text, var(--s-text))"
                  >
                    {pct}%
                  </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {showLegend && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
            {sliceData.map((sl, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-[var(--s-radius-full)] shrink-0" style={{ backgroundColor: sl.color }} />
                <span className="text-xs text-[var(--s-text-muted)]">{sl.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
