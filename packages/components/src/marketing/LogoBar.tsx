"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils";

export type LogoBarItem = {
  src: string;
  alt: string;
  /** Render a single-color SVG using the current text token. */
  monochrome?: boolean;
};

export type LogoBarProps = HTMLAttributes<HTMLDivElement> & {
  /** Logo images to display. */
  logos: LogoBarItem[];
};

/** Logo/brand showcase bar — typically used for social proof. */
export const LogoBar = forwardRef<HTMLDivElement, LogoBarProps>(function LogoBar(
  { logos, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="logo-bar"
      className={cn(
        "flex flex-wrap items-center justify-center gap-8 md:gap-12 py-8 px-6",
        "opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-[var(--s-duration-normal,250ms)]",
        className,
      )}
      {...rest}
    >
      {(logos ?? []).map((logo) => (
        logo.monochrome ? <span key={logo.src} role="img" aria-label={logo.alt}
          className="block h-[var(--s-control-hit-area)] w-[var(--s-control-hit-area)] shrink-0 bg-[var(--s-text)]"
          style={{ maskImage: `url("${logo.src}")`, maskSize: "contain", maskPosition: "center", maskRepeat: "no-repeat" }} /> : <img
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          className="h-10 md:h-12 w-auto object-contain"
          loading="lazy"
        />
      ))}
    </div>
  );
});
