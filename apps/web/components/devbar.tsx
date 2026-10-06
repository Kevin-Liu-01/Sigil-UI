"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import {
  Activity,
  memo,
  useId,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  Shuffle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Monitor,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  X,
  RotateCcw,
  Download,
  Save,
  Trash2,
  MessageSquare,
  Send,
  Square,
  Volume2,
  VolumeX,
} from "@/components/icons";
import {
  Slider as SigilSlider,
  Switch as SigilSwitch,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SegmentedControl,
  SegmentedControlItem,
} from "@sigil-ui/components";
import {
  useSigilActions,
  useSigilActivePreset,
  useSigilTokens,
} from "./sandbox/token-provider";
import { converter, formatCss, formatHex } from "culori";
import { useSigilSound } from "./sound-provider";
import { SpringCurveEditor, EasingCurveEditor, SubSection } from "./studio-editors";
import { useStudioControlValue } from "./studio-control-value";
import { FontDockTool } from "./font-dock-tool";
import { CURATED_DISPLAY_FONTS } from "@/lib/font-library";
import { STUDIO_PRESETS as PRESET_DATA } from "@/lib/studio-presets";
import { resolveSigilTokens } from "@sigil-ui/tokens";
import type { SigilTokens, GutterPattern, TokenPatch } from "@sigil-ui/tokens";

/* ================================================================== */
/*  Devbar State Context                                               */
/* ================================================================== */

export type DockPosition = "left" | "right";
export type ToolbarDock = "top" | "right" | "bottom" | "left";

const TOOLBAR_DOCK_KEY = "sigil-toolbar-dock";
const TOOLBAR_DOCK_ORDER: ToolbarDock[] = ["bottom", "top", "left", "right"];

type DevBarState = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  canvasMode: boolean;
  setCanvasMode: (v: boolean) => void;
  frameVisible: boolean;
  dock: DockPosition;
  setDock: (d: DockPosition) => void;
  toolbarDock: ToolbarDock;
  setToolbarDock: (d: ToolbarDock) => void;
  cycleToolbarDock: () => void;
  agentOpen: boolean;
  setAgentOpen: (v: boolean) => void;
  enterCanvas: () => void;
  exitCanvas: () => void;
};

const DevBarContext = createContext<DevBarState | null>(null);

export function useDevBar() {
  return useContext(DevBarContext);
}

const PHASE_DELAY = 300;

function isToolbarDock(v: unknown): v is ToolbarDock {
  return v === "top" || v === "right" || v === "bottom" || v === "left";
}

export function DevBarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [canvasMode, setCanvasMode] = useState(true);
  const [frameVisible, setFrameVisible] = useState(true);
  const [dock, setDock] = useState<DockPosition>("left");
  const [toolbarDock, setToolbarDockState] = useState<ToolbarDock>("bottom");
  const [agentOpen, setAgentOpen] = useState(false);
  const exitTimer1 = useRef<ReturnType<typeof setTimeout>>(undefined);
  const exitTimer2 = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Restore toolbar dock preference from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TOOLBAR_DOCK_KEY);
      if (isToolbarDock(saved)) setToolbarDockState(saved);
    } catch { /* ignore */ }
  }, []);

  const setToolbarDock = useCallback((d: ToolbarDock) => {
    setToolbarDockState(d);
    try { localStorage.setItem(TOOLBAR_DOCK_KEY, d); } catch { /* ignore */ }
  }, []);

  const cycleToolbarDock = useCallback(() => {
    setToolbarDockState((cur) => {
      const next = TOOLBAR_DOCK_ORDER[
        (TOOLBAR_DOCK_ORDER.indexOf(cur) + 1) % TOOLBAR_DOCK_ORDER.length
      ]!;
      try { localStorage.setItem(TOOLBAR_DOCK_KEY, next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const clearTimers = useCallback(() => {
    clearTimeout(exitTimer1.current);
    clearTimeout(exitTimer2.current);
  }, []);

  const enterCanvas = useCallback(() => {
    clearTimers();
    setSidebarOpen(false);
    setCanvasMode(true);
    setFrameVisible(true);
  }, [clearTimers]);

  const exitCanvas = useCallback(() => {
    clearTimers();
    setSidebarOpen(false);
    setAgentOpen(false);
    exitTimer1.current = setTimeout(() => {
      setFrameVisible(false);
      exitTimer2.current = setTimeout(() => setCanvasMode(false), PHASE_DELAY);
    }, PHASE_DELAY);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setSidebarOpen(false);
      document.querySelector<HTMLButtonElement>('.devbar-toolbar button[aria-label="Studio"]')?.focus();
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [sidebarOpen]);


  const ctx = useMemo<DevBarState>(
    () => ({ sidebarOpen, setSidebarOpen, canvasMode, setCanvasMode, frameVisible, dock, setDock, toolbarDock, setToolbarDock, cycleToolbarDock, agentOpen, setAgentOpen, enterCanvas, exitCanvas }),
    [sidebarOpen, canvasMode, frameVisible, dock, toolbarDock, setToolbarDock, cycleToolbarDock, agentOpen, enterCanvas, exitCanvas],
  );

  return <DevBarContext.Provider value={ctx}>{children}</DevBarContext.Provider>;
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const SIDEBAR_W = 260;
const SIDEBAR_W_MOBILE = 280;
const AGENT_W = 340;
const TOOLBAR_H = 44;
const MOBILE_BP = 768;



const DISPLAY_FONTS = CURATED_DISPLAY_FONTS;

const MONO_FONTS = ["PP Fraktion Mono", "PP Supply Mono", "PP Neue Bit"];

const GUTTER_PATTERNS: GutterPattern[] = [
  "grid", "dots", "crosshatch", "diagonal", "diamond", "horizontal",
  "horizontal-thin", "horizontal-fine", "horizontal-wide",
  "hexagon", "triangle", "zigzag",
  "checker", "plus", "brick", "wave", "none",
];

const SHADOW_OPTIONS = ["none", "sm", "md", "lg", "xl"] as const;
const BORDER_STYLES = ["solid", "dashed", "dotted", "none"] as const;
const CELL_BG_OPTIONS = ["none", "surface", "alternate"] as const;
const CONTENT_ALIGN = ["center", "left", "wide"] as const;
const HERO_ALIGN = ["center", "left", "full-bleed"] as const;
const NAVBAR_ALIGN = ["full", "content", "inset"] as const;

const COMPONENT_LIST = [
  "Hero", "Button", "Card", "Badge", "Input", "KPI", "Terminal",
  "CodeBlock", "Grid", "Stack", "Diamond", "Hexagon", "Triangle",
  "Box3D", "Card3D", "Pricing", "CTA", "FeatureFrame", "Timeline",
  "Accordion", "Table", "Tabs", "LoadingSpinner", "Avatar", "Progress",
];

/* ================================================================== */
/*  Mobile detection                                                   */
/* ================================================================== */

function useIsMobile(breakpoint = MOBILE_BP) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

/* ================================================================== */
/*  Custom Preset Persistence                                          */
/* ================================================================== */

type CustomPreset = { name: string; tokens: SigilTokens; createdAt: number };

const STORAGE_KEY = "sigil-custom-presets";
const MAX_CUSTOM_PRESETS = 25;
const MAX_CUSTOM_PRESET_BYTES = 2_000_000;
const SAFE_CUSTOM_PRESET_NAME = /^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/;

function loadCustomPresets(): CustomPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > MAX_CUSTOM_PRESET_BYTES) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid: CustomPreset[] = [];
    for (const entry of parsed.slice(-MAX_CUSTOM_PRESETS)) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
      const candidate = entry as Record<string, unknown>;
      const name = typeof candidate.name === "string"
        ? candidate.name.trim().toLowerCase()
        : "";
      if (!SAFE_CUSTOM_PRESET_NAME.test(name) || PRESET_DATA.some(preset => preset.name === name)) continue;
      if (!candidate.tokens || typeof candidate.tokens !== "object") continue;
      const resolution = resolveSigilTokens(candidate.tokens);
      // Missing fields are expected when a saved preset predates a schema
      // expansion; repair those from canonical defaults. Corrupt, unknown,
      // or unsafe values are never admitted back into Studio state.
      if (resolution.issues.some((issue) => issue.code !== "missing-key")) continue;
      valid.push({
        name,
        tokens: resolution.tokens,
        createdAt: typeof candidate.createdAt === "number" && Number.isFinite(candidate.createdAt)
          ? candidate.createdAt
          : Date.now(),
      });
    }
    return valid;
  } catch { return []; }
}

function saveCustomPresetsToStorage(presets: CustomPreset[]): boolean {
  try {
    const safe = presets
      .filter((preset) => SAFE_CUSTOM_PRESET_NAME.test(preset.name))
      .slice(-MAX_CUSTOM_PRESETS);
    const serialized = JSON.stringify(safe);
    if (serialized.length > MAX_CUSTOM_PRESET_BYTES) return false;
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch { return false; }
}

/* ================================================================== */
/*  Token Helpers                                                      */
/* ================================================================== */

function readStr(obj: Record<string, unknown> | undefined, key: string, fallback: string): string {
  const v = obj?.[key];
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "dark" in (v as Record<string, unknown>))
    return String((v as Record<string, string>).dark);
  return fallback;
}

function readNum(obj: Record<string, unknown> | undefined, key: string, fallback: number): number {
  const raw = obj?.[key];
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const value = raw.trim();
    const clamp = value.match(/^clamp\((.+)\)$/);
    const numericValue = clamp ? clamp[1]?.split(",").at(-1)?.trim() ?? value : value;
    const parsed = parseFloat(numericValue);
    if (!Number.isFinite(parsed)) return fallback;
    return numericValue.endsWith("rem") ? parsed * 16 : parsed;
  }
  return fallback;
}

function readBool(obj: Record<string, unknown> | undefined, key: string, fallback: boolean): boolean {
  const raw = obj?.[key];
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string") return raw === "true" || raw === "1";
  return fallback;
}

function readEnabledValue(obj: Record<string, unknown> | undefined, key: string, fallback: boolean): boolean {
  const raw = obj?.[key];
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string") return raw.trim() !== "" && raw !== "none" && raw !== "0";
  return fallback;
}

function toCssColor(value: unknown, dark = true): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const themed = obj[dark ? "dark" : "light"];
    if (typeof themed === "string") return themed;
    if ("light" in obj && typeof obj.light === "string") return obj.light;
  }
  return "#888888";
}

let _hexCanvas: HTMLCanvasElement | null = null;
function cssToHex(css: string): string {
  if (typeof document !== "undefined" && css.includes("var(")) {
    const style = getComputedStyle(document.documentElement);
    for (let i = 0; i < 4 && css.includes("var("); i++) {
      css = css.replace(/var\((--[\w-]+)(?:,\s*([^()]+))?\)/g, (_, name, fallback) => style.getPropertyValue(name).trim() || fallback || "transparent");
    }
  }
  const converted = formatHex(css);
  if (converted) return converted;
  if (typeof document === "undefined") return "#888888";
  if (!_hexCanvas) _hexCanvas = document.createElement("canvas");
  const ctx = _hexCanvas.getContext("2d");
  if (!ctx) return "#888888";
  ctx.fillStyle = "#000000";
  ctx.fillStyle = css;
  const parsed = ctx.fillStyle;
  if (parsed.startsWith("#")) return parsed;
  const m = parsed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) {
    const [, r, g, b] = m;
    return `#${[r, g, b].map(x => Number(x).toString(16).padStart(2, "0")).join("")}`;
  }
  return "#888888";
}

