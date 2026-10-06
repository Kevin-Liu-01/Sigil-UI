import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.SIGIL_TEST_URL ?? "http://localhost:4033";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));

async function inspectHero() {
  return page.locator(".hero-logo-field__grid").evaluate((grid) => {
    const rect = (node) => {
      const r = node.getBoundingClientRect();
      return { x: r.x, right: r.right, width: r.width, height: r.height };
    };
    const cells = [...grid.querySelectorAll(":scope > [data-demo-cell]")].map((node) => ({
      name: node.dataset.demoCell, cell: rect(node), content: rect(node.firstElementChild),
    }));
    const activity = grid.querySelector('[data-slot="commit-grid"]');
    const squares = [...activity.querySelectorAll('[title]')].map(rect);
    const chart = grid.querySelector('[data-demo-cell="SparkLine"] [data-slot="spark-line"]');
    const calendar = grid.querySelector('.sigil-hero-calendar-weeks');
    return {
      grid: rect(grid), cells, squares, activity: rect(activity), activityCard: rect(grid.querySelector('[data-demo-cell="CommitGrid"]')), chart: rect(chart),
      typeFits: (() => { const el = grid.querySelector('.sigil-hero-type-preview'); return el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1; })(),
      labelsReadable: [...grid.querySelectorAll('.sigil-hero-cell-label, .sigil-hero-action-grid button')].every(node => parseFloat(getComputedStyle(node).fontSize) >= 12),
      revenueChart: rect(grid.querySelector('.sigil-hero-revenue-chart')),
      chartCard: rect(grid.querySelector('[data-demo-cell="SparkLine"]')),
      calendar: rect(calendar), weeks: [...calendar.children].map(rect),
      pageOverflow: document.documentElement.scrollWidth > innerWidth,
      buttonsFit: [...grid.querySelectorAll('.sigil-hero-action-grid button')].every((button) => button.scrollWidth <= button.clientWidth + 1),
      logos: [...grid.querySelectorAll('[data-brand-logo]')].map((node) => ({
        ...rect(node), mask: getComputedStyle(node).maskImage,
      })),
    };
  });
}

