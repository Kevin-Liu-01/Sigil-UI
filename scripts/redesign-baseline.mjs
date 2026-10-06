#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const outputDir = join(root, "output/redesign/baseline");
const protectedTargets = [
  "apps/web/app/page.tsx",
  "apps/web/app/docs",
  "apps/web/content/docs",
  "packages/components",
  "packages/presets",
  "packages/tokens",
];

async function listFiles(path) {
  const info = await stat(path);
  if (info.isFile()) return [path];

  const entries = await readdir(path, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.name !== "node_modules" && entry.name !== "dist")
      .map((entry) => listFiles(join(path, entry.name))),
  );
  return files.flat();
}

async function checksum(path) {
  const contents = await readFile(path);
  return createHash("sha256").update(contents).digest("hex");
}

async function collectChecksums() {
  const files = (
    await Promise.all(protectedTargets.map((target) => listFiles(join(root, target))))
  )
    .flat()
    .sort();
  return Object.fromEntries(
    await Promise.all(
      files.map(async (file) => [relative(root, file), await checksum(file)]),
    ),
  );
}

async function snapshot() {
  const checksums = await collectChecksums();
  const payload = {
    capturedAt: new Date().toISOString(),
    branch: execFileSync("git", ["branch", "--show-current"], {
      cwd: root,
      encoding: "utf8",
    }).trim(),
    head: execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
    }).trim(),
    protectedTargets,
    checksums,
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    join(outputDir, "protected-checksums.json"),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
  process.stdout.write(
    `Captured ${Object.keys(checksums).length} protected files at ${relative(root, outputDir)}\n`,
  );
}

async function verify() {
  const baselinePath = join(outputDir, "protected-checksums.json");
  const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
  const current = await collectChecksums();
  const changed = Object.keys({ ...baseline.checksums, ...current }).filter(
    (path) => baseline.checksums[path] !== current[path],
  );
  if (changed.length === 0) {
    process.stdout.write(`Protected baseline matches ${Object.keys(current).length} files.\n`);
    return;
  }
  process.stderr.write(`Protected baseline changed in ${changed.length} files:\n${changed.join("\n")}\n`);
  process.exitCode = 1;
}

if (process.argv.includes("--verify")) await verify();
else await snapshot();
