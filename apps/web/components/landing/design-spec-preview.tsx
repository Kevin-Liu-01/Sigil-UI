"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@sigil-ui/components";
import { defaultPreset } from "@sigil-ui/presets";
import { compileToCss } from "@sigil-ui/tokens";
import { Check, Code, FileText, Palette, RectangleHorizontal, Rocket, Space } from "@/components/icons";

const COLORS = [
  { label: "Indigo", light: "oklch(0.48 0.19 275)", dark: "oklch(0.78 0.12 275)" },
  { label: "Green", light: "oklch(0.42 0.13 155)", dark: "oklch(0.80 0.13 155)" },
  { label: "Rose", light: "oklch(0.46 0.19 15)", dark: "oklch(0.80 0.11 15)" },
];
const RADII = [{ label: "Square", value: "0px" }, { label: "Rounded", value: "8px" }];
const SPACING = [{ label: "Compact", value: "16px" }, { label: "Relaxed", value: "24px" }];

/** A scoped, compiled token preview: the same components consume each change. */
export function DesignSpecPreview() {
  const [color, setColor] = useState(0);
  const [radius, setRadius] = useState(0);
  const [spacing, setSpacing] = useState(0);
  const [created, setCreated] = useState(false);
  const nameId = useId();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const css = useMemo(() => {
    const base = defaultPreset.tokens;
    const accent = COLORS[color];
    const corner = RADII[radius].value;
    const padding = SPACING[spacing].value;
    return compileToCss({
      ...base,
      colors: { ...base.colors, primary: { light: accent.light, dark: accent.dark }, "primary-hover": { light: accent.light, dark: accent.dark } },
      radius: { ...base.radius, card: corner, button: corner, input: corner, badge: corner },
      cards: { ...base.cards, "header-padding": padding, "content-padding-x": padding, "content-padding-y": padding },
    }, { selector: "[data-design-spec-preview]", darkSelector: "[data-theme='dark'] [data-design-spec-preview]" });
  }, [color, radius, spacing]);

  return (
    <div className="sigil-design-demo">
      <style>{css}</style>
      <div className="sigil-design-controls">
        <div className="sigil-landing-detail-heading"><FileText /><h3>Your design decisions</h3></div>
        <p>Choose a value. The preview updates from the compiled tokens.</p>
        <fieldset>
          <legend><Palette />Accent color</legend>
          <div>
            {COLORS.map((item, i) => <Button key={item.label} size="sm" variant={color === i ? "primary" : "outline"} aria-pressed={color === i} onClick={() => setColor(i)}>{color === i && <Check />}{item.label}</Button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend><RectangleHorizontal />Corners</legend>
          <div>
            {RADII.map((item, i) => <Button key={item.label} size="sm" variant={radius === i ? "primary" : "outline"} aria-pressed={radius === i} onClick={() => setRadius(i)}>{item.label}</Button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend><Space />Card spacing</legend>
          <div>
            {SPACING.map((item, i) => <Button key={item.label} size="sm" variant={spacing === i ? "primary" : "outline"} aria-pressed={spacing === i} onClick={() => setSpacing(i)}>{item.label}</Button>)}
          </div>
        </fieldset>
        <div className="sigil-design-output">
          <span><Code />Compiled CSS · excerpt</span>
          <pre><code>{`--s-primary: ${mounted && resolvedTheme === "dark" ? COLORS[color].dark : COLORS[color].light};\n--s-radius-card: ${RADII[radius].value};\n--s-card-content-padding-x: ${SPACING[spacing].value};`}</code></pre>
        </div>
      </div>
      <div className="sigil-design-result">
        <div className="sigil-landing-detail-heading"><Rocket /><h3>Your components, updated</h3></div>
        <p>The card, input, badge, and button use the same token spec.</p>
        <div data-design-spec-preview>
          <Card>
            <CardHeader><Badge className="w-fit">Project</Badge><CardTitle>Create a workspace</CardTitle></CardHeader>
            <CardContent className="grid gap-[var(--s-space-16)]">
              <Label htmlFor={nameId}>Workspace name</Label>
              <Input id={nameId} defaultValue="Fieldwork" onChange={() => setCreated(false)} />
              <Button onClick={() => setCreated(true)}>{created ? <Check /> : <Rocket />}{created ? "Workspace created" : "Create workspace"}</Button>
            </CardContent>
          </Card>
        </div>
        <p className="sigil-design-note" role="status">{created ? "Created for this preview. No account needed." : "This is a live example. Try the form and change a token."}</p>
      </div>
    </div>
  );
}
