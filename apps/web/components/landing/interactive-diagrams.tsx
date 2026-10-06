"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import {
  Button, Card, CardContent, CardHeader, CardTitle,
  Badge, Input, Label, Switch, Slider, Progress,
  Checkbox, Separator, Tabs, TabsList,
  TabsTrigger, TabsContent, Alert, AlertTitle,
  KPI,
} from "@sigil-ui/components";
import { Copy, Check, Search } from "@/components/icons";

/* ================================================================== */
/*  1. TokenFlowDiagram                                                */
/* ================================================================== */

const TOKEN_LINES = [
  { category: "Colors", token: "primary", value: "oklch(0.65 0.18 275)", affects: ["primary"] },
  { category: "Colors", token: "surface", value: "#141419", affects: ["surface"] },
  { category: "Typography", token: "display", value: 'ABC Monument Grotesk', affects: ["font"] },
  { category: "Radius", token: "card", value: "0px", affects: ["radius"] },
] satisfies readonly { category: string; token: string; value: string; affects: readonly string[] }[];

const CSS_LINES: { prop: string; value: string; tags: readonly string[] }[] = [
  { prop: "--s-primary", value: "oklch(0.65 0.18 275)", tags: ["primary"] },
  { prop: "--s-surface", value: "#141419", tags: ["surface"] },
  { prop: "--s-font-display", value: '"ABC Monument Grotesk"', tags: ["font"] },
  { prop: "--s-radius-card", value: "0px", tags: ["radius"] },
];

function AnimatedArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-2 shrink-0" style={{ minWidth: 64 }}>
      <svg width="64" height="24" viewBox="0 0 64 24" fill="none" className="overflow-visible">
        <line
          x1="0" y1="12" x2="56" y2="12"
          stroke="var(--s-border-strong)"
          strokeWidth="1"
          strokeDasharray="4 3"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0" to="-14"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </line>
        <polygon points="56,6 64,12 56,18" fill="var(--s-border-strong)" />
      </svg>
      <span
        className="font-mono select-none"
        style={{ fontSize: 9, color: "var(--s-text-muted)", letterSpacing: "0.04em" }}
      >
        {label}
      </span>
    </div>
  );
}

