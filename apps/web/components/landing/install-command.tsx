"use client";

import { Check, Copy } from "@/components/icons";
import { useCopyToClipboard } from "@sigil-ui/components";

/** A keyboard-accessible command that only reports a successful copy. */
export function InstallCommand({ command = "npx create-sigil-app@latest" }: { command?: string }) {
  const { copy, copied, error } = useCopyToClipboard(command);
  return (
    <div className="sigil-install-command">
      <button type="button" onClick={copy} aria-label={`Copy ${command}`}>
        <span aria-hidden="true">$</span>
        <code>{command}</code>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </button>
      <span role="status" className={error ? "text-[var(--s-error)]" : "text-[var(--s-text-muted)]"}>
        {error ? "Copy unavailable. Select the command to copy it manually." : copied ? "Command copied." : "Run in your terminal to get started."}
      </span>
    </div>
  );
}
