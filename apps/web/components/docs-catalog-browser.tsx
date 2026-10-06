"use client";

import Link from "next/link";
import { useDeferredValue, useId, useState } from "react";
import { ArrowUpRight, Box, SlidersHorizontal, Bell, BarChart3, LayoutGrid, Compass, PanelsTopLeft, Code, Rocket, PanelTop, GitBranch, Circle, Sparkles, Search } from "@/components/icons";
import { Button, Input } from "@sigil-ui/components";

type CatalogGroup = {
  key: string;
  label: string;
  description: string;
  pages: Array<{ title: string; description?: string; url: string }>;
};

const GROUP_ICONS = {
  core: Box, forms: SlidersHorizontal, feedback: Bell, data: BarChart3,
  layout: LayoutGrid, navigation: Compass, overlays: PanelsTopLeft,
  developer: Code, marketing: Rocket, sections: PanelTop, diagrams: GitBranch,
  shapes: Circle, spatial: Box, motion: Sparkles,
};

function GroupIcon({ group }: { group: string }) {
  const Icon = GROUP_ICONS[group as keyof typeof GROUP_ICONS] ?? Box;
  return <Icon />;
}

/** Search the catalog without fetching hundreds of destination pages. */
export function DocsCatalogBrowser({ groups }: { groups: CatalogGroup[] }) {
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query.trim().toLocaleLowerCase());
  const inputId = useId();
  const filtered = groups.map((group) => ({
    ...group,
    pages: group.pages.filter((page) =>
      `${page.title} ${page.description ?? ""} ${group.label}`.toLocaleLowerCase().includes(search)),
  })).filter((group) => group.pages.length > 0);
  const count = filtered.reduce((total, group) => total + group.pages.length, 0);

  return (
    <>
      <div className="sigil-docs-catalog-search">
        <label htmlFor={inputId}><Search />Find a component</label>
        <div className="flex gap-[var(--s-space-8)]">
          <Input id={inputId} type="search" value={query} placeholder="Search by name, purpose, or group…"
            onChange={(event) => setQuery(event.target.value)} aria-controls="sigil-catalog-results" />
          {query && <Button type="button" variant="outline" onClick={() => setQuery("")}>Clear</Button>}
        </div>
        <p role="status">{count} {count === 1 ? "component" : "components"}{search ? ` matching “${query.trim()}”` : " to explore"}</p>
      </div>
      <nav className="sigil-docs-catalog-nav" aria-label="Component groups">
        {filtered.map((group) => (
          <a key={group.key} href={`#components-${group.key}`}><span><GroupIcon group={group.key} />{group.label}</span><strong>{group.pages.length}</strong></a>
        ))}
      </nav>
      <div className="sigil-docs-catalog-groups" id="sigil-catalog-results">
        {count === 0 && <p className="p-[var(--s-space-24)]">No components match your search. Try a name like “button” or a group like “forms”.</p>}
        {filtered.map((group) => (
          <section className="sigil-docs-catalog-group" id={`components-${group.key}`} key={group.key}
            aria-labelledby={`components-${group.key}-title`}>
            <header>
              <span><GroupIcon group={group.key} /></span>
              <div><h3 id={`components-${group.key}-title`}>{group.label}</h3><p>{group.description}</p></div>
              <strong>{group.pages.length}</strong>
            </header>
            <div className="sigil-docs-catalog-grid">
              {group.pages.map((page) => (
                <Link href={page.url} key={page.url} prefetch={false}>
                  <div><h4>{page.title}</h4><p>{page.description}</p></div><ArrowUpRight aria-hidden />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
