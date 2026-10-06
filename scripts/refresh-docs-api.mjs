#!/usr/bin/env node
// Repair empty generated API tables from authored component types.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const types = new Map();
const escape = (text) => text.replaceAll("|", "\\|").replaceAll("`", "'").replace(/\s+/g, " ").trim();
const labels = {
  children: "Content rendered inside the component.", className: "Additional classes merged with the component styles.",
  value: "The current controlled value.", defaultValue: "Initial value when the component manages its own state.",
  disabled: "Prevents user interaction when enabled.", label: "Readable label for the component.",
  title: "Heading displayed in the component.", description: "Supporting text below the heading.",
  variant: "Selects a supported visual treatment.", size: "Sets the component's size.",
  items: "Items to display, in their display order.", data: "Data used to render the visualization.",
  placeholder: "Hint shown before a value is entered.", onValueChange: "Called when the user changes the value.",
  onChange: "Called when the value changes.", onSubmit: "Called when the form is submitted.",
  min: "Smallest allowed value.", max: "Largest allowed value.", step: "Amount added or removed by each adjustment.",
  height: "Height of the rendered content.", width: "Width of the rendered content.",
};
for (const file of walk("packages/components/src").filter((file) => file.endsWith(".tsx"))) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const node of source.statements) {
    if (!ts.isInterfaceDeclaration(node) || !node.name.text.endsWith("Props")) continue;
    const rows = node.members.filter(ts.isPropertySignature).map((member) => {
      const name = member.name.getText(source);
      const comment = member.jsDoc?.map((doc) => typeof doc.comment === "string" ? doc.comment : "").filter(Boolean).join(" ");
      const defaultValue = ts.getJSDocTags(member).find((tag) => tag.tagName.text === "default")?.comment;
      const description = comment || labels[name] || `${name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (s) => s.toUpperCase())} configuration.`;
      return `| \`${name}\`${member.questionToken ? "" : " (required)"} | \`${escape(member.type?.getText(source) ?? "unknown")}\` | ${defaultValue ? `\`${escape(String(defaultValue))}\`` : "—"} | ${escape(description)} |`;
    });
    if (rows.length) types.set(node.name.text, rows);
  }
}
let changed = 0;
for (const file of walk("apps/web/content/docs").filter((file) => file.endsWith(".mdx"))) {
  const source = fs.readFileSync(file, "utf8");
  const name = source.match(/^title:\s*"?([^"\n]+)/m)?.[1];
  const rows = types.get(`${name}Props`);
  if (!rows) continue;
  const next = source.replace(/(## Props\n\n)(\| Prop[^\n]*\n\|[-| ]+\n)((?:\|[^\n]*\n)+)/, (match, heading, header, body) => {
    if (!body.trim().split("\n").every((line) => /\| — \|$/.test(line))) return match;
    return `${heading}${header}${rows.join("\n")}\n`;
  });
  if (next !== source) { fs.writeFileSync(file, next); changed++; }
}
console.log(`Updated ${changed} API tables from component types.`);
