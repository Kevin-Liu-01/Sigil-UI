"use client";

import { Box, PanelsTopLeft } from "./icons";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@sigil-ui/components";

/** Keep component lookup immediately available alongside composed examples. */
export function DocsLanding({ catalog, children }: { catalog: ReactNode; children: ReactNode }) {
  return (
    <Tabs defaultValue="index">
      <TabsList aria-label="Explore the library">
        <TabsTrigger className="gap-[var(--s-space-8)]" value="index"><Box />Component index</TabsTrigger>
        <TabsTrigger className="gap-[var(--s-space-8)]" value="examples"><PanelsTopLeft />Live examples</TabsTrigger>
      </TabsList>
      <TabsContent value="index">{catalog}</TabsContent>
      <TabsContent value="examples">{children}</TabsContent>
    </Tabs>
  );
}
