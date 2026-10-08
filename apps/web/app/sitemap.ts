import type { MetadataRoute } from "next";
import { source } from "../lib/source";
import { presetCatalog } from "@sigil-ui/presets";
import { DEMOS } from "./demos/[slug]/demo-page-client";

const BASE_URL = "https://sigil.kevinliu.studio";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

interface RouteConfig {
  priority: number;
  changeFrequency: ChangeFrequency;
}

const STATIC_ROUTES: Record<string, RouteConfig> = {
  "/": { priority: 1, changeFrequency: "weekly" },
  "/components": { priority: 0.9, changeFrequency: "weekly" },
  "/presets": { priority: 0.9, changeFrequency: "weekly" },
  "/docs": { priority: 0.9, changeFrequency: "daily" },
  "/demos": { priority: 0.8, changeFrequency: "weekly" },
  "/walkthrough": { priority: 0.8, changeFrequency: "monthly" },
  "/blog": { priority: 0.8, changeFrequency: "weekly" },
  "/about": { priority: 0.5, changeFrequency: "monthly" },
  "/manifesto": { priority: 0.5, changeFrequency: "monthly" },
};

const DEFAULT_CONFIG: RouteConfig = {
  priority: 0.5,
  changeFrequency: "monthly",
};

function entry(
  path: string,
  config?: Partial<RouteConfig>,
): MetadataRoute.Sitemap[number] {
  const resolved = { ...DEFAULT_CONFIG, ...config };
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: resolved.changeFrequency,
    priority: resolved.priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = Object.entries(STATIC_ROUTES).map(([path, config]) =>
    entry(path, config),
  );

  const presetEntries = presetCatalog.map((p) =>
    entry(`/presets/${p.name}`, { priority: 0.6, changeFrequency: "monthly" }),
  );

  const demoEntries = Object.keys(DEMOS).map((slug) =>
    entry(`/demos/${slug}`, { priority: 0.6, changeFrequency: "monthly" }),
  );

  const docPages = source.getPages();
  const docEntries = docPages.map((page) =>
    entry(`/docs/${page.slugs.join("/")}`, {
      priority: 0.7,
      changeFrequency: "weekly",
    }),
  );

  return [...staticEntries, ...presetEntries, ...demoEntries, ...docEntries];
}
