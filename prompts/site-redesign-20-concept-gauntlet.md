# Sigil Website Redesign Gauntlet — 20 Reviewable Concepts

You are the lead design engineer and orchestration agent for a long-running,
multi-agent redesign of the Sigil UI product website.

Your job is not to make one homepage and declare victory. Your job is to
research, design, build, render, criticize, and iteratively improve **exactly 20
complete, genuinely different homepage concepts** that the user can review in a
single gallery when they return.

Work autonomously for hours. Fan out bounded work to sub-agents, use fresh
visual critics, keep a live progress ledger, and continue until the completion
contract at the end of this prompt is actually satisfied. Do not stop after a
plan, a mood board, a hero section, or a first pass.

## Mission

Redesign Sigil's entire marketing homepage through 20 working alternatives.
Every alternative must:

- express Sigil's real product thesis: one design specification controls the
  tokens, components, blocks, pages, presets, and generated outputs;
- feel unmistakably black, white, metallic, technical, and premium without
  becoming generic dark SaaS;
- use the project's real fonts, real components, real messaging, and real data;
- use GSAP for deliberate narrative animation and Lenis for progressive smooth
  scrolling where it materially improves the concept;
- remain excellent with motion disabled, reduced motion enabled, JavaScript
  delayed, or smooth scrolling unavailable;
- be a full homepage, not a disconnected visual experiment;
- be reachable from a polished review gallery with screenshots, references,
  scores, and critique history.

Do **not** replace the production `/` route yet. Build the alternatives under a
review namespace so the user can choose a direction first.

## Working context and branch safety

Repository: `/Users/kevinliu/repos/Sigil-UI`

Expected branch: `codex/site-redesign-20-concepts`

At the start:

1. Read the root `AGENTS.md` and `.sigil/AGENTS.md` completely.
2. Read `.cursor/rules/sigil-design-system.mdc` and
   `.cursor/rules/taste-enforcement.mdc` completely.
3. Read the relevant Sigil skills before acting: `sigil-tokens`,
   `sigil-preset`, `sigil-layout`, `sigil-playbook`, `sigil-polish`,
   `sigil-messaging`, `sigil-audit`, and `sigil-scene` where applicable.
4. Confirm the current branch. If it is not the expected branch, switch only if
   doing so is safe. Never reset, discard, overwrite, or clean existing user
   changes.
5. Inspect the current worktree and treat all existing modifications as user
   work. Build around them.
6. The inherited worktree is heavily dirty. Do not stage, commit, stash, reset,
   clean, or push anything unless the user separately requests it after this
   run. A broad commit would accidentally capture unrelated baseline work.
7. Record `HEAD`, branch, `git status --porcelain`, and SHA-256 checksums for the
   protected trees under ignored `output/redesign/baseline/`. Recompute the
   checksums at the end and require exact matches.

Protect these existing areas from redesign edits:

- `apps/web/app/page.tsx`
- `apps/web/app/docs/**`
- `apps/web/content/docs/**`
- `packages/components/**`
- `packages/presets/**`
- `packages/tokens/**`
- every existing app route outside the new `/concepts` namespace

## The fundamental Sigil rule

**Edit the token spec, not shared components.**

Concept agents may compose existing components and create concept-local scene
or layout files. They may not restyle or modify `packages/components` to make a
concept work. Prefer scoped use of existing complete presets such as `alloy`,
`anvil`, `rivet`, `brass`, `obsid`, `noir`, `mono`, `axiom`, `crux`, or `cobalt`.
If a concept truly needs a custom identity, it must own a complete, validated
token/preset contract covering all 33 Sigil categories. Start from the canonical
template/complete-preset mechanism and retain every field. Do not ship partial
custom presets or add review-only concepts to the curated 46-preset catalog.

Shared component fixes, dependency changes, route registry changes, global
motion infrastructure, gallery code, and audit tooling belong exclusively to
the lead/integrator.

## Research gate — do this before implementation

Create `design/redesign/research.md` with citations and a concise decision log.
Do not start concept implementation until the research brief exists.

### Internal sources

