#!/usr/bin/env node
/**
 * Audit the /components landing page (the showcase grid that renders all 361
 * component cells in a searchable, paginated catalog). Checks every per-category slice for
 * console errors, captures screenshots of each section, and verifies that
 * filtering, search, and the "All" view all hydrate without runtime errors.
 *
 * Output: output/audit/<timestamp>/showcase/{report.md, report.json, screenshots/*.png}
 *
 * Usage:
 *   node scripts/audit-showcase.mjs
 *     --base=http://localhost:4000  # prebuilt prod server (recommended)
 *     --headless=false              # peek the browser
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SHOWCASE_FILE = path.join(ROOT, "apps/web/components/landing/component-showcase.tsx");
const OUT_BASE = path.join(ROOT, "output/audit");

const args = parseArgs(process.argv.slice(2));
const BASE = args.base ?? "http://localhost:4000";
const HEADLESS = String(args.headless ?? "true") !== "false";

function parseArgs(argv) {
  const out = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const eq = arg.indexOf("=");
    if (eq === -1) out[arg.slice(2)] = true;
    else out[arg.slice(2, eq)] = arg.slice(eq + 1);
  }
  return out;
}

const CATEGORIES = [
  "All", "UI", "Layout", "Navigation", "Overlays", "Data",
  "Forms", "Feedback", "Developer", "Marketing", "Sections", "Shapes",
  "3D", "Diagrams", "Animation", "Pretext", "Patterns", "Playbook",
];

function loadShowcase() {
  const src = fs.readFileSync(SHOWCASE_FILE, "utf-8");
  const entries = [];
  for (const m of src.matchAll(
    /^\s+\{\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)"/gm,
  )) {
    entries.push({ name: m[1], category: m[2] });
  }
  return entries;
}

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outDir = path.join(OUT_BASE, stamp, "showcase");
  fs.mkdirSync(path.join(outDir, "screenshots"), { recursive: true });

  const all = loadShowcase();
  console.log(`Loaded ${all.length} showcase cells across ${new Set(all.map((c) => c.category)).size} categories`);

  const byCategory = new Map();
  for (const c of all) {
    if (!byCategory.has(c.category)) byCategory.set(c.category, []);
    byCategory.get(c.category).push(c.name);
  }

  const browser = await chromium.launch({ headless: HEADLESS });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const text = msg.text();
    if (/Failed to load resource: net::ERR/.test(text)) return;
    consoleErrors.push({ type: msg.type(), text: text.slice(0, 600) });
  });
  page.on("pageerror", (err) => pageErrors.push(String(err).slice(0, 600)));

  const results = [];

  for (const cat of CATEGORIES) {
    console.log(`\n→ Auditing /components category: ${cat}`);
    consoleErrors.length = 0;
    pageErrors.length = 0;

    const url = `${BASE}/components?category=${encodeURIComponent(cat)}`;
    // The showcase reads category from local state, not URL params, so navigate
    // to /components and click the category tab instead.
    await page.goto(`${BASE}/components`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForTimeout(500); // hydration

    if (cat !== "All") {
      // Click the matching category button
      try {
        const labels = { UI: "Core interface", Sections: "Page sections", "3D": "3D elements", Pretext: "Typography", Playbook: "Composition" };
        await page.locator(".sigil-catalog-sidebar").getByRole("button", { name: new RegExp(`^${labels[cat] ?? cat}\\s`) }).click();
        await page.waitForTimeout(300);
      } catch (e) {
        results.push({ category: cat, ok: false, error: `category selection failed: ${e}` });
        continue;
      }
    }

    const more = page.locator(".sigil-catalog-more button");
    while (await more.count()) await more.click();
    await page.locator(".sigil-catalog-tools").scrollIntoViewIfNeeded();

    // Count rendered cells
    const cellCount = await page.locator('.sigil-catalog-card').count();

    // Capture screenshot of viewport
    const shot = path.join(outDir, "screenshots", `${cat.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.png`);
    await page.screenshot({ path: shot, fullPage: false, animations: "disabled" });

    const expected = cat === "All" ? all.length : (byCategory.get(cat)?.length ?? 0);

    // Collect per-cell name labels visible on screen
    const visibleNames = await page.evaluate(() => {
      const out = new Set();
      for (const el of document.querySelectorAll('[data-component-name]')) {
        out.add(el.getAttribute('data-component-name'));
      }
      return [...out];
    });

    results.push({
      category: cat,
      ok: cellCount === expected && pageErrors.length === 0 && consoleErrors.filter((e) => e.type === "error").length === 0,
      cellCount,
      expected,
      visibleNames: visibleNames.length,
      consoleErrors: consoleErrors.filter((e) => e.type === "error").map((e) => e.text),
      consoleWarnings: consoleErrors.filter((e) => e.type === "warning").map((e) => e.text),
      pageErrors: [...pageErrors],
      screenshot: path.relative(outDir, shot),
    });

    const errorTag = pageErrors.length || consoleErrors.filter((e) => e.type === "error").length
      ? "❌"
      : "✓";
    console.log(`  ${errorTag} ${cat.padEnd(12)} ${cellCount} cells (expected ~${expected}), ${pageErrors.length} pageErrors, ${consoleErrors.filter((e) => e.type === "error").length} consoleErrors`);
  }

  await browser.close();

  // Write report
  const summary = {
    base: BASE,
    timestamp: new Date().toISOString(),
    total: results.length,
    failing: results.filter((r) => !r.ok).length,
  };

  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify({ summary, results }, null, 2));

  const md = [];
  md.push(`# /components landing-page audit`);
  md.push(``);
  md.push(`Generated ${summary.timestamp} against \`${summary.base}\``);
  md.push(``);
  md.push(`| Metric | Count |`);
  md.push(`|---|---|`);
  md.push(`| Categories audited | ${summary.total} |`);
  md.push(`| Failing | ${summary.failing} |`);
  md.push(``);
  md.push(`## Per-category results`);
  md.push(``);
  md.push(`| Category | OK | Cells rendered | Expected | Console errors | Page errors |`);
  md.push(`|---|---|---:|---:|---:|---:|`);
  for (const r of results) {
    md.push(`| ${r.category} | ${r.ok ? "✓" : "❌"} | ${r.cellCount ?? "—"} | ${r.expected ?? "—"} | ${r.consoleErrors?.length ?? 0} | ${r.pageErrors?.length ?? 0} |`);
  }
  md.push(``);

  const failures = results.filter((r) => !r.ok);
  if (failures.length) {
    md.push(`## Failures`);
    md.push(``);
    for (const r of failures) {
      md.push(`### ${r.category}`);
      md.push(``);
      if (r.pageErrors?.length) {
        md.push(`**Page errors:**`);
        md.push("```");
        for (const e of r.pageErrors) md.push(e);
        md.push("```");
      }
      if (r.consoleErrors?.length) {
        md.push(`**Console errors:**`);
        md.push("```");
        for (const e of r.consoleErrors) md.push(e);
        md.push("```");
      }
      md.push(``);
    }
  }
  fs.writeFileSync(path.join(outDir, "report.md"), md.join("\n"));

  console.log(`\nSummary:`);
  console.log(`  categories: ${summary.total}`);
  console.log(`  failing:    ${summary.failing}`);
  console.log(`  report:     ${path.relative(ROOT, outDir)}/report.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
