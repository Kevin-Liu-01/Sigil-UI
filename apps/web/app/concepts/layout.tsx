import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Site Redesign Concepts",
  description: "Twenty isolated homepage directions for reviewing the next Sigil UI site.",
  robots: { index: false, follow: false },
};

export default function ConceptsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
