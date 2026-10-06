import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import { collectComponentTree, copyComponentTree } from "../packages/cli/src/utils/copy-component";
import { getAllComponents, getComponent, resolveComponentSource } from "../packages/cli/src/utils/registry";

const root = process.cwd();

test("every registered component has a complete source tree", () => {
  const entries = getAllComponents();
  assert.ok(entries.length > 350);
  for (const entry of entries) for (const file of entry.files) {
    const tree = collectComponentTree(resolveComponentSource(entry.name, file));
    assert.ok(tree.files.length > 0, entry.name);
  }
  for (const name of ["clipboard", "code-block", "install-section", "copy-input", "stepper-field", "bento-grid-cell"]) {
    assert.ok(getComponent(name), `${name} must be installable`);
  }
});

test("copied sources compile and preserve local changes unless overwrite is explicit", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sigil-component-test-"));
  try {
    fs.symlinkSync(path.join(root, "packages/components/node_modules"), path.join(dir, "node_modules"));
    for (const name of ["button", "copy-input", "stepper-field", "install-section", "bento-grid-cell", "dialog", "calendar", "date-picker", "checkbox", "search-input"]) {
      const entry = getComponent(name)!;
      const tree = collectComponentTree(resolveComponentSource(name, entry.files[0]));
      copyComponentTree(tree, path.join(dir, "ui", entry.files[0]), false, entry.exportAlias);
    }
    fs.writeFileSync(path.join(dir, "tsconfig.json"), JSON.stringify({ compilerOptions: {
      target: "ES2022", module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx",
      strict: true, skipLibCheck: true, esModuleInterop: true, noEmit: true,
    }, include: ["ui/**/*"] }));
    execFileSync(process.execPath, [path.join(root, "node_modules/typescript/bin/tsc"), "-p", path.join(dir, "tsconfig.json")], { stdio: "pipe" });
    const tree = collectComponentTree(resolveComponentSource("button", "button.tsx"));
    const button = path.join(dir, "ui/_sigil/ui/Button.tsx");
    fs.appendFileSync(button, "\n// local customization\n");
    copyComponentTree(tree, path.join(dir, "ui/button.tsx"));
    assert.match(fs.readFileSync(button, "utf8"), /local customization/);
    copyComponentTree(tree, path.join(dir, "ui/button.tsx"), true);
    assert.doesNotMatch(fs.readFileSync(button, "utf8"), /local customization/);
    assert.ok(tree.dependencies.includes("@radix-ui/react-slot"));
    assert.ok(tree.dependencies.includes("tailwind-merge"));
    const calendar = collectComponentTree(resolveComponentSource("calendar", getComponent("calendar")!.files[0]));
    assert.ok(calendar.dependencies.includes("@phosphor-icons/react"), "deep icon imports install the package root");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("missing relative imports fail before copying partial sources", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sigil-broken-source-"));
  try {
    fs.mkdirSync(path.join(dir, "src"));
    const entry = path.join(dir, "src/Broken.tsx");
    fs.writeFileSync(entry, 'import { missing } from "./missing"; export const Broken = missing;');
    assert.throws(() => collectComponentTree(entry), /Cannot resolve/);
    fs.writeFileSync(entry, 'export { secret } from "../outside";');
    fs.writeFileSync(path.join(dir, "outside.ts"), "export const secret = 1;");
    assert.throws(() => collectComponentTree(entry), /leaves its source directory/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("initialization registers Tailwind sources even when tokens were already imported", async () => {
  const { injectTokenImport } = await import("../packages/cli/src/utils/setup");
  const { detectProject } = await import("../packages/cli/src/utils/detect");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sigil-css-test-"));
  try {
    fs.mkdirSync(path.join(dir, "src/app"), { recursive: true });
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ dependencies: { next: "16", tailwindcss: "4" } }));
    const css = path.join(dir, "src/app/globals.css");
    fs.writeFileSync(css, '@import "tailwindcss";\n@import "@sigil-ui/tokens/css";\n');
    const detection = detectProject(dir);
    injectTokenImport(dir, detection, "src/styles/sigil.tokens.css");
    const once = fs.readFileSync(css, "utf8");
    assert.match(once, /@source "\.\.\/\.\.\/node_modules\/@sigil-ui\/components\/src"/);
    injectTokenImport(dir, detection, "src/styles/sigil.tokens.css");
    assert.equal(fs.readFileSync(css, "utf8"), once);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("every documented add command is registered", () => {
  const docs = path.join(root, "apps/web/content/docs/components");
  for (const file of fs.readdirSync(docs)) {
    if (!file.endsWith(".mdx")) continue;
    for (const match of fs.readFileSync(path.join(docs, file), "utf8").matchAll(/@sigil-ui\/cli add ([a-z0-9-]+)/g)) {
      assert.ok(getComponent(match[1]), `${file} documents unknown component ${match[1]}`);
    }
  }
});

test("published bundles retain the React client boundary", () => {
  for (const file of ["index.js", "index.cjs"]) {
    const content = fs.readFileSync(path.join(root, "packages/components/dist", file), "utf8");
    assert.match(content, /^['"]use client['"];?/);
  }
});
