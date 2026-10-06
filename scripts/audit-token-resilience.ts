import assert from "node:assert/strict";

import { presets } from "../packages/presets/src/index.ts";
import {
  SigilTokenValidationError,
  applyTokenPatch,
  applyTokenPatches,
  compileToCss,
  deepMerge,
  defaultTokens,
  resolveSigilTokens,
  validateSigilTokens,
  type SigilTokens,
} from "../packages/tokens/src/index.ts";

const checks: string[] = [];
const record = (name: string) => checks.push(name);

async function main() {
  assert.deepEqual(validateSigilTokens(defaultTokens), []);
  assert.equal(Object.keys(defaultTokens).length, 33);
  record("canonical defaults cover all 33 categories");

  const unknown = resolveSigilTokens({ ...defaultTokens, imaginary: {} });
  assert.equal(unknown.valid, false);
  assert(unknown.issues.some((issue) => issue.code === "unknown-key"));
  assert.equal("imaginary" in unknown.tokens, false);
  record("unknown token categories are rejected and stripped");

  const originalFast = defaultTokens.motion.duration.fast;
  const validPatch = applyTokenPatch(defaultTokens, "motion", "duration.fast", "175ms");
  assert.equal(validPatch.ok, true);
  assert.equal(validPatch.changed, true);
  assert.equal(validPatch.tokens.motion.duration.fast, "175ms");
  assert.equal(defaultTokens.motion.duration.fast, originalFast);
  record("nested patches are immutable and schema-aware");

  const noOpPatch = applyTokenPatch(
    defaultTokens,
    "motion",
    "duration.fast",
    defaultTokens.motion.duration.fast,
  );
  assert.equal(noOpPatch.ok, true);
  assert.equal(noOpPatch.changed, false);
  assert.equal(noOpPatch.tokens, defaultTokens);
  record("no-op patches preserve identity and avoid rerenders");

  const invalidPath = applyTokenPatch(defaultTokens, "motion", "duration..fast", "1ms");
  assert.equal(invalidPath.ok, false);
  assert.equal(invalidPath.tokens, defaultTokens);

  const unsafePath = applyTokenPatch(defaultTokens, "colors", "__proto__.polluted", "true");
  assert.equal(unsafePath.ok, false);
  assert.equal(unsafePath.tokens, defaultTokens);
  assert.equal((Object.prototype as Record<string, unknown>).polluted, undefined);
  record("empty and prototype-polluting paths are rejected");

  const atomic = applyTokenPatches(defaultTokens, [
    { category: "motion", key: "duration.fast", value: "210ms" },
    { category: "spacing", key: "scale", value: [1, 2, 2] },
  ]);
  assert.equal(atomic.ok, false);
  assert.equal(atomic.changed, false);
  assert.equal(atomic.tokens, defaultTokens);
  assert.equal(defaultTokens.motion.duration.fast, originalFast);
  record("mixed-validity batches roll back atomically");

  const injection = "Inter; } body { display: none";
  const malformed = {
    typography: { "font-body": injection },
  } as unknown as Partial<SigilTokens>;
  const diagnostics: string[] = [];
  const repairedCss = compileToCss(malformed, {
    onDiagnostic: (issues) => diagnostics.push(...issues.map((issue) => issue.path)),
  });
  assert(diagnostics.includes("typography.font-body"));
  assert.equal(repairedCss.includes(injection), false);
  assert.equal(repairedCss.includes("undefined"), false);
  assert.equal(repairedCss.includes("NaN"), false);
  assert.equal(repairedCss.includes("[object Object]"), false);
  assert.throws(
    () => compileToCss(malformed, { validation: "strict" }),
    SigilTokenValidationError,
  );
  record("compiler repairs safely or fails closed in strict mode");

  const unsafeOptions = compileToCss(defaultTokens, {
    prefix: "s;}body{",
    selector: ":root;}body{display:none",
  });
  assert.equal(unsafeOptions.includes("body{display:none"), false);
  assert(unsafeOptions.includes("--s-primary"));
  record("compiler option injection falls back to safe defaults");

  const polluted = JSON.parse('{"safe":{"value":"ok"},"__proto__":{"polluted":true}}');
  const merged = deepMerge({ safe: { existing: true } }, polluted);
  assert.deepEqual(merged, { safe: { existing: true, value: "ok" } });
  assert.equal((Object.prototype as Record<string, unknown>).polluted, undefined);
  record("deep merge ignores prototype-pollution keys");

  const firstCss = compileToCss(defaultTokens, { validation: "strict" });
  const secondCss = compileToCss(defaultTokens, { validation: "strict" });
  assert.equal(firstCss, secondCss);
  record("canonical compilation is deterministic");

  for (const [name, load] of Object.entries(presets)) {
    const preset = await load();
    assert.equal(preset.name, name);
    assert.deepEqual(validateSigilTokens(preset.tokens), []);
    const css = compileToCss(preset.tokens, { validation: "strict" });
    assert.equal(css.includes("undefined"), false, `${name} emitted undefined`);
    assert.equal(css.includes("NaN"), false, `${name} emitted NaN`);
    assert.equal(css.includes("[object Object]"), false, `${name} emitted an object`);
  }
  record(`all ${Object.keys(presets).length} runtime presets validate and compile strictly`);

  console.log("Token resilience audit");
  for (const check of checks) console.log(`- PASS ${check}`);
  console.log(`- ${checks.length} checks passed`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
