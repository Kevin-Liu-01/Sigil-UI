"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  type TooltipProps,
} from "recharts";
import { cn } from "../utils";

export interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  children: ReactNode;
}

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  function ChartContainer({ height = 350, className, style, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="chart"
        style={{ height, ...style }}
        className={cn(
          "sigil-chart min-w-0 w-full text-[var(--s-text-muted)] text-[length:var(--s-size-sm)]",
          "[&_.recharts-cartesian-axis-tick-value]:fill-[var(--s-text-muted)]",
          "[&_.recharts-cartesian-grid_line]:stroke-[var(--s-border)]",
          "[&_.recharts-curve]:stroke-2",
          className,
        )}
        {...rest}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 1, height: 1 }}>
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    );
  },
);

export interface ChartTooltipProps extends Partial<TooltipProps<number, string>> {
  className?: string;
}

export function ChartTooltip({ className, ...rest }: ChartTooltipProps) {
  return (
    <RechartsTooltip
      cursor={{ stroke: "var(--s-border)", strokeWidth: 1 }}
      contentStyle={{
        backgroundColor: "var(--s-surface)",
        border: "var(--s-border-thin) var(--s-border-style) var(--s-border)",
        borderRadius: "var(--s-radius-md, 6px)",
        boxShadow: "var(--s-shadow-md)",
        padding: "var(--s-space-8) var(--s-space-12)",
        fontSize: "var(--s-size-sm)",
        color: "var(--s-text)",
      }}
      labelStyle={{ color: "var(--s-text-muted)", marginBottom: "var(--s-space-4)", fontWeight: "var(--s-weight-medium)" }}
      itemStyle={{ color: "var(--s-text)", padding: "var(--s-border-thin) 0" }}
      {...(rest as Record<string, unknown>)}
    />
  );
}

export interface ChartLegendProps {
  className?: string;
  verticalAlign?: "top" | "middle" | "bottom";
  align?: "left" | "center" | "right";
}

export function ChartLegend({
  className,
  verticalAlign = "bottom",
  align = "center",
}: ChartLegendProps) {
  return (
    <RechartsLegend
      verticalAlign={verticalAlign}
      align={align}
      wrapperStyle={{ paddingTop: "var(--s-space-12)", fontSize: "var(--s-size-sm)" }}
      formatter={(value: string) => (
        <span className={cn("text-[var(--s-text)] ml-1", className)}>{value}</span>
      )}
    />
  );
}