Inventory the entire canonical wiki at `/Users/kevinliu/repos/Kevin-Wiki` and
write a coverage manifest into the research brief. Read the full design,
Sigil-project, style, motion, typography, tooling, and saved-reference corpus;
search the remaining wiki for additional relevant references rather than
assuming the shortlist is exhaustive. Prioritize:

- `raw/obsidian/What websites I like..md`
- `raw/notes/design-folder-sites-2026-06-25.md`
- `wiki/user/design-taste.md`
- `wiki/projects/sigil-ui.md`
- `wiki/design/README.md`
- `wiki/design/taste-enforcement.md`
- `wiki/design/ai-native-web-design-pattern-library.md`
- `wiki/design/aesthetic-systems.md`
- `wiki/design/website-design-styles.md`
- `wiki/design/prompt-recipes.md`
- `wiki/design/product-site-reference-gallery.md`
- `wiki/design/design-agencies-reference.md`
- `wiki/design/design-inspiration-galleries.md`
- `wiki/design/niche-ui-galleries.md`
- `wiki/design/creative-web-interaction-references.md`
- `wiki/design/x-bookmarks-design-ui.md`
- `wiki/design/deep-black-palette.md`
- `wiki/design/dark-mode-engineering.md`
- `wiki/design/texture-resources.md`
- `wiki/design/interface-micro-polish.md`
- `wiki/design/motion-library-ranking.md`
- `wiki/design/motion-3d-playbook.md`
- `wiki/design/design-effects-and-motion-sources.md`
- `wiki/design/frontier-stack-2026.md`
- `wiki/design/shader-effects-libraries.md`
- `wiki/design/type-foundries.md`
- `wiki/design/technical-illustration-system.md`
- `wiki/design/reticle-design-system.md`
- `wiki/design/sigil-token-architecture.md`
- `wiki/style/design-and-animation.md`
- `wiki/design/fieldwork-animation-testing.md`
- `wiki/tools/liquid-logo.md`
- `wiki/concepts/design-tree-exploration.md`
- `skills/engineering/gsap-scrolltrigger/SKILL.md`
- `skills/engineering/locomotive-scroll/SKILL.md`

Read the repository's current homepage, docs, components page, presets page,
README/OG assets, token system, and canonical messaging. Record what must be
preserved functionally and what should be challenged visually.

### Prompting and orchestration sources

Study these sources directly:

- https://x.com/mattshumer_/status/2081054356405731740
- https://github.com/mshumer/Claude-of-Duty
- https://github.com/mshumer/Claude-of-Duty/blob/main/prompt.md
- https://github.com/mshumer/Claude-of-Duty/blob/main/ARCHITECTURE.md
- https://github.com/mshumer/Claude-of-Duty/blob/main/README.md
- https://somethingbig.ai/gauntlet-loop

Extract the useful system, not the hype: explicit ownership, independently
judgeable work, fresh-context critics, deterministic captures, one largest gap
per loop, functional/performance tests, and a final smoothing pass. Preserve the
important retrospective lesson: parallel agents are effective for isolated
concepts, while coupled typography, motion, shared layout, and integration work
need sequential ownership.

### X bookmark research

If a signed-in X session is available, search the user's bookmarks for design,
website, animation, GSAP, WebGL, shaders, scroll, typography, editorial,
industrial, black/white, and metallic references. If the live session is not
available, use the canonical synced wiki page
`wiki/design/x-bookmarks-design-ui.md` and say so in the research brief.

Start with these high-signal saved references and follow their relevant links:

- https://x.com/BenjaminUIX/status/2081778264717275185
- https://x.com/sabosugi/status/2081820627887882434
- https://x.com/samakov0/status/2081798587437187116
- https://x.com/YousufSoomroDev/status/2081794254238523438
- https://x.com/browser_use/status/2068405699340853541
- https://x.com/alex_barashkov/status/2047309188569666010
- https://x.com/emilkowalski/status/2081704974040387898
- https://x.com/BenjDicken/status/2077826040127422568
- https://x.com/emilkowalski/status/2077745381299961872
- https://x.com/emilkowalski/status/2077404975555031509
- https://x.com/Aurelien_Gz/status/2081099136888189065
- https://x.com/Aurelien_Gz/status/2081416011354386762
- https://x.com/MengTo/status/2074511787073106194
- https://x.com/MengTo/status/2079267787298746709
- https://x.com/jumperz/status/2077841331037094042
- https://x.com/mrblackstudio/status/2078055066469011706
- https://x.com/mattrothenberg/status/2042289316261507105
- https://x.com/AliGrids/status/2029803266696171747
- https://x.com/mehmetozsoyart/status/2036070712461451661
- https://x.com/AlbiaHossain/status/2033169752475222304
- https://x.com/AlbiaHossain/status/2037550620744482907

