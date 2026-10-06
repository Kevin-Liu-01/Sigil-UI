"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { cn } from "../utils";
import { useSigilSound } from "../sound-context";

/* -------------------------------- Context -------------------------------- */

type EmblaApi = UseEmblaCarouselType[1];

interface CarouselContextValue {
  emblaRef: UseEmblaCarouselType[0];
  api: EmblaApi;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedIndex: number;
  scrollSnaps: number[];
  orientation: "horizontal" | "vertical";
  tilt: boolean;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel components must be used within <Carousel>");
  return ctx;
}

/* -------------------------------- Carousel ------------------------------- */

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  opts?: Parameters<typeof useEmblaCarousel>[0];
  /** Enable 3D tilt perspective on slides. */
  tilt?: boolean;
  children?: ReactNode;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { orientation = "horizontal", opts, tilt = false, className, children, ...rest },
  ref,
) {
  const [emblaRef, api] = useEmblaCarousel({
    axis: orientation === "vertical" ? "y" : "x",
    ...opts,
  });

  const { play } = useSigilSound();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    play("nav");
    api?.scrollPrev();
  }, [api, play]);
  const scrollNext = useCallback(() => {
    play("nav");
    api?.scrollNext();
  }, [api, play]);
  const scrollTo = useCallback(
    (index: number) => {
      play("nav");
      api?.scrollTo(index);
    },
    [api, play],
  );

  const onSelect = useCallback(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    onSelect();
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        emblaRef,
        api,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
        selectedIndex,
        scrollSnaps,
        orientation,
        tilt,
      }}
    >
      <div
        ref={ref}
        data-slot="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
        className={cn("relative w-full", className)}
        onKeyDownCapture={(e) => {
          if (e.key === "ArrowLeft" && orientation === "horizontal") {
            e.preventDefault();
            scrollPrev();
          } else if (e.key === "ArrowRight" && orientation === "horizontal") {
            e.preventDefault();
            scrollNext();
          } else if (e.key === "ArrowUp" && orientation === "vertical") {
            e.preventDefault();
            scrollPrev();
          } else if (e.key === "ArrowDown" && orientation === "vertical") {
            e.preventDefault();
            scrollNext();
          }
        }}
        {...rest}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

/* ----------------------------- CarouselContent --------------------------- */

export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  function CarouselContent({ className, ...rest }, ref) {
    const { emblaRef, orientation, tilt: isTilt } = useCarousel();

    return (
      <div
        ref={emblaRef}
        className={cn(
          "overflow-hidden",
          "rounded-[var(--s-card-radius,var(--s-radius-md,0px))]",
        )}
        style={isTilt ? { perspective: "800px" } : undefined}
      >
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-col -mt-3" : "-ml-3",
            isTilt && "[&>div]:transition-transform [&>div]:duration-[var(--s-duration-normal)]",
            className,
          )}
          style={isTilt ? { transformStyle: "preserve-3d" } : undefined}
          {...rest}
        />
      </div>
    );
  },
);

/* ------------------------------ CarouselItem ----------------------------- */

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  function CarouselItem({ className, ...rest }, ref) {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          orientation === "vertical" ? "pt-3" : "pl-3",
          className,
        )}
        {...rest}
      />
    );
  },
);

/* ----------------------------- Nav Buttons ------------------------------- */

export interface CarouselButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  /**
   * Where to render the button. `inside` keeps the buttons over the slide,
   * `outside` floats them just past the rail (the original behavior).
   */
  placement?: "inside" | "outside";
}

const navButtonBase = cn(
  "absolute z-20 inline-flex h-9 w-9 items-center justify-center",
  "rounded-[var(--s-radius-full,9999px)]",
  "border border-[style:var(--s-border-style,solid)] border-[color:var(--s-border)]",
  "bg-[var(--s-surface)] text-[var(--s-text)]",
  "shadow-[var(--s-shadow-md,0_2px_6px_rgb(0_0_0/0.12))]",
  "backdrop-blur-sm",
  "transition-[transform,background-color,opacity,box-shadow] duration-[var(--s-duration-fast,150ms)]",
  "hover:bg-[var(--s-surface-elevated,var(--s-surface))] hover:text-[var(--s-primary)]",
  "active:scale-95",
  "disabled:opacity-30 disabled:pointer-events-none",
  "focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]",
);

export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  function CarouselPrevious(
    { className, children, placement = "inside", ...rest },
    ref,
  ) {
    const { scrollPrev, canScrollPrev, orientation } = useCarousel();

    const positional =
      orientation === "vertical"
        ? placement === "inside"
          ? "top-2 left-1/2 -translate-x-1/2"
          : "-top-12 left-1/2 -translate-x-1/2"
        : placement === "inside"
          ? "left-2 top-1/2 -translate-y-1/2"
          : "-left-12 top-1/2 -translate-y-1/2";

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Previous slide"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        data-slot="carousel-previous"
        className={cn(navButtonBase, positional, className)}
        {...rest}
      >
        {children ?? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d={orientation === "vertical" ? "M3 8.5l4-4 4 4" : "M8.5 3l-4 4 4 4"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    );
  },
);

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  function CarouselNext(
    { className, children, placement = "inside", ...rest },
    ref,
  ) {
    const { scrollNext, canScrollNext, orientation } = useCarousel();

    const positional =
      orientation === "vertical"
        ? placement === "inside"
          ? "bottom-2 left-1/2 -translate-x-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2"
        : placement === "inside"
          ? "right-2 top-1/2 -translate-y-1/2"
          : "-right-12 top-1/2 -translate-y-1/2";

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Next slide"
        disabled={!canScrollNext}
        onClick={scrollNext}
        data-slot="carousel-next"
        className={cn(navButtonBase, positional, className)}
        {...rest}
      >
        {children ?? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d={orientation === "vertical" ? "M3 5.5l4 4 4-4" : "M5.5 3l4 4-4 4"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    );
  },
);

/* ----------------------------- CarouselDots ------------------------------ */

export interface CarouselDotsProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Renders a dot for every slide and reflects the current position. Click a dot
 * to jump straight to that slide.
 */
export const CarouselDots = forwardRef<HTMLDivElement, CarouselDotsProps>(
  function CarouselDots({ className, ...rest }, ref) {
    const { scrollSnaps, selectedIndex, scrollTo, orientation } = useCarousel();

    if (scrollSnaps.length <= 1) return null;

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="Slide navigation"
        data-slot="carousel-dots"
        className={cn(
          "flex items-center justify-center gap-1.5 mt-3",
          orientation === "vertical" && "flex-col mt-0 ml-3",
          className,
        )}
        {...rest}
      >
        {scrollSnaps.map((_, index) => {
          const active = index === selectedIndex;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => scrollTo(index)}
              data-active={active || undefined}
              className={cn(
                "group inline-flex size-[var(--s-control-hit-area,2.75rem)] items-center justify-center rounded-[var(--s-radius-full,9999px)]",
                "focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-1.5 rounded-[var(--s-radius-full,9999px)] transition-[width,background-color,opacity] duration-[var(--s-duration-fast,150ms)]",
                  active ? "w-6 bg-[var(--s-primary)]" : "w-1.5 bg-[var(--s-border)] group-hover:bg-[var(--s-text-muted)]",
                )}
              />
            </button>
          );
        })}
      </div>
    );
  },
);
