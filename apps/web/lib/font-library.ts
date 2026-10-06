export type FontLibraryEntry = {
  readonly name: string;
  readonly family: string;
  readonly source: string;
  readonly availability: "web" | "licensed-local";
};

export const FONT_LIBRARY: readonly FontLibraryEntry[] = [
  { name: "Inter", family: "InterVariable", source: "rsms / Rasmus Andersson", availability: "web" },
  { name: "Switzer", family: "Switzer", source: "Fontshare", availability: "web" },
  { name: "Schibsted Grotesk", family: "Schibsted Grotesk", source: "Google Fonts", availability: "web" },
  { name: "Outfit", family: "Outfit", source: "Google Fonts", availability: "web" },
  { name: "Haffer Trial", family: "Haffer Trial", source: "Displaay", availability: "licensed-local" },
  { name: "Louize Display", family: "Louize Display", source: "205TF", availability: "licensed-local" },
  { name: "Sora", family: "Sora", source: "Google Fonts", availability: "web" },
] as const;

export const CURATED_DISPLAY_FONTS = [
  ...FONT_LIBRARY.map((font) => font.family),
  "ABC Monument Grotesk",
  "PP Neue Montreal",
  "PP Mori",
  "Nacelle",
  "Vulf Sans",
  "PP Editorial New",
  "PP Eiko",
  "PP Hatton",
  "PP Monument Extended",
  "PP Neue Machina",
] as const;
