"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
import type {
  SigilPreset,
  SigilTokens,
  TokenMutationResult,
  TokenPatch,
  TokenValidationIssue,
} from "@sigil-ui/tokens";
import {
  applyTokenPatches,
  compileToCss,
  resolveSigilPreset,
  resolveSigilTokens,
} from "@sigil-ui/tokens";
import { presets, defaultPreset, type PresetName } from "@sigil-ui/presets";

/* ------------------------------------------------------------------ */
/* Synchronous DOM token writer                                        */
/*                                                                    */
/* Switching a preset on the home page used to trigger ~250–500ms     */
/* React renders before the visual swap was visible, because the      */
/* `<style data-sigil-tokens>` tag was rebuilt inside a useEffect that */
/* only fired after React reconciled every consumer of useSigilTokens.*/
/* Now we eagerly write the style tag from within the click handler,  */
/* so the visual change lands on the very next frame and React's      */
/* downstream re-render no longer blocks the perceived update.         */
/*                                                                    */
/* The CSS we write reuses `compileToCss` from @sigil-ui/tokens so      */
/* the runtime + build-time outputs are byte-for-byte identical (up    */
/* to the `!important` flag). This kills the historic naming drift     */
/* where buttons emitted `--s-btn-*` at runtime but `--s-button-*` at   */
/* build time — components only ever consumed `--s-button-*` and the   */
/* runtime layer silently lost overrides for the entire button block.  */
/* ------------------------------------------------------------------ */

const DEFAULT_STYLE_ATTR = "data-sigil-tokens";

// Per-attribute style-tag cache. Each SigilTokensProvider can opt in to its
// own dedicated tag (e.g. nested sandbox provider uses "data-sigil-sandbox"
// so its writes don't clobber the outer provider's tag). Writes are
// short-circuited per attr via lastCssByAttr.
const styleElByAttr = new Map<string, HTMLStyleElement>();
const lastCssByAttr = new Map<string, string>();
const cssByTokenBag = new WeakMap<SigilTokens, string>();
type TokenCssRule = { selector: string; values: Map<string, string> };
const rulesByTokenBag = new WeakMap<SigilTokens, TokenCssRule[]>();
const rulesByAttr = new Map<string, TokenCssRule[]>();

function tokenRules(tokens: SigilTokens, css: string): TokenCssRule[] | null {
  const cached = rulesByTokenBag.get(tokens);
  if (cached) return cached;
  if (typeof CSSStyleSheet === "undefined" || !CSSStyleSheet.prototype.replaceSync) return null;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  const rules = Array.from(sheet.cssRules, rule => {
    const style = (rule as CSSStyleRule).style;
    return { selector: (rule as CSSStyleRule).selectorText,
      values: new Map(Array.from(style, name => [name, style.getPropertyValue(name)])) };
  });
  rulesByTokenBag.set(tokens, rules);
  return rules;
}

function writeTokenStyles(el: HTMLStyleElement, tokens: SigilTokens, css: string, attr: string) {
  const next = tokenRules(tokens, css);
  const previous = rulesByAttr.get(attr);
  const sheet = el.sheet;
  if (next && previous && sheet && sheet.cssRules.length === next.length &&
    next.every((rule, index) => rule.selector === (sheet.cssRules[index] as CSSStyleRule).selectorText)) {
    // Keep the stylesheet and its selector cache intact. Only changed custom
    // properties invalidate inheritance; unchanged declarations do no work.
    next.forEach((rule, index) => {
      const style = (sheet.cssRules[index] as CSSStyleRule).style;
      const old = previous[index].values;
      for (const name of old.keys()) if (!rule.values.has(name)) style.removeProperty(name);
      for (const [name, value] of rule.values) {
        if (old.get(name) !== value) style.setProperty(name, value, "important");
      }
    });
  } else {
    el.textContent = css;
  }
  if (next) rulesByAttr.set(attr, next);
}

const loadedPresetCache = new Map<string, SigilPreset>([
  ["default", defaultPreset],
]);
const loadingPresetCache = new Map<string, Promise<SigilPreset>>();
const preparedPresets = new WeakMap<SigilPreset, ReturnType<typeof resolveSigilPreset>>();

