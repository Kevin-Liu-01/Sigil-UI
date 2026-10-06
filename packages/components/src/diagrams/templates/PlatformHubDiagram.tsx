"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";

export interface PlatformGroup {
  label: string;
  items: { label: string; icon?: ReactNode }[];
}

export interface PlatformHubDiagramProps extends HTMLAttributes<HTMLDivElement> {
  left: PlatformGroup[];
  center: { label: string; icon?: ReactNode; items?: { label: string; icon?: ReactNode }[] };
  right: PlatformGroup[];
}

export const PlatformHubDiagram = forwardRef<HTMLDivElement, PlatformHubDiagramProps>(
  function PlatformHubDiagram({ left, center, right, className, ...props }, ref) {
    const Column = ({ groups, side }: { groups: PlatformGroup[]; side: "left" | "right" }) => (
      <div className="flex flex-col gap-4 flex-1">
        {groups.map((g, i) => (
          <div key={i}>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--s-text-muted)] font-[family-name:var(--s-font-mono)] mb-2">{g.label}</div>
            <div className="flex flex-col gap-1.5">
              {g.items.map((item, j) => (
                <div key={j} className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--s-radius-sm,0px)] border border-[color:var(--s-border-muted)] bg-[var(--s-background)] text-[10px] text-[var(--s-text)] [&_svg]:size-3">
                  {item.icon}{item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <div
        ref={ref}
        data-slot="platform-hub-diagram"
        className={cn("@container w-full min-w-0 p-[var(--s-space-16)] rounded-[var(--s-radius-card,0px)] border border-[color:var(--s-border)] bg-[var(--s-surface)]", className)}
        style={{ backgroundImage: "radial-gradient(circle, var(--s-border-muted) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        {...props}
      >
        <div className="flex flex-col @sm:flex-row items-stretch gap-[var(--s-space-16)]">
          <Column groups={left} side="left" />

          <div className="flex justify-center items-center shrink-0 rotate-90 @sm:rotate-0">
            <svg width="24" height="2" aria-hidden><line x1="0" y1="1" x2="24" y2="1" stroke="var(--s-border-strong)" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
          </div>

          <div className="flex flex-col items-center justify-center px-4 py-3 rounded-[var(--s-radius-lg,0px)] border-2 border-[color:var(--s-primary)] bg-[var(--s-primary-muted)] min-w-[120px]">
            {center.icon && <div className="[&_svg]:size-6 text-[var(--s-primary)] mb-2">{center.icon}</div>}
            <div className="text-xs font-bold text-[var(--s-text)] mb-2">{center.label}</div>
            {center.items && (
              <div className="flex flex-wrap gap-1 justify-center">
                {center.items.map((item, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded-[var(--s-radius-sm,0px)] bg-[var(--s-background)] border border-[color:var(--s-border-muted)] text-[9px] text-[var(--s-text-muted)]">{item.label}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center items-center shrink-0 rotate-90 @sm:rotate-0">
            <svg width="24" height="2" aria-hidden><line x1="0" y1="1" x2="24" y2="1" stroke="var(--s-border-strong)" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
          </div>

          <Column groups={right} side="right" />
        </div>
      </div>
    );
  },
);