/* ================================================================== */
/*  Micro Controls                                                     */
/* ================================================================== */

const FONT_BODY = "var(--s-font-body)";
const FONT_DISPLAY = "var(--s-font-display)";
const FONT_MONO = '"PP Fraktion Mono", ui-monospace, monospace';
const FONT = FONT_BODY;
const toOklch = converter("oklch");

function SectionHeader({ title, open, onToggle, contentId }: {
  title: string; open: boolean; onToggle: () => void; contentId: string;
}) {
  return (
    <button
      type="button" onClick={onToggle} aria-expanded={open} aria-controls={contentId}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "8px 0",
        background: "none", border: "none", cursor: "pointer",
      }}
    >
      <span style={{
        fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 600,
        color: "var(--db-text2)", textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}>
        {title}
      </span>
      <ChevronDown
        size={10}
        style={{
          color: "var(--db-muted)",
          transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}
      />
    </button>
  );
}

function Section({ title, defaultOpen, children }: {
  title: string; defaultOpen?: boolean; children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const contentId = useId();
  return (
    <div data-studio-section={title} style={{ borderBottom: "1px solid var(--db-border)", padding: "0 16px" }}>
      <SectionHeader title={title} open={open} contentId={contentId} onToggle={() => setOpen(v => !v)} />
      {open && <div id={contentId} style={{ paddingBottom: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
      </div>}
    </div>
  );
}

const StudioRowLabel = createContext<string | undefined>(undefined);

function Row({ label, value, children }: { label: string; value?: string; children: ReactNode }) {
  return (
    <StudioRowLabel.Provider value={label}><div data-studio-row={label} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 26 }}>
      <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: "var(--db-muted)", width: 82, flexShrink: 0, textTransform: "capitalize" }}>{label}</span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {value && <span style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 500, color: "var(--db-text2)", width: 44, textAlign: "right", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{value}</span>}
    </div></StudioRowLabel.Provider>
  );
}

function Slider({ value, min, max, step, onChange }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const label = useContext(StudioRowLabel);
  const [draft, update] = useStudioControlValue(value, onChange);
  return <SigilSlider aria-label={label} value={[draft]} min={Math.min(min, value)} max={Math.max(max, value)} step={step} onValueChange={([v]) => { if (v !== undefined) update(v); }} className="w-full" />;
}

function ColorInput({ value, onChange, label = "color" }: { value: unknown; onChange: (v: string) => void; label?: string }) {
  const { resolvedTheme } = useTheme();
  const css = toCssColor(value, resolvedTheme === "dark");
  const hex = cssToHex(css);
  return (
    <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
      <div style={{ width: 24, height: 24, borderRadius: 4, background: css, border: "1px solid var(--db-border)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }} />
      <input aria-label={`${label} color`} type="color" value={hex} onChange={(e) => onChange(e.target.value)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", border: "none", padding: 0 }} />
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const label = useContext(StudioRowLabel);
  const [draft, update] = useStudioControlValue(checked, onChange);
  return <SigilSwitch aria-label={label} size="sm" checked={draft} onCheckedChange={update} />;
}

function Segmented<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  const label = useContext(StudioRowLabel);
  return (
    <SegmentedControl aria-label={label} value={value} onValueChange={(v) => onChange(v as T)} className="w-full text-xs">
      {options.map((opt) => <SegmentedControlItem key={opt} value={opt} className="text-[10px] px-2 py-0.5">{opt}</SegmentedControlItem>)}
    </SegmentedControl>
  );
}

function useDevbarPortalStyle(): React.CSSProperties {
  const root = typeof document !== "undefined" ? document.querySelector(".devbar-root") : null;
  const isDark = root?.closest(".dark") || root?.closest("[data-theme='dark']");
  return {
    ["--s-primary" as string]: isDark ? "#e4e4e7" : "#18181b",
    ["--s-background" as string]: isDark ? "#0a0a0f" : "#ffffff",
    ["--s-surface" as string]: isDark ? "#141419" : "#f8f8fa",
    ["--s-border" as string]: isDark ? "#2c2c3c" : "#d0d0d8",
    ["--s-border-style" as string]: "solid",
    ["--s-text" as string]: isDark ? "#fafafa" : "#0a0a0f",
    ["--s-text-muted" as string]: isDark ? "#8888a0" : "#8a8a95",
    ["--s-radius-md" as string]: "6px",
    ["--s-card-radius" as string]: "6px",
    ["--s-shadow-lg" as string]: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.12)",
    ["--s-duration-fast" as string]: "150ms",
    background: isDark ? "#141419" : "#f8f8fa",
    borderColor: isDark ? "#2c2c3c" : "#d0d0d8",
    color: isDark ? "#fafafa" : "#0a0a0f",
    zIndex: 10002,
  };
}

function SelectField({ value, options, onChange, showFont }: { value: string; options: readonly string[]; onChange: (v: string) => void; showFont?: boolean }) {
  const portalStyle = useDevbarPortalStyle();
  const label = useContext(StudioRowLabel);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className="h-7 text-[11px] px-2"
        style={showFont ? { fontFamily: `"${value}", system-ui, sans-serif` } : undefined}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]" style={portalStyle}>
        {options.map((o) => (
          <SelectItem
            key={o}
            value={o}
            className="text-[11px] pl-6"
            style={showFont ? { fontFamily: `"${o}", system-ui, sans-serif` } : undefined}
          >
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ChipButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={{
      padding: "3px 8px", borderRadius: 4,
      border: active ? "1px solid var(--db-accent)" : "1px solid var(--db-border)",
      background: active ? "var(--db-accent-dim)" : "transparent",
      fontFamily: FONT, fontSize: 9, fontWeight: active ? 600 : 400,
      color: active ? "var(--db-accent)" : "var(--db-muted)",
      cursor: "pointer", transition: "background-color 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out", lineHeight: 1.4,
    }}>{label}</button>
  );
}

/* ================================================================== */
/*  Preset Strip (with custom presets)                                 */
/* ================================================================== */

const PresetStrip = memo(function PresetStrip({ activePreset, onSelect, onRandomize, customPresets, onDeleteCustom }: {
  activePreset: string; onSelect: (name: string) => void; onRandomize: () => void;
  customPresets: CustomPreset[]; onDeleteCustom: (name: string) => void;
}) {
  return (
    <div style={{ padding: "8px 16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 600, color: "var(--db-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Presets</span>
        <button type="button" onClick={onRandomize} title="Random preset" style={{
          display: "flex", alignItems: "center", gap: 3, padding: "2px 6px", borderRadius: 4,
          border: "1px solid var(--db-border)", background: "none", color: "var(--db-muted)",
          fontFamily: FONT, fontSize: 8, fontWeight: 500, cursor: "pointer", transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
        }}><Shuffle size={8} />Random</button>
      </div>
      <div className="devbar-scroll" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, maxHeight: "min(240px, 28dvh)", overflowY: "auto", marginBottom: 8 }}>
        {PRESET_DATA.map((p) => {
          const active = activePreset.replace("*", "") === p.name;
          return (
            <button key={p.name} type="button" aria-label={p.label} aria-pressed={active} onClick={() => onSelect(p.name)} style={{
              padding: "6px 7px 5px", borderRadius: 5, textAlign: "left",
              border: active ? "1.5px solid var(--db-accent)" : "1px solid var(--db-border)",
              background: active ? "var(--db-accent-dim)" : "transparent",
              cursor: "pointer", transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                {p.colors.map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c, border: "0.5px solid rgba(128,128,128,0.12)" }} />)}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "var(--db-accent)" : "var(--db-text)", lineHeight: 1.2 }}>{p.label}</span>
                <span style={{ fontFamily: FONT, fontSize: 9, color: "var(--db-muted)", opacity: 1 }}>{p.mood}</span>
              </div>
            </button>
          );
        })}
        {customPresets.map((cp) => {
          const active = activePreset.replace("*", "") === cp.name;
          return (
            <div key={cp.name} style={{ position: "relative" }}>
              <button type="button" aria-label={cp.name} aria-pressed={active} onClick={() => onSelect(cp.name)} style={{
                width: "100%", padding: "6px 7px 5px", borderRadius: 5, textAlign: "left",
                border: active ? "1.5px solid var(--db-accent)" : "1px solid var(--db-border)",
                background: active ? "var(--db-accent-dim)" : "transparent",
                cursor: "pointer", transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
              }}>
                <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "var(--db-accent)" : "var(--db-text)", lineHeight: 1.2 }}>{cp.name}</span>
                <span style={{ fontFamily: FONT, fontSize: 9, color: "var(--db-muted)", opacity: 1, marginLeft: 4 }}>custom</span>
              </button>
              <button type="button" aria-label={`Delete ${cp.name}`} onClick={(e) => { e.stopPropagation(); onDeleteCustom(cp.name); }} style={{
                position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: 7,
                background: "var(--db-surface)", border: "1px solid var(--db-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--db-muted)", padding: 0,
              }}><X size={7} /></button>
            </div>
          );
        })}
      </div>
      <div style={{ height: 1, background: "var(--db-border)", marginLeft: -16, marginRight: -16 }} />
    </div>
  );
});

/* ================================================================== */
/*  Sidebar Content                                                    */
/* ================================================================== */

