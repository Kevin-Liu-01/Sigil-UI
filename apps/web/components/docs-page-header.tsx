import { BrandLogo } from "./brand-logo";
import { Box } from "./icons";
import { DocsPageActions } from "./docs-page-actions";

interface DocsPageHeaderProps {
  title: string;
  description?: string;
  section: string;
  markdown: string;
}

const SECTION_LABELS: Record<string, string> = {
  "3d": "3D & spatial",
  animation: "Motion",
  components: "Component",
  diagrams: "Diagram",
  effects: "Effect",
  layout: "Layout",
  marketing: "Marketing",
  navigation: "Navigation",
  overlays: "Overlay",
  patterns: "Pattern",
  playbook: "Playbook",
  sections: "Section",
  shapes: "Shape",
};

function formatTitle(value: string) {
  if (value.length <= 3) return value;
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")
    .replace(/\b3 D\b/g, "3D");
}

export function DocsPageHeader({ title, description, section, markdown }: DocsPageHeaderProps) {
  const displayTitle = formatTitle(title);
  const sectionLabel = SECTION_LABELS[section] ?? "Guide";

  return (
    <header className="sigil-docs-detail-header">
      <div className="sigil-docs-detail-copy">
        <h1>{displayTitle}</h1>
        {description && <p>{description}</p>}
        {sectionLabel !== "Guide" && <div className="sigil-docs-detail-tags" aria-label="Component metadata">
          <span><Box />@sigil-ui/components</span>
          <span><BrandLogo name="react" />React</span>
        </div>}
      </div>
      <DocsPageActions title={displayTitle} markdown={markdown} />
    </header>
  );
}
