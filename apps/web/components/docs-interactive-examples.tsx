"use client";

import { useState } from "react";
import {
  Button, ChartContainer, ChartLegend, ChartTooltip, CommandMenu, Spotlight,
  Sonner, Toaster, ToastPromise, sonnerToast, toast,
} from "@sigil-ui/components";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const TRAFFIC = [
  { month: "Apr", desktop: 186, mobile: 80 },
  { month: "May", desktop: 224, mobile: 112 },
  { month: "Jun", desktop: 208, mobile: 132 },
  { month: "Jul", desktop: 278, mobile: 166 },
  { month: "Aug", desktop: 305, mobile: 184 },
  { month: "Sep", desktop: 342, mobile: 218 },
];

export function ChartContainerPreview() {
  return (
    <div className="sigil-docs-example">
      <div><strong>Monthly visitors</strong><p className="sigil-docs-example-output">Compare desktop and mobile traffic. Hover or use the arrow keys to inspect a month.</p></div>
      <ChartContainer height={280} aria-label="Desktop and mobile visitors from April to September">
        <AreaChart data={TRAFFIC} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis width={36} tickLine={false} axisLine={false} />
          <ChartTooltip />
          <ChartLegend />
          <Area name="Desktop" type="monotone" dataKey="desktop" stroke="var(--s-chart-series-1)" fill="var(--s-chart-series-1)" fillOpacity={0.12} isAnimationActive={false} />
          <Area name="Mobile" type="monotone" dataKey="mobile" stroke="var(--s-chart-series-2)" fill="var(--s-chart-series-2)" fillOpacity={0.12} isAnimationActive={false} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

export function CommandMenuPreview({ spotlight = false }: { spotlight?: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("No command selected.");
  const Menu = spotlight ? Spotlight : CommandMenu;
  const commands = [
    { value: "create", label: "Create project", description: "Start a new workspace" },
    { value: "invite", label: "Invite a teammate", description: "Share your workspace" },
    { value: "settings", label: "Project settings", description: "Manage your preferences" },
  ];
  return (
    <div className="sigil-docs-example">
      <div><Button variant="outline" onClick={() => setOpen(true)}>Open {spotlight ? "spotlight" : "command menu"}</Button></div>
      <Menu open={open} onOpenChange={setOpen} items={commands.map((command) => ({
        ...command, onSelect: () => { setSelected(`${command.label} selected.`); setOpen(false); },
      }))} />
      <p role="status" className="sigil-docs-example-output">{selected}</p>
    </div>
  );
}

export function ToastPreview({ engine = "radix" }: { engine?: "radix" | "sonner" | "promise" }) {
  const [pending, setPending] = useState(false);
  async function save(fail = false) {
    setPending(true);
    const request = new Promise<void>((resolve, reject) => {
      window.setTimeout(() => fail ? reject(new Error("Demo request failed")) : resolve(), 800);
    });
    try {
      await ToastPromise(request, { loading: "Saving project…", success: "Project saved", error: "Could not save. Try again." });
    } catch {
      // The toast displays the demo failure; keep the button available for retry.
    } finally { setPending(false); }
  }
  return (
    <div className="sigil-docs-example">
      {engine === "radix" ? <Toaster position="top-right" /> : <Sonner position="top-right" closeButton />}
      <div className="sigil-docs-example-actions">
        {engine === "promise" ? <>
          <Button disabled={pending} onClick={() => save()}>Save project</Button>
          <Button variant="outline" disabled={pending} onClick={() => save(true)}>Try a failed request</Button>
        </> : <>
          <Button onClick={() => engine === "sonner" ? sonnerToast.success("Project saved", { description: "Your changes are ready." }) : toast({ title: "Project saved", description: "Your changes are ready.", variant: "success" })}>Show success</Button>
          <Button variant="outline" onClick={() => engine === "sonner" ? sonnerToast.error("Could not save", { description: "Check your connection and try again." }) : toast({ title: "Could not save", description: "Check your connection and try again.", variant: "error" })}>Show error</Button>
        </>}
      </div>
      <p className="sigil-docs-example-output">Notifications appear in the top right. Dismiss them with the close button.</p>
    </div>
  );
}
