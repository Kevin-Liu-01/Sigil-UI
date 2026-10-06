import { DocsCatalogBrowser } from "./docs-catalog-browser";
import { source } from "../lib/source";

const GROUPS = [
  { key: "core", label: "Core interface", description: "The essential controls and surfaces used across every product." },
  { key: "forms", label: "Forms & input", description: "Fields, selection controls, upload flows, and structured data entry." },
  { key: "feedback", label: "Feedback & status", description: "System state, progress, loading, notifications, and user feedback." },
  { key: "data", label: "Data display", description: "Tables, metrics, charts, lists, and dense information surfaces." },
  { key: "layout", label: "Layout & structure", description: "Token-aligned containers, grids, rails, spacing, and page shells." },
  { key: "navigation", label: "Navigation", description: "Wayfinding, application chrome, menus, and content navigation." },
  { key: "overlays", label: "Overlays", description: "Dialogs, menus, sheets, popovers, tours, and transient surfaces." },
  { key: "developer", label: "Developer & productivity", description: "Code, commands, shortcuts, tokens, and collaborative workflows." },
  { key: "marketing", label: "Marketing", description: "Product storytelling, pricing, social proof, and conversion blocks." },
  { key: "sections", label: "Page sections", description: "Complete, responsive page bands composed from the component system." },
  { key: "diagrams", label: "Diagrams & charts", description: "Technical explanations, data visualization, and system maps." },
  { key: "shapes", label: "Shapes & patterns", description: "Token-driven geometry, texture, and structural decoration." },
  { key: "spatial", label: "3D & spatial", description: "Isometric scenes, dimensional cards, and spatial interface objects." },
  { key: "motion", label: "Motion & effects", description: "Purposeful transitions, reveals, scroll behavior, and visual effects." },
] as const;

type GroupKey = (typeof GROUPS)[number]["key"];

const GROUP_BY_SECTION: Record<string, GroupKey> = {
  "3d": "spatial",
  animation: "motion",
  diagrams: "diagrams",
  effects: "motion",
  layout: "layout",
  marketing: "marketing",
  navigation: "navigation",
  overlays: "overlays",
  patterns: "shapes",
  sections: "sections",
  shapes: "shapes",
};

function slugSet(value: string) {
  return new Set(value.trim().split(/\s+/));
}

const FORMS = slugSet(`
  async-select autocomplete avatar-upload calendar checkbox checkbox-card checkbox-group color-field color-picker
  combobox combobox-field creatable-select currency-input date-picker date-range-field date-time-picker dual-range-slider
  editable field file-dropzone file-upload form image-upload input input-group input-otp label multi-select native-select
  number-field password-input phone-input radio-card radio-group range-slider rating-group search-input segmented-control
  segmented-tabs select shortcut-recorder signature-pad slider slider-field stepper-field switch switch-field tags-field
  tags-input textarea time-picker toggle toggle-group
`);

const FEEDBACK = slugSet(`
  alert badge banner-alert braille-spinner callout circular-progress empty error-state inline-alert loading-spinner loading-state
  notification notification-list online-indicator presence-avatar progress progress-steps skeleton skeleton-card skeleton-table
  spinner-overlay status-badge status-dot status-pill success-state timeline-progress toast-action toast-promise
`);

const DATA = slugSet(`
  bulk-actions carousel chart chart-container circular-progress column-visibility data-filters data-grid data-list
  data-list-item data-pagination data-table data-toolbar description-list empty-table key-value kpi leaderboard-table
  listbox meter metric-grid property-list spark-area spark-bar stat-card table tree-table tree-view trend virtual-list
`);

const DEVELOPER = slugSet(`
  accessible-icon activity-timeline audit-log changelog chat-message chat-thread clipboard code-block code-preview code-tabs
  copy-button copy-input direction hotkey-provider kbd keyboard-key message-composer prompt-input sigil-cursor terminal theme-swatch theme-switcher
  token-preview typography version-badge visually-hidden
`);

