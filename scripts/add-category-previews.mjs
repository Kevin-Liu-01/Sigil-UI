#!/usr/bin/env node

/**
 * Seed rich previews for visual component docs that do not have a matching
 * legacy /components page. Existing previews are never replaced.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "apps/web/content/docs");
const IMPORT_PATTERN = /(## Import\s*\n+\s*```tsx[\s\S]*?```\s*\n+)/;

const previews = {
  "diagrams/architecture-diagram": String.raw`<ComponentPreview label="Layered infrastructure">
  <ArchitectureDiagram
    title="Production architecture"
    gap="var(--s-space-3)"
    layers={[
      { label: "Interface", children: <span className="text-sm text-[var(--s-text)]">React application</span> },
      { label: "Services", children: <span className="text-sm text-[var(--s-text)]">API + workers</span> },
      { label: "Data", children: <span className="text-sm text-[var(--s-text)]">Postgres + cache</span>, hatched: true },
    ]}
  />
</ComponentPreview>`,
  "diagrams/capability-grid": String.raw`<ComponentPreview label="Runtime capabilities">
  <CapabilityGrid
    categories={[
      { label: "Runtimes", items: [{ name: "Node" }, { name: "Python" }, { name: "Rust" }] },
      { label: "System", items: [{ name: "Root", color: "var(--s-success)" }, { name: "GPU", color: "var(--s-success)" }] },
    ]}
    callout={{ label: "Unavailable", items: ["Nested virtualization"], variant: "warning" }}
  />
</ComponentPreview>`,
  "diagrams/comparison-table": String.raw`<ComponentPreview label="Feature comparison">
  <ComparisonTable
    columns={["Sigil", "Typical UI kit"]}
    features={[
      { name: "Token coverage", values: { Sigil: true, "Typical UI kit": false } },
      { name: "Live presets", values: { Sigil: true, "Typical UI kit": false } },
      { name: "Agent constraints", values: { Sigil: true, "Typical UI kit": false } },
    ]}
  />
</ComponentPreview>`,
  "diagrams/cross-hatch": String.raw`<ComponentPreview label="Structural hatching">
  <div className="relative h-48 w-full overflow-hidden border border-[var(--s-border)] bg-[var(--s-surface)]">
    <CrossHatch angle={45} spacing={12} opacity={0.22} />
    <div className="absolute inset-[var(--s-space-6)] flex items-center justify-center border border-[var(--s-border-strong)] bg-[var(--s-background)] text-sm text-[var(--s-text)]">
      Infrastructure layer
    </div>
  </div>
</ComponentPreview>`,
  "diagrams/diagram-callout-line": String.raw`<ComponentPreview label="Annotated connector">
  <svg viewBox="0 0 520 150" className="h-auto w-full" role="img" aria-label="Callout line connecting a token node to its annotation">
    <rect x="36" y="45" width="150" height="60" rx="6" fill="var(--s-surface)" stroke="var(--s-border)" />
    <text x="111" y="80" textAnchor="middle" fill="var(--s-text)" fontFamily="var(--s-font-mono)" fontSize="13">TOKEN NODE</text>
    <DiagramCalloutLine path="M186 75 H330 L370 44" label="COMPILED VALUE" labelX={378} labelY={47} dotX={186} dotY={75} active />
  </svg>
</ComponentPreview>`,
  "diagrams/diagram-label": String.raw`<ComponentPreview label="Annotation variants">
  <div className="flex flex-wrap items-center justify-center gap-[var(--s-space-8)] py-[var(--s-space-6)]">
    <DiagramLabel text="Input" variant="default" showDot />
    <DiagramLabel text="Compiled" variant="accent" showDot showLine lineLength={36} />
    <DiagramLabel text="Conflict" variant="warn" showDot />
  </div>
</ComponentPreview>`,
  "diagrams/exploded-view": String.raw`<ComponentPreview label="Exploded system layers">
  <ExplodedView
    gap="var(--s-space-3)"
    layers={[
      { label: "Experience", children: <div className="text-sm text-[var(--s-text)]">Components and blocks</div> },
      { label: "Constraints", children: <div className="text-sm text-[var(--s-text)]">519 design tokens</div> },
      { label: "Foundation", children: <div className="text-sm text-[var(--s-text)]">CSS custom properties</div>, hatched: true },
    ]}
  />
</ComponentPreview>`,
  "diagrams/feature-mini-diagram": String.raw`<ComponentPreview label="Mini diagram set">
  <div className="grid w-full grid-cols-2 gap-[var(--s-space-4)] sm:grid-cols-4">
    {["timeline-bars", "wave-state", "layer-stack", "hub-spoke"].map((variant) => (
      <div key={variant} className="flex min-h-32 items-center justify-center border border-[var(--s-border)] bg-[var(--s-surface)]">
        <FeatureMiniDiagram variant={variant} size={72} />
      </div>
    ))}
  </div>
</ComponentPreview>`,
  "diagrams/flow-diagram": String.raw`<ComponentPreview label="Token compilation flow">
  <FlowDiagram
    nodes={[
      { id: "spec", label: "DESIGN.md" },
      { id: "tokens", label: "Tokens", variant: "highlighted" },
      { id: "ui", label: "Interface", variant: "accent" },
    ]}
    connections={[{ from: "spec", to: "tokens", label: "parse" }, { from: "tokens", to: "ui", label: "compile" }]}
  />
</ComponentPreview>`,
  "diagrams/isolation-stack": String.raw`<ComponentPreview label="Isolation model">
  <IsolationStack
    layers={[
      { label: "Hardware", width: "100%" },
      { label: "Kernel", width: "78%" },
      { label: "Workload", width: "56%", accent: true },
    ]}
    columns={[{ key: "sigil", label: "Sigil", accent: true }, { key: "other", label: "Other" }]}
    rows={[
      { label: "Tokens", values: { sigil: "full", other: "partial" } },
      { label: "Presets", values: { sigil: "full", other: "none" } },
    ]}
  />
</ComponentPreview>`,
  "diagrams/platform-hub-diagram": String.raw`<ComponentPreview label="Connected platform">
  <PlatformHubDiagram
    left={[{ label: "Inputs", items: [{ label: "DESIGN.md" }, { label: "Preset" }] }]}
    center={{ label: "Sigil", items: [{ label: "compile" }, { label: "validate" }] }}
    right={[{ label: "Outputs", items: [{ label: "CSS" }, { label: "Components" }] }]}
  />
</ComponentPreview>`,
  "diagrams/state-persistence": String.raw`<ComponentPreview label="Persisted state">
  <StatePersistence
    activeItem={{ label: "Active workspace", sublabel: "restored", value: "Free", valueLabel: "while idle", variant: "success" }}
    competitors={[{ label: "Ephemeral runner", value: "$0.09/hr", variant: "danger" }]}
    persistedState={[{ label: "Installed packages", status: "Ready" }, { label: "Working tree", status: "Saved" }]}
  />
</ComponentPreview>`,
  "diagrams/timeline": String.raw`<ComponentPreview label="Release timeline">
  <Timeline
    entries={[
      { date: "JAN 08", title: "Token schema", description: "The design contract was defined." },
      { date: "FEB 14", title: "Preset compiler", description: "All themes began sharing one pipeline." },
      { date: "MAR 22", title: "Stable release", description: "Docs and packages shipped together." },
    ]}
  />
</ComponentPreview>`,
  "diagrams/waterfall-chart": String.raw`<ComponentPreview label="Build-time comparison">
  <WaterfallChart
    rows={[
      { label: "Cold build", steps: [{ label: "Install", duration: 420 }, { label: "Compile", duration: 360 }, { label: "Bundle", duration: 180 }] },
      { label: "Cached", steps: [{ label: "Restore", duration: 90, color: "var(--s-primary)" }, { label: "Verify", duration: 55, color: "var(--s-success)" }], accent: true },
    ]}
    badge="6.6× faster"
  />
</ComponentPreview>`,
  "layout/hairline": String.raw`<ComponentPreview label="Editorial divider" vertical>
  <div className="w-full text-sm text-[var(--s-text)]">
    <p>One continuous reading surface.</p>
    <Hairline />
    <p>The rule separates ideas without reserving a structural band.</p>
  </div>
</ComponentPreview>`,
  "layout/layout-controls": String.raw`<ComponentPreview label="Live layout controls" vertical>
  <LayoutControls className="!grid-cols-1" />
</ComponentPreview>`,
  "layout/page-grid": String.raw`<ComponentPreview label="Page alignment grid">
  <PageGrid showRails showCross className="min-h-64 overflow-hidden border border-[var(--s-border)] bg-[var(--s-background)]">
    <div className="mx-auto max-w-md p-[var(--s-space-8)] text-center">
      <div className="border border-[var(--s-border-strong)] bg-[var(--s-surface)] p-[var(--s-space-6)] text-sm text-[var(--s-text)]">Content aligned to the grid</div>
    </div>
  </PageGrid>
</ComponentPreview>`,
  "layout/page-shell": String.raw`<ComponentPreview label="Centered page shell">
  <PageShell className="!w-full" style={{ padding: "var(--s-section-padding-compact)" }}>
    <div className="border border-[var(--s-border)] bg-[var(--s-surface)] p-[var(--s-space-8)] text-center text-sm text-[var(--s-text)]">Token-constrained page content</div>
  </PageShell>
</ComponentPreview>`,
  "layout/sigil-navbar": String.raw`<ComponentPreview label="Inline navigation">
  <SigilNavbar variant="inline" fixed={false} className="w-full">
    <a href="/" className="font-semibold text-[var(--s-text)] no-underline">Sigil UI</a>
    <div className="ml-auto flex items-center gap-[var(--s-space-4)]">
      <a href="/docs" className="text-sm text-[var(--s-text-muted)] no-underline">Docs</a>
      <a href="/docs/components" className="text-sm text-[var(--s-text-muted)] no-underline">Components</a>
    </div>
  </SigilNavbar>
</ComponentPreview>`,
  "layout/sigil-view-code": String.raw`<ComponentPreview label="View or inspect source" vertical>
  <SigilViewCode code={'<Button variant="primary">Deploy</Button>'}>
    <div className="flex min-h-36 items-center justify-center bg-[var(--s-background)] p-[var(--s-space-8)]">
      <Button variant="primary">Deploy</Button>
    </div>
  </SigilViewCode>
</ComponentPreview>`,
  "marketing/blog-grid": String.raw`<ComponentPreview label="Editorial cards">
  <BlogGrid
    columns={3}
    posts={[
      { category: "Design systems", title: "Why constraints scale", excerpt: "A practical guide to keeping interface decisions coherent.", author: "Sigil", date: "6 min", href: "/docs" },
      { category: "Tokens", title: "One source of visual truth", excerpt: "How a complete token model prevents component drift.", author: "Sigil", date: "4 min", href: "/docs" },
      { category: "Workflow", title: "Designing with agents", excerpt: "Give agents enforceable constraints instead of screenshots.", author: "Sigil", date: "8 min", href: "/docs" },
    ]}
  />
</ComponentPreview>`,
  "marketing/blog-header": String.raw`<ComponentPreview label="Interactive blog header" vertical>
  <BlogHeader
    title="Notes on"
    accent="designed software"
    subtitle="Research, field notes, and practical guidance from the Sigil team."
    categories={["All", "Tokens", "Components", "Workflow"]}
  />
</ComponentPreview>`,
  "marketing/feature-frame": String.raw`<ComponentPreview label="Feature highlight">
  <FeatureFrame
    icon={<span aria-hidden className="font-mono text-lg">⌘</span>}
    title="One design contract"
    description="Every component reads the same complete, validated token schema."
  >
    <a href="/docs" className="text-sm font-medium text-[var(--s-primary)]">Read the system guide →</a>
  </FeatureFrame>
</ComponentPreview>`,
  "marketing/pricing-tiers": String.raw`<ComponentPreview label="Pricing tiers">
  <PricingTiers
    tiers={[
      { name: "Open source", price: "$0", description: "Build with the complete local system.", features: [{ label: "Tokens", value: "519" }, { label: "Presets", value: "46" }], cta: <Button variant="outline" className="w-full">View GitHub</Button> },
      { name: "Studio", price: "$24", period: "/ month", description: "Collaborative design tooling for teams.", badge: "Popular", highlighted: true, features: [{ label: "Projects", value: "Unlimited" }, { label: "Seats", value: "5" }], cta: <Button className="w-full">Start building</Button> },
    ]}
  />
</ComponentPreview>`,
  "marketing/unit-pricing": String.raw`<ComponentPreview label="Usage pricing">
  <UnitPricing
    toggle={<div className="flex border border-[var(--s-border)]"><button type="button" className="bg-[var(--s-primary)] px-4 py-2 text-sm text-[var(--s-primary-contrast)]">Monthly</button><button type="button" className="bg-[var(--s-surface)] px-4 py-2 text-sm text-[var(--s-text)]">Annual</button></div>}
    units={[
      { category: "Build minutes", price: "$0.008", unit: "per minute", footnote: "First 1,000 included" },
      { category: "Storage", price: "$0.12", unit: "per GB / month" },
      { category: "Bandwidth", price: "$0.06", unit: "per GB", badge: "Global" },
    ]}
  />
</ComponentPreview>`,
  "patterns/tessellation": String.raw`<ComponentPreview label="Tessellation variants">
  <div className="grid w-full grid-cols-1 gap-[var(--s-space-3)] sm:grid-cols-3">
    {["zigzag", "crosshatching", "diamondGrid"].map((variant) => (
      <div key={variant} className="relative h-40 overflow-hidden border border-[var(--s-border)] bg-[var(--s-surface)]">
        <Tessellation variant={variant} opacity={0.28} />
        <span className="absolute bottom-3 left-3 bg-[var(--s-background)] px-2 py-1 font-mono text-xs text-[var(--s-text)]">{variant}</span>
      </div>
    ))}
  </div>
</ComponentPreview>`,
  "playbook/border-stack": String.raw`<ComponentPreview label="Shared border rhythm">
  <BorderStack className="w-full">
    {[
      ["Tokens", "519 configurable fields"],
      ["Presets", "46 complete identities"],
      ["Components", "350+ constrained surfaces"],
    ].map(([label, value]) => (
      <div key={label} className="flex items-center justify-between bg-[var(--s-surface)] p-[var(--s-space-4)] text-sm"><span className="text-[var(--s-text)]">{label}</span><span className="font-mono text-[var(--s-text-muted)]">{value}</span></div>
    ))}
  </BorderStack>
</ComponentPreview>`,
  "playbook/density-text": String.raw`<ComponentPreview label="Density roles" vertical>
  <div className="flex w-full flex-col gap-[var(--s-space-3)]">
    <DensityText role="chrome">System status</DensityText>
    <DensityText role="counter">519 tokens compiled</DensityText>
    <DensityText role="detail">Detailed interface metadata</DensityText>
    <DensityText role="nav">Documentation navigation</DensityText>
    <DensityText role="body">Readable supporting copy for a product surface.</DensityText>
    <DensityText role="headline" as="h3">Agent-first design.</DensityText>
  </div>
</ComponentPreview>`,
  "playbook/featured-grid": String.raw`<ComponentPreview label="Featured grid">
  <FeaturedGrid columns={3} className="w-full">
    <div className="min-h-40 bg-[var(--s-surface)] p-[var(--s-space-6)] text-[var(--s-text)]"><strong>Featured system</strong><p className="mt-2 text-sm text-[var(--s-text-muted)]">A larger lead story anchors the composition.</p></div>
    <div className="min-h-40 bg-[var(--s-background)] p-[var(--s-space-6)] text-sm text-[var(--s-text)]">Companion</div>
    <div className="bg-[var(--s-surface)] p-[var(--s-space-4)] text-sm text-[var(--s-text)]">Tokens</div>
    <div className="bg-[var(--s-surface)] p-[var(--s-space-4)] text-sm text-[var(--s-text)]">Presets</div>
    <div className="bg-[var(--s-surface)] p-[var(--s-space-4)] text-sm text-[var(--s-text)]">Components</div>
  </FeaturedGrid>
</ComponentPreview>`,
  "playbook/frosted-panel": String.raw`<ComponentPreview label="Frosted surface">
  <div className="relative w-full overflow-hidden border border-[var(--s-border)] bg-[var(--s-primary-muted)] p-[var(--s-space-8)]">
    <FrostedPanel edge="left" className="p-[var(--s-space-6)]">
      <p className="font-medium text-[var(--s-text)]">Context panel</p>
      <p className="mt-2 text-sm text-[var(--s-text-muted)]">The backdrop remains visible while content stays readable.</p>
    </FrostedPanel>
  </div>
</ComponentPreview>`,
  "playbook/gap-pixel-grid": String.raw`<ComponentPreview label="One-pixel grid">
  <GapPixelGrid columns={{ md: 3 }} className="w-full">
    {[
      ["01", "Tokens"],
      ["02", "Presets"],
      ["03", "Components"],
    ].map(([index, label]) => (
      <GapPixelCell key={index} className="p-[var(--s-space-6)]"><span className="font-mono text-xs text-[var(--s-text-muted)]">{index}</span><p className="mt-3 font-medium text-[var(--s-text)]">{label}</p></GapPixelCell>
    ))}
  </GapPixelGrid>
</ComponentPreview>`,
  "sections/blueprint-grid-section": String.raw`<ComponentPreview label="Blueprint section" vertical>
  <BlueprintGridSection
    className="!px-0 !py-[var(--s-section-padding-compact)]"
    label="System map"
    heading="From specification to interface"
    cards={[
      { title: "Token contract", subtitle: "One schema for every visual decision.", diagram: <FeatureMiniDiagram variant="layer-stack" size={72} />, specRows: [{ label: "FIELDS", value: "519" }], callouts: ["typed", "validated"] },
      { title: "Preset compiler", subtitle: "Complete identities with no missing values.", diagram: <FeatureMiniDiagram variant="hub-spoke" size={72} />, specRows: [{ label: "PRESETS", value: "46" }], callouts: ["portable", "live"] },
    ]}
  />
</ComponentPreview>`,
  "sections/feature-frame-section": String.raw`<ComponentPreview label="Feature frame section" vertical>
  <FeatureFrameSection
    className="!px-0 !py-[var(--s-section-padding-compact)]"
    label="Architecture"
    heading="One system, end to end"
    features={[
      { label: "CONSTRAINTS", headline: "Tokens control every visual property.", points: ["Complete schema", "Validated output"], diagram: <FeatureMiniDiagram variant="layer-stack" size={120} /> },
      { label: "COMPOSITION", headline: "Components inherit the active identity.", points: ["No local color drift", "Predictable interaction"], diagram: <FeatureMiniDiagram variant="hub-spoke" size={120} />, reversed: true },
    ]}
  />
</ComponentPreview>`,
};

let added = 0;
for (const [route, preview] of Object.entries(previews)) {
  const file = path.join(DOCS, `${route}.mdx`);
  const source = fs.readFileSync(file, "utf8");
  if (source.includes("<ComponentPreview")) continue;
  if (!IMPORT_PATTERN.test(source)) throw new Error(`Import section missing in ${route}`);
  fs.writeFileSync(file, source.replace(IMPORT_PATTERN, `$1\n## Preview\n\n${preview}\n\n`));
  added += 1;
  console.log(`added ${route}`);
}

console.log(`\nAdded ${added} category previews.`);
