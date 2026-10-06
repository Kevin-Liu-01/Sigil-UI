import { ConceptCompare } from "@/components/concepts/ConceptCompare";
import { CONCEPTS, getConcept } from "@/lib/concepts/manifest";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const query = await searchParams;
  const left = getConcept(query.a ?? "") ?? CONCEPTS[0];
  const right = getConcept(query.b ?? "") ?? CONCEPTS[1];
  return <ConceptCompare left={left} right={right} />;
}
