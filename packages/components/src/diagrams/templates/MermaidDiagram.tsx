"use client";

import { forwardRef, useEffect, useId, useRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../utils";

function resolveToken(token: string): string {
  if (typeof window === "undefined") return "currentColor";
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!raw) return "currentColor";
  // Mermaid's color parser does not accept OKLCH, even though browsers do.
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) return raw;
  context.fillStyle = raw;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function getThemeVars() {
  return {
    primaryColor: resolveToken("--s-primary"),
    primaryTextColor: resolveToken("--s-primary-contrast"),
    secondaryTextColor: resolveToken("--s-text"),
    tertiaryTextColor: resolveToken("--s-text"),
    textColor: resolveToken("--s-text"),
    fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--s-font-body").trim(),
    primaryBorderColor: resolveToken("--s-border-strong"),
    lineColor: resolveToken("--s-chart-axis"),
    sectionBkgColor: resolveToken("--s-surface"),
    altSectionBkgColor: resolveToken("--s-surface-elevated"),
    gridColor: resolveToken("--s-chart-grid"),
    secondaryColor: resolveToken("--s-surface-elevated"),
    tertiaryColor: resolveToken("--s-surface"),
  };
}

export interface MermaidDiagramProps extends HTMLAttributes<HTMLDivElement> {
  chart: string;
  theme?: "dark" | "default";
}

export const MermaidDiagram = forwardRef<HTMLDivElement, MermaidDiagramProps>(
  function MermaidDiagram({ chart, theme = "dark", className, ...props }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const diagramId = useId().replace(/[^a-zA-Z0-9]/g, "");
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
      let cancelled = false;
      let revision = 0;

      async function render() {
        const version = ++revision;
        setError("");
        try {
          const mermaid = (await import("mermaid")).default;
          mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            themeVariables: { ...getThemeVars(), darkMode: theme === "dark" },
            flowchart: { curve: "basis" },
          });

          const id = `mermaid-${diagramId}-${version}`;
          const { svg: rendered } = await mermaid.render(id, chart);
          if (!cancelled && version === revision) setSvg(rendered);
        } catch (e) {
          if (!cancelled && version === revision) setError(e instanceof Error ? e.message : "Failed to render");
        }
      }

      render();
      const observer = new MutationObserver(() => { void render(); });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "data-sigil-preset-name", "style"] });
      return () => { cancelled = true; observer.disconnect(); };
    }, [chart, theme, diagramId]);

    return (
      <div
        ref={ref}
        data-slot="mermaid-diagram"
        className={cn(
          "w-full overflow-auto rounded-[var(--s-radius-card,0px)] border border-[color:var(--s-border)] p-4",
          theme === "dark" ? "bg-[var(--s-background)]" : "bg-[var(--s-surface)]",
          className,
        )}
        {...props}
      >
        {error ? (
          <p role="alert" className="text-xs text-[var(--s-error)]">Mermaid error: {error}</p>
        ) : svg ? (
          <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} className="[&_svg]:max-w-full" />
        ) : (
          <div className="flex items-center justify-center py-8 text-xs text-[var(--s-text-muted)]">Loading diagram...</div>
        )}
      </div>
    );
  },
);
