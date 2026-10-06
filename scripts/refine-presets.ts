/** Offline authoring tool. Writes improvements into preset source, never at runtime. */
import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";
import { converter, parse, wcagContrast } from "culori";
import { presets } from "../packages/presets/src/index.ts";

const write = process.argv.includes("--write");
const toOklch = converter("oklch");
const toRgb = converter("rgb");
const themed = (value: any, mode: string) => typeof value === "string" ? value : value[mode];
const rgb = (value: string) => {
  const c = toRgb(parse(value))!;
  return { mode: "rgb" as const, r: Math.max(0, Math.min(1, c.r)), g: Math.max(0, Math.min(1, c.g)), b: Math.max(0, Math.min(1, c.b)) };
};
const contrast = (a: string, b: string) => wcagContrast(rgb(a), rgb(b));
function readable(value: string, surfaces: string[], ratio: number, mode: string) {
  if (surfaces.every(bg => contrast(value, bg) >= ratio)) return value;
  const c = toOklch(parse(value))!;
  for (let step = 1; step <= 1000; step++) {
    const l = Math.max(0, Math.min(1, c.l + (mode === "light" ? -1 : 1) * step / 1000));
    const candidate = `oklch(${Number(l.toFixed(4))} ${Number(c.c.toFixed(4))} ${Number((c.h ?? 0).toFixed(4))})`;
    if (surfaces.every(bg => contrast(candidate, bg) >= ratio)) return candidate;
  }
  throw new Error(`Cannot make ${value} readable on ${surfaces}`);
}
function replaceGroups(source: string, filename: string, groups: Record<string, Record<string, unknown>>) {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  const edits: { start: number; end: number; text: string }[] = [];
  const key = (node: ts.PropertyName) => ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : "";
  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && groups[key(node.name)] && ts.isObjectLiteralExpression(node.initializer)) {
      const values = groups[key(node.name)];
      const found = new Set<string>();
      for (const prop of node.initializer.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const name = key(prop.name);
        if (!(name in values)) continue;
        found.add(name);
        edits.push({ start: prop.initializer.getStart(file), end: prop.initializer.end, text: JSON.stringify(values[name]) });
      }
      const additions = Object.entries(values).filter(([name]) => !found.has(name));
      if (additions.length) edits.push({ start: node.initializer.getStart(file) + 1, end: node.initializer.getStart(file) + 1,
        text: "\n" + additions.map(([name, value]) => `      ${JSON.stringify(name)}: ${JSON.stringify(value)},`).join("\n") });
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  for (const edit of edits.sort((a, b) => b.start - a.start)) source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
  return source;
}
async function main() {
let count = 0;
for (const [name, load] of Object.entries(presets)) {
  const preset = await load();
  const colors = preset.tokens.colors as Record<string, any>;
  const updates: Record<string, any> = {};
  for (const mode of ["light", "dark"]) {
    const surfaces = ["background", "surface", "surface-elevated", "surface-sunken"].map(role => themed(colors[role], mode));
    for (const [role, ratio] of Object.entries({ text: 7, "text-secondary": 5.5, "text-muted": 4.6, "text-subtle": 4.5,
      primary: 4.5, "primary-hover": 4.5, "border-strong": 3, "border-interactive": 3, success: 4.5, warning: 4.5, error: 4.5, info: 4.5 })) {
      (updates[role] ??= {})[mode] = readable(themed(colors[role], mode), surfaces, ratio, mode);
    }
    const old = themed(colors["primary-contrast"], mode);
    const fills = [updates.primary[mode], updates["primary-hover"][mode]];
    const candidates = [old, "oklch(1 0 0)", "oklch(0 0 0)"];
    const foreground = candidates.find(c => fills.every(bg => contrast(c, bg) >= 4.5));
    if (!foreground) throw new Error(`${name}: button contrast has no shared foreground`);
    (updates["primary-contrast"] ??= {})[mode] = foreground;
  }
  for (const [role, value] of Object.entries(updates)) {
    if (value.light === themed(colors[role], "light") && value.dark === themed(colors[role], "dark")) delete updates[role];
    else if (value.light === value.dark) updates[role] = value.light;
  }
  const typography: Record<string, string> = {};
  for (const [role, min] of Object.entries({ "size-xs": .75, "size-sm": .875, "size-base": 1, "size-lg": 1.125, "size-xl": 1.25 })) {
    const value = (preset.tokens.typography as Record<string, string>)[role];
    if (parseFloat(value) < min) typography[role] = `${min}rem`;
  }
  const path = `packages/presets/src/${name}.ts`;
  const source = await readFile(path, "utf8");
  const next = replaceGroups(source, path, { colors: updates, typography });
  if (source !== next) { count++; if (write) await writeFile(path, next); }
}
console.log(`${write ? "Refined" : "Would refine"} ${count} presets: readable surfaces, captions, status colors, buttons, and type scales.`);

}
void main().catch(error => { console.error(error); process.exitCode = 1; });
