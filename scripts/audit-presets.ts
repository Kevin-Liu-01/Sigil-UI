import {
  _templatePreset,
  presetCatalog,
  presets,
} from "../packages/presets/src/index.ts";
import type { SigilPreset } from "../packages/tokens/src/types.ts";
import { compileDesignMd } from "../packages/tokens/src/compile/design.ts";

type JsonObject = Record<string, unknown>;

const expectedCategories = Object.keys(_templatePreset.tokens);
const expectedPaths = collectPaths(_templatePreset.tokens as unknown as JsonObject);
const failures: string[] = [];

async function main() {
  const loaded = await Promise.all(
    Object.entries(presets).map(async ([name, load]) => [name, await load()] as const),
  );
  const catalogNames = new Set(presetCatalog.map((entry) => entry.name));
  const loaderNames = new Set(Object.keys(presets));

  for (const name of catalogNames) {
    if (!loaderNames.has(name as keyof typeof presets)) failures.push(`catalog preset "${name}" has no loader`);
  }
  for (const name of loaderNames) {
    if (name !== "default" && !catalogNames.has(name)) failures.push(`preset loader "${name}" is missing catalog metadata`);
  }

  for (const [loaderName, preset] of loaded) auditPreset(loaderName, preset);

  console.log("Preset audit");
  console.log(`- curated catalog: ${presetCatalog.length}`);
  console.log(`- runtime presets: ${loaded.length}`);
  console.log(`- total with template: ${loaded.length + 1}`);
  console.log(`- required categories: ${expectedCategories.length}`);
  console.log("- template field coverage: complete");
  console.log(`- failures: ${failures.length}`);

  if (failures.length > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function auditPreset(loaderName: string, preset: SigilPreset) {
  if (preset.name !== loaderName) failures.push(`${loaderName}: export name is "${preset.name}"`);
  if (!preset.metadata.description.trim()) failures.push(`${loaderName}: missing description`);
  const catalog = presetCatalog.find(entry => entry.name === loaderName);
  if (catalog) {
    for (const role of ["display", "body", "mono"] as const) {
      const actual = preset.tokens.typography[`font-${role}`].split(",")[0].trim().replace(/^['"]|['"]$/g, "");
      if (catalog.fonts[role] !== actual) failures.push(`${loaderName}: ${role} font metadata differs from its tokens`);
    }
  }


  const tokens = preset.tokens as unknown as JsonObject;
  const categories = Object.keys(tokens);
  const missingCategories = expectedCategories.filter((key) => !categories.includes(key));
  const extraCategories = categories.filter((key) => !expectedCategories.includes(key));
  if (missingCategories.length) failures.push(`${loaderName}: missing categories ${missingCategories.join(", ")}`);
  if (extraCategories.length) failures.push(`${loaderName}: unknown categories ${extraCategories.join(", ")}`);

  const actualPaths = new Set(collectPaths(tokens));
  const missingPaths = expectedPaths.filter((path) => !actualPaths.has(path));
  if (missingPaths.length) failures.push(`${loaderName}: missing ${missingPaths.length} token fields (${missingPaths.slice(0, 5).join(", ")})`);

  auditColorGroup(loaderName, preset.tokens.colors as unknown as JsonObject);

  const scale = preset.tokens.spacing.scale;
  if (!Array.isArray(scale) || scale.length < 2) {
    failures.push(`${loaderName}: spacing scale must contain at least two steps`);
  } else if (scale.some((value, index) => value <= 0 || (index > 0 && value <= scale[index - 1]))) {
    failures.push(`${loaderName}: spacing scale must be positive and strictly increasing`);
  }

  const gridCell = Number.parseFloat(String(preset.tokens.sigil["grid-cell"]));
  const railGap = Number.parseFloat(String(preset.tokens.sigil["rail-gap"]));
  if (!Number.isFinite(gridCell) || gridCell <= 0) failures.push(`${loaderName}: grid-cell must be positive`);
  if (!Number.isFinite(railGap) || railGap < 0) failures.push(`${loaderName}: rail-gap must be non-negative`);

  const designMd = compileDesignMd({
    metadata: {
      brand: preset.name,
      tagline: preset.metadata.description,
      theme: "adaptive",
      preset: preset.name,
      density: "balanced",
      description: preset.metadata.mood ?? preset.metadata.description,
    },
    tokens: preset.tokens,
    components: [],
    surfaces: [],
    dos: [],
    donts: [],
    imagery: "",
    layout: "",
    similarBrands: [],
  });
  const requiredDesignSections = [
    "## Tokens — Colors",
    "## Block Tokens — Hero",
    "## Block Tokens — Banner",
    "## Composition — Page Rhythm",
    "## Composition — Component Surfaces",
    "## Compile — CSS",
    "## Compile — Tailwind v4",
    "## Compile — W3C Design Tokens",
  ];
  const missingDesignSections = requiredDesignSections.filter((heading) => !designMd.includes(heading));
  if (missingDesignSections.length) failures.push(`${loaderName}: DESIGN.md is missing ${missingDesignSections.join(", ")}`);
}

function auditColorGroup(presetName: string, colors: JsonObject, prefix = "colors") {
  for (const [key, value] of Object.entries(colors)) {
    const path = `${prefix}.${key}`;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      auditColorGroup(presetName, value as JsonObject, path);
      continue;
    }
    if (typeof value !== "string" || !isTokenColor(value)) {
      failures.push(`${presetName}: ${path} must use OKLCH or a token reference (received ${String(value)})`);
    }
  }
}

function isTokenColor(value: string) {
  const normalized = value.trim();
  return /^(oklch\(|var\(|color-mix\(|linear-gradient\(|radial-gradient\(|transparent$|currentColor$)/i.test(normalized);
}

function collectPaths(object: JsonObject, prefix = ""): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(object)) {
    const path = prefix ? `${prefix}.${key}` : key;
    // A themed color ({ light, dark }) and a single adaptive color are the
    // same configurable field, so color roles are always counted as leaves.
    if (prefix === "colors") {
      paths.push(path);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      paths.push(...collectPaths(value as JsonObject, path));
    } else {
      paths.push(path);
    }
  }
  return paths;
}
