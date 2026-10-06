import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(String(error)));
const samples = [];
try {
  for (const route of ['/', '/docs/components/chart-container']) {
    await page.goto(`${process.env.SIGIL_TEST_URL ?? 'http://localhost:4033'}${route}`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Studio', exact: true }).click();
    const section = page.locator('[data-studio-section="Radius"]');
    await section.getByRole('button', { name: 'Radius', exact: true }).click();
    const slider = section.locator('[data-studio-row="button"] [role="slider"]');
    await slider.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const sample = await slider.evaluate(async element => {
      const timings = [], frames = [];
      const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
      const css = () => document.querySelector('style[data-sigil-tokens]').sheet.cssRules[0].style.getPropertyValue('--s-radius-button');
      for (let i = 0; i < 40; i++) {
        await nextFrame();
        const before = performance.now();
        const key = i % 2 ? 'ArrowLeft' : 'ArrowRight';
        element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
        timings.push(performance.now() - before);
        await nextFrame();
        frames.push(performance.now() - before);
      }
      await nextFrame(); await nextFrame(); await nextFrame();
      return { timings, frames, finalCss: css(), displayed: element.getAttribute('aria-valuenow'), status: document.documentElement.dataset.sigilTokenStatus };
    });
    assert.equal(sample.status, 'ok');
    assert.equal(parseFloat(sample.finalCss) * (sample.finalCss.includes("rem") ? 16 : 1), Number(sample.displayed), 'the last edit and displayed value agree');
    const percentile = (values, n) => [...values].sort((a,b)=>a-b)[Math.floor((values.length-1)*n)];
    samples.push({ route, edits: sample.timings.length, handlerMedianMs: percentile(sample.timings,.5), handlerP95Ms: percentile(sample.timings,.95), frameMedianMs: percentile(sample.frames,.5), frameP95Ms: percentile(sample.frames,.95), ...sample });
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify(samples.map(({ timings, frames, ...summary })=>summary), null, 2));
  if (process.env.SIGIL_PERF_OUTPUT) {
    await mkdir(new URL('.', `file://${process.env.SIGIL_PERF_OUTPUT}`).pathname, { recursive: true });
    await writeFile(process.env.SIGIL_PERF_OUTPUT, JSON.stringify(samples,null,2));
  }
} finally { await browser.close(); }