export function TokenFlowDiagram({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.documentElement.hasAttribute("data-sigil-preset-switching")) return;
      setCursor((v) => !v);
    }, 530);
    return () => clearInterval(id);
  }, []);

  const isAffected = (tags: readonly string[]) =>
    hovered !== null && tags.includes(hovered);

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row items-stretch gap-0">
        {/* Column 1: Token file */}
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[11px] leading-none select-none mb-2"
            style={{ color: "var(--s-text-muted)", letterSpacing: "0.04em" }}
          >
            sigil.tokens.md
          </div>
          <div
            style={{
              background: "var(--s-surface-sunken)",
              border: "1px solid var(--s-border)",
              borderRadius: 0,
              padding: "12px 12px",
            }}
          >
            {TOKEN_LINES.map((line, i) => {
              const active = hovered !== null && line.affects.includes(hovered);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-1 -mx-1 cursor-default"
                  style={{
                    height: 50,
                    borderRadius: 0,
                    background: active ? "var(--s-primary-muted)" : "transparent",
                    transition: "background 200ms ease",
                  }}
                  onMouseEnter={() => setHovered(line.affects[0])}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--s-text-muted)", width: 10, textAlign: "right" }}>
                    {i === 0 ? "##" : "|"}
                  </span>
                  {i === 0 ? (
                    <span className="font-mono font-semibold" style={{ fontSize: 11, color: "var(--s-text-secondary)" }}>
                      {line.category}
                    </span>
                  ) : (
                    <>
                      <span className="font-mono font-semibold" style={{ fontSize: 11, color: "var(--s-text)" }}>
                        {line.token}
                      </span>
                      <span className="font-mono" style={{ fontSize: 11, color: "var(--s-primary)" }}>
                        {line.value}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
            <div className="h-[50px] flex items-center px-1 -mx-1">
              <span
                className="font-mono"
                style={{
                  fontSize: 11,
                  color: "var(--s-primary)",
                  opacity: cursor ? 1 : 0,
                  transition: "opacity 100ms",
                }}
              >
                ▌
              </span>
            </div>
          </div>
        </div>

        <AnimatedArrow label="compiles" />

        {/* Column 2: CSS Variables */}
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[11px] leading-none select-none mb-2"
            style={{ color: "var(--s-text-muted)", letterSpacing: "0.04em" }}
          >
            tokens.css
          </div>
          <div
            style={{
              background: "var(--s-surface-sunken)",
              border: "1px solid var(--s-border)",
              borderRadius: 0,
              padding: "12px 12px",
            }}
          >
            {CSS_LINES.map((line, i) => {
              const active = isAffected(line.tags);
              return (
                <div
                  key={i}
                  className="flex items-baseline gap-1 px-1 -mx-1"
                  style={{
                    height: 50,
                    borderRadius: 0,
                    background: active ? "var(--s-primary-muted)" : "transparent",
                    transition: "background 200ms ease",
                  }}
                >
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--s-primary)" }}>
                    {line.prop}
                  </span>
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--s-text-muted)" }}>:</span>
                  <span className="font-mono truncate" style={{ fontSize: 11, color: "var(--s-text-secondary)" }}>
                    {line.value}
                  </span>
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--s-text-muted)" }}>;</span>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatedArrow label="updates" />

        {/* Column 3: Live components */}
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[11px] leading-none select-none mb-2"
            style={{ color: "var(--s-text-muted)", letterSpacing: "0.04em" }}
          >
            Components
          </div>
          <div className="flex flex-col gap-3">
            <div
              style={{
                transition: "box-shadow 200ms ease, transform 200ms ease",
                boxShadow: isAffected(["primary"]) ? "0 0 0 2px var(--s-primary)" : "none",
                transform: isAffected(["primary"]) ? "scale(1.02)" : "scale(1)",
              }}
            >
              <Button size="sm">Get Started</Button>
            </div>
            <div
              style={{
                transition: "box-shadow 200ms ease, transform 200ms ease",
                boxShadow:
                  isAffected(["surface"]) || isAffected(["radius"])
                    ? "0 0 0 2px var(--s-primary)"
                    : "none",
                transform:
                  isAffected(["surface"]) || isAffected(["radius"])
                    ? "scale(1.02)"
                    : "scale(1)",
              }}
            >
              <Card className="w-full">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs">Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <span className="text-[11px]" style={{ color: "var(--s-text-muted)" }}>
                    Manage your project settings
                  </span>
                </CardContent>
              </Card>
            </div>
            <div
              style={{
                transition: "box-shadow 200ms ease, transform 200ms ease",
                boxShadow: isAffected(["font"]) ? "0 0 0 2px var(--s-primary)" : "none",
                transform: isAffected(["font"]) ? "scale(1.02)" : "scale(1)",
              }}
            >
              <Input placeholder="Search components..." className="h-8 text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  2. ComponentShowcaseGrid                                           */
/* ================================================================== */

type ShowcaseCell = {
  name: string;
  variants?: number;
  render: () => ReactNode;
};

const UI_CELLS: ShowcaseCell[] = [
  {
    name: "Button",
    variants: 6,
    render: () => (
      <div className="flex gap-2 flex-wrap">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="secondary">Secondary</Button>
      </div>
    ),
  },
  {
    name: "Card",
    variants: 3,
    render: () => (
      <Card className="w-full">
        <CardHeader className="p-2.5 pb-1">
          <CardTitle className="text-[11px]">Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="p-2.5 pt-0">
          <span className="text-[10px]" style={{ color: "var(--s-text-muted)" }}>
            Manage settings
          </span>
        </CardContent>
      </Card>
    ),
  },
  {
    name: "Input",
    variants: 4,
    render: () => (
      <Input
        placeholder="Search components..."
        className="h-7 text-[10px] w-full"
        iconLeft={<Search size={12} style={{ color: "var(--s-text-muted)" }} />}
      />
    ),
  },
  {
    name: "Tabs",
    variants: 2,
    render: () => (
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="h-7 p-0.5">
          <TabsTrigger value="code" className="text-[10px] px-2 py-0.5 h-6">Code</TabsTrigger>
          <TabsTrigger value="preview" className="text-[10px] px-2 py-0.5 h-6">Preview</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  },
  {
    name: "Checkbox + Switch",
    variants: 2,
    render: () => (
      <div className="flex flex-col gap-2 w-full">
        <Checkbox label="Accept terms" />
        <Switch defaultChecked />
      </div>
    ),
  },
  {
    name: "Slider + Progress",
    variants: 3,
    render: () => (
      <div className="flex flex-col gap-3 w-full">
        <Slider defaultValue={[65]} className="w-full" />
        <Progress value={40} className="w-full" />
      </div>
    ),
  },
  {
    name: "Alert",
    variants: 4,
    render: () => (
      <Alert variant="info" className="p-2 w-full">
        <AlertTitle className="text-[10px]">Deploy complete</AlertTitle>
      </Alert>
    ),
  },
  {
    name: "KPI",
    variants: 2,
    render: () => (
      <KPI label="Users" value="2,847" change="+12%" trend="up" className="p-2 text-[10px] border-0 w-full" />
    ),
  },
];

const LAYOUT_CELLS: ShowcaseCell[] = [
  {
    name: "Stack",
    variants: 2,
    render: () => (
      <div className="flex flex-col gap-1.5 w-full">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              height: 16,
              background: `color-mix(in oklch, var(--s-primary) ${30 + n * 15}%, transparent)`,
              border: "1px solid var(--s-border-muted)",
              borderRadius: 0,
            }}
          />
        ))}
        <span className="font-mono text-center" style={{ fontSize: 8, color: "var(--s-text-muted)" }}>
          gap: 6px
        </span>
      </div>
    ),
  },
  {
    name: "Grid",
    variants: 3,
    render: () => (
      <div className="grid grid-cols-2 gap-1 w-full">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            style={{
              height: 50,
              background: "var(--s-surface-elevated)",
              border: "1px solid var(--s-border)",
              borderRadius: 0,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    name: "Dividers",
    variants: 3,
    render: () => (
      <div className="flex flex-col gap-2 w-full items-stretch">
        <Separator />
        <div style={{ borderTop: "1px dashed var(--s-border)", width: "100%" }} />
        <div style={{ borderTop: "1px dotted var(--s-border)", width: "100%" }} />
      </div>
    ),
  },
  {
    name: "Frame",
    variants: 1,
    render: () => (
      <div
        className="flex items-center justify-center w-full"
        style={{
          height: 50,
          border: "2px solid var(--s-border-strong)",
          borderRadius: 0,
          background: "var(--s-surface)",
        }}
      >
        <span className="font-mono" style={{ fontSize: 9, color: "var(--s-text-muted)" }}>content</span>
      </div>
    ),
  },
];

const TAB_CONFIG: Record<string, ShowcaseCell[]> = {
  UI: UI_CELLS,
  Layout: LAYOUT_CELLS,
};

const CELL_STYLE: React.CSSProperties = {
  minHeight: 150,
  padding: "10px 10px 6px",
  borderRadius: 0,
  border: "1px solid var(--s-border-muted)",
  background: "var(--s-surface)",
};

export function ComponentShowcaseGrid({ className }: { className?: string }) {
  const [tab, setTab] = useState("UI");
  const cells = TAB_CONFIG[tab] ?? UI_CELLS;

  return (
    <div className={className}>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          {Object.keys(TAB_CONFIG).map((t) => (
            <TabsTrigger key={t} value={t} className="text-xs px-3">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(TAB_CONFIG).map(([key, items]) => (
          <TabsContent key={key} value={key}>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              }}
            >
              {items.map((cell) => (
                <div
                  key={cell.name}
                  className="group flex flex-col"
                  style={CELL_STYLE}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--s-border-strong)";
                    e.currentTarget.style.background = "var(--s-surface-elevated)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--s-border-muted)";
                    e.currentTarget.style.background = "var(--s-surface)";
                  }}
                >
                  <div className="flex items-center justify-center flex-1 w-full">
                    {cell.render()}
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-2 pt-1.5" style={{ borderTop: "1px solid var(--s-border-muted)" }}>
                    <span
                      className="font-mono leading-none select-none"
                      style={{ fontSize: 10, color: "var(--s-text-muted)", letterSpacing: "0.02em" }}
                    >
                      {cell.name}
                    </span>
                    {cell.variants && (
                      <span
                        className="font-mono leading-none select-none"
                        style={{ fontSize: 9, color: "var(--s-text-subtle)" }}
                      >
                        {cell.variants} variants
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

/* ================================================================== */
/*  3. PresetTransitionDemo                                            */
/* ================================================================== */

type PresetTheme = {
  name: string;
  vars: Record<string, string>;
};

const PRESET_TRIOS: PresetTheme[][] = [
  [
    {
      name: "sigil",
      vars: {
        "--s-primary": "oklch(0.65 0.18 275)",
        "--s-primary-hover": "oklch(0.58 0.2 275)",
        "--s-primary-contrast": "oklch(1 0 0)",
        "--s-surface": "oklch(0.12 0.012 280)",
        "--s-surface-elevated": "oklch(0.16 0.012 280)",
        "--s-text": "oklch(0.93 0.005 260)",
        "--s-text-muted": "oklch(0.6 0.005 260)",
        "--s-border": "oklch(0.24 0.008 280)",
        "--s-border-muted": "oklch(0.2 0.006 280)",
        "--s-radius-card": "0px",
        "--s-radius-button": "0px",
        "--s-radius-input": "0px",
        "--s-radius-badge": "0px",
      },
    },
    {
      name: "forge",
      vars: {
        "--s-primary": "oklch(0.68 0.2 45)",
        "--s-primary-hover": "oklch(0.62 0.22 45)",
        "--s-primary-contrast": "oklch(0.08 0 0)",
        "--s-surface": "oklch(0.14 0.008 40)",
        "--s-surface-elevated": "oklch(0.18 0.008 40)",
        "--s-text": "oklch(0.92 0.006 50)",
        "--s-text-muted": "oklch(0.56 0.005 50)",
        "--s-border": "oklch(0.24 0.01 40)",
        "--s-border-muted": "oklch(0.19 0.008 40)",
        "--s-radius-card": "0px",
        "--s-radius-button": "0px",
        "--s-radius-input": "0px",
        "--s-radius-badge": "0px",
      },
    },
    {
      name: "noir",
      vars: {
        "--s-primary": "#d97706",
        "--s-primary-hover": "#b45309",
        "--s-primary-contrast": "#000000",
        "--s-surface": "#0a0a0a",
        "--s-surface-elevated": "#141414",
        "--s-text": "#e8e8e8",
        "--s-text-muted": "#888888",
        "--s-border": "#1a1a1a",
        "--s-border-muted": "#111111",
        "--s-radius-card": "0px",
        "--s-radius-button": "0px",
        "--s-radius-input": "0px",
        "--s-radius-badge": "0px",
      },
    },
  ],
  [
    {
      name: "fang",
      vars: {
        "--s-primary": "#84cc16",
        "--s-primary-hover": "#a3e635",
        "--s-primary-contrast": "#000000",
        "--s-surface": "#0a0a0a",
        "--s-surface-elevated": "#141414",
        "--s-text": "#ffffff",
        "--s-text-muted": "#737373",
        "--s-border": "#1a1a1a",
        "--s-border-muted": "#111111",
        "--s-radius-card": "0px",
        "--s-radius-button": "0px",
        "--s-radius-input": "0px",
        "--s-radius-badge": "0px",
      },
    },
    {
      name: "anvil",
      vars: {
        "--s-primary": "#1e40af",
        "--s-primary-hover": "#1e3a8a",
        "--s-primary-contrast": "#ffffff",
        "--s-surface": "#1a1a1a",
        "--s-surface-elevated": "#222222",
        "--s-text": "#e0ddd8",
        "--s-text-muted": "#7a7874",
        "--s-border": "#3a3a3a",
        "--s-border-muted": "#2a2a2a",
        "--s-radius-card": "0px",
        "--s-radius-button": "2px",
        "--s-radius-input": "2px",
        "--s-radius-badge": "2px",
      },
    },
    {
      name: "dusk",
      vars: {
        "--s-primary": "oklch(0.7 0.2 320)",
        "--s-primary-hover": "oklch(0.63 0.22 320)",
        "--s-primary-contrast": "#ffffff",
        "--s-surface": "oklch(0.12 0.02 290)",
        "--s-surface-elevated": "oklch(0.16 0.02 290)",
        "--s-text": "oklch(0.93 0.01 280)",
        "--s-text-muted": "oklch(0.6 0.01 280)",
        "--s-border": "oklch(0.24 0.015 290)",
        "--s-border-muted": "oklch(0.19 0.012 290)",
        "--s-radius-card": "8px",
        "--s-radius-button": "6px",
        "--s-radius-input": "6px",
        "--s-radius-badge": "999px",
      },
    },
  ],
];

const TRANSITION_CSS = `
.preset-transition-col,
.preset-transition-col * {
  transition:
    background-color 500ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 500ms cubic-bezier(0.16, 1, 0.3, 1),
    color 500ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 500ms cubic-bezier(0.16, 1, 0.3, 1),
    border-radius 500ms cubic-bezier(0.16, 1, 0.3, 1);
}`;

function PresetColumn({ theme }: { theme: PresetTheme }) {
  return (
    <div
      className="preset-transition-col flex-1 flex flex-col gap-3 p-4 min-w-0"
      style={{
        ...(theme.vars as React.CSSProperties),
        background: "var(--s-surface)",
        border: "1px solid var(--s-border)",
        borderRadius: 0,
      }}
    >
      <span
        className="font-mono font-semibold select-none"
        style={{ fontSize: 11, color: "var(--s-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {theme.name}
      </span>
      <Button size="sm">Action</Button>
      <Card className="w-full">
        <CardHeader className="p-2.5 pb-1">
          <CardTitle className="text-[11px]">Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-2.5 pt-0">
          <span className="text-[10px]" style={{ color: "var(--s-text-muted)" }}>
            Token-driven styling
          </span>
        </CardContent>
      </Card>
      <Badge size="sm">Active</Badge>
      <Input placeholder="Type here..." className="h-7 text-[10px]" />
    </div>
  );
}

export function PresetTransitionDemo({ className }: { className?: string }) {
  const [trioIdx, setTrioIdx] = useState(0);
  const trio = PRESET_TRIOS[trioIdx]!;

  return (
    <div className={className}>
      <style dangerouslySetInnerHTML={{ __html: TRANSITION_CSS }} />

      <div className="flex items-center gap-2 mb-4">
        {PRESET_TRIOS.map((t, i) => (
          <button
            key={i}
            onClick={() => setTrioIdx(i)}
            className="font-mono cursor-pointer"
            style={{
              fontSize: 11,
              padding: "4px 10px",
              border: "1px solid",
              borderRadius: 0,
              borderColor: i === trioIdx ? "var(--s-primary)" : "var(--s-border-muted)",
              background: i === trioIdx ? "var(--s-primary-muted)" : "transparent",
              color: i === trioIdx ? "var(--s-primary)" : "var(--s-text-muted)",
              transition: "all 200ms ease",
            }}
          >
            {t.map((p) => p.name).join(" · ")}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {trio.map((theme) => (
          <PresetColumn key={`${trioIdx}-${theme.name}`} theme={theme} />
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  4. CodeExample                                                     */
/* ================================================================== */

type CodeExampleProps = {
  filename: string;
  language: "tsx" | "css" | "md" | "bash";
  code: string;
  highlightLines?: number[];
  className?: string;
};

function highlightSyntax(code: string, language: string): ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const spans: ReactNode[] = [];
    let remaining = line;
    let key = 0;

    const push = (text: string, color: string) => {
      spans.push(<span key={key++} style={{ color }}>{text}</span>);
    };

    if (language === "css") {
      const propMatch = remaining.match(/^(\s*)([\w-]+)(\s*:\s*)(.+?)(;?)$/);
      if (propMatch) {
        push(propMatch[1], "");
        push(propMatch[2], "var(--s-primary)");
        push(propMatch[3], "var(--s-text-muted)");
        push(propMatch[4], "var(--s-text-secondary)");
        if (propMatch[5]) push(propMatch[5], "var(--s-text-muted)");
        return <span key={i}>{spans}</span>;
      }
      push(remaining, "var(--s-text)");
      return <span key={i}>{spans}</span>;
    }

    if (language === "bash") {
      if (remaining.startsWith("#")) {
        push(remaining, "var(--s-text-muted)");
        return <span key={i}>{spans}</span>;
      }
      const parts = remaining.split(/(\s+)/);
      parts.forEach((part, pi) => {
        if (pi === 0) push(part, "var(--s-success)");
        else push(part, "var(--s-text)");
      });
      return <span key={i}>{spans}</span>;
    }

    /* tsx / md: regex-based highlighting */
    const tokens: { re: RegExp; color: string }[] = [
      { re: /\/\/.*$/gm, color: "var(--s-text-muted)" },
      { re: /\b(import|export|from|const|let|var|function|return|if|else|type|interface|default|as|async|await|new|class|extends)\b/g, color: "var(--s-primary)" },
      { re: /(["'`])(?:(?!\1).)*\1/g, color: "var(--s-success)" },
      { re: /\b\d+\.?\d*\b/g, color: "var(--s-warning)" },
      { re: /\b[A-Z][a-zA-Z0-9]*\b/g, color: "var(--s-info)" },
    ];

    type Seg = { start: number; end: number; text: string; color: string };
    const segments: Seg[] = [];

    for (const { re, color } of tokens) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(remaining)) !== null) {
        segments.push({ start: m.index, end: m.index + m[0].length, text: m[0], color });
      }
    }

    segments.sort((a, b) => a.start - b.start);

    const merged: Seg[] = [];
    for (const seg of segments) {
      if (merged.length > 0 && seg.start < merged[merged.length - 1]!.end) continue;
      merged.push(seg);
    }

    let pos = 0;
    for (const seg of merged) {
      if (seg.start > pos) push(remaining.slice(pos, seg.start), "var(--s-text)");
      push(seg.text, seg.color);
      pos = seg.end;
    }
    if (pos < remaining.length) push(remaining.slice(pos), "var(--s-text)");
    if (spans.length === 0) push("", "var(--s-text)");

    return <span key={i}>{spans}</span>;
  });
}

export function CodeExample({ filename, language, code, highlightLines = [], className }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  const highlighted = highlightSyntax(code, language);
  const hlSet = new Set(highlightLines);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div
      className={className}
      style={{
        border: "1px solid var(--s-border)",
        borderRadius: 0,
        background: "var(--s-surface-sunken)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3"
        style={{
          height: 50,
          borderBottom: "1px solid var(--s-border)",
          background: "var(--s-surface)",
        }}
      >
        <span className="font-mono select-none" style={{ fontSize: 11, color: "var(--s-text-muted)" }}>
          {filename}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1 font-mono cursor-pointer"
          style={{
            fontSize: 10,
            color: copied ? "var(--s-success)" : "var(--s-text-muted)",
            background: "none",
            border: "none",
            padding: "2px 6px",
            transition: "color 200ms ease",
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto">
        <pre className="m-0 p-0" style={{ fontFamily: "var(--s-font-mono)", fontSize: 12, lineHeight: "22px" }}>
          <code>
            {highlighted.map((lineNode, i) => (
              <div
                key={i}
                className="flex"
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  background: hlSet.has(i + 1)
                    ? "color-mix(in oklch, var(--s-primary) 8%, transparent)"
                    : "transparent",
                }}
              >
                <span
                  className="select-none shrink-0 text-right"
                  style={{
                    width: 32,
                    paddingRight: 12,
                    color: "var(--s-text-subtle)",
                    fontSize: 10,
                    fontFamily: "var(--s-font-mono)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 whitespace-pre">{lineNode}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  5. ParallaxSection                                                 */
/* ================================================================== */

type ParallaxSectionProps = {
  speed?: number;
  children: ReactNode;
  className?: string;
};

export function ParallaxSection({ speed = 0.05, children, className }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReduced.current) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const raw = (center - viewCenter) * speed;
        const clamped = Math.max(-12, Math.min(12, raw));
        setOffset(clamped);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        willChange: "transform",
        transition: "transform 100ms linear",
      }}
    >
      {children}
    </div>
  );
}

/* ================================================================== */
/*  6. MarkdownPreview                                                 */
/* ================================================================== */

type MarkdownPreviewProps = {
  content: string;
  onTokenHover?: (token: string) => void;
  highlightedToken?: string;
  className?: string;
};

type ParsedSection = {
  heading: string;
  rows: { token: string; value: string }[];
};

function parseMarkdownTokens(content: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    const headingMatch = trimmed.match(/^##\s+(.+)$/);
    if (headingMatch) {
      current = { heading: headingMatch[1], rows: [] };
      sections.push(current);
      continue;
    }

    if (!current) continue;
    if (trimmed.startsWith("|") && !trimmed.includes("---")) {
      const cells = trimmed.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 2) {
        current.rows.push({ token: cells[0], value: cells[1] });
      }
    }
  }
  return sections;
}

function valueColor(value: string): string {
  if (value.startsWith("oklch")) return "var(--s-primary)";
  if (value.startsWith("#")) return "var(--s-info)";
  if (/^\d/.test(value)) return "var(--s-warning)";
  return "var(--s-success)";
}

export function MarkdownPreview({ content, onTokenHover, highlightedToken, className }: MarkdownPreviewProps) {
  const sections = parseMarkdownTokens(content);

  return (
    <div
      className={className}
      style={{
        border: "1px solid var(--s-border)",
        borderRadius: 0,
        background: "var(--s-surface-sunken)",
        overflow: "hidden",
      }}
    >
      {sections.map((section, si) => (
        <div key={si}>
          <div
            className="flex items-center gap-2 px-3"
            style={{
              height: 50,
              borderBottom: "1px solid var(--s-border-muted)",
              background: "var(--s-surface)",
            }}
          >
            <span className="font-mono font-semibold" style={{ fontSize: 10, color: "var(--s-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {section.heading}
            </span>
          </div>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {section.rows.map((row, ri) => {
                const active = highlightedToken === row.token;
                return (
                  <tr
                    key={ri}
                    className="cursor-default"
                    style={{
                      background: active ? "var(--s-primary-muted)" : "transparent",
                      transition: "background 150ms ease",
                    }}
                    onMouseEnter={() => onTokenHover?.(row.token)}
                    onMouseLeave={() => onTokenHover?.("")}
                  >
                    <td
                      className="font-mono font-semibold px-3"
                      style={{
                        fontSize: 11,
                        color: "var(--s-text)",
                        height: 50,
                        borderBottom: "1px solid var(--s-border-muted)",
                        width: "40%",
                      }}
                    >
                      {row.token}
                    </td>
                    <td
                      className="font-mono px-3"
                      style={{
                        fontSize: 11,
                        color: valueColor(row.value),
                        height: 50,
                        borderBottom: "1px solid var(--s-border-muted)",
                      }}
                    >
                      {row.value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
