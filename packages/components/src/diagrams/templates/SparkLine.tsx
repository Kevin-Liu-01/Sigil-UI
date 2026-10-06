"use client";

import { forwardRef, type SVGAttributes } from "react";
import { cn } from "../../utils";

export interface SparkLineProps extends Omit<SVGAttributes<SVGSVGElement>, "width" | "height"> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Fill area under line. @default true */
  filled?: boolean;
  /** Show a dot at the last data point. @default true */
  showEndDot?: boolean;
}

export const SparkLine = forwardRef<SVGSVGElement, SparkLineProps>(
  function SparkLine({ data, width: w = 120, height: h = 32, color, filled = true, showEndDot = true, className, ...props }, ref) {
    const safeData = data ?? [];
    if (safeData.length < 2) return null;
    const pad = 2;
    const dotR = 2.5;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    const min = Math.min(...safeData);
    const max = Math.max(...safeData);
    const range = max - min || 1;

    const pts = safeData.map((v, i) => ({
      x: pad + (i / (safeData.length - 1)) * plotW,
      y: pad + plotH - ((v - min) / range) * plotH,
    }));

    const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const c = color ?? "var(--s-primary)";

    return (
      <svg
        ref={ref}
        data-slot="spark-line"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className={cn("max-w-full h-auto", className)}
        {...props}
      >
        {filled && (
          <path
            d={`${lineD} L ${pts[pts.length - 1].x} ${h - pad} L ${pts[0].x} ${h - pad} Z`}
            fill={c}
            fillOpacity={0.1}
          />
        )}
        <path d={lineD} fill="none" stroke={c} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
        {showEndDot && (
          <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={dotR} fill={c} />
        )}
      </svg>
    );
  },
);
