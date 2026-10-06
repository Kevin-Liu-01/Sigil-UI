import fs from "fs-extra";
import path from "node:path";

type SourceFile = { source: string; relative: string; content: string };
type ComponentTree = { entry: string; files: SourceFile[]; dependencies: string[] };

function sourceRoot(sourcePath: string): string {
  let dir = path.dirname(sourcePath);
  while (path.dirname(dir) !== dir) {
    if (path.basename(dir) === "src") return dir;
    dir = path.dirname(dir);
  }
  throw new Error(`Component source is outside a src directory: ${sourcePath}`);
}

function imports(content: string): string[] {
  return Array.from(content.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["']([^"']+)["']/g), (match) => match[1]);
}

function resolveLocal(source: string, specifier: string): string {
  const base = path.resolve(path.dirname(source), specifier).replace(/\.js$/, "");
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.json`, path.join(base, "index.ts"), path.join(base, "index.tsx")];
  const resolved = candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
  if (!resolved) throw new Error(`Cannot resolve ${specifier} imported by ${source}`);
  return resolved;
}

/** Resolve every relative import before writing any component files. */
export function collectComponentTree(sourcePath: string): ComponentTree {
  const root = sourceRoot(sourcePath);
  const files = new Map<string, SourceFile>();
  const dependencies = new Set<string>();
  function visit(source: string) {
    if (files.has(source)) return;
    const relative = path.relative(root, source);
    if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Component import leaves its source directory: ${source}`);
    const content = fs.readFileSync(source, "utf8");
    files.set(source, { source, relative, content });
    for (const specifier of imports(content)) {
      if (specifier.startsWith(".")) {
        visit(resolveLocal(source, specifier));
      } else if (!specifier.startsWith("node:")) {
        const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
        if (name !== "react" && name !== "react-dom") dependencies.add(name);
      }
    }
  }
  visit(sourcePath);
  return { entry: path.relative(root, sourcePath), files: [...files.values()], dependencies: [...dependencies].sort() };
}

/** Preserve source-relative imports in a local tree and expose the requested entry. */
export function copyComponentTree(tree: ComponentTree, destPath: string, overwrite = false, alias?: [string, string]): void {
  const targetRoot = path.join(path.dirname(destPath), "_sigil");
  for (const file of tree.files) {
    const target = path.join(targetRoot, file.relative);
    if (fs.existsSync(target) && !overwrite) continue;
    fs.outputFileSync(target, file.content);
  }
  const entry = tree.entry.replace(/\.(tsx?|jsx?)$/, "").split(path.sep).join("/");
  const aliasExport = alias ? `export { ${alias[0]} as ${alias[1]} } from "./_sigil/${entry}";\n` : "";
  fs.outputFileSync(destPath, `"use client";\n\nexport * from "./_sigil/${entry}";\n${aliasExport}`);
}
