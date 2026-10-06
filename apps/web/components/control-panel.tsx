"use client";

import { useState, useCallback, type ReactNode } from "react";
import { NativeSelect } from "@sigil-ui/components";
import { useSigilTokens } from "./sandbox/token-provider";
import { useSigilSound } from "./sound-provider";
import { Palette, Type, Space, SquareSlash, RectangleHorizontal, Layers, Clock, Grid3X3, Ruler, Volume2 } from "@/components/icons";

const DISPLAY_FONTS = [
  "ABC Monument Grotesk", "PP Neue Montreal", "PP Mori", "Apfel Grotezk",
  "Nacelle", "Vulf Sans", "PP Editorial New", "PP Eiko", "PP Hatton",
  "PP Monument Extended", "PP Neue Machina", "PP Telegraf", "PP Gosha Sans",
  "PP Radio Grotesk", "PP Pangram Sans",
];

const MONO_FONTS = ["PP Fraktion Mono", "PP Supply Mono", "PP Neue Bit"];

const SHADOW_OPTIONS = ["none", "sm", "md", "lg", "xl"] as const;

const BORDER_STYLES = ["solid", "dashed", "dotted", "none"] as const;

const CELL_BG_OPTIONS = ["none", "surface", "alternate"] as const;

const CONTENT_ALIGN = ["center", "left", "wide"] as const;

const HERO_ALIGN = ["center", "left", "full-bleed"] as const;

const NAVBAR_ALIGN = ["full", "content", "inset"] as const;

/* ─── Tiny reusable controls ─── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "var(--s-font-mono)", fontSize: 10, fontWeight: 500,
      color: "var(--s-text-muted)", textTransform: "uppercase" as const,
      letterSpacing: "0.06em", flexShrink: 0,
    }}>
      {children}
    </span>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 28 }}>
      <Label>{label}</Label>
      <div style={{ flex: 1 }}>{children}</div>
      {value && (
        <span style={{
          fontFamily: "var(--s-font-mono)", fontSize: 10, color: "var(--s-text-secondary)",
          width: 50, textAlign: "right", flexShrink: 0,
        }}>
          {value}
        </span>
      )}
    </div>
  );
}

function Slider({ value, min, max, step, onChange }: {
  value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: "var(--s-primary)", height: 4, cursor: "pointer" }}
    />
  );
}

function ColorInput({ value, onChange }: { value: unknown; onChange: (v: string) => void }) {
  const strVal = typeof value === "string" ? value : typeof value === "object" && value && "dark" in (value as Record<string, unknown>) ? String((value as Record<string, string>).dark) : "#9b99e8";
  const hexVal = strVal.startsWith("#") ? strVal : "#9b99e8";
  return (
    <input
      type="color"
      value={hexVal}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 28, height: 28, border: "1px solid var(--s-border)",
        borderRadius: 4, cursor: "pointer", padding: 0, background: "none",
      }}
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 10, border: "1px solid var(--s-border)",
        background: checked ? "var(--s-primary)" : "var(--s-surface-sunken, var(--s-surface))",
        cursor: "pointer", position: "relative", transition: "background 150ms",
        padding: 0, flexShrink: 0,
      }}
    >
      <div style={{
        width: 14, height: 14, borderRadius: 7,
        background: checked ? "#fff" : "var(--s-text-muted)",
        position: "absolute", top: 2,
        left: checked ? 19 : 3,
        transition: "left 150ms, background 150ms",
      }} />
    </button>
  );
}

function Segmented<T extends string>({ options, value, onChange }: {
  options: readonly T[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 0, borderRadius: 4, overflow: "hidden", border: "1px solid var(--s-border)" }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={{
            flex: 1, padding: "3px 6px",
            fontFamily: "var(--s-font-mono)", fontSize: 9, fontWeight: value === opt ? 600 : 400,
            color: value === opt ? "var(--s-primary)" : "var(--s-text-muted)",
            background: value === opt ? "color-mix(in oklch, var(--s-primary) 12%, var(--s-surface))" : "var(--s-surface)",
            border: "none", cursor: "pointer", transition: "all 100ms",
            borderRight: "1px solid var(--s-border)",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function SelectField({ value, options, onChange }: {
  value: string; options: readonly string[]; onChange: (v: string) => void;
}) {
  return (
    <NativeSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-auto py-0.5 font-[family-name:var(--s-font-mono)] text-[11px]"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </NativeSelect>
  );
}

/* ─── Collapsible section ─── */