### External benchmark shortlist

Inspect a focused shortlist rather than blindly cloning trend galleries:

- Product/industrial: https://oxide.computer/, https://stripe.dev/,
  https://graphite.com/, https://voidzero.dev/,
  https://www.blacksmith.sh/, https://railway.com/,
  https://www.shopify.com/editions/winter2026, https://www.sazabi.com/,
  https://nullrange.com/
- Studios/craft: https://basement.studio/, https://darkroom.engineering/,
  https://lusion.co/, https://activetheory.net/, https://noomoagency.com/,
  https://obys.agency/, https://locomotive.ca/en/careers,
  https://cuberto.com/, https://14islands.com/
- Material/motion: https://gsap.com/showcase/,
  https://liquid.paper.design/,
  https://shaders.paper.design/liquid-metal,
  https://reactbits.dev/backgrounds/liquid-chrome,
  https://eng.basement.studio/tools/shader-lab,
  https://60fps.design/, https://www.landing.love/

For every selected reference, record the specific lesson being borrowed:
composition, typography, motion grammar, material behavior, information
architecture, interaction, or product proof. Never copy branding or protected
assets.

## Art direction shared by all concepts

The umbrella is **editorial-technical × industrial foundry × selective liquid
metal**.

Use semantic off-black and off-white, not literal `#000` and `#fff`. Every
concept must choose one coherent undertone family: neutral graphite, cool
gunmetal, warm nickel/brass, carbon/bone, or ink/paper. Metal is a focal artifact
or state—not wallpaper. One credible metal object, moving rim, machined plate,
or reflective transition is stronger than chrome on every surface.

Typography and spacing must already be excellent with every effect disabled.
Use the project's actual licensed font assets and tokenized font roles. Do not
fake the wiki's font references if the files or licenses are absent. Keep a
clear display/body/mono hierarchy and improve tracking where current fonts feel
tight.

Product proof belongs in the first viewport. Each concept must visibly
demonstrate at least one real Sigil causality chain:

`DESIGN.md → 519 tokens → CSS/Tailwind/W3C → components → blocks → page`

Do not merely print those words. Make the chain interactable and truthful.

## Twenty concept contracts

Build these as full homepage alternatives. They are starting theses, not rigid
wireframes. Each must have a distinct visual thesis, material thesis, motion
thesis, typography plan, and anti-reference.

1. **Liquid Sigil** — black stage, a single silver liquid-metal mark, then a
   real token cascade into the interface.
2. **Token Foundry** — the system as machined plates moving through a precise
   monochrome production line.
3. **Spec → System** — a scroll film from `DESIGN.md` through compiled outputs
   to finished product UI.
4. **The Token Lathe** — live controls visibly machine radius, density,
   typography, and finish.
5. **Source / Result Tear** — a cursor-controlled seam between token source and
   rendered product.
6. **Monochrome Press** — editorial broadsheet rhythm, halftone specimens, and
   restrained serif contrast.
7. **Oxide Instrument** — industrial hardware gravitas, technical illustration,
   and exploded systems thinking.
8. **Chrome Selection Museum** — a quiet preset gallery where only the active
   identity receives a moving metallic rim.
9. **Reticle Machine Room** — alignment rails, diagnostics, counters, and slow
   telemetry without arcade motion.
10. **Blueprint Becomes Product** — schematic lines progressively resolve into
    fully rendered components.
11. **Constraint Compiler** — CSS, Tailwind, and W3C output streams behave like
    one synchronized machine.
12. **Preset Runway** — dramatic identity chambers that prove presets change
    structure as well as color.
13. **Carbon + Bone** — carbon shell, bone typography, sparse status accents,
    and product proof first.
14. **Brushed Steel Manual** — Swiss technical-manual composition with a few
    convincing metal specimen inserts.
