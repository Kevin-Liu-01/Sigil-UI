#!/usr/bin/env node
/**
 * Deep visual audit: load /components, click "All", capture a full-page
 * screenshot, then walk every rendered cell and flag ones whose root has
 * 0 visible descendants (rendering bug) or contains text matching common
 * runtime error markers ("undefined", "NaN", "[object Object]", etc.).
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

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outDir = path.join(OUT_BASE, stamp, "showcase-deep");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: HEADLESS });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (/Failed to load resource: net::ERR/.test(text)) return;
    consoleErrors.push(text.slice(0, 600));
  });
  page.on("pageerror", (err) => pageErrors.push(String(err).slice(0, 600)));

  console.log(`Loading ${BASE}/components...`);
  await page.goto(`${BASE}/components`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(800);

  const more = page.locator(".sigil-catalog-more button");
  while (await more.count()) await more.click();

  // Take full-page screenshot
  console.log("Capturing full-page screenshot of /components (All)...");
  await page.screenshot({ path: path.join(outDir, "components-all.png"), fullPage: true, animations: "disabled" });

  // Walk every showcase cell, measure render quality
  const cellReports = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('.sigil-catalog-card')];
    return cells.map((el) => {
      const name = el.getAttribute("data-component-name");
      const r = el.getBoundingClientRect();
      // count rendered descendants
      const descendants = el.querySelectorAll("*").length;
      const text = (el.textContent ?? "").trim();
      const flags = {
        nan: /\bNaN\b/.test(text),
        undef: /\bundefined\b/.test(text),
        objObj: /\[object Object\]/.test(text),
        empty: descendants <= 4 && text.length === 0,
      };
      return {
        name,
        height: Math.round(r.height),
        width: Math.round(r.width),
        descendants,
        textLength: text.length,
        flags,
      };
    });
  });

  await browser.close();

  const issues = cellReports.filter((c) => Object.values(c.flags).some(Boolean));
  console.log(`\nVisited ${cellReports.length} cells.`);
  console.log(`Cells with rendering issues: ${issues.length}`);
  for (const i of issues.slice(0, 50)) {
    const flags = Object.entries(i.flags).filter(([_, v]) => v).map(([k]) => k).join(", ");
    console.log(`  - ${i.name?.padEnd(36)}  [${flags}]  ${i.descendants} descendants, ${i.textLength}c text`);
  }

  fs.writeFileSync(path.join(outDir, "cells.json"), JSON.stringify(cellReports, null, 2));
  fs.writeFileSync(path.join(outDir, "consoleErrors.json"), JSON.stringify({ consoleErrors, pageErrors }, null, 2));

  console.log(`\nReports: ${path.relative(ROOT, outDir)}/`);
  console.log(`  Console errors: ${consoleErrors.length}`);
  console.log(`  Page errors:    ${pageErrors.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
