import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sigil UI",
    short_name: "Sigil",
    start_url: "/",
    description:
      "Token-driven component library. 350+ components, 519 tokens, 46 presets. Built for AI agents.",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#09090b",
    background_color: "#09090b",
    display: "standalone",
  };
}
