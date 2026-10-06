"use client";

import { forwardRef, useRef, type ComponentPropsWithoutRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../utils";
import { useSigilSound } from "../sound-context";

export interface SliderProps
  extends ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  className?: string;
}

const thumbClasses = cn(
  "block size-4 border-2 border-[style:var(--s-border-style,solid)] border-[color:var(--s-primary)] bg-[var(--s-background)] shadow-[var(--s-shadow-sm)]",
  "rounded-[var(--s-radius-full,9999px)]",
  "transition-colors duration-[var(--s-duration-fast,150ms)]",
  "focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)] focus-visible:ring-offset-[var(--s-focus-ring-offset)]",
  "disabled:pointer-events-none disabled:opacity-50",
  "cursor-pointer",
);

const SLIDE_SOUND_INTERVAL = 80;

export const Slider = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(function Slider({ className, onValueChange, onValueCommit, value, defaultValue, ...props }, ref) {
  const { play } = useSigilSound();
  const lastSoundAt = useRef(0);
  const thumbCount = (value ?? defaultValue ?? [0]).length;

  const handleValueChange = (v: number[]) => {
    const now = Date.now();
    if (now - lastSoundAt.current >= SLIDE_SOUND_INTERVAL) {
      play("slide");
      lastSoundAt.current = now;
    }
    onValueChange?.(v);
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="slider"
      className={cn(
        "relative flex min-h-[var(--s-control-hit-area,2.75rem)] w-full touch-none select-none items-center",
        className,
      )}
      {...props}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      onValueCommit={(v) => { play("slide"); onValueCommit?.(v); }}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1.5 w-full grow overflow-hidden rounded-[var(--s-radius-full,9999px)] bg-[var(--s-border-muted,var(--s-surface))]"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-[var(--s-primary)]"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className={thumbClasses}
          aria-label={
            typeof props["aria-label"] === "string"
              ? thumbCount > 1
                ? `${props["aria-label"]} ${i + 1}`
                : props["aria-label"]
              : undefined
          }
        />
      ))}
    </SliderPrimitive.Root>
  );
});
