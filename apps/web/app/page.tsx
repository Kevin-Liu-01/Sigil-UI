import Link from "next/link";
import { ArrowUpRight, BookOpen, Box, Code, FileText, LayoutGrid, Monitor, Palette, Paintbrush, Rocket, ShieldCheck, SlidersHorizontal, Terminal } from "@/components/icons";
import {
  AccentCTA, DensityText, GapPixelCell, GapPixelGrid,
  SigilActionRow, SigilGhostLink, SigilHero, SigilHeroContent,
  SigilHeroDescription, SigilHeroTitle,
  SigilSection, SigilStack,
} from "@sigil-ui/components";
import { HeroShowcase } from "@/components/landing/hero-showcase";
import { HeroLogoField } from "@/components/landing/hero-logo-field";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { SigilFrame } from "@/components/landing/sigil-frame";
import { DesignSpecPreview } from "@/components/landing/design-spec-preview";
import { PresetExplorer } from "@/components/landing/preset-explorer";
import { InstallCommand } from "@/components/landing/install-command";
import { StudioCanvas, StudioMetricStrip, StudioSectionIntro } from "@/components/landing/studio-section";
import { SIGIL_PRODUCT_STATS as stats } from "@/lib/product-stats";

function Hero() {
  return (
    <SigilHero padding="0">
      <HeroLogoField intro={
        <SigilHeroContent className="sigil-landing-hero-copy">
          <SigilHeroTitle>One file.<br />Every detail.</SigilHeroTitle>
          <SigilHeroDescription>
            Your design system, written in markdown. Edit colors, type, spacing, and motion in DESIGN.md.
            Every component follows.
          </SigilHeroDescription>
          <SigilActionRow>
            <AccentCTA asChild><Link href="/docs/installation"><Rocket />Start building</Link></AccentCTA>
            <SigilGhostLink href="/docs#component-catalog-title"><Box />Explore components</SigilGhostLink>
          </SigilActionRow>
          <InstallCommand />
        </SigilHeroContent>
      } />
    </SigilHero>
  );
}

function ComponentsSection() {
  return (
    <SigilSection id="components" borderTop padding="0" className="landing-deferred-section sigil-landing-section">
      <StudioSectionIntro icon={<Box />} heading="Choose your building blocks."
        description="Try the forms, tables, charts, and controls below. Each is a real React component. Open the docs for its code, props, and examples." />
      <HeroShowcase className="sigil-landing-gallery" />
      <SigilActionRow className="sigil-landing-section-actions">
        <AccentCTA asChild><Link href="/docs#component-catalog-title"><Box />Browse components</Link></AccentCTA>
        <SigilGhostLink href="/sandbox"><Code />Open the sandbox</SigilGhostLink>
      </SigilActionRow>
    </SigilSection>
  );
}

function DesignSection() {
  return (
    <SigilSection id="tokens" borderTop padding="0" className="landing-deferred-section sigil-landing-section">
      <StudioSectionIntro icon={<FileText />} heading="Change one file. Update every component."
        description={`Set colors, fonts, spacing, and motion in DESIGN.md. Compile the file once to update every component that uses those tokens.`} />
      <StudioCanvas icon={<SlidersHorizontal />} label="Try a token change" meta="Changes stay in this preview">
        <DesignSpecPreview />
      </StudioCanvas>
      <SigilActionRow className="sigil-landing-section-actions">
        <SigilGhostLink href="/docs/design-md"><BookOpen />Read the DESIGN.md guide</SigilGhostLink>
        <SigilGhostLink href="/docs/theming"><SlidersHorizontal />Explore all {stats.tokenCount} tokens</SigilGhostLink>
      </SigilActionRow>
    </SigilSection>
  );
}