// Preserve the validated token object's identity so CSS compiled while loading
// is the exact CSS used on every subsequent click.
function preparePreset(preset: SigilPreset, name: string) {
  const cached = preparedPresets.get(preset);
  if (cached) return cached;
  const resolution = resolveSigilPreset(preset, name);
  if (resolution.valid) {
    const css = serializeTokensToCss(resolution.preset.tokens);
    tokenRules(resolution.preset.tokens, css);
    preparedPresets.set(preset, resolution);
    preparedPresets.set(resolution.preset, resolution);
  }
  return resolution;
}

type TokenDomApplyResult = {
  readonly ok: boolean;
  readonly changed: boolean;
  readonly issues: readonly TokenValidationIssue[];
};

function runtimeIssue(path: string, message: string): TokenValidationIssue {
  return { code: "invalid-root", path, message };
}

function failedMutation(
  tokens: SigilTokens,
  issues: readonly TokenValidationIssue[],
): TokenMutationResult {
  reportTokenStatus(false, issues);
  return { ok: false, changed: false, tokens, issues };
}

function reportTokenStatus(
  ok: boolean,
  issues: readonly TokenValidationIssue[] = [],
): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.sigilTokenStatus = ok ? "ok" : "error";
  if (ok) {
    delete root.dataset.sigilTokenError;
    return;
  }
  root.dataset.sigilTokenError = issues[0]?.message ?? "Unknown token error";
  root.dispatchEvent(
    new CustomEvent("sigil:token-error", { detail: { issues } }),
  );
}

function getTokensStyleEl(attr: string): HTMLStyleElement | null {
  if (typeof document === "undefined") return null;
  const cached = styleElByAttr.get(attr);
  if (cached && cached.isConnected) return cached;
  const existing = document.querySelector(
    `style[${attr}]`,
  ) as HTMLStyleElement | null;
  if (existing) {
    styleElByAttr.set(attr, existing);
    return existing;
  }
  const el = document.createElement("style");
  el.setAttribute(attr, "true");
  document.head.appendChild(el);
  styleElByAttr.set(attr, el);
  return el;
}

/**
 * Serialize a token bag to CSS for runtime DOM injection.
 *
 * Wraps the canonical `compileToCss` and post-processes its output to
 * append `!important` on every declaration so the runtime tag wins over
 * the static stylesheet, then rewrites the dark selector to the runtime
 * convention (`.dark, [data-theme="dark"]`) used by the rest of the app.
 *
 * The result is byte-equivalent to the build-time CSS modulo the
 * `!important` flag and the dark-selector list — no hand-rolled emitter,
 * no per-category prefix table to drift out of sync.
 */
export function serializeTokensToCss(tokens: SigilTokens): string {
  const cached = cssByTokenBag.get(tokens);
  if (cached) return cached;

  const compiled = compileToCss(tokens, {
    selector: ":root",
    darkSelector: ".dark, [data-theme=\"dark\"]",
    validation: "strict",
  });

  // Append `!important` to every declaration. We match the simple
  // `<varname>: <value>;` shape emitted by compileToCss; lines that
  // open/close blocks (`:root {`, `}`) and blank lines are passed through.
  const serialized = compiled
    .split("\n")
    .map((line) => {
      const m = /^(\s*)(--[\w-]+):\s*(.+);$/.exec(line);
      if (!m) return line;
      const [, indent, name, value] = m;
      return `${indent}${name}: ${value} !important;`;
    })
    .join("\n")
    .trimEnd();

  cssByTokenBag.set(tokens, serialized);
  return serialized;
}

// Synchronously write tokens to the DOM — call this from the user-input
// handler so the visual swap lands in the next paint, independent of when
// React decides to flush its re-render. Returns true if anything changed.
//
// `attr` selects which `<style>` tag to write to. Defaults to the global
// "data-sigil-tokens" tag; nested providers (e.g. /sandbox) pass a unique
// attribute so their writes layer on top via source order without clobbering
// the outer tag.
export function applyTokensToDom(
  tokens: SigilTokens,
  attr: string = DEFAULT_STYLE_ATTR,
): boolean {
  const result = applyTokensToDomResult(tokens, attr);
  return result.ok && result.changed;
}

