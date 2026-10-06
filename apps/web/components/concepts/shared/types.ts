import type { ConceptDefinition } from "@/lib/concepts/manifest";

export type ConceptRenderMode = "detail" | "compare";

export type ConceptPageProps = {
  concept: ConceptDefinition;
  mode?: ConceptRenderMode;
};
