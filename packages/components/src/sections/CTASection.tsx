"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface CTAAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export interface CTASectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  actions?: CTAAction[];
  variant?: "centered" | "split";
  media?: ReactNode;
}

export const CTASection = forwardRef<HTMLElement, CTASectionProps>(
  function CTASection({ title, description, actions, variant, media, className, children, ...props }, ref) {
    const columns = variant === "split"
      ? "minmax(0, 1fr) minmax(0, 1fr)"
      : variant === "centered"
        ? "minmax(0, 1fr)"
        : "var(--s-cta-grid-columns, minmax(0, 1fr))";
    const textAlign = variant === "split"
      ? "left"
      : variant === "centered"
        ? "center"
        : "var(--s-cta-text-align, center)";
    const actionsJustify = variant === "split"
      ? "flex-start"
      : variant === "centered"
        ? "center"
        : "var(--s-cta-actions-justify, center)";
    const descriptionMargin = variant === "split"
      ? "0"
      : variant === "centered"
        ? "auto"
        : "var(--s-cta-description-margin-inline, auto)";

    return (
      <section
        ref={ref}
        data-slot="cta-section"
        className={cn(
          "py-[var(--s-cta-padding-y,80px)]",
          className,
        )}
        {...props}
      >
        <div className="mx-auto max-w-[var(--s-cta-max-width,var(--s-content-max,1200px))] px-[var(--s-cta-padding-x,var(--s-page-margin,24px))]">
          <div
            className="grid grid-cols-1 items-center gap-[var(--s-cta-split-gap,48px)] md:grid-cols-[var(--sigil-cta-columns)]"
            style={{ "--sigil-cta-columns": columns } as CSSProperties}
          >
            <div style={{ textAlign } as CSSProperties}>
              <h2 className="font-[family-name:var(--s-font-display)] text-[var(--s-cta-title-size,clamp(1.5rem,4vw,2.25rem))] font-[var(--s-heading-weight,700)] leading-[1.1] tracking-[var(--s-heading-tracking,-0.025em)] text-[var(--s-text)]">
                {title}
              </h2>
              {description && (
                <p className="mt-[var(--s-cta-description-gap,12px)] max-w-[var(--s-cta-description-max-width,32rem)] text-base leading-relaxed text-[var(--s-text-muted)]" style={{ marginInline: descriptionMargin }}>
                  {description}
                </p>
              )}
              {actions && actions.length > 0 && (
                <div className="mt-[var(--s-cta-actions-margin-top,32px)] flex gap-[var(--s-cta-actions-gap,12px)] flex-wrap" style={{ justifyContent: actionsJustify }}>
                  {actions.map((action, i) => (
                    <a
                      key={i}
                      href={action.href ?? "#"}
                      onClick={action.onClick}
                      className={cn(
                        "inline-flex items-center gap-2 px-[var(--s-cta-action-padding-x,24px)] py-[var(--s-cta-action-padding-y,12px)] text-sm font-medium rounded-[var(--s-radius-button,0px)]",
                        "transition-all duration-[var(--s-duration-fast,150ms)]",
                        action.variant === "secondary" || i > 0
                          ? "bg-transparent text-[var(--s-text)] border border-[color:var(--s-border)] hover:bg-[var(--s-surface)]"
                          : "bg-[var(--s-primary)] text-[var(--s-primary-contrast)] hover:brightness-110",
                      )}
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {(media || children) && (
              <div>
                {media ?? children}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  },
);
