"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ComponentPreviewProps {
  children: ReactNode;
  vertical?: boolean;
  className?: string;
  label?: string;
}

/**
 * Renders a component preview block.
 *
 * Many Sigil components are built on Radix primitives (Dialog, DropdownMenu,
 * Popover, etc.) that use `useId` and portal-based open state. When MDX runs
 * those primitives during SSR, React 19 + Next.js can throw hydration
 * mismatches because the portal mount target and ARIA ids resolve differently
 * on the server. Rendering preview children only after mount sidesteps the
 * mismatch without breaking the published doc layout.
 */
export function ComponentPreview({
  children,
  vertical = false,
  className = "",
  label,
}: ComponentPreviewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="sigil-preview-wrapper not-prose">
      <div className="sigil-preview-toolbar">
        <span>{label ?? "Live preview"}</span>
        <strong><i aria-hidden /> Interactive</strong>
      </div>
      <div
        suppressHydrationWarning
        className={`sigil-preview ${vertical ? "sigil-preview-vertical" : ""} ${className}`}
      >
        {mounted ? (
          children
        ) : (
          // Reserve vertical rhythm so the page doesn't shift on hydration.
          <span aria-hidden className="opacity-0 select-none">·</span>
        )}
      </div>
    </div>
  );
}
