"use client";

import { useState, useCallback, useRef, type ReactNode } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Input,
  Label,
  Switch,
  Checkbox,
  Slider,
  Progress,
  Avatar,
  KPI,
  Alert,
  AlertTitle,
  Toggle,
  LoadingSpinner,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@sigil-ui/components";
import { Copy, Check } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Component map — maps a name to a rendered preview                  */
/* ------------------------------------------------------------------ */

const COMPONENT_MAP: Record<string, () => ReactNode> = {
  Button: () => <Button>Click me</Button>,
  "Button.primary": () => <Button variant="primary">Get Started</Button>,
  "Button.secondary": () => <Button variant="secondary">View Docs</Button>,
  "Button.ghost": () => <Button variant="ghost">Learn more</Button>,
  Card: () => (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>Manage your workspace and team settings.</CardContent>
    </Card>
  ),
  Input: () => <Input placeholder="Search components..." />,
  Badge: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge>New</Badge>
      <Badge variant="outline">v2.0</Badge>
    </div>
  ),
  Switch: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Switch defaultChecked />
      <Label>Dark mode</Label>
    </div>
  ),
  Checkbox: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Checkbox defaultChecked />
      <Label>Accept terms</Label>
    </div>
  ),
  Slider: () => <Slider defaultValue={[65]} />,
  Progress: () => <Progress value={60} />,
  Avatar: () => <Avatar fallback="KL" />,
  KPI: () => <KPI label="Revenue" value="$4.2k" change="+8%" trend="up" />,
  Alert: () => (
    <Alert variant="warning">
      <AlertTitle>Warning alert</AlertTitle>
    </Alert>
  ),
  Toggle: () => (
    <Toggle pressed defaultPressed>
      Bold
    </Toggle>
  ),
  Spinner: () => <LoadingSpinner variant="braille" size="lg" />,
  Separator: () => (
    <div style={{ width: "100%" }}>
      <Separator />
    </div>
  ),
  Tabs: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
  Select: () => (
    <Select defaultValue="react">
      <SelectTrigger>
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
        <SelectItem value="svelte">Svelte</SelectItem>
      </SelectContent>
    </Select>
  ),
  Calendar: () => (
    <div style={{ fontFamily: "var(--s-font-mono)", fontSize: 11 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          textAlign: "center",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((d) => (
          <span
            key={d}
            style={{
              padding: 4,
              background:
                d === 6 ? "var(--s-primary)" : "transparent",
              color:
                d === 6
                  ? "var(--s-primary-contrast, #fff)"
                  : "var(--s-text-secondary)",
              borderRadius: "var(--s-radius-sm, 0px)",
            }}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  ),
  DataTable: () => (
    <table
      style={{
        width: "100%",
        fontFamily: "var(--s-font-mono)",
        fontSize: 10,
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "4px 8px", borderBottom: "1px solid var(--s-border)", fontSize: 9, textTransform: "uppercase", color: "var(--s-text-muted)" }}>
            name
          </th>
          <th style={{ textAlign: "left", padding: "4px 8px", borderBottom: "1px solid var(--s-border)", fontSize: 9, textTransform: "uppercase", color: "var(--s-text-muted)" }}>
            status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: "4px 8px", borderBottom: "1px solid var(--s-border-muted)" }}>alpha</td>
          <td style={{ padding: "4px 8px", borderBottom: "1px solid var(--s-border-muted)", color: "var(--s-success)" }}>ok</td>
        </tr>
        <tr>
          <td style={{ padding: "4px 8px" }}>beta</td>
          <td style={{ padding: "4px 8px", color: "var(--s-success)" }}>ok</td>
        </tr>
      </tbody>
    </table>
  ),
  Dialog: () => (
    <div
      style={{
        padding: "16px 24px",
        border: "1px solid var(--s-border)",
        background: "var(--s-surface)",
        fontFamily: "var(--s-font-mono)",
        fontSize: 11,
        color: "var(--s-text-muted)",
        textAlign: "center",
      }}
    >
      [Dialog]
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Default code snippets                                              */
/* ------------------------------------------------------------------ */

const DEFAULT_CODES: Record<string, string> = {
  Button: `<Button variant="primary">\n  Click me\n</Button>`,
  "Button.primary": `<Button variant="primary">\n  Get Started\n</Button>`,
  "Button.secondary": `<Button variant="secondary">\n  View Docs\n</Button>`,
  "Button.ghost": `<Button variant="ghost">\n  Learn more\n</Button>`,
  Card: `<Card>\n  <CardHeader>\n    <CardTitle>Dashboard</CardTitle>\n  </CardHeader>\n  <CardContent>\n    Manage your workspace.\n  </CardContent>\n</Card>`,
  Input: `<Input placeholder="Search..." />`,
  Badge: `<Badge>New</Badge>\n<Badge variant="outline">v2.0</Badge>`,
  Switch: `<Switch defaultChecked />\n<Label>Dark mode</Label>`,
  Checkbox: `<Checkbox defaultChecked />\n<Label>Accept terms</Label>`,
  Slider: `<Slider defaultValue={65} />`,
  Progress: `<Progress value={60} />`,
  Avatar: `<Avatar fallback="KL" />`,
  KPI: `<KPI\n  label="Revenue"\n  value="$4.2k"\n  change="+8%"\n  trend="up"\n/>`,
  Alert: `<Alert variant="warning">\n  <AlertTitle>Warning alert</AlertTitle>\n</Alert>`,
  Toggle: `<Toggle pressed>Bold</Toggle>`,
  Spinner: `<LoadingSpinner\n  variant="braille"\n  size="lg"\n/>`,
  Separator: `<Separator />`,
  Tabs: `<Tabs defaultValue="tab1">\n  <TabsList>\n    <TabsTrigger value="tab1">\n      Tab 1\n    </TabsTrigger>\n    <TabsTrigger value="tab2">\n      Tab 2\n    </TabsTrigger>\n  </TabsList>\n</Tabs>`,
  Select: `<Select defaultValue="react">\n  <SelectTrigger>\n    <SelectValue />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="react">React</SelectItem>\n    <SelectItem value="vue">Vue</SelectItem>\n    <SelectItem value="svelte">Svelte</SelectItem>\n  </SelectContent>\n</Select>`,
  Calendar: `{days.map(d => (\n  <span\n    style={{\n      background: d === 6\n        ? "var(--s-primary)"\n        : "transparent",\n    }}\n  >\n    {d}\n  </span>\n))}`,
  DataTable: `<table>\n  <thead>\n    <tr>\n      <th>name</th>\n      <th>status</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>alpha</td>\n      <td>ok</td>\n    </tr>\n  </tbody>\n</table>`,
  Dialog: `<Dialog>\n  <DialogTrigger asChild>\n    <Button>Open</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Title</DialogTitle>\n  </DialogContent>\n</Dialog>`,
};

/* ------------------------------------------------------------------ */
/*  Token usage per component                                          */
/* ------------------------------------------------------------------ */

const TOKEN_MAP: Record<string, string[]> = {
  Button: ["--s-primary", "--s-radius-button", "--s-font-weight-button"],
  Card: ["--s-surface", "--s-border", "--s-radius-card", "--s-shadow-card"],
  Input: ["--s-surface", "--s-border", "--s-radius-input", "--s-font-mono"],
  Badge: ["--s-primary", "--s-radius-badge", "--s-font-size-xs"],
  Switch: ["--s-primary", "--s-radius-full", "--s-duration-fast"],
  Checkbox: ["--s-primary", "--s-radius-sm", "--s-border"],
  Slider: ["--s-primary", "--s-radius-full"],
  Progress: ["--s-primary", "--s-radius-full", "--s-surface-sunken"],
  Avatar: ["--s-primary", "--s-radius-full", "--s-font-weight-medium"],
  KPI: ["--s-success", "--s-text-muted", "--s-font-mono"],
  Alert: ["--s-warning", "--s-border", "--s-radius-md"],
  Toggle: ["--s-surface-elevated", "--s-border", "--s-radius-sm"],
  Spinner: ["--s-text-muted", "--s-font-mono"],
  Separator: ["--s-border-muted"],
  Tabs: ["--s-surface", "--s-primary", "--s-radius-md", "--s-border"],
  Select: ["--s-surface", "--s-border", "--s-radius-input"],
  Calendar: ["--s-primary", "--s-radius-sm", "--s-font-mono"],
  DataTable: ["--s-border", "--s-font-mono", "--s-success"],
  Dialog: ["--s-surface", "--s-border", "--s-shadow-lg", "--s-radius-lg"],
};

/* ------------------------------------------------------------------ */
/*  LiveComponent                                                      */
/* ------------------------------------------------------------------ */

export interface LiveComponentProps {
  name: string;
  defaultCode?: string;
  className?: string;
  compact?: boolean;
}

export function LiveComponent({
  name,
  defaultCode,
  className,
  compact = false,
}: LiveComponentProps) {
  const initialCode = defaultCode ?? DEFAULT_CODES[name] ?? `<${name} />`;
  const [code, setCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const renderFn = COMPONENT_MAP[name];
  const tokens = TOKEN_MAP[name] ?? [];
  const lines = code.split("\n");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  const previewArea = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: compact ? 100 : 200,
        padding: compact ? 12 : 24,
        background: "var(--s-background)",
        borderBottom: "1px solid var(--s-border)",
      }}
    >
      {renderFn ? renderFn() : (
        <span style={{ color: "var(--s-text-muted)", fontFamily: "var(--s-font-mono)", fontSize: 11 }}>
          [{name}]
        </span>
      )}
    </div>
  );

  const codeArea = (
    <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 24,
          height: 24,
          border: "1px solid var(--s-border-muted)",
          background: "var(--s-surface)",
          color: copied ? "var(--s-success)" : "var(--s-text-muted)",
          cursor: "pointer",
          padding: 0,
        }}
        aria-label="Copy code"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr",
          height: "100%",
          overflow: "auto",
          background: "var(--s-surface-sunken, var(--s-background))",
          fontFamily: "var(--s-font-mono, monospace)",
          fontSize: compact ? 10 : 11,
          lineHeight: 1.6,
        }}
      >
        <div
          style={{
            padding: compact ? "8px 4px" : "12px 4px",
            textAlign: "right",
            color: "var(--s-text-subtle, var(--s-text-muted))",
            userSelect: "none",
            borderRight: "1px solid var(--s-border-muted)",
          }}
          aria-hidden="true"
        >
          {lines.map((_, i) => (
            <div key={i} style={{ paddingRight: 4 }}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={{
            width: "100%",
            height: "100%",
            padding: compact ? "8px 8px" : "12px 8px",
            margin: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--s-text)",
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            resize: "none",
            whiteSpace: "pre",
            overflowWrap: "normal",
            overflowX: "auto",
          }}
        />
      </div>
    </div>
  );

  const tokensBar = tokens.length > 0 && (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        padding: "6px 8px",
        borderTop: "1px solid var(--s-border-muted)",
        background: "var(--s-surface-sunken, var(--s-background))",
      }}
    >
      {tokens.map((t) => (
        <span
          key={t}
          style={{
            fontFamily: "var(--s-font-mono, monospace)",
            fontSize: 9,
            padding: "1px 5px",
            border: "1px solid var(--s-border-muted)",
            color: "var(--s-text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );

  if (compact) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--s-border)",
          background: "var(--s-surface)",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid var(--s-border)",
            background: "var(--s-surface-sunken, var(--s-background))",
          }}
        >
          {(["preview", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "5px 8px",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid var(--s-primary)" : "2px solid transparent",
                background: "transparent",
                color: activeTab === tab ? "var(--s-text)" : "var(--s-text-muted)",
                fontFamily: "var(--s-font-mono, monospace)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {activeTab === "preview" ? previewArea : codeArea}
        </div>
        {tokensBar}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--s-border)",
        background: "var(--s-surface)",
        overflow: "hidden",
      }}
    >
      {previewArea}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid var(--s-border)",
          background: "var(--s-surface-sunken, var(--s-background))",
        }}
      >
        <span
          style={{
            padding: "5px 12px",
            fontFamily: "var(--s-font-mono, monospace)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--s-text-muted)",
            borderBottom: "2px solid var(--s-primary)",
          }}
        >
          code
        </span>
      </div>
      <div style={{ minHeight: 150, display: "flex", flexDirection: "column" }}>
        {codeArea}
      </div>
      {tokensBar}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LiveComponentGrid                                                  */
