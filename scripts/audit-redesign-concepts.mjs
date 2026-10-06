#!/usr/bin/env node

import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const args = new Map(
  process.argv.slice(2).map((value) => {
    const [key, ...rest] = value.replace(/^--/, "").split("=");
    return [key, rest.length ? rest.join("=") : true];
  }),
);
const base = String(args.get("base") ?? "http://localhost:4010");
const publish = args.has("publish");
const quick = args.has("quick");
const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
const outputDir = join(root, "output/redesign/audit", stamp);
const screenshotDir = join(outputDir, "screenshots");
const previewDir = join(root, "apps/web/public/concepts/previews");

const manifestSource = await readFile(join(root, "apps/web/lib/concepts/manifest.ts"), "utf8");
const slugBlock = manifestSource.match(/CONCEPT_SLUGS\s*=\s*\[([\s\S]*?)\]\s*as const/)?.[1] ?? "";
const allSlugs = [...slugBlock.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
if (allSlugs.length !== 20 || new Set(allSlugs).size !== 20) {
  throw new Error(`Expected 20 unique concept slugs, received ${allSlugs.length}.`);
}
const requestedSlug = typeof args.get("slug") === "string" ? String(args.get("slug")) : null;
if (requestedSlug && !allSlugs.includes(requestedSlug)) throw new Error(`Unknown concept slug: ${requestedSlug}`);
const slugs = requestedSlug ? [requestedSlug] : allSlugs;

const viewports = quick
  ? [{ name: "desktop", width: 1440, height: 1000 }]
  : [
      { name: "desktop", width: 1440, height: 1000 },
      { name: "mobile", width: 390, height: 844 },
    ];
const themes = quick ? ["dark"] : ["light", "dark"];
const findings = [];
const captures = [];

function record(slug, severity, code, message, context = {}) {
  findings.push({ slug, severity, code, message, ...context });
}

async function preparePage(browser, viewport, theme, reducedMotion = false) {
  const context = await browser.newContext({
    viewport,
    colorScheme: theme,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  await context.addInitScript(({ activeTheme }) => {
    localStorage.setItem("sigil-theme", activeTheme);
  }, { activeTheme: theme });
  const page = await context.newPage();
  return { context, page };
}

async function inspectRoute(browser, slug, viewport, theme, options = {}) {
  const { context, page } = await preparePage(browser, viewport, theme, options.reducedMotion);
  const runtime = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtime.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtime.push(`pageerror: ${error.message}`));
  const url = `${base}/concepts/${slug}${options.compare ? "?compare=1" : ""}`;

  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    if (!response?.ok()) record(slug, "error", "http", `HTTP ${response?.status() ?? "none"}`, { url });
    await page.locator("[data-concept]").waitFor({ state: "visible", timeout: 20_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(options.reducedMotion ? 150 : 500);

    const state = await page.evaluate(() => {
      const brokenImages = [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src);
      const html = document.documentElement;
      const concept = document.querySelector("[data-concept]");
      const controls = [...(concept?.querySelectorAll("button, input, select, textarea") ?? [])];
      return {
        mainCount: concept?.querySelectorAll("main").length ?? 0,
        h1Count: [...(concept?.querySelectorAll("h1") ?? [])].filter((heading) => {
          const style = getComputedStyle(heading);
          return style.display !== "none" && style.visibility !== "hidden";
        }).length,
        overflow: Math.max(
          html.scrollWidth - html.clientWidth,
          concept ? concept.scrollWidth - concept.clientWidth : 0,
        ),
        brokenImages,
        motion: concept?.closest("[data-concept-motion]")?.getAttribute("data-concept-motion"),
        theme: html.dataset.theme,
        unresolvedCopy: /\b(undefined|\[object Object\]|NaN)\b/.test(concept?.textContent ?? ""),
        unnamedControls: controls.flatMap((control, index) => {
          const id = control.getAttribute("id");
          const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
          const name = control.getAttribute("aria-label")
            || control.getAttribute("title")
            || label?.textContent
            || control.closest("label")?.textContent
            || (control instanceof HTMLButtonElement ? control.textContent : "");
          return name?.trim() ? [] : [`${control.tagName.toLowerCase()}[${index}]`];
        }),
      };
    });

    if (state.mainCount !== 1) record(slug, "error", "main-count", `Expected one main, found ${state.mainCount}.`);
    if (state.h1Count !== 1) record(slug, "error", "h1-count", `Expected one visible h1, found ${state.h1Count}.`);
    if (state.overflow > 1) record(slug, "error", "horizontal-overflow", `${state.overflow}px overflow.`, { viewport: viewport.name });
    if (state.brokenImages.length) record(slug, "error", "broken-image", state.brokenImages.join(", "));
    if (state.theme !== theme) record(slug, "warning", "theme", `Expected ${theme}, found ${state.theme}.`);
    if (state.unresolvedCopy) record(slug, "error", "unresolved-copy", "Rendered copy contains undefined, NaN, or [object Object].");
    if (state.unnamedControls.length) record(slug, "error", "accessible-name", state.unnamedControls.join(", "));
    if (options.reducedMotion && state.motion !== "reduced") record(slug, "error", "reduced-motion", `Motion root is ${state.motion}.`);
    if (options.screenshot) {
      const filename = `${slug}-${viewport.name}-${theme}${options.reducedMotion ? "-reduced" : ""}.png`;
      const path = join(screenshotDir, filename);
      await mkdir(dirname(path), { recursive: true });
      await page.screenshot({ path, fullPage: true });
      captures.push(path);
      if (publish && viewport.name === "desktop" && theme === "dark" && !options.reducedMotion) {
        await mkdir(previewDir, { recursive: true });
        await copyFile(path, join(previewDir, `${slug}-desktop-dark.png`));
      }
    }

    if (options.exercise) {
      const control = page.locator("[data-concept] main button:not([disabled])").first();
      if (await control.count()) {
        await control.click({ timeout: 5_000 });
        await page.waitForTimeout(120);
      }
      await page.evaluate(() => {
        const concept = document.querySelector("[data-concept]");
        let parent = concept?.parentElement ?? null;
        while (parent && parent !== document.body) {
          const overflow = getComputedStyle(parent).overflowY;
          if ((overflow === "auto" || overflow === "scroll") && parent.scrollHeight > parent.clientHeight) {
            parent.scrollTop = parent.scrollHeight - parent.clientHeight;
            parent.dispatchEvent(new Event("scroll"));
            break;
          }
          parent = parent.parentElement;
        }
      });
      await page.waitForTimeout(220);
      if (options.screenshot) {
        const path = join(screenshotDir, `${slug}-${viewport.name}-${theme}-scrolled.png`);
        await page.screenshot({ path, fullPage: true });
        captures.push(path);
      }
    }
    runtime.forEach((message) => record(slug, "error", "runtime", message));
  } catch (error) {
    record(slug, "error", "navigation", error instanceof Error ? error.message : String(error), { url });
  } finally {
    await context.close();
  }
}

async function inspectShellRoute(browser, path, theme, viewport) {
  const { context, page } = await preparePage(browser, viewport, theme);
  const key = path.replaceAll(/[^a-z0-9]+/g, "-");
  const runtime = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtime.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => runtime.push(`pageerror: ${error.message}`));
  try {
    const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 60_000 });
    if (!response?.ok()) record(key, "error", "http", `HTTP ${response?.status() ?? "none"}`);
    const state = await page.evaluate(() => ({
      mainCount: document.querySelectorAll("main").length,
      h1Count: document.querySelectorAll("h1").length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      theme: document.documentElement.dataset.theme,
      brokenImages: [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    }));
    if (state.mainCount !== 1 || state.h1Count !== 1) record(key, "error", "semantics", JSON.stringify(state));
    if (state.overflow > 1) record(key, "error", "horizontal-overflow", `${state.overflow}px overflow.`);
    if (state.theme !== theme) record(key, "warning", "theme", `Expected ${theme}, found ${state.theme}.`);
    if (state.brokenImages.length) record(key, "error", "broken-image", state.brokenImages.join(", "));
    if (path.startsWith("/concepts/compare")) {
      const frames = page.frames().filter((frame) => frame.url().includes("compare=1"));
      if (frames.length !== 2) {
        record(key, "error", "compare-frames", `Expected two concept frames, found ${frames.length}.`);
      } else {
        const setScroll = (frame, top) => frame.evaluate((nextTop) => {
          const root = document.querySelector("[data-concept]");
          let current = root?.parentElement ?? null;
          while (current && current !== document.body) {
            const overflow = getComputedStyle(current).overflowY;
            if ((overflow === "auto" || overflow === "scroll") && current.scrollHeight > current.clientHeight) {
              current.scrollTop = nextTop;
              current.dispatchEvent(new Event("scroll"));
              return current.scrollTop;
            }
            current = current.parentElement;
          }
          window.scrollTo({ top: nextTop });
          window.dispatchEvent(new Event("scroll"));
          return window.scrollY;
        }, top);
        const leftTop = await setScroll(frames[0], 240);
        await page.waitForTimeout(180);
        const rightTop = await frames[1].evaluate(() => {
          const root = document.querySelector("[data-concept]");
          let current = root?.parentElement ?? null;
          while (current && current !== document.body) {
            const overflow = getComputedStyle(current).overflowY;
            if ((overflow === "auto" || overflow === "scroll") && current.scrollHeight > current.clientHeight) {
              return current.scrollTop;
            }
            current = current.parentElement;
          }
          return window.scrollY;
        });
        if (leftTop < 1 || Math.abs(rightTop - leftTop) > 2) {
          record(key, "error", "compare-scroll-sync", `Expected ${leftTop}px, found ${rightTop}px.`);
        }
      }
    }
    runtime.forEach((message) => record(key, "error", "runtime", message));
  } catch (error) {
    record(key, "error", "navigation", error instanceof Error ? error.message : String(error));
  } finally {
    await context.close();
  }
}

async function inspectClientCleanup(browser) {
  const { context, page } = await preparePage(
    browser,
    { name: "desktop", width: 1440, height: 1000 },
    "dark",
  );
  try {
    await page.goto(`${base}/concepts/${allSlugs[0]}`, { waitUntil: "networkidle" });
    await page.locator('[data-concept-motion="lenis-gsap"]').waitFor({ timeout: 10_000 });
    await page.locator('a[href="/concepts"]').first().click();
    await page.waitForURL(`${base}/concepts`, { timeout: 20_000 });
    await page.waitForTimeout(250);
    const leftovers = await page.evaluate(() => ({
      conceptStyles: document.querySelectorAll("style[data-sigil-concept-tokens]").length,
      conceptRoots: document.querySelectorAll("[data-concept]").length,
      lenisRoots: document.querySelectorAll(".lenis").length,
    }));
    if (leftovers.conceptStyles || leftovers.conceptRoots || leftovers.lenisRoots) {
      record("client-cleanup", "error", "lifecycle-leak", JSON.stringify(leftovers));
    }
  } catch (error) {
    record("client-cleanup", "error", "navigation", error instanceof Error ? error.message : String(error));
  } finally {
    await context.close();
  }
}

await mkdir(screenshotDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const slug of slugs) {
  for (const viewport of viewports) {
    for (const theme of themes) {
      await inspectRoute(browser, slug, viewport, theme, {
        screenshot: true,
        exercise: viewport.name === "desktop" && theme === "dark",
      });
    }
  }
  if (!quick) {
    await inspectRoute(browser, slug, { name: "tablet", width: 834, height: 1112 }, "dark", { screenshot: true });
    await inspectRoute(browser, slug, { name: "desktop", width: 1440, height: 1000 }, "dark", { reducedMotion: true });
  }
}
for (const theme of themes) {
  await inspectShellRoute(browser, "/concepts", theme, { name: "desktop", width: 1440, height: 1000 });
  await inspectShellRoute(browser, `/concepts/compare?a=${slugs[0]}&b=${slugs[1]}`, theme, { name: "desktop", width: 1440, height: 1000 });
}
await inspectClientCleanup(browser);
await browser.close();

const report = {
  createdAt: new Date().toISOString(),
  base,
  concepts: allSlugs.length,
  captures: captures.length,
  errors: findings.filter((finding) => finding.severity === "error").length,
  warnings: findings.filter((finding) => finding.severity === "warning").length,
  findings,
};
await writeFile(join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
const markdown = [
  "# Redesign concept audit",
  "",
  `- Concepts: ${report.concepts}`,
  `- Captures: ${report.captures}`,
  `- Errors: ${report.errors}`,
  `- Warnings: ${report.warnings}`,
  "",
  ...(findings.length
    ? findings.map((finding) => `- **${finding.severity}** \`${finding.slug}\` / \`${finding.code}\`: ${finding.message}`)
    : ["No findings."]),
  "",
].join("\n");
await writeFile(join(outputDir, "report.md"), markdown);
process.stdout.write(`${markdown}\nReport: ${outputDir}\n`);
if (report.errors) process.exitCode = 1;
