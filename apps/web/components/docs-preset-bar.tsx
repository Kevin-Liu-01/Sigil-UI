"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Shuffle } from "@/components/icons";

const TOOLBAR_H = 44;
const EASE_SPRING = "cubic-bezier(0.32, 0.72, 0, 1)";

const PRESET_STRIP = [
  { name: "default", colors: ["#18181b", "#ffffff", "#0a0a0f", "#fafafa"] },
  { name: "sigil", colors: ["#9b99e8", "#0a0a0f", "#fafafa", "#141419"] },
  { name: "crux", colors: ["#dc2626", "#ffffff", "#000000", "#f5f5f5"] },
  { name: "alloy", colors: ["#b87333", "#f5f4f0", "#1c1c1c", "#e8e6e0"] },
  { name: "basalt", colors: ["#14b8a6", "#0f172a", "#e2e8f0", "#1e293b"] },
  { name: "forge", colors: ["#ea580c", "#1c1917", "#fafaf9", "#292524"] },
  { name: "onyx", colors: ["#a855f7", "#000000", "#f5f5f5", "#171717"] },
  { name: "flux", colors: ["#06b6d4", "#0a0a0f", "#fafafa", "#141419"] },
  { name: "kova", colors: ["#38bdf8", "#f8fafc", "#0f172a", "#e2e8f0"] },
  { name: "etch", colors: ["#15803d", "#faf8f5", "#292524", "#f0ede8"] },
  { name: "anvil", colors: ["#1e40af", "#e5e7eb", "#111827", "#f3f4f6"] },
  { name: "rivet", colors: ["#c2410c", "#fafaf9", "#18181b", "#f0f0f0"] },
  { name: "shard", colors: ["#7c3aed", "#fafafa", "#09090b", "#f0f0f0"] },
  { name: "rune", colors: ["#b45309", "#f5f0e8", "#1c1917", "#e8e0d4"] },
  { name: "fang", colors: ["#84cc16", "#000000", "#ffffff", "#111111"] },
  { name: "cobalt", colors: ["#2563eb", "#020617", "#e0e0ff", "#0a0a2f"] },
  { name: "strata", colors: ["#92400e", "#f5f2ed", "#292524", "#e8e4dd"] },
  { name: "brass", colors: ["#a16207", "#fefdf8", "#1c1917", "#f5f0e0"] },
  { name: "obsid", colors: ["#be123c", "#050505", "#d4d4d8", "#111111"] },
  { name: "axiom", colors: ["#2563eb", "#ffffff", "#000000", "#f5f5f5"] },
  { name: "glyph", colors: ["#dc2626", "#fafafa", "#09090b", "#f0f0f0"] },
  { name: "cipher", colors: ["#22c55e", "#000000", "#22c55e", "#0a0a0a"] },
  { name: "prism", colors: ["#8b5cf6", "#faf5ff", "#1e1b4b", "#f0e8ff"] },
  { name: "helix", colors: ["#059669", "#ffffff", "#064e3b", "#f0fdf4"] },
  { name: "hex", colors: ["#d946ef", "#0f0720", "#f5f3ff", "#1a1030"] },
  { name: "vex", colors: ["#ec4899", "#fef08a", "#000000", "#fef9c3"] },
  { name: "arc", colors: ["#7c3aed", "#f5f3ff", "#1e1b4b", "#ede9fe"] },
  { name: "dsgn", colors: ["#2563eb", "#ffffff", "#000000", "#f5f5f5"] },
  { name: "mrkr", colors: ["#eab308", "#fefce8", "#1c1917", "#fef9c3"] },
  { name: "noir", colors: ["#d97706", "#000000", "#e8e8e8", "#0a0a0a"] },
  { name: "dusk", colors: ["#a78bfa", "#1a1625", "#f5f3ff", "#2a2035"] },
  { name: "mono", colors: ["#525252", "#ffffff", "#000000", "#f5f5f5"] },
  { name: "vast", colors: ["#a0522d", "#faf6f0", "#2c1810", "#f0e8df"] },
  { name: "aura", colors: ["#8b5cf6", "#0f0a1e", "#e8e0f8", "#1a1030"] },
  { name: "field", colors: ["#15803d", "#ffffff", "#0a1a10", "#f0f4f0"] },
  { name: "clay", colors: ["#c2714f", "#faf5f0", "#2c1810", "#f0e4d8"] },
  { name: "sage", colors: ["#6b8f71", "#f8faf8", "#1a2e1a", "#e8f0e8"] },
  { name: "ink", colors: ["#6366f1", "#f0f0ff", "#0a0a2f", "#e0e0f8"] },
  { name: "sand", colors: ["#d4a030", "#faf8f0", "#2c2410", "#f0e8d0"] },
  { name: "plum", colors: ["#9b4dca", "#faf0ff", "#1a0a2f", "#e8d0f8"] },
  { name: "moss", colors: ["#2d6a4f", "#0a1a10", "#d0e8d0", "#0f2a18"] },
  { name: "coral", colors: ["#f87171", "#fff5f5", "#2c1010", "#ffe0e0"] },
  { name: "dune", colors: ["#c8a030", "#faf8f0", "#2c2410", "#f0e8d0"] },
  { name: "ocean", colors: ["#0891b2", "#0a1a2f", "#d0e8f8", "#0f2a3f"] },
  { name: "rose", colors: ["#e879a0", "#fff0f5", "#2c1018", "#ffe0ea"] },
];

