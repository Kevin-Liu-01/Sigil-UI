"use client";

import { useDocsPage } from "fumadocs-ui/layouts/docs/page";
import type { ComponentProps } from "react";

export function DocsMain({ className = "", ...props }: ComponentProps<"main">) {
  const { props: pageProps } = useDocsPage();
  const tocLayout = pageProps.full
    ? ""
    : "xl:layout:[--fd-toc-width:var(--s-sidebar-width)]";

  return (
    <main
      id="nd-page"
      data-full={pageProps.full}
      className={`sigil-docs-page ${tocLayout} ${className}`}
      {...props}
    />
  );
}
