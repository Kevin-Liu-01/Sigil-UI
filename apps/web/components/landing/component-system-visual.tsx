"use client";

import { useId, useState } from "react";
import { Button, Input, Switch } from "@sigil-ui/components";
import { Check, FileText, MousePointerClick, Palette, Rocket, SlidersHorizontal, TextCursorInput, Type } from "@/components/icons";

/** Real controls connected to a shared token source, at the scale of the hero. */
export function ComponentSystemVisual() {
  const [deployed, setDeployed] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const nameId = useId();
  const switchId = useId();
  return (
    <div className="sigil-component-system" role="group" aria-label="Live component system">
      <div className="sigil-component-system-source">
        <div><FileText /><strong>DESIGN.md</strong><span>One shared spec</span></div>
        <div className="sigil-component-system-tokens">
          <span><Palette />Color<i className="sigil-component-system-swatches"><i /><i /><i /></i></span>
          <span><Type />Typography<strong>Aa</strong></span>
          <span><SlidersHorizontal />Spacing<i className="sigil-component-system-spacing"><i /><i /><i /></i></span>
        </div>
      </div>
      <svg className="sigil-component-system-connectors" viewBox="0 0 600 64" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d="M300 0V28M100 64V28H500V64M300 28V64" stroke="var(--s-border-strong)" vectorEffect="non-scaling-stroke" />
        <circle cx="100" cy="64" r="4" fill="var(--s-primary)" /><circle cx="300" cy="64" r="4" fill="var(--s-primary)" /><circle cx="500" cy="64" r="4" fill="var(--s-primary)" />
      </svg>
      <div className="sigil-component-system-parts">
        <div><h3><MousePointerClick />Buttons</h3><Button onClick={() => setDeployed(!deployed)}>{deployed ? <Check /> : <Rocket />}{deployed ? "Deployed" : "Deploy"}</Button><code>--s-primary</code></div>
        <div><h3><TextCursorInput />Inputs</h3><label className="sr-only" htmlFor={nameId}>Example project name</label><Input id={nameId} defaultValue="Fieldwork" /><code>--s-font-body</code></div>
        <div><h3><SlidersHorizontal />Controls</h3><div className="sigil-component-system-switch"><Switch id={switchId} checked={notifications} onCheckedChange={setNotifications} /><label htmlFor={switchId}>Notify me</label></div><code>--s-radius-input</code></div>
      </div>
      <p><Check />Change a token. Every connected component follows.</p>
    </div>
  );
}