let presetCache: Record<string, string> = {};

async function loadPresetCSS(name: string): Promise<string | null> {
  if (presetCache[name]) return presetCache[name];
  try {
    const [presetsModule, { compileToCss }] = await Promise.all([
      import("@sigil-ui/presets"),
      import("@sigil-ui/tokens"),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPresets = presetsModule.presets as any;
    const preset = allPresets[name];
    if (!preset?.tokens) return null;
    const css = compileToCss(preset.tokens, {
      darkSelector: '.dark, [data-theme="dark"]',
    });
    presetCache[name] = css;
    return css;
  } catch {
    return null;
  }
}

export function DocsPresetBar() {
  const [active, setActive] = useState("default");
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const injectCSS = useCallback((css: string) => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.setAttribute("data-sigil-preset", "true");
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = css;
  }, []);

  const applyPreset = useCallback(
    async (name: string) => {
      let css: string | null = null;
      if (name !== "default") {
        css = await loadPresetCSS(name);
        if (!css) return;
      }

      const apply = () => {
        if (name === "default") {
          if (styleRef.current) styleRef.current.textContent = "";
        } else {
          injectCSS(css!);
        }
      };

      if (typeof document.startViewTransition === "function") {
        const vt = document.startViewTransition(apply);
        vt.finished.catch(() => {});
      } else {
        document.documentElement.setAttribute("data-switching-preset", "");
        apply();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              document.documentElement.removeAttribute(
                "data-switching-preset",
              );
            }, 450);
          });
        });
      }
    },
    [injectCSS],
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sigil-docs-preset");
      if (saved && PRESET_STRIP.some((p) => p.name === saved)) {
        setActive(saved);
        applyPreset(saved);
      }
    } catch {}
  }, [applyPreset]);

  const handleClick = useCallback(
    (name: string) => {
      setActive(name);
      applyPreset(name);
      try {
        localStorage.setItem("sigil-docs-preset", name);
      } catch {}
    },
    [applyPreset],
  );

  const handleShuffle = useCallback(() => {
    const p =
      PRESET_STRIP[Math.floor(Math.random() * PRESET_STRIP.length)]!;
    handleClick(p.name);
  }, [handleClick]);

  return (
    <>
      <style>{BAR_STYLES}</style>
      <div className="docs-bar" aria-label="Preset switcher">
        {/* Logo mark */}
        <div className="docs-bar-logo">
          <svg viewBox="0 0 120 120" width={13} height={13}>
            <polygon
              points="0,0 56,0 56,32 40,40 40,56 0,56"
              fill="currentColor"
            />
            <polygon
              points="120,0 120,56 88,56 80,40 64,40 64,0"
              fill="currentColor"
            />
            <polygon
              points="0,120 0,64 32,64 40,80 56,80 56,120"
              fill="currentColor"
            />
            <polygon
              points="120,120 64,120 64,88 80,80 80,64 120,64"
              fill="var(--docs-bar-accent, currentColor)"
            />
          </svg>
        </div>

        <div className="docs-bar-divider" />

        {/* Preset strip */}
        <div ref={stripRef} className="docs-bar-strip">
          {PRESET_STRIP.map((p, i) => {
            const isActive = active === p.name;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => handleClick(p.name)}
                className={`docs-bar-pill${isActive ? " active" : ""}`}
                style={{
                  animationDelay: `${i * 12}ms`,
                }}
              >
                <span
                  className="docs-bar-swatch"
                  style={{ background: p.colors[0] }}
                />
                {p.name}
              </button>
            );
          })}
        </div>

        <div className="docs-bar-divider" />

        {/* Shuffle */}
        <button
          type="button"
          onClick={handleShuffle}
          className="docs-bar-btn"
          title="Random preset"
        >
          <Shuffle size={11} />
        </button>
      </div>
    </>
  );
}

