"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ConceptDefinition, ConceptSlug } from "@/lib/concepts/manifest";
import type { ConceptPageProps, ConceptRenderMode } from "./shared/types";

function LoadingConcept() {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-[var(--s-background)] text-[var(--s-text)]">
      <div className="w-[min(28rem,80vw)] space-y-[var(--s-space-12)]" role="status" aria-label="Loading concept">
        <div className="h-2 w-1/3 animate-pulse bg-[var(--s-surface)] motion-reduce:animate-none" />
        <div className="h-12 w-full animate-pulse bg-[var(--s-surface)] motion-reduce:animate-none" />
        <div className="h-12 w-2/3 animate-pulse bg-[var(--s-surface)] motion-reduce:animate-none" />
      </div>
    </div>
  );
}

const conceptLoaders = {
  "liquid-sigil": dynamic(() => import("./01-liquid-sigil/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "token-foundry": dynamic(() => import("./02-token-foundry/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "spec-to-system": dynamic(() => import("./03-spec-to-system/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "token-lathe": dynamic(() => import("./04-token-lathe/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "source-result-tear": dynamic(() => import("./05-source-result-tear/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "monochrome-press": dynamic(() => import("./06-monochrome-press/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "oxide-instrument": dynamic(() => import("./07-oxide-instrument/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "chrome-selection-museum": dynamic(() => import("./08-chrome-selection-museum/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "reticle-machine-room": dynamic(() => import("./09-reticle-machine-room/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "blueprint-becomes-product": dynamic(() => import("./10-blueprint-becomes-product/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "constraint-compiler": dynamic(() => import("./11-constraint-compiler/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "preset-runway": dynamic(() => import("./12-preset-runway/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "carbon-and-bone": dynamic(() => import("./13-carbon-and-bone/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "brushed-steel-manual": dynamic(() => import("./14-brushed-steel-manual/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "living-design-md": dynamic(() => import("./15-living-design-md/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "exploded-system": dynamic(() => import("./16-exploded-system/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "kinetic-type-film": dynamic(() => import("./17-kinetic-type-film/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "chrome-atlas": dynamic(() => import("./18-chrome-atlas/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "calibration-lab": dynamic(() => import("./19-calibration-lab/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
  "null-surface": dynamic(() => import("./20-null-surface/Concept").then((module) => module.Concept), { loading: LoadingConcept }),
} satisfies Record<ConceptSlug, ComponentType<ConceptPageProps>>;

export function ConceptRenderer({ concept, mode = "detail" }: { concept: ConceptDefinition; mode?: ConceptRenderMode }) {
  const Component = conceptLoaders[concept.slug];
  return <Component concept={concept} mode={mode} />;
}
