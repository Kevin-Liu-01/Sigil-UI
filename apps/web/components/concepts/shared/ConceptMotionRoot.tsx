"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";

type ConceptMotionRootProps = {
  children: ReactNode;
  enabled: boolean;
};

function readDuration(style: CSSStyleDeclaration, token: string, fallback: number) {
  const raw = style.getPropertyValue(token).trim();
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return raw.endsWith("ms") ? value / 1000 : value;
}

function readLength(style: CSSStyleDeclaration, token: string, fallback: number) {
  const value = Number.parseFloat(style.getPropertyValue(token));
  return Number.isFinite(value) ? value : fallback;
}

function findScrollContainer(node: HTMLElement) {
  let current = node.parentElement;
  while (current && current !== document.body) {
    const overflow = getComputedStyle(current).overflowY;
    if ((overflow === "auto" || overflow === "scroll") && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export function ConceptMotionRoot({ children, enabled }: ConceptMotionRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || !enabled) return;
    if (reduced) {
      root.dataset.conceptMotion = "reduced";
      return () => {
        root.dataset.conceptMotion = "static";
      };
    }
    root.dataset.conceptMotion = "lenis-gsap";

    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const style = getComputedStyle(root);
    const normal = readDuration(style, "--s-duration-normal", 0.2);
    const slow = readDuration(style, "--s-duration-slow", 0.3);
    const slower = readDuration(style, "--s-duration-slower", 0.5);
    const introDuration = Math.min(Math.max(slow, 0.18), 0.28);
    const revealDuration = Math.min(Math.max(slow * 1.25, 0.24), 0.42);
    const travel = Math.min(readLength(style, "--s-grid-cell", 40) / 2, 32);
    const curve = style.getPropertyValue("--s-ease-out").trim();
    const curvePoints = curve.match(/-?\d*\.?\d+/g);
    const ease = curvePoints?.length === 4
      ? CustomEase.create("sigil-concept-ease", curvePoints.join(","))
      : "power3.out";
    const scrollContainer = findScrollContainer(root);
    const lenis = new Lenis({
      autoRaf: false,
      wrapper: scrollContainer ?? window,
      content: root,
      duration: Math.max(slower * 1.5, 0.75),
      smoothWheel: true,
      syncTouch: false,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      const introItems = gsap.utils.toArray<HTMLElement>("[data-concept-intro]");
      if (introItems.length) {
        gsap.from(introItems, {
          opacity: 0,
          y: travel * 0.4,
          duration: introDuration,
          stagger: Math.min(Math.max(normal / 6, 0.02), 0.05),
          ease,
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-concept-reveal]").forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: travel,
          duration: revealDuration,
          ease,
          scrollTrigger: {
            trigger: item,
            scroller: scrollContainer ?? undefined,
            start: "top 86%",
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-concept-parallax]").forEach((item) => {
        gsap.to(item, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: item.parentElement ?? item,
            scroller: scrollContainer ?? undefined,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });
    }, root);

    ScrollTrigger.refresh();
    return () => {
      context.revert();
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (root.contains(trigger.trigger as Node | null)) trigger.kill();
      });
      root.dataset.conceptMotion = "static";
    };
  }, [enabled]);

  return (
    <div ref={rootRef} data-concept-motion={enabled ? "eligible" : "static"}>
      {children}
    </div>
  );
}
