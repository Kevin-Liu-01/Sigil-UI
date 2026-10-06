"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface BlogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  accent?: string;
  subtitle?: string;
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  icon?: ReactNode;
}

export const BlogHeader = forwardRef<HTMLDivElement, BlogHeaderProps>(
  function BlogHeader({ title, accent, subtitle, categories, activeCategory, onCategoryChange, icon, className, ...rest }, ref) {
    const [localCategory, setLocalCategory] = useState(categories?.[0]);
    const selectedCategory = activeCategory ?? localCategory;
    return (
      <div ref={ref} className={cn("flex flex-col items-center text-center", className)} {...rest}>
        <h2
          style={{
            fontFamily: "var(--s-font-display)",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "var(--s-text)",
            lineHeight: 1.2,
            margin: "0 0 8px 0",
            textWrap: "balance",
          }}
        >
          {title}
          {accent && (
            <>
              <br />
              <span style={{ color: "var(--s-primary)", fontStyle: "italic" }}>
                {accent}
              </span>
            </>
          )}
          {icon && <span className="inline-block ml-2 align-middle">{icon}</span>}
        </h2>

        {subtitle && (
          <p className="text-sm mb-8" style={{ color: "var(--s-text-muted)", maxWidth: 480 }}>
            {subtitle}
          </p>
        )}

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-0 mt-4" style={{ border: "1px solid var(--s-border)", borderStyle: "var(--s-border-style, solid)" as any }}>
            {categories.map((cat, catIdx) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  if (activeCategory === undefined) setLocalCategory(cat);
                  onCategoryChange?.(cat);
                }}
                className="text-[11px] font-semibold uppercase tracking-wider font-[family:var(--s-font-mono)] px-4 py-2 cursor-pointer"
                style={{
                  color: selectedCategory === cat ? "var(--s-text)" : "var(--s-text-muted)",
                  background: selectedCategory === cat ? "var(--s-surface-elevated)" : "transparent",
                  border: "none",
                  borderRight: catIdx < categories!.length - 1 ? "1px solid var(--s-border)" : "none",
                  transition: `all var(--s-duration-fast, 150ms)`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
