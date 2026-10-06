import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConceptRenderer } from "@/components/concepts/loaders";
import { CONCEPTS, getConcept } from "@/lib/concepts/manifest";

export function generateStaticParams() {
  return CONCEPTS.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) return {};
  return {
    title: `${String(concept.index).padStart(2, "0")} — ${concept.title}`,
    description: concept.description,
    robots: { index: false, follow: false },
  };
}

export default async function ConceptPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ compare?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const concept = getConcept(slug);
  if (!concept) notFound();
  return <ConceptRenderer concept={concept} mode={query.compare === "1" ? "compare" : "detail"} />;
}