/* ------------------------------------------------------------------ */

const GRID_CELLS = [
  "Button",
  "Card",
  "Input",
  "Tabs",
  "Calendar",
  "DataTable",
  "Alert",
] as const;

const VARIANT_COUNTS: Record<string, number> = {
  Button: 4,
  Card: 2,
  Input: 3,
  Tabs: 1,
  Calendar: 1,
  DataTable: 1,
  Alert: 3,
  Dialog: 2,
};

export function ComponentGalleryCTA() {
  return (
    <div
      data-slot="component-gallery-cta"
      className="relative col-span-full min-w-0 overflow-hidden border border-[var(--s-border)] bg-[var(--s-background)]"
      style={{
        minHeight: "calc(6 * var(--s-grid-cell))",
        background:
          "linear-gradient(115deg, color-mix(in oklch, var(--s-background) 92%, var(--s-primary)) 0%, var(--s-background) 42%, color-mix(in oklch, var(--s-primary) 20%, var(--s-background)) 100%)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.38,
          backgroundImage:
            "linear-gradient(var(--s-border-muted) 1px, transparent 1px), linear-gradient(90deg, var(--s-border-muted) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(90deg, black 0%, black 46%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--s-text) 0 1px, transparent 1px), radial-gradient(circle at 82% 62%, var(--s-text) 0 1px, transparent 1px)",
          backgroundSize: "11px 13px, 17px 19px",
          mixBlendMode: "overlay",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 72% 40%, color-mix(in oklch, var(--s-primary) 28%, transparent), transparent 34%), linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--s-primary) 10%, transparent) 48%, transparent 100%)",
        }}
      />

      <div
        className="relative z-[1] grid min-w-0 grid-cols-1 items-center gap-[var(--s-section-content-gap)] p-[var(--s-card-padding)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        style={{
          minHeight: "calc(6 * var(--s-grid-cell))",
        }}
      >
        <div className="min-w-0">
          <div
            className="inline-flex items-center border border-[var(--s-border)] bg-[var(--s-background)] font-[family-name:var(--s-font-mono)] text-[var(--s-primary)]"
            style={{
              gap: "var(--s-spacing-2, 0.5rem)",
              marginBottom: "var(--s-section-heading-margin-bottom)",
              padding:
                "var(--s-badge-padding-y, 0.375rem) var(--s-badge-padding-x, 0.625rem)",
              fontSize: "var(--s-badge-font-size, 0.625rem)",
              textTransform: "uppercase",
              letterSpacing: "var(--s-tracking-widest, 0.16em)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "var(--s-primary)",
                display: "inline-block",
              }}
            />
            token scaffold to production UI
          </div>
          <h3
            className="break-words text-balance font-[family-name:var(--s-font-display)] font-bold text-[var(--s-text)]"
            style={{
              margin: 0,
              maxWidth: "var(--s-content-max-narrow, 36rem)",
              fontSize: "var(--s-heading-h2-size, clamp(1.75rem, 4vw, 3rem))",
              lineHeight: "var(--s-heading-h2-leading, 1.05)",
              letterSpacing: "var(--s-heading-h2-tracking, -0.03em)",
            }}
          >
            Browse the full component system.
          </h3>
          <p
            className="text-pretty text-[var(--s-text-muted)]"
            style={{
              margin:
                "var(--s-section-description-gap) 0 var(--s-section-content-gap)",
              maxWidth: "var(--s-content-max-narrow, 36rem)",
              lineHeight: "var(--s-body-leading-relaxed, 1.6)",
              fontSize: "var(--s-body-size-sm, 0.875rem)",
            }}
          >
            Start with blueprint-level primitives, then drop in finished components
            that already inherit the active preset.
          </p>
          <div
            className="flex flex-wrap"
            style={{ gap: "var(--s-button-icon-gap, 0.75rem)" }}
          >
            <Button asChild>
              <a href="/components" style={{ textDecoration: "none" }}>
                Browse Components
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/docs/components/button" style={{ textDecoration: "none" }}>
                Read Docs
              </a>
            </Button>
          </div>
        </div>

        <div
          className="relative min-w-0 overflow-hidden border border-[var(--s-border)] bg-[var(--s-background)] shadow-[var(--s-shadow-lg)]"
          style={{
            minHeight: "calc(4 * var(--s-grid-cell))",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(115deg, transparent 0%, transparent 28%, color-mix(in oklch, var(--s-primary) 4%, transparent) 42%, color-mix(in oklch, var(--s-primary) 12%, transparent) 72%, color-mix(in oklch, var(--s-primary) 18%, transparent) 100%)",
            }}
          />
          <div
            className="absolute grid grid-cols-1 gap-[var(--s-section-heading-margin-bottom)] sm:grid-cols-2"
            style={{
              inset: "var(--s-card-padding)",
            }}
          >
            <div
              className="hidden flex-col border border-dashed border-[var(--s-border)] font-[family-name:var(--s-font-mono)] text-[var(--s-text-muted)] sm:flex"
              style={{
                background:
                  "linear-gradient(var(--s-border-muted) 1px, transparent 1px), linear-gradient(90deg, var(--s-border-muted) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {/* Header — matches CardHeader p-6 pb-0 */}
              <div style={{ padding: "24px 24px 0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: "52%", height: 10, background: "var(--s-border)", opacity: 0.45 }} />
                  <div style={{ width: 40, height: 16, border: "1px solid var(--s-border)", opacity: 0.4 }} />
                </div>
              </div>
              {/* Content — matches Card gap-4 (16px) + CardContent p-6 pt-4 */}
              <div style={{ flex: 1, padding: "32px 24px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ height: "var(--s-input-height, 36px)", border: "1px solid var(--s-border)", opacity: 0.5 }} />
                <div style={{ display: "flex", gap: 0, alignItems: "center", height: 6 }}>
                  <div style={{ flex: 1, height: "100%", background: "var(--s-border)", opacity: 0.5 }} />
                  <div style={{ width: "28%", height: "100%", background: "var(--s-border-muted)", opacity: 0.3 }} />
                </div>
                <div style={{ marginTop: "auto", height: 32, background: "var(--s-border)", opacity: 0.35 }} />
              </div>
            </div>
            <Card
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                background: "var(--s-surface-elevated)",
                boxShadow: "var(--s-shadow-md)",
              }}
            >
              <CardHeader>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <CardTitle>Component</CardTitle>
                  <Badge>Live</Badge>
                </div>
              </CardHeader>
              <CardContent style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <Input placeholder="Search components..." />
                  <Progress value={72} />
                  <div style={{ marginTop: "auto" }}>
                    <Button size="sm" style={{ width: "100%" }}>Install</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface LiveComponentGridProps {
  className?: string;
  showCta?: boolean;
}

export function LiveComponentGrid({ className, showCta = true }: LiveComponentGridProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className={`grid min-w-0 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 ${className ?? ""}`}
    >
      {GRID_CELLS.map((name) => {
        const renderFn = COMPONENT_MAP[name];
        const isHovered = hovered === name;
        const variants = VARIANT_COUNTS[name] ?? 1;

        return (
          <div
            key={name}
            onMouseEnter={() => setHovered(name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              border: "1px solid var(--s-border)",
              marginRight: -1,
              marginBottom: -1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: "var(--s-surface)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                padding: 16,
                minHeight: 100,
              }}
            >
              {renderFn ? renderFn() : (
                <span
                  style={{
                    color: "var(--s-text-muted)",
                    fontFamily: "var(--s-font-mono)",
                    fontSize: 11,
                  }}
                >
                  [{name}]
                </span>
              )}
            </div>

            <div
              style={{
                padding: "6px 10px",
                borderTop: "1px solid var(--s-border-muted)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--s-font-mono, monospace)",
                  fontSize: 10,
                  color: "var(--s-text)",
                  fontWeight: 500,
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontFamily: "var(--s-font-mono, monospace)",
                  fontSize: 9,
                  color: "var(--s-text-muted)",
                }}
              >
                {variants} variant{variants !== 1 ? "s" : ""}
              </span>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
                transform: isHovered ? "translateY(0)" : "translateY(100%)",
                transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
                background: "var(--s-surface-sunken, var(--s-background))",
                borderTop: "1px solid var(--s-border)",
                overflow: "auto",
                fontFamily: "var(--s-font-mono, monospace)",
                fontSize: 10,
                lineHeight: 1.6,
                color: "var(--s-text)",
                padding: 10,
                whiteSpace: "pre",
                zIndex: 5,
              }}
            >
              {DEFAULT_CODES[name] ?? `<${name} />`}
            </div>
          </div>
        );
      })}
      {showCta && <ComponentGalleryCTA />}
    </div>
  );
}
