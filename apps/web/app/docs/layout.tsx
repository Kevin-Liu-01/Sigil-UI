import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { source } from "../../lib/source";

function SigilLogo() {
  return (
    <div className="sigil-docs-logo-lockup">
      <svg
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="sigil-docs-logo"
        aria-hidden
      >
        <polygon
          points="0,0 56,0 56,32 40,40 40,56 0,56"
          fill="currentColor"
        />
        <polygon
          points="120,0 120,56 88,56 80,40 64,40 64,0"
          fill="currentColor"
        />
        <polygon
          points="0,120 0,64 32,64 40,80 56,80 56,120"
          fill="currentColor"
        />
        <polygon
          points="120,120 64,120 64,88 80,80 80,64 120,64"
          fill="var(--s-primary)"
        />
      </svg>
      <span className="sigil-docs-wordmark">
        sigil
        <span aria-hidden>/</span>
        <small>UI</small>
      </span>
    </div>
  );
}

function DocsSidebarBanner() {
  return (
    <div className="sigil-docs-sidebar-banner">
      <span>System reference</span>
      <strong>519 tokens · 33 categories</strong>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <DocsLayout
        tree={source.pageTree}
        githubUrl="https://github.com/Kevin-Liu-01/sigil-ui"
        containerProps={{ className: "sigil-docs-layout" }}
        nav={{
          title: <SigilLogo />,
          url: "/",
        }}
        sidebar={{
          defaultOpenLevel: 1,
          banner: <DocsSidebarBanner />,
          className: "sigil-docs-sidebar",
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
