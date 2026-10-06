"use client";

import type { CSSProperties, ReactNode } from "react";
import { Palette, Type, RectangleHorizontal, Space, Layers, Clock, Grid3X3, SquareSlash } from "@/components/icons";

export type TokenPreviewKind =
  | "primary"
  | "mid"
  | "muted"
  | "background"
  | "border"
  | "radius-sm"
  | "radius-md"
  | "duration"
  | "mono"
  | "color"
  | "font"
  | "spacing"
  | "shadow"
  | "layout";

type TokenPreviewGlyphProps = {
  kind: TokenPreviewKind;
  value?: string;
  label?: string;
};

const tokenGlyphBase: CSSProperties = {
  width: 28,
  height: 20,
  border: "var(--s-border-thin, 1px) solid var(--s-border)",
  borderStyle: "var(--s-border-style, solid)",
  borderRadius: "var(--s-radius-sm, 4px)",
  flex: "0 0 auto",
};

export function TokenPreviewGlyph({ kind, value, label }: TokenPreviewGlyphProps) {
  const colorValue =
    value ??
    (kind === "primary"
      ? "var(--s-primary)"
      : kind === "mid"
        ? "var(--hlf-mid)"
        : kind === "background"
          ? "var(--s-background)"
          : "var(--s-text-muted)");

  if (kind === "primary" || kind === "mid" || kind === "background" || kind === "color") {
    return <span aria-hidden="true" style={{ ...tokenGlyphBase, background: colorValue }} />;
  }

  if (kind === "muted") {
    return (
      <span aria-hidden="true" style={{ ...tokenGlyphBase, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--s-text-muted)" }}>
        <Palette size={12} />
      </span>
    );
  }

  if (kind === "border") {
    return (
      <span aria-hidden="true" style={{ ...tokenGlyphBase, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--s-primary)" }}>
        <RectangleHorizontal size={12} />
      </span>
    );
  }

  if (kind === "radius-sm" || kind === "radius-md") {
    return (
      <span aria-hidden="true" style={{ ...tokenGlyphBase, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--s-primary)" }}>
        <SquareSlash size={12} />
      </span>
    );
  }

  if (kind === "font" || kind === "mono") {
    return (
      <span aria-hidden="true" style={{ ...tokenGlyphBase, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--s-primary)" }}>
        <Type size={12} />
      </span>
    );
  }

  if (kind === "spacing") {
    return (
      <span aria-hidden="true" style={{ ...tokenGlyphBase, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--s-primary)" }}>
        <Space size={12} />
      </span>
    );
  }

  if (kind === "shadow") {
    return (
      <span aria-hidden="true" style={{ ...tokenGlyphBase, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--s-primary)" }}>
        <Layers size={12} />
      </span>
    );
  }

  if (kind === "duration") {
    return (
      <span aria-hidden="true" style={{ ...tokenGlyphBase, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--s-primary)" }}>
        <Clock size={12} />
      </span>
    );
  }

  return (
    <span aria-hidden="true" style={{ ...tokenGlyphBase, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--s-primary)" }}>
      <Grid3X3 size={12} />
    </span>
  );
}

export function MarkdownChrome({
  title,
  meta,
  children,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        border: "var(--s-border-thin, 1px) solid var(--s-border)",
        borderStyle: "var(--s-border-style, solid)",
        borderRadius: "var(--s-radius-md, 8px)",
        background: "color-mix(in oklch, var(--s-background) 92%, transparent)",
        color: "var(--s-text)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          borderBottom: "var(--s-border-thin, 1px) var(--s-border-style, solid) var(--s-border)",
          padding: "8px 12px",
          fontFamily: "var(--s-font-mono)",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span>{title}</span>
        {meta ? <span style={{ color: "var(--s-text-muted)" }}>{meta}</span> : null}
      </div>
      {children}
    </div>
  );
}
