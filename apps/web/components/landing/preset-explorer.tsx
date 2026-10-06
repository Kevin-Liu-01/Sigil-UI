"use client";

import { Bell, Check, Save, Layers, Palette } from "@/components/icons";
import { useId, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Switch } from "@sigil-ui/components";
import { sigilPreset, noirPreset, forgePreset, cipherPreset, arcPreset, fluxPreset } from "@sigil-ui/presets";
import { compileToCss } from "@sigil-ui/tokens";

const presetLabel = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

const PRESETS = [sigilPreset, noirPreset, forgePreset, cipherPreset, arcPreset, fluxPreset];
const PREVIEWS = PRESETS.map((preset) => ({
  ...preset,
  css: compileToCss(preset.tokens, {
    selector: "[data-landing-preset-preview]",
    darkSelector: "[data-theme='dark'] [data-landing-preset-preview]",
  }),
}));

/** Render the shipped presets and components without changing the surrounding site. */
export function PresetExplorer() {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const nameId = useId();
  const notificationsId = useId();
  const preset = PREVIEWS[index];
  return (
    <div className="sigil-landing-preset-explorer">
      <style>{preset.css}</style>
      <div className="sigil-landing-preset-result"><div data-landing-preset-preview className="bg-[var(--s-background)] font-[family-name:var(--s-font-body)] text-[var(--s-text)]">
        <Card>
          <CardHeader>
            <Badge variant="outline" className="w-fit"><Layers />Workspace</Badge>
            <CardTitle>Workspace settings</CardTitle>
            <CardDescription>A working form, styled by the {presetLabel(preset.name)} preset.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-[var(--s-space-16)]">
            <Label htmlFor={nameId}>Workspace name</Label>
            <Input id={nameId} defaultValue="Fieldwork" onChange={() => setSaved(false)} />
            <div className="flex items-center gap-[var(--s-space-12)]">
              <Switch id={notificationsId} defaultChecked />
              <Label htmlFor={notificationsId} className="inline-flex items-center gap-[var(--s-space-8)]"><Bell />Project notifications</Label>
            </div>
            <Button type="button" onClick={() => setSaved(true)}>{saved ? <Check /> : <Save />}Save workspace</Button>
            <span role="status" className="text-[length:var(--s-size-sm)] text-[var(--s-text-muted)]">
              {saved ? "Saved for this preview." : "Changes stay in this preview."}
            </span>
          </CardContent>
        </Card>
      </div></div>
      <div className="sigil-landing-preset-choices">
        <div className="sigil-landing-detail-heading"><Palette /><h3>Choose a preset</h3></div>
        <div className="flex flex-wrap gap-[var(--s-space-8)]" role="group" aria-label="Preview preset">
          {PREVIEWS.map((item, i) => (
            <Button key={item.name} type="button" variant={i === index ? "primary" : "outline"}
              aria-pressed={i === index} onClick={() => setIndex(i)}>{i === index ? <Check /> : <Palette />}{presetLabel(item.name)}</Button>
          ))}
        </div>
        <p className="text-[var(--s-text-secondary)] text-pretty">
          Switch presets to compare the same form. Its colors, typography, spacing, and corners update together.
        </p>
        <p className="text-[var(--s-text-secondary)]">Use {presetLabel(preset.name)} in your project:</p>
        <code className="overflow-x-auto border border-[var(--s-border)] bg-[var(--s-surface)] p-[var(--s-space-16)] font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-sm)]">
          npx @sigil-ui/cli preset {preset.name}
        </code>
      </div>
    </div>
  );
}
