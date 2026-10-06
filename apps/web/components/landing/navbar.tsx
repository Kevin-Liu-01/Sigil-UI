"use client";

import { BrandLogo } from "@/components/brand-logo";

import { useState, useEffect, useCallback, useRef, useId } from "react";
import { NavbarLogo } from "@/components/landing/hero-logo-field";
import { Star, PanelsTopLeft, Menu, X, Search, BookOpen, ArrowDown, ChevronDown, ChevronUp } from "@/components/icons";
import { SigilThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "Components", href: "/components" },
  { label: "Presets", href: "/presets" },
  { label: "Demos", href: "/demos" },
  { label: "Walkthrough", href: "/walkthrough" },
] as const;

function useGitHubStars(): number | null {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("sigil-gh-stars");
    if (cached) {
      setStars(parseInt(cached, 10));
      return;
    }

    fetch("https://api.github.com/repos/Kevin-Liu-01/sigil-ui", { headers: { Accept: "application/vnd.github.v3+json" } })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
          sessionStorage.setItem("sigil-gh-stars", String(data.stargazers_count));
        }
      })
      .catch(() => {});
  }, []);

  return stars;
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

export { LandingNavbar as Navbar };

export function LandingNavbar() {
  const stars = useGitHubStars();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled();
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setMobileOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [mobileOpen]);

  const openSearch = useCallback(() => {
    window.dispatchEvent(new Event("sigil:open-search"));
  }, []);

  const inner = (
    <div
      className="mx-auto flex items-center justify-between w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        maxWidth: "var(--s-content-max, 1200px)",
        paddingInline: "var(--s-navbar-padding-x, 24px)",
        height: "var(--s-navbar-height, var(--s-band-height, var(--s-grid-cell)))",
        boxSizing: "border-box",
        borderBottom: "var(--s-navbar-border, var(--s-border-thin, 1px) var(--s-border-style, solid))",
        borderBottomColor: "var(--s-grid-line-color, var(--s-border-muted))",
        // Chrome (translucent surface + backdrop blur) lives on the navbar
        // row only — NOT on the parent <header>. Otherwise the banner
        // wrapper below inherits the header surface and shows a wide
        // opaque strip when the banner is collapsed.
        background: "color-mix(in oklch, var(--s-background) 85%, transparent)",
        backdropFilter: "blur(var(--s-navbar-backdrop-blur, 16px)) saturate(1.5)",
        WebkitBackdropFilter: "blur(var(--s-navbar-backdrop-blur, 16px)) saturate(1.5)",
      }}
    >
      {/* ── Logo ── */}
      <a href="/" className="flex items-center gap-2.5 no-underline text-[var(--s-text)] shrink-0 group">
        <NavbarLogo />
        <span className="font-[family-name:var(--s-font-display)] font-bold text-[15px] tracking-[-0.03em] transition-colors duration-[var(--s-duration-fast,150ms)] group-hover:text-[var(--s-primary)]">
          sigil<span className="opacity-30 font-light">/</span>
          <span className="font-medium text-[13px]">UI</span>
        </span>
      </a>

      {/* ── Center: Nav Links ── */}
      <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-[var(--s-navbar-item-gap,4px)]">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="relative px-3 py-1.5 rounded-[var(--s-radius-sm,6px)] text-[13px] font-medium no-underline text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:bg-[color-mix(in_oklch,var(--s-text)_6%,transparent)] transition-all duration-[var(--s-duration-fast,150ms)]"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          type="button"
          aria-label="Search documentation"
          onClick={openSearch}
          className="hidden md:inline-flex items-center gap-2 h-8 pl-2.5 pr-2 rounded-[var(--s-radius-sm,6px)] border border-[var(--s-border)] border-[style:var(--s-border-style,solid)] bg-[var(--s-surface)] text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:border-[var(--s-border-strong)] cursor-pointer transition-all duration-[var(--s-duration-fast,150ms)]"
        >
          <Search size={13} className="shrink-0 opacity-60" />
          <span className="text-[12px] opacity-60 hidden lg:inline">Search</span>
          <kbd className="ml-1 font-[family-name:var(--s-font-mono)] text-[10px] leading-none px-1.5 py-0.5 rounded-[3px] border border-[var(--s-border)] bg-[var(--s-background)] opacity-50">
            {"\u2318K"}
          </kbd>
        </button>

        {/* Separator */}
        <div className="hidden md:block w-px h-4 bg-[var(--s-border)] mx-0.5" />

        {/* GitHub */}
        <a
          href="https://github.com/Kevin-Liu-01/sigil-ui"
          aria-label="Sigil UI on GitHub"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[var(--s-radius-sm,6px)] border border-[var(--s-border)] border-[style:var(--s-border-style,solid)] bg-[var(--s-surface)] no-underline text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:border-[var(--s-border-strong)] transition-all duration-[var(--s-duration-fast,150ms)]"
        >
          <BrandLogo name="github" />
          {stars !== null ? (
            <>
              <Star size={10} className="fill-current opacity-60" />
              <span className="font-[family-name:var(--s-font-mono)] text-[11px] font-semibold tabular-nums">
                {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
              </span>
            </>
          ) : (
            <span className="text-[length:var(--s-size-xs)]">GitHub</span>
          )}
        </a>

        {/* Theme toggle */}
        <SigilThemeToggle />

        {/* Docs */}
        <a
          href="/docs"
          className="hidden md:inline-flex items-center gap-1.5 h-8 px-3 rounded-[var(--s-radius-sm,6px)] border border-[var(--s-border)] border-[style:var(--s-border-style,solid)] bg-[var(--s-surface)] no-underline text-[12px] font-semibold tracking-[-0.01em] text-[var(--s-text)] hover:border-[var(--s-border-strong)] active:scale-[0.97] transition-all duration-[var(--s-duration-fast,150ms)]"
        >
          <BookOpen size={13} />
          Docs
        </a>

        {/* Sandbox CTA */}
        <a
          href="/sandbox"
          className="hidden md:inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[var(--s-radius-sm,6px)] bg-[var(--s-primary)] text-[var(--s-primary-contrast,#fff)] no-underline text-[12px] font-semibold tracking-[-0.01em] hover:brightness-110 active:scale-[0.97] transition-all duration-[var(--s-duration-fast,150ms)] shadow-[0_0_0_1px_color-mix(in_oklch,var(--s-primary)_50%,transparent),0_1px_3px_color-mix(in_oklch,var(--s-primary)_20%,transparent)]"
        >
          <PanelsTopLeft size={13} />
          Sandbox
        </a>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex lg:hidden items-center justify-center h-8 w-8 rounded-[var(--s-radius-sm,6px)] border border-[var(--s-border)] border-[style:var(--s-border-style,solid)] bg-[var(--s-surface)] text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:border-[var(--s-border-strong)] cursor-pointer transition-all duration-[var(--s-duration-fast,150ms)]"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          ref={menuButton}
          aria-controls={menuId}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <div className="relative w-4 h-4">
            <Menu
              size={16}
              className="absolute inset-0 transition-all duration-[var(--s-duration-normal,200ms)]"
              style={{
                opacity: mobileOpen ? 0 : 1,
                transform: mobileOpen ? "rotate(90deg) scale(0.5)" : "rotate(0) scale(1)",
              }}
            />
            <X
              size={16}
              className="absolute inset-0 transition-all duration-[var(--s-duration-normal,200ms)]"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0.5)",
              }}
            />
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <header
      ref={header}
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileOpen) {
          setMobileOpen(false);
          menuButton.current?.focus();
        }
      }}
      className="sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        // Header is a transparent structural wrapper. The visible chrome
        // (translucent surface + backdrop blur) lives on the navbar row
        // and the expanded banner so the wrapper around the collapsed
        // banner pill stays fully transparent.
        background: "transparent",
        boxShadow: scrolled
          ? "0 1px 3px color-mix(in oklch, var(--s-background) 30%, transparent), 0 4px 12px color-mix(in oklch, var(--s-background) 15%, transparent)"
          : "none",
      }}
    >
      {inner}
      <ReleaseBanner />
      {mobileOpen && <MobileMenu id={menuId} onNavigate={() => setMobileOpen(false)} stars={stars} />}
    </header>
  );
}

