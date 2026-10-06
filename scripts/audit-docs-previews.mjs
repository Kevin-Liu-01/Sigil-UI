#!/usr/bin/env node

/**
 * Full docs-preview audit.
 *
 * Recurses through every component-oriented docs category, checks that each
 * page has a mounted preview, and validates the preview in light and dark
 * themes for runtime errors, token-backed colors, readable contrast, overflow,
 * and keyboard focusability.
 *
 * Usage:
 *   node scripts/audit-docs-previews.mjs --base=http://localhost:4010
 *   node scripts/audit-docs-previews.mjs --route=3d/box3-d-grid
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_ROOT = path.join(ROOT, "apps/web/content/docs");
const OUT_ROOT = path.join(ROOT, "output/audit");
const COMPONENT_CATEGORIES = new Set([
  "3d", "animation", "components", "diagrams", "effects", "layout",
  "marketing", "navigation", "overlays", "patterns", "playbook", "sections", "shapes",
]);

const args = parseArgs(process.argv.slice(2));
const BASE = args.base ?? "http://localhost:4010";
const CONCURRENCY = Number(args.concurrency ?? 8);
const WIDTH = Number(args.width ?? 1280);
const ROUTE_FILTER = args.route ? new Set(String(args.route).split(",").map((route) => route.trim())) : null;
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
      const route = path.relative(DOCS_ROOT, file).replace(/\.mdx$/, "").split(path.sep).join("/");
      const source = fs.readFileSync(file, "utf8");
      const category = route.split("/")[0];
      const title = source.match(/^title:\s*["']?([^"'\n]+)["']?$/m)?.[1]?.trim() ?? path.basename(route);
      const previews = [...source.matchAll(/<ComponentPreview([^>]*)>([\s\S]*?)<\/ComponentPreview>/g)];
      const preview = previews[0];
      return {
        category,
        file,
        previewAttrs: preview?.[1]?.trim() ?? "",
        previewBody: previews.map((match) => match[2].trim()).join("\n"),
        previewCount: previews.length,
        route,
        source,
        title,
      };
    })
    .filter((doc) => COMPONENT_CATEGORIES.has(doc.category))
    .filter((doc) => /^## Import$/m.test(doc.source))
    .filter((doc) => !(doc.category === "animation" && /^use[A-Z]/.test(doc.title)))
    .filter((doc) => !ROUTE_FILTER || ROUTE_FILTER.has(doc.route))
    .sort((a, b) => a.route.localeCompare(b.route));
}

function staticFindings(doc) {
  const findings = [];
  if (!doc.previewBody) {
    findings.push({ severity: "error", id: "missing-preview", note: "component doc has no ComponentPreview" });
    return findings;
  }
  if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(doc.previewBody)) {
    findings.push({ severity: "error", id: "hardcoded-preview-color", note: "preview authors a literal color instead of a Sigil token" });
  }
  if (/\b(?:bg|text|border)-(?:white|black|slate|gray|zinc|neutral|red|orange|amber|yellow|green|blue|indigo|violet|purple|pink)-?\d*\b/.test(doc.previewBody)) {
    findings.push({ severity: "error", id: "hardcoded-preview-utility", note: "preview bypasses Sigil color tokens" });
  }
  const tag = doc.previewBody.match(/<([A-Z][A-Za-z0-9]*)/)?.[1];
  if (tag && new RegExp(`^<${tag}(?:\\s[^>]*)?\\s*/>$`).test(doc.previewBody)) {
    findings.push({ severity: "info", id: "bare-preview", note: `preview is a bare <${tag} /> example` });
  }
  return findings;
}

function screenshotName(route, theme, index) {
  return `${route.replaceAll("/", "__")}--${theme}--${index + 1}.png`;
}

async function auditPreview(context, doc, theme, previewIndex, outDir) {
  const page = await context.newPage();
  const runtime = [];
  page.on("pageerror", (error) => runtime.push({ type: "pageerror", text: String(error).slice(0, 500) }));
  page.on("console", (message) => {
    if (message.type() !== "error" && message.type() !== "warning") return;
    const text = message.text();
    if (/Failed to load resource: net::ERR/.test(text)) return;
    runtime.push({ type: message.type(), text: text.slice(0, 500) });
  });
  await page.addInitScript((requestedTheme) => {
    localStorage.setItem("sigil-theme", requestedTheme);
  }, theme);

  const result = { route: doc.route, theme, previewIndex, url: `${BASE}/docs/${doc.route}`, findings: [] };
  try {
    const response = await page.goto(result.url, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
    result.status = response?.status() ?? null;
    await page.waitForSelector(".sigil-preview", { timeout: 20_000 });
    await page.waitForFunction((index) => {
      const preview = document.querySelectorAll(".sigil-preview")[index];
      if (!preview || preview.children.length === 0) return false;
      const only = preview.children.length === 1 ? preview.firstElementChild : null;
      return !(only?.getAttribute("aria-hidden") === "true" && only.textContent?.trim() === "·");
    }, previewIndex, { timeout: 5_000 }).catch(() => {});
    if (await page.locator('[data-slot="mermaid-diagram"]').count()) {
      await page.waitForFunction(() => document.querySelector('[data-slot="mermaid-diagram"] svg, [data-slot="mermaid-diagram"] [role="alert"]'), undefined, { timeout: 10_000 });
    }
    await page.waitForTimeout(200);
    result.metrics = await page.evaluate(({ requestedTheme, previewIndex }) => {
      const preview = document.querySelectorAll(".sigil-preview")[previewIndex];
      if (!(preview instanceof HTMLElement)) return null;
      const rootStyle = getComputedStyle(document.documentElement);
      const previewStyle = getComputedStyle(preview);
      const rootBackground = rootStyle.getPropertyValue("--s-background").trim();
      const rootSurface = rootStyle.getPropertyValue("--s-surface").trim();
      const parseRgb = (value) => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (!match) {
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const context = canvas.getContext("2d");
          if (!context || !CSS.supports("color", value)) return null;
          context.fillStyle = value;
          context.fillRect(0, 0, 1, 1);
          const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
          return { r, g, b, a: alpha / 255 };
        }
        const numbers = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
        return numbers.length >= 3 ? { r: numbers[0], g: numbers[1], b: numbers[2], a: numbers[3] ?? 1 } : null;
      };
      const luminance = (color) => {
        const channel = (value) => {
          const normalized = value / 255;
          return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
      };
      const contrast = (a, b) => {
        const first = luminance(a);
        const second = luminance(b);
        return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
      };
      const sameColorValue = (first, second) => {
        const asOklab = (color) => {
          const match = color.match(/^okl(ab|ch)\(([^)]+)\)$/);
          if (!match) return null;
          const channels = [...match[2].matchAll(/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi)].map((item) => Number(item[0]));
          if (channels.length < 3) return null;
          if (match[1] === "ab") return channels.slice(0, 3);
          const radians = channels[2] * Math.PI / 180;
          return [channels[0], channels[1] * Math.cos(radians), channels[1] * Math.sin(radians)];
        };
        const firstOklab = asOklab(first);
        const secondOklab = asOklab(second);
        if (firstOklab && secondOklab) {
          return firstOklab.every((value, index) => Math.abs(value - secondOklab[index]) < 0.0005);
        }
        const firstFunction = first.slice(0, first.indexOf("("));
        const secondFunction = second.slice(0, second.indexOf("("));
        if (firstFunction !== secondFunction) return false;
        const values = (color) => [...color.matchAll(/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi)].map((match) => Number(match[0]));
        const firstValues = values(first);
        const secondValues = values(second);
        return firstValues.length === secondValues.length
          && firstValues.every((value, index) => Math.abs(value - secondValues[index]) < 0.001);
      };
      const opaqueBackground = (element) => {
        let current = element;
        while (current instanceof Element) {
          const style = getComputedStyle(current);
          // A solid-color calculation cannot represent pixels painted by a gradient or image.
          if (style.backgroundImage !== "none") return null;
          const color = parseRgb(style.backgroundColor);
          if (color && color.a > 0.95) return color;
          if (current === preview) break;
          current = current.parentElement;
        }
        return parseRgb(previewStyle.backgroundColor);
      };
      const textBackground = (element) => {
        const base = opaqueBackground(element);
        const textStyle = getComputedStyle(element);
        // A painted outline is the immediate backdrop for the glyph's fill.
        if (element instanceof SVGTextElement && textStyle.paintOrder.startsWith("stroke") && Number.parseFloat(textStyle.strokeWidth) >= 2) {
          const outline = parseRgb(textStyle.stroke);
          if (outline && outline.a > 0.95) return outline;
        }
        const svg = element instanceof SVGElement ? element.ownerSVGElement : element.closest("svg");
        if (!svg || !base) return base;
        const rect = element.getBoundingClientRect();
        const center = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        const shapes = [...svg.querySelectorAll("path, rect, circle, ellipse, polygon")].reverse();
        for (const shape of shapes) {
          if (!(shape instanceof SVGGeometryElement) || !(shape.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
          const matrix = shape.getScreenCTM();
          if (!matrix || !shape.isPointInFill(center.matrixTransform(matrix.inverse()))) continue;
          const style = getComputedStyle(shape);
          const fill = parseRgb(style.fill);
          if (!fill) continue;
          const alpha = fill.a * Number(style.fillOpacity) * Number(style.opacity);
          if (alpha <= 0) continue;
          return { r: fill.r * alpha + base.r * (1 - alpha), g: fill.g * alpha + base.g * (1 - alpha), b: fill.b * alpha + base.b * (1 - alpha), a: 1 };
        }
        return base;
      };
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.05;
      };
      const lowContrast = [...preview.querySelectorAll("*")]
        .filter((element) => visible(element))
        .filter((element) => [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent?.trim()))
        .map((element) => {
          const style = getComputedStyle(element);
          const foreground = parseRgb(element instanceof SVGElement ? style.fill : style.color);
          const background = textBackground(element);
          if (!foreground || !background) return null;
          const ratio = contrast(foreground, background);
          const size = Number.parseFloat(style.fontSize);
          const weight = Number.parseInt(style.fontWeight, 10) || 400;
          const required = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
          return ratio + 0.05 < required ? {
            ratio: Number(ratio.toFixed(2)),
            required,
            tag: element.tagName.toLowerCase(),
            text: element.textContent?.trim().slice(0, 48) ?? "",
          } : null;
        })
        .filter(Boolean)
        .slice(0, 8);
      const interactive = [...preview.querySelectorAll("button, a[href], input, select, textarea, [role='button'], [role='switch'], [role='tab'], [tabindex]")]
        .filter((element) => element instanceof HTMLElement && visible(element) && !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true")
        .filter((element) => element.getAttribute("tabindex") !== "-1" || /^(BUTTON|INPUT|SELECT|TEXTAREA)$/.test(element.tagName));
      const interactionIssues = interactive.map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const nativeFocusable = /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(element.tagName);
        const labelledBy = element.getAttribute("aria-labelledby")?.split(/\s+/).map((id) => document.getElementById(id)?.textContent?.trim()).filter(Boolean).join(" ");
        const explicitLabelElement = element.id
          ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)
          : undefined;
        const explicitLabel = explicitLabelElement?.textContent?.trim();
        const wrappingLabel = element.closest("label");
        const labels = "labels" in element && element.labels
          ? [...element.labels].map((label) => label.textContent?.trim()).filter(Boolean).join(" ")
          : explicitLabel || wrappingLabel?.textContent?.trim();
        const groupLabel = element.closest("[role='group'][aria-label]")?.getAttribute("aria-label");
        const name = element.getAttribute("aria-label") || labelledBy || labels || groupLabel || element.getAttribute("title") || element.getAttribute("placeholder") || element.textContent?.trim();
        const isVisuallyHiddenInput = element instanceof HTMLInputElement
          && (element.type === "file" || (rect.width <= 2 && rect.height <= 2));
        const role = element.getAttribute("role");
        const parentRect = element.parentElement?.getBoundingClientRect();
        const sliderRect = role === "slider"
          ? element.closest("[data-slot='slider']")?.getBoundingClientRect()
          : undefined;
        const labelElement = explicitLabelElement instanceof HTMLElement ? explicitLabelElement : wrappingLabel;
        const labelRect = labelElement?.getBoundingClientRect();
        const labelContainerRect = labelElement && element.parentElement?.contains(labelElement)
          ? parentRect
          : undefined;
        // A wide, short label must not replace an adequately sized input.
        // Either the control or its associated clickable target can satisfy
        // the minimum; each candidate must meet both dimensions itself.
        const hitTargets = [rect, labelContainerRect, labelRect, sliderRect,
          role === "slider" ? parentRect : undefined].filter(Boolean);
        const effectiveRect = hitTargets.find((target) => target.width >= 20 && target.height >= 20) ?? rect;
        const problems = [];
        if (style.pointerEvents === "none") problems.push("pointer-events-none");
        if (!name && element.getAttribute("type") !== "hidden") problems.push("no-accessible-name");
        if (!isVisuallyHiddenInput && role !== "separator" && (effectiveRect.width < 20 || effectiveRect.height < 20)) problems.push(`tiny-hit-area(${Math.round(effectiveRect.width)}x${Math.round(effectiveRect.height)})`);
        return problems.length ? { tag: element.tagName.toLowerCase(), problems } : null;
      }).filter(Boolean).slice(0, 8);
      let focusProbe = true;
      if (interactive[0] instanceof HTMLElement) {
        interactive[0].focus({ preventScroll: true });
        focusProbe = preview.contains(document.activeElement);
      }
      const rect = preview.getBoundingClientRect();
      return {
        actualTheme: document.documentElement.getAttribute("data-theme")
          || (document.documentElement.classList.contains("dark") ? "dark" : "light"),
        descendantCount: preview.querySelectorAll("*").length,
        collapsedImages: [...preview.querySelectorAll('img, [role="img"]')].filter((el) => { const rect = el.getBoundingClientRect(); return !rect.width || !rect.height; }).length,
        renderError: preview.textContent?.match(/Mermaid error:[^\n]+|Unsupported color format:[^\n]+/)?.[0] ?? null,
        focusProbe,
        interactionIssues,
        interactiveCount: interactive.length,
        lowContrast,
        previewBackground: previewStyle.backgroundColor,
        previewBackgroundMatchesToken: sameColorValue(previewStyle.backgroundColor, rootBackground),
        requestedTheme,
        rootBackground,
        rootSurface,
        height: Math.round(rect.height),
        width: Math.round(rect.width),
        overflowX: preview.scrollWidth - preview.clientWidth,
        overflowY: preview.scrollHeight - preview.clientHeight,
      };
    }, { requestedTheme: theme, previewIndex });
    if (result.status && result.status >= 400) result.findings.push({ severity: "error", id: "http-error", note: `HTTP ${result.status}` });
    if (!result.metrics) result.findings.push({ severity: "error", id: "missing-runtime-preview", note: "preview did not mount" });
    if (result.metrics?.collapsedImages) result.findings.push({ severity: "warning", id: "collapsed-image", note: `${result.metrics.collapsedImages} image(s) have no rendered size` });
    if (result.metrics?.renderError) result.findings.push({ severity: "error", id: "render-error", note: result.metrics.renderError });
    if (result.metrics?.actualTheme !== theme) result.findings.push({ severity: "error", id: "theme-mismatch", note: `requested ${theme}, rendered ${result.metrics?.actualTheme ?? "unset"}` });
    if (result.metrics && !result.metrics.previewBackgroundMatchesToken) result.findings.push({ severity: "error", id: "preview-background-mismatch", note: "preview canvas does not resolve to --s-background" });
    if ((result.metrics?.lowContrast.length ?? 0) > 0) result.findings.push({ severity: "warning", id: "low-contrast", note: `${result.metrics.lowContrast.length} text samples below WCAG AA` });
    if ((result.metrics?.interactionIssues.length ?? 0) > 0) result.findings.push({ severity: "warning", id: "interaction-contract", note: `${result.metrics.interactionIssues.length} visible controls have focus/name/hit-area issues` });
    if (result.metrics?.focusProbe === false) result.findings.push({ severity: "error", id: "focus-failed", note: "first enabled preview control cannot receive focus" });
    if ((result.metrics?.overflowX ?? 0) > 2) result.findings.push({ severity: "warning", id: "horizontal-overflow", note: `${Math.round(result.metrics.overflowX)}px clipped horizontally` });
    for (const issue of runtime) {
      const severity = issue.type === "warning" ? "warning" : "error";
      result.findings.push({ severity, id: issue.type === "pageerror" ? "page-error" : `console-${issue.type}`, note: issue.text });
    }
    const shouldCapture = SCREENSHOTS === "all" || (SCREENSHOTS === "flagged" && result.findings.length > 0);
    if (shouldCapture) {
      const target = path.join(outDir, "screenshots", screenshotName(doc.route, theme, previewIndex));
      await page.locator(".sigil-preview").nth(previewIndex).screenshot({ path: target, animations: "disabled" }).catch(() => {});
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
  const missing = docs.filter((doc) => !doc.previewBody);
  const errors = results.filter((result) => result.findings.some((finding) => finding.severity === "error"));
  const warnings = results.filter((result) => !result.findings.some((finding) => finding.severity === "error") && result.findings.some((finding) => finding.severity === "warning"));
  const summary = { docs: docs.length, previewDocs: docs.length - missing.length, missingPreviews: missing.length, previewExamples: docs.reduce((sum, doc) => sum + doc.previewCount, 0), themeRuns: results.length, errors: errors.length, warnings: warnings.length };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify({ summary, docs: docs.map((doc) => ({ route: doc.route, staticFindings: staticFindings(doc) })), results }, null, 2));
  const lines = [
    "# Sigil docs preview audit", "",
    `Generated against \`${BASE}\` in ${THEMES.join(" + ")} mode.`, "",
    "| Metric | Count |", "|---|---:|",
    `| Component docs | ${summary.docs} |`,
    `| Preview examples | ${summary.previewExamples} |`,
    `| Missing previews | ${summary.missingPreviews} |`,
    `| Theme runs | ${summary.themeRuns} |`,
    `| Runs with errors | ${summary.errors} |`,
    `| Runs with warnings only | ${summary.warnings} |`, "",
  ];
  if (missing.length) {
    lines.push("## Missing previews", "", ...missing.map((doc) => `- \`${doc.route}\``), "");
  }
  const flagged = [...errors, ...warnings];
  if (flagged.length) {
    lines.push("## Runtime, color, and interaction findings", "", "| Route | Theme | Findings |", "|---|---|---|");
    for (const result of flagged) {
      const notes = result.findings.map((finding) => `\`${finding.id}\` ${String(finding.note).replaceAll("|", "\\|").replaceAll("\n", " ").slice(0, 180)}`).join("<br>");
      lines.push(`| ${result.route} (preview ${result.previewIndex + 1}) | ${result.theme} | ${notes} |`);
    }
    lines.push("");
  }
  fs.writeFileSync(path.join(outDir, "report.md"), lines.join("\n"));
  return summary;
}

