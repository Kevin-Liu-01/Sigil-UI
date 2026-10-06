import { source } from "../../../lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import * as mdxComponents from "../../../components/mdx-components";
import { DocsMain } from "../../../components/docs-main";
import { DocsComponentCatalog } from "../../../components/docs-component-catalog";
import { DocsLanding } from "../../../components/docs-landing";
import { DocsPageHeader } from "../../../components/docs-page-header";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const isDocsLanding = !params.slug?.length;

  const MDX = page.data.body;
  const components = { ...defaultMdxComponents, ...mdxComponents } as any;

  return (
    <DocsPage
      breadcrumb={{ enabled: false }}
      toc={page.data.toc}
      full={page.data.full}
      slots={{ container: DocsMain }}
    >
      {isDocsLanding ? (
        <>
          <DocsTitle>{page.data.title}</DocsTitle>
          <DocsDescription>{page.data.description}</DocsDescription>
        </>
      ) : (
        <DocsPageHeader
          markdown={await page.data.getText("raw")}
          title={page.data.title}
          description={page.data.description}
          section={params.slug?.[0] ?? "guide"}
        />
      )}
      <DocsBody>
        {isDocsLanding ? (
          <DocsLanding catalog={<DocsComponentCatalog />}><MDX components={components} /></DocsLanding>
        ) : <MDX components={components} />}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const slug = params.slug?.join("/") ?? "";
  const ogImageUrl = `/api/og?title=${encodeURIComponent(page.data.title)}&type=docs`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: `/docs/${slug}` },
    openGraph: {
      title: `${page.data.title} — Sigil UI Docs`,
      description: page.data.description,
      url: `https://sigil-ui.com/docs/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: page.data.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@kevinliu",
      creator: "@kevinliu",
      title: `${page.data.title} — Sigil UI Docs`,
      description: page.data.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: page.data.title }],
    },
  };
}
