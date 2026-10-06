"use client";

import { useCallback } from "react";
import { Check, Copy, Sparkles } from "@/components/icons";
import { useCopyToClipboard } from "@sigil-ui/components";

type DocsPageActionsProps = { title: string; markdown: string };

export function DocsPageActions({ title, markdown }: DocsPageActionsProps) {
  const getPrompt = useCallback(() =>
    `Read ${window.location.href} (${title}) and help me use this in my Sigil UI project. Preserve the active token system and component conventions.`, [title]);
  const prompt = useCopyToClipboard(getPrompt);
  const page = useCopyToClipboard(markdown);
  const error = prompt.error || page.error;

  return (
    <div className="sigil-docs-page-actions" aria-label="Page actions">
      <button type="button" onClick={prompt.copy} data-copied={prompt.copied || undefined}>
        {prompt.copied ? <Check aria-hidden /> : <Sparkles aria-hidden />}
        <span>{prompt.copied ? "Prompt copied" : "Copy prompt"}</span>
      </button>
      <button type="button" onClick={page.copy} data-copied={page.copied || undefined}>
        {page.copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        <span>{page.copied ? "Markdown copied" : "Copy page"}</span>
      </button>
      <span role="status" className={error ? "w-full text-[var(--s-error)] text-[length:var(--s-size-xs)]" : "sr-only"}>
        {error ? "Clipboard access failed. Select the text to copy it, or try again." : page.copied ? "Page copied as Markdown, including code formatting." : prompt.copied ? "Prompt copied." : ""}
      </span>
    </div>
  );
}