try {
  for (const brand of ["github", "react", "nextdotjs", "typescript", "tailwindcss", "npm", "vercel", "x", "linkedin"]) {
    const response = await page.request.get(`${base}/brands/${brand}.svg`);
    assert.equal(response.status(), 200, `${brand} asset`);
    assert.match(response.headers()["content-type"], /image\/svg\+xml/);
    assert.match(await response.text(), /<svg[\s>]/);
  }
  console.log("PASS all nine local brand assets");

  for (const theme of ["light", "dark"]) {
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate((value) => localStorage.setItem("sigil-theme", value), theme);
    await page.reload({ waitUntil: "networkidle" });
    await page.locator('.hero-logo-field__grid').waitFor();
    assert.ok(await page.locator('[data-sigil-icon]').count() > 60, "shared filled icons render throughout the product");
    assert.equal(await page.locator('[data-sigil-icon]:not([aria-hidden="true"])').count(), 0, "decorative icons do not duplicate accessible names");
    for (const width of [1440, 1280, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const result = await inspectHero();
      const label = `${theme} at ${width}px`;
      assert.ok(result.typeFits, `${label}: the entire typography preview is readable without clipping`);
      assert.ok(result.labelsReadable, `${label}: labels use readable type`);
      assert.ok(result.revenueChart.height >= 32, `${label}: revenue chart fills the KPI`);
      assert.ok(result.buttonsFit, `${label}: action labels and icons fit their buttons`);
      assert.equal(result.pageOverflow, false, `${label}: no horizontal overflow`);
      for (const { name, cell, content } of result.cells) {
        assert.ok(Math.abs(cell.height - content.height) < 2, `${label}: ${name} fills its cell height`);
        assert.ok(content.width <= cell.width + 1, `${label}: ${name} fits its cell width`);
        assert.ok(cell.x >= result.grid.x - 1 && cell.right <= result.grid.right + 1, `${label}: ${name} stays in the hero`);
      }
      assert.ok(result.activity.height >= result.activityCard.height * .55, `${label}: activity fills the card vertically`);
      for (const square of result.squares) assert.ok(Math.abs(square.height - square.width) < 1 && square.width > 0, `${label}: activity cells stay square`);
      assert.ok(Math.max(...result.squares.map((r) => r.right)) >= result.activity.right - 2, `${label}: activity fills available width`);
      assert.ok(result.chart.height > result.chartCard.height * 0.5, `${label}: chart uses the card height`);
      assert.ok(Math.abs(result.weeks.reduce((sum, r) => sum + r.height, 0) - result.calendar.height) < 2, `${label}: calendar rows fill the month`);
      assert.equal(result.logos.length, 4);
      for (const logo of result.logos) assert.ok(logo.width > 0 && logo.height > 0 && logo.mask.includes("/brands/"), `${label}: stack logo renders`);
    }
    console.log(`PASS ${theme} hero geometry at six viewport widths`);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("switch", { name: "Switch to light mode", exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), "light", "theme switch updates the page");
  assert.equal(await page.locator('.sigil-theme-glyph[data-visible="true"]').count(), 1, "one theme glyph is visible");
  const day = page.locator('[data-demo-cell="DatePicker"] [data-slot="calendar-day"]').nth(10);
  await day.click();
  assert.equal(await day.getAttribute("data-selected-single"), "true", "calendar selection works");
  const toggle = page.locator('[data-demo-cell="Switches"]').getByRole("switch").first();
  const before = await toggle.getAttribute("aria-checked");
  await toggle.click();
  assert.notEqual(await toggle.getAttribute("aria-checked"), before, "demo switches work");
  const slider = page.locator('[data-demo-cell="Sliders"]').getByRole("slider").first();
  const previous = Number(await slider.getAttribute("aria-valuenow"));
  await slider.focus();
  await slider.press("ArrowRight");
  assert.equal(Number(await slider.getAttribute("aria-valuenow")), previous + 4, "slider keyboard interaction works");
  await page.getByRole("button", { name: "Bold", exact: true }).click();
  await page.locator('[data-demo-cell="PresetSwatches"]').getByRole("button", { name: "sigil", exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.sigilPresetName === "sigil");
  await page.locator('[aria-label="Site presets"]').getByRole("button", { name: "Default", exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.sigilPresetName === "default");
  console.log("PASS calendar, switch, slider, formatting, and hero preset controls");

  await page.goto(`${base}/docs/diagrams/commit-grid`, { waitUntil: "networkidle" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const layout = await page.locator('.sigil-preview [data-slot="commit-grid"]').evaluate((grid) => {
      const bounds = grid.getBoundingClientRect();
      const cells = [...grid.querySelectorAll('[title]')].map((cell) => cell.getBoundingClientRect());
      return { width: bounds.width, right: bounds.right, scroll: grid.scrollWidth,
        cellWidth: cells[0].width, cellHeight: cells[0].height, last: Math.max(...cells.map((cell) => cell.right)) };
    });
    assert.ok(Math.abs(layout.cellWidth - layout.cellHeight) < 1);
    assert.ok(layout.scroll <= layout.width + 2, "labeled activity grid fits its container");
    assert.ok(Math.abs(layout.last - layout.right) < 2, "labeled activity grid fills its container");
  }
  console.log("PASS responsive activity grid with day and month labels");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/docs`, { waitUntil: "networkidle" });
  assert.equal(await page.locator('.sigil-docs-catalog-nav a .sigil-icon').count(), 14, "every docs category has a shared icon");
  await page.getByRole("searchbox", { name: "Find a component" }).fill("calendar");
  assert.ok(await page.locator('#sigil-catalog-results a').count() > 0);
  assert.deepEqual(errors, [], "no runtime errors");
  console.log("PASS icon-enhanced docs navigation and search");
} finally {
  await browser.close();
}
