import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.SIGIL_TEST_URL ?? "http://localhost:4033";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await context.addInitScript(() => {
  window.__copies = [];
  window.__denyCopy = false;
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
    writeText: async (text) => {
      if (window.__denyCopy) throw new DOMException("Denied", "NotAllowedError");
      window.__copies.push(text);
    },
  } });
});

async function visit(route) {
  const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
}
async function preview(route) {
  await visit(`/docs/components/${route}`);
  await page.locator(".sigil-preview button").first().waitFor();
  return page.locator(".sigil-preview");
}
async function expectValue(locator, expected) {
  await locator.evaluate((element) => element.blur());
  assert.equal(await locator.inputValue(), expected);
}

try {
  await visit("/");
  const install = page.getByRole("button", { name: "Copy npx create-sigil-app@latest", exact: true }).first();
  await page.evaluate(() => { window.__denyCopy = true; });
  await install.click();
  await page.getByText("Copy unavailable. Select the command to copy it manually.").first().waitFor();
  await page.evaluate(() => { window.__denyCopy = false; });
  await install.click();
  await page.getByText("Command copied.").first().waitFor();
  assert.equal(await page.evaluate(() => window.__copies.at(-1)), "npx create-sigil-app@latest");
  console.log("PASS landing copy failure and retry");

  const presetRegion = page.getByRole("group", { name: "Preview preset" });
  const demo = page.locator("[data-landing-preset-preview]");
  await demo.scrollIntoViewIfNeeded();
  const firstColor = await demo.evaluate((el) => getComputedStyle(el).getPropertyValue("--s-primary"));
  await presetRegion.getByRole("button", { name: "Forge", exact: true }).click();
  assert.equal(await presetRegion.getByRole("button", { name: "Forge", exact: true }).getAttribute("aria-pressed"), "true");
  assert.notEqual(await demo.evaluate((el) => getComputedStyle(el).getPropertyValue("--s-primary")), firstColor);
  await demo.getByRole("button", { name: "Save workspace" }).click();
  await demo.getByText("Saved for this preview.").waitFor();
  console.log("PASS real preset tokens and interactive preview");

  const links = await page.locator('a[href^="/"]').evaluateAll((elements) => [...new Set(elements.map((el) => el.getAttribute("href").split("#")[0]))]);
  for (const href of links) assert.equal((await context.request.get(`${base}${href}`)).status(), 200, href);
  assert.equal(await page.locator('a[href="#"]').count(), 0, "no dead landing links");
  console.log(`PASS ${links.length} landing destinations`);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("button", { name: "Open navigation", exact: true }).getAttribute("aria-expanded"), "false");
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Open navigation");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "landing fits mobile width");
  console.log("PASS mobile menu dismissal and focus restoration");
  await page.setViewportSize({ width: 1440, height: 1000 });

  await visit("/docs");
  const search = page.getByRole("searchbox", { name: "Find a component" });
  assert.ok((await search.boundingBox()).y < 700, "component lookup is immediately visible");
  await page.getByRole("tab", { name: "Live examples" }).click();
  await page.getByRole("heading", { name: "Deployment control", exact: true }).waitFor();
  await page.getByRole("tab", { name: "Component index" }).click();
  await search.fill("stepperfield");
  await page.locator("#sigil-catalog-results").getByRole("heading", { name: "StepperField", exact: true }).waitFor();
  assert.equal(await page.locator("#sigil-catalog-results a").count(), 1);
  await search.fill("zzzz-no-component");
  await page.getByText("No components match your search.", { exact: false }).waitFor();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  assert.ok(await page.locator("#sigil-catalog-results a").count() > 300);
  const names = await page.locator("#sigil-catalog-results h4").allTextContents();
  assert.equal(new Set(names).size, names.length, "no duplicate component listings");
  console.log("PASS catalog search, empty state, and reset");

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileDocs = await page.locator("#nd-page").boundingBox();
  assert.ok(mobileDocs.x < 24 && mobileDocs.width > 350, "mobile docs use the full screen");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "docs fit mobile width");
  assert.ok((await search.boundingBox()).y < 844, "mobile component lookup is visible");
  for (const route of ["/docs/installation", "/docs/components/stepper-field"]) {
    await visit(route);
    const body = await page.locator("#nd-page").boundingBox();
    assert.ok(body.x < 24 && body.width > 350, `${route} fits mobile`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} has no horizontal overflow`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await visit("/docs");
  console.log("PASS mobile docs layout and visible component lookup");

  const response = await context.request.get(`${base}/api/search?query=button`);
  assert.equal(response.status(), 200);
  assert.ok((await response.json()).length > 0, "full-text search results");
  await page.keyboard.press("Control+k");
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.getByRole("dialog").count(), 1, "one search dialog");
  await page.keyboard.press("Escape");
  console.log("PASS docs search endpoint and shortcut ownership");

  const stepper = await preview("stepper-field");
  const quantity = stepper.getByRole("spinbutton", { name: "Quantity", exact: true });
  await stepper.getByRole("button", { name: "Increase", exact: true }).nth(0).click();
  await expectValue(quantity, "4");
  await quantity.fill("10");
  assert.ok(await stepper.getByRole("button", { name: "Increase", exact: true }).nth(0).isDisabled());
  await stepper.getByRole("button", { name: "Decrease", exact: true }).nth(0).click();
  await expectValue(quantity, "9");
  await stepper.getByRole("button", { name: "Increase", exact: true }).nth(1).click();
  await expectValue(stepper.getByRole("spinbutton", { name: "Controlled quantity", exact: true }), "3.5");
  await stepper.getByText("Selected quantity: 3.5").waitFor();
  assert.ok(await stepper.getByRole("button", { name: "Increase", exact: true }).nth(2).isDisabled());
  console.log("PASS quantity stepping, controlled events, bounds, disabled state");

  const input = await preview("copy-input");
  await input.getByRole("textbox", { name: "Install command", exact: true }).fill("npm install @sigil-ui/tokens");
  await input.getByRole("button", { name: "Copy", exact: true }).click();
  await input.getByText("Last copied: npm install @sigil-ui/tokens").waitFor();
  assert.equal(await page.evaluate(() => window.__copies.at(-1)), "npm install @sigil-ui/tokens");
  await page.evaluate(() => { window.__denyCopy = true; });
  await input.getByRole("textbox", { name: "Install command", exact: true }).fill("must not report success");
  await input.getByRole("button", { name: "Copy", exact: true }).click();
  await input.getByRole("button", { name: "Copy failed — retry" }).waitFor();
  assert.ok((await input.innerText()).includes("Last copied: npm install @sigil-ui/tokens"));
  console.log("PASS edited input copy and failure callback semantics");

  await page.evaluate(() => { window.__denyCopy = false; });
  await page.getByRole("button", { name: "Copy page", exact: true }).click();
  await page.getByRole("button", { name: "Markdown copied", exact: true }).waitFor();
  const markdown = await page.evaluate(() => window.__copies.at(-1));
  assert.ok(markdown.includes("```tsx") && markdown.includes("## Usage"), "Markdown retains code blocks");
  console.log("PASS Markdown page copying");

  const installSection = await preview("install-section");
  for (const [label, expected] of [["pnpm", "pnpm add @sigil-ui/components"], ["yarn", "yarn add @sigil-ui/components"], ["npm", "npm install @sigil-ui/components"]]) {
    await installSection.getByRole("button", { name: `Copy ${label} command`, exact: true }).click();
    assert.equal(await page.evaluate(() => window.__copies.at(-1)), expected);
  }
  console.log("PASS each install command copies its own value");

  for (const route of ["/docs/installation", "/docs/design-md", "/presets", "/components", "/demos", "/sandbox", "/walkthrough"]) await visit(route);
  for (const route of ["/api/og", "/api/og-home"]) {
    const image = await context.request.get(`${base}${route}`);
    assert.equal(image.status(), 200);
    assert.match(image.headers()["content-type"], /^image\//);
  }
  const robots = await (await context.request.get(`${base}/robots.txt`)).text();
  assert.match(robots, /User-Agent: Twitterbot/i);
  assert.deepEqual(errors, [], "no uncaught browser errors");
  console.log("PASS core routes, social images, crawler rules, and runtime errors");
} finally {
  await browser.close();
}
