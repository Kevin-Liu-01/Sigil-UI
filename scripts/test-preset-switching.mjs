import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { presetCatalog } from "../packages/presets/dist/catalog.js";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
if (process.argv.includes("--fallback")) await page.addInitScript(() => { CSSStyleSheet.prototype.replaceSync = undefined; });
const errors = [];
page.on("pageerror", error => errors.push(String(error)));
const samples = [];
const all = process.argv.includes("--all");
const labels = all ? presetCatalog.map(preset => preset.label) : ["Sigil", "Crux", "Alloy", "Clay", "Rose", "Default"];
const names = new Map([["Default", "default"], ...presetCatalog.map(preset => [preset.label, preset.name])]);

async function switchPreset(label, phase) {
  await page.evaluate(label => {
    delete document.documentElement.dataset.sigilPresetPaintMs;
    document.querySelector(`[aria-label="Site presets"] button[aria-label="${label}"]`).click();
  }, label);
  await page.waitForFunction(name => document.documentElement.dataset.sigilPresetName === name &&
    document.documentElement.dataset.sigilPresetPaintMs && !document.documentElement.hasAttribute("data-sigil-preset-switching"), names.get(label));
  await page.waitForFunction(label => document.querySelector(`[aria-label="Site presets"] button[aria-label="${label}"]`).getAttribute("aria-pressed") === "true", label);
  samples.push(await page.evaluate(({ label, phase }) => ({ label, phase,
    applyMs: Number(document.documentElement.dataset.sigilPresetApplyMs),
    paintMs: Number(document.documentElement.dataset.sigilPresetPaintMs),
  }), { label, phase }));
  assert.equal(await page.locator("html").getAttribute("data-sigil-token-status"), "ok");
  const actual = await page.evaluate(() => {
    const style = document.querySelector('style[data-sigil-tokens]');
    const theme = document.documentElement.dataset.theme === "light" ? 0 : 1;
    const cssValue = style.sheet.cssRules[theme].style.getPropertyValue("--s-primary").trim();
    const rootValue = getComputedStyle(document.documentElement).getPropertyValue("--s-primary").trim();
    return { cssValue, rootValue };
  });
  assert.equal(actual.rootValue, actual.cssValue, `${label} stylesheet and applied tokens agree`);
  if (all) {
    const overflow = await page.locator(".hero-logo-field__grid").evaluate(grid =>
      [...grid.querySelectorAll(":scope > [data-demo-cell]")].filter(cell => cell.scrollWidth > cell.clientWidth + 2).map(cell => cell.dataset.demoCell));
    assert.deepEqual(overflow, [], `${label} hero cells fit at this width`);
  }
}

try {
  await page.goto(process.env.SIGIL_TEST_URL ?? "http://localhost:4033", { waitUntil: "networkidle" });
  for (const phase of ["cold", "warm", "warm"]) for (const label of labels) await switchPreset(label, phase);
  if (all) {
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.getByRole("switch", { name: "Switch to light mode", exact: true }).click();
    for (const label of labels) await switchPreset(label, "mobile-light");
    console.log("PASS every preset fits the hero on desktop dark and mobile light");
  }
  // Synchronous clicks bypass hover preloading: only the last request may win.
  await page.evaluate(() => {
    for (const label of ["Noir", "Ocean", "Default", "Rose", "Default"]) {
      document.querySelector(`[aria-label="Site presets"] button[aria-label="${label}"]`).click();
    }
  });
  await page.waitForFunction(() => document.documentElement.dataset.sigilPresetName === "default" && !document.documentElement.hasAttribute("data-sigil-preset-switching"));
  await page.waitForTimeout(700);
  assert.equal(await page.locator('[aria-label="Site presets"] [aria-pressed="true"]').getAttribute("aria-label"), "Default");
  assert.equal(await page.locator("html").getAttribute("data-sigil-preset-name"), "default");
  assert.equal(await page.locator("body").evaluate(body => body.style.fontFamily), "", "CSS owns the font; no stale font promise can overwrite the selection");
  assert.match(await page.locator("body").evaluate(body => getComputedStyle(body).fontFamily), /Inter/);
  assert.deepEqual(errors, []);
  const median = values => {
    values.sort((a, b) => a - b);
    return (values[Math.floor(values.length / 2)] + values[Math.floor((values.length - 1) / 2)]) / 2;
  };
  const summary = Object.fromEntries(["cold", "warm"].map(phase => [phase, {
    applyMs: median(samples.filter(s => s.phase === phase).map(s => s.applyMs)),
    paintMs: median(samples.filter(s => s.phase === phase).map(s => s.paintMs)),
  }]));
  const output = process.env.SIGIL_PERF_OUTPUT;
  if (output) await writeFile(output, JSON.stringify({ summary, samples, errors }, null, 2));
  console.log(JSON.stringify({ summary, presets: labels.length, latestSelectionWins: true, errors }, null, 2));
} finally {
  await browser.close();
}
