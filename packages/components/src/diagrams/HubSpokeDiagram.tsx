"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface SpokeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  side: "left" | "right";
}

export interface HubSpokeDiagramProps extends HTMLAttributes<HTMLDivElement> {
  hub: { label: string; icon?: ReactNode; sublabel?: string };
  spokes: SpokeNode[];
  connector?: "solid" | "dashed" | "dashed-animated";
}

export const HubSpokeDiagram = forwardRef<HTMLDivElement, HubSpokeDiagramProps>(
  function HubSpokeDiagram({ hub, spokes, connector = "dashed", className, ...props }, ref) {
    const leftSpokes = spokes.filter(s => s.side === "left");
    const rightSpokes = spokes.filter(s => s.side === "right");

    const dashProps: Record<string, string | number> = {};
    if (connector !== "solid") dashProps.strokeDasharray = "6 4";

    const SpokeColumn = ({ items, side }: { items: SpokeNode[]; side: "left" | "right" }) => (
      <div className="min-w-0 flex flex-col gap-[var(--s-space-12)] justify-center">
        {items.map(spoke => (
          <div key={spoke.id} className={cn("min-w-0 flex items-center gap-[var(--s-space-4)]", side === "right" && "flex-row-reverse")}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--s-radius-md,0px)] border border-[color:var(--s-border)] bg-[var(--s-surface)] text-xs font-medium text-[var(--s-text)] [&_svg]:size-3.5 [&_svg]:text-[var(--s-text-muted)]">
              {spoke.icon}
              {spoke.label}
            </div>
            <svg width="40" height="4" viewBox="0 0 40 4" className="w-[var(--s-space-12)] shrink-0" aria-hidden>
              <line x1="0" y1="2" x2="40" y2="2" stroke="var(--s-border-strong, var(--s-border))" strokeWidth="1.5" {...dashProps} />
            </svg>
          </div>
        ))}
      </div>
    );

    return (
      <div
        ref={ref}
        data-slot="hub-spoke-diagram"
        className={cn("flex items-center justify-center gap-0", className)}
        {...props}
      >
        {leftSpokes.length > 0 && <SpokeColumn items={leftSpokes} side="left" />}

        <div className={cn(
          "relative flex flex-col items-center justify-center gap-1 px-[var(--s-space-8)] py-[var(--s-space-16)] mx-[var(--s-space-4)]",
          "rounded-[var(--s-radius-lg,0px)] border-2 border-[color:var(--s-primary)]",
          "bg-[var(--s-primary-muted)]",
          "min-w-0 text-center break-words",
        )}>
          {hub.icon && <div className="[&_svg]:size-6 text-[var(--s-primary)]">{hub.icon}</div>}
          <span className="text-sm font-bold text-[var(--s-text)]">{hub.label}</span>
          {hub.sublabel && <span className="text-[10px] text-[var(--s-text-muted)]">{hub.sublabel}</span>}
        </div>

        {rightSpokes.length > 0 && <SpokeColumn items={rightSpokes} side="right" />}
      </div>
    );
  },
);