15. **Living DESIGN.md** — the editable markdown specification itself is the
    hero and visibly propagates through the page.
16. **Exploded System** — an isometric stack of primitives, tokens, components,
    blocks, and pages that assembles while scrolling.
17. **Kinetic Type Film** — oversized monochrome claims synchronized to precise
    GSAP chapters, always tied to real product behavior.
18. **Chrome Atlas** — preset families presented as physical material samples:
    alloy, iridium, gunmetal, paper, and ink.
19. **Calibration Lab** — a live tuning bench for grid, type, motion, density,
    and material parameters.
20. **Null Surface** — radical restraint: almost no decoration, one flawless
    token cascade, exquisite typography, and surgical micro-interaction.

If two concepts begin converging, force one to pivot structurally. A different
accent color is not a different concept.

## Information architecture required in every concept

Each homepage must provide a coherent version of:

1. Navigation and immediate product identity.
2. Hero with real product proof.
3. The spec/token causality story.
4. Component and preset proof using real interactive UI.
5. Agent/human workflow or CLI story.
6. Credibility through actual counts, outputs, and capabilities.
7. Clear routes to Components, Presets, Docs, Demos, and Sandbox.
8. A purposeful closing CTA and footer.

The sequence, composition, and interaction model should vary by concept. Copy
must come from the canonical Sigil messaging skill and project facts. No lorem
ipsum, fabricated testimonials, fake logos, fake controls, or unsupported
claims.

## Target architecture and ownership contract

The lead must write `design/redesign/ARCHITECTURE.md` before fan-out. It is the
only coordination contract and must contain the actual file ownership table.

Recommended structure:

```text
apps/web/app/concepts/
  page.tsx                       # review gallery; lead-owned
  compare/page.tsx               # side-by-side review; lead-owned
  [slug]/page.tsx                # thin route adapter

apps/web/components/concepts/
  shared/                        # lead-owned motion/runtime/gallery primitives
  01-liquid-sigil/               # concept agent owns only this directory
  02-token-foundry/
  ...
  20-null-surface/

apps/web/lib/concepts/
  registry.ts                    # lead-owned
  progress.json                  # lead/integrator-owned ledger
  captures/                      # deterministic generated review artifacts

apps/web/public/concepts/
  previews/                      # optimized deterministic gallery thumbnails

design/redesign/
  research.md
  ARCHITECTURE.md
  concepts/<slug>.md             # concept design contracts + critique history

scripts/
  audit-redesign-concepts.mjs    # lead-owned deterministic QA harness
```

The exact implementation may improve on this, but preserve these ownership
rules:

- One concept agent owns one concept directory and its concept contract.
- No concept agent edits another concept, shared infrastructure, global CSS,
  shared components, dependencies, registry, gallery, or audit tooling.
- The lead owns shared GSAP/Lenis setup and integrates concept routes.
- Cross-concept communication happens through the registry contract, not
  direct imports between concepts.
- Each concept owns a complete token contract and consumes `var(--s-*)` for all
  visual properties, either by declaring a scoped existing preset in the
  manifest or by providing a complete custom spec.
- Each concept is mounted beneath a nested scoped token provider and cleans up
  its token style tag on unmount. Never mutate the global default preset.
- `manifest.ts` contains exactly 20 immutable IDs (`01`–`20`), unique slugs,
  preset/token contract, inspiration IDs, motif, layout model, and motion story.
- Route loaders lazy-import each concept so one route never bundles all 20.
- `[slug]/page.tsx` uses static params, `notFound()`, and route metadata.
- Mark `/concepts` and every concept route `noindex,nofollow` and omit them from
  the sitemap during review.
- Parallelize isolated concept routes. Serialize shared typography, gallery,
  motion runtime, and whole-site integration.

Before launching agents, assign explicit ownership paths in the architecture
file. If concurrency is limited, run concepts in waves while keeping the same
ownership contract.

## GSAP and Lenis implementation contract

GSAP is already a project dependency. Verify its actual installed API before
writing code. Add the current supported `lenis` package only if absent and only
through the workspace package manager.

The lead creates one concept-only motion runtime with these constraints:

- Lenis is scoped to `/concepts/**`; it must never change docs, sandbox, or the
  production site during this review phase.