const BANNER_DISMISS_KEY = "sigil-v1-banner-dismissed";

const PACKAGES = [
  { label: "components", pkg: "@sigil-ui/components" },
  { label: "primitives", pkg: "@sigil-ui/primitives" },
  { label: "tokens", pkg: "@sigil-ui/tokens" },
  { label: "presets", pkg: "@sigil-ui/presets" },
  { label: "cli", pkg: "@sigil-ui/cli" },
  { label: "create-app", pkg: "create-sigil-app" },
] as const;

function formatDownloads(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

function useNpmDownloads(): Record<string, number> {
  const [downloads, setDownloads] = useState<Record<string, number>>({});

  useEffect(() => {
    const cached = sessionStorage.getItem("sigil-npm-downloads");
    if (cached) {
      try { setDownloads(JSON.parse(cached)); return; } catch {}
    }

    const results: Record<string, number> = {};
    Promise.allSettled(
      PACKAGES.map((p) =>
        fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(p.pkg)}`)
          .then((r) => r.json())
          .then((data) => {
            if (typeof data?.downloads === "number") results[p.pkg] = data.downloads;
          })
      )
    ).then(() => {
      setDownloads(results);
      sessionStorage.setItem("sigil-npm-downloads", JSON.stringify(results));
    });
  }, []);

  return downloads;
}

function ReleaseBanner() {
  const [mode, setMode] = useState<"hidden" | "expanded" | "collapsed">("hidden");
  const downloads = useNpmDownloads();

  useEffect(() => {
    const stored = localStorage.getItem(BANNER_DISMISS_KEY);
    setMode(stored ? "collapsed" : "expanded");
  }, []);

  if (mode === "hidden") return null;
  const collapsed = mode === "collapsed";

  const collapse = () => {
    setMode("collapsed");
    localStorage.setItem(BANNER_DISMISS_KEY, "collapsed");
  };
  const expand = () => {
    setMode("expanded");
    localStorage.removeItem(BANNER_DISMISS_KEY);
  };

  return (
    <div
      data-sigil-release-banner={mode}
      className="w-full flex items-start justify-center transition-[height] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        // Reserve a full structural band when expanded so the banner sits
        // on the grid rhythm. When collapsed, reserve ZERO vertical space
        // so page sections flow up to the navbar — the pill is absolute
        // and overhangs into the page below via overflow: visible.
        height: collapsed ? "0px" : "var(--s-band-height, var(--s-grid-cell))",
        overflow: collapsed ? "visible" : "hidden",
      }}
    >
      <div className="relative w-full h-[var(--s-band-height,var(--s-grid-cell))] flex items-center justify-center">
        {/* ── Expanded full banner ── */}
        <div
          aria-hidden={collapsed}
          className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? "translateY(-6px)" : "translateY(0)",
            pointerEvents: collapsed ? "none" : "auto",
          }}
        >
          <div
            className="relative flex items-center justify-center gap-2.5 text-[12px] font-medium border-b border-[var(--s-grid-line-color,var(--s-border-muted))] overflow-hidden w-full h-full"
            style={{
              maxWidth: "var(--s-content-max, 1200px)",
              paddingInline: "var(--s-navbar-padding-x, 24px)",
              boxSizing: "border-box",
              background:
                "linear-gradient(90deg, color-mix(in oklch, var(--s-primary) 6%, var(--s-background)), color-mix(in oklch, var(--s-primary) 10%, var(--s-background)), color-mix(in oklch, var(--s-primary) 6%, var(--s-background)))",
              color: "var(--s-text)",
            }}
          >
            <BrandLogo name="npm" />
            <span className="font-semibold text-[var(--s-text)]">Sigil UI packages</span>
            <span className="text-[var(--s-text-muted)] hidden sm:inline">on npm</span>

            <div className="hidden md:block w-px h-3.5 bg-[var(--s-border)] mx-0.5" />

            <div className="hidden md:flex items-center gap-1.5">
              {PACKAGES.map((pkg) => {
                const count = downloads[pkg.pkg];
                return (
                  <a
                    key={pkg.label}
                    href={`https://www.npmjs.com/package/${pkg.pkg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={collapsed ? -1 : 0}
                    className="group inline-flex items-center gap-1.5 h-[26px] pl-2.5 pr-2.5 rounded-[var(--s-radius-sm,6px)] border border-[var(--s-border)] border-[style:var(--s-border-style,solid)] bg-[var(--s-surface)] text-[11px] font-medium text-[var(--s-text)] no-underline hover:border-[var(--s-primary)] hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--s-primary)_25%,transparent)] transition-all duration-[var(--s-duration-fast,150ms)]"
                  >
                    <span className="font-[family-name:var(--s-font-mono)] tracking-[-0.02em]">{pkg.label}</span>
                    {count != null && (
                      <span className="inline-flex items-center gap-0.5 font-[family-name:var(--s-font-mono)] text-[10px] text-[var(--s-text-muted)] group-hover:text-[var(--s-primary)] tabular-nums transition-colors duration-[var(--s-duration-fast,150ms)]">
                        <ArrowDown size={8} className="opacity-50" />
                        {formatDownloads(count)}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={collapse}
              tabIndex={collapsed ? -1 : 0}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-6 w-6 rounded-[var(--s-radius-sm,4px)] text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:bg-[color-mix(in_oklch,var(--s-text)_8%,transparent)] cursor-pointer transition-colors duration-[var(--s-duration-fast,150ms)]"
              aria-label="Collapse banner"
            >
              <ChevronUp size={13} />
            </button>
          </div>
        </div>

        {/* ── Collapsed tab ── */}
        <button
          type="button"
          onClick={expand}
          aria-label="Expand release banner"
          aria-hidden={!collapsed}
          tabIndex={collapsed ? 0 : -1}
          className="absolute top-0 left-1/2 inline-flex items-center gap-1.5 h-[20px] pl-2 pr-1.5 no-underline cursor-pointer border border-t-0 border-[var(--s-grid-line-color,var(--s-border-muted))] border-[style:var(--s-border-style,solid)] text-[var(--s-text)] hover:brightness-[1.08] active:brightness-95 transition-[opacity,transform,filter,background] duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklch, var(--s-primary) 14%, var(--s-background)), color-mix(in oklch, var(--s-primary) 7%, var(--s-background)))",
            borderBottomLeftRadius: "var(--s-radius-sm, 6px)",
            borderBottomRightRadius: "var(--s-radius-sm, 6px)",
            transform: collapsed
              ? "translate(-50%, 0) scale(1)"
              : "translate(-50%, -8px) scale(0.9)",
            opacity: collapsed ? 1 : 0,
            pointerEvents: collapsed ? "auto" : "none",
          }}
        >
          <BrandLogo name="npm" />
          <span className="font-[family-name:var(--s-font-mono)] text-[10px] font-semibold tracking-[-0.01em] tabular-nums">
            Sigil on npm
          </span>
          <ChevronDown size={11} className="opacity-70" />
        </button>
      </div>
    </div>
  );
}

function MobileMenu({ id, onNavigate, stars }: { id: string; onNavigate: () => void; stars: number | null }) {
  return (
    <div
      id={id}
      role="navigation"
      aria-label="Mobile navigation"
      className="lg:hidden border-t border-[var(--s-border)] bg-[color-mix(in_oklch,var(--s-background)_95%,transparent)] backdrop-blur-xl"
      style={{
        animation: "navbar-mobile-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes navbar-mobile-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
      <div className="px-4 py-4 space-y-1" style={{ maxWidth: "var(--s-content-max, 1200px)", margin: "0 auto" }}>
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-[var(--s-radius-sm,6px)] px-3 py-2.5 text-[14px] font-medium text-[var(--s-text-muted)] no-underline hover:text-[var(--s-text)] hover:bg-[color-mix(in_oklch,var(--s-text)_6%,transparent)] transition-all duration-[var(--s-duration-fast,150ms)]"
            style={{
              animation: `navbar-mobile-in 250ms cubic-bezier(0.16, 1, 0.3, 1) ${50 + i * 30}ms both`,
            }}
          >
            {link.label}
          </a>
        ))}

        <div className="pt-2 mt-2 border-t border-[var(--s-border)] space-y-1">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new Event("sigil:open-search"));
              onNavigate();
            }}
            className="flex items-center gap-3 w-full rounded-[var(--s-radius-sm,6px)] px-3 py-2.5 text-[14px] font-medium text-[var(--s-text-muted)] bg-transparent border-0 cursor-pointer hover:text-[var(--s-text)] hover:bg-[color-mix(in_oklch,var(--s-text)_6%,transparent)] transition-all duration-[var(--s-duration-fast,150ms)]"
          >
            <Search size={14} className="opacity-50" />
            Search
          </button>

          <a
            href="https://github.com/Kevin-Liu-01/sigil-ui"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-[var(--s-radius-sm,6px)] px-3 py-2.5 text-[14px] font-medium text-[var(--s-text-muted)] no-underline hover:text-[var(--s-text)] hover:bg-[color-mix(in_oklch,var(--s-text)_6%,transparent)] transition-all duration-[var(--s-duration-fast,150ms)]"
          >
            <BrandLogo name="github" />
            <span>GitHub</span>
            {stars !== null && (
              <span className="ml-auto flex items-center gap-1 text-[var(--s-text-muted)]">
                <Star size={10} className="fill-current opacity-60" />
                <span className="font-[family-name:var(--s-font-mono)] text-[11px] tabular-nums">
                  {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
                </span>
              </span>
            )}
          </a>
        </div>

        <div className="pt-3 mt-2 border-t border-[var(--s-border)] flex gap-2">
          <a
            href="/docs"
            onClick={onNavigate}
            className="flex-1 flex items-center justify-center gap-2 rounded-[var(--s-radius-sm,6px)] border border-[var(--s-border)] border-[style:var(--s-border-style,solid)] px-4 py-2.5 text-[13px] font-semibold text-[var(--s-text)] no-underline transition-all duration-[var(--s-duration-fast,150ms)] active:scale-[0.98]"
          >
            <BookOpen size={14} />
            Docs
          </a>
          <a
            href="/sandbox"
            onClick={onNavigate}
            className="flex-1 flex items-center justify-center gap-2 rounded-[var(--s-radius-sm,6px)] bg-[var(--s-primary)] px-4 py-2.5 text-[13px] font-semibold text-[var(--s-primary-contrast,#fff)] no-underline shadow-[0_0_0_1px_color-mix(in_oklch,var(--s-primary)_50%,transparent),0_1px_3px_color-mix(in_oklch,var(--s-primary)_20%,transparent)] transition-all duration-[var(--s-duration-fast,150ms)] active:scale-[0.98]"
          >
            <PanelsTopLeft size={14} />
            Sandbox
          </a>
        </div>
      </div>
    </div>
  );
}
