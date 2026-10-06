"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@sigil-ui/components";

interface PaletteItem {
  label: string;
  href: string;
  section: string;
}

const DOC_ITEMS: PaletteItem[] = [
  // Guides
  { label: "DESIGN.md", href: "/docs/design-md", section: "Guides" },
  { label: "Installation", href: "/docs/installation", section: "Guides" },
  { label: "Theming", href: "/docs/theming", section: "Guides" },
  { label: "Presets", href: "/docs/presets", section: "Guides" },
  { label: "CLI", href: "/docs/cli", section: "Guides" },
  { label: "Alignment", href: "/docs/alignment", section: "Guides" },

  // Layout
  { label: "Stack", href: "/docs/layout/stack", section: "Layout" },
  { label: "Grid", href: "/docs/layout/grid", section: "Layout" },
  { label: "Section", href: "/docs/layout/section", section: "Layout" },
  { label: "Frame", href: "/docs/layout/frame", section: "Layout" },
  { label: "Page Grid", href: "/docs/layout/page-grid", section: "Layout" },
  { label: "Margin", href: "/docs/layout/margin", section: "Layout" },
  { label: "Gutter", href: "/docs/layout/gutter", section: "Layout" },
  { label: "Divider", href: "/docs/layout/divider", section: "Layout" },
  { label: "H Rule", href: "/docs/layout/h-rule", section: "Layout" },
  { label: "Voronoi Bento", href: "/docs/layout/voronoi-bento", section: "Layout" },
  { label: "Page Shell", href: "/docs/layout/page-shell", section: "Layout" },

  // Core UI
  { label: "Accordion", href: "/docs/components/accordion", section: "Components" },
  { label: "Alert", href: "/docs/components/alert", section: "Components" },
  { label: "Alert Dialog", href: "/docs/components/alert-dialog", section: "Components" },
  { label: "App Shell", href: "/docs/components/app-shell", section: "Components" },
  { label: "Aspect Ratio", href: "/docs/components/aspect-ratio", section: "Components" },
  { label: "Avatar", href: "/docs/components/avatar", section: "Components" },
  { label: "Badge", href: "/docs/components/badge", section: "Components" },
  { label: "Banner", href: "/docs/components/banner", section: "Components" },
  { label: "Box", href: "/docs/components/box", section: "Components" },
  { label: "Breadcrumb", href: "/docs/components/breadcrumb", section: "Components" },
  { label: "Button", href: "/docs/components/button", section: "Components" },
  { label: "Button Group", href: "/docs/components/button-group", section: "Components" },
  { label: "Calendar", href: "/docs/components/calendar", section: "Components" },
  { label: "Card", href: "/docs/components/card", section: "Components" },
  { label: "Carousel", href: "/docs/components/carousel", section: "Components" },
  { label: "Center", href: "/docs/components/center", section: "Components" },
  { label: "Chart", href: "/docs/components/chart", section: "Components" },
  { label: "Checkbox", href: "/docs/components/checkbox", section: "Components" },
  { label: "Checkbox Group", href: "/docs/components/checkbox-group", section: "Components" },
  { label: "Clipboard", href: "/docs/components/clipboard", section: "Components" },
  { label: "Code Block", href: "/docs/components/code-block", section: "Components" },
  { label: "Collapsible", href: "/docs/components/collapsible", section: "Components" },
  { label: "Color Picker", href: "/docs/components/color-picker", section: "Components" },
  { label: "Combobox", href: "/docs/components/combobox", section: "Components" },
  { label: "Command", href: "/docs/components/command", section: "Components" },
  { label: "Container", href: "/docs/components/container", section: "Components" },
  { label: "Context Menu", href: "/docs/components/context-menu", section: "Components" },
  { label: "Data Table", href: "/docs/components/data-table", section: "Components" },
  { label: "Date Picker", href: "/docs/components/date-picker", section: "Components" },
  { label: "Dialog", href: "/docs/components/dialog", section: "Components" },
  { label: "Direction", href: "/docs/components/direction", section: "Components" },
  { label: "Drawer", href: "/docs/components/drawer", section: "Components" },
  { label: "Dropdown Menu", href: "/docs/components/dropdown-menu", section: "Components" },
  { label: "Editable", href: "/docs/components/editable", section: "Components" },
  { label: "Empty", href: "/docs/components/empty", section: "Components" },
  { label: "Field", href: "/docs/components/field", section: "Components" },
  { label: "File Upload", href: "/docs/components/file-upload", section: "Components" },
  { label: "Flex", href: "/docs/components/flex", section: "Components" },
  { label: "Form", href: "/docs/components/form", section: "Components" },
  { label: "Header", href: "/docs/components/header", section: "Components" },
  { label: "Hover Card", href: "/docs/components/hover-card", section: "Components" },
  { label: "Input", href: "/docs/components/input", section: "Components" },
  { label: "Input Group", href: "/docs/components/input-group", section: "Components" },
  { label: "Input OTP", href: "/docs/components/input-otp", section: "Components" },
  { label: "Item", href: "/docs/components/item", section: "Components" },
  { label: "KBD", href: "/docs/components/kbd", section: "Components" },
  { label: "KPI", href: "/docs/components/kpi", section: "Components" },
  { label: "Label", href: "/docs/components/label", section: "Components" },
  { label: "Loading Spinner", href: "/docs/components/loading-spinner", section: "Components" },
  { label: "Menubar", href: "/docs/components/menubar", section: "Components" },
  { label: "Meter", href: "/docs/components/meter", section: "Components" },
  { label: "Native Select", href: "/docs/components/native-select", section: "Components" },
  { label: "Navigation Menu", href: "/docs/components/navigation-menu", section: "Components" },
  { label: "Number Field", href: "/docs/components/number-field", section: "Components" },
  { label: "Pagination", href: "/docs/components/pagination", section: "Components" },
  { label: "Popover", href: "/docs/components/popover", section: "Components" },
  { label: "Preview Card", href: "/docs/components/preview-card", section: "Components" },
  { label: "Progress", href: "/docs/components/progress", section: "Components" },
  { label: "Radio Group", href: "/docs/components/radio-group", section: "Components" },
  { label: "Rating Group", href: "/docs/components/rating-group", section: "Components" },
  { label: "Resizable Panel", href: "/docs/components/resizable-panel", section: "Components" },
  { label: "Scroll Area", href: "/docs/components/scroll-area", section: "Components" },
  { label: "Select", href: "/docs/components/select", section: "Components" },
  { label: "Separator", href: "/docs/components/separator", section: "Components" },
  { label: "Sheet", href: "/docs/components/sheet", section: "Components" },
  { label: "Sigil Cursor", href: "/docs/components/sigil-cursor", section: "Components" },
  { label: "Sidebar", href: "/docs/components/sidebar", section: "Components" },
  { label: "Signature Pad", href: "/docs/components/signature-pad", section: "Components" },
  { label: "Simple Grid", href: "/docs/components/simple-grid", section: "Components" },
  { label: "Skeleton", href: "/docs/components/skeleton", section: "Components" },
  { label: "Slider", href: "/docs/components/slider", section: "Components" },
  { label: "Sonner", href: "/docs/components/sonner", section: "Components" },
  { label: "Spacer", href: "/docs/components/spacer", section: "Components" },
  { label: "Split Button", href: "/docs/components/split-button", section: "Components" },
  { label: "Stepper", href: "/docs/components/stepper", section: "Components" },
  { label: "Switch", href: "/docs/components/switch", section: "Components" },
  { label: "Table", href: "/docs/components/table", section: "Components" },
  { label: "Tabs", href: "/docs/components/tabs", section: "Components" },
  { label: "Tags Input", href: "/docs/components/tags-input", section: "Components" },
  { label: "Terminal", href: "/docs/components/terminal", section: "Components" },
  { label: "Textarea", href: "/docs/components/textarea", section: "Components" },
  { label: "Toast", href: "/docs/components/toast", section: "Components" },
  { label: "Toggle", href: "/docs/components/toggle", section: "Components" },
  { label: "Toggle Group", href: "/docs/components/toggle-group", section: "Components" },
  { label: "Toolbar", href: "/docs/components/toolbar", section: "Components" },
  { label: "Tooltip", href: "/docs/components/tooltip", section: "Components" },
  { label: "Tree View", href: "/docs/components/tree-view", section: "Components" },
  { label: "Typography", href: "/docs/components/typography", section: "Components" },
  { label: "Panel", href: "/docs/components/panel", section: "Components" },
  { label: "Braille Spinner", href: "/docs/components/braille-spinner", section: "Components" },
  { label: "Accessible Icon", href: "/docs/components/accessible-icon", section: "Components" },
  { label: "Visually Hidden", href: "/docs/components/visually-hidden", section: "Components" },
  { label: "Segmented Control", href: "/docs/components/segmented-control", section: "Components" },
  { label: "Circular Progress", href: "/docs/components/circular-progress", section: "Components" },
  { label: "Password Input", href: "/docs/components/password-input", section: "Components" },

  // Marketing
  { label: "Hero", href: "/docs/marketing/hero", section: "Marketing" },
  { label: "CTA", href: "/docs/marketing/cta", section: "Marketing" },
  { label: "Feature Frame", href: "/docs/marketing/feature-frame", section: "Marketing" },
  { label: "Logo Bar", href: "/docs/marketing/logo-bar", section: "Marketing" },
  { label: "Pricing", href: "/docs/marketing/pricing", section: "Marketing" },
  { label: "Testimonial Card", href: "/docs/marketing/testimonial-card", section: "Marketing" },
  { label: "Announcement Bar", href: "/docs/components/announcement-bar", section: "Marketing" },
  { label: "Cost Calculator", href: "/docs/components/cost-calculator", section: "Marketing" },

  // Sections
  { label: "Hero Section", href: "/docs/components/hero-section", section: "Sections" },
  { label: "Feature Section", href: "/docs/components/feature-section", section: "Sections" },
  { label: "Feature Showcase Section", href: "/docs/components/feature-showcase-section", section: "Sections" },
  { label: "CTA Section", href: "/docs/components/cta-section", section: "Sections" },
  { label: "FAQ Section", href: "/docs/components/faq-section", section: "Sections" },
  { label: "Stats Section", href: "/docs/components/stats-section", section: "Sections" },
  { label: "Bento Section", href: "/docs/components/bento-section", section: "Sections" },
  { label: "Code Showcase Section", href: "/docs/components/code-showcase-section", section: "Sections" },
  { label: "Comparison Section", href: "/docs/components/comparison-section", section: "Sections" },
  { label: "Footer Section", href: "/docs/components/footer-section", section: "Sections" },
  { label: "Install Section", href: "/docs/components/install-section", section: "Sections" },
  { label: "Newsletter Section", href: "/docs/components/newsletter-section", section: "Sections" },
  { label: "Team Section", href: "/docs/components/team-section", section: "Sections" },
  { label: "Timeline Section", href: "/docs/components/timeline-section", section: "Sections" },
  { label: "Testimonials Section", href: "/docs/components/testimonials-section", section: "Sections" },
  { label: "Logo Cloud Section", href: "/docs/components/logo-cloud-section", section: "Sections" },
  { label: "Large Text Section", href: "/docs/components/large-text-section", section: "Sections" },
  { label: "Gradient Banner Section", href: "/docs/components/gradient-banner-section", section: "Sections" },

  // Diagrams
  { label: "Diagram", href: "/docs/diagrams/diagram", section: "Diagrams" },
  { label: "Flow Diagram", href: "/docs/diagrams/flow-diagram", section: "Diagrams" },
  { label: "Architecture Diagram", href: "/docs/diagrams/architecture-diagram", section: "Diagrams" },
  { label: "Timeline", href: "/docs/diagrams/timeline", section: "Diagrams" },
  { label: "Comparison Table", href: "/docs/diagrams/comparison-table", section: "Diagrams" },
  { label: "Exploded View", href: "/docs/diagrams/exploded-view", section: "Diagrams" },
  { label: "Globe Diagram", href: "/docs/components/globe-diagram", section: "Diagrams" },
  { label: "Hub Spoke Diagram", href: "/docs/components/hub-spoke-diagram", section: "Diagrams" },
  { label: "Orbit Diagram", href: "/docs/components/orbit-diagram", section: "Diagrams" },
  { label: "Pipeline Diagram", href: "/docs/components/pipeline-diagram", section: "Diagrams" },
  { label: "Sankey Diagram", href: "/docs/components/sankey-diagram", section: "Diagrams" },
  { label: "Stack Diagram", href: "/docs/components/stack-diagram", section: "Diagrams" },

  // Patterns & Shapes
  { label: "Pattern", href: "/docs/patterns/pattern", section: "Patterns" },
  { label: "Cross", href: "/docs/patterns/cross", section: "Patterns" },
  { label: "Tessellation", href: "/docs/patterns/tessellation", section: "Patterns" },
  { label: "Grain Gradient", href: "/docs/patterns/grain-gradient", section: "Patterns" },
  { label: "Shape", href: "/docs/shapes/shape", section: "Shapes" },
  { label: "Diamond", href: "/docs/shapes/diamond", section: "Shapes" },
  { label: "Hexagon", href: "/docs/shapes/hexagon", section: "Shapes" },
  { label: "Triangle", href: "/docs/shapes/triangle", section: "Shapes" },

  // 3D
  { label: "Box3D", href: "/docs/3d/box3d", section: "3D" },
  { label: "Card3D", href: "/docs/3d/card3d", section: "3D" },
  { label: "Floating UI", href: "/docs/3d/floating-ui", section: "3D" },
  { label: "Isometric View", href: "/docs/3d/isometric-view", section: "3D" },

  // Pages
  { label: "Sandbox", href: "/sandbox", section: "Pages" },
  { label: "Components", href: "/components", section: "Pages" },
  { label: "Presets", href: "/presets", section: "Pages" },
  { label: "Demos", href: "/demos", section: "Pages" },
];

export function DocSearchPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const isDocs = pathname === "/docs" || pathname.startsWith("/docs/");
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isDocs) return;
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDocs]);

  useEffect(() => {
    function onOpenRequest() {
      setIsOpen(true);
    }
    window.addEventListener("sigil:open-search", onOpenRequest);
    return () => window.removeEventListener("sigil:open-search", onOpenRequest);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    for (const item of DOC_ITEMS) {
      const existing = map.get(item.section);
      if (existing) {
        existing.push(item);
      } else {
        map.set(item.section, [item]);
      }
    }
    return map;
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
      setIsOpen(false);
    },
    [router],
  );

  const handleHover = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router],
  );



  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput
        placeholder="Search docs, components, presets..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Array.from(grouped, ([section, sectionItems]) => (
          <CommandGroup heading={section} key={section}>
            {sectionItems.map((item) => (
              <CommandItem
                key={`${item.section}-${item.href}`}
                value={`${item.label} ${item.section}`}
                onSelect={() => handleSelect(item.href)}
                onMouseEnter={() => handleHover(item.href)}
                onFocus={() => handleHover(item.href)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0 text-[var(--s-text-muted)]"
                  aria-hidden
                >
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="min-w-0 truncate">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
