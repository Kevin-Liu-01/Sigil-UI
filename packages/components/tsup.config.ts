import { defineConfig } from "tsup";
import { readdir, readFile, writeFile } from "node:fs/promises";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  // The Rollup treeshake pass strips the client boundary. Esbuild already
  // eliminates unused code; preserve its directive for Next.js consumers.
  treeshake: false,
  outDir: "dist",
  external: ["react", "react-dom", "@sigil-ui/tokens"],
  esbuildOptions(options) {
    options.treeShaking = true;
    options.banner = { js: '"use client";' };
  },
  async onSuccess() {
    // The CJS transform can insert helpers before the esbuild banner, where
    // it no longer acts as a directive. Keep both published formats valid.
    for (const file of await readdir("dist")) {
      if (!/\.(js|cjs)$/.test(file)) continue;
      const target = `dist/${file}`;
      const content = await readFile(target, "utf8");
      if (content.startsWith('"use client";')) continue;
      await writeFile(target, `"use client";\n${content}`);
      const mapPath = `${target}.map`;
      const map = JSON.parse(await readFile(mapPath, "utf8"));
      map.mappings = `;${map.mappings}`;
      await writeFile(mapPath, JSON.stringify(map));
    }
  },
});
