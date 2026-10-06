#!/usr/bin/env node

/**
 * Copy an existing rich preview from /docs/components/<slug> into a
 * category-specific component doc that exposes the same component but has no
 * preview of its own. The operation is idempotent and never replaces an
 * authored category preview.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "apps/web/content/docs");
const COMPONENTS = path.join(DOCS, "components");
const PREVIEW_PATTERN = /## Preview\s*\n+\s*(<ComponentPreview[^>]*>[\s\S]*?<\/ComponentPreview>)\s*\n+/;
const IMPORT_PATTERN = /(## Import\s*\n+\s*```tsx[\s\S]*?```\s*\n+)/;

let copied = 0;
const skipped = [];

for (const category of fs.readdirSync(DOCS, { withFileTypes: true })) {
  if (!category.isDirectory() || category.name === "components") continue;
  const categoryDir = path.join(DOCS, category.name);
  for (const name of fs.readdirSync(categoryDir)) {
    if (!name.endsWith(".mdx")) continue;
    const target = path.join(categoryDir, name);
    const targetSource = fs.readFileSync(target, "utf8");
    if (targetSource.includes("<ComponentPreview")) continue;
    if (!/^## Import$/m.test(targetSource)) continue;
    const source = path.join(COMPONENTS, name);
    if (!fs.existsSync(source)) {
      skipped.push(path.relative(DOCS, target).replaceAll(path.sep, "/"));
      continue;
    }
    const sourcePreview = fs.readFileSync(source, "utf8").match(PREVIEW_PATTERN)?.[1];
    if (!sourcePreview || !IMPORT_PATTERN.test(targetSource)) {
      skipped.push(path.relative(DOCS, target).replaceAll(path.sep, "/"));
      continue;
    }
    const next = targetSource.replace(
      IMPORT_PATTERN,
      (importSection) => `${importSection}\n## Preview\n\n${sourcePreview}\n\n`,
    );
    fs.writeFileSync(target, next);
    copied += 1;
    console.log(`copied ${path.relative(DOCS, target)}`);
  }
}

console.log(`\nCopied ${copied} previews; ${skipped.length} component docs still need authored previews.`);
if (skipped.length) console.log(skipped.join("\n"));