async function main() {
  const docs = readDocs();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outDir = path.join(OUT_ROOT, stamp, `docs-previews-${WIDTH}`);
  fs.mkdirSync(path.join(outDir, "screenshots"), { recursive: true });
  const runnable = docs.filter((doc) => doc.previewBody);
  const queue = runnable.flatMap((doc) => Array.from({ length: doc.previewCount }, (_, previewIndex) => THEMES.map((theme) => ({ doc, theme, previewIndex }))).flat());
  const runCount = queue.length;
  const browser = await chromium.launch({ headless: true });
  const contexts = await Promise.all(Array.from({ length: Math.min(CONCURRENCY, Math.max(queue.length, 1)) }, () => browser.newContext({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 })));
  const results = [];
  let completed = 0;
  console.log(`Auditing ${docs.length} component docs (${queue.length} theme runs) on ${BASE}`);
  async function worker(context) {
    while (queue.length) {
      const task = queue.shift();
      if (!task) break;
      const result = await auditPreview(context, task.doc, task.theme, task.previewIndex, outDir);
      results.push(result);
      completed += 1;
      const errors = result.findings.filter((finding) => finding.severity === "error").length;
      const warnings = result.findings.filter((finding) => finding.severity === "warning").length;
      console.log(`[${completed}/${runCount}] ${errors ? `ERR ${errors}` : warnings ? `WARN ${warnings}` : "OK"} ${task.doc.route} #${task.previewIndex + 1} (${task.theme})`);
    }
  }
  await Promise.all(contexts.map((context) => worker(context)));
  await Promise.all(contexts.map((context) => context.close()));
  await browser.close();
  results.sort((a, b) => a.route.localeCompare(b.route) || a.previewIndex - b.previewIndex || a.theme.localeCompare(b.theme));
  const summary = writeReport(outDir, docs, results);
  console.log("\nSummary", summary);
  console.log(`Report: ${path.relative(ROOT, path.join(outDir, "report.md"))}`);
  if (summary.errors || summary.missingPreviews) process.exitCode = 1;
}

await main();
