"use client";

import { BrandLogo } from "@/components/brand-logo";

import { NavbarLogo } from "@/components/landing/hero-logo-field";
import { SIGIL_PRODUCT_STATS } from "@/lib/product-stats";
import { SigilSection } from "@sigil-ui/components";
import { BookOpen, Box, Building2, MessageSquare, Package } from "@/components/icons";

const FOOTER_COLS = [
  {
    group: "Product",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Components", href: "/docs#component-catalog-title" },
      { label: "Presets", href: "/presets" },
      { label: "Sandbox", href: "/sandbox" },
    ],
  },
  {
    group: "Packages",
    links: [
      { label: "@sigil-ui/components", href: "https://www.npmjs.com/package/@sigil-ui/components" },
      { label: "@sigil-ui/tokens", href: "https://www.npmjs.com/package/@sigil-ui/tokens" },
      { label: "@sigil-ui/presets", href: "https://www.npmjs.com/package/@sigil-ui/presets" },
      { label: "@sigil-ui/cli", href: "https://www.npmjs.com/package/@sigil-ui/cli" },
      { label: "create-sigil-app", href: "https://www.npmjs.com/package/create-sigil-app" },
      { label: "@sigil-ui/primitives", href: "https://www.npmjs.com/package/@sigil-ui/primitives" },
    ],
  },
  {
    group: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/Kevin-Liu-01/sigil-ui" },
      { label: "Report an issue", href: "https://github.com/Kevin-Liu-01/sigil-ui/issues" },
    ],
  },
  {
    group: "Resources",
    links: [
      { label: "Walkthrough", href: "/walkthrough" },
      { label: "Token guide", href: "/docs/theming" },
      { label: "Preset guide", href: "/docs/presets" },
      { label: "DESIGN.md", href: "/docs/design-md" },
    ],
  },
  {
    group: "Company",
    links: [
      { label: "Manifesto", href: "/manifesto" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "mailto:hello@sigil-ui.dev" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: <BrandLogo name="github" />, href: "https://github.com/Kevin-Liu-01/sigil-ui", label: "GitHub" },
  { icon: <BrandLogo name="x" />, href: "https://x.com/kevinliu_01", label: "X" },
  { icon: <BrandLogo name="linkedin" />, href: "https://linkedin.com/in/kevinliu01", label: "LinkedIn" },
];

const FOOTER_ICONS = { Product: <Box />, Packages: <Package />, Community: <MessageSquare />, Resources: <BookOpen />, Company: <Building2 /> };

export function LandingFooter({ fullBleed = false }: { fullBleed?: boolean }) {
  return (
    <SigilSection as="footer" borderTop padding="0" className={`sigil-landing-footer${fullBleed ? " sigil-landing-footer-wide" : ""}`}>
      <div className="sigil-landing-footer-grid">
        <div className="sigil-landing-footer-brand">
          <a href="/" aria-label="Sigil UI home" className="sigil-landing-footer-logo"><NavbarLogo /><span>Sigil UI</span></a>
          <p>One design spec. {SIGIL_PRODUCT_STATS.componentCountLabel} React components. A consistent starting point for your next app.</p>
          <div className="sigil-landing-footer-socials">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>{link.icon}</a>
            ))}
          </div>
        </div>
        {FOOTER_COLS.map((col) => (
          <nav key={col.group} aria-label={col.group}>
            <h3>{FOOTER_ICONS[col.group as keyof typeof FOOTER_ICONS]}{col.group}</h3>
            {col.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
          </nav>
        ))}
      </div>
      <div className="sigil-landing-footer-bottom">
        <span>&copy; 2026 Sigil UI. MIT License.</span>
        <span>Built by <a href="https://kevinliu.me">Kevin Liu</a></span>
      </div>
    </SigilSection>
  );
}