const NAVIGATION = slugSet(`
  anchor-nav app-header bottom-bar content-tabs dock masonry-grid media-card mega-menu mobile-nav page-header resource-card
  scroll-spy section-header sidebar-nav split-pane table-of-contents top-bar
`);

const LAYOUT = slugSet(`
  accordion aspect-ratio collapsible panel resizable-panel resizable-panel-group scroll-area separator tabs
`);

const MARKETING = slugSet(`feature-card pricing-card testimonial-carousel`);

const OVERLAYS = slugSet(`
  action-menu coachmark command-menu confirm-dialog context-panel floating-panel image-preview lightbox modal overflow-menu
  popover-form prompt-dialog responsive-dialog spotlight tooltip-group tour tour-step
`);

const SPATIAL = slugSet(`box-3d box3-d box3-d-grid card3-d exploded-box3-d floating-ui isometric-cylinder isometric-prism isometric-scene isometric-view`);

function resolveGroup(slug: string, canonical: Map<string, GroupKey>): GroupKey {
  const sectionGroup = canonical.get(slug);
  if (sectionGroup) return sectionGroup;
  if (FORMS.has(slug)) return "forms";
  if (FEEDBACK.has(slug)) return "feedback";
  if (DATA.has(slug)) return "data";
  if (DEVELOPER.has(slug)) return "developer";
  if (LAYOUT.has(slug)) return "layout";
  if (MARKETING.has(slug)) return "marketing";
  if (NAVIGATION.has(slug)) return "navigation";
  if (OVERLAYS.has(slug)) return "overlays";
  if (SPATIAL.has(slug)) return "spatial";
  return "core";
}

export function DocsComponentCatalog() {
  const pages = source.getPages();
  const canonical = new Map<string, GroupKey>();

  for (const page of pages) {
    const [section, slug] = page.slugs;
    const group = GROUP_BY_SECTION[section];
    if (group && slug && page.slugs.length === 2) canonical.set(slug, group);
  }

  const catalog = new Map<GroupKey, typeof pages>();
  for (const group of GROUPS) catalog.set(group.key, []);

  // Legacy aliases keep working as routes, but each component appears once.
  // Category-specific documentation takes precedence over the legacy folder.
  const catalogPagesByName = new Map<string, (typeof pages)[number]>();

  for (const page of pages) {
    if (page.slugs[0] === "components" && page.slugs.length === 2) {
      catalogPagesByName.set(page.data.title.toLocaleLowerCase(), page);
    }
  }

  for (const page of pages) {
    const [section, slug] = page.slugs;
    if (GROUP_BY_SECTION[section] && slug && page.slugs.length === 2) {
      catalogPagesByName.set(page.data.title.toLocaleLowerCase(), page);
    }
  }

  const catalogPages = Array.from(catalogPagesByName.values())
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  for (const page of catalogPages) {
    const sectionGroup = GROUP_BY_SECTION[page.slugs[0]];
    const slug = page.slugs[1];
    catalog.get(sectionGroup ?? resolveGroup(slug, canonical))?.push(page);
  }

  const populatedGroups = GROUPS.filter((group) => (catalog.get(group.key)?.length ?? 0) > 0);

  return (
    <section className="sigil-docs-catalog" aria-labelledby="component-catalog-title">
      <header className="sigil-docs-catalog-header">
        <div>
          <span className="sigil-docs-eyebrow">Complete component index</span>
          <h2 id="component-catalog-title">Every component. One place.</h2>
        </div>
        <p>
          {catalogPages.length} documented components across {populatedGroups.length} groups.
          Every entry opens a live, token-driven example with usage guidance.
        </p>
      </header>

      <DocsCatalogBrowser groups={populatedGroups.map((group) => ({
        ...group,
        pages: (catalog.get(group.key) ?? []).map((page) => ({
          title: page.data.title, description: page.data.description, url: page.url,
        })),
      }))} />
    </section>
  );
}
