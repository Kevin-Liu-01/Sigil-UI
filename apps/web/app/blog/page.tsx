"use client";

import {
  SigilSection,
  Divider,
  GapPixelGrid,
  GapPixelCell,
  MonoLabel,
  TabularValue,
  DensityText,
  AccentCTA,
  CardCell,
  FeaturedGrid,
  BorderStack,
  Input,
  cn,
} from "@sigil-ui/components";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { SigilFrame } from "@/components/landing/sigil-frame";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
import { TextureBg } from "@/components/texture-bg";

const posts = [
  {
    date: "2026-04-22",
    title: "Introducing Sigil UI",
    category: "Launch",
    excerpt:
      `The token-driven design system that replaces scattered Tailwind overrides with a single source of truth. One file, ${SIGIL_PRODUCT_STATS.tokenCount} tokens, ${SIGIL_PRODUCT_STATS.presetCount} presets.`,
  },
  {
    date: "2026-04-20",
    title: "Why Presets Beat Themes",
    category: "Design",
    excerpt:
      "Traditional libraries give you components. Sigil gives you components plus a complete visual identity you can swap in one command.",
  },
  {
    date: "2026-04-18",
    title: "The Alignment Rail System",
    category: "Architecture",
    excerpt:
      "How margins, gutters, and content widths compose into a structural grid that adapts from mobile to ultrawide.",
  },
  {
    date: "2026-04-15",
    title: "Migrating from shadcn/ui",
    category: "Guide",
    excerpt:
      "A step-by-step guide to moving from shadcn/ui to Sigil. Keep your components, gain token control.",
  },
  {
    date: "2026-04-12",
    title: "Building with Agents",
    category: "AI",
    excerpt:
      "How AI agents use sigil.tokens.md as a contract. One file, deterministic visual output, no drift.",
  },
  {
    date: "2026-04-10",
    title: "The OKLCH Color System",
    category: "Design",
    excerpt:
      "Why we chose OKLCH for all 35 color tokens. Perceptual uniformity, P3 gamut, and predictable dark mode.",
  },
  {
    date: "2026-04-08",
    title: "Anatomy of a Preset",
    category: "Deep Dive",
    excerpt:
      "What goes into a preset's 519 tokens across 33 categories. From colors to motion to code block syntax highlighting.",
  },
  {
    date: "2026-04-05",
    title: "The Playbook Pattern",
    category: "Architecture",
    excerpt:
      "Ten compositional rules that make any page 'just work'. Gap-pixel grids, mono labels, border stacks, and density DNA.",
  },
];

const featured = posts.slice(0, 2);
const grid = posts.slice(2);

export default function BlogPage() {
  return (
    <SigilFrame>
      <BorderStack as="main">
        <LandingNavbar />

        {/* ── Hero ── */}
        <SigilSection borderTop className="relative overflow-hidden">
          <TextureBg opacity={0.3} />
          <div className="relative z-[1] flex flex-col gap-4 max-w-[640px]">
            <h1
              className={cn(
                "font-[family-name:var(--s-font-display)]",
                "text-[clamp(2rem,5vw,3.5rem)] font-[var(--s-heading-weight,700)]",
                "leading-[1.1] tracking-[var(--s-heading-tracking,-0.025em)]",
                "text-[var(--s-text)]",
              )}
            >
              Updates &amp; Thinking
            </h1>
            <DensityText role="body" as="p" muted>
              Technical writing, design decisions, and release notes from the
              Sigil UI team. How tokens, presets, and compositional rules produce
              consistent interfaces at any scale.
            </DensityText>
          </div>
        </SigilSection>

        <Divider pattern="vertical" size="md" showBorders />

        {/* ── Featured ── */}
        <SigilSection>
          <FeaturedGrid>
            {/* Primary featured card */}
            <GapPixelCell className="flex flex-col">
              <div
                className="h-1.5 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--s-primary), var(--s-primary-hover, var(--s-primary)))",
                }}
              />
              <div
                className="flex flex-1 flex-col justify-between gap-4"
                style={{ padding: "var(--s-card-padding, 24px)" }}
              >
                <div className="flex flex-col gap-3">
                  <MonoLabel variant="accent">{featured[0].category}</MonoLabel>
                  <DensityText
                    role="nav"
                    as="h2"
                    className="text-lg font-semibold leading-tight"
                  >
                    {featured[0].title}
                  </DensityText>
                  <DensityText role="body" as="p" muted>
                    {featured[0].excerpt}
                  </DensityText>
                </div>
                <TabularValue as="time" muted size="xs">
                  {featured[0].date}
                </TabularValue>
              </div>
            </GapPixelCell>

            {/* Secondary featured card */}
            <GapPixelCell className="flex flex-col">
              <div
                className="flex flex-1 flex-col justify-between gap-4"
                style={{ padding: "var(--s-card-padding, 24px)" }}
              >
                <div className="flex flex-col gap-3">
                  <MonoLabel variant="accent">{featured[1].category}</MonoLabel>
                  <DensityText
                    role="nav"
                    as="h2"
                    className="text-base font-semibold leading-tight"
                  >
                    {featured[1].title}
                  </DensityText>
                  <DensityText role="body" as="p" muted>
                    {featured[1].excerpt}
                  </DensityText>
                </div>
                <TabularValue as="time" muted size="xs">
                  {featured[1].date}
                </TabularValue>
              </div>
            </GapPixelCell>
          </FeaturedGrid>
        </SigilSection>

        <Divider pattern="diagonal" size="md" showBorders />

        {/* ── Post Grid ── */}
        <SigilSection>
          <GapPixelGrid columns={{ md: 3 }}>
            {grid.map((post) => (
              <GapPixelCell
                key={post.title}
                className="flex flex-col"
                style={{ padding: "var(--s-card-padding, 20px)" }}
              >
                <div className="flex flex-1 flex-col gap-3">
                  <MonoLabel variant="accent">{post.category}</MonoLabel>
                  <DensityText
                    role="nav"
                    as="h2"
                    className="font-semibold leading-tight"
                  >
                    {post.title}
                  </DensityText>
                  <DensityText role="body" as="p" muted>
                    {post.excerpt}
                  </DensityText>
                </div>
                <div
                  className="mt-4 border-t pt-3"
                  style={{ borderColor: "var(--s-border)" }}
                >
                  <TabularValue as="time" muted size="xs">
                    {post.date}
                  </TabularValue>
                </div>
              </GapPixelCell>
            ))}
          </GapPixelGrid>
        </SigilSection>

        <Divider pattern="vertical" size="md" showBorders />

        {/* ── Newsletter CTA ── */}
        <SigilSection>
          <div className="mx-auto flex max-w-[480px] flex-col items-center gap-4 text-center">
            <DensityText role="headline" as="h2">
              Stay in the loop.
            </DensityText>
            <DensityText role="body" as="p" muted>
              New presets, components, and design thinking — delivered when we
              ship, not on a schedule.
            </DensityText>
            <div className="flex w-full items-center gap-2 pt-2">
              <Input placeholder="you@company.com" className="flex-1" />
              <AccentCTA>Subscribe</AccentCTA>
            </div>
          </div>
        </SigilSection>

        <Divider pattern="diagonal" size="md" showBorders />

        <LandingFooter />
      </BorderStack>
    </SigilFrame>
  );
}
