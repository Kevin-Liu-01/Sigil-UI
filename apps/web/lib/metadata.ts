import type { Metadata } from "next";

const SITE_URL = "https://sigil.kevinliu.studio";
const SITE_NAME = "Sigil UI";
const TWITTER_HANDLE = "@kevinliu";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogType?: "website" | "article";
  ogImageUrl?: string;
  keywords?: readonly string[];
};

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const canonical = input.path;
  const ogTitle = input.ogTitle ?? `${input.title} — ${SITE_NAME}`;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    ...(input.keywords ? { keywords: [...input.keywords] } : {}),
    openGraph: {
      title: ogTitle,
      description: input.description,
      url: `${SITE_URL}${input.path}`,
      type: input.ogType ?? "website",
      siteName: SITE_NAME,
      locale: "en_US",
      ...(input.ogImageUrl
        ? {
            images: [
              {
                url: input.ogImageUrl,
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: ogTitle,
      description: input.description,
      ...(input.ogImageUrl
        ? {
            images: [
              {
                url: input.ogImageUrl,
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ],
          }
        : {}),
    },
  };
}
