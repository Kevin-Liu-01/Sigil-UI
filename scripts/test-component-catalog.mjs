import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.SIGIL_TEST_URL ?? "http://localhost:4033";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", error => errors.push(String(error)));
const catalog = page.locator(".sigil-catalog");
const cards = catalog.locator("[data-component-name]");
const search = catalog.getByRole("searchbox", { name: "Find a component" });
const sidebar = page.getByRole("complementary", { name: "Component categories" });
const frameSize = () => page.locator(".sigil-page-content").first().evaluate(el => {
  const box = el.getBoundingClientRect();
  return { x: box.x, width: box.width };
});

async function visit(route) {
  assert.equal((await page.goto(`${base}${route}`, { waitUntil: "networkidle" })).status(), 200, route);
}

async function checkOverflow(width) {
  const overflow = await page.locator(".sigil-catalog, .sigil-catalog-main, .sigil-catalog-card, .sigil-catalog-hero, .sigil-component-system").evaluateAll(elements => elements
    .filter(el => el.scrollWidth > el.clientWidth + 2)
    .map(el => ({ name: el.getAttribute("data-component-name") || el.className, width: el.clientWidth, scroll: el.scrollWidth })));
  assert.deepEqual(overflow, [], `component layout fits at ${width}px`);
}

try {
  for (const width of [1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await visit("/");
    const home = await frameSize();
    assert.equal(await page.locator(".sigil-landing-section-label").count(), 0);
    for (const route of ["/components", "/presets", "/demos", "/blog"]) {
      await visit(route);
      assert.deepEqual(await frameSize(), home, `${route} shares Home's frame at ${width}px`);
    }
  }
  console.log("PASS shared product page widths at 1440px and 1920px; no Home eyebrow rows");

  await page.setViewportSize({ width: 1440, height: 1000 });
  await visit("/components");
  const visual = page.getByRole("group", { name: "Live component system" });
  const visualBox = await visual.boundingBox();
  assert.ok(visualBox.width > 500 && visualBox.height > 300, "hero contains a substantial visualization");
  await visual.getByRole("button", { name: "Deploy", exact: true }).click();
  assert.ok(await visual.getByRole("button", { name: "Deployed", exact: true }).isVisible());
  const toggle = visual.getByRole("switch", { name: "Notify me" });
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-checked"), "false");
  await visual.getByRole("textbox", { name: "Example project name" }).fill("Sigil workspace");
  assert.equal(await visual.getByRole("textbox", { name: "Example project name" }).inputValue(), "Sigil workspace");
  console.log("PASS hero visualization uses working button, input, and switch");

  await page.getByRole("link", { name: "Browse components", exact: true }).click();
  assert.ok(await sidebar.isVisible());
  assert.equal(await sidebar.locator('[data-slot="scroll-area"]').count(), 1);
  assert.equal(await sidebar.getByRole("button", { name: "Collapse sidebar", exact: true }).count(), 0);
  assert.equal(await cards.count(), 24);
  await catalog.getByRole("button", { name: "Show 24 more", exact: true }).click();
  assert.equal(await cards.count(), 48);
  await search.fill("StepperField");
  assert.equal(await cards.count(), 1);
  assert.equal(await cards.first().getAttribute("data-component-name"), "StepperField");
  const docs = await cards.getByRole("link", { name: "StepperField docs" }).getAttribute("href");
  assert.equal((await page.request.get(`${base}${docs}`)).status(), 200);
  await search.fill("does-not-exist");
  assert.equal(await cards.count(), 0);
  assert.ok(await catalog.getByRole("heading", { name: "No matching components" }).isVisible());
  await catalog.getByRole("button", { name: "Clear filters", exact: true }).first().click();
  await sidebar.getByRole("button", { name: /^Forms/ }).click();
  assert.equal(await sidebar.getByRole("button", { name: /^Forms/ }).getAttribute("aria-pressed"), "true");
  assert.equal(await catalog.locator(".sigil-catalog-group").count(), 1);
  assert.equal(await catalog.locator(".sigil-catalog-group").getAttribute("aria-label"), "Forms");
  console.log("PASS custom sidebar/scrollbar, pagination, filters, empty state, and documentation links");

  await catalog.getByRole("button", { name: "Clear filters", exact: true }).first().click();
  await search.fill("Sidebar");
  const example = catalog.getByRole("complementary", { name: "Example workspace navigation" });
  const borders = await example.evaluate(el => {
    const probe = document.createElement("span");
    probe.style.color = "var(--s-border)";
    el.append(probe);
    const token = getComputedStyle(probe).color;
    probe.remove();
    return { token, sidebar: getComputedStyle(el).borderRightColor, header: getComputedStyle(el.querySelector('[data-slot="sidebar-header"]')).borderBottomColor };
  });
  assert.equal(borders.sidebar, borders.token, "Sidebar retains its border color token");
  assert.equal(borders.header, borders.token, "SidebarHeader retains its border color token");
  await example.getByRole("button", { name: "Projects", exact: true }).click();
  assert.equal(await example.getByRole("button", { name: "Projects", exact: true }).getAttribute("aria-current"), "page");
  await example.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  assert.equal(await example.getAttribute("data-collapsed"), "true");
  await example.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  assert.equal(await example.getAttribute("data-collapsed"), null);
  await search.fill("Pagination");
  const pagination = catalog.locator('[data-component-name="Pagination"]');
  await pagination.getByRole("button", { name: "Next page", exact: true }).click();
  assert.equal(await pagination.locator('[aria-current="page"]').textContent(), "4");
  await search.fill("Divider");
  for (const divider of await catalog.locator('[data-component-name="Divider"] [data-slot="divider"]').all()) assert.ok(await divider.isVisible(), "page dividers do not hide the Divider component preview");
  console.log("PASS real Sidebar preview, selection, collapse, and border tokens");

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await catalog.getByRole("button", { name: "Clear filters", exact: true }).first().click();
    await page.locator("#component-browser").evaluate(el => el.scrollIntoView({ block: "start" }));
    const headerBottom = await page.locator(".sigil-page-content > header").evaluate(el => el.getBoundingClientRect().bottom);
    assert.ok((await catalog.locator("label").first().boundingBox()).y >= headerBottom, "search label clears sticky navigation");
    await checkOverflow(width);
    if (width < 1024) {
      assert.equal(await sidebar.isVisible(), false);
      const category = catalog.getByRole("combobox", { name: "Category" });
      await category.click();
      await page.getByRole("option", { name: /^Forms/ }).click();
    } else {
      await sidebar.getByRole("button", { name: /^Forms/ }).click();
    }
    assert.equal(await catalog.locator(".sigil-catalog-group").getAttribute("aria-label"), "Forms");
    await checkOverflow(width);
  }
  console.log("PASS responsive category controls and preview layouts at five widths");
  assert.deepEqual(errors, []);
  console.log("PASS no browser errors");
} finally {
  await browser.close();
}
