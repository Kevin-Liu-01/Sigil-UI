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
  FeaturedGrid,
  Badge,
} from "@sigil-ui/components";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { SigilFrame } from "@/components/landing/sigil-frame";
import { TextureBg } from "@/components/texture-bg";

const DEMOS = [
  { num: "01", name: "AI SaaS Landing", slug: "ai-saas", preset: "sigil", description: "Modern AI product landing with gradient hero, feature grid, and pricing tiers.", color: "#9b99e8" },
  { num: "02", name: "Dashboard", slug: "dashboard", preset: "cobalt", description: "Analytics dashboard with KPIs, charts, sidebar navigation, and data tables.", color: "#3b82f6" },
  { num: "03", name: "E-commerce", slug: "ecommerce", preset: "kova", description: "Product catalog with filters, cart, checkout flow, and order tracking.", color: "#60a5fa" },
  { num: "04", name: "Developer Docs", slug: "dev-docs", preset: "etch", description: "Documentation site with sidebar nav, code blocks, and API reference.", color: "#92400e" },
  { num: "05", name: "Startup", slug: "startup", preset: "flux", description: "Startup landing page with hero, testimonials, and CTA sections.", color: "#ec4899" },
  { num: "06", name: "Portfolio", slug: "portfolio", preset: "noir", description: "Creative portfolio with project grid, about section, and contact form.", color: "#d97706" },
  { num: "07", name: "Blog", slug: "blog", preset: "strata", description: "Editorial blog with article grid, categories, and reading progress.", color: "#0f766e" },
  { num: "08", name: "Agency", slug: "agency", preset: "onyx", description: "Agency site with case studies, team section, and service offerings.", color: "#f97316" },
  { num: "09", name: "CLI Tool", slug: "cli-tool", preset: "cipher", description: "Developer tool landing with terminal demo, installation guide, and API docs.", color: "#22c55e" },
  { num: "10", name: "Playground", slug: "playground", preset: "dsgn", description: "Interactive sandbox with drag-and-drop canvas and live code editing.", color: "#06b6d4" },
  { num: "11", name: "Linear Clone", slug: "linear-clone", preset: "onyx", description: "Dark B2B SaaS landing inspired by Linear. Hero, logo cloud, bento grid, and cinematic CTA.", color: "#f97316" },
  { num: "12", name: "Vercel Clone", slug: "vercel-clone", preset: "crux", description: "Developer platform marketing inspired by Vercel. Clean hero, feature rows, stats.", color: "#171717" },
  { num: "13", name: "Dedalus Clone", slug: "dedalus-clone", preset: "basalt", description: "Dark developer tool landing inspired by Dedalus. Purple accent, install command.", color: "#a78bfa" },
  { num: "14", name: "VoidZero Clone", slug: "voidzero-clone", preset: "prism", description: "Open source tooling site inspired by VoidZero. Gradient banner, accent headlines.", color: "#8b5cf6" },
  { num: "15", name: "Oxide Clone", slug: "oxide-clone", preset: "forge", description: "Industrial hardware site inspired by Oxide. Green accent, terminal hero.", color: "#ea580c" },
  { num: "16", name: "Vite Clone", slug: "vite-clone", preset: "helix", description: "Build tool landing inspired by Vite. Tabbed install, logo cloud.", color: "#06b6d4" },
  { num: "17", name: "VitePlus Clone", slug: "viteplus-clone", preset: "arc", description: "Unified toolchain site inspired by VitePlus. Light theme, terminal demo.", color: "#7c3aed" },
];

const INFO_CARDS = [
  {
    label: "Built with Sigil",
    body: "Real components, not mockups. Every demo is a working app assembled from the same primitives you ship with.",
  },
  {
    label: "One preset each",
    body: "Each demo uses a different aesthetic preset — same components, completely different visual identity.",
  },
  {
    label: "Open source",
    body: "Every template is MIT licensed. Clone, customize, and deploy without restrictions.",
  },
];

function DemoCard({ demo }: { demo: (typeof DEMOS)[number] }) {
  return (
    <a href={`/demos/${demo.slug}`} className="no-underline text-inherit">
      <GapPixelCell className="group flex flex-col gap-3 p-5 transition-colors duration-[var(--s-duration-fast,150ms)] hover:bg-[var(--s-surface-elevated)]">
        <div
          className="w-full rounded-[2px]"
          style={{ height: 8, background: demo.color }}
        />

        <TabularValue size="lg" muted>
          {demo.num}
        </TabularValue>

        <DensityText role="nav" as="div" className="font-semibold">
          {demo.name}
        </DensityText>

        <DensityText role="body" as="p" muted className="m-0 leading-relaxed">
          {demo.description}
        </DensityText>

        <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: "1px solid var(--s-border-muted)" }}>
          <MonoLabel variant="accent" size="xs">
            {demo.preset}
          </MonoLabel>
          <TabularValue size="xs" muted>
            /demos/{demo.slug}
          </TabularValue>
        </div>
      </GapPixelCell>
    </a>
  );
}

