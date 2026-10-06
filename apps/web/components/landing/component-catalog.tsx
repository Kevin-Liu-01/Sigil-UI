"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { Button, Input, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Sidebar, SidebarContent, SidebarHeader, SidebarItem } from "@sigil-ui/components";
import { ArrowDown, ArrowUpRight, BarChart3, Bell, BookOpen, Box, Code, GitBranch, Globe, Grid3X3, Layers, LayoutGrid, MousePointerClick, PanelLeft, PanelsTopLeft, Rows3, Search, Sparkles, Square, TextCursorInput, Type, X } from "@/components/icons";

export type CatalogCell = {
  name: string;
  category: string;
  variants?: number;
  span?: number;
  render: () => ReactNode;
};

const CATEGORIES = [
  { value: "All", label: "All components", icon: LayoutGrid },
  { value: "UI", label: "Core interface", icon: MousePointerClick },
  { value: "Layout", label: "Layout", icon: PanelsTopLeft },
  { value: "Navigation", label: "Navigation", icon: PanelLeft },
  { value: "Overlays", label: "Overlays", icon: Layers },
  { value: "Data", label: "Data", icon: BarChart3 },
  { value: "Forms", label: "Forms", icon: TextCursorInput },
  { value: "Feedback", label: "Feedback", icon: Bell },
  { value: "Developer", label: "Developer", icon: Code },
  { value: "Marketing", label: "Marketing", icon: Globe },
  { value: "Sections", label: "Page sections", icon: Rows3 },
  { value: "Shapes", label: "Shapes", icon: Square },
  { value: "3D", label: "3D elements", icon: Box },
  { value: "Diagrams", label: "Diagrams", icon: GitBranch },
  { value: "Animation", label: "Animation", icon: Sparkles },
  { value: "Pretext", label: "Typography", icon: Type },
  { value: "Patterns", label: "Patterns", icon: Grid3X3 },
  { value: "Playbook", label: "Composition", icon: BookOpen },
] as const;

function CatalogCard({ cell, docsHref }: { cell: CatalogCell; docsHref: string | null }) {
  return (
    <article className="sigil-catalog-card" data-component-name={cell.name} data-wide={Boolean(cell.span && cell.span > 1)}>
      <div className="sigil-catalog-card-preview">{cell.render()}</div>
      <footer>
        <h4>{cell.name}</h4>
        {cell.variants && <span>{cell.variants} {cell.variants === 1 ? "variant" : "variants"}</span>}
        {docsHref && <a href={docsHref} aria-label={`${cell.name} docs`}><ArrowUpRight /></a>}
      </footer>
    </article>
  );
}

export function ComponentCatalog({ cells, getDocsHref }: { cells: CatalogCell[]; getDocsHref: (cell: CatalogCell) => string | null }) {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(24);
  const id = useId();
  const ordered = useMemo(() => CATEGORIES.flatMap(category => cells.filter(cell => cell.category === category.value)), [cells]);
  const matching = ordered.filter(cell => cell.name.toLowerCase().includes(query.trim().toLowerCase()));
  const filtered = matching.filter(cell => active === "All" || cell.category === active);
  const visible = filtered.slice(0, limit);
  const count = (category: string) => category === "All" ? matching.length : matching.filter(cell => cell.category === category).length;
  const selectCategory = (category: string) => { setActive(category); setLimit(24); };
  const reset = () => { setQuery(""); selectCategory("All"); };

  return (
    <div className="sigil-catalog">
      <Sidebar collapsible={false} className="sigil-catalog-sidebar" aria-label="Component categories">
        <SidebarHeader><LayoutGrid /><strong>Components</strong><span>{cells.length}</span></SidebarHeader>
        <SidebarContent>
          <ScrollArea type="auto" className="sigil-catalog-category-scroll">
            {CATEGORIES.map(({ value, label, icon: Icon }) => (
              <SidebarItem key={value} icon={<Icon />} active={active === value} aria-current={undefined} aria-pressed={active === value} aria-controls={`${id}-results`} onClick={() => selectCategory(value)}>
                <span>{label}</span><span className="sigil-catalog-category-count">{count(value)}</span>
              </SidebarItem>
            ))}
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
      <div className="sigil-catalog-main">
        <div className="sigil-catalog-tools">
          <div className="sigil-catalog-search">
            <label htmlFor={`${id}-search`}>Find a component</label>
            <Input id={`${id}-search`} type="search" placeholder="Search by name…" iconLeft={<Search />} value={query} onChange={event => { setQuery(event.target.value); setLimit(24); }} />
          </div>
          <div className="sigil-catalog-mobile-category">
            <label htmlFor={`${id}-category`}>Category</label>
            <Select value={active} onValueChange={selectCategory}>
              <SelectTrigger id={`${id}-category`}><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(({ value, label, icon: Icon }) => <SelectItem key={value} value={value}><span className="sigil-catalog-category-option"><Icon />{label}<span>{count(value)}</span></span></SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sigil-catalog-summary">
            <p role="status">Showing {visible.length} of {filtered.length} components</p>
            {(query || active !== "All") && <Button variant="ghost" size="sm" onClick={reset}><X />Clear filters</Button>}
          </div>
        </div>
        <div id={`${id}-results`} className="sigil-catalog-results">
          {CATEGORIES.filter(category => category.value !== "All").map(({ value, label, icon: Icon }) => {
            const group = visible.filter(cell => cell.category === value);
            if (!group.length) return null;
            return <section key={value} className="sigil-catalog-group" aria-label={label}>
              <h3><Icon />{label}<span>{count(value)}</span></h3>
              <div className="sigil-catalog-grid">{group.map(cell => <CatalogCard key={cell.name} cell={cell} docsHref={getDocsHref(cell)} />)}</div>
            </section>;
          })}
          {!filtered.length && <div className="sigil-catalog-empty"><Search /><h3>No matching components</h3><p>Try a different name or clear your filters to browse the library.</p><Button variant="outline" onClick={reset}>Clear filters</Button></div>}
          {visible.length < filtered.length && <div className="sigil-catalog-more"><Button variant="outline" onClick={() => setLimit(limit + 24)}><ArrowDown />Show {Math.min(24, filtered.length - visible.length)} more</Button></div>}
        </div>
      </div>
    </div>
  );
}
