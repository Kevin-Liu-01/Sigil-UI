"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface AnnouncementBarProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  badge?: string;
  message: string;
  href?: string;
  dismissible?: boolean;
}

export const AnnouncementBar = forwardRef<HTMLDivElement, AnnouncementBarProps>(
  function AnnouncementBar({ icon, badge, message, href, dismissible = true, className, ...rest }, ref) {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    const content = (
      <div className="flex items-center justify-center gap-3 w-full">
        {icon && <span className="shrink-0">{icon}</span>}
        {badge && (
          <span
            className="shrink-0 font-[family:var(--s-font-mono)] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5"
            style={{
              color: "var(--s-primary)",
              border: "1px solid color-mix(in oklch, var(--s-primary) 30%, transparent)",
              borderStyle: "var(--s-border-style, solid)",
            }}
          >
            {badge}
          </span>
        )}
        <span
          className="text-[13px] font-[family:var(--s-font-mono)] truncate"
          style={{ color: "var(--s-text-secondary)" }}
        >
          {message}
        </span>
        {href && (
          <span style={{ color: "var(--s-text-muted)" }} className="shrink-0">&rarr;</span>
        )}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn("relative flex items-center", dismissible && "pr-10", className)}
        style={{
          padding: "var(--s-space-2, 8px) var(--s-space-4, 16px)",
          borderBottom: "1px solid var(--s-border-muted)",
          borderBottomStyle: "var(--s-border-style, solid)" as any,
          background: "var(--s-surface)",
          transition: `all var(--s-duration-fast, 150ms)`,
        }}
        {...rest}
      >
        {href ? (
          <a href={href} className="flex items-center justify-center gap-3 w-full no-underline">
            {content}
          </a>
        ) : content}
        {dismissible && (
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute right-1 top-1/2 inline-flex size-[var(--s-control-hit-area,2.75rem)] -translate-y-1/2 items-center justify-center"
            style={{ color: "var(--s-text-muted)", background: "none", border: "none", cursor: "pointer" }}
            aria-label="Dismiss"
          >
            &times;
          </button>
        )}
      </div>
    );
  },
);
