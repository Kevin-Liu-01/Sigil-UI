import { defaultTokens } from "./tokens";
import type {
  PresetMetadata,
  SigilPreset,
  SigilTokens,
  TokenValidationIssue,
} from "./types";

const UNSAFE_KEYS = new Set(["__proto__", "prototype", "constructor"]);
const THEMED_ONLY_COLORS = new Set([
  "background",
  "surface",
  "surface-elevated",
  "surface-sunken",
  "text",
  "text-secondary",
  "text-muted",
  "text-subtle",
  "text-disabled",
  "text-inverse",
  "border",
  "border-muted",
  "border-strong",
  "border-interactive",
]);
const SAFE_COLOR_VALUE = /^(?:oklch|var|color-mix|light-dark|rgb|rgba|hsl|hsla|lab|lch)\(/i;
const UNSAFE_CSS_VALUE = /[{};]|<\/?style|\/\*|\*\/|@import|expression\s*\(|javascript\s*:/i;
const SAFE_PRESET_NAME = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export type TokenResolution = {
  readonly tokens: SigilTokens;
  readonly issues: readonly TokenValidationIssue[];
  readonly valid: boolean;
  readonly repaired: boolean;
};

export type PresetResolution = {
  readonly preset: SigilPreset;
  readonly issues: readonly TokenValidationIssue[];
  readonly valid: boolean;
  readonly repaired: boolean;
};

export type TokenPatch = {
  readonly category: keyof SigilTokens | string;
  readonly key: string;
  readonly value: unknown;
};

export type TokenMutationResult = {
  readonly ok: boolean;
  readonly changed: boolean;
  readonly tokens: SigilTokens;
  readonly issues: readonly TokenValidationIssue[];
};

export type ResolveTokenOptions = {
  /** Missing keys are inherited without diagnostics for compiler override bags. */
  readonly partial?: boolean;
  readonly fallback?: SigilTokens;
};

export class SigilTokenValidationError extends Error {
  readonly issues: readonly TokenValidationIssue[];

  constructor(issues: readonly TokenValidationIssue[]) {
    super(
      `Invalid Sigil token input (${issues.length} issue${issues.length === 1 ? "" : "s"})`,
    );
    this.name = "SigilTokenValidationError";
    this.issues = issues;
  }
}

export function isSafeTokenKey(key: string): boolean {
  return key.length > 0 && !UNSAFE_KEYS.has(key);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cloneValue) as T;
  if (!isPlainRecord(value)) return value;
  const clone: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (isSafeTokenKey(key)) clone[key] = cloneValue(child);
  }
  return clone as T;
}

function valuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => valuesEqual(value, right[index]))
    );
  }
  if (!isPlainRecord(left) || !isPlainRecord(right)) return false;
  const leftKeys = Object.keys(left).filter(isSafeTokenKey);
  const rightKeys = Object.keys(right).filter(isSafeTokenKey);
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(right, key) &&
        valuesEqual(left[key], right[key]),
    )
  );
}

function addIssue(
  issues: TokenValidationIssue[],
  code: TokenValidationIssue["code"],
  path: readonly string[],
  message: string,
): void {
  issues.push({ code, path: path.join("."), message });
}

function isSafeString(value: string): boolean {
  return value.trim().length > 0 && !UNSAFE_CSS_VALUE.test(value);
}

function isValidColor(value: string): boolean {
  const trimmed = value.trim();
  return (
    isSafeString(trimmed) &&
    (SAFE_COLOR_VALUE.test(trimmed) ||
      trimmed === "transparent" ||
      trimmed === "currentColor" ||
      trimmed === "inherit")
  );
}

function normalizeThemedColor(
  input: unknown,
  fallback: Record<string, unknown>,
  path: readonly string[],
  issues: TokenValidationIssue[],
): Record<string, unknown> {
  if (!isPlainRecord(input)) {
    addIssue(issues, "type-mismatch", path, "Expected a { light, dark } color object.");
    return cloneValue(fallback);
  }

  const output: Record<string, unknown> = {};
  for (const mode of ["light", "dark"] as const) {
    const value = input[mode];
    if (typeof value !== "string" || !isValidColor(value)) {
      addIssue(issues, "invalid-color", [...path, mode], "Expected a safe CSS color value.");
      output[mode] = fallback[mode];
    } else {
      output[mode] = value.trim();
    }
  }

  for (const key of Object.keys(input)) {
    if (!isSafeTokenKey(key)) {
      addIssue(issues, "unsafe-key", [...path, key], "Unsafe object key was rejected.");
    } else if (key !== "light" && key !== "dark") {
      addIssue(issues, "unknown-key", [...path, key], "Unknown themed-color key was rejected.");
    }
  }
  return output;
}

