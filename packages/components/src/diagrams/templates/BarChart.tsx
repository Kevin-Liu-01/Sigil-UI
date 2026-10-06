"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils";

export interface BarChartBar {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartGroup {
  label: string;
  bars: BarChartBar[];
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  groups: BarChartGroup[];
  direction?: "vertical" | "horizontal";
  /** Show value labels on bars. @default true */
  showValues?: boolean;
  /** Show gridlines. @default true */
  showGrid?: boolean;
  /** Maximum bar height/width in px. @default 200 */
  maxBarSize?: number;
}

const defaultColors = [
  "var(--s-primary)",
  "var(--s-success)",
  "var(--s-warning)",
  "var(--s-error)",
  "var(--s-info)",
];

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  function BarChart(
    { groups, direction = "vertical", showValues = true, showGrid = true, maxBarSize = 200, className, ...rest },
    ref,
  ) {
    const allValues = groups.flatMap((g) => g.bars.map((b) => b.value));
    const maxVal = Math.max(...allValues, 1);
    const isV = direction === "vertical";

    return (
      <div
        ref={ref}
        data-slot="bar-chart"
        className={cn("w-full", className)}
        {...rest}
      >
        {isV ? (
          <div className="flex flex-col">
            <div className="flex items-end gap-4" style={{ minHeight: maxBarSize + 32 }}>
              {showGrid && (
                <div className="flex flex-col justify-between h-full pr-2 shrink-0" style={{ height: maxBarSize }}>
                  {[100, 75, 50, 25, 0].map((pct) => (
                    <span key={pct} className="text-[10px] font-[family-name:var(--s-font-mono)] text-[var(--s-text-muted)] tabular-nums leading-none">
                      {Math.round((maxVal * pct) / 100)}
                    </span>
                  ))}
                </div>
              )}
              <div className="min-w-0 flex-1 relative flex items-end gap-[var(--s-space-12)]">
                {showGrid && (
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-b border-dashed border-[color:var(--s-border)]/40 w-full" />
                    ))}
                  </div>
                )}
                {groups.map((group) => (
                  <div key={group.label} className="min-w-0 flex-1 flex flex-col items-center gap-2 relative z-[1]">
                    <div className="w-full min-w-0 flex items-end gap-1">
                      {group.bars.map((bar, bi) => {
                        const h = (bar.value / maxVal) * maxBarSize;
                        return (
                          <div key={bar.label} className="min-w-0 flex-1 flex flex-col items-center gap-1">
                            {showValues && (
                              <span className="text-[10px] font-[family-name:var(--s-font-mono)] text-[var(--s-text-muted)] tabular-nums">
                                {bar.value}
                              </span>
                            )}
                            <div
                              className="w-full max-w-[var(--s-space-32)] rounded-t-[var(--s-radius-sm,2px)] transition-all duration-[var(--s-duration-normal,250ms)]"
                              style={{
                                height: Math.max(h, 2),
                                backgroundColor: bar.color ?? defaultColors[bi % defaultColors.length],
                                opacity: 0.85,
                              }}
                              title={`${bar.label}: ${bar.value}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-xs text-[var(--s-text-muted)] font-[family-name:var(--s-font-mono)] whitespace-nowrap">
                      {group.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <span className="text-xs text-[var(--s-text-muted)] font-[family-name:var(--s-font-mono)]">
                  {group.label}
                </span>
                {group.bars.map((bar, bi) => {
                  const w = (bar.value / maxVal) * 100;
                  return (
                    <div key={bar.label} className="flex items-center gap-2">
                      <div className="flex-1 relative h-6 rounded-[var(--s-radius-sm,2px)] bg-[var(--s-surface-elevated)]">
                        <div
                          className="absolute inset-y-0 left-0 rounded-[var(--s-radius-sm,2px)] flex items-center px-2"
                          style={{
                            width: `${Math.max(w, 1)}%`,
                            backgroundColor: bar.color ?? defaultColors[bi % defaultColors.length],
                            opacity: 0.85,
                          }}
                        >
                          {w > 20 && (
                            <span className="text-[10px] font-semibold text-[var(--s-primary-contrast)] whitespace-nowrap">
                              {bar.label}
                            </span>
                          )}
                        </div>
                      </div>
                      {showValues && (
                        <span className="text-xs font-[family-name:var(--s-font-mono)] text-[var(--s-text)] tabular-nums font-semibold min-w-[32px] text-right">
                          {bar.value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
