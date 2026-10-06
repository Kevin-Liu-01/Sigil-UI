"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface BeforeAfterDiagramProps extends HTMLAttributes<HTMLDivElement> {
  beforeTitle?: string;
  afterTitle?: string;
  before: ReactNode;
  after: ReactNode;
}

export const BeforeAfterDiagram = forwardRef<HTMLDivElement, BeforeAfterDiagramProps>(
  function BeforeAfterDiagram({ beforeTitle = "Without", afterTitle = "With", before, after, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="before-after-diagram"
        className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}
        {...props}
      >
        <div className="flex flex-col rounded-[var(--s-radius-card,0px)] border border-[color:var(--s-error)]/30 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--s-error-muted)] border-b border-[color:var(--s-error)]/20">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--s-error)]" aria-hidden>
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-semibold text-[var(--s-text)]">{beforeTitle}</span>
          </div>
          <div className="p-4 bg-[var(--s-surface)] flex-1">
            {before}
          </div>
        </div>

        <div className="flex flex-col rounded-[var(--s-radius-card,0px)] border border-[color:var(--s-success)]/30 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--s-success-muted)] border-b border-[color:var(--s-success)]/20">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--s-success)]" aria-hidden>
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4.5 7l2 2 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-semibold text-[var(--s-text)]">{afterTitle}</span>
          </div>
          <div className="p-4 bg-[var(--s-surface)] flex-1">
            {after}
          </div>
        </div>
      </div>
    );
  },
);
