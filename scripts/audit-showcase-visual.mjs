#!/usr/bin/env node
/**
 * Per-cell visual audit of the /components landing page. Walks every category
 * filter and flags showcase cells whose primary rendered element is too small
 * to meaningfully demo the component (cards < 100px wide, sections < 150px,
 * or empty aspect-ratio collapses).
 *
 * Output: output/audit/<timestamp>/showcase-visual/{report.md, report.json}
 *
 * Usage: node scripts/audit-showcase-visual.mjs --base=http://localhost:4000
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_BASE = path.join(ROOT, "output/audit");

const args = parseArgs(process.argv.slice(2));
const BASE = args.base ?? "http://localhost:4000";

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

// Components that are intentionally very small/narrow on the showcase grid.
const KNOWN_SMALL = new Set([
  "AccessibleIcon", "AnnouncementBar", "Avatar", "AvatarGroup", "Badge",
  "Braille Spinner", "BrailleSpinner", "Circular Progress", "CircularProgress",
  "Diamond", "Hexagon", "Triangle", "Diagonal", "Cross", "CrossHatch",
  "Kbd", "KeyboardKey", "LoadingSpinner", "OnlineIndicator", "PresenceAvatar",
  "Shape", "Skeleton", "StatusBadge", "StatusDot", "StatusPill", "Switch",
  "ThemeSwatch", "Triangle", "VersionBadge", "VisuallyHidden", "AccentActive",
  "Pulse", "Ripple", "Marquee", "WordRotate", "TypeWriter", "LetterPullUp",
  "GradientText", "TextReveal", "NumberTicker", "BlurFade", "FadeIn",
  "SlideIn", "ScaleIn", "Stagger", "AnimateOnMount", "AnimateOnScroll",
  "ScrollProgress", "ParallaxLayer", "Pattern", "Tessellation", "GrainGradient",
  "FrostedPanel", "MonoLabel", "TabularValue", "DensityText", "Spacer",
  "HRule", "Divider", "Separator",
]);

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = path.join(OUT_BASE, stamp, `showcase-visual-${args.width ?? 1440}`);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: Number(args.width ?? 1440), height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

console.log(`Showcase visual audit on ${BASE}/components`);
await page.goto(`${BASE}/components`, { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.waitForTimeout(800);

const allFlagged = [];

for (const cat of (args.categories ? String(args.categories).split(",") : CATEGORIES)) {
  if (cat !== "All") {
    try {
      const labels = { UI: "Core interface", Sections: "Page sections", "3D": "3D elements", Pretext: "Typography", Playbook: "Composition" };
      const label = new RegExp(`^${labels[cat] ?? cat}\\s`);
      if (Number(args.width ?? 1440) < 1024) {
        await page.getByRole("combobox", { name: "Category" }).click();
        await page.getByRole("option", { name: label }).click();
      } else {
        await page.locator(".sigil-catalog-sidebar").getByRole("button", { name: label }).click();
      }
      await page.waitForTimeout(300);
    } catch (error) {
      console.log(`Failed category ${cat} at ${page.url()}`);
      await page.screenshot({ path: path.join(outDir, `failure-${cat}.png`) });
      allFlagged.push({ category: cat, name: cat, slot: "category-control", width: 0, height: 0, reason: `selection failed: ${error.message}` });
      continue;
    }
  }

  const more = page.locator(".sigil-catalog-more button");
  while (await more.count()) await more.click();

  const issues = await page.evaluate((knownSmallArr) => {
    const knownSmall = new Set(knownSmallArr);
    const out = [];
    for (const cell of document.querySelectorAll('.sigil-catalog-card')) {
      const name = cell.getAttribute("data-component-name") ?? "(unknown)";
      if (cell.scrollWidth > cell.clientWidth + 2) {
        out.push({ name, slot: "catalog-card", width: cell.clientWidth, height: cell.clientHeight, reason: `overflow:${cell.scrollWidth}px` });
      }
      // Also check kebab-cased and space-separated forms
      const nameVariants = [name, name.replace(/\s+/g, ""), name.replace(/([a-z])([A-Z])/g, "$1 $2")];
      if (nameVariants.some((n) => knownSmall.has(n))) continue;

      // Find the dominant rendered child of the cell preview area
      const preview = cell.querySelector('.sigil-catalog-card-preview');
      if (!preview) continue;
      const direct = preview.querySelector('[data-slot="card"], [data-slot$="-section"], [data-slot]');
      if (!direct) continue;
      const r = direct.getBoundingClientRect();
      const slot = direct.getAttribute("data-slot") ?? "";
      const isCard = slot === "card";
      const isSection = slot.endsWith("-section");

      if (isCard && r.width < 100) {
        out.push({ name, slot, width: Math.round(r.width), height: Math.round(r.height), reason: "card<100px" });
      } else if (isSection && r.width < 150) {
        out.push({ name, slot, width: Math.round(r.width), height: Math.round(r.height), reason: "section<150px" });
      } else if (r.width > 0 && r.height > 0 && r.width * r.height < 200) {
        out.push({ name, slot, width: Math.round(r.width), height: Math.round(r.height), reason: "tiny-area" });
      }
    }
    return out;
  }, [...KNOWN_SMALL]);

  if (issues.length) {
    for (const i of issues) allFlagged.push({ category: cat, ...i });
  }
  console.log(`  ${cat.padEnd(12)} ${issues.length} issues`);
}

await browser.close();

const summary = {
  base: BASE,
  width: Number(args.width ?? 1440),
  timestamp: new Date().toISOString(),
  flagged: allFlagged.length,
};
fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify({ summary, flagged: allFlagged }, null, 2));

const md = [];
md.push(`# Showcase Visual Audit`);
md.push(``);
md.push(`Generated ${summary.timestamp} against \`${summary.base}/components\``);
md.push(``);
md.push(`Flagged cells: **${summary.flagged}**`);
md.push(``);
if (allFlagged.length) {
  md.push(`| Category | Component | Slot | Dimensions | Reason |`);
  md.push(`|---|---|---|---|---|`);
  for (const f of allFlagged) {
    md.push(`| ${f.category} | ${f.name} | ${f.slot} | ${f.width}×${f.height}px | ${f.reason} |`);
  }
}
fs.writeFileSync(path.join(outDir, "report.md"), md.join("\n"));

console.log(`\nFlagged: ${summary.flagged}`);
console.log(`Report:  ${path.relative(ROOT, outDir)}/report.md`);

if (allFlagged.length) process.exitCode = 1;