function FeaturedCard({ demo }: { demo: (typeof DEMOS)[number] }) {
  return (
    <a href={`/demos/${demo.slug}`} className="no-underline text-inherit">
      <GapPixelCell className="group flex flex-col gap-4 p-8 transition-colors duration-[var(--s-duration-fast,150ms)] hover:bg-[var(--s-surface-elevated)] h-full">
        <div
          className="w-full rounded-[2px]"
          style={{ height: 12, background: `linear-gradient(135deg, ${demo.color}, ${demo.color}88)` }}
        />

        <TabularValue size="xl" muted>
          {demo.num}
        </TabularValue>

        <DensityText role="headline" as="h3" className="m-0">
          {demo.name}
        </DensityText>

        <DensityText role="body" as="p" muted className="m-0 leading-relaxed max-w-md">
          {demo.description}
        </DensityText>

        <div className="mt-auto pt-4">
          <Badge size="sm" variant="outline">
            {demo.preset}
          </Badge>
        </div>
      </GapPixelCell>
    </a>
  );
}

function SideCard({ demo }: { demo: (typeof DEMOS)[number] }) {
  return (
    <a href={`/demos/${demo.slug}`} className="no-underline text-inherit">
      <GapPixelCell className="group flex flex-col gap-3 p-6 transition-colors duration-[var(--s-duration-fast,150ms)] hover:bg-[var(--s-surface-elevated)] h-full">
        <div
          className="w-full rounded-[2px]"
          style={{ height: 8, background: demo.color }}
        />

        <TabularValue size="lg" muted>
          {demo.num}
        </TabularValue>

        <DensityText role="nav" as="h3" className="font-semibold m-0">
          {demo.name}
        </DensityText>

        <DensityText role="body" as="p" muted className="m-0 leading-relaxed">
          {demo.description}
        </DensityText>

        <div className="mt-auto pt-3">
          <Badge size="sm" variant="outline">
            {demo.preset}
          </Badge>
        </div>
      </GapPixelCell>
    </a>
  );
}

export default function DemosPage() {
  const [featured, side, ...remaining] = DEMOS;

  return (
    <SigilFrame>
      <LandingNavbar />

      {/* Hero */}
      <SigilSection borderTop space="hero" className="relative overflow-hidden">
        <TextureBg opacity={0.3} />
        <div className="relative z-[1] mb-6">

          <h1 className="font-[family-name:var(--s-font-display)] font-bold text-[clamp(32px,5vw,56px)] leading-[1.08] tracking-[-0.03em] text-[var(--s-text)] mb-4 max-w-3xl">
            17 Production Templates.
          </h1>

          <DensityText role="body" as="p" muted className="max-w-[528px] leading-relaxed m-0">
            Real sites built with Sigil. Each uses a different preset and
            demonstrates how token-driven components adapt to any visual identity.
          </DensityText>
        </div>
      </SigilSection>

      <Divider pattern="vertical" size="md" showBorders />

      {/* Featured demos */}
      <SigilSection>
        <FeaturedGrid featuredRatio="2fr" columns={3} data-stagger>
          <FeaturedCard demo={featured} />
          <SideCard demo={side} />
          {remaining.map((demo) => (
            <DemoCard key={demo.slug} demo={demo} />
          ))}
        </FeaturedGrid>
      </SigilSection>

      <Divider pattern="diagonal" size="md" showBorders />

      {/* Info + CTA */}
      <SigilSection space="normal">
        <GapPixelGrid columns={{ md: 2 }} data-stagger>
          <GapPixelCell className="p-6 flex flex-col gap-3 md:row-span-2">
            <MonoLabel variant="accent">{INFO_CARDS[0].label}</MonoLabel>
            <DensityText role="body" as="p" muted className="m-0 leading-relaxed">
              {INFO_CARDS[0].body}
            </DensityText>
          </GapPixelCell>
          {INFO_CARDS.slice(1).map((card) => (
            <GapPixelCell key={card.label} className="p-6 flex flex-col gap-3">
              <MonoLabel variant="accent">{card.label}</MonoLabel>
              <DensityText role="body" as="p" muted className="m-0 leading-relaxed">
                {card.body}
              </DensityText>
            </GapPixelCell>
          ))}
        </GapPixelGrid>

        <div className="flex justify-center mt-12">
          <AccentCTA size="lg" asChild>
            <a href="/docs">Get Started with Sigil</a>
          </AccentCTA>
        </div>
      </SigilSection>

      <Divider pattern="vertical" size="md" showBorders />

      <LandingFooter />
    </SigilFrame>
  );
}
