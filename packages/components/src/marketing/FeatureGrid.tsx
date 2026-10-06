"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface FeatureRow {
  heading: string;
  bullets?: string[];
  quote?: string;
  visual: ReactNode;
}

export interface FeatureGridProps extends HTMLAttributes<HTMLDivElement> {
  rows: FeatureRow[];
  gap?: string;
  /** Min-height for each row in px. @default 320 */
  rowMinHeight?: number;
}

export const FeatureGrid = forwardRef<HTMLDivElement, FeatureGridProps>(
  function FeatureGrid({ rows, gap = "0", rowMinHeight = 240, className, ...rest }, ref) {
    const safeRows = rows ?? [];
    return (
      <div ref={ref} className={cn("min-w-0 w-full flex flex-col", className)} style={{ gap }} {...rest}>
        {safeRows.map((row, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-0"
              style={{
                borderTop: "1px solid var(--s-border-muted)",
                borderTopStyle: "var(--s-border-style, solid)" as any,
                minHeight: rowMinHeight,
              }}
            >
              <div
                className={cn("min-w-0 flex flex-col justify-center", reversed && "md:order-2")}
                style={{ padding: "var(--s-card-padding, 32px)" }}
              >
                <h3
                  style={{
                    fontFamily: "var(--s-font-display)",
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    fontWeight: 600,
                    color: "var(--s-text)",
                    lineHeight: 1.2,
                    margin: "0 0 16px 0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {row.heading}
                </h3>
                {row.bullets && (
                  <ul className="flex flex-col gap-2 mb-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {row.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-[14px]" style={{ color: "var(--s-text-secondary)", lineHeight: 1.5 }}>
                        <span style={{ color: "var(--s-text-subtle)", marginTop: 2 }}>&bull;</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {row.quote && (
                  <blockquote
                    className="text-[13px] italic"
                    style={{
                      color: "var(--s-text-muted)",
                      borderLeft: "2px solid var(--s-border)",
                      paddingLeft: 12,
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {row.quote}
                  </blockquote>
                )}
              </div>
              <div
                className={cn(
                  "min-w-0 flex items-center justify-center [&>svg]:max-w-full",
                  reversed && "md:order-1",
                )}
                style={{
                  padding: "var(--s-card-padding, 24px)",
                  background: "var(--s-surface)",
                  borderLeft: reversed ? undefined : "1px solid var(--s-border-muted)",
                  borderRight: reversed ? "1px solid var(--s-border-muted)" : undefined,
                }}
              >
                {row.visual}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
