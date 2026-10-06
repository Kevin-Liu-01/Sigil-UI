/** Keep lightweight preview data aligned with the authored preset tokens. */
import { readFile, writeFile } from "node:fs/promises";
import { presets, presetCatalog } from "../packages/presets/src/index.ts";
async function main() {
  let catalog = await readFile("packages/presets/src/catalog.ts", "utf8");
  let readme = await readFile("packages/presets/README.md", "utf8");
  const swatches: string[] = [];
  const hues: Record<string, string> = { crux: "red", kova: "blue", anvil: "blue", rivet: "orange", shard: "violet", rune: "amber", fang: "lime", obsid: "rose", glyph: "red", hex: "magenta", arc: "violet", dsgn: "blue", mrkr: "gold", flux: "cyan" };
  for (const [name, load] of Object.entries(presets)) {
    const preset = await load();
    const colors = ["primary", "background", "text", "surface"].map(role => {
      const color = (preset.tokens.colors as Record<string, any>)[role];
      return typeof color === "string" ? color : color.dark;
    });
    swatches.push(`  ${JSON.stringify(name)}: ${JSON.stringify(colors)},`);
    const font = (role: string) => (preset.tokens.typography as Record<string, string>)[role].split(",")[0].trim().replace(/^['"]|['"]$/g, "");
    const fonts = `{ display: ${JSON.stringify(font("font-display"))}, body: ${JSON.stringify(font("font-body"))}, mono: ${JSON.stringify(font("font-mono"))} }`;
    const hue = hues[name] ?? presetCatalog.find(entry => entry.name === name)?.primaryHue;
    readme = readme.split("\n").map(line => {
      if (!line.startsWith(`| \`${name}\` |`)) return line;
      const cells = line.split("|");
      cells[3] = ` ${font("font-display")} `;
      if (hue) cells[4] = ` ${hue[0].toUpperCase() + hue.slice(1)} `;
      return cells.join("|");
    }).join("\n");
    catalog = catalog.replace(new RegExp(`(name: "${name}",[^\\n]*fonts: )\\{[^}]*\\}`), `$1${fonts}`);
    if (hues[name]) catalog = catalog.replace(new RegExp(`(name: "${name}",[^\\n]*primaryHue: )"[^"]*"`), `$1"${hues[name]}"`);
  }
  const path = "apps/web/lib/studio-presets.ts";
  const source = await readFile(path, "utf8");
  await writeFile(path, source.replace(/const PRESET_SWATCHES: Record<string, string\[\]> = \{[\s\S]*?\n\};/, `const PRESET_SWATCHES: Record<string, string[]> = {\n${swatches.join("\n")}\n};`));
  await writeFile("packages/presets/src/catalog.ts", catalog);
  await writeFile("packages/presets/README.md", readme);
  console.log("Synced fonts, palette labels, and swatches for all 45 presets.");
}
void main().catch(error => { console.error(error); process.exitCode = 1; });
