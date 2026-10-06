#!/usr/bin/env node

/**
 * Runtime audit for every MDX-backed /docs route.
 *
 * This complements audit-docs-previews.mjs: the preview auditor deeply checks
 * component canvases, while this script guarantees that every docs route —
 * including guides, indexes, and nonvisual hook docs — renders correctly in
 * both light and dark mode.
 *
 * Usage:
 *   node scripts/audit-docs-routes.mjs --base=http://localhost:4010
 *   node scripts/audit-docs-routes.mjs --route=installation,3d/box3-d-grid
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_ROOT = path.join(ROOT, "apps/web/content/docs");
const OUT_ROOT = path.join(ROOT, "output/audit");

const args = parseArgs(process.argv.slice(2));
const BASE = args.base ?? "http://localhost:4010";
const CONCURRENCY = Number(args.concurrency ?? 8);
const WIDTH = Number(args.width ?? 1280);
const ROUTE_FILTER = args.route
  ? new Set(String(args.route).split(",").map((route) => route.trim()))
  : null;
const THEMES = String(args.themes ?? "light,dark").split(",").map((theme) => theme.trim());
const SCREENSHOTS = args.screenshots ?? "flagged";
const TIMEOUT = Number(args.timeout ?? 45_000);

function parseArgs(argv) {
  const parsed = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const split = arg.indexOf("=");
    if (split === -1) parsed[arg.slice(2)] = true;
    else parsed[arg.slice(2, split)] = arg.slice(split + 1);
  }
  return parsed;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function readDocs() {
  return walk(DOCS_ROOT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourceRoute = path.relative(DOCS_ROOT, file).replace(/\.mdx$/, "").split(path.sep).join("/");
      const route = sourceRoute === "index" ? "" : sourceRoute;
      const source = fs.readFileSync(file, "utf8");
      return {
        file,
        previewCount: [...source.matchAll(/<ComponentPreview\b/g)].length,
        route,
        sourceRoute,
        title: source.match(/^title:\s*["']?([^"'\n]+)["']?$/m)?.[1]?.trim() ?? path.basename(sourceRoute),
      };
    })
    .filter((doc) => !ROUTE_FILTER || ROUTE_FILTER.has(doc.sourceRoute) || ROUTE_FILTER.has(doc.route))
    .sort((a, b) => a.sourceRoute.localeCompare(b.sourceRoute));
}

function screenshotName(route, theme) {
  return `${(route || "index").replaceAll("/", "__")}--${theme}.png`;
}

async function auditRoute(context, doc, theme, outDir) {
  const page = await context.newPage();
  const runtime = [];
  page.on("pageerror", (error) => runtime.push({ type: "pageerror", text: String(error).slice(0, 500) }));
  page.on("console", (message) => {
    if (message.type() !== "error" && message.type() !== "warning") return;
    const text = message.text();
    if (/Failed to load resource: net::ERR|favicon\.ico/.test(text)) return;
    runtime.push({ type: message.type(), text: text.slice(0, 500) });
  });
  await page.addInitScript((requestedTheme) => {
    localStorage.setItem("sigil-theme", requestedTheme);
  }, theme);

  const pathName = doc.route ? `/docs/${doc.route}` : "/docs";
  const result = {
    route: doc.sourceRoute,
    theme,
    url: `${BASE}${pathName}`,
    findings: [],
  };

  try {
    const response = await page.goto(result.url, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
    result.status = response?.status() ?? null;
    await page.waitForSelector("main", { timeout: 20_000 });
    await page.waitForTimeout(150);
    result.metrics = await page.evaluate(({ requestedTheme, expectedPreviewCount }) => {
      const main = document.querySelector("#nd-page") ?? document.querySelector("main");
      const article = main;
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      const colorToRgba = (value) => {
        if (!context || !value) return null;
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = "rgb(1, 2, 3)";
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        const data = context.getImageData(0, 0, 1, 1).data;
        return { r: data[0], g: data[1], b: data[2], a: data[3] / 255 };
      };
      const colorsMatch = (first, second) => {
        const a = colorToRgba(first);
        const b = colorToRgba(second);
        if (!a || !b) return false;
        return Math.abs(a.r - b.r) <= 2
          && Math.abs(a.g - b.g) <= 2
          && Math.abs(a.b - b.b) <= 2
          && Math.abs(a.a - b.a) <= 0.02;
      };
      const visible = (element) => {
        if (!(element instanceof HTMLElement)) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0
          && rect.height > 0
          && style.display !== "none"
          && style.visibility !== "hidden"
          && Number(style.opacity) > 0.05;
      };
      const previews = [...document.querySelectorAll(".sigil-preview")];
      const emptyPreviews = previews.filter((preview) => {
        if (!(preview instanceof HTMLElement) || !visible(preview)) return true;
        const rect = preview.getBoundingClientRect();
        return rect.height < 8 || preview.querySelectorAll("*").length === 0;
      }).length;
      const brokenImages = [...(article?.querySelectorAll("img") ?? [])]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.getAttribute("src") ?? "unknown")
        .slice(0, 5);
      const ids = [...document.querySelectorAll("[id]")].map((element) => element.id).filter(Boolean);
      const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))].slice(0, 5);
      const heading = article?.querySelector("h1");
      const mainRect = main?.getBoundingClientRect();
      const text = article?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const tokenNames = [
        "--s-background",
        "--s-surface",
        "--s-text",
        "--s-border",
        "--s-primary",
      ];
      const tokens = Object.fromEntries(tokenNames.map((name) => [name, rootStyle.getPropertyValue(name).trim()]));
      const applicationError = /Application error|Internal Server Error|This page could not be found/i.test(document.body.innerText);
      return {
        actualTheme: document.documentElement.getAttribute("data-theme")
          || (document.documentElement.classList.contains("dark") ? "dark" : "light"),
        applicationError,
        bodyBackground: bodyStyle.backgroundColor,
        bodyBackgroundMatchesToken: colorsMatch(bodyStyle.backgroundColor, tokens["--s-background"]),
        brokenImages,
        description: document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "",
        duplicateIds,
        emptyPreviews,
        expectedPreviewCount,
        heading: heading?.textContent?.trim() ?? "",
        mainHeight: Math.round(mainRect?.height ?? 0),
        mainOverflowX: main instanceof HTMLElement ? main.scrollWidth - main.clientWidth : 0,
        pageOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        previewCount: previews.length,
        requestedTheme,
        textLength: text.length,
        title: document.title,
        tokens,
      };
    }, { requestedTheme: theme, expectedPreviewCount: doc.previewCount });

    if (result.status && result.status >= 400) {
      result.findings.push({ severity: "error", id: "http-error", note: `HTTP ${result.status}` });
    }
    if (result.metrics.applicationError) {
      result.findings.push({ severity: "error", id: "application-error", note: "Next.js error fallback rendered" });
    }
    if (result.metrics.actualTheme !== theme) {
      result.findings.push({ severity: "error", id: "theme-mismatch", note: `requested ${theme}, rendered ${result.metrics.actualTheme}` });
    }
    if (!result.metrics.title) {
      result.findings.push({ severity: "error", id: "missing-title", note: "document title is empty" });
    }
    if (!result.metrics.description) {
      result.findings.push({ severity: "warning", id: "missing-description", note: "meta description is empty" });
    }
    if (!result.metrics.heading) {
      result.findings.push({ severity: "error", id: "missing-h1", note: "docs article has no H1" });
    }
    if (result.metrics.textLength < 40 || result.metrics.mainHeight < 40) {
      result.findings.push({ severity: "error", id: "empty-page", note: "main docs content is empty or collapsed" });
    }
    const missingTokens = Object.entries(result.metrics.tokens).filter(([, value]) => !value).map(([name]) => name);
    if (missingTokens.length) {
      result.findings.push({ severity: "error", id: "missing-theme-tokens", note: missingTokens.join(", ") });
    }
    if (!result.metrics.bodyBackgroundMatchesToken) {
      result.findings.push({ severity: "error", id: "body-color-mismatch", note: "page background does not resolve to --s-background" });
    }
    if (result.metrics.previewCount !== doc.previewCount) {
      result.findings.push({ severity: "error", id: "preview-count-mismatch", note: `expected ${doc.previewCount}, rendered ${result.metrics.previewCount}` });
    }
    if (result.metrics.emptyPreviews) {
      result.findings.push({ severity: "error", id: "empty-preview", note: `${result.metrics.emptyPreviews} preview canvas(es) empty or collapsed` });
    }
    if (result.metrics.brokenImages.length) {
      result.findings.push({ severity: "error", id: "broken-image", note: result.metrics.brokenImages.join(", ") });
    }
    if (result.metrics.duplicateIds.length) {
      result.findings.push({ severity: "warning", id: "duplicate-id", note: result.metrics.duplicateIds.join(", ") });
    }
    if (result.metrics.pageOverflowX > 2 || result.metrics.mainOverflowX > 2) {
      result.findings.push({ severity: "warning", id: "horizontal-overflow", note: `page ${Math.round(result.metrics.pageOverflowX)}px, main ${Math.round(result.metrics.mainOverflowX)}px` });
    }
    for (const issue of runtime) {
      result.findings.push({
        severity: issue.type === "warning" ? "warning" : "error",
        id: issue.type === "pageerror" ? "page-error" : `console-${issue.type}`,
        note: issue.text,
      });
    }

    const shouldCapture = SCREENSHOTS === "all"
      || (SCREENSHOTS === "flagged" && result.findings.length > 0);
    if (shouldCapture) {
      const target = path.join(outDir, "screenshots", screenshotName(doc.route, theme));
      await page.screenshot({ path: target, fullPage: true, animations: "disabled" }).catch(() => {});
      result.screenshot = path.relative(outDir, target);
    }
  } catch (error) {
    result.findings.push({ severity: "error", id: "audit-fatal", note: String(error).slice(0, 500) });
  } finally {
    await page.close().catch(() => {});
  }
  return result;
}

function writeReport(outDir, docs, results) {
  const errors = results.filter((result) => result.findings.some((finding) => finding.severity === "error"));
  const warnings = results.filter((result) => !result.findings.some((finding) => finding.severity === "error")
    && result.findings.some((finding) => finding.severity === "warning"));
  const summary = {
    docsRoutes: docs.length,
    previewRoutes: docs.filter((doc) => doc.previewCount > 0).length,
    nonPreviewRoutes: docs.filter((doc) => doc.previewCount === 0).length,
    themeRuns: results.length,
    errors: errors.length,
    warnings: warnings.length,
  };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify({ summary, results }, null, 2));
  const lines = [
    "# Sigil complete docs route audit", "",
    `Generated against \`${BASE}\` in ${THEMES.join(" + ")} mode.`, "",
    "| Metric | Count |", "|---|---:|",
    `| Docs routes | ${summary.docsRoutes} |`,
    `| Routes with previews | ${summary.previewRoutes} |`,
    `| Guide/index/nonvisual routes | ${summary.nonPreviewRoutes} |`,
    `| Theme runs | ${summary.themeRuns} |`,
    `| Runs with errors | ${summary.errors} |`,
    `| Runs with warnings only | ${summary.warnings} |`, "",
  ];
  const flagged = [...errors, ...warnings];
  if (flagged.length) {
    lines.push("## Findings", "", "| Route | Theme | Findings |", "|---|---|---|");
    for (const result of flagged) {
      const notes = result.findings
        .map((finding) => `\`${finding.id}\` ${String(finding.note).replaceAll("|", "\\|").replaceAll("\n", " ").slice(0, 180)}`)
        .join("<br>");
      lines.push(`| ${result.route} | ${result.theme} | ${notes} |`);
    }
    lines.push("");
  }
  fs.writeFileSync(path.join(outDir, "report.md"), lines.join("\n"));
  return summary;
}

async function main() {
  const docs = readDocs();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outDir = path.join(OUT_ROOT, stamp, `docs-routes-${WIDTH}`);
  fs.mkdirSync(path.join(outDir, "screenshots"), { recursive: true });
  const queue = docs.flatMap((doc) => THEMES.map((theme) => ({ doc, theme })));
  const browser = await chromium.launch({ headless: true });
  const workerCount = Math.min(CONCURRENCY, Math.max(queue.length, 1));
  const contexts = await Promise.all(Array.from({ length: workerCount }, () => browser.newContext({
    viewport: { width: WIDTH, height: 900 },
    deviceScaleFactor: 1,
  })));
  const results = [];
  let completed = 0;
  console.log(`Auditing every docs route: ${docs.length} routes (${queue.length} theme runs) on ${BASE}`);

  async function worker(context) {
    while (queue.length) {
      const task = queue.shift();
      if (!task) break;
      const result = await auditRoute(context, task.doc, task.theme, outDir);
      results.push(result);
      completed += 1;
      const errors = result.findings.filter((finding) => finding.severity === "error").length;
      const warnings = result.findings.filter((finding) => finding.severity === "warning").length;
      console.log(`[${completed}/${docs.length * THEMES.length}] ${errors ? `ERR ${errors}` : warnings ? `WARN ${warnings}` : "OK"} ${task.doc.sourceRoute} (${task.theme})`);
    }
  }

  await Promise.all(contexts.map((context) => worker(context)));
  await Promise.all(contexts.map((context) => context.close()));
  await browser.close();
  results.sort((a, b) => a.route.localeCompare(b.route) || a.theme.localeCompare(b.theme));
  const summary = writeReport(outDir, docs, results);
  console.log("\nSummary", summary);
  console.log(`Report: ${path.relative(ROOT, path.join(outDir, "report.md"))}`);
  if (summary.errors) process.exitCode = 1;
}

await main();
