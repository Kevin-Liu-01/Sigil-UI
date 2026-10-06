"use client";

import { useEffect, useRef, useState } from "react";
import { CommitGrid } from "@sigil-ui/components";

/** Keep activity squares readable as the surrounding hero changes width. */
export function HeroActivity({ data, accent }: { data: { date: string; count: number }[]; accent: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [weeks, setWeeks] = useState(12);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const square = parseFloat(getComputedStyle(element).fontSize) * 1.25;
      const columns = Math.round((entry.contentRect.width + 2) / (square + 2));
      setWeeks(Math.max(4, Math.min(16, columns)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="sigil-hero-activity-grid">
      <CommitGrid data={data} weeks={weeks} responsive gap={2} showDayLabels={false} showMonthLabels={false}
        color={accent ? "var(--s-success)" : "var(--s-primary)"} />
    </div>
  );
}
