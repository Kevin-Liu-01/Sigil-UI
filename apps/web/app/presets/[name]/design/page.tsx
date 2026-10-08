import type { Metadata } from "next";
import { presetCatalog, getCatalogEntry } from "@sigil-ui/presets";
import PresetDesignClient from "./preset-design-client";

export function generateStaticParams() {
  return presetCatalog.map((p) => ({ name: p.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const entry = getCatalogEntry(name);
  if (!entry) return {};

  const title = `${entry.label} — DESIGN.md`;
  const description = `Complete DESIGN.md for the ${entry.label} preset. 500+ tokens across 33 categories, compilable to CSS and Tailwind v4.`;

  return {
    title,
    description,
    alternates: { canonical: `/presets/${name}/design` },
    openGraph: {
      title: `${entry.label} DESIGN.md — Sigil UI`,
      description,
      url: `https://sigil.kevinliu.studio/presets/${name}/design`,
    },
  };
}

export default function PresetDesignPage() {
  return <PresetDesignClient />;
}
