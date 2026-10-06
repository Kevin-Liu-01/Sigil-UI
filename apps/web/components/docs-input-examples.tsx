"use client";

import { useId, useState } from "react";
import { CopyInput, Label, StepperField } from "@sigil-ui/components";

export function StepperFieldPreview() {
  const [quantity, setQuantity] = useState(3);
  const id = useId();
  return (
    <div className="grid w-full gap-[var(--s-space-16)]">
      <Label htmlFor={`${id}-quantity`}>Quantity</Label>
      <StepperField id={`${id}-quantity`} defaultValue={3} min={1} max={10} />
      <Label htmlFor={`${id}-controlled`}>Controlled quantity</Label>
      <StepperField id={`${id}-controlled`} value={quantity} min={0} max={5} step={0.5}
        onChange={(event) => setQuantity(Number(event.target.value))} />
      <output aria-live="polite">Selected quantity: {quantity}</output>
      <Label htmlFor={`${id}-disabled`}>Unavailable quantity</Label>
      <StepperField id={`${id}-disabled`} defaultValue={2} disabled />
    </div>
  );
}

export function CopyInputPreview() {
  const id = useId();
  const [lastCopied, setLastCopied] = useState("");
  return (
    <div className="grid w-full gap-[var(--s-space-16)]">
      <Label htmlFor={id}>Install command</Label>
      <CopyInput id={id} defaultValue="npx @sigil-ui/cli add button" onCopyValue={setLastCopied} />
      <p role="status" className="text-[length:var(--s-size-sm)] text-[var(--s-text-muted)]">
        {lastCopied ? `Last copied: ${lastCopied}` : "Edit the command, then copy its current value."}
      </p>
    </div>
  );
}