function Section({ title, icon, defaultOpen, children }: {
  title: string; icon?: ReactNode; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div style={{ borderBottom: "1px solid var(--s-border)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
        }}
      >
        <span style={{
          fontFamily: "var(--s-font-mono)", fontSize: 11, fontWeight: 600,
          color: "var(--s-text-secondary)", textTransform: "uppercase" as const,
          letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6,
        }}>
          {icon}
          {title}
        </span>
        <span style={{ fontSize: 10, color: "var(--s-text-muted)", transition: "transform 200ms", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▾
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Token helpers ─── */

function readStr(obj: Record<string, unknown> | undefined, key: string, fallback: string): string {
  return (obj?.[key] as string) ?? fallback;
}
function readNum(obj: Record<string, unknown> | undefined, key: string, fallback: number): number {
  const raw = obj?.[key];
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") return parseFloat(raw) || fallback;
  return fallback;
}
function readBool(obj: Record<string, unknown> | undefined, key: string, fallback: boolean): boolean {
  const raw = obj?.[key];
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string") return raw === "true" || raw === "1";
  return fallback;
}

/* ─── Main panel ─── */

export function ControlPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tokens, patchTokens, setPreset, activePreset } = useSigilTokens();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play } = useSigilSound();
  const [volume, setVolume] = useState(80);

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
  const layout = tokens.layout as Record<string, unknown> | undefined;
  const nav = tokens.navigation as Record<string, unknown> | undefined;
  const align = (tokens as any).alignment as Record<string, unknown> | undefined;
  const bg = tokens.backgrounds as Record<string, unknown> | undefined;

  const patch = useCallback(
    (cat: string, key: string, value: unknown) => patchTokens(cat as any, key, value),
    [patchTokens],
  );

  const handleReset = useCallback(async () => {
    const base = activePreset.replace("*", "");
    const result = await setPreset(base);
    if (!result.ok) return;
    play("preset");
  }, [activePreset, setPreset, play]);

  const handleExport = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log("Sigil Preset Export:", JSON.stringify(tokens, null, 2));
    play("success");
  }, [tokens, play]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)",
            transition: "opacity 200ms",
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 380,
          background: "var(--s-surface)",
          borderLeft: "1px solid var(--s-border)",
          boxShadow: open ? "var(--s-shadow-xl, -8px 0 32px rgba(0,0,0,0.25))" : "none",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 10000,
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderBottom: "1px solid var(--s-border)",
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "var(--s-font-mono)", fontSize: 12, fontWeight: 700,
            color: "var(--s-text)", letterSpacing: "0.02em",
          }}>
            Custom Preset
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                fontFamily: "var(--s-font-mono)", fontSize: 10, padding: "3px 10px",
                borderRadius: 4, border: "1px solid var(--s-border)",
                background: "none", color: "var(--s-text-muted)", cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 4, border: "1px solid var(--s-border)",
                background: "none", color: "var(--s-text-muted)", cursor: "pointer",
                fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable sections */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* 1. Colors */}
          <Section title="Colors" icon={<Palette size={12} />} defaultOpen>
            <Row label="primary">
              <ColorInput value={readStr(c, "primary", "#9b99e8")} onChange={(v) => patch("colors", "primary", v)} />
            </Row>
            <Row label="secondary">
              <ColorInput value={readStr(c, "secondary", "#da8325")} onChange={(v) => patch("colors", "secondary", v)} />
            </Row>
            <Row label="background">
              <ColorInput value={readStr(c, "background", "#0a0a0f")} onChange={(v) => patch("colors", "background", v)} />
            </Row>
            <Row label="surface">
              <ColorInput value={readStr(c, "surface", "#141419")} onChange={(v) => patch("colors", "surface", v)} />
            </Row>
            <Row label="text">
              <ColorInput value={readStr(c, "text", "#fafafa")} onChange={(v) => patch("colors", "text", v)} />
            </Row>
            <Row label="border">
              <ColorInput value={readStr(c, "border", "#2a2a35")} onChange={(v) => patch("colors", "border", v)} />
            </Row>
            <Row label="accent">
              <ColorInput value={readStr(c, "accent", "#9b99e8")} onChange={(v) => patch("colors", "accent", v)} />
            </Row>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ColorInput value={readStr(c, "success", "#10b981")} onChange={(v) => patch("colors", "success", v)} />
                <Label>success</Label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ColorInput value={readStr(c, "warning", "#f59e0b")} onChange={(v) => patch("colors", "warning", v)} />
                <Label>warning</Label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ColorInput value={readStr(c, "error", "#ef4444")} onChange={(v) => patch("colors", "error", v)} />
                <Label>error</Label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ColorInput value={readStr(c, "info", "#3b82f6")} onChange={(v) => patch("colors", "info", v)} />
                <Label>info</Label>
              </div>
            </div>
          </Section>

          {/* 2. Typography */}
          <Section title="Typography" icon={<Type size={12} />}>
            <Row label="display font">
              <SelectField
                value={readStr(t, "font-display", "PP Neue Montreal").split(",")[0]!.replace(/['"]/g, "")}
                options={DISPLAY_FONTS}
                onChange={(v) => patch("typography", "font-display", `"${v}", system-ui, sans-serif`)}
              />
            </Row>
            <Row label="body font">
              <SelectField
                value={readStr(t, "font-body", "PP Neue Montreal").split(",")[0]!.replace(/['"]/g, "")}
                options={DISPLAY_FONTS}
                onChange={(v) => patch("typography", "font-body", `"${v}", system-ui, sans-serif`)}
              />
            </Row>
            <Row label="mono font">
              <SelectField
                value={readStr(t, "font-mono", "PP Fraktion Mono").split(",")[0]!.replace(/['"]/g, "")}
                options={MONO_FONTS}
                onChange={(v) => patch("typography", "font-mono", `"${v}", ui-monospace, monospace`)}
              />
            </Row>
            <Row label="heading wt" value={String(readNum(t, "heading-weight", 700))}>
              <Slider value={readNum(t, "heading-weight", 700)} min={300} max={900} step={100} onChange={(v) => patch("typography", "heading-weight", v)} />
            </Row>
            <Row label="heading trk" value={`${readNum(t, "heading-tracking", -0.02).toFixed(3)}em`}>
              <Slider value={readNum(t, "heading-tracking", -0.02)} min={-0.06} max={0.02} step={0.002} onChange={(v) => patch("typography", "heading-tracking", v)} />
            </Row>
            <Row label="base size" value={`${readNum(t, "base-size", 16)}px`}>
              <Slider value={readNum(t, "base-size", 16)} min={14} max={20} step={1} onChange={(v) => patch("typography", "base-size", `${v}px`)} />
            </Row>
          </Section>

          {/* 3. Spacing */}
          <Section title="Spacing" icon={<Space size={12} />}>
            <Row label="page margin" value={`${readNum(layout, "page-margin", 24)}px`}>
              <Slider value={readNum(layout, "page-margin", 24)} min={8} max={64} step={4} onChange={(v) => patch("layout", "page-margin", `${v}px`)} />
            </Row>
            <Row label="section pad" value={`${readNum(sp, "section-py", 64)}px`}>
              <Slider value={readNum(sp, "section-py", 64)} min={24} max={160} step={8} onChange={(v) => patch("spacing", "section-py", `${v}px`)} />
            </Row>
            <Row label="card pad" value={`${readNum(sp, "card-padding", 24)}px`}>
              <Slider value={readNum(sp, "card-padding", 24)} min={8} max={48} step={4} onChange={(v) => patch("spacing", "card-padding", `${v}px`)} />
            </Row>
            <Row label="grid gap" value={`${readNum(layout, "gutter", 16)}px`}>
              <Slider value={readNum(layout, "gutter", 16)} min={4} max={48} step={4} onChange={(v) => patch("layout", "gutter", `${v}px`)} />
            </Row>
            <Row label="stack gap" value={`${readNum(sp, "stack-gap", 12)}px`}>
              <Slider value={readNum(sp, "stack-gap", 12)} min={4} max={32} step={2} onChange={(v) => patch("spacing", "stack-gap", `${v}px`)} />
            </Row>
          </Section>

          {/* 4. Radius */}
          <Section title="Radius" icon={<SquareSlash size={12} />}>
            <Row label="global" value={`${readNum(r, "md", 8)}px`}>
              <Slider value={readNum(r, "md", 8)} min={0} max={32} step={1} onChange={(v) => patch("radius", "md", `${v}px`)} />
            </Row>
            <Row label="button" value={`${readNum(r, "button", 8)}px`}>
              <Slider value={readNum(r, "button", 8)} min={0} max={24} step={1} onChange={(v) => patch("radius", "button", `${v}px`)} />
            </Row>
            <Row label="card" value={`${readNum(r, "lg", 12)}px`}>
              <Slider value={readNum(r, "lg", 12)} min={0} max={32} step={1} onChange={(v) => patch("radius", "lg", `${v}px`)} />
            </Row>
            <Row label="input" value={`${readNum(r, "input", 6)}px`}>
              <Slider value={readNum(r, "input", 6)} min={0} max={16} step={1} onChange={(v) => patch("radius", "input", `${v}px`)} />
            </Row>
            <Row label="badge">
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <Slider
                  value={readNum(r, "badge", 4)}
                  min={0} max={9999} step={1}
                  onChange={(v) => patch("radius", "badge", `${v}px`)}
                />
                <button
                  type="button"
                  onClick={() => patch("radius", "badge", "9999px")}
                  style={{
                    fontFamily: "var(--s-font-mono)", fontSize: 9, padding: "2px 6px",
                    borderRadius: 9999, border: "1px solid var(--s-border)",
                    background: readNum(r, "badge", 4) >= 9999 ? "var(--s-primary)" : "none",
                    color: readNum(r, "badge", 4) >= 9999 ? "#fff" : "var(--s-text-muted)",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  pill
                </button>
              </div>
            </Row>
          </Section>

          {/* 5. Borders */}
          <Section title="Borders" icon={<RectangleHorizontal size={12} />}>
            <Row label="width" value={`${readNum(bw, "thin", 1)}px`}>
              <Slider value={readNum(bw, "thin", 1)} min={0} max={4} step={0.5} onChange={(v) => patch("borders", "width.thin", `${v}px`)} />
            </Row>
            <Row label="style">
              <Segmented
                options={BORDER_STYLES}
                value={(readStr(b, "style", "solid") as typeof BORDER_STYLES[number])}
                onChange={(v) => patch("borders", "style", v)}
              />
            </Row>
            <Row label="card border">
              <Toggle checked={readBool(cards, "border", true)} onChange={(v) => patch("cards", "border", v)} />
            </Row>
            <Row label="hover only">
              <Toggle checked={readBool(cards, "border-hover-only", false)} onChange={(v) => patch("cards", "border-hover-only", v)} />
            </Row>
            <Row label="divider">
              <Segmented
                options={BORDER_STYLES}
                value={(readStr(b, "divider-style", "solid") as typeof BORDER_STYLES[number])}
                onChange={(v) => patch("borders", "divider-style", v)}
              />
            </Row>
            <Row label="divider w" value={`${readNum(b, "divider-width", 1)}px`}>
              <Slider value={readNum(b, "divider-width", 1)} min={0} max={4} step={0.5} onChange={(v) => patch("borders", "divider-width", `${v}px`)} />
            </Row>
          </Section>

          {/* 6. Shadows */}
          <Section title="Shadows" icon={<Layers size={12} />}>
            <Row label="card shadow">
              <SelectField
                value={readStr(cards, "shadow", "md")}
                options={SHADOW_OPTIONS}
                onChange={(v) => patch("cards", "shadow", v)}
              />
            </Row>
            <Row label="btn shadow">
              <Toggle checked={readBool(buttons, "shadow", false)} onChange={(v) => patch("buttons", "shadow", v)} />
            </Row>
            <Row label="glow">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Toggle checked={readBool(sh, "glow", false)} onChange={(v) => patch("shadows", "glow", v)} />
                {readBool(sh, "glow", false) && (
                  <ColorInput value={readStr(sh, "glow-color", "#9b99e8")} onChange={(v) => patch("shadows", "glow-color", v)} />
                )}
              </div>
            </Row>
          </Section>

          {/* 7. Motion */}
          <Section title="Motion" icon={<Clock size={12} />}>
            <Row label="fast" value={`${readNum(md, "fast", 150)}ms`}>
              <Slider value={readNum(md, "fast", 150)} min={50} max={300} step={10} onChange={(v) => patch("motion", "duration.fast", `${v}ms`)} />
            </Row>
            <Row label="normal" value={`${readNum(md, "normal", 250)}ms`}>
              <Slider value={readNum(md, "normal", 250)} min={100} max={500} step={10} onChange={(v) => patch("motion", "duration.normal", `${v}ms`)} />
            </Row>
            <Row label="hover scale" value={readNum(m, "hover-scale", 1.02).toFixed(2)}>
              <Slider value={readNum(m, "hover-scale", 1.02)} min={1.0} max={1.1} step={0.01} onChange={(v) => patch("motion", "hover-scale", String(v))} />
            </Row>
            <Row label="press scale" value={readNum(m, "press-scale", 0.97).toFixed(2)}>
              <Slider value={readNum(m, "press-scale", 0.97)} min={0.9} max={1.0} step={0.01} onChange={(v) => patch("motion", "press-scale", String(v))} />
            </Row>
          </Section>

          {/* 8. Grid Visuals */}
          <Section title="Grid Visuals" icon={<Grid3X3 size={12} />}>
            <Row label="grid lines">
              <Toggle checked={readBool(grid, "show-grid", true)} onChange={(v) => patch("sigil", "show-grid", v)} />
            </Row>
            <Row label="dots">
              <Toggle checked={readBool(grid, "show-dots", false)} onChange={(v) => patch("sigil", "show-dots", v)} />
            </Row>
            <Row label="cell borders">
              <Toggle checked={readBool(grid, "cell-borders", false)} onChange={(v) => patch("sigil", "cell-borders", v)} />
            </Row>
            <Row label="cell bg">
              <Segmented
                options={CELL_BG_OPTIONS}
                value={(readStr(grid, "cell-bg", "none") as typeof CELL_BG_OPTIONS[number])}
                onChange={(v) => patch("sigil", "cell-bg", v)}
              />
            </Row>
          </Section>

          {/* 9. Alignment */}
          <Section title="Alignment" icon={<Ruler size={12} />}>
            <Row label="content">
              <Segmented
                options={CONTENT_ALIGN}
                value={(readStr(align, "content-align", "center") as typeof CONTENT_ALIGN[number])}
                onChange={(v) => patch("alignment" as any, "content-align", v)}
              />
            </Row>
            <Row label="hero">
              <Segmented
                options={HERO_ALIGN}
                value={(readStr(align, "hero-align", "center") as typeof HERO_ALIGN[number])}
                onChange={(v) => patch("alignment" as any, "hero-align", v)}
              />
            </Row>
            <Row label="navbar">
              <Segmented
                options={NAVBAR_ALIGN}
                value={(readStr(nav, "navbar-align", "full") as typeof NAVBAR_ALIGN[number])}
                onChange={(v) => patch("navigation", "navbar-align", v)}
              />
            </Row>
            <Row label="rail visible">
              <Toggle checked={readBool(align, "rail-visible", false)} onChange={(v) => patch("alignment" as any, "rail-visible", v)} />
            </Row>
          </Section>

          {/* 10. Sound */}
          <Section title="Sound" icon={<Volume2 size={12} />}>
            <Row label="enabled">
              <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
            </Row>
            <Row label="volume" value={`${volume}%`}>
              <Slider value={volume} min={0} max={100} step={5} onChange={setVolume} />
            </Row>
          </Section>
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 16px", borderTop: "1px solid var(--s-border)",
          flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={handleExport}
            style={{
              width: "100%", padding: "8px 0",
              fontFamily: "var(--s-font-mono)", fontSize: 11, fontWeight: 600,
              borderRadius: 6, border: "1px solid var(--s-primary)",
              background: "color-mix(in oklch, var(--s-primary) 12%, var(--s-surface))",
              color: "var(--s-primary)", cursor: "pointer",
              transition: "background 150ms",
            }}
          >
            Export as Preset
          </button>
        </div>
      </div>
    </>
  );
}
