#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.SIGIL_TEST_URL ?? 'http://localhost:4033';
const routes = process.argv.find((arg) => arg.startsWith('--route='))?.slice(8).split(',');
const output = 'output/product-polish/docs-complete-audit';
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const theme of ['dark', 'light']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await context.addInitScript((theme) => localStorage.setItem('sigil-theme', theme), theme);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  const preview = () => page.locator('.sigil-preview').first();
  async function check(slug, run) {
    if (routes && !routes.includes(slug)) return;
    errors.length = 0;
    try {
      const response = await page.goto(`${base}/docs/${slug === "toaster" ? "overlays" : "components"}/${slug}`);
      assert.equal(response.status(), 200);
      await preview().waitFor();
      await page.waitForFunction(() => document.querySelector('.sigil-preview')?.querySelector('*:not([aria-hidden="true"])'));
      await run();
      assert.deepEqual(errors, [], 'No runtime or accessibility errors');
      results.push({ slug, theme, passed: true });
      console.log(`PASS ${slug} ${theme}`);
    } catch (error) {
      results.push({ slug, theme, passed: false, error: String(error) });
      console.log(`FAIL ${slug} ${theme}: ${error}`);
      await page.screenshot({ path: `${output}/failure-${slug}-${theme}.png` });
    }
  }
  await check('accordion', async () => {
    const trigger = preview().getByRole('button');
    await trigger.click(); assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
    await trigger.click(); assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  });
  for (const [slug, role, label] of [['checkbox', 'checkbox', 'Send weekly digest'], ['switch', 'switch', 'Push notifications']]) {
    await check(slug, async () => {
      const control = preview().getByRole(role, { name: label });
      await control.click(); assert.equal(await control.getAttribute('aria-checked'), 'true');
      await control.press('Space'); assert.equal(await control.getAttribute('aria-checked'), 'false');
      assert.equal(await preview().getByRole(role).last().isDisabled(), true);
    });
  }
  await check('radio-group', async () => {
    const option = preview().getByRole('radio', { name: 'Preview', exact: true });
    await option.click(); assert.equal(await option.getAttribute('aria-checked'), 'true');
    await option.focus();
    await option.press('ArrowLeft', { delay: 50 }); await page.waitForFunction(() => document.querySelector('.sigil-preview [aria-label=Stable]')?.getAttribute('aria-checked') === 'true'); assert.equal(await preview().getByRole('radio', { name: 'Stable' }).getAttribute('aria-checked'), 'true');
  });
  await check('slider', async () => {
    const slider = preview().getByRole('slider');
    const before = Number(await slider.getAttribute('aria-valuenow'));
    await slider.focus(); await slider.press('ArrowRight');
    assert.ok(Number(await slider.getAttribute('aria-valuenow')) > before);
  });
  await check('input-otp', async () => {
    const inputs = preview().locator('input:not([aria-hidden=true])');
    assert.equal(await inputs.count(), 6);
    await inputs.first().focus(); await page.keyboard.type('372819');
    assert.equal((await inputs.evaluateAll((els) => els.map((el) => el.value))).join(''), '372819');
  });
  await check('number-field', async () => {
    await preview().getByRole('button', { name: 'Increase', exact: true }).click();
    assert.match(await preview().innerText(), /43/);
    await preview().getByRole('button', { name: 'Decrease', exact: true }).click();
    assert.match(await preview().innerText(), /42/);
  });
  await check('combobox', async () => {
    await preview().getByRole('combobox').click();
    const search = preview().getByPlaceholder('Search…');
    await search.fill('Astro'); await search.press('ArrowDown'); await search.press('Enter');
    assert.match(await preview().getByRole('combobox').innerText(), /Astro/);
  });
  await check('select', async () => {
    await preview().getByRole('combobox').click();
    await page.getByRole('option', { name: 'Option B' }).click();
    assert.match(await preview().innerText(), /Option B/);
  });
  await check('segmented-control', async () => {
    const week = preview().getByRole('radio', { name: 'Week' });
    await week.focus(); await week.press('ArrowRight');
    assert.match(await preview().getByRole('status').innerText(), /month/);
    await preview().getByRole('radio', { name: 'Month' }).press('Home');
    assert.match(await preview().getByRole('status').innerText(), /day/);
  });
  await check('split-button', async () => {
    await preview().getByRole('button', { name: 'Save project' }).click();
    assert.match(await preview().getByRole('status').innerText(), /Project saved/);
    await preview().getByRole('button', { name: 'Save a copy', exact: true }).click();
    assert.match(await preview().getByRole('status').innerText(), /Save a copy selected/);
  });
  await check('tabs', async () => {
    await preview().getByRole('tab', { name: 'Usage', exact: true }).click();
    assert.match(await preview().getByRole('tabpanel').innerText(), /Usage/);
  });
  for (const [slug, trigger] of [['dialog', 'Open dialog'], ['alert-dialog', 'Delete'], ['drawer', 'Open drawer'], ['sheet', 'Open sheet']]) {
    await check(slug, async () => {
      const button = preview().getByRole('button', { name: trigger, exact: true });
      await button.click();
      const dialog = page.getByRole(slug === 'alert-dialog' ? 'alertdialog' : 'dialog');
      await dialog.waitFor();
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => document.activeElement?.closest('.sigil-preview'));
      assert.ok(await button.evaluate((el) => el === document.activeElement));
    });
  }
  for (const slug of ['command-menu', 'spotlight']) {
    await check(slug, async () => {
      await preview().getByRole('button').click();
      const input = page.getByRole('dialog').getByRole('combobox');
      await input.fill('Invite'); await input.press('ArrowDown'); await input.press('Enter');
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      assert.match(await preview().getByRole('status').innerText(), /Invite a teammate selected/);
    });
  }
  await check('dropdown-menu', async () => {
    await preview().getByRole('button', { name: 'Options' }).click();
    await page.getByRole('menuitem', { name: 'Duplicate', exact: true }).click();
    await page.getByRole('menu').waitFor({ state: 'hidden' });
  });
  await check('context-menu', async () => {
    await preview().getByText('Right-click here').click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Copy', exact: true }).click();
    await page.getByRole('menu').waitFor({ state: 'hidden' });
  });
  await check('popover', async () => {
    const trigger = preview().getByRole('button'); await trigger.click();
    await page.getByRole('dialog').waitFor(); await page.keyboard.press('Escape');
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  });
  await check('password-input', async () => {
    const input = preview().locator('input'); await input.fill('demo-password');
    await preview().getByRole('button').click(); assert.equal(await input.getAttribute('type'), 'text');
    await preview().getByRole('button').click(); assert.equal(await input.getAttribute('type'), 'password');
  });
  await check('date-picker', async () => {
    await preview().getByRole('button').click();
    const day = page.getByRole('dialog').locator('[data-slot=calendar-day]').nth(14);
    await day.click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    assert.doesNotMatch(await preview().innerText(), /Pick a date/);
  });
  await check('file-upload', async () => {
    const input = preview().locator('input[type=file]');
    await input.setInputFiles({ name: 'diagram.png', mimeType: 'image/png', buffer: Buffer.from('demo image') });
    assert.match(await preview().getByRole('status').innerText(), /diagram.png/);
    await input.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
    assert.match(await preview().getByRole('alert').innerText(), /file type is not accepted/);
  });
  await check('editable', async () => {
    await preview().getByText('Click to edit', { exact: true }).click();
    await preview().locator('input').fill('Project name');
    await preview().locator('input').press('Enter');
    assert.match(await preview().innerText(), /Project name/);
  });
  await check('tags-input', async () => {
    const input = preview().locator('input'); await input.fill('Design'); await input.press('Enter');
    assert.match(await preview().innerText(), /Design/);
    await preview().getByRole('button', { name: /remove/i }).click();
    assert.doesNotMatch(await preview().innerText(), /Design/);
  });
  await check('calendar', async () => {
    await preview().locator('[data-day="2026-05-13"] button').click();
    assert.match(await preview().locator('.sigil-docs-example-output').innerText(), /May 13, 2026/);
  });
  for (const slug of ['sonner', 'toaster', 'toast']) {
    await check(slug, async () => {
      await preview().getByRole('button', { name: 'Show success' }).click();
      const toast = page.locator('[data-sonner-toast], [data-slot="toast"]').first();
      await toast.waitFor(); assert.match(await toast.innerText(), /Project saved/);
      await toast.getByRole('button').click(); await toast.waitFor({ state: 'hidden' });
    });
  }
  await check('toast-promise', async () => {
    await preview().getByRole('button', { name: 'Try a failed request' }).click();
    await page.getByText('Could not save. Try again.', { exact: true }).waitFor();
    await preview().getByRole('button', { name: 'Save project' }).click();
    await page.locator('[data-sonner-toast]').getByText('Project saved', { exact: true }).waitFor();
  });
  await check('animated-charts', async () => {
    const start = page.getByRole('slider', { name: 'Start of chart range' });
    const end = page.getByRole('slider', { name: 'End of chart range' });
    await start.focus(); await start.press('ArrowRight');
    assert.equal(await start.getAttribute('aria-valuenow'), '1');
    await end.focus(); await end.press('ArrowLeft');
    assert.equal(await end.getAttribute('aria-valuenow'), '4');
    assert.equal(await page.locator('.sigil-preview').count(), 4);
  });
  await check('bento-grid', async () => {
    const grid = preview().locator('[data-slot=bento-grid]');
    const columns = () => grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(await columns(), 3);
    await page.setViewportSize({ width: 700, height: 900 }); assert.equal(await columns(), 2);
    await page.setViewportSize({ width: 390, height: 900 }); assert.equal(await columns(), 1);
    await page.setViewportSize({ width: 1440, height: 1000 });
  });
  await check('mermaid-diagram', async () => {
    await preview().locator('[data-slot=mermaid-diagram] svg').waitFor();
    assert.doesNotMatch(await preview().innerText(), /Mermaid error/);
  });
  await check('resizable-panel-group', async () => {
    const handle = preview().getByRole('separator');
    const before = Number(await handle.getAttribute('aria-valuenow'));
    await handle.focus(); await handle.press('ArrowRight');
    assert.ok(Number(await handle.getAttribute('aria-valuenow')) > before);
  });
  await check('chart-container', async () => {
    const chart = preview().getByRole('application');
    assert.ok((await chart.boundingBox()).width > 400);
    await chart.focus(); await chart.press('ArrowRight');
    await page.waitForFunction(() => [...document.querySelectorAll('.recharts-tooltip-wrapper')].some((el) => getComputedStyle(el).visibility === 'visible'));
    await page.screenshot({ path: `${output}/chart-${theme}.png` });
  });
  await context.close();
}
await browser.close();
fs.writeFileSync(`${output}/interactions.json`, JSON.stringify(results, null, 2));
const failures = results.filter((result) => !result.passed);
console.log(`${results.length - failures.length}/${results.length} interaction cases passed`);
if (failures.length) process.exitCode = 1;