function applyTokensToDomResult(
  tokens: SigilTokens,
  attr: string = DEFAULT_STYLE_ATTR,
): TokenDomApplyResult {
  if (!/^data-[a-z0-9-]+$/.test(attr)) {
    const issues = [runtimeIssue("styleTagAttr", "Unsafe style-tag attribute was rejected.")];
    reportTokenStatus(false, issues);
    return { ok: false, changed: false, issues };
  }
  const el = getTokensStyleEl(attr);
  if (!el) {
    const issues = [runtimeIssue("document", "Unable to create the Sigil token style element.")];
    return { ok: false, changed: false, issues };
  }
  try {
    const css = serializeTokensToCss(tokens);
    if (css === lastCssByAttr.get(attr)) {
      reportTokenStatus(true);
      return { ok: true, changed: false, issues: [] };
    }
    // CSS is fully compiled before touching the live style element. If
    // compilation fails, the last known-good stylesheet stays mounted.
    writeTokenStyles(el, tokens, css, attr);
    lastCssByAttr.set(attr, css);
    // Font and background changes land in the same paint as the colors.
    // CSS owns font loading; an old font promise must never undo a new preset.
    if (attr === DEFAULT_STYLE_ATTR) {
      document.body.dataset.sigilBgPattern = tokens.backgrounds.pattern;
      document.body.dataset.sigilBgGradient = tokens.backgrounds["gradient-type"];
      document.body.dataset.sigilBgNoise = tokens.backgrounds.noise ? "true" : "false";
    }
    reportTokenStatus(true);
    return { ok: true, changed: true, issues: [] };
  } catch (error) {
    const issues = [
      runtimeIssue(
        "compile",
        error instanceof Error ? error.message : "Token compilation failed.",
      ),
    ];
    reportTokenStatus(false, issues);
    return { ok: false, changed: false, issues };
  }
}

// Defer a React state commit to a fresh macrotask after the browser has had
// a chance to paint. We use a double-rAF + postMessage fallback rather than
// setTimeout because setTimeout(0) is clamped to ~4ms and still runs in the
// same paint frame in some browsers. The double-rAF guarantees the browser
// has actually painted before React starts its (potentially slow) re-render.
function scheduleReactCommit(commit: () => void) {
  if (typeof requestAnimationFrame === "undefined") {
    commit();
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(commit);
  });
}

function warmPresetFonts(preset: SigilPreset) {
  if (typeof document === "undefined" || !("fonts" in document)) return;

  const typography = preset.tokens.typography as
    | Record<string, unknown>
    | undefined;
  if (!typography) return;

  const families = ["font-display", "font-body", "font-mono"]
    .map((key) => typography[key])
    .filter((value): value is string => typeof value === "string");

  for (const family of families) {
    document.fonts.load(`400 16px ${family}`).catch(() => {});
    document.fonts.load(`700 16px ${family}`).catch(() => {});
  }
}

function recordPresetApply(name: string, isCurrent: () => boolean, startedAt?: number) {
  if (
    startedAt === undefined ||
    typeof performance === "undefined" ||
    typeof document === "undefined"
  ) {
    return;
  }

  performance.mark("sigil:preset:applied");
  performance.measure(
    "sigil:preset:apply",
    { start: startedAt, end: performance.now() },
  );

  const applyMs = performance.now() - startedAt;
  document.documentElement.dataset.sigilPresetApplyMs = applyMs.toFixed(2);
  document.documentElement.dataset.sigilPresetName = name;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!isCurrent()) return;
      document.documentElement.dataset.sigilPresetPaintMs = (
        performance.now() - startedAt
      ).toFixed(2);
      delete document.documentElement.dataset.sigilPresetSwitching;
    });
  });
}

type SigilTokensActions = {
  getSnapshot: () => { tokens: SigilTokens; activePreset: string; revision: number };
  setPreset: (name: string) => Promise<TokenMutationResult>;
  preloadPreset: (name: string) => Promise<void>;
  setTokens: (tokens: SigilTokens, name?: string) => TokenMutationResult;
  patchTokenBatch: (patches: readonly TokenPatch[]) => TokenMutationResult;
  patchTokens: (
    category: keyof SigilTokens,
    key: string,
    value: unknown,
  ) => TokenMutationResult;
};

type SigilTokensContextValue = SigilTokensActions & {
  tokens: SigilTokens;
  activePreset: string;
};

