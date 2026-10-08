import type { Metadata } from "next";
import { presetCatalog, getCatalogEntry } from "@sigil-ui/presets";
import PresetDetailPage from "./preset-detail-client";

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

  const title = `${entry.label} Preset`;
  const description = `${entry.description} Category: ${entry.category}. Mood: ${entry.mood}. Fonts: ${entry.fonts.display}, ${entry.fonts.body}.`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(entry.label)}&subtitle=${encodeURIComponent(entry.description)}&type=preset`;

  return {
    title,
    description,
    alternates: { canonical: `/presets/${name}` },
    openGraph: {
      title: `${entry.label} Preset — Sigil UI`,
      description,
      url: `https://sigil.kevinliu.studio/presets/${name}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@kevinliu",
      creator: "@kevinliu",
      title: `${entry.label} Preset — Sigil UI`,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
  };
}

export default function PresetPage() {
  return <PresetDetailPage />;
}
