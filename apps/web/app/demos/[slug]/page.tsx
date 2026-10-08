import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import DemoPageClient, { DEMOS } from "./demo-page-client";

const SLUGS = Object.keys(DEMOS);

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const demo = DEMOS[slug];
  if (!demo) return {};

  const title = demo.title;
  const description = demo.description;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}&type=demo`;

  return {
    title,
    description,
    alternates: { canonical: `/demos/${slug}` },
    openGraph: {
      title: `${title} Demo — Sigil UI`,
      description,
      url: `https://sigil.kevinliu.studio/demos/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@kevinliu",
      creator: "@kevinliu",
      title: `${title} Demo — Sigil UI`,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let source = "";
  try {
    source = await readFile(
      path.join(process.cwd(), "app/demos/[slug]/templates", `${slug}.tsx`),
      "utf8",
    );
  } catch {
    source = "// Demo source is unavailable for this template.";
  }
  return <DemoPageClient slug={slug} source={source} />;
}
