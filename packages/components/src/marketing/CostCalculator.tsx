"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface CostSlider {
  label: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export interface CostEstimate {
  brandName: string;
  brandCost: number;
  competitorName?: string;
  competitorCost?: number;
  savingsNote?: string;
}

export interface CostCalculatorProps extends HTMLAttributes<HTMLDivElement> {
  sliders: CostSlider[];
  estimate: CostEstimate;
  sliderRenderer?: (slider: CostSlider) => ReactNode;
}

export const CostCalculator = forwardRef<HTMLDivElement, CostCalculatorProps>(
  function CostCalculator({ sliders, estimate, sliderRenderer, className, ...rest }, ref) {
    const [localValues, setLocalValues] = useState<Record<string, number>>({});
    const safeSliders = sliders ?? [];
    const safeEstimate: CostEstimate = estimate ?? { brandName: "Plan", brandCost: 0 };
    const savings = safeEstimate.competitorCost
      ? safeEstimate.competitorCost - safeEstimate.brandCost
      : 0;
    const savingsPct = safeEstimate.competitorCost
      ? Math.round((savings / safeEstimate.competitorCost) * 100)
      : 0;
    const maxCost = Math.max(safeEstimate.brandCost, safeEstimate.competitorCost ?? 0);

    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-1 md:grid-cols-2 gap-0", className)}
        style={{
          border: "1px solid var(--s-border)",
          borderStyle: "var(--s-border-style, solid)" as any,
          borderRadius: "var(--s-radius-md, 6px)",
          overflow: "hidden",
        }}
        {...rest}
      >
        {/* Configure panel */}
        <div style={{ padding: "var(--s-card-padding, 24px)", background: "var(--s-surface)" }}>
          <fieldset style={{ border: "1px solid var(--s-border-muted)", padding: "16px", margin: 0 }}>
            <legend
              className="text-[11px] font-semibold uppercase tracking-wider font-[family:var(--s-font-mono)] px-2"
              style={{ color: "var(--s-text-muted)" }}
            >
              Configure
            </legend>
            <div className="flex flex-col gap-4">
              {safeSliders.map((s) => {
                const value = localValues[s.label] ?? s.value;
                return (
                sliderRenderer ? sliderRenderer(s) : (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="text-[13px] font-[family:var(--s-font-mono)] w-24 shrink-0" style={{ color: "var(--s-text-secondary)" }}>
                      {s.label}
                    </span>
                    <input
                      aria-label={s.label}
                      type="range"
                      min={s.min ?? 0}
                      max={s.max ?? 100}
                      step={s.step ?? 1}
                      value={value}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        if (!s.onChange) setLocalValues((current) => ({ ...current, [s.label]: next }));
                        s.onChange?.(next);
                      }}
                      className="h-[var(--s-control-hit-area,2.75rem)] flex-1 cursor-pointer accent-[var(--s-primary)]"
                    />
                    <span
                      className="text-[13px] font-[family:var(--s-font-mono)] w-20 text-right font-semibold tabular-nums"
                      style={{ color: "var(--s-text)" }}
                    >
                      {value} {s.unit}
                    </span>
                  </div>
                ));
              })}
            </div>
          </fieldset>
        </div>

        {/* Estimate panel */}
        <div style={{ padding: "var(--s-card-padding, 24px)", background: "var(--s-surface)", borderLeft: "1px solid var(--s-border)" }}>
          <fieldset style={{ border: "1px solid var(--s-border-muted)", padding: "16px", margin: 0 }}>
            <legend
              className="text-[11px] font-semibold uppercase tracking-wider font-[family:var(--s-font-mono)] px-2"
              style={{ color: "var(--s-text-muted)" }}
            >
              Monthly Estimate
            </legend>
            <div className="flex flex-col gap-4">
              {/* Brand bar */}
              <div>
                <div className="flex justify-between text-[13px] font-[family:var(--s-font-mono)] mb-1">
                  <span style={{ color: "var(--s-text-secondary)" }}>{safeEstimate.brandName}</span>
                  <span className="font-bold tabular-nums" style={{ color: "var(--s-text)" }}>
                    ${safeEstimate.brandCost.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 rounded-[var(--s-radius-full)]" style={{ background: "var(--s-border-muted)" }}>
                  <div
                    className="h-2 rounded-[var(--s-radius-full)]"
                    style={{
                      width: maxCost > 0 ? `${(safeEstimate.brandCost / maxCost) * 100}%` : "0%",
                      background: "var(--s-primary)",
                    }}
                  />
                </div>
              </div>

              {/* Competitor bar */}
              {safeEstimate.competitorCost != null && (
                <div>
                  <div className="flex justify-between text-[13px] font-[family:var(--s-font-mono)] mb-1">
                    <span style={{ color: "var(--s-text-muted)" }}>{safeEstimate.competitorName ?? "Competitor"}</span>
                    <span className="font-bold tabular-nums" style={{ color: "var(--s-text-muted)" }}>
                      ${safeEstimate.competitorCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 rounded-[var(--s-radius-full)]" style={{ background: "var(--s-border-muted)" }}>
                    <div
                      className="h-2 rounded-[var(--s-radius-full)]"
                      style={{
                        width: maxCost > 0 ? `${((safeEstimate.competitorCost ?? 0) / maxCost) * 100}%` : "0%",
                        background: "var(--s-error)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Savings note */}
              {safeEstimate.savingsNote && (
                <div
                  className="text-[12px] font-[family:var(--s-font-mono)] p-3"
                  style={{
                    background: "color-mix(in oklch, var(--s-success) 8%, transparent)",
                    color: "var(--s-success)",
                    border: "1px solid color-mix(in oklch, var(--s-success) 20%, transparent)",
                  }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-1">Idle Savings</div>
                  {safeEstimate.savingsNote}
                </div>
              )}

              {/* Total savings */}
              {savings > 0 && (
                <div
                  className="p-3 text-center"
                  style={{
                    background: "color-mix(in oklch, var(--s-success) 6%, transparent)",
                    border: "1px solid color-mix(in oklch, var(--s-success) 15%, transparent)",
                  }}
                >
                  <div className="text-[10px] font-[family:var(--s-font-mono)] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--s-text-muted)" }}>
                    You Save
                  </div>
                  <span
                    className="font-[family:var(--s-font-mono)] tabular-nums"
                    style={{ fontSize: 28, fontWeight: 700, color: "var(--s-success)" }}
                  >
                    ${savings.toFixed(2)}
                  </span>
                  <span className="ml-2 text-[12px] font-[family:var(--s-font-mono)]" style={{ color: "var(--s-success)" }}>
                    {savingsPct}% /mo
                  </span>
                </div>
              )}
            </div>
          </fieldset>
        </div>
      </div>
    );
  },
);
