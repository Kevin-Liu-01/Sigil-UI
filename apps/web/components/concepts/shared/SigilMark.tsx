import { cn } from "@sigil-ui/components";

export function SigilMark({ className }: { className?: string }) {
  return (
    <span
      aria-label="Sigil UI"
      className={cn(
        "grid size-8 grid-cols-2 border border-current p-1 text-[var(--s-primary)]",
        className,
      )}
    >
      <span className="border-b border-r border-current" />
      <span className="border-b border-current bg-current" />
      <span className="border-r border-current bg-current" />
      <span />
    </span>
  );
}
