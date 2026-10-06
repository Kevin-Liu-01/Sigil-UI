#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const base = process.env.SIGIL_TEST_URL ?? 'http://localhost:4033';
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const links = new Map();
for (const file of walk('apps/web/content/docs').filter((file) => file.endsWith('.mdx'))) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/(?:href=["']|\]\()((?:\/docs|\/components|\/presets|\/sandbox|\/brands)[^\s"')#?]*)/g)) {
    if (!links.has(match[1])) links.set(match[1], []);
    links.get(match[1]).push(file);
  }
}
const results = [];
const queue = [...links];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const [url, sources] = queue.shift();
    try {
      const response = await fetch(new URL(url, base), { method: 'HEAD', signal: AbortSignal.timeout(20_000) });
      results.push({ url, status: response.status, sources });
    } catch (error) { results.push({ url, status: 0, error: String(error), sources }); }
  }
}));
const failures = results.filter((result) => result.status < 200 || result.status >= 400);
fs.mkdirSync('output/product-polish/docs-complete-audit', { recursive: true });
fs.writeFileSync('output/product-polish/docs-complete-audit/links.json', JSON.stringify({ checked: results.length, failures, results }, null, 2));
console.log(`${results.length} local documentation links; ${failures.length} failures`);
for (const failure of failures) console.log(failure.url, failure.status, failure.sources.join(', '));
if (failures.length) process.exitCode = 1;
