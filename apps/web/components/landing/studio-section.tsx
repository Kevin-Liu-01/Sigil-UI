import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";
import { TabularValue } from "@sigil-ui/components";

/** The section owns its boundary; each cell owns only its internal padding. */
export function StudioSectionIntro({ heading, description, icon, className }: {
  heading: string;
  description: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <header className={twMerge(clsx("sigil-landing-section-intro", className))}>
      <h2>{icon}{heading}</h2>
      <p>{description}</p>
    </header>
  );
}

export function StudioCanvas({ label, meta, icon, children, className, contentClassName }: {
  label: string;
  meta?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={twMerge(clsx("sigil-landing-canvas", className))}>
      <div className="sigil-landing-canvas-bar">
        <span>{icon}{label}</span>
        {meta && <span>{meta}</span>}
      </div>
      <div className={twMerge(clsx("landing-studio-canvas min-w-0", contentClassName))}>{children}</div>
    </div>
  );
}

export function StudioMetricStrip({ items, className }: {
  items: Array<{ value: string; label: string; icon?: ReactNode }>;
  className?: string;
}) {
  return (
    <div className={twMerge(clsx("sigil-landing-metrics", className))}>
      {items.map((item) => (
        <div key={item.label}>
          {item.icon}
          <TabularValue className="font-semibold">{item.value}</TabularValue>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
