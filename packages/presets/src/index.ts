export { presetCatalog, getCatalogEntry, type PresetCatalogEntry } from "./catalog";
export { _templatePreset } from "./_template";
export { defaultPreset } from "./default";
export { sigilPreset } from "./sigil";
export { cruxPreset } from "./crux";
export { alloyPreset } from "./alloy";
export { basaltPreset } from "./basalt";
export { forgePreset } from "./forge";
export { onyxPreset } from "./onyx";
export { fluxPreset } from "./flux";
export { kovaPreset } from "./kova";
export { etchPreset } from "./etch";
export { anvilPreset } from "./anvil";
export { rivetPreset } from "./rivet";
export { shardPreset } from "./shard";
export { runePreset } from "./rune";
export { fangPreset } from "./fang";
export { cobaltPreset } from "./cobalt";
export { strataPreset } from "./strata";
export { brassPreset } from "./brass";
export { obsidPreset } from "./obsid";
export { axiomPreset } from "./axiom";
export { glyphPreset } from "./glyph";
export { cipherPreset } from "./cipher";
export { prismPreset } from "./prism";
export { helixPreset } from "./helix";
export { hexPreset } from "./hex";
export { vexPreset } from "./vex";
export { arcPreset } from "./arc";
export { dsgnPreset } from "./dsgn";
export { mrkrPreset } from "./mrkr";
export { noirPreset } from "./noir";
export { duskPreset } from "./dusk";
export { monoPreset } from "./mono";
export { vastPreset } from "./vast";
export { auraPreset } from "./aura";
export { fieldPreset } from "./field";
export { clayPreset } from "./clay";
export { sagePreset } from "./sage";
export { inkPreset } from "./ink";
export { sandPreset } from "./sand";
export { plumPreset } from "./plum";
export { mossPreset } from "./moss";
export { coralPreset } from "./coral";
export { dunePreset } from "./dune";
export { oceanPreset } from "./ocean";
export { rosePreset } from "./rose";

import type { SigilPreset } from "@sigil-ui/tokens";
import {
  SigilTokenValidationError,
  resolveSigilPreset,
} from "@sigil-ui/tokens";

/**
 * Re-validate lazy imports at their trust boundary. Curated modules already
 * resolve through `completePreset`; this catches corrupted bundles or future
 * loaders that bypass that helper before they reach the runtime.
 */
function resolvePreset(preset: SigilPreset): SigilPreset {
  const resolution = resolveSigilPreset(preset, preset.name);
  if (!resolution.valid) throw new SigilTokenValidationError(resolution.issues);
  return resolution.preset;
}

export const presets = {
  default: () => import("./default").then((m) => resolvePreset(m.defaultPreset)),
  sigil: () => import("./sigil").then((m) => resolvePreset(m.sigilPreset)),
  crux: () => import("./crux").then((m) => resolvePreset(m.cruxPreset)),
  alloy: () => import("./alloy").then((m) => resolvePreset(m.alloyPreset)),
  basalt: () => import("./basalt").then((m) => resolvePreset(m.basaltPreset)),
  forge: () => import("./forge").then((m) => resolvePreset(m.forgePreset)),
  onyx: () => import("./onyx").then((m) => resolvePreset(m.onyxPreset)),
  flux: () => import("./flux").then((m) => resolvePreset(m.fluxPreset)),
  kova: () => import("./kova").then((m) => resolvePreset(m.kovaPreset)),
  etch: () => import("./etch").then((m) => resolvePreset(m.etchPreset)),
  anvil: () => import("./anvil").then((m) => resolvePreset(m.anvilPreset)),
  rivet: () => import("./rivet").then((m) => resolvePreset(m.rivetPreset)),
  shard: () => import("./shard").then((m) => resolvePreset(m.shardPreset)),
  rune: () => import("./rune").then((m) => resolvePreset(m.runePreset)),
  fang: () => import("./fang").then((m) => resolvePreset(m.fangPreset)),
  cobalt: () => import("./cobalt").then((m) => resolvePreset(m.cobaltPreset)),
  strata: () => import("./strata").then((m) => resolvePreset(m.strataPreset)),
  brass: () => import("./brass").then((m) => resolvePreset(m.brassPreset)),
  obsid: () => import("./obsid").then((m) => resolvePreset(m.obsidPreset)),
  axiom: () => import("./axiom").then((m) => resolvePreset(m.axiomPreset)),
  glyph: () => import("./glyph").then((m) => resolvePreset(m.glyphPreset)),
  cipher: () => import("./cipher").then((m) => resolvePreset(m.cipherPreset)),
  prism: () => import("./prism").then((m) => resolvePreset(m.prismPreset)),
  helix: () => import("./helix").then((m) => resolvePreset(m.helixPreset)),
  hex: () => import("./hex").then((m) => resolvePreset(m.hexPreset)),
  vex: () => import("./vex").then((m) => resolvePreset(m.vexPreset)),
  arc: () => import("./arc").then((m) => resolvePreset(m.arcPreset)),
  dsgn: () => import("./dsgn").then((m) => resolvePreset(m.dsgnPreset)),
  mrkr: () => import("./mrkr").then((m) => resolvePreset(m.mrkrPreset)),
  noir: () => import("./noir").then((m) => resolvePreset(m.noirPreset)),
  dusk: () => import("./dusk").then((m) => resolvePreset(m.duskPreset)),
  mono: () => import("./mono").then((m) => resolvePreset(m.monoPreset)),
  vast: () => import("./vast").then((m) => resolvePreset(m.vastPreset)),
  aura: () => import("./aura").then((m) => resolvePreset(m.auraPreset)),
  field: () => import("./field").then((m) => resolvePreset(m.fieldPreset)),
  clay: () => import("./clay").then((m) => resolvePreset(m.clayPreset)),
  sage: () => import("./sage").then((m) => resolvePreset(m.sagePreset)),
  ink: () => import("./ink").then((m) => resolvePreset(m.inkPreset)),
  sand: () => import("./sand").then((m) => resolvePreset(m.sandPreset)),
  plum: () => import("./plum").then((m) => resolvePreset(m.plumPreset)),
  moss: () => import("./moss").then((m) => resolvePreset(m.mossPreset)),
  coral: () => import("./coral").then((m) => resolvePreset(m.coralPreset)),
  dune: () => import("./dune").then((m) => resolvePreset(m.dunePreset)),
  ocean: () => import("./ocean").then((m) => resolvePreset(m.oceanPreset)),
  rose: () => import("./rose").then((m) => resolvePreset(m.rosePreset)),
} as const;

export type PresetName = keyof typeof presets;