- Synchronize Lenis with GSAP/ScrollTrigger using one clock. Never run competing
  requestAnimationFrame loops.
- Use `gsap.context()` or the supported React integration and revert every
  timeline, trigger, listener, ticker callback, and observer on unmount.
- Refresh ScrollTrigger after fonts, responsive layout, and media settle.
- Prefer transform and opacity; avoid layout thrash and perpetual `will-change`.
- Pin only when the narrative earns it. Do not trap the user in decorative
  scroll scenes.
- Disable smooth scrolling and scrubbed animation for `prefers-reduced-motion`.
  Render the final meaningful state immediately.
- Component feedback remains fast and local; GSAP owns narrative timelines,
  not every hover.
- Ambient motion is slow and subordinate. Interaction motion is roughly
  140–240ms. Narrative motion exists only to explain the product.
- Cap shader DPR, pause offscreen canvases, provide still posters, and provide a
  non-WebGL fallback.
- Mobile gets a composed alternative, not a shrunken desktop pin sequence.

## Agent topology

Use sub-agents aggressively but deliberately.

### Phase A — parallel research

Launch independent bounded agents for:

1. Wiki/taste synthesis.
2. Live X bookmark and visual-reference curation.
3. Current Sigil product/messaging/route audit.
4. GSAP/Lenis/performance architecture.

The lead reconciles their findings into the research brief and architecture
contract. Agents do not edit production files during research.

### Phase B — breadth-first concept waves

Build complete v1s for all 20 concepts before deeply polishing favorites. Use
the maximum safe concurrency, respecting the ownership table. Each builder gets:

- its concept contract;
- the Sigil token and component rules;
- only the references selected for that concept;
- its exact owned paths;
- the shared registry/runtime interface;
- required screenshots and acceptance checks.

With four available agent slots, keep one stable root orchestrator, two concept
implementers, and one independent critic. Run ten waves of two concepts. One
implementer owns odd-numbered concept folders; the other owns even-numbered
folders. The critic is read-only for source code and writes only review artifacts
under ignored `output/redesign/`.

Each concept builder must deliver a complete page, token contract, responsive
states, reduced-motion behavior, and a self-check. The builder does not grade
its own aesthetics.

Maintain restartable state for every numbered slot:

`briefed → implementing → auditing → critiquing → revising → passed`

Rejected work is rebuilt in the same numbered slot. Never add a twenty-first
concept or delete a difficult slot.

### Phase C — fresh critic loops

After a concept renders, launch a new critic with fresh context. Do not include
the builder's reasoning or self-description. Give the critic only:

- mission and Sigil rules;
- concept thesis and anti-reference;
- selected benchmarks;
- the live route;
- deterministic screenshots and interaction capture;
- the rubric below.

The critic must inspect actual pixels and behavior. It cannot pass based on
source code or a builder summary.

Require this exact response schema:

```text
VERDICT: PASS | FAIL
BLIND WINNER: A | B | TIE
CONFIDENCE: 0–100
SCORES (0–10):
- composition:
- typography:
- black/white tonal control:
- metallic material credibility:
- motion choreography:
- interaction craft:
- product clarity:
- responsive quality:
- accessibility/reduced motion:
- brand coherence:
LARGEST REMAINING GAP:
PIXEL/INTERACTION EVIDENCE:
LIKELY ROOT CAUSE:
ONE RECOMMENDED CORRECTION:
REGRESSIONS TO PROTECT:
```

Where a fair reference comparison exists, create randomized A/B captures so the
critic does not know which is Sigil. Record whether the critic preferred ours,
the benchmark, or tied. Do not claim a blind comparison if labels or branding
make it obvious.

Return the single largest meaningful gap to the builder. The builder must
diagnose the underlying cause with measurements before applying the critic's
wording literally. Fix that gap, rerender, and submit to a new fresh critic.
Continue until the concept passes its acceptance threshold. If three loops make
no measurable improvement, force a structural diagnosis or concept pivot
instead of repeating surface tweaks.

### Phase D — ranking and focused deepening

Once all 20 complete v1s exist:

1. Render the review gallery.
2. Rank concepts by the full rubric.
3. Identify the lowest-scoring quartile and the highest-potential quartile.
4. Improve weak concepts until they are independently reviewable.
5. Deepen strong concepts without making the gallery homogeneous.
6. Run a sequential typography smoothing pass across all concepts.
7. Run a sequential motion/performance smoothing pass across all concepts.
8. Run a final integrator to remove accidental inconsistency while preserving
   each concept's thesis.

## Review gallery contract

`/concepts` is the user's deliverable. It must be excellent, fast, and useful.
It must show exactly 20 concepts with:

- stable number, name, and thesis;
- desktop and mobile thumbnail;
- material, typography, layout, and motion tags;
- reference links and the lesson taken from each;
- current score and pass/fail status;
- iteration count and largest resolved gap;
- direct link to the live concept;
- keyboard-accessible previous/next navigation;
- filters and a compact compare action;
- no autoplaying twenty WebGL canvases in the gallery.

The gallery uses native scrolling and generated thumbnails; it must not mount 20
live iframes or initialize Lenis. Every concept links to the real shared
`/docs`, `/components`, `/presets`, `/demos`, `/sandbox`, and `/walkthrough`
routes. Use the project's canonical `SIGIL_PRODUCT_STATS`; never hardcode product
counts.

Add `/concepts/compare?a=<slug>&b=<slug>` or an equivalent comparison mode. Keep
gallery thumbnails deterministic and lightweight. The gallery itself uses the
shared Sigil system and is not a twenty-first concept.

Maintain `apps/web/lib/concepts/progress.json` (or an equally inspectable typed
artifact) throughout the run. Update it after every meaningful build or critic
loop so progress is visible without reading agent logs.

## Deterministic visual and functional harness

Create `scripts/audit-redesign-concepts.mjs` and a package command for it. Model
the rigor of Claude-of-Duty's capture, shotset, baseline, diff, profile, and
playtest tools.

For every concept, capture at minimum:

- desktop `1440×1000` hero, midpoint, and footer;
- tablet `820×1180` hero and midpoint;
- mobile `390×844` hero, navigation-open, midpoint, and footer;
- keyboard focus state;
- one meaningful hover/drag/toggle interaction;
- reduced-motion state;
- still fallback for any shader/WebGL scene.

The final contact sheet must include at least 80 canonical screenshots: 20
concepts × desktop/mobile × light/dark. Additional tablet, interaction, and
reduced-motion captures supplement those 80.

Use deterministic content, viewport, theme, animation settling, scroll
positions, and random seeds. Capture console errors and page errors. Script
interactions rather than judging only a static hero.

The harness must check:

- every concept route and the gallery return 2xx;
- no hydration, runtime, console, or page errors;
- no horizontal overflow or clipped essential content;
- no broken images, missing fonts, empty sections, or placeholder copy;
- every control is named, focusable, operable, and has a usable hit target;
- reduced motion disables Lenis and nonessential timelines;
- light/dark behavior matches the concept contract where both are promised;
- black/white/background/text values resolve through Sigil tokens;
- no hardcoded component colors, radii, shadows, or durations;
- animation cleanup survives route changes and React remounts;
- repeated navigation between concepts does not accumulate ScrollTriggers,
  ticker callbacks, listeners, token style tags, or Lenis instances;
- CLS remains below 0.1;
- no persistent main-thread jank during scripted scrolling;
- shader/canvas work pauses offscreen and degrades cleanly;
- mobile does not preserve desktop-only pinned whitespace.

Store review artifacts under `output/redesign/<run-id>/` with a JSON report,
human-readable report, screenshots, and scores. The gallery may read copied,
optimized thumbnails from a stable generated-assets directory, not directly
from ephemeral output paths.

## Quality rubric and pass threshold

A concept passes only when:

- overall mean score is at least `8.2/10`;
- no rubric dimension is below `7.5/10`;
- the critic cannot identify a major composition, typography, material,
  responsive, or product-clarity failure;
- all deterministic functional gates pass;
- the concept remains coherent with motion disabled;
- it is visibly and structurally distinct from the other 19 concepts.

Do not let one impossible benchmark consume the whole run. Establish breadth,
then improve the largest gaps. Do not claim perfection merely because a loop
ran several times. Record honest scores and remaining tradeoffs.

