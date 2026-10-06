"use client";

import type { SigilPreset } from "@sigil-ui/tokens";
import { cn } from "@sigil-ui/components";
import type { ReactNode } from "react";
import { SigilTokensProvider } from "@/components/sandbox/token-provider";
import type { ConceptDefinition } from "@/lib/concepts/manifest";
import { ConceptChrome } from "./ConceptChrome";
import { ConceptMotionRoot } from "./ConceptMotionRoot";

type ConceptRootProps = {
  children: ReactNode;
  concept: ConceptDefinition;
  preset: SigilPreset;
  compare?: boolean;
  className?: string;
};

export function ConceptRoot({
  children,
  concept,
  preset,
  compare = false,
  className,
}: ConceptRootProps) {
  return (
    <SigilTokensProvider
      initialPreset={preset}
      styleTagAttr="data-sigil-concept-tokens"
    >
      <ConceptMotionRoot enabled={!compare}>
        <div
          data-concept={concept.slug}
          className={cn(
            "relative min-h-[100dvh] overflow-clip bg-[var(--s-background)] font-[family-name:var(--s-font-body)] text-[var(--s-text)] selection:bg-[var(--s-primary)] selection:text-[var(--s-primary-contrast)]",
            className,
          )}
        >
          {!compare && <ConceptChrome concept={concept} />}
          {children}
        </div>
      </ConceptMotionRoot>
    </SigilTokensProvider>
  );
}