function SidebarContent({ onClose }: { onClose: () => void }) {
  const { tokens, activePreset, setPreset, setTokens, patchTokenBatch, patchTokens, getSnapshot } = useSigilTokens();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play, setActivePreset: setSoundPreset } = useSigilSound();

  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [savingName, setSavingName] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => { setCustomPresets(loadCustomPresets()); }, []);

  const handlePreset = useCallback(async (name: string) => {
    const custom = customPresets.find(cp => cp.name === name);
    const result = custom
      ? setTokens(custom.tokens, custom.name)
      : await setPreset(name);
    if (!result.ok) return;
    setSoundPreset(name);
    play("preset");
  }, [setPreset, setTokens, setSoundPreset, play, customPresets]);

  const handleReset = useCallback(async () => {
    const name = getSnapshot().activePreset.replace("*", "");
    const custom = customPresets.find((preset) => preset.name === name);
    const result = custom
      ? setTokens(custom.tokens, custom.name)
      : await setPreset(name);
    if (!result.ok) return;
    play("preset");
  }, [getSnapshot, customPresets, setPreset, setTokens, play]);

  const handleExport = useCallback(async () => {
    try {
      const style = document.querySelector<HTMLStyleElement>("style[data-sigil-tokens]");
      const css = style?.sheet
        ? Array.from(style.sheet.cssRules, rule => rule.cssText).join("\n")
        : style?.textContent;
      if (!css) throw new Error("No styles to export yet.");
      await navigator.clipboard.writeText(css);
      setNotice("CSS copied.");
      play("success");
    } catch {
      setNotice("Could not copy CSS. Allow clipboard access and try again.");
    }
  }, [play]);

  const handleSave = useCallback(() => {
    if (savingName === null) { setSavingName(activePreset.replace("*", "") + "-custom"); return; }
    const name = savingName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
    if (!SAFE_CUSTOM_PRESET_NAME.test(name)) { setNotice("Enter a preset name using letters or numbers."); return; }
    if (PRESET_DATA.some(preset => preset.name === name)) { setNotice("Choose a name different from a built-in preset."); return; }
    const next = [...customPresets.filter(p => p.name !== name), { name, tokens: getSnapshot().tokens, createdAt: Date.now() }];
    if (!saveCustomPresetsToStorage(next)) { setNotice("Could not save this preset. Browser storage may be full."); return; }
    setCustomPresets(next.slice(-MAX_CUSTOM_PRESETS));
    setTokens(getSnapshot().tokens, name);
    setSavingName(null);
    setNotice(`Saved ${name}.`);
    play("success");
  }, [savingName, customPresets, getSnapshot, setTokens, activePreset, play]);

  const handleDeleteCustom = useCallback((name: string) => {
    const next = customPresets.filter(p => p.name !== name);
    if (!saveCustomPresetsToStorage(next)) return;
    setCustomPresets(next);
    if (getSnapshot().activePreset.replace("*", "") === name) void setPreset("default");
    setNotice(`Deleted ${name}.`);
  }, [customPresets, getSnapshot, setPreset]);

  const patch = useCallback(
    (cat: string, key: string, value: unknown) => patchTokens(cat as keyof SigilTokens, key, value),
    [patchTokens],
  );
  const patchMany = useCallback(
    (patches: readonly TokenPatch[]) => patchTokenBatch(patches),
    [patchTokenBatch],
  );

  const c = tokens.colors as Record<string, unknown> | undefined;
  const t = tokens.typography as Record<string, unknown> | undefined;
  const sp = tokens.spacing as Record<string, unknown> | undefined;
  const r = tokens.radius as Record<string, unknown> | undefined;
  const b = tokens.borders as Record<string, unknown> | undefined;
  const bw = (b?.["width"] && typeof b["width"] === "object" ? b["width"] : {}) as Record<string, unknown>;
  const sh = tokens.shadows as Record<string, unknown> | undefined;
  const m = tokens.motion as Record<string, unknown> | undefined;
  const md = (m?.["duration"] && typeof m["duration"] === "object" ? m["duration"] : {}) as Record<string, unknown>;
  const cards = tokens.cards as Record<string, unknown> | undefined;
  const buttons = tokens.buttons as Record<string, unknown> | undefined;
  const grid = tokens.sigil as Record<string, unknown> | undefined;
  const gridVisuals = tokens.gridVisuals as Record<string, unknown> | undefined;
  const layout = tokens.layout as Record<string, unknown> | undefined;
  const nav = tokens.navigation as Record<string, unknown> | undefined;
  const align = (tokens as Record<string, unknown>).alignment as Record<string, unknown> | undefined;

  const currentGutterPattern = (tokens.sigil?.["gutter-pattern"] as GutterPattern) ?? "grid";
  const currentMarginPattern = (tokens.sigil?.["margin-pattern"] as GutterPattern) ?? "horizontal";

  const patchColor = useCallback((key: string, value: string) => {
    const normalizedColor = formatCss(toOklch(value)) ?? value;
    const current = (getSnapshot().tokens.colors as Record<string, unknown>)[key];
    if (current && typeof current === "object") {
      const themed = current as Record<string, unknown>;
      if (typeof themed.light === "string" && typeof themed.dark === "string") {
        const root = document.documentElement;
        const editingDark = root.classList.contains("dark") || root.dataset.theme === "dark";
        patch("colors", key, { ...themed, [editingDark ? "dark" : "light"]: normalizedColor });
        return;
      }
    }
    patch("colors", key, normalizedColor);
  }, [getSnapshot, patch]);

  const patchCardShadow = useCallback((value: string) => {
    if (!SHADOW_OPTIONS.includes(value as typeof SHADOW_OPTIONS[number])) return;
    patchMany([
      { category: "cards", key: "shadow", value },
      { category: "shadows", key: "card", value: value === "none" ? "none" : `var(--s-shadow-${value})` },
    ]);
  }, [patchMany]);

  const patchButtonShadow = useCallback((enabled: boolean) => {
    patch("shadows", "button", enabled ? "var(--s-shadow-sm)" : "none");
  }, [patch]);

  const patchCardPadding = useCallback((value: number) => {
    const css = `${value}px`;
    patchMany([
      { category: "spacing", key: "card-padding", value: css },
      { category: "cards", key: "padding", value: css },
      { category: "cards", key: "header-padding", value: css },
      { category: "cards", key: "footer-padding", value: css },
      { category: "cards", key: "content-padding-x", value: css },
      { category: "cards", key: "content-padding-y", value: css },
    ]);
  }, [patchMany]);

  const patchNavbarHeight = useCallback((value: number) => {
    const css = `${value}px`;
    patchMany([
      { category: "spacing", key: "navbar-height", value: css },
      { category: "navigation", key: "navbar-height", value: css },
    ]);
  }, [patchMany]);

  const patchSectionPadding = useCallback((value: number) => {
    const css = `${value}px`;
    patchMany([
      { category: "spacing", key: "section-py", value: css },
      { category: "sections", key: "padding-y", value: css },
    ]);
  }, [patchMany]);

  const patchCardRadius = useCallback((value: number) => {
    const css = `${value}px`;
    patchMany([
      { category: "radius", key: "card", value: css },
      { category: "sigil", key: "card-radius", value: css },
    ]);
  }, [patchMany]);

  const colorSwatch = (label: string, key: string) => (
    <div data-studio-row={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <ColorInput label={label} value={c?.[key]} onChange={(v) => patchColor(key, v)} />
      <span style={{ fontFamily: FONT, fontSize: 11, color: "var(--db-muted)", fontWeight: 500, textTransform: "capitalize" }}>{label}</span>
    </div>
  );

  const colorsContent = (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
        {colorSwatch("primary", "primary")}
        {colorSwatch("secondary", "secondary")}
        {colorSwatch("background", "background")}
        {colorSwatch("surface", "surface")}
        {colorSwatch("text", "text")}
        {colorSwatch("border", "border")}
        {colorSwatch("accent", "accent")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginTop: 4 }}>
        {colorSwatch("success", "success")}
        {colorSwatch("warning", "warning")}
        {colorSwatch("error", "error")}
        {colorSwatch("info", "info")}
      </div>
    </>
  );

  const typographyContent = (
    <>
    <Row label="display"><SelectField showFont value={readStr(t, "font-display", "InterVariable").split(",")[0]!.replace(/['"]/g, "")} options={DISPLAY_FONTS} onChange={(v) => patchMany([{ category: "typography", key: "font-display", value: `"${v}", system-ui, sans-serif` }, { category: "typography", key: "heading-family", value: `"${v}", system-ui, sans-serif` }])} /></Row>
    <Row label="body"><SelectField showFont value={readStr(t, "font-body", "InterVariable").split(",")[0]!.replace(/['"]/g, "")} options={DISPLAY_FONTS} onChange={(v) => patch("typography", "font-body", `"${v}", system-ui, sans-serif`)} /></Row>
      <Row label="mono"><SelectField showFont value={readStr(t, "font-mono", "PP Fraktion Mono").split(",")[0]!.replace(/['"]/g, "")} options={MONO_FONTS} onChange={(v) => patch("typography", "font-mono", `"${v}", ui-monospace, monospace`)} /></Row>
      <Row label="heading wt" value={String(readNum(t, "heading-weight", 700))}><Slider value={readNum(t, "heading-weight", 700)} min={300} max={900} step={100} onChange={(v) => patchMany([{ category: "typography", key: "heading-weight", value: String(v) }, ...["h1", "h2", "h3", "h4", "display"].map(level => ({ category: "headings", key: `${level}-weight`, value: String(v) }))])} /></Row>
      <Row label="heading trk" value={`${readNum(t, "heading-tracking", -0.02).toFixed(3)}em`}><Slider value={readNum(t, "heading-tracking", -0.02)} min={-0.06} max={0.02} step={0.002} onChange={(v) => patchMany([{ category: "typography", key: "heading-tracking", value: `${v}em` }, ...["h1", "h2", "h3", "h4", "display"].map(level => ({ category: "headings", key: `${level}-tracking`, value: `${v}em` }))])} /></Row>
      <Row label="base size" value={`${readNum(t, "size-base", 16)}px`}><Slider value={readNum(t, "size-base", 16)} min={14} max={20} step={1} onChange={(v) => patch("typography", "size-base", `${v}px`)} /></Row>
    </>
  );

  const spacingContent = (<>
    <Row label="page margin" value={`${readNum(layout, "page-margin", 24)}px`}><Slider value={readNum(layout, "page-margin", 24)} min={8} max={64} step={4} onChange={(v) => patch("layout", "page-margin", `${v}px`)} /></Row>
    <Row label="section pad" value={`${readNum(sp, "section-py", 64)}px`}><Slider value={readNum(sp, "section-py", 64)} min={24} max={160} step={8} onChange={patchSectionPadding} /></Row>
    <Row label="card pad" value={`${readNum(sp, "card-padding", 24)}px`}><Slider value={readNum(sp, "card-padding", 24)} min={8} max={48} step={4} onChange={patchCardPadding} /></Row>
    <Row label="grid gap" value={`${readNum(layout, "gutter", 16)}px`}><Slider value={readNum(layout, "gutter", 16)} min={4} max={48} step={4} onChange={(v) => patch("layout", "gutter", `${v}px`)} /></Row>
    <Row label="stack gap" value={`${readNum(layout, "stack-gap", 12)}px`}><Slider value={readNum(layout, "stack-gap", 12)} min={4} max={32} step={2} onChange={(v) => patch("layout", "stack-gap", `${v}px`)} /></Row>
  </>);

  const radiusContent = (<>
    <Row label="medium" value={`${readNum(r, "md", 8)}px`}><Slider value={readNum(r, "md", 8)} min={0} max={32} step={1} onChange={(v) => patch("radius", "md", `${v}px`)} /></Row>
    <Row label="button" value={`${readNum(r, "button", 8)}px`}><Slider value={readNum(r, "button", 8)} min={0} max={24} step={1} onChange={(v) => patch("radius", "button", `${v}px`)} /></Row>
    <Row label="card" value={`${readNum(r, "card", 12)}px`}><Slider value={readNum(r, "card", 12)} min={0} max={32} step={1} onChange={patchCardRadius} /></Row>
    <Row label="input" value={`${readNum(r, "input", 6)}px`}><Slider value={readNum(r, "input", 6)} min={0} max={16} step={1} onChange={(v) => patch("radius", "input", `${v}px`)} /></Row>
  </>);

  const bordersContent = (<>
    <Row label="border w" value={`${readNum(bw, "thin", 1)}px`}><Slider value={readNum(bw, "thin", 1)} min={0} max={4} step={0.5} onChange={(v) => patch("borders", "width.thin", `${v}px`)} /></Row>
    <Row label="style"><Segmented options={BORDER_STYLES} value={readStr(b, "style", "solid") as typeof BORDER_STYLES[number]} onChange={(v) => patch("borders", "style", v)} /></Row>
    <Row label="card border"><Toggle checked={readStr(cards, "border-style", "solid") !== "none"} onChange={(v) => patch("cards", "border-style", v ? "solid" : "none")} /></Row>
    <Row label="card shadow"><SelectField value={readStr(cards, "shadow", "md")} options={SHADOW_OPTIONS} onChange={patchCardShadow} /></Row>
    <Row label="btn shadow"><Toggle checked={readEnabledValue(sh, "button", false)} onChange={patchButtonShadow} /></Row>
    <Row label="glow"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Toggle checked={readEnabledValue(sh, "glow", false)} onChange={(v) => patch("shadows", "glow", v ? "0 0 20px var(--s-glow, var(--s-primary))" : "none")} />{readEnabledValue(sh, "glow", false) && <ColorInput value={c?.glow} onChange={(v) => patchColor("glow", v)} />}</div></Row>
  </>);

  const springDuration = readNum(md, "normal", 250) / 1000;
  const currentEasing = (() => {
    const easing = tokens.motion?.easing;
    if (!easing) return "cubic-bezier(0.16, 1, 0.3, 1)";
    if (typeof easing === "object") return (easing as Record<string, string>).default ?? "cubic-bezier(0.16, 1, 0.3, 1)";
    return "cubic-bezier(0.16, 1, 0.3, 1)";
  })();

  const motionContent = (<>
    <SubSection title="Transition Spring" defaultOpen>
      <SpringCurveEditor
        duration={springDuration}
        easing={tokens.motion.easing.spring}
        onChange={({ duration, easing }) => patchMany([
          { category: "motion", key: "duration.normal", value: `${Math.round(duration * 1000)}ms` },
          { category: "motion", key: "easing.spring", value: easing },
        ])}
      />
    </SubSection>
    <SubSection title="Default Easing" defaultOpen>
      <EasingCurveEditor
        easing={currentEasing}
        onEasingChange={(css) => patch("motion", "easing.default", css)}
      />
    </SubSection>
    <SubSection title="Durations">
      <Row label="fast" value={`${readNum(md, "fast", 150)}ms`}><Slider value={readNum(md, "fast", 150)} min={50} max={300} step={10} onChange={(v) => patch("motion", "duration.fast", `${v}ms`)} /></Row>
      <Row label="normal" value={`${readNum(md, "normal", 250)}ms`}><Slider value={readNum(md, "normal", 250)} min={100} max={500} step={10} onChange={(v) => patch("motion", "duration.normal", `${v}ms`)} /></Row>
      <Row label="slow" value={`${readNum(md, "slow", 400)}ms`}><Slider value={readNum(md, "slow", 400)} min={200} max={1200} step={20} onChange={(v) => patch("motion", "duration.slow", `${v}ms`)} /></Row>
    </SubSection>
    <SubSection title="Interaction">
      <Row label="hover scale" value={readNum(m, "hover-scale", 1.02).toFixed(2)}><Slider value={readNum(m, "hover-scale", 1.02)} min={1.0} max={1.1} step={0.01} onChange={(v) => patch("motion", "hover-scale", String(v))} /></Row>
      <Row label="press scale" value={readNum(m, "press-scale", 0.97).toFixed(2)}><Slider value={readNum(m, "press-scale", 0.97)} min={0.9} max={1.0} step={0.01} onChange={(v) => patch("motion", "press-scale", String(v))} /></Row>
      <Row label="hover lift" value={`${readNum(m, "hover-lift", 2)}px`}><Slider value={readNum(m, "hover-lift", 2)} min={-12} max={12} step={1} onChange={(v) => patch("motion", "hover-lift", `${v}px`)} /></Row>
      <Row label="stagger" value={`${readNum(m, "stagger-interval", 50)}ms`}><Slider value={readNum(m, "stagger-interval", 50)} min={10} max={200} step={10} onChange={(v) => patch("motion", "stagger-interval", `${v}ms`)} /></Row>
    </SubSection>
  </>);

  const gridLayoutContent = (<>
    <Row label="content-max" value={`${readNum(layout, "content-max", 1200)}px`}><Slider value={readNum(layout, "content-max", 1200)} min={768} max={1600} step={40} onChange={(v) => patchMany([{ category: "layout", key: "content-max", value: `${v}px` }, { category: "layout", key: "content-max-wide", value: `${v}px` }])} /></Row>
    <Row label="rail-gap" value={`${readNum(grid, "rail-gap", 24)}px`}><Slider value={readNum(grid, "rail-gap", 24)} min={8} max={48} step={4} onChange={(v) => patch("sigil", "rail-gap", `${v}px`)} /></Row>
    <Row label="grid-cell" value={`${readNum(grid, "grid-cell", 48)}px`}><Slider value={readNum(grid, "grid-cell", 48)} min={16} max={80} step={4} onChange={(v) => patch("sigil", "grid-cell", `${v}px`)} /></Row>
    <Row label="cross-stroke" value={`${readNum(grid, "cross-stroke", 1.5)}px`}><Slider value={readNum(grid, "cross-stroke", 1.5)} min={0} max={4} step={0.5} onChange={(v) => patch("sigil", "cross-stroke", `${v}px`)} /></Row>
    <Row label="navbar-h" value={`${readNum(nav, "navbar-height", 56)}px`}><Slider value={readNum(nav, "navbar-height", 56)} min={36} max={96} step={4} onChange={patchNavbarHeight} /></Row>
    <Row label="bento-gap" value={`${readNum(layout, "bento-gap", 12)}px`}><Slider value={readNum(layout, "bento-gap", 12)} min={2} max={32} step={2} onChange={(v) => patch("layout", "bento-gap", `${v}px`)} /></Row>
    <Row label="grid lines"><Toggle checked={readBool(gridVisuals, "show-lines", true)} onChange={(v) => patch("gridVisuals", "show-lines", v)} /></Row>
    <Row label="dots"><Toggle checked={readBool(gridVisuals, "show-dots", false)} onChange={(v) => patch("gridVisuals", "show-dots", v)} /></Row>
    <Row label="cell borders"><Toggle checked={readBool(gridVisuals, "cell-border", false)} onChange={(v) => patch("gridVisuals", "cell-border", v)} /></Row>
    <Row label="cell bg"><Segmented options={CELL_BG_OPTIONS} value={readStr(gridVisuals, "cell-background", "none") as typeof CELL_BG_OPTIONS[number]} onChange={(v) => patch("gridVisuals", "cell-background", v)} /></Row>
  </>);

  const patternsContent = (<>
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontFamily: FONT, fontSize: 9, color: "var(--db-muted)", fontWeight: 500 }}>Gutter</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
        {GUTTER_PATTERNS.map(p => <ChipButton key={p} label={p} active={currentGutterPattern === p} onClick={() => patch("sigil", "gutter-pattern", p)} />)}
      </div>
    </div>
    <div>
      <span style={{ fontFamily: FONT, fontSize: 9, color: "var(--db-muted)", fontWeight: 500 }}>Margin</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
        {GUTTER_PATTERNS.map(p => <ChipButton key={p} label={p} active={currentMarginPattern === p} onClick={() => patch("sigil", "margin-pattern", p)} />)}
      </div>
    </div>
  </>);

  const alignmentContent = (<>
    <Row label="content"><Segmented options={CONTENT_ALIGN} value={readStr(align, "content-align", "center") as typeof CONTENT_ALIGN[number]} onChange={(v) => patch("alignment" as keyof SigilTokens, "content-align", v)} /></Row>
    <Row label="hero"><Segmented options={HERO_ALIGN} value={readStr(align, "hero-align", "center") as typeof HERO_ALIGN[number]} onChange={(v) => patch("alignment" as keyof SigilTokens, "hero-align", v)} /></Row>
    <Row label="navbar"><Segmented options={NAVBAR_ALIGN} value={readStr(align, "navbar-align", "full") as typeof NAVBAR_ALIGN[number]} onChange={(v) => patch("alignment", "navbar-align", v)} /></Row>
    <Row label="rail visible"><Toggle checked={readBool(align, "rail-visible", false)} onChange={(v) => patch("alignment" as keyof SigilTokens, "rail-visible", v)} /></Row>
  </>);

  const bg = tokens.backgrounds as Record<string, unknown> | undefined;
  const headings = tokens.headings as Record<string, unknown> | undefined;
  const hero = (tokens as Record<string, unknown>).hero as Record<string, unknown> | undefined;
  const ctaTokens = (tokens as Record<string, unknown>).cta as Record<string, unknown> | undefined;
  const footer = (tokens as Record<string, unknown>).footer as Record<string, unknown> | undefined;
  const inputs = tokens.inputs as Record<string, unknown> | undefined;

  const HOVER_EFFECTS = ["glow", "lift", "darken", "outline", "fill", "none"] as const;
  const TEXT_TRANSFORMS = ["none", "uppercase", "capitalize", "lowercase"] as const;
  const CARD_HOVER = ["lift", "glow", "border", "scale", "none"] as const;
  const BG_PATTERNS = ["none", "dots", "grid", "crosshatch", "diagonal", "diamond", "hexagon", "triangle"] as const;
  const GRADIENT_TYPES = ["none", "linear", "radial", "conic"] as const;
  const CARD_ASPECT = ["auto", "1/1", "4/3", "16/9"] as const;
  const HERO_LAYOUTS = ["centered", "split", "stacked", "asymmetric"] as const;
  const CTA_LAYOUTS = ["centered", "split"] as const;

  const buttonsContent = (<>
    <Row label="weight"><SelectField value={readStr(buttons, "font-weight", "600")} options={["400", "500", "600", "700"]} onChange={(v) => patch("buttons", "font-weight", v)} /></Row>
    <Row label="transform"><SelectField value={readStr(buttons, "text-transform", "none")} options={TEXT_TRANSFORMS} onChange={(v) => patch("buttons", "text-transform", v)} /></Row>
    <Row label="hover"><SelectField value={readStr(buttons, "hover-effect", "glow")} options={HOVER_EFFECTS} onChange={(v) => patch("buttons", "hover-effect", v)} /></Row>
    <Row label="active scale" value={readNum(buttons, "active-scale", 0.97).toFixed(2)}><Slider value={readNum(buttons, "active-scale", 0.97)} min={0.9} max={1.0} step={0.01} onChange={(v) => patch("buttons", "active-scale", String(v))} /></Row>
    <Row label="min-width" value={`${readNum(buttons, "min-width", 0)}px`}><Slider value={readNum(buttons, "min-width", 0)} min={0} max={200} step={4} onChange={(v) => patch("buttons", "min-width", `${v}px`)} /></Row>
    <Row label="letter sp" value={`${readNum(buttons, "letter-spacing", 0).toFixed(3)}em`}><Slider value={readNum(buttons, "letter-spacing", 0)} min={-0.02} max={0.12} step={0.005} onChange={(v) => patch("buttons", "letter-spacing", `${v}em`)} /></Row>
    <Row label="icon gap" value={`${readNum(buttons, "icon-gap", 8)}px`}><Slider value={readNum(buttons, "icon-gap", 8)} min={2} max={16} step={1} onChange={(v) => patch("buttons", "icon-gap", `${v}px`)} /></Row>
    <Row label="shadow"><Toggle checked={readEnabledValue(sh, "button", false)} onChange={patchButtonShadow} /></Row>
  </>);

  const cardsContent = (<>
    <Row label="hover"><SelectField value={readStr(cards, "hover-effect", "lift")} options={CARD_HOVER} onChange={(v) => patch("cards", "hover-effect", v)} /></Row>
    <Row label="border"><SelectField value={readStr(cards, "border-style", "solid")} options={BORDER_STYLES} onChange={(v) => patch("cards", "border-style", v)} /></Row>
    <Row label="shadow"><SelectField value={readStr(cards, "shadow", "md")} options={SHADOW_OPTIONS} onChange={patchCardShadow} /></Row>
    <Row label="padding" value={`${readNum(cards, "padding", 24)}px`}><Slider value={readNum(cards, "padding", 24)} min={8} max={48} step={4} onChange={patchCardPadding} /></Row>
    <Row label="title size" value={`${readNum(cards, "title-size", 16)}px`}><Slider value={readNum(cards, "title-size", 16)} min={12} max={28} step={1} onChange={(v) => patch("cards", "title-size", `${v}px`)} /></Row>
    <Row label="title wt"><SelectField value={readStr(cards, "title-weight", "600")} options={["400", "500", "600", "700", "800"]} onChange={(v) => patch("cards", "title-weight", v)} /></Row>
    <Row label="desc size" value={`${readNum(cards, "description-size", 14)}px`}><Slider value={readNum(cards, "description-size", 14)} min={10} max={20} step={1} onChange={(v) => patch("cards", "description-size", `${v}px`)} /></Row>
    <Row label="aspect"><SelectField value={readStr(cards, "aspect-ratio", "auto")} options={CARD_ASPECT} onChange={(v) => patch("cards", "aspect-ratio", v)} /></Row>
    <Row label="outline"><Toggle checked={readBool(cards, "outline", false)} onChange={(v) => patch("cards", "outline", v)} /></Row>
  </>);

  const backgroundsContent = (<>
    <Row label="pattern"><SelectField value={readStr(bg, "pattern", "none")} options={BG_PATTERNS} onChange={(v) => patch("backgrounds", "pattern", v)} /></Row>
    <Row label="pattern α" value={readNum(bg, "pattern-opacity", 0.1).toFixed(2)}><Slider value={readNum(bg, "pattern-opacity", 0.1)} min={0} max={0.5} step={0.01} onChange={(v) => patch("backgrounds", "pattern-opacity", String(v))} /></Row>
    <Row label="noise"><Toggle checked={readBool(bg, "noise", false)} onChange={(v) => patch("backgrounds", "noise", v)} /></Row>
    <Row label="gradient"><SelectField value={readStr(bg, "gradient-type", "none")} options={GRADIENT_TYPES} onChange={(v) => patch("backgrounds", "gradient-type", v)} /></Row>
    <Row label="grad angle" value={`${readNum(bg, "gradient-angle", 180)}°`}><Slider value={readNum(bg, "gradient-angle", 180)} min={0} max={360} step={15} onChange={(v) => patch("backgrounds", "gradient-angle", `${v}deg`)} /></Row>
  </>);

  const headingsContent = (<>
    <Row label="h1 size" value={`${readNum(headings, "h1-size", 48)}px`}><Slider value={readNum(headings, "h1-size", 48)} min={28} max={80} step={2} onChange={(v) => patch("headings", "h1-size", `${v}px`)} /></Row>
    <Row label="h2 size" value={`${readNum(headings, "h2-size", 36)}px`}><Slider value={readNum(headings, "h2-size", 36)} min={20} max={60} step={2} onChange={(v) => patch("headings", "h2-size", `${v}px`)} /></Row>
    <Row label="h3 size" value={`${readNum(headings, "h3-size", 28)}px`}><Slider value={readNum(headings, "h3-size", 28)} min={16} max={44} step={1} onChange={(v) => patch("headings", "h3-size", `${v}px`)} /></Row>
    <Row label="h4 size" value={`${readNum(headings, "h4-size", 22)}px`}><Slider value={readNum(headings, "h4-size", 22)} min={14} max={36} step={1} onChange={(v) => patch("headings", "h4-size", `${v}px`)} /></Row>
    <Row label="h1 weight"><SelectField value={readStr(headings, "h1-weight", "700")} options={["400", "500", "600", "700", "800", "900"]} onChange={(v) => patch("headings", "h1-weight", v)} /></Row>
    <Row label="h1 tracking" value={`${readNum(headings, "h1-tracking", -0.02).toFixed(3)}em`}><Slider value={readNum(headings, "h1-tracking", -0.02)} min={-0.06} max={0.02} step={0.002} onChange={(v) => patch("headings", "h1-tracking", `${v}em`)} /></Row>
    <Row label="h1 leading" value={readNum(headings, "h1-leading", 1.2).toFixed(2)}><Slider value={readNum(headings, "h1-leading", 1.2)} min={0.9} max={1.6} step={0.05} onChange={(v) => patch("headings", "h1-leading", String(v))} /></Row>
  </>);

  const navigationContent = (<>
    <Row label="height" value={`${readNum(nav, "navbar-height", 56)}px`}><Slider value={readNum(nav, "navbar-height", 56)} min={36} max={96} step={4} onChange={patchNavbarHeight} /></Row>
    <Row label="blur" value={`${readNum(nav, "navbar-backdrop-blur", 12)}px`}><Slider value={readNum(nav, "navbar-backdrop-blur", 12)} min={0} max={32} step={2} onChange={(v) => patch("navigation", "navbar-backdrop-blur", `${v}px`)} /></Row>
    <Row label="border"><Toggle checked={readEnabledValue(nav, "navbar-border", true)} onChange={(v) => patch("navigation", "navbar-border", v ? "var(--s-border-thin, 1px) var(--s-border-style, solid)" : "none")} /></Row>
    <Row label="padding" value={`${readNum(nav, "navbar-padding-x", 16)}px`}><Slider value={readNum(nav, "navbar-padding-x", 16)} min={8} max={48} step={4} onChange={(v) => patch("navigation", "navbar-padding-x", `${v}px`)} /></Row>
    <Row label="item gap" value={`${readNum(nav, "navbar-item-gap", 8)}px`}><Slider value={readNum(nav, "navbar-item-gap", 8)} min={2} max={24} step={2} onChange={(v) => patch("navigation", "navbar-item-gap", `${v}px`)} /></Row>
  </>);

  const inputsContent = (<>
    <Row label="height" value={`${readNum(inputs, "height", 40)}px`}><Slider value={readNum(inputs, "height", 40)} min={28} max={56} step={2} onChange={(v) => patch("inputs", "height", `${v}px`)} /></Row>
    <Row label="focus ring" value={`${readNum(inputs, "focus-ring-width", 2)}px`}><Slider value={readNum(inputs, "focus-ring-width", 2)} min={0} max={4} step={0.5} onChange={(v) => patch("inputs", "focus-ring-width", `${v}px`)} /></Row>
    <Row label="focus ring"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><ColorInput value={inputs?.["focus-ring-color"]} onChange={(v) => patch("inputs", "focus-ring-color", v)} /></div></Row>
  </>);

  const heroContent = (<>
    <Row label="min-height" value={`${readNum(hero, "min-height", 600)}px`}><Slider value={readNum(hero, "min-height", 600)} min={300} max={1000} step={20} onChange={(v) => patch("hero" as keyof SigilTokens, "min-height", `${v}px`)} /></Row>
    <Row label="padding Y" value={`${readNum(hero, "padding-y", 80)}px`}><Slider value={readNum(hero, "padding-y", 80)} min={24} max={200} step={8} onChange={(v) => patch("hero" as keyof SigilTokens, "padding-y", `${v}px`)} /></Row>
    <Row label="content-max" value={`${readNum(hero, "content-max", 680)}px`}><Slider value={readNum(hero, "content-max", 680)} min={400} max={1200} step={20} onChange={(v) => patch("hero", "content-max", `${v}px`)} /></Row>
    <Row label="layout"><SelectField value={readStr(hero, "layout", "centered")} options={HERO_LAYOUTS} onChange={(v) => patch("hero", "layout", v)} /></Row>
    <Row label="title size" value={`${readNum(hero, "title-size", 56)}px`}><Slider value={readNum(hero, "title-size", 56)} min={28} max={96} step={2} onChange={(v) => patch("hero" as keyof SigilTokens, "title-size", `${v}px`)} /></Row>
    <Row label="desc size" value={`${readNum(hero, "description-size", 18)}px`}><Slider value={readNum(hero, "description-size", 18)} min={12} max={28} step={1} onChange={(v) => patch("hero" as keyof SigilTokens, "description-size", `${v}px`)} /></Row>
  </>);

  const ctaContent = (<>
    <Row label="padding Y" value={`${readNum(ctaTokens, "padding-y", 64)}px`}><Slider value={readNum(ctaTokens, "padding-y", 64)} min={24} max={160} step={8} onChange={(v) => patch("cta" as keyof SigilTokens, "padding-y", `${v}px`)} /></Row>
    <Row label="max-width" value={`${readNum(ctaTokens, "max-width", 600)}px`}><Slider value={readNum(ctaTokens, "max-width", 600)} min={320} max={1000} step={20} onChange={(v) => patch("cta" as keyof SigilTokens, "max-width", `${v}px`)} /></Row>
    <Row label="layout"><SelectField value={readStr(ctaTokens, "layout", "centered")} options={CTA_LAYOUTS} onChange={(v) => patch("cta", "layout", v)} /></Row>
    <Row label="title size" value={`${readNum(ctaTokens, "title-size", 36)}px`}><Slider value={readNum(ctaTokens, "title-size", 36)} min={20} max={60} step={2} onChange={(v) => patch("cta" as keyof SigilTokens, "title-size", `${v}px`)} /></Row>
  </>);

  const footerContent = (<>
    <Row label="padding Y" value={`${readNum(footer, "padding-y", 48)}px`}><Slider value={readNum(footer, "padding-y", 48)} min={16} max={120} step={8} onChange={(v) => patch("footer" as keyof SigilTokens, "padding-y", `${v}px`)} /></Row>
    <Row label="columns" value={String(readNum(footer, "columns", 4))}><Slider value={readNum(footer, "columns", 4)} min={1} max={6} step={1} onChange={(v) => patch("footer" as keyof SigilTokens, "columns", String(v))} /></Row>
    <Row label="gap" value={`${readNum(footer, "column-gap", 24)}px`}><Slider value={readNum(footer, "column-gap", 24)} min={8} max={48} step={4} onChange={(v) => patch("footer" as keyof SigilTokens, "column-gap", `${v}px`)} /></Row>
  </>);

  const handleRandomize = useCallback(() => {
    const p = PRESET_DATA[Math.floor(Math.random() * PRESET_DATA.length)]!;
    handlePreset(p.name);
  }, [handlePreset]);

  const iconBtn = (icon: ReactNode, onClick: () => void, title: string) => (
    <button type="button" onClick={onClick} title={title} aria-label={title} style={{
      width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: 4, border: "1px solid var(--db-border)", background: "none", color: "var(--db-muted)", cursor: "pointer",
    }}>{icon}</button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", flexShrink: 0, borderBottom: "1px solid var(--db-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Grid3X3 size={12} style={{ color: "var(--db-accent)" }} />
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 10, fontWeight: 700, color: "var(--db-text)" }}>Studio</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 3, background: "var(--db-accent-dim)", color: "var(--db-accent)" }}>{activePreset}</span>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {iconBtn(<Save size={10} />, handleSave, "Save preset")}
          {iconBtn(<RotateCcw size={10} />, handleReset, "Reset")}
          {iconBtn(<Download size={10} />, handleExport, "Export CSS")}
          {iconBtn(<X size={10} />, onClose, "Close")}
        </div>
      </div>

      {notice && <div role="status" className="devbar-notice">{notice}</div>}

      {/* Save name input */}
      {savingName !== null && (
        <div style={{ display: "flex", gap: 4, padding: "6px 16px", borderBottom: "1px solid var(--db-border)", background: "var(--db-accent-dim)" }}>
          <input
            autoFocus value={savingName}
            onChange={(e) => setSavingName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") { e.stopPropagation(); setSavingName(null); } }}
            placeholder="Preset name"
            style={{ flex: 1, padding: "3px 6px", fontSize: 10, fontFamily: FONT, borderRadius: 3, border: "1px solid var(--db-border)", background: "var(--db-bg)", color: "var(--db-text)", outline: "none" }}
          />
          <button type="button" onClick={handleSave} style={{ padding: "3px 8px", fontSize: 9, fontFamily: FONT, fontWeight: 600, borderRadius: 3, border: "none", background: "var(--db-accent)", color: "var(--db-bg)", cursor: "pointer" }}>Save</button>
          <button type="button" onClick={() => setSavingName(null)} style={{ padding: "3px 6px", fontSize: 9, fontFamily: FONT, borderRadius: 3, border: "1px solid var(--db-border)", background: "none", color: "var(--db-muted)", cursor: "pointer" }}>Cancel</button>
        </div>
      )}

      <PresetStrip activePreset={activePreset} onSelect={handlePreset} onRandomize={handleRandomize} customPresets={customPresets} onDeleteCustom={handleDeleteCustom} />

      <div className="devbar-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <Section title="Colors" defaultOpen>{colorsContent}</Section>
        <Section title="Typography">{typographyContent}</Section>
        <Section title="Spacing">{spacingContent}</Section>
        <Section title="Radius">{radiusContent}</Section>
        <Section title="Borders & Shadows">{bordersContent}</Section>
        <Section title="Motion" defaultOpen>{motionContent}</Section>
        <Section title="Buttons">{buttonsContent}</Section>
        <Section title="Cards">{cardsContent}</Section>
        <Section title="Inputs">{inputsContent}</Section>
        <Section title="Headings">{headingsContent}</Section>
        <Section title="Backgrounds">{backgroundsContent}</Section>
        <Section title="Navigation">{navigationContent}</Section>
        <Section title="Hero">{heroContent}</Section>
        <Section title="CTA">{ctaContent}</Section>
        <Section title="Footer">{footerContent}</Section>
        <Section title="Grid & Layout">{gridLayoutContent}</Section>
        <Section title="Patterns">{patternsContent}</Section>
        <Section title="Alignment">{alignmentContent}</Section>
        <Section title="Sound"><Row label="enabled"><Toggle checked={soundEnabled} onChange={setSoundEnabled} /></Row></Section>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Toolbar                                                            */
/* ================================================================== */

const TOOLBAR_DOCK_ICONS: Record<ToolbarDock, typeof PanelTop> = {
  top: PanelTop,
  right: PanelRight,
  bottom: PanelBottom,
  left: PanelLeft,
};

function Toolbar({ isMobile = false }: { isMobile?: boolean }) {
  const devbar = useDevBar();
  // Narrow subscriptions: Toolbar reads activePreset for highlighting and
  // setPreset for the preset strip — but never the full tokens object. The
  // legacy useSigilTokens() hook would re-render this on every patchTokens
  // call (slider drags etc.) even though Toolbar's UI doesn't depend on
  // those fields, which made every preset switch ~30+ buttons heavier.
  const activePreset = useSigilActivePreset();
  const { setPreset, preloadPreset } = useSigilActions();
  const { play, enabled: soundEnabled, setEnabled: setSoundEnabled, setActivePreset: setSoundPreset } = useSigilSound();

  const canvasMode = devbar?.canvasMode ?? false;
  const savedDock = devbar?.toolbarDock ?? "bottom";
  const toolbarDock: ToolbarDock = isMobile && savedDock !== "top" ? "bottom" : savedDock;
  // Vertical layout when docked left or right (applies in both canvas and non-canvas).
  const isVertical = !isMobile && (toolbarDock === "left" || toolbarDock === "right");

  const presetStripRef = useRef<HTMLDivElement>(null);

  if (!devbar) return null;
  const { sidebarOpen, setSidebarOpen, dock, setDock, agentOpen, setAgentOpen, enterCanvas, exitCanvas, cycleToolbarDock } = devbar;
  const ToolbarDockIcon = TOOLBAR_DOCK_ICONS[toolbarDock];

  const handleRandomize = async () => {
    const p = PRESET_DATA[Math.floor(Math.random() * PRESET_DATA.length)]!;
    const result = await setPreset(p.name);
    if (!result.ok) return;
    setSoundPreset(p.name);
    play("preset");
  };

  const handlePresetClick = async (name: string) => {
    const result = await setPreset(name);
    if (!result.ok) return;
    setSoundPreset(name);
    play("preset");
  };

  const tbtn = (icon: ReactNode, onClick: () => void, active: boolean, label: string) => (
    <button type="button" aria-label={label} title={label} aria-pressed={active}
      aria-expanded={label === "Studio" ? sidebarOpen : undefined}
      aria-controls={label === "Studio" ? "sigil-studio-sidebar" : undefined}
      onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: ["Studio", "Canvas", "Agent"].includes(label) && !isVertical && !isMobile ? "5px 10px 5px 7px" : "5px 7px",
      borderRadius: 6,
      background: active ? "var(--db-accent-dim)" : "transparent",
      border: "none",
      fontFamily: FONT, fontSize: 10, fontWeight: active ? 600 : 500,
      color: active ? "var(--db-accent)" : "var(--db-muted)",
      cursor: "pointer", transition: "color 120ms ease-out, background-color 120ms ease-out", flexShrink: 0, minHeight: 32,
    }}>{icon}{["Studio", "Canvas", "Agent"].includes(label) && !isVertical && (label === "Studio" || !isMobile) && <span>{label}</span>}</button>
  );

  const divider = (
    <div style={{
      ...(isVertical
        ? { height: 1, width: 16 }
        : { width: 1, height: 16 }),
      background: "var(--db-border)", flexShrink: 0, opacity: 0.6,
    }} />
  );

  return (
    <div className="devbar-chrome devbar-toolbar" role="region" aria-label="Design toolbar" style={{
      ...(isVertical
        ? { width: TOOLBAR_H, height: "100%", flexDirection: "column" }
        : { height: TOOLBAR_H, width: "100%" }),
      flexShrink: 0, display: "flex", alignItems: "center",
      padding: isVertical ? "6px 0" : "0 6px",
      background: "var(--db-surface)",
      borderTop: !canvasMode && toolbarDock === "bottom" ? "1px solid var(--db-border)" : undefined,
      borderBottom: !canvasMode && toolbarDock === "top" ? "1px solid var(--db-border)" : undefined,
      borderRight: !canvasMode && toolbarDock === "left" ? "1px solid var(--db-border)" : undefined,
      borderLeft: !canvasMode && toolbarDock === "right" ? "1px solid var(--db-border)" : undefined,
      backdropFilter: canvasMode ? "none" : "blur(16px) saturate(1.4)",
      WebkitBackdropFilter: canvasMode ? "none" : "blur(16px) saturate(1.4)",
      zIndex: 10001, gap: 2,
    }}>
      {/* Sigil button */}
      {tbtn(<Grid3X3 size={11} style={{ color: "var(--db-accent)" }} />, () => setSidebarOpen(!sidebarOpen), sidebarOpen, "Studio")}

      <div className="devbar-presets" data-vertical={isVertical}>
        {divider}
        <button type="button" className="devbar-strip-scroll" aria-label="Previous presets" onClick={() => {
          const strip = presetStripRef.current;
          if (strip) strip.scrollBy(isVertical ? { top: -strip.clientHeight } : { left: -strip.clientWidth });
        }}><ChevronLeft /></button>
        <div ref={presetStripRef} className="devbar-preset-strip" role="group" aria-label="Site presets">
          {PRESET_DATA.map((preset) => {
            const active = activePreset.replace("*", "") === preset.name;
            return (
              <button key={preset.name} type="button" aria-label={preset.label} title={preset.label}
                aria-pressed={active}
                onPointerEnter={() => void preloadPreset(preset.name)}
                onFocus={() => void preloadPreset(preset.name)}
                onClick={() => handlePresetClick(preset.name)}>
                <span aria-hidden="true" style={{ background: preset.colors[0] }} />
                {!isVertical && preset.label}
              </button>
            );
          })}
        </div>
        <button type="button" className="devbar-strip-scroll" aria-label="More presets" onClick={() => {
          const strip = presetStripRef.current;
          if (strip) strip.scrollBy(isVertical ? { top: strip.clientHeight } : { left: strip.clientWidth });
        }}><ChevronRight /></button>
        {divider}
      </div>

      {/* Controls */}
      <div style={{
        display: "flex", alignItems: "center", gap: 1, flexShrink: 0,
        flexDirection: isVertical ? "column" : "row",
      }}>
        <FontDockTool dock={toolbarDock} isVertical={isVertical} />
        {tbtn(<Shuffle size={11} />, handleRandomize, false, "Random preset")}
        {!canvasMode && tbtn(
          <ToolbarDockIcon size={11} />,
          cycleToolbarDock,
          false,
          "Move toolbar",
        )}
        {divider}
        {tbtn(<Monitor size={11} />, () => { if (canvasMode) exitCanvas(); else enterCanvas(); }, canvasMode, "Canvas")}
        {sidebarOpen && !isMobile && tbtn(dock === "left" ? <PanelLeft size={11} /> : <PanelRight size={11} />, () => setDock(dock === "left" ? "right" : "left"), false, "Move studio panel")}
        {canvasMode && tbtn(<MessageSquare size={11} />, () => setAgentOpen(!agentOpen), agentOpen, "Agent")}
        {divider}
        {tbtn(soundEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />, () => setSoundEnabled(!soundEnabled), soundEnabled, "Sound")}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Animation helpers                                                  */
/* ================================================================== */

const EASE_SPRING = "cubic-bezier(0.32, 0.72, 0, 1)";
const DUR = "380ms";

/* ================================================================== */
/*  Content Area (unified for both modes, transitions in place)        */
/* ================================================================== */

function ContentArea({ children, canvas }: { children: ReactNode; canvas: boolean }) {
  const pathname = usePathname();
  const isDocs = pathname === "/docs" || pathname.startsWith("/docs/");
  const isMobile = useIsMobile();
  const devbar = useDevBar();
  const frameVisible = devbar?.frameVisible ?? false;
  const showFrame = frameVisible && !isMobile && !isDocs;
  const dock = devbar?.dock ?? "left";
  const sidebarOpen = devbar?.sidebarOpen ?? false;
  const agentOpen = devbar?.agentOpen ?? false;
  const bothHidden = !sidebarOpen && !agentOpen;

  return (
    <div style={{
      flex: 1, minWidth: 0, minHeight: 0, display: "flex", alignItems: "stretch",
      paddingTop: showFrame ? 8 : 0,
      paddingBottom: 0,
      paddingLeft: showFrame ? (dock === "right" || bothHidden ? 8 : 0) : 0,
      paddingRight: showFrame ? (dock === "left" || bothHidden ? 8 : 0) : 0,
      transition: `padding ${DUR} ${EASE_SPRING}`,
    }}>
      <div style={{
        width: "100%",
        borderRadius: showFrame ? 8 : 0,
        border: showFrame ? "1px solid var(--db-border)" : "0px solid transparent",
        overflow: showFrame ? "hidden" : undefined,
        transition: `border-radius ${DUR} ${EASE_SPRING}, border-color ${DUR} ${EASE_SPRING}, box-shadow 500ms ease`,
      }}>
        <div style={{ width: "100%", height: canvas ? "100%" : undefined, overflowX: canvas ? "hidden" : undefined, overflowY: canvas ? "auto" : undefined }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Studio Agent Chat                                                  */
/* ================================================================== */

type StudioMessage = { id: string; role: "user" | "assistant"; content: string };

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function extractActions(text: string) {
  const actions: Record<string, unknown>[] = [];
  const regex = /```json\s*\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    try { const p = JSON.parse(match[1].trim()); if (p && typeof p === "object") actions.push(p); } catch { /* skip */ }
  }
  return actions;
}

function StudioAgentChat() {
  const { tokens, patchTokenBatch, setPreset, getSnapshot } = useSigilTokens();
  const [messages, setMessages] = useState<StudioMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const processedRef = useRef(new Set<string>());

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const applyActions = useCallback((msgId: string, content: string) => {
    const actions = extractActions(content);
    for (const action of actions) {
      const key = `${msgId}:${JSON.stringify(action)}`;
      if (processedRef.current.has(key)) continue;
      processedRef.current.add(key);

      if ("patch" in action && action.patch && typeof action.patch === "object") {
        const patches: TokenPatch[] = [];
        for (const [cat, val] of Object.entries(action.patch as Record<string, unknown>)) {
          if (typeof val === "object" && val !== null) {
            for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
              patches.push({ category: cat, key: k, value: v });
            }
          }
        }
        patchTokenBatch(patches);
      }
      if ("setPreset" in action && typeof action.setPreset === "string") {
        setPreset(action.setPreset);
      }
      if ("savePreset" in action && action.savePreset && typeof action.savePreset === "object") {
        const sp = action.savePreset as Record<string, unknown>;
        const name = typeof sp.name === "string" ? sp.name : "agent-preset";
        const existing = loadCustomPresets();
        const next = [...existing.filter(p => p.name !== name), { name, tokens: getSnapshot().tokens, createdAt: Date.now() }];
        saveCustomPresetsToStorage(next);
      }
    }
  }, [patchTokenBatch, setPreset, getSnapshot]);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: StudioMessage = { id: generateId(), role: "user", content: trimmed };
    const assistantMsg: StudioMessage = { id: generateId(), role: "assistant", content: "" };
    const allMessages = [...messages, userMsg];
    setMessages([...allMessages, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          model: "gpt-5.4-mini",
          currentTokens: tokens,
          canvasItems: [],
          mode: "studio",
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.text();
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: `Error: ${err}` } : m));
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setIsStreaming(false); return; }

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: current } : m));
      }

      applyActions(assistantMsg.id, accumulated);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: `Error: ${(err as Error).message}` } : m));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, isStreaming, messages, tokens, applyActions]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", color: "var(--db-text)" }}>
      {/* Header */}
      <div style={{
        padding: "10px 14px", borderBottom: "1px solid var(--db-border)", display: "flex", alignItems: "center", gap: 6,
        background: "var(--db-surface)",
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: isStreaming ? "#d97706" : "#059669" }} />
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 700, color: "var(--db-text)" }}>Preset Agent</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="devbar-scroll" style={{ flex: 1, overflow: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--db-muted)", fontSize: 12, textAlign: "center", padding: 24 }}>
            <span style={{ fontSize: 11, lineHeight: 1.6, fontFamily: FONT }}>
              Describe your ideal aesthetic. The agent will create and apply token changes in real-time.
            </span>
          </div>
        )}
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "88%", padding: "8px 12px", borderRadius: 10, fontSize: 12, lineHeight: 1.5, fontFamily: FONT,
                background: isUser ? "var(--db-accent)" : "var(--db-surface)",
                color: isUser ? "var(--db-bg)" : "var(--db-text)",
                border: isUser ? "none" : "1px solid var(--db-border)",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {msg.content || <span style={{ display: "inline-block", width: 6, height: 14, background: "var(--db-muted)", borderRadius: 1, animation: "sigil-blink 1s step-end infinite" }} />}
              </div>
            </div>
          );
        })}
        {isStreaming && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button onClick={() => { abortRef.current?.abort(); setIsStreaming(false); }} style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 500, fontFamily: FONT,
              background: "rgba(220,38,38,0.1)", color: "#dc2626", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4,
            }}><Square size={8} /> Stop</button>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ borderTop: "1px solid var(--db-border)", padding: "8px 12px", display: "flex", gap: 6, alignItems: "flex-end", background: "var(--db-surface)" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          placeholder="Describe an aesthetic..."
          rows={1}
          style={{
            flex: 1, resize: "none", padding: "8px 10px", borderRadius: 8,
            border: "1px solid var(--db-border)", background: "var(--db-bg)", color: "var(--db-text)",
            fontSize: 12, lineHeight: 1.4, fontFamily: FONT, outline: "none", minHeight: 36, maxHeight: 120,
          }}
          onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = `${Math.min(t.scrollHeight, 120)}px`; }}
        />
        <button
          onClick={handleSubmit}
          disabled={isStreaming || !input.trim()}
          style={{
            padding: "8px 12px", borderRadius: 8, border: "none", background: "var(--db-accent)", color: "var(--db-bg)",
            fontSize: 12, fontWeight: 500, fontFamily: FONT,
            cursor: isStreaming || !input.trim() ? "not-allowed" : "pointer",
            opacity: isStreaming || !input.trim() ? 0.5 : 1, whiteSpace: "nowrap", height: 36,
            display: "flex", alignItems: "center", gap: 4,
          }}
        ><Send size={12} /></button>
      </div>

      <style>{`@keyframes sigil-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}

/* ================================================================== */
/*  Agent Panel (right side in canvas mode)                            */
/* ================================================================== */

function AgentPanel({ open, isMobile }: { open: boolean; isMobile: boolean }) {
  if (isMobile) {
    return (
      <>
        {open && (
          <div
            onClick={() => {/* handled by parent setAgentOpen */}}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.4)",
            }}
          />
        )}
        <div className="devbar-chrome" aria-hidden={!open} inert={!open} style={{
          position: "fixed", zIndex: 10000,
          top: 0, right: 0, bottom: 0,
          width: `min(${AGENT_W}px, 90vw)`,
          background: "var(--db-surface)",
          borderLeft: "1px solid var(--db-border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: `transform ${DUR} ${EASE_SPRING}`,
          willChange: "transform",
        }}>
          <StudioAgentChat />
        </div>
      </>
    );
  }

  return (
    <div className="devbar-chrome" aria-hidden={!open} inert={!open} style={{
      width: open ? AGENT_W : 0, flexShrink: 0, overflow: "hidden",
      background: "var(--db-surface)",
      transition: `width ${DUR} ${EASE_SPRING}`, willChange: "width",
    }}>
      <div style={{ width: AGENT_W, height: "100%", opacity: open ? 1 : 0, transition: `opacity ${open ? "250ms 80ms" : "120ms"} ease` }}>
        <StudioAgentChat />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Sidebar Panel                                                      */
/* ================================================================== */

function SidebarPanel({ mode, dock, open, isMobile }: { mode: "canvas" | "normal"; dock: DockPosition; open: boolean; isMobile: boolean }) {
  const { setSidebarOpen, toolbarDock } = useDevBar()!;
  const toolbarHeight = isMobile ? TOOLBAR_H * 2 : TOOLBAR_H;
  const w = isMobile ? SIDEBAR_W_MOBILE : SIDEBAR_W;

  if (mode === "canvas" && !isMobile) {
    return (
      <div id="sigil-studio-sidebar" role="complementary" aria-label="Studio settings" className="devbar-chrome" aria-hidden={!open} inert={!open} style={{
        position: "relative", width: open ? w : 0, flexShrink: 0,
        overflow: open ? "visible" : "hidden", background: "var(--db-surface)",
        transition: `width ${DUR} ${EASE_SPRING}`, willChange: "width",
      }}>
        <div style={{ width: w, height: "100%", opacity: open ? 1 : 0, transition: `opacity ${open ? "250ms 80ms" : "120ms"} ease` }}>
          <Activity mode={open ? "visible" : "hidden"}><SidebarContent onClose={() => setSidebarOpen(false)} /></Activity>
        </div>
      </div>
    );
  }

  /* Mobile canvas mode + normal mode: fixed overlay sidebar that slides in/out */
  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && open && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.4)",
            transition: `opacity 200ms ease`,
          }}
        />
      )}
      <div id="sigil-studio-sidebar" role="complementary" aria-label="Studio settings" className="devbar-chrome" aria-hidden={!open} inert={!open} style={{
        position: "fixed", zIndex: 10000,
        top: mode !== "canvas" && toolbarDock === "top" ? toolbarHeight : 0,
        bottom: isMobile || toolbarDock === "bottom" ? toolbarHeight : 0,
        width: isMobile ? `min(${w}px, 85vw)` : w,
        ...(dock === "left"
          ? { left: 0, borderRight: "1px solid var(--db-border)" }
          : { right: 0, borderLeft: "1px solid var(--db-border)" }),
        background: "var(--db-surface)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        transform: open
          ? "translateX(0)"
          : dock === "left" ? `translateX(-100%)` : `translateX(100%)`,
        transition: `transform ${DUR} ${EASE_SPRING}`,
        willChange: "transform",
        overflow: "hidden",
      }}>
        <Activity mode={open ? "visible" : "hidden"}><SidebarContent onClose={() => setSidebarOpen(false)} /></Activity>
      </div>
    </>
  );
}

/* ================================================================== */
/*  Canvas Viewport                                                    */
/* ================================================================== */

function CanvasViewport({ children, dock }: { children: ReactNode; dock: DockPosition }) {
  const isMobile = useIsMobile();
  const oppositeSide = dock === "left" ? "right" : "left";

  return (
    <div className="devbar-canvas-outer" style={{
      flex: 1, minWidth: 0, minHeight: 0, display: "flex", alignItems: "stretch", justifyContent: "center",
      ...(isMobile
        ? { padding: 0 }
        : {
            paddingTop: 12, paddingBottom: 0,
            paddingLeft: oppositeSide === "left" ? 12 : 0,
            paddingRight: oppositeSide === "right" ? 12 : 0,
          }),
      background: "var(--db-surface)", transition: `padding ${DUR} ${EASE_SPRING}`,
    }}>
      <div className="devbar-canvas-frame" style={{
        width: "100%", borderRadius: isMobile ? 0 : 8,
        border: isMobile ? "none" : "1px solid var(--db-border)",
        overflowX: "hidden", overflowY: "auto", transition: `border-radius ${DUR} ${EASE_SPRING}`,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main DevBar                                                        */
/* ================================================================== */

function toolbarFixedStyle(dock: ToolbarDock): React.CSSProperties {
  switch (dock) {
    case "top":
      return { position: "fixed", top: 0, left: 0, right: 0, zIndex: 10001 };
    case "left":
      return { position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 10001 };
    case "right":
      return { position: "fixed", top: 0, bottom: 0, right: 0, zIndex: 10001 };
    case "bottom":
    default:
      return { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10001 };
  }
}

export function SigilDevBar({ children }: { children: ReactNode }) {
  const devbar = useDevBar();
  const isMobile = useIsMobile();

  // Reserve space on the docked side so the fixed toolbar never covers content
  // (article body, sidebars, TOC, etc.). Applied via body[data-devbar-toolbar-dock].
  const savedDock = devbar?.toolbarDock ?? "bottom";
  const toolbarDock: ToolbarDock = isMobile && savedDock !== "top" ? "bottom" : savedDock;
  const canvasMode = devbar?.canvasMode ?? false;
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (canvasMode) {
      // Canvas mode handles its own layout — don't pad the body.
      document.body.removeAttribute("data-devbar-toolbar-dock");
      return;
    }
    document.body.setAttribute("data-devbar-toolbar-dock", toolbarDock);
    return () => {
      document.body.removeAttribute("data-devbar-toolbar-dock");
    };
  }, [toolbarDock, canvasMode]);

  if (!devbar) return <>{children}</>;

  const { sidebarOpen, dock, agentOpen, setAgentOpen } = devbar;
  const isLeftDock = dock === "left";
  const showInFlowSidebar = canvasMode && !isMobile;
  const showInFlowAgent = canvasMode && !isMobile;

  // Mobile canvas always uses bottom-docked horizontal toolbar (vertical bar
  // would be unusable on phones). On desktop, dock applies in both modes.
  const effectiveDock: ToolbarDock = canvasMode && isMobile ? "bottom" : toolbarDock;
  const isVerticalDock = effectiveDock === "left" || effectiveDock === "right";
  const toolbarFirst = effectiveDock === "top" || effectiveDock === "left";

  return (
    <div className="devbar-root" data-toolbar-dock={effectiveDock} style={{
      position: canvasMode ? "fixed" : "relative",
      inset: canvasMode ? 0 : undefined,
      display: "flex",
      // Canvas mode places the toolbar in flow, so the outer flex axis tracks
      // the dock direction. Non-canvas mode uses position-fixed for the bar,
      // so the outer can stay a simple column.
      flexDirection: canvasMode && isVerticalDock ? "row" : "column",
      background: canvasMode ? "var(--db-surface)" : undefined,
      // Keep body-level component portals above the canvas content.
      zIndex: canvasMode ? 0 : undefined,
      minHeight: canvasMode ? undefined : "100dvh",
      transition: `background ${DUR} ${EASE_SPRING}`,
    }}>
      <style>{DEVBAR_STYLES}</style>

      {/* In-flow toolbar BEFORE content (top/left docks, canvas mode only) */}
      {canvasMode && toolbarFirst && <Toolbar isMobile={isMobile} />}

      {/* Main row: sidebar + content + agent */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "row",
        minHeight: 0, minWidth: 0, overflow: canvasMode ? "hidden" : undefined, position: "relative",
      }}>
        {/* In-flow sidebar (canvas desktop only) */}
        {showInFlowSidebar && isLeftDock && <SidebarPanel mode="canvas" dock={dock} open={sidebarOpen} isMobile={false} />}

        <ContentArea canvas={canvasMode}>{children}</ContentArea>

        {showInFlowSidebar && !isLeftDock && <SidebarPanel mode="canvas" dock={dock} open={sidebarOpen} isMobile={false} />}

        {/* In-flow agent panel (canvas desktop only) */}
        {showInFlowAgent && <AgentPanel open={agentOpen} isMobile={false} />}


      </div>

      {/* In-flow toolbar AFTER content (bottom/right docks, canvas mode only) */}
      {canvasMode && !toolbarFirst && <Toolbar isMobile={isMobile} />}

      {/* Non-canvas: fixed-position toolbar on the docked side. Body padding
          (via DEVBAR_STYLES) reserves space so content is never covered. */}
      {!canvasMode && (
        <div style={toolbarFixedStyle(effectiveDock)}>
          <Toolbar isMobile={isMobile} />
        </div>
      )}

      {/* Overlay sidebar (normal mode + mobile canvas) */}
      {(!canvasMode || isMobile) && <SidebarPanel mode="normal" dock={dock} open={sidebarOpen} isMobile={isMobile} />}

      {/* Mobile overlay agent */}
      {isMobile && canvasMode && <AgentPanel open={agentOpen} isMobile={true} />}
      {isMobile && canvasMode && agentOpen && (
        <div onClick={() => setAgentOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9998 }} />
      )}
    </div>
  );
}

/* ================================================================== */
/*  Shared styles                                                      */
/* ================================================================== */

const DEVBAR_STYLES = `
  /* Reserve space on the side the toolbar is docked, so the fixed toolbar
     never covers article, sidebar, or TOC content — even inside layouts
     (like fumadocs) that use 100dvh internally. */
  body[data-devbar-toolbar-dock="bottom"] { padding-bottom: ${TOOLBAR_H}px; }
  body[data-devbar-toolbar-dock="top"]    { padding-top:    ${TOOLBAR_H}px; }
  body[data-devbar-toolbar-dock="left"]   { padding-left:   ${TOOLBAR_H}px; }
  body[data-devbar-toolbar-dock="right"]  { padding-right:  ${TOOLBAR_H}px; }

  .devbar-root {
    --db-bg: #ffffff;
    --db-surface: #f8f8fa;
    --db-border: #d0d0d8;
    --db-text: #0a0a0f;
    --db-text2: #4a4a55;
    --db-muted: #8a8a95;
    --db-accent: #18181b;
    --db-accent-dim: rgba(24,24,27,0.06);
    --db-accent-mid: rgba(24,24,27,0.10);
    color: var(--db-text);
  }
  .dark .devbar-root, [data-theme="dark"] .devbar-root {
    --db-bg: #0a0a0f;
    --db-surface: #141419;
    --db-border: #2c2c3c;
    --db-text: #fafafa;
    --db-text2: #a0a0aa;
    --db-muted: #8888a0;
    --db-accent: #e4e4e7;
    --db-accent-dim: rgba(228,228,231,0.06);
    --db-accent-mid: rgba(228,228,231,0.10);
  }
  .devbar-chrome {
    --s-font-body: "InterVariable", "Inter", system-ui, sans-serif;
    --s-font-display: var(--s-font-body);
    --s-primary: var(--db-accent);
    --s-primary-hover: var(--db-accent);
    --s-background: var(--db-bg);
    --s-surface: var(--db-surface);
    --s-surface-sunken: var(--db-surface);
    --s-border: var(--db-border);
    --s-border-style: solid;
    --s-text: var(--db-text);
    --s-text-secondary: var(--db-text2);
    --s-text-muted: var(--db-muted);
    --s-ring: var(--db-accent);
    --s-ring-offset: var(--db-bg);
    --s-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --s-radius-md: 6px;
    --s-radius-input: 6px;
    --s-radius-full: 9999px;
    --s-duration-fast: 150ms;
    --s-input-height: 28px;
    --s-error: #dc2626;
    font-family: ${FONT_BODY};
  }
  .devbar-notice { padding: 8px 16px; font-size: 11px; line-height: 1.5; color: var(--db-text2); border-bottom: 1px solid var(--db-border); }
  #sigil-studio-sidebar button:focus-visible, #sigil-studio-sidebar input:focus-visible { outline: 2px solid var(--db-accent); outline-offset: 2px; }
  .devbar-presets { flex: 1; min-width: 0; min-height: 0; display: flex; align-items: center; }
  .devbar-preset-strip { flex: 1; min-width: 0; display: flex; overflow: auto hidden; scrollbar-width: none; }
  .devbar-preset-strip::-webkit-scrollbar { display: none; }
  .devbar-preset-strip button, .devbar-strip-scroll {
    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    min-height: 32px; gap: 6px; padding: 4px 8px; border: 0; border-radius: 4px;
    background: transparent; color: var(--db-text2); font-family: ${FONT_BODY}; font-size: 11px;
    white-space: nowrap; cursor: pointer;
  }
  .devbar-preset-strip button[aria-pressed="true"] { background: var(--db-accent-mid); color: var(--db-text); font-weight: 600; }
  .devbar-preset-strip button:hover, .devbar-strip-scroll:hover { background: var(--db-accent-dim); }
  .devbar-toolbar button:focus-visible { outline: 2px solid var(--db-accent); outline-offset: -2px; }
  .devbar-preset-strip button > span { width: 10px; height: 10px; border-radius: 2px; box-shadow: inset 0 0 0 1px var(--db-border); }
  .devbar-strip-scroll { padding-inline: 2px; }
  .devbar-strip-scroll svg { width: 14px; height: 14px; }
  .devbar-presets[data-vertical="true"], .devbar-presets[data-vertical="true"] .devbar-preset-strip { flex-direction: column; }
  .devbar-presets[data-vertical="true"] .devbar-preset-strip { overflow: hidden auto; min-height: 0; }
  .devbar-presets[data-vertical="true"] .devbar-strip-scroll svg { transform: rotate(90deg); }
  @media (max-width: ${MOBILE_BP}px) {
    .devbar-toolbar { flex-wrap: wrap; height: auto !important; min-height: ${TOOLBAR_H * 2}px; }
    .devbar-toolbar > .devbar-presets { order: 3; flex-basis: 100%; border-top: 1px solid var(--db-border); }
    .devbar-toolbar > div:last-child { margin-left: auto; }
    body[data-devbar-toolbar-dock="bottom"] { padding-bottom: ${TOOLBAR_H * 2}px; }
    body[data-devbar-toolbar-dock="top"] { padding-top: ${TOOLBAR_H * 2}px; }
  }
  .devbar-scroll { scrollbar-width: none; }
  .devbar-scroll::-webkit-scrollbar { display: none; }
  @media (max-width: ${MOBILE_BP}px) {
    .devbar-canvas-frame { border-radius: 0 !important; border: none !important; }
  }
`;
