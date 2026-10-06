"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";

export interface MatrixCell {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

export interface MatrixDiagramProps extends HTMLAttributes<HTMLDivElement> {
  cells: MatrixCell[][];
  xLabels?: string[];
  yLabels?: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const MatrixDiagram = forwardRef<HTMLDivElement, MatrixDiagramProps>(
  function MatrixDiagram({ cells, xLabels, yLabels, xAxisLabel, yAxisLabel, className, ...rest }, ref) {
    const rows = cells.length;
    const cols = rows > 0 ? cells[0].length : 0;

    return (
      <div
        ref={ref}
        data-slot="matrix-diagram"
        className={cn("max-w-full overflow-x-auto inline-flex gap-2", className)}
        {...rest}
      >
        {yAxisLabel && (
          <div className="flex items-center">
            <span
              className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-wider text-[var(--s-text-muted)]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {yAxisLabel}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {yLabels && (
            <div className="flex">
              <div className="min-w-[80px]" />
              {/* spacer for y-labels column */}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {cells.map((row, ri) => (
              <div key={ri} className="flex items-stretch gap-1">
                {yLabels && yLabels[ri] && (
                  <div className="flex items-center justify-end min-w-[80px] pr-3">
                    <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">
                      {yLabels[ri]}
                    </span>
                  </div>
                )}
                {row.map((cell) => (
                  <div
                    key={cell.id}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-[var(--s-radius-md,0px)] border border-[color:var(--s-border)]",
                      "bg-[var(--s-surface)] p-4 min-w-[120px] min-h-[100px]",
                      "transition-colors duration-[var(--s-duration-fast,150ms)] hover:bg-[var(--s-surface-elevated)]",
                    )}
                  >
                    {cell.icon && <span className="[&_svg]:size-5 text-[var(--s-primary)]">{cell.icon}</span>}
                    <span className="text-sm font-semibold text-[var(--s-text)] text-center">{cell.label}</span>
                    {cell.description && (
                      <span className="text-xs text-[var(--s-text-muted)] text-center max-w-[140px]">{cell.description}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {xLabels && (
            <div className="flex gap-1">
              {yLabels && <div className="min-w-[80px]" />}
              {xLabels.map((label, i) => (
                <div key={i} className="flex-1 min-w-[120px] text-center">
                  <span className="font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {xAxisLabel && (
            <div className="text-center mt-1">
              <span className="font-[family-name:var(--s-font-mono)] text-[10px] uppercase tracking-wider text-[var(--s-text-muted)]">
                {xAxisLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);
