export const CONCEPT_SLUGS = [
  "liquid-sigil",
  "token-foundry",
  "spec-to-system",
  "token-lathe",
  "source-result-tear",
  "monochrome-press",
  "oxide-instrument",
  "chrome-selection-museum",
  "reticle-machine-room",
  "blueprint-becomes-product",
  "constraint-compiler",
  "preset-runway",
  "carbon-and-bone",
  "brushed-steel-manual",
  "living-design-md",
  "exploded-system",
  "kinetic-type-film",
  "chrome-atlas",
  "calibration-lab",
  "null-surface",
] as const;

export type ConceptSlug = (typeof CONCEPT_SLUGS)[number];

export type ConceptDefinition = {
  index: number;
  slug: ConceptSlug;
  title: string;
  thesis: string;
  description: string;
  preset: string;
  family: "material" | "industrial" | "editorial" | "instrument" | "spatial";
  signature: string;
};

export const CONCEPTS = [
  {
    index: 1,
    slug: "liquid-sigil",
    title: "Liquid Sigil",
    thesis: "The specification becomes material.",
    description: "A restrained chrome field turns DESIGN.md into a living component surface.",
    preset: "obsid",
    family: "material",
    signature: "Pointer-reactive liquid seal",
  },
  {
    index: 2,
    slug: "token-foundry",
    title: "Token Foundry",
    thesis: "One file enters. A system leaves.",
    description: "An industrial production line makes token compilation physical and legible.",
    preset: "alloy",
    family: "industrial",
    signature: "Scroll-scrubbed production rail",
  },
  {
    index: 3,
    slug: "spec-to-system",
    title: "Spec → System",
    thesis: "Source on the left. Proof on the right.",
    description: "A severe split-screen comparison keeps the mechanism above the fold.",
    preset: "crux",
    family: "instrument",
    signature: "Interactive source/output divider",
  },
  {
    index: 4,
    slug: "token-lathe",
    title: "Token Lathe",
    thesis: "Turn one token. Reshape everything.",
    description: "Concentric controls machine typography, radius, and spacing in real time.",
    preset: "anvil",
    family: "industrial",
    signature: "Rotary token control",
  },
  {
    index: 5,
    slug: "source-result-tear",
    title: "Source / Result Tear",
    thesis: "Drag through cause and effect.",
    description: "A torn vertical reveal exposes DESIGN.md beneath the finished interface.",
    preset: "sigil",
    family: "material",
    signature: "Draggable comparison tear",
  },
  {
    index: 6,
    slug: "monochrome-press",
    title: "Monochrome Press",
    thesis: "A design system, printed with pressure.",
    description: "Editorial scale and registration marks turn product facts into a technical broadsheet.",
    preset: "mono",
    family: "editorial",
    signature: "Kinetic press-sheet typography",
  },
  {
    index: 7,
    slug: "oxide-instrument",
    title: "Oxide Instrument",
    thesis: "Inspect the system like hardware.",
    description: "Dense instrumentation exposes every stage without losing product hierarchy.",
    preset: "basalt",
    family: "instrument",
    signature: "Live diagnostic console",
  },
  {
    index: 8,
    slug: "chrome-selection-museum",
    title: "Chrome Selection Museum",
    thesis: "Forty-six identities. One architecture.",
    description: "Presets become catalogued metal specimens with deliberate curatorial pacing.",
    preset: "brass",
    family: "material",
    signature: "Specimen carousel",
  },
  {
    index: 9,
    slug: "reticle-machine-room",
    title: "Reticle Machine Room",
    thesis: "The grid is the machine.",
    description: "Structural visibility becomes an active control surface rather than decoration.",
    preset: "kova",
    family: "instrument",
    signature: "Reticle-tracked system grid",
  },
  {
    index: 10,
    slug: "blueprint-becomes-product",
    title: "Blueprint Becomes Product",
    thesis: "Watch constraints become components.",
    description: "A blueprint drawing resolves into a finished token-driven interface on scroll.",
    preset: "cobalt",
    family: "spatial",
    signature: "Blueprint-to-surface dissolve",
  },
  {
    index: 11,
    slug: "constraint-compiler",
    title: "Constraint Compiler",
    thesis: "Taste, compiled into rails.",
    description: "An uncompromising compiler view demonstrates why constraints outperform references.",
    preset: "cipher",
    family: "instrument",
    signature: "Executable compilation trace",
  },
  {
    index: 12,
    slug: "preset-runway",
    title: "Preset Runway",
    thesis: "Structure changes with identity.",
    description: "Complete preset silhouettes travel through one controlled architectural frame.",
    preset: "onyx",
    family: "spatial",
    signature: "Depth-stacked preset runway",
  },
  {
    index: 13,
    slug: "carbon-and-bone",
    title: "Carbon + Bone",
    thesis: "Soft paper. Hard constraints.",
    description: "Warm editorial matter meets a carbon-black technical chassis.",
    preset: "etch",
    family: "editorial",
    signature: "Material theme inversion",
  },
  {
    index: 14,
    slug: "brushed-steel-manual",
    title: "Brushed Steel Manual",
    thesis: "The product manual is the product.",
    description: "An industrial field guide explains Sigil with calibrated diagrams and steel tabs.",
    preset: "rivet",
    family: "industrial",
    signature: "Indexed manual navigation",
  },
  {
    index: 15,
    slug: "living-design-md",
    title: "Living DESIGN.md",
    thesis: "Edit the sentence. Change the surface.",
    description: "The markdown document occupies center stage and visibly drives every downstream part.",
    preset: "dsgn",
    family: "editorial",
    signature: "Editable token document",
  },
  {
    index: 16,
    slug: "exploded-system",
    title: "Exploded System",
    thesis: "Every layer has a reason.",
    description: "The design system separates into tokens, primitives, components, and composition planes.",
    preset: "helix",
    family: "spatial",
    signature: "Pointer-tilted exploded stack",
  },
  {
    index: 17,
    slug: "kinetic-type-film",
    title: "Kinetic Type Film",
    thesis: "Edit tokens. Not components.",
    description: "A typographic film uses cadence and hard cuts to state the architectural argument.",
    preset: "vex",
    family: "editorial",
    signature: "Scroll-timed type sequence",
  },
  {
    index: 18,
    slug: "chrome-atlas",
    title: "Chrome Atlas",
    thesis: "Map the complete system.",
    description: "A navigable atlas connects 33 token categories to the surfaces they control.",
    preset: "hex",
    family: "spatial",
    signature: "Interactive system map",
  },
  {
    index: 19,
    slug: "calibration-lab",
    title: "Calibration Lab",
    thesis: "Measure identity, then ship it.",
    description: "A precise laboratory lets visitors tune three high-leverage tokens and inspect the result.",
    preset: "arc",
    family: "instrument",
    signature: "Live three-axis calibration",
  },
  {
    index: 20,
    slug: "null-surface",
    title: "Null Surface",
    thesis: "Remove everything but causality.",
    description: "The quietest direction: one line, one artifact, and one decisive proof sequence.",
    preset: "axiom",
    family: "material",
    signature: "Cursor-revealed proof field",
  },
] as const satisfies readonly ConceptDefinition[];

const conceptMap = new Map(CONCEPTS.map((concept) => [concept.slug, concept]));

export function getConcept(slug: string): ConceptDefinition | undefined {
  return conceptMap.get(slug as ConceptSlug);
}

export function getAdjacentConcept(slug: ConceptSlug, offset: -1 | 1): ConceptDefinition {
  const index = CONCEPTS.findIndex((concept) => concept.slug === slug);
  const nextIndex = (index + offset + CONCEPTS.length) % CONCEPTS.length;
  return CONCEPTS[nextIndex]!;
}

export function isConceptSlug(value: string): value is ConceptSlug {
  return conceptMap.has(value as ConceptSlug);
}
