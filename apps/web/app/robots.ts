import type { MetadataRoute } from "next";

const BASE_URL = "https://sigil-ui.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
      },
      {
        userAgent: "Bytespider",
        allow: ["/"],
      },
      {
        userAgent: "cohere-ai",
        allow: ["/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/"],
      },
      {
        userAgent: "Twitterbot",
        allow: ["/", "/api/og", "/api/og-home"],
      },
    ],
    sitemap: [`${BASE_URL}/sitemap.xml`],
    host: BASE_URL,
  };
}
