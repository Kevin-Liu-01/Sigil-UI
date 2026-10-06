import assert from "node:assert/strict";
import { chromium } from "playwright";
import { presetCatalog } from "../packages/presets/dist/catalog.js";
import { rosePreset } from "../packages/presets/dist/rose.js";

const base = process.env.SIGIL_TEST_URL ?? "http://localhost:4033";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
await page.addInitScript(() => {
  Object.defineProperty(navigator, "clipboard", { value: { writeText: async text => { window.__studioExport = text; } } });
});
const errors = [];
page.on("pageerror", error => errors.push(String(error)));
const toolbar = page.getByRole("region", { name: "Design toolbar" });
const studio = toolbar.getByRole("button", { name: "Studio", exact: true });
const canvas = toolbar.getByRole("button", { name: "Canvas", exact: true });
const presets = toolbar.getByRole("group", { name: "Site presets" });
const sidebar = page.locator("#sigil-studio-sidebar");

async function selectPreset(name) {
  const button = presets.getByRole("button", { name, exact: true });
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await page.waitForFunction(({ name }) => {
    const buttons = document.querySelectorAll('[aria-label="Site presets"] button');
    return [...buttons].some(button => button.getAttribute("aria-label") === name && button.getAttribute("aria-pressed") === "true");
  }, { name });
}

try {
  const response = await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.deepEqual(await presets.getByRole("button").evaluateAll(buttons => buttons.map(button => button.getAttribute("aria-label"))), ["Default", ...presetCatalog.map(preset => preset.label)]);
  assert.equal(await page.getByRole("button", { name: "Studio", exact: true }).count(), 1, "one Studio trigger, no edge tab");
  const canvasBefore = await canvas.getAttribute("aria-pressed");
  await studio.click();
  assert.equal(await studio.getAttribute("aria-expanded"), "true");
  assert.equal(await sidebar.getAttribute("aria-hidden"), "false");
  assert.equal(await canvas.getAttribute("aria-pressed"), canvasBefore, "Studio leaves canvas mode unchanged");
  assert.ok(await presets.isVisible());
  await sidebar.getByTitle("Save preset", { exact: true }).click();
  await sidebar.getByPlaceholder("Preset name").fill("unfinished-theme");
  await studio.click();
  await studio.click();
  assert.equal(await sidebar.getByPlaceholder("Preset name").inputValue(), "unfinished-theme", "suspending Studio preserves unsaved input");
  await sidebar.getByRole("button", { name: "Cancel", exact: true }).click();
  await selectPreset("Rose");
  assert.equal(await sidebar.getAttribute("aria-hidden"), "false", "changing presets leaves the sidebar open");
  await sidebar.getByTitle("Export CSS", { exact: true }).click();
  const exportedPrimary = await page.evaluate(() => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(window.__studioExport);
    return sheet.cssRules[1].style.getPropertyValue("--s-primary").trim();
  });
  assert.equal(exportedPrimary, rosePreset.tokens.colors.primary.dark, "export contains the active CSSOM palette, not the initial stylesheet");
  console.log("PASS Studio preserves drafts while hidden and exports the selected preset");
  await page.keyboard.press("Escape");
  assert.equal(await studio.getAttribute("aria-expanded"), "false");
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Studio");
  await selectPreset("Default");
  console.log("PASS all 45 presets stay available; Studio only toggles the sidebar; Escape restores focus");

  const demo = page.locator(".sigil-design-demo");
  await demo.scrollIntoViewIfNeeded();
  const result = page.locator("[data-design-spec-preview]");
  const before = await result.evaluate(el => getComputedStyle(el).getPropertyValue("--s-primary"));
  await demo.getByRole("button", { name: "Green", exact: true }).click();
  assert.notEqual(await result.evaluate(el => getComputedStyle(el).getPropertyValue("--s-primary")), before);
  await demo.getByRole("button", { name: "Rounded", exact: true }).click();
  assert.equal(await result.locator('[data-slot="card"]').evaluate(el => getComputedStyle(el).borderRadius), "8px");
  await demo.getByRole("button", { name: "Relaxed", exact: true }).click();
  assert.equal(await result.locator('[data-slot="card-content"]').evaluate(el => getComputedStyle(el).paddingLeft), "24px");
  await demo.getByRole("button", { name: "Create workspace", exact: true }).click();
  await demo.getByText("Created for this preview. No account needed.").waitFor();
  console.log("PASS scoped token demo updates color, corner radius, spacing, and form status");

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(400);
    assert.ok(await presets.isVisible(), `presets visible at ${width}px`);
    const box = await toolbar.boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= width + 1, `toolbar fits at ${width}px`);
    for (const id of ["components", "tokens", "presets", "demos", "quick-start"]) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      const metrics = await section.evaluate(el => {
        const header = el.querySelector(".sigil-landing-section-intro").getBoundingClientRect();
        const section = el.getBoundingClientRect();
        return { left: header.left - section.left, right: section.right - header.right, scroll: el.scrollWidth, width: el.clientWidth };
      });
      assert.ok(Math.abs(metrics.left) <= 1 && Math.abs(metrics.right) <= 1, `${id} borders join outer rails at ${width}px`);
      assert.ok(metrics.scroll <= metrics.width + 1, `${id} has no horizontal overflow at ${width}px`);
    }
    await studio.click();
    assert.equal(await sidebar.getAttribute("aria-hidden"), "false");
    await selectPreset("Clay");
    assert.ok(await presets.isVisible());
    await studio.click();
    await selectPreset("Default");
  }
  console.log("PASS joined section borders, responsive content, and live sidebar/preset controls at five widths");

  await page.setViewportSize({ width: 1440, height: 1000 });
  await canvas.click();
  await page.waitForFunction(() => document.body.dataset.devbarToolbarDock === "bottom");
  assert.ok(await presets.isVisible(), "presets stay visible outside canvas mode");
  await studio.click();
  assert.equal(await sidebar.getAttribute("aria-hidden"), "false");
  assert.equal(await canvas.getAttribute("aria-pressed"), "false");
  await studio.click();
  await canvas.click();
  assert.ok(await presets.isVisible(), "presets stay visible on canvas entry");
  assert.deepEqual(errors, []);
  console.log("PASS normal/canvas mode transitions; no browser errors");
} finally {
  await browser.close();
}
