import Link from "next/link";
import { AccentCTA, SigilActionRow, SigilGhostLink, SigilHero, SigilHeroContent, SigilHeroDescription, SigilHeroLayout, SigilHeroMedia, SigilHeroTitle, SigilSection } from "@sigil-ui/components";
import { BookOpen, Box, Code, Layers, Palette, SlidersHorizontal } from "@/components/icons";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { SigilFrame } from "@/components/landing/sigil-frame";
import { ComponentShowcase } from "@/components/landing/component-showcase";
import { ComponentSystemVisual } from "@/components/landing/component-system-visual";
import { DesignSpecPreview } from "@/components/landing/design-spec-preview";
import { StudioMetricStrip } from "@/components/landing/studio-section";
import { SIGIL_PRODUCT_STATS as stats } from "@/lib/product-stats";

export default function ComponentsPage() {
  return (
    <SigilFrame>
      <LandingNavbar />
      <SigilHero padding="0">
        <SigilHeroLayout className="sigil-catalog-hero">
          <SigilHeroContent className="sigil-landing-hero-copy">
            <SigilHeroTitle>Components,<br />ready to build with.</SigilHeroTitle>
            <SigilHeroDescription>Explore {stats.componentCountLabel} React components, from everyday controls to complete page sections. Try them here, then open the docs for code and examples.</SigilHeroDescription>
            <SigilActionRow>
              <AccentCTA asChild><a href="#component-browser"><Box />Browse components</a></AccentCTA>
              <SigilGhostLink href="/sandbox"><Code />Open sandbox</SigilGhostLink>
            </SigilActionRow>
          </SigilHeroContent>
          <SigilHeroMedia className="sigil-catalog-hero-visual"><ComponentSystemVisual /></SigilHeroMedia>
        </SigilHeroLayout>
      </SigilHero>
      <StudioMetricStrip items={[
        { value: stats.componentCountLabel, label: "React components", icon: <Box /> },
        { value: `${stats.primitiveCount}+`, label: "Headless primitives", icon: <Layers /> },
        { value: String(stats.tokenCount), label: "Design tokens", icon: <SlidersHorizontal /> },
        { value: String(stats.presetCount), label: "Presets", icon: <Palette /> },
      ]} />
      <SigilSection id="component-browser" padding="0" borderTop className="sigil-component-browser-section">
        <ComponentShowcase />
      </SigilSection>
      <SigilSection padding="0" borderTop className="sigil-landing-section">
        <header className="sigil-landing-section-intro">
          <h2><SlidersHorizontal />One change reaches every component.</h2>
          <p>Components read the same design tokens. Change a color, corner radius, or spacing value and see the result in this live example.</p>
        </header>
        <DesignSpecPreview />
        <SigilActionRow className="sigil-landing-section-actions">
          <AccentCTA asChild><Link href="/docs/installation"><BookOpen />Get started</Link></AccentCTA>
          <SigilGhostLink href="/docs/theming"><Palette />Explore design tokens</SigilGhostLink>
        </SigilActionRow>
      </SigilSection>
      <LandingFooter />
    </SigilFrame>
  );
}
