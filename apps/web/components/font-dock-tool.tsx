"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Type } from "@/components/icons";
import type { TokenPatch } from "@sigil-ui/tokens";
import { useSigilActions, useSigilTokenValues } from "./sandbox/token-provider";
import { FONT_LIBRARY, type FontLibraryEntry } from "@/lib/font-library";

type FontScope = "display" | "body" | "both";
type ToolbarDock = "top" | "right" | "bottom" | "left";

function firstFamily(value: string | undefined) {
  return value?.split(",")[0]?.replace(/["']/g, "").trim() ?? "";
}

function fontStack(font: FontLibraryEntry) {
  return `"${font.family}", system-ui, sans-serif`;
}

function panelPosition(dock: ToolbarDock): CSSProperties {
  if (dock === "top") return { top: "calc(100% + var(--s-space-8))", right: 0 };
  if (dock === "left") return { left: "calc(100% + var(--s-space-8))", bottom: 0 };
  if (dock === "right") return { right: "calc(100% + var(--s-space-8))", bottom: 0 };
  return { right: 0, bottom: "calc(100% + var(--s-space-8))" };
}

export function FontDockTool({ dock, isVertical }: { dock: ToolbarDock; isVertical: boolean }) {
  const tokens = useSigilTokenValues();
  const { patchTokenBatch } = useSigilActions();
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<FontScope>("both");
  const [sample, setSample] = useState("An Agent-First Design System.");
  const [available, setAvailable] = useState<Record<string, boolean>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  const currentDisplay = firstFamily(tokens.typography?.["font-display"]);
  const currentBody = firstFamily(tokens.typography?.["font-body"]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const detect = async () => {
      await Promise.all(
        FONT_LIBRARY.map((font) => document.fonts.load(`400 18px "${font.family}"`).catch(() => [])),
      );
      await document.fonts.ready;
      if (cancelled) return;
      setAvailable(Object.fromEntries(
        FONT_LIBRARY.map((font) => [font.family, document.fonts.check(`400 18px "${font.family}"`)]),
      ));
    };
    void detect();
    return () => { cancelled = true; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const applyFont = (font: FontLibraryEntry) => {
    if (font.availability === "licensed-local" && !available[font.family]) return;
    const value = fontStack(font);
    const patches: TokenPatch[] = [];
    if (scope === "display" || scope === "both") {
      patches.push({ category: "typography", key: "font-display", value });
      patches.push({ category: "typography", key: "heading-family", value });
    }
    if (scope === "body" || scope === "both") {
      patches.push({ category: "typography", key: "font-body", value });
    }
    patchTokenBatch(patches);
  };

  return (
    <div ref={rootRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        title="Font lab"
        style={{
          display: "flex",
          minWidth: "var(--s-control-hit-area)",
          minHeight: "var(--s-control-hit-area)",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--s-space-4)",
          paddingInline: isVertical ? "var(--s-space-8)" : "var(--s-space-12)",
          border: 0,
          borderRadius: "var(--s-radius-button)",
          color: open ? "var(--db-accent)" : "var(--db-muted)",
          background: open ? "var(--db-accent-dim)" : "transparent",
          fontFamily: "var(--s-font-body)",
          fontSize: "var(--s-size-xs)",
          fontWeight: open ? 600 : 500,
          cursor: "pointer",
        }}
      >
        <Type size={12} aria-hidden />
        {!isVertical && <span>Fonts</span>}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Font lab"
          style={{
            ...panelPosition(dock),
            position: "absolute",
            zIndex: 10004,
            display: "grid",
            width: "min(calc(var(--s-sidebar-width) + var(--s-space-64)), calc(100vw - var(--s-space-24)))",
            maxHeight: "min(var(--s-content-max-narrow), calc(100vh - var(--s-space-48)))",
            overflow: "hidden",
            border: "var(--s-border-thin) var(--s-border-style) var(--db-border)",
            borderRadius: "var(--s-radius-card)",
            color: "var(--db-text)",
            background: "var(--db-surface)",
            boxShadow: "var(--s-shadow-xl)",
          }}
        >
          <div style={{ display: "grid", gap: "var(--s-space-8)", padding: "var(--s-space-12)", borderBottom: "var(--s-border-thin) var(--s-border-style) var(--db-border)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--s-space-12)" }}>
              <strong style={{ fontFamily: "var(--s-font-display)", fontSize: "var(--s-size-sm)" }}>Font lab</strong>
              <span style={{ color: "var(--db-muted)", fontFamily: "var(--s-font-mono)", fontSize: "var(--s-size-xs)" }}>live tokens</span>
            </div>
            <input
              value={sample}
              onChange={(event) => setSample(event.target.value)}
              aria-label="Font specimen text"
              style={{
                width: "100%",
                minHeight: "var(--s-control-height)",
                paddingInline: "var(--s-space-12)",
                border: "var(--s-border-thin) var(--s-border-style) var(--db-border)",
                borderRadius: "var(--s-radius-input)",
                color: "var(--db-text)",
                background: "var(--db-bg)",
                fontFamily: "var(--s-font-body)",
                fontSize: "var(--s-size-xs)",
                outline: "none",
              }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--s-space-4)" }}>
              {(["display", "body", "both"] as const).map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setScope(option)}
                  style={{
                    minHeight: "var(--s-control-height-sm)",
                    border: "var(--s-border-thin) var(--s-border-style) var(--db-border)",
                    borderRadius: "var(--s-radius-sm)",
                    color: scope === option ? "var(--db-bg)" : "var(--db-muted)",
                    background: scope === option ? "var(--db-accent)" : "transparent",
                    fontFamily: "var(--s-font-mono)",
                    fontSize: "var(--s-size-xs)",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowY: "auto", padding: "var(--s-space-8)" }}>
            {FONT_LIBRARY.map((font) => {
              const ready = available[font.family] ?? font.availability === "web";
              const active = (scope === "display" && currentDisplay === font.family)
                || (scope === "body" && currentBody === font.family)
                || (scope === "both" && currentDisplay === font.family && currentBody === font.family);
              return (
                <button
                  type="button"
                  key={font.family}
                  disabled={!ready}
                  onClick={() => applyFont(font)}
                  style={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: "var(--s-space-12)",
                    padding: "var(--s-space-12)",
                    border: 0,
                    borderBottom: "var(--s-border-thin) var(--s-border-style) var(--db-border)",
                    color: active ? "var(--db-accent)" : "var(--db-text)",
                    background: active ? "var(--db-accent-dim)" : "transparent",
                    textAlign: "left",
                    cursor: ready ? "pointer" : "not-allowed",
                    opacity: ready ? 1 : 0.56,
                  }}
                >
                  <span style={{ minWidth: 0 }}>
                    <strong style={{ display: "block", overflow: "hidden", fontFamily: `"${font.family}", system-ui, sans-serif`, fontSize: "var(--s-size-lg)", fontWeight: 500, lineHeight: "var(--s-leading-tight)", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sample || font.name}
                    </strong>
                    <small style={{ display: "block", marginTop: "var(--s-space-4)", color: "var(--db-muted)", fontFamily: "var(--s-font-mono)", fontSize: "var(--s-size-xs)" }}>
                      {font.name} · {ready ? font.source : "license file needed"}
                    </small>
                  </span>
                  {active && <Check size={14} aria-label="Active font" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
