export {
  compileDesignMd,
  compileInteractionCss,
  compileToCss,
  compileToJson,
  compileToTailwind,
  compileToTs,
  compileToW3CJson,
  deepMerge,
  isThemedColor,
  parseDesignMarkdown,
  parseMarkdownTokens,
} from "./compile";

export type { DeepPartial } from "./compile";

export { createPreset, mergePresets, sigilPreset } from "./presets";

export {
  SigilTokenValidationError,
  applyTokenPatch,
  applyTokenPatches,
  assertValidSigilTokens,
  isSafeTokenKey,
  resolveSigilPreset,
  resolveSigilTokens,
  validateSigilTokens,
} from "./validation";

export type {
  PresetResolution,
  ResolveTokenOptions,
  TokenMutationResult,
  TokenPatch,
  TokenResolution,
} from "./validation";

export { defaultTokens } from "./tokens";

export { TokenLayer } from "./types";

export type {
  AlignmentTokens,
  BannerTokens,
  BorderTokens,
  CTATokens,
  CardTokens,
  ColorTokens,
  ColorValue,
  CssCompileOptions,
  CursorTokens,
  CursorVariant,
  DesignComponent,
  DesignDensity,
  DesignDocument,
  DesignMetadata,
  DesignSurface,
  DesignTheme,
  DividerStyleTokens,
  FooterTokens,
  GridVisualTokens,
  GutterPattern,
  HeroTokens,
  MarkdownTokenOverrides,
  MotionDurations,
  MotionEasings,
  MotionTokens,
  PageRhythmTokens,
  PresetMetadata,
  RadiusTokens,
  ScrollbarTokens,
  ScrollbarVisibility,
  SectionStyleTokens,
  SigilGridTokens,
  SigilPreset,
  SigilTokens,
  ShadowTokens,
  SpacingScale,
  SpacingTokens,
  ThemedColor,
  TokenValidationIssue,
  TokenValidationIssueCode,
  TokenValidationMode,
  TypographyTokens,
} from "./types";