function normalizeColorToken(
  input: unknown,
  fallback: unknown,
  key: string,
  path: readonly string[],
  issues: TokenValidationIssue[],
): unknown {
  const themedOnly = THEMED_ONLY_COLORS.has(key);
  if (typeof input === "string" && !themedOnly) {
    if (isValidColor(input)) return input.trim();
    addIssue(issues, "invalid-color", path, "Expected a safe CSS color value.");
    return cloneValue(fallback);
  }

  const fallbackTheme = isPlainRecord(fallback)
    ? fallback
    : { light: fallback, dark: fallback };
  return normalizeThemedColor(input, fallbackTheme, path, issues);
}

function normalizeScale(
  input: unknown,
  fallback: readonly unknown[],
  path: readonly string[],
  issues: TokenValidationIssue[],
): readonly number[] {
  const valid =
    Array.isArray(input) &&
    input.length === fallback.length &&
    input.every((value) => typeof value === "number" && Number.isFinite(value)) &&
    input.every((value, index) => index === 0 || value > input[index - 1]);
  if (!valid) {
    addIssue(
      issues,
      "invalid-scale",
      path,
      `Expected ${fallback.length} finite, strictly ascending numbers.`,
    );
    return cloneValue(fallback) as readonly number[];
  }
  return [...input] as readonly number[];
}

function normalizeNode(
  input: unknown,
  fallback: unknown,
  path: readonly string[],
  issues: TokenValidationIssue[],
  partial: boolean,
): unknown {
  if (path[0] === "colors" && path.length === 2) {
    return normalizeColorToken(input, fallback, path[1] ?? "", path, issues);
  }

  if (Array.isArray(fallback)) {
    if (path.join(".") === "spacing.scale") {
      return normalizeScale(input, fallback, path, issues);
    }
    if (!Array.isArray(input)) {
      addIssue(issues, "type-mismatch", path, "Expected an array.");
      return cloneValue(fallback);
    }
    return cloneValue(input);
  }

  if (isPlainRecord(fallback)) {
    if (!isPlainRecord(input)) {
      addIssue(issues, "type-mismatch", path, "Expected an object.");
      return cloneValue(fallback);
    }

    const output: Record<string, unknown> = {};
    for (const [key, fallbackValue] of Object.entries(fallback)) {
      if (!isSafeTokenKey(key)) continue;
      if (!Object.prototype.hasOwnProperty.call(input, key) || input[key] === undefined) {
        if (!partial) addIssue(issues, "missing-key", [...path, key], "Required token is missing.");
        output[key] = cloneValue(fallbackValue);
        continue;
      }
      output[key] = normalizeNode(input[key], fallbackValue, [...path, key], issues, partial);
    }

    for (const key of Object.keys(input)) {
      if (!isSafeTokenKey(key)) {
        addIssue(issues, "unsafe-key", [...path, key], "Unsafe object key was rejected.");
      } else if (!Object.prototype.hasOwnProperty.call(fallback, key)) {
        addIssue(issues, "unknown-key", [...path, key], "Unknown token was rejected.");
      }
    }
    return output;
  }

  if (typeof fallback === "string") {
    if (typeof input !== "string") {
      addIssue(issues, "type-mismatch", path, "Expected a string token value.");
      return fallback;
    }
    if (!isSafeString(input)) {
      addIssue(issues, "invalid-string", path, "Unsafe or empty CSS token value was rejected.");
      return fallback;
    }
    return input.trim();
  }

  if (typeof fallback === "number") {
    if (typeof input !== "number" || !Number.isFinite(input)) {
      addIssue(issues, "invalid-number", path, "Expected a finite number.");
      return fallback;
    }
    return input;
  }

  if (typeof fallback === "boolean") {
    if (typeof input !== "boolean") {
      addIssue(issues, "type-mismatch", path, "Expected a boolean token value.");
      return fallback;
    }
    return input;
  }

  if (typeof input !== typeof fallback) {
    addIssue(issues, "type-mismatch", path, `Expected ${typeof fallback}.`);
    return cloneValue(fallback);
  }
  return cloneValue(input);
}