function PresetsSection() {
  return (
    <SigilSection id="presets" borderTop padding="0" className="landing-deferred-section sigil-landing-section">
      <StudioSectionIntro icon={<Palette />} heading="Find your starting style."
        description={`Start with a preset, then adjust it to fit your product. Each defines colors, type, spacing, borders, and motion. Compare a few here, or use the bottom bar to change this entire site.`} />
      <StudioCanvas icon={<Palette />} label="Compare presets" meta="One form. Six styles.">
        <PresetExplorer />
      </StudioCanvas>
      <SigilActionRow className="sigil-landing-section-actions">
        <AccentCTA asChild><Link href="/presets"><Palette />Explore all {stats.presetCount} presets</Link></AccentCTA>
        <SigilGhostLink href="/docs/presets"><Paintbrush />Create your own preset</SigilGhostLink>
      </SigilActionRow>
    </SigilSection>
  );
}

const EXAMPLES = [
  { title: "Dashboard", detail: "Tables, charts, and navigation for a data-heavy app.", href: "/demos/dashboard", preset: "Application", icon: <Monitor /> },
  { title: "Portfolio", detail: "Project pages and editorial layouts for your work.", href: "/demos/portfolio", preset: "Personal site", icon: <BookOpen /> },
  { title: "All 17 demos", detail: "Explore SaaS, storefronts, docs, and more.", href: "/demos", preset: "Full collection", icon: <LayoutGrid /> },
];

function ExamplesSection() {
  return (
    <SigilSection id="demos" borderTop padding="0" className="landing-deferred-section sigil-landing-section">
      <StudioSectionIntro icon={<LayoutGrid />} heading="See how the pieces fit together."
        description="Explore complete pages built with Sigil. See how components, layouts, and presets work together before building your own." />
      <div className="sigil-landing-examples">
        {EXAMPLES.map((example) => (
          <Link key={example.href} href={example.href}>
            <span className="sigil-landing-example-label">{example.icon}{example.preset}</span>
            <h3>{example.title}<ArrowUpRight /></h3>
            <p>{example.detail}</p>
          </Link>
        ))}
      </div>
    </SigilSection>
  );
}

function StartSection() {
  return (
    <SigilSection id="quick-start" borderTop padding="0" className="landing-deferred-section sigil-landing-section">
      <StudioSectionIntro icon={<Terminal />} heading="Add Sigil to your app."
        description="Start a new Next.js project or set up Sigil in an existing app. Both paths connect your components to a shared set of design tokens." />
      <GapPixelGrid columns={{ md: 2 }}>
        <GapPixelCell className="sigil-landing-start-cell">
          <SigilStack gap="md">
            <span className="sigil-landing-example-label"><Rocket />New project</span>
            <DensityText role="headline" as="h3">Create a new app.</DensityText>
            <DensityText role="body" as="p" muted>Create a Next.js app with Sigil components and tokens already connected.</DensityText>
            <InstallCommand />
            <SigilGhostLink href="/docs/installation"><BookOpen />Installation guide</SigilGhostLink>
          </SigilStack>
        </GapPixelCell>
        <GapPixelCell className="sigil-landing-start-cell">
          <SigilStack gap="md">
            <span className="sigil-landing-example-label"><Code />Existing project</span>
            <DensityText role="headline" as="h3">Use your existing app.</DensityText>
            <DensityText role="body" as="p" muted>Detect your framework and configure Sigil tokens, styles, and agent instructions.</DensityText>
            <InstallCommand command="npx @sigil-ui/cli@latest init" />
            <SigilGhostLink href="/docs/cli"><Terminal />Explore CLI commands</SigilGhostLink>
          </SigilStack>
        </GapPixelCell>
      </GapPixelGrid>
    </SigilSection>
  );
}

export default function LandingPage() {
  return (
    <SigilFrame study>
      <LandingNavbar />
      <Hero />
      <StudioMetricStrip items={[
        { value: stats.componentCountLabel, label: "React components", icon: <Box /> },
        { value: String(stats.presetCount), label: "Complete presets", icon: <Palette /> },
        { value: String(stats.tokenCount), label: "Design tokens", icon: <SlidersHorizontal /> },
        { value: "MIT", label: "Open source", icon: <ShieldCheck /> },
      ]} />
      <ComponentsSection />
      <DesignSection />
      <PresetsSection />
      <ExamplesSection />
      <StartSection />
      <LandingFooter />
    </SigilFrame>
  );
}