## Anti-slop prohibitions

Reject and redesign any concept that relies on:

- centered hero + pill nav + decorative blobs + three equal feature cards;
- dark navy/purple/brown sludge labeled "premium";
- glass, chrome, glow, gradients, or shaders on every surface;
- equal-weight bento soup or cards nested inside cards;
- all-Inter/default typography or more than three competing type families;
- scroll hijacking, decorative fullscreen scenes, or motion without product
  causality;
- ambient motion stronger than interaction or narrative motion;
- impossible reflections or unconvincing fake metal;
- fake product screenshots, fake controls, fake testimonials, or fake brands;
- decorative diagrams that explain nothing;
- source-code-only review without rendered desktop/mobile/motion evidence.

One dominant hero move beats ten effects. Texture belongs in sparse structural
areas, not dense reading surfaces. Metal should communicate state, craft, or
transformation.

## Required verification commands

Use the exact current workspace commands discovered from the repo. At minimum,
before final handoff run:

```bash
pnpm --filter @sigil-ui/web build
pnpm --filter @sigil-ui/web exec tsc --noEmit
pnpm build:runtime-packages
pnpm typecheck
pnpm audit:sigil
pnpm audit:docs
pnpm audit:docs:previews
pnpm audit:authoring
pnpm audit:presets
pnpm audit:contrast
pnpm audit:resilience
pnpm audit:layout -- --base=http://localhost:4010
node packages/cli/dist/index.js doctor
node packages/cli/dist/index.js diff
node scripts/audit-redesign-concepts.mjs --base=http://localhost:4010
git diff --check
```

Run the production server for browser QA. Do not use a dev server for the final
high-concurrency audit. Do not sync token snapshots or overwrite user changes
merely because `sigil diff` reports pre-existing differences.

Do not trust exit codes alone. Require the docs route report to remain at 504
routes × 2 themes = 1,008 runs with zero errors and zero warnings. Require the
deep preview report to have zero errors, zero warnings, and zero missing
previews. Require no increase in nonfatal token-pattern or authoring findings.
Require the protected-tree checksum comparison to pass.

## Communication and persistence

Post short progress updates while working, but do not pause for approval between
normal phases. Ask the user only when genuinely blocked by missing authority,
authentication, a destructive action, or an irreversible choice.

Continue through research, architecture, all 20 v1s, critic loops, gallery,
audits, and smoothing. A long runtime is expected. Use sub-agents in waves as
slots become available. Do not leave unawaited agents, missing routes, or
half-built concepts.

## Completion contract

Do not stop until all of the following are true:

- [ ] Research brief exists with wiki, bookmark, benchmark, and orchestration
      citations.
- [ ] Architecture/ownership contract exists and was followed.
- [ ] Exactly 20 full homepage concepts exist and are reachable.
- [ ] Every concept has a complete 33-category Sigil token contract.
- [ ] Every concept has a visual/material/motion thesis and anti-reference.
- [ ] Every concept uses real product content and real navigation.
- [ ] GSAP and Lenis are integrated through one cleaned-up, reduced-motion-safe
      runtime scoped to concept routes.
- [ ] Every concept has desktop, tablet, mobile, interaction, and reduced-motion
      captures.
- [ ] Every concept has been reviewed by at least one fresh critic.
- [ ] Failed concepts were iterated on the largest gap and rerendered.
- [ ] `/concepts` shows all 20 concepts, scores, references, progress, and links.
- [ ] Comparison mode works.
- [ ] Final typography, motion/performance, and integration smoothing passes are
      complete.
- [ ] Production build, typecheck, Sigil audit, docs audit, doctor, concept
      audit, and `git diff --check` all pass.
- [ ] The production homepage `/` and existing docs remain intact for review.
- [ ] Protected-tree checksums exactly match the starting baseline.
- [ ] The docs baseline remains 504 routes, 1,008 light/dark runs, zero errors,
      and zero warnings.
- [ ] Final handoff lists routes, scores, remaining honest tradeoffs, commands,
      report paths, and the best candidates without choosing for the user.

The final state should let the user return, open one gallery, and meaningfully
review 20 ambitious, polished, working directions—not twenty screenshots, not
twenty color swaps, and not twenty unfinished heroes.
