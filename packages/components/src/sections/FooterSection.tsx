"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterSectionProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  tagline?: string;
  groups: FooterLinkGroup[];
  socials?: { label: string; href: string; icon: ReactNode }[];
  copyright?: string;
  legal?: { label: string; href: string }[];
}

export const FooterSection = forwardRef<HTMLElement, FooterSectionProps>(
  function FooterSection({ logo, tagline, groups, socials, copyright, legal, className, ...props }, ref) {
    const safeGroups = groups ?? [];
    return (
      <footer
        ref={ref}
        data-slot="footer-section"
        className={cn("py-[var(--s-footer-padding-y,48px)]", className)}
        style={{ borderTop: "var(--s-footer-border-top, none)" }}
        {...props}
      >
        <div className="mx-auto max-w-[var(--s-content-max,1200px)] px-[var(--s-page-margin,24px)]">
          <div
            className="grid grid-cols-2 gap-x-[var(--s-footer-column-gap,32px)] gap-y-[var(--s-footer-row-gap,32px)] mb-12 md:[grid-template-columns:minmax(0,1.5fr)_repeat(var(--s-footer-columns,4),minmax(0,1fr))]"
          >
            <div className="col-span-2 md:col-span-1">
              {logo && <div className="mb-3 [&_svg]:h-[var(--s-footer-logo-height,24px)] [&_img]:h-[var(--s-footer-logo-height,24px)] [&_svg]:w-auto [&_img]:w-auto">{logo}</div>}
              {tagline && <p className="text-[length:var(--s-footer-link-size,0.875rem)] text-[var(--s-text-muted)] max-w-[var(--s-footer-tagline-max-width,20rem)]">{tagline}</p>}
              {socials && socials.length > 0 && (
                <div className="flex gap-[var(--s-footer-social-gap,12px)] mt-4">
                  {socials.map((s, i) => (
                    <a key={i} href={s.href} aria-label={s.label} className="text-[var(--s-text-muted)] hover:text-[var(--s-text)] transition-colors [&_svg]:size-[var(--s-footer-social-icon-size,20px)]">
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {safeGroups.map((group, i) => (
              <div key={i}>
                <h3 className="text-[length:var(--s-footer-group-title-size,0.875rem)] font-[var(--s-footer-group-title-weight,600)] text-[var(--s-text)] mb-3">{group.title}</h3>
                <ul className="flex flex-col gap-[var(--s-footer-link-gap,8px)]">
                  {group.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="inline-flex min-h-[var(--s-control-hit-area,2.75rem)] items-center text-[length:var(--s-footer-link-size,0.875rem)] text-[var(--s-text-muted)] hover:text-[var(--s-text)] transition-colors duration-[var(--s-duration-fast,150ms)]">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4" style={{ padding: "var(--s-footer-bottom-bar-padding, 24px 0)", borderTop: "var(--s-footer-bottom-bar-border, 1px solid var(--s-border-muted))" }}>
            {copyright && <span className="text-xs text-[var(--s-text-subtle)]">{copyright}</span>}
            {legal && legal.length > 0 && (
              <div className="flex gap-4">
                {legal.map((l, i) => (
                  <a key={i} href={l.href} className="text-xs text-[var(--s-text-subtle)] hover:text-[var(--s-text-muted)] transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  },
);