// Three contexts so consumers can subscribe to only what they need:
//   - SigilTokensValueContext      changes on every token mutation
//   - SigilTokensActiveContext     changes only when preset name swaps
//   - SigilTokensActionsContext    stable for the lifetime of the provider
// The legacy SigilTokensContext keeps the full bag for back-compat with
// components that still call useSigilTokens(); new code should prefer the
// narrower hooks below to avoid unnecessary re-renders.
const SigilTokensContext = createContext<SigilTokensContextValue | null>(null);
const SigilTokensValueContext = createContext<SigilTokens | null>(null);
const SigilTokensRevisionContext = createContext(0);
const SigilTokensActiveContext = createContext<string>("default");
const SigilTokensActionsContext = createContext<SigilTokensActions | null>(
  null,
);

export function SigilTokensProvider({
  children,
  initialPreset,
  initialTokens,
  styleTagAttr = DEFAULT_STYLE_ATTR,
}: {
  children: ReactNode;
  initialPreset?: string | SigilPreset;
  initialTokens?: SigilTokens;
  /**
   * Attribute name of the `<style>` tag this provider writes to. Defaults to
   * `"data-sigil-tokens"`. Nested providers (for example the sandbox page
   * mounting its own provider beneath the global `SigilShell` one) should
   * pass a unique attribute like `"data-sigil-sandbox"` so their CSS layers
   * on top via source order without clobbering the outer tag.
   */
  styleTagAttr?: string;
}) {
  const resolvedName =
    typeof initialPreset === "string"
      ? initialPreset
      : initialPreset?.name ?? "default";

  const initialTokenCandidate =
    initialTokens ??
    (typeof initialPreset === "object" ? initialPreset?.tokens : undefined) ??
    defaultPreset.tokens;
  const [tokens, setTokens] = useState<SigilTokens>(() =>
    initialTokenCandidate === defaultPreset.tokens
      ? defaultPreset.tokens
      : resolveSigilTokens(initialTokenCandidate).tokens,
  );
  const [activePreset, setActivePreset] = useState(resolvedName);
  const [revision, setRevision] = useState(0);
  const tokensRef = useRef(tokens);
  const activePresetRef = useRef(activePreset);
  const editFrameRef = useRef<number | null>(null);
  const getSnapshot = useCallback(() => ({ tokens: tokensRef.current, activePreset: activePresetRef.current, revision: stateCommitSeqRef.current }), []);
  useEffect(() => () => {
    if (editFrameRef.current !== null) cancelAnimationFrame(editFrameRef.current);
  }, []);

  // Apply CSS in the input handler; reconcile editor controls after that
  // frame has painted. Coalesce rapid events and always commit the latest
  // snapshot, including edits from multiple controls in the same frame.
  const commitEdit = useCallback(() => {
    if (editFrameRef.current !== null) return;
    const commit = () => {
      editFrameRef.current = null;
      startTransition(() => {
        setTokens(tokensRef.current);
        setRevision(stateCommitSeqRef.current);
        setActivePreset(activePresetRef.current);
      });
    };
    if (typeof requestAnimationFrame === "undefined") { commit(); return; }
    editFrameRef.current = requestAnimationFrame(() => {
      editFrameRef.current = requestAnimationFrame(commit);
    });
  }, []);

  // Latest-wins guard: if the user clicks two presets in quick succession,
  // only the most recent click should commit state. This prevents the
  // earlier (still-loading) preset from racing in after the newer one.
  const presetSeqRef = useRef(0);
  // Every successful write receives a sequence number. Deferred React
  // bookkeeping from an earlier preset must never overwrite a newer direct
  // token edit after the DOM has already moved on.
  const stateCommitSeqRef = useRef(0);
  // Cache loaded preset modules so repeat switches don't re-import.
  const presetCacheRef = useRef(loadedPresetCache);
  // Stable ref to the current attribute so memoised actions can read it
  // without breaking memoisation when the attr prop changes.
  const styleAttrRef = useRef(styleTagAttr);
  styleAttrRef.current = styleTagAttr;

  // Custom initial presets belong to this provider, not the shared loader cache.
  const customPresetRef = useRef(typeof initialPreset === "object" ? initialPreset : null);

  // Write initial tokens eagerly on mount so the very first paint reflects
  // this provider's state. Non-default tags (e.g. the sandbox layer) get
  // torn down on unmount so their !important rules don't outlive the route.
  //
  // When the static sigil-tokens.css is generated from the same default
  // preset (via build-tokens-css.mjs), the values here are byte-identical
  // to the static CSS — so the !important override is a visual no-op and
  // causes no flash. The style tag is still created so that subsequent
  // preset switches can update it in-place.
  useIsomorphicLayoutEffect(() => {
    applyTokensToDom(tokens, styleTagAttr);
    if (styleTagAttr === DEFAULT_STYLE_ATTR) return;
    return () => {
      const el = styleElByAttr.get(styleTagAttr);
      el?.remove();
      styleElByAttr.delete(styleTagAttr);
      lastCssByAttr.delete(styleTagAttr);
      rulesByAttr.delete(styleTagAttr);
    };
    // We only want this on (un)mount + when the attribute itself changes,
    // not on every token update — those are handled by the action writers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleTagAttr]);

  const applyPreset = useCallback(
    (
      preset: SigilPreset,
      name: string,
      seq: number,
      startedAt?: number,
    ): TokenMutationResult => {
      // Discard stale applies if a newer preset switch has started.
      if (seq !== presetSeqRef.current) {
        return {
          ok: false,
          changed: false,
          tokens: tokensRef.current,
          issues: [runtimeIssue("preset", "A newer preset selection replaced this request.")],
        };
      }

      const resolution = preparePreset(preset, name);
      if (!resolution.valid) {
        return failedMutation(tokensRef.current, resolution.issues);
      }
      const nextTokens = resolution.preset.tokens;

      // Eager DOM write — visual swap happens on the next paint without
      // waiting for React to reconcile every consumer of useSigilTokens.
      const domResult = applyTokensToDomResult(nextTokens, styleAttrRef.current);
      if (!domResult.ok) return failedMutation(tokensRef.current, domResult.issues);
      const changed = domResult.changed;
      const stateCommitSeq = ++stateCommitSeqRef.current;
      tokensRef.current = nextTokens;
      activePresetRef.current = name;
      recordPresetApply(name, () => seq === presetSeqRef.current && stateCommitSeq === stateCommitSeqRef.current, startedAt);

      // The visual swap is already done; everything React does from here
      // on is editor / consumer bookkeeping. Mark it as a transition so
      // React schedules the work at lower priority and yields between
      // component renders — keeps scroll / click handlers responsive while
      // the heavy reconciliation finishes in the background.
      const commit = () => {
        if (stateCommitSeq !== stateCommitSeqRef.current) return;
        startTransition(() => {
          setTokens(nextTokens);
          setRevision(stateCommitSeq);
          setActivePreset(name);
        });
      };

      if (typeof document === "undefined") {
        commit();
        return { ok: true, changed, tokens: nextTokens, issues: [] };
      }

      // No page snapshots or DOM scans: paint the cached stylesheet first,
      // then let React update token editors at transition priority.
      scheduleReactCommit(commit);
      return { ok: true, changed, tokens: nextTokens, issues: [] };
    },
    [],
  );

  const loadPreset = useCallback(async (name: string) => {
    const cached = customPresetRef.current?.name === name
      ? customPresetRef.current
      : presetCacheRef.current.get(name);
    if (cached) return cached;

    const loader = presets[name as PresetName];
    if (!loader) return null;

    let loading = loadingPresetCache.get(name);
    if (!loading) {
      loading = loader().then((preset) => {
        const resolution = preparePreset(preset, name);
        if (!resolution.valid) {
          throw new Error(
            `Preset "${name}" failed validation: ${resolution.issues[0]?.message ?? "unknown error"}`,
          );
        }
        const resolvedPreset = resolution.preset;
        presetCacheRef.current.set(name, resolvedPreset);
        // Compile once while the preset is loading or prewarming. The click
        // path can then replace the style tag with a cached string.
        serializeTokensToCss(resolvedPreset.tokens);
        return resolvedPreset;
      }).finally(() => {
        // A rejected import must never poison subsequent retries.
        loadingPresetCache.delete(name);
      });
      loadingPresetCache.set(name, loading);
    }
    return loading;
  }, []);

  const preloadPreset = useCallback(
    async (name: string) => {
      try {
        const preset = await loadPreset(name);
        if (preset) {
          const prepared = preparePreset(preset, name);
          if (prepared.valid) warmPresetFonts(prepared.preset);
        }
      } catch (error) {
        reportTokenStatus(false, [
          runtimeIssue(
            "preset.preload",
            error instanceof Error ? error.message : `Unable to preload "${name}".`,
          ),
        ]);
      }
    },
    [loadPreset],
  );

  const setPreset = useCallback(
    async (name: string): Promise<TokenMutationResult> => {
      if (customPresetRef.current?.name !== name && !presetCacheRef.current.has(name) && !presets[name as PresetName]) {
        return failedMutation(tokensRef.current, [
          runtimeIssue("preset", `Unknown preset "${name}" was rejected.`),
        ]);
      }
      const seq = ++presetSeqRef.current;
      const startedAt =
        typeof performance === "undefined" ? undefined : performance.now();
      if (typeof performance !== "undefined") {
        performance.clearMarks("sigil:preset:start");
        performance.clearMarks("sigil:preset:applied");
        performance.clearMeasures("sigil:preset:apply");
        performance.mark("sigil:preset:start");
      }
      if (typeof document !== "undefined") {
        document.documentElement.dataset.sigilPresetSwitching = "";
      }

      // Synchronous path for already-loaded presets — no await tick before
      // we schedule the state update.
      const cached = customPresetRef.current?.name === name
        ? customPresetRef.current
        : presetCacheRef.current.get(name);
      if (cached) {
        const result = applyPreset(cached, name, seq, startedAt);
        if (!result.ok && typeof document !== "undefined") {
          delete document.documentElement.dataset.sigilPresetSwitching;
        }
        return result;
      }

      try {
        const preset = await loadPreset(name);
        if (preset) return applyPreset(preset, name, seq, startedAt);
        return failedMutation(tokensRef.current, [
          runtimeIssue("preset", `Preset "${name}" did not return a token bundle.`),
        ]);
      } catch (error) {
        if (seq === presetSeqRef.current && typeof document !== "undefined") {
          delete document.documentElement.dataset.sigilPresetSwitching;
        }
        return failedMutation(tokensRef.current, [
          runtimeIssue(
            "preset",
            error instanceof Error ? error.message : `Unable to load "${name}".`,
          ),
        ]);
      }
    },
    [applyPreset, loadPreset],
  );

  const setTokensDirect = useCallback(
    (next: SigilTokens, name?: string): TokenMutationResult => {
      const resolution = resolveSigilTokens(next);
      if (!resolution.valid) {
        return failedMutation(tokensRef.current, resolution.issues);
      }
      const domResult = applyTokensToDomResult(
        resolution.tokens,
        styleAttrRef.current,
      );
      if (!domResult.ok) {
        return failedMutation(tokensRef.current, domResult.issues);
      }
      // A valid direct edit supersedes both an in-flight preset import and
      // any deferred React commit from an earlier visual write.
      presetSeqRef.current += 1;
      stateCommitSeqRef.current += 1;
      if (typeof document !== "undefined") delete document.documentElement.dataset.sigilPresetSwitching;
      const changed = domResult.changed;
      tokensRef.current = resolution.tokens;
      setTokens(resolution.tokens);
      setRevision(stateCommitSeqRef.current);
      activePresetRef.current = name ?? "custom";
      setActivePreset(activePresetRef.current);
      return {
        ok: true,
        changed,
        tokens: resolution.tokens,
        issues: [],
      };
    },
    [],
  );

  const patchTokenBatch = useCallback(
    (patches: readonly TokenPatch[]): TokenMutationResult => {
      const mutation = applyTokenPatches(tokensRef.current, patches);
      if (!mutation.ok) return failedMutation(tokensRef.current, mutation.issues);
      if (!mutation.changed) return mutation;

      const domResult = applyTokensToDomResult(
        mutation.tokens,
        styleAttrRef.current,
      );
      if (!domResult.ok) return failedMutation(tokensRef.current, domResult.issues);
      presetSeqRef.current += 1;
      stateCommitSeqRef.current += 1;
      if (typeof document !== "undefined") delete document.documentElement.dataset.sigilPresetSwitching;
      tokensRef.current = mutation.tokens;
      if (!activePresetRef.current.endsWith("*")) activePresetRef.current += "*";
      commitEdit();
      return mutation;
    },
    [commitEdit],
  );

  const patchTokens = useCallback(
    (
      category: keyof SigilTokens,
      key: string,
      value: unknown,
    ): TokenMutationResult => patchTokenBatch([{ category, key, value }]),
    [patchTokenBatch],
  );

  // Actions are stable across renders — consumers that only need to call
  // setPreset / setTokens / patchTokens never re-render on token changes.
  const actions = useMemo<SigilTokensActions>(
    () => ({
      getSnapshot,
      setPreset,
      preloadPreset,
      setTokens: setTokensDirect,
      patchTokenBatch,
      patchTokens,
    }),
    [getSnapshot, setPreset, preloadPreset, setTokensDirect, patchTokenBatch, patchTokens],
  );

  // Legacy combined value for back-compat callers of useSigilTokens().
  const ctx = useMemo<SigilTokensContextValue>(
    () => ({ tokens, activePreset, ...actions }),
    [tokens, activePreset, actions],
  );

  return (
    <SigilTokensActionsContext.Provider value={actions}>
      <SigilTokensActiveContext.Provider value={activePreset}>
        <SigilTokensValueContext.Provider value={tokens}>
          <SigilTokensContext.Provider value={ctx}>
            <SigilTokensRevisionContext.Provider value={revision}>{children}</SigilTokensRevisionContext.Provider>
          </SigilTokensContext.Provider>
        </SigilTokensValueContext.Provider>
      </SigilTokensActiveContext.Provider>
    </SigilTokensActionsContext.Provider>
  );
}

export function useSigilTokenRevision() {
  return useContext(SigilTokensRevisionContext);
}

export function useSigilTokens() {
  const ctx = useContext(SigilTokensContext);
  if (!ctx)
    throw new Error("useSigilTokens must be used within SigilTokensProvider");
  return ctx;
}

// Narrow hooks — prefer these in new code so components subscribe to the
// smallest slice of state they actually need.
export function useSigilTokenValues(): SigilTokens {
  const v = useContext(SigilTokensValueContext);
  if (!v)
    throw new Error(
      "useSigilTokenValues must be used within SigilTokensProvider",
    );
  return v;
}

export function useSigilActivePreset(): string {
  return useContext(SigilTokensActiveContext);
}

export function useSigilActions(): SigilTokensActions {
  const a = useContext(SigilTokensActionsContext);
  if (!a)
    throw new Error("useSigilActions must be used within SigilTokensProvider");
  return a;
}

/* ------------------------------------------------------------------ */
/* Optional hooks — safe to call outside SigilTokensProvider           */
/*                                                                    */
/* The website composes some surfaces (the docs MDX renderer, the     */
/* preset-detail static pages) that may render without the provider   */
/* mounted — for example during SSG. Components that want to react    */
/* to tokens *if available* but degrade gracefully when not should    */
/* call these instead of wrapping the throwing variants in try/catch. */
/* ------------------------------------------------------------------ */

export function useOptionalSigilTokenValues(): SigilTokens | null {
  return useContext(SigilTokensValueContext);
}

export function useOptionalSigilActivePreset(): string | null {
  // Returns null when no provider is mounted — distinguish from the
  // default "default" string the throwing variant would synthesize.
  const v = useContext(SigilTokensActiveContext);
  // Active context has a default value of "default" baked into createContext;
  // we can't distinguish absent vs "default" without a sentinel, but the
  // useful fact for callers is that "always returns a string" is fine.
  return v;
}

export function useOptionalSigilActions(): SigilTokensActions | null {
  return useContext(SigilTokensActionsContext);
}

export const SigilTokenProvider = SigilTokensProvider;

/**
 * @deprecated SandboxTokenInjector is no longer needed. Pass
 * `styleTagAttr="data-sigil-sandbox"` (or another unique attribute) to the
 * inner `SigilTokensProvider` instead — the provider now writes eagerly to
 * its own dedicated tag and tears it down on unmount. This shim keeps the
 * old import path alive so existing call sites don't break.
 */
export function SandboxTokenInjector() {
  return null;
}