const BAR_STYLES = `
  .docs-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${TOOLBAR_H}px;
    display: flex;
    align-items: center;
    padding: 0 6px;
    gap: 2px;
    z-index: 10001;
    background: rgba(20, 20, 25, 0.92);
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-family: var(--s-font-body, -apple-system, BlinkMacSystemFont, system-ui, sans-serif);
    --docs-bar-accent: #a0a0b0;
    --docs-bar-muted: #6a6a78;
    --docs-bar-surface: rgba(255, 255, 255, 0.04);
    --docs-bar-border: rgba(255, 255, 255, 0.08);
  }

  .docs-bar-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 8px;
    color: var(--docs-bar-accent);
    flex-shrink: 0;
  }

  .docs-bar-divider {
    width: 1px;
    height: 16px;
    background: var(--docs-bar-border);
    flex-shrink: 0;
    opacity: 0.6;
  }

  .docs-bar-strip {
    flex: 1;
    display: flex;
    gap: 1px;
    overflow-x: auto;
    overflow-y: hidden;
    min-width: 0;
    padding: 2px 4px;
    scrollbar-width: none;
  }
  .docs-bar-strip::-webkit-scrollbar { display: none; }

  .docs-bar-pill {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px 4px 6px;
    border-radius: 5px;
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: 10px;
    font-weight: 400;
    color: var(--docs-bar-muted);
    cursor: pointer;
    transition: all 100ms ease;
    white-space: nowrap;
    animation: docs-bar-pill-in 400ms ${EASE_SPRING} both;
  }
  .docs-bar-pill:hover {
    color: var(--docs-bar-accent);
    background: var(--docs-bar-surface);
  }
  .docs-bar-pill.active {
    background: rgba(255, 255, 255, 0.08);
    color: #e4e4e7;
    font-weight: 600;
  }

  .docs-bar-swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    border: 0.5px solid rgba(128, 128, 128, 0.15);
    flex-shrink: 0;
  }

  .docs-bar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 7px;
    border-radius: 6px;
    background: transparent;
    border: none;
    color: var(--docs-bar-muted);
    cursor: pointer;
    transition: all 120ms ease-out;
    flex-shrink: 0;
  }
  .docs-bar-btn:hover {
    color: var(--docs-bar-accent);
    background: var(--docs-bar-surface);
  }

  @keyframes docs-bar-pill-in {
    from { opacity: 0; transform: translateY(6px) scale(0.92); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