export function resolveSigilTokens(
  input: unknown,
  options: ResolveTokenOptions = {},
): TokenResolution {
  const fallback = options.fallback ?? defaultTokens;
  const issues: TokenValidationIssue[] = [];
  const root = isPlainRecord(input) ? input : {};
  if (!isPlainRecord(input)) {
    addIssue(issues, "invalid-root", [], "Token input must be a plain object.");
  }
  const tokens = normalizeNode(
    root,
    fallback,
    [],
    issues,
    options.partial ?? false,
  ) as SigilTokens;
  return {
    tokens,
    issues,
    valid: issues.length === 0,
    repaired: issues.length > 0,
  };
}

export function validateSigilTokens(
  input: unknown,
  options: Omit<ResolveTokenOptions, "fallback"> = {},
): readonly TokenValidationIssue[] {
  return resolveSigilTokens(input, options).issues;
}

export function assertValidSigilTokens(input: unknown): asserts input is SigilTokens {
  const issues = validateSigilTokens(input);
  if (issues.length > 0) throw new SigilTokenValidationError(issues);
}

function setPath(
  source: Record<string, unknown>,
  path: readonly string[],
  value: unknown,
): Record<string, unknown> {
  const [head, ...tail] = path;
  if (!head) return source;
  if (tail.length === 0) return { ...source, [head]: value };
  const child = isPlainRecord(source[head]) ? source[head] : {};
  return { ...source, [head]: setPath(child, tail, value) };
}

export function applyTokenPatches(
  tokens: SigilTokens,
  patches: readonly TokenPatch[],
): TokenMutationResult {
  if (patches.length === 0) {
    return { ok: true, changed: false, tokens, issues: [] };
  }

  const patchIssues: TokenValidationIssue[] = [];
  let candidate = tokens as unknown as Record<string, unknown>;
  for (const patch of patches) {
    const category = String(patch.category);
    const segments = [category, ...patch.key.split(".")];
    if (segments.length < 2 || segments.some((segment) => !isSafeTokenKey(segment))) {
      addIssue(patchIssues, "invalid-patch", segments, "Patch path is empty or unsafe.");
      continue;
    }
    candidate = setPath(candidate, segments, patch.value);
  }

  if (patchIssues.length > 0) {
    return { ok: false, changed: false, tokens, issues: patchIssues };
  }

  const resolved = resolveSigilTokens(candidate);
  if (!resolved.valid) {
    return { ok: false, changed: false, tokens, issues: resolved.issues };
  }
  if (valuesEqual(resolved.tokens, tokens)) {
    return { ok: true, changed: false, tokens, issues: [] };
  }
  return { ok: true, changed: true, tokens: resolved.tokens, issues: [] };
}

export function applyTokenPatch(
  tokens: SigilTokens,
  category: keyof SigilTokens | string,
  key: string,
  value: unknown,
): TokenMutationResult {
  return applyTokenPatches(tokens, [{ category, key, value }]);
}

function safeMetadata(input: unknown): PresetMetadata {
  if (!isPlainRecord(input)) return { description: "" };
  const clean = (value: unknown, fallback = "") =>
    typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").trim() : fallback;
  return {
    description: clean(input.description),
    author: clean(input.author) || undefined,
    version: clean(input.version) || undefined,
    tags: Array.isArray(input.tags)
      ? input.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 12)
      : undefined,
    mood: clean(input.mood) || undefined,
    inspiration: clean(input.inspiration) || undefined,
  };
}

export function resolveSigilPreset(
  input: unknown,
  fallbackName = "default",
): PresetResolution {
  const issues: TokenValidationIssue[] = [];
  const source = isPlainRecord(input) ? input : {};
  if (!isPlainRecord(input)) {
    addIssue(issues, "invalid-root", [], "Preset input must be a plain object.");
  }
  const rawName = typeof source.name === "string" ? source.name.trim().toLowerCase() : "";
  const name = SAFE_PRESET_NAME.test(rawName) ? rawName : fallbackName;
  if (name !== rawName) {
    addIssue(issues, "invalid-string", ["name"], "Preset name must be a lowercase slug.");
  }
  const tokenResolution = resolveSigilTokens(source.tokens);
  issues.push(...tokenResolution.issues.map((issue) => ({ ...issue, path: `tokens${issue.path ? `.${issue.path}` : ""}` })));
  return {
    preset: {
      name,
      tokens: tokenResolution.tokens,
      metadata: safeMetadata(source.metadata),
    },
    issues,
    valid: issues.length === 0,
    repaired: issues.length > 0,
  };
}
