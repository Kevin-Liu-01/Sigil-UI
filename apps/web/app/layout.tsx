import "./global.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SigilShell } from "@/components/sigil-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { DocSearchPalette } from "@/components/doc-search-palette";
import {
  SIGIL_PRODUCT_SUMMARY,
  SIGIL_ONE_LINER,
  SIGIL_PRODUCT_STATS,
} from "@/lib/product-stats";

const siteDescription = `${SIGIL_ONE_LINER} ${SIGIL_PRODUCT_SUMMARY} — all styled through CSS custom properties. Switch presets and every component updates instantly.`;
const ogDescription = `One token file. ${SIGIL_PRODUCT_SUMMARY}. Switch presets and your entire UI updates — colors, fonts, spacing, radius, motion, everything.`;
const homeSocialImage = {
  url: "/api/og-home",
  width: 1200,
  height: 630,
  alt: "Sigil UI — one markdown file controls your entire design system",
};

export const metadata: Metadata = {
  title: {
    default: "Sigil UI — Token-Driven React Components",
    template: "%s — Sigil UI",
  },
  description: siteDescription,
  keywords: [
    "sigil ui",
    "design tokens",
    "react component library",
    "design system",
    "tailwind css",
    "css custom properties",
    "theming presets",
    "token-driven components",
    "base ui primitives",
    "open source ui",
  ],
  authors: [{ name: "Kevin Liu", url: "https://kevinliu.me" }],
  creator: "Kevin Liu",
  category: "technology",
  metadataBase: new URL("https://sigil-ui.com"),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sigil-ui.com",
    siteName: "Sigil UI",
    title: "Sigil UI — One Token File Controls Everything",
    description: ogDescription,
    images: [homeSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kevinliu",
    creator: "@kevinliu",
    title: "Sigil UI — One Token File Controls Everything",
    description: ogDescription,
    images: [homeSocialImage],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sigil-ui.com/#website",
      name: "Sigil UI",
      url: "https://sigil-ui.com",
      description: SIGIL_ONE_LINER,
      publisher: { "@id": "https://sigil-ui.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://sigil-ui.com/#organization",
      name: "Sigil UI",
      url: "https://sigil-ui.com",
      logo: "https://sigil-ui.com/logo.svg",
      description: `Open-source React component library with ${SIGIL_PRODUCT_SUMMARY}. One token file controls every color, font, radius, and animation.`,
      sameAs: [
        "https://github.com/Kevin-Liu-01/sigil-ui",
        "https://www.npmjs.com/org/sigil-ui",
        "https://x.com/kevinliu",
      ],
      founder: {
        "@type": "Person",
        name: "Kevin Liu",
        url: "https://kevinliu.me",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://sigil-ui.com/#app",
      name: "Sigil UI",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description: `${SIGIL_ONE_LINER} ${SIGIL_PRODUCT_SUMMARY}, all styled through CSS custom properties from a single token layer.`,
      url: "https://sigil-ui.com",
      author: { "@id": "https://sigil-ui.com/#organization" },
      license: "https://opensource.org/licenses/MIT",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        `${SIGIL_PRODUCT_STATS.tokenCount} configurable design tokens in one file`,
        `${SIGIL_PRODUCT_STATS.componentCountLabel} React components built on Radix + Base UI primitives`,
        `${SIGIL_PRODUCT_STATS.presetCount} curated presets that change every token at once`,
        "OKLCH color system with perceptual uniformity",
        "Token-driven theming via CSS custom properties",
        "CLI for project setup, preset switching, and component scaffolding",
        "Agent-readable token layer for AI-assisted development",
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/fonts/inter/InterVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/*
          Web families used by presets, the hero diagram, and the dock font lab.
          Licensed local-only families are declared separately in global.css.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700,800&amp;display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&amp;family=Outfit:wght@300..800&amp;family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&amp;family=Sora:wght@300..800&amp;family=Space+Grotesk:wght@500;700&amp;display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <SigilShell>
            {children}
            <DocSearchPalette />
          </SigilShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
