"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";

const BRANDS = {
  github: "GitHub", react: "React", nextdotjs: "Next.js", typescript: "TypeScript",
  tailwindcss: "Tailwind CSS", npm: "npm", vercel: "Vercel", x: "X", linkedin: "LinkedIn",
} as const;

export type BrandName = keyof typeof BRANDS;
export interface BrandLogoProps extends HTMLAttributes<HTMLSpanElement> {
  name: BrandName;
  decorative?: boolean;
}

/** Original theSVG geometry, served locally and tinted by the active text token. */
export const BrandLogo = forwardRef<HTMLSpanElement, BrandLogoProps>(function BrandLogo(
  { name, decorative = true, className = "", style, ...props }, ref,
) {
  return <span ref={ref} data-brand-logo={name} className={`sigil-brand-logo ${className}`}
    role={decorative ? undefined : "img"} aria-label={decorative ? undefined : BRANDS[name]}
    aria-hidden={decorative || undefined}
    style={{ "--s-brand-source": `url("/brands/${name}.svg")`, ...style } as CSSProperties}
    {...props} />;
});
