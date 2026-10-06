"use client";

import React, { useEffect, useLayoutEffect, useState, useRef, useCallback, useMemo, cloneElement } from "react";
import type { ReactElement } from "react";
import {
  Badge, Button, Calendar, Card, CardContent, Checkbox,
  Input, KPI, Meter, Progress, Separator, SparkLine,
  Slider, Stepper, Switch, Tabs, TabsList, TabsTrigger,
  ToggleGroup, ToggleGroupItem,
} from "@sigil-ui/components";
import { MarkdownChrome, TokenPreviewGlyph, type TokenPreviewKind } from "./token-visuals";
import { Palette, RectangleHorizontal, SquareSlash, Clock, Type, Layers, FileUp, Volume2, Sparkles, Radio, Rocket, Shield, Heart, Code, Bold, Italic, Underline, Strikethrough, Ruler, BarChart3, Box } from "@/components/icons";
import { HeroStack } from "./hero-stack";
import { HeroActivity } from "./hero-activity";
import { useSigilActions } from "../sandbox/token-provider";
import { STUDIO_PRESETS } from "@/lib/studio-presets";
import { OklchText } from "../oklch-text";

/* ── Timing ──────────────────────────────────────────────────── */
const CYCLE_MS = 4200;
const PHASE_MS = 1050;
const SELECTION_PAD = 6;

function isPresetSwitching() {
  return document.documentElement.hasAttribute("data-sigil-preset-switching");
}
const STAGGER_MS = 40;
const ANIM_MS = 3400;

/* ── Compact file picker used inside the TokenAction cell ────── */

interface TokensFilePickerProps {
  accept?: string;
  /** Controlled: parent decides whether to show the "loaded" tint. */
  hasFile?: boolean;
  onFileSelected?: (file: File) => void;
}

/**
 * Tiny token-row file picker. Renders an icon button matching the row's
 * h-7 size; clicking it opens the native file dialog. Shows a primary
 * tint after a file is selected so the demo reads as "loaded a file".
 */
function TokensFilePicker({ accept, hasFile = false, onFileSelected }: TokensFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelected?.(file);
  }, [onFileSelected]);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />
      <button
        type="button"
        aria-label="Open token file"
        onClick={handleClick}
        className="inline-flex h-7 w-7 items-center justify-center shrink-0 cursor-pointer transition-colors duration-[var(--s-duration-fast,150ms)]"
        style={{
          border: "var(--s-border-thin,1px) var(--s-border-style,solid) var(--s-border)",
          borderRadius: "var(--s-radius-sm,4px)",
          background: hasFile
            ? "color-mix(in oklch, var(--s-primary) 12%, var(--s-surface, var(--s-background)))"
            : "var(--s-surface, var(--s-background))",
          color: hasFile ? "var(--s-primary)" : "var(--s-text-muted)",
        }}
      >
        <FileUp size={11} aria-hidden />
      </button>
    </>
  );
}

/**
 * Catmull-Rom -> cubic Bezier path. Renders a far smoother spark line
 * than straight L-segments without pulling in a charting lib.
 */
function smoothPathFromPoints(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * ContinuousSparkLine
 *
 * A real-time-looking sparkline that scrolls leftward continuously.
 *
 * Architecture (the trick is the rendered SVG is one step wider than its
 * visible container, with the latest data point sitting just past the
 * right edge under translateX(0)):
 *
 *   Buffer length = K. K-2 visible intervals, K-1 visible points + 1
 *   hidden point off the right. SVG width = visibleW + stepX. Container
 *   uses overflow:hidden to clip the off-right point.
 *
 * Animation cycle (driven by parent's `pushTick` counter):
 *   - useLayoutEffect synchronously snaps `transform: translateX(0)`
 *     before the browser paints the new buffer. New buffer's point 0
 *     lands exactly where the old buffer's point 1 was at translateX
 *     (-stepX), so there's no visual jump on tick.
 *   - rAF callback then sets `transition: transform Tms linear` and
 *     animates to `translateX(-stepX)`. Over T ms the line slides left
 *     by exactly one step; the previously hidden right point slides
 *     into view at the right edge.
 *
 * The "end dot" is rendered OUTSIDE the translating SVG at a fixed
 * container position (right edge - padding). Its y is a CSS-transitioned
 * value derived from `buffer[K - 2]` so it eases to each new latest
 * value rather than snapping.
 */
interface ContinuousSparkLineProps {
  buffer: number[];
  pushTick: number;
  width: number;
  height: number;
  color: string;
  /** Horizontal padding inside the visible plot area (px). */
  paddingX?: number;
  /** Vertical padding so the line + glow stay inside the card border. */
  paddingY?: number;
  /** Tick interval in ms — must match the parent's setInterval. */
  intervalMs: number;
  /** Fixed y-domain so the curve doesn't bounce-rescale on every tick. */
  yDomain?: [number, number];
}

function ContinuousSparkLine({
  buffer,
  pushTick,
  width,
  height,
  color,
  paddingX = 4,
  paddingY = 9,
  intervalMs,
  yDomain = [4, 24],
}: ContinuousSparkLineProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lastTickRef = useRef<number>(pushTick);
  const gradientId = React.useId();
  const glowId = React.useId();

  const K = buffer.length;
  const plotW = Math.max(1, width - paddingX * 2);
  const stepX = plotW / Math.max(1, K - 2);
  const svgWidth = width + stepX;
  // CSS transform uses a percentage of the SVG's own width so the
  // visual step matches the viewBox step regardless of how the SVG is
  // scaled by the container.
  const stepXPercent = (stepX / svgWidth) * 100;

  useLayoutEffect(() => {
    if (pushTick === lastTickRef.current) return;
    lastTickRef.current = pushTick;
    const svg = svgRef.current;
    if (!svg) return;
    // Use the Web Animations API rather than CSS transitions because the
    // browser otherwise collapses the snap-to-0 + slide-to-stepX writes
    // into a single computed-style update on the same JS task and the
    // transition never plays. WAAPI gives us a discrete animation we can
    // cancel + restart on every tick reliably.
    svg.getAnimations().forEach((a) => a.cancel());
    svg.animate(
      [
        { transform: "translateX(0%)" },
        { transform: `translateX(-${stepXPercent}%)` },
      ],
      {
        duration: intervalMs,
        easing: "linear",
        fill: "forwards",
      },
    );
  }, [pushTick, intervalMs, stepXPercent]);

  const [yMin, yMax] = yDomain;
  const yRange = Math.max(0.0001, yMax - yMin);
  const plotH = Math.max(1, height - paddingY * 2);
  const valueToY = (v: number) =>
    paddingY + plotH - ((Math.max(yMin, Math.min(yMax, v)) - yMin) / yRange) * plotH;

  const pts = buffer.map((v, i) => ({ x: paddingX + i * stepX, y: valueToY(v) }));
  const lineD = smoothPathFromPoints(pts);
  const first = pts[0];
  const last = pts[pts.length - 1];
  const areaD = `${lineD} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;

  // The dot rides at the right edge of the visible area, vertically
  // tracking the most-recently "settled" data point (buffer[K - 2]).
  const dotValue = buffer[Math.max(0, K - 2)];
  const dotY = valueToY(dotValue);
  const dotR = 2.4;

  return (
    <div
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        flex: 1,
        minHeight: 0,
      }}
    >
      <svg
        ref={svgRef}
        data-slot="spark-line"
        width={svgWidth}
        height={height}
        viewBox={`0 0 ${svgWidth} ${height}`}
        preserveAspectRatio="none"
        style={{
          display: "block",
          width: `${(svgWidth / width) * 100}%`,
          height: "100%",
          willChange: "transform",
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="55%" stopColor={color} stopOpacity={0.08} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path
          d={lineD}
          fill="none"
          stroke={color}
          strokeWidth={1.3}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Fixed-position end dot — does NOT translate with the SVG. Its
          y eases to the latest settled value on every tick. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: paddingX + 1,
          top: `${(dotY / height) * 100}%`,
          width: dotR * 2,
          height: dotR * 2,
          marginTop: -dotR,
          marginRight: -dotR,
          borderRadius: "9999px",
          background: color,
          boxShadow: `0 0 6px ${color}, 0 0 0 3px color-mix(in oklch, ${color} 18%, transparent)`,
          transition: `top ${Math.min(intervalMs, 220)}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/**
 * Live "requests / min" card. Rolls a fixed-length window of values on a
 * timer to feel like a real-time stream.
 *
 * - On every tick we drop the leftmost value, push a new one onto the
 *   right (smooth random walk + small spike chance), and bump
 *   `pushTick` so ContinuousSparkLine kicks off its translate animation.
 * - `p99` drifts by ±1ms every several ticks.
 * - `accent` flips the line color to the demo accent for the apply state.
 */
interface LiveRequestsCardProps {
  accent?: boolean;
  intervalMs?: number;
  length?: number;
  active?: boolean;
}

function LiveRequestsCard({ accent = false, intervalMs = 320, length = 32, active = true }: LiveRequestsCardProps) {
  const seed = useMemo(() => {
    // Hand-shaped seed with gentle peaks/valleys so the first paint
    // already reads as "live data" instead of a flat warmup.
    const base = [
      11, 13, 10, 14, 12, 15, 11, 13, 10, 14, 12, 16, 13, 11, 15, 17,
      14, 12, 15, 13, 16, 12, 14, 17, 13, 15, 12, 14, 13, 15, 14, 13,
    ];
    return base.slice(-length);
  }, [length]);
  const [buffer, setBuffer] = useState<number[]>(seed);
  const [pushTick, setPushTick] = useState(0);
  const [p99, setP99] = useState<number>(12);

  useEffect(() => {
    if (!active) return;
    let tick = 0;
    const id = window.setInterval(() => {
      if (isPresetSwitching()) return;
      tick += 1;
      setBuffer((prev) => {
        const last = prev[prev.length - 1] ?? 12;
        // Realistic-feeling stream: a small random walk dominates, with
        // an occasional small spike. Dropped from the previous version
        // (~22% / 18% spikes, drift 7.5) to ~7% / 5% with drift 2.6 so
        // the line reads as steady traffic instead of an EKG.
        const drift = (Math.random() - 0.5) * 2.6;
        const spikeUp = Math.random() < 0.07 ? Math.random() * 4 : 0;
        const spikeDown = Math.random() < 0.05 ? -Math.random() * 3 : 0;
        // Soft restoring force back toward 13 keeps long runs from
        // wandering off to the clamp boundaries.
        const restore = (13 - last) * 0.06;
        const next = Math.max(6, Math.min(22, last + drift + restore + spikeUp + spikeDown));
        return [...prev.slice(1), next];
      });
      setPushTick((t) => t + 1);
      if (tick % 8 === 0) {
        setP99((prev) => {
          const drift = Math.random() < 0.5 ? -1 : 1;
          return Math.max(8, Math.min(22, prev + drift));
        });
      }
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, active]);

  const lineColor = accent ? "oklch(0.70 0.22 190)" : "var(--s-primary)";

  return (
    <>
      <div className=" px-0.5 flex items-center justify-between">
        <span style={{ ...mono9, color: "var(--s-text-muted)" }}>Requests / min</span>
        <span
          className="font-[family-name:var(--s-font-mono)] text-[length:var(--s-hero-demo-label)] tabular-nums inline-flex items-center gap-1"
          style={{ color: "var(--s-text-muted)" }}
        >
          <span
            aria-hidden
            className="hero-logo-field__live-dot"
            style={{ background: lineColor }}
          />
          p99 {p99}ms
        </span>
      </div>
      <ContinuousSparkLine
        buffer={buffer}
        pushTick={pushTick}
        width={220}
        height={58}
        color={lineColor}
        intervalMs={intervalMs}
        paddingX={4}
        paddingY={2}
        yDomain={[5, 23]}
      />
    </>
  );
}

/* `mono9` is declared later — forward-reference via lazy lookup. */
const mono9 = { fontFamily: "var(--s-font-mono)", fontSize: "var(--s-hero-demo-label)" } as const;

/* ── Single uniform stroke preset ────────────────────────────── */
const S = { fill: "none" as const, strokeWidth: 0.25, pathLength: 1 };
const G = { fill: "none" as const, strokeWidth: 0.25, pathLength: 1 };

/* ── Palette aliases (resolved via CSS custom properties) ────── */
const P = "var(--hlf-pri)";
const N = "currentColor";
const M = "var(--hlf-mid)";

type V = ReactElement[];

const VARIANTS: V[] = [
  /* ═══ ORIGINAL VARIANTS — organic circle clusters ═══════════ */

  /* Plus (+), scattered circle clusters */
  [
    <line key="d1" x1={60} y1={4} x2={60} y2={116} stroke={N} {...S} />,
    <line key="d2" x1={4} y1={60} x2={116} y2={60} stroke={N} {...S} />,
    <circle key="a" cx={22} cy={22} r={10} stroke={P} {...S} />,
    <circle key="b" cx={44} cy={22} r={10} stroke={P} {...S} strokeOpacity={0.8} />,
    <circle key="c" cx={22} cy={44} r={10} stroke={P} {...S} strokeOpacity={0.6} />,
    <circle key="d" cx={44} cy={44} r={10} stroke={P} {...S} strokeOpacity={0.4} />,
    <circle key="e" cx={82} cy={26} r={16} stroke={M} {...S} />,
    <circle key="f" cx={100} cy={44} r={6} stroke={M} {...S} />,
    <circle key="g" cx={24} cy={80} r={12} stroke={N} {...S} strokeOpacity={0.8} />,
    <circle key="h" cx={42} cy={92} r={8} stroke={N} {...S} strokeOpacity={0.6} />,
    <circle key="i" cx={32} cy={108} r={5} stroke={N} {...S} strokeOpacity={0.4} />,
    <circle key="j" cx={90} cy={90} r={22} stroke={P} {...S} />,
  ],

  /* X, mixed shapes in triangular wedges */
  [
    <line key="d1" x1={10} y1={10} x2={110} y2={110} stroke={N} {...S} />,
    <line key="d2" x1={110} y1={10} x2={10} y2={110} stroke={N} {...S} />,
    <rect key="a" x={46} y={14} width={12} height={12} stroke={P} {...S} />,
    <rect key="b" x={62} y={14} width={12} height={12} stroke={P} {...S} strokeOpacity={0.7} />,
    <rect key="c" x={54} y={30} width={12} height={12} stroke={P} {...S} strokeOpacity={0.5} />,
    <rect key="d" x={86} y={50} width={12} height={12} stroke={M} {...S} transform="rotate(45 92 56)" />,
    <rect key="e" x={94} y={62} width={10} height={10} stroke={M} {...S} transform="rotate(45 99 67)" />,
    <polygon key="f" points="60,82 74,90 74,106 60,114 46,106 46,90" stroke={P} {...S} />,
    <polygon key="g" points="60,88 68,93 68,103 60,108 52,103 52,93" stroke={P} {...S} strokeOpacity={0.5} />,
    <polygon key="h" points="30,52 38,66 22,66" stroke={N} {...S} strokeOpacity={0.8} />,
    <polygon key="i" points="18,56 22,64 14,64" stroke={N} {...S} strokeOpacity={0.5} />,
  ],

  /* Slash (/), concentric circles in 2 halves */
  [
    <line key="d1" x1={10} y1={110} x2={110} y2={10} stroke={N} {...S} />,
    <circle key="a" cx={80} cy={20} r={14} stroke={P} {...S} />,
    <circle key="b" cx={80} cy={20} r={20} stroke={P} {...S} strokeOpacity={0.4} />,
    <circle key="c" cx={100} cy={28} r={8} stroke={P} {...S} strokeOpacity={0.7} />,
    <circle key="d" cx={92} cy={46} r={10} stroke={M} {...S} />,
    <circle key="e" cx={70} cy={38} r={6} stroke={P} {...S} strokeOpacity={0.5} />,
    <circle key="f" cx={28} cy={82} r={16} stroke={N} {...S} strokeOpacity={0.8} />,
    <circle key="g" cx={28} cy={82} r={22} stroke={N} {...S} strokeOpacity={0.3} />,
    <circle key="h" cx={46} cy={96} r={9} stroke={P} {...S} />,
    <circle key="i" cx={22} cy={104} r={6} stroke={N} {...S} strokeOpacity={0.5} />,
  ],

  /* Backslash (\), concentric circles in 2 halves */
  [
    <line key="d1" x1={10} y1={10} x2={110} y2={110} stroke={N} {...S} />,
    <circle key="a" cx={22} cy={24} r={10} stroke={P} {...S} />,
    <circle key="b" cx={42} cy={20} r={8} stroke={P} {...S} strokeOpacity={0.7} />,
    <circle key="c" cx={28} cy={44} r={12} stroke={P} {...S} />,
    <circle key="d" cx={28} cy={44} r={17} stroke={P} {...S} strokeOpacity={0.3} />,
    <circle key="e" cx={50} cy={38} r={5} stroke={P} {...S} strokeOpacity={0.5} />,
    <circle key="f" cx={90} cy={80} r={18} stroke={P} {...S} />,
    <circle key="g" cx={90} cy={80} r={24} stroke={P} {...S} strokeOpacity={0.3} />,
    <circle key="h" cx={76} cy={96} r={8} stroke={M} {...S} />,
    <circle key="i" cx={100} cy={102} r={6} stroke={M} {...S} />,
  ],

  /* Y trisection, circles in 3 sectors */
  [
    <line key="d1" x1={60} y1={60} x2={60} y2={4} stroke={N} {...S} />,
    <line key="d2" x1={60} y1={60} x2={11.5} y2={88} stroke={N} {...S} />,
    <line key="d3" x1={60} y1={60} x2={108.5} y2={88} stroke={N} {...S} />,
    <circle key="a" cx={40} cy={20} r={10} stroke={P} {...S} />,
    <circle key="b" cx={40} cy={20} r={15} stroke={P} {...S} strokeOpacity={0.3} />,
    <circle key="c" cx={80} cy={20} r={8} stroke={P} {...S} strokeOpacity={0.7} />,
    <circle key="d" cx={60} cy={36} r={6} stroke={P} {...S} strokeOpacity={0.5} />,
    <circle key="e" cx={24} cy={86} r={12} stroke={N} {...S} strokeOpacity={0.8} />,
    <circle key="f" cx={40} cy={100} r={8} stroke={N} {...S} strokeOpacity={0.5} />,
    <circle key="g" cx={90} cy={82} r={14} stroke={P} {...S} />,
    <circle key="h" cx={90} cy={82} r={20} stroke={P} {...S} strokeOpacity={0.25} />,
    <circle key="i" cx={100} cy={100} r={6} stroke={M} {...S} />,
  ],

  /* 3-column (||), monochrome */
  [
    <line key="d1" x1={40} y1={4} x2={40} y2={116} stroke={N} {...S} />,
    <line key="d2" x1={80} y1={4} x2={80} y2={116} stroke={N} {...S} />,
    <circle key="a" cx={20} cy={28} r={10} stroke={N} {...S} />,
    <circle key="b" cx={20} cy={52} r={8} stroke={N} {...S} strokeOpacity={0.5} />,
    <circle key="c" cx={20} cy={90} r={14} stroke={N} {...S} strokeOpacity={0.3} />,
    <circle key="d" cx={60} cy={20} r={12} stroke={N} {...S} strokeOpacity={0.85} />,
    <circle key="e" cx={60} cy={60} r={16} stroke={N} {...S} strokeOpacity={0.45} />,
    <circle key="f" cx={60} cy={60} r={22} stroke={N} {...S} strokeOpacity={0.2} />,
    <circle key="g" cx={60} cy={100} r={8} stroke={N} {...S} strokeOpacity={0.65} />,
    <circle key="h" cx={100} cy={36} r={8} stroke={N} {...S} strokeOpacity={0.6} />,
    <circle key="i" cx={100} cy={76} r={12} stroke={N} {...S} strokeOpacity={0.75} />,
  ],

  /* ═══ GEOMETRIC VARIANTS — circles + squares, tighter ═══════ */

  /* Plus (+) · circle-wrapping-square motif */
  [
    <line key="d1" x1={60} y1={0} x2={60} y2={120} stroke={N} {...S} />,
    <line key="d2" x1={0} y1={60} x2={120} y2={60} stroke={N} {...S} />,
    <circle key="a" cx={37} cy={37} r={16} stroke={P} {...S} />,
    <rect   key="b" x={32} y={32} width={10} height={10} stroke={P} {...S} strokeOpacity={0.5} />,
    <circle key="c" cx={37} cy={37} r={4} stroke={P} {...S} strokeOpacity={0.25} />,
    <rect   key="d" x={77} y={31} width={12} height={12} stroke={M} {...S} transform="rotate(45 83 37)" />,
    <circle key="e" cx={83} cy={37} r={4} stroke={M} {...S} strokeOpacity={0.4} />,
    <circle key="f" cx={37} cy={83} r={13} stroke={N} {...S} strokeOpacity={0.8} />,
    <rect   key="g" x={33} y={79} width={8} height={8} stroke={N} {...S} strokeOpacity={0.35} />,
    <circle key="h" cx={84} cy={84} r={17} stroke={P} {...S} strokeOpacity={0.8} />,
    <circle key="i" cx={84} cy={84} r={10} stroke={P} {...S} strokeOpacity={0.4} />,
    <rect   key="j" x={81} y={81} width={6} height={6} stroke={P} {...S} strokeOpacity={0.2} />,
  ],

  /* X cross · alternating circles and diamonds */
  [
    <line key="d1" x1={6} y1={6} x2={114} y2={114} stroke={N} {...S} />,
    <line key="d2" x1={114} y1={6} x2={6} y2={114} stroke={N} {...S} />,
    <circle key="a" cx={60} cy={28} r={14} stroke={P} {...S} />,
    <rect   key="b" x={56} y={24} width={8} height={8} stroke={P} {...S} strokeOpacity={0.45} />,
    <rect   key="c" x={86} y={54} width={12} height={12} stroke={M} {...S} transform="rotate(45 92 60)" />,
    <circle key="d" cx={92} cy={60} r={4} stroke={M} {...S} strokeOpacity={0.4} />,
    <circle key="e" cx={60} cy={92} r={14} stroke={P} {...S} strokeOpacity={0.7} />,
    <rect   key="f" x={56} y={88} width={8} height={8} stroke={P} {...S} strokeOpacity={0.3} />,
    <rect   key="g" x={22} y={54} width={12} height={12} stroke={M} {...S} strokeOpacity={0.65} transform="rotate(45 28 60)" />,
    <circle key="h" cx={28} cy={60} r={4} stroke={M} {...S} strokeOpacity={0.3} />,
  ],

  /* Slash (/) · inscribed squares in concentric circles */
  [
    <line key="d1" x1={6} y1={114} x2={114} y2={6} stroke={N} {...S} />,
    <circle key="a" cx={42} cy={42} r={17} stroke={P} {...S} />,
    <rect   key="b" x={36} y={36} width={12} height={12} stroke={P} {...S} strokeOpacity={0.5} />,
    <circle key="c" cx={42} cy={42} r={4} stroke={P} {...S} strokeOpacity={0.25} />,
    <rect   key="d" x={26} y={62} width={8} height={8} stroke={M} {...S} />,
    <circle key="e" cx={78} cy={78} r={17} stroke={P} {...S} strokeOpacity={0.7} />,
    <rect   key="f" x={72} y={72} width={12} height={12} stroke={P} {...S} strokeOpacity={0.35} />,
    <circle key="g" cx={78} cy={78} r={4} stroke={P} {...S} strokeOpacity={0.18} />,
    <rect   key="h" x={86} y={50} width={8} height={8} stroke={M} {...S} strokeOpacity={0.6} />,
  ],

  /* Backslash (\) · mirrored diamonds across diagonal */
  [
    <line key="d1" x1={6} y1={6} x2={114} y2={114} stroke={N} {...S} />,
    <circle key="a" cx={78} cy={38} r={15} stroke={P} {...S} />,
    <rect   key="b" x={73} y={33} width={10} height={10} stroke={P} {...S} strokeOpacity={0.5} transform="rotate(45 78 38)" />,
    <circle key="c" cx={78} cy={38} r={4} stroke={P} {...S} strokeOpacity={0.25} />,
    <rect   key="d" x={90} y={50} width={8} height={8} stroke={M} {...S} />,
    <circle key="e" cx={38} cy={78} r={15} stroke={P} {...S} strokeOpacity={0.7} />,
    <rect   key="f" x={33} y={73} width={10} height={10} stroke={P} {...S} strokeOpacity={0.35} transform="rotate(45 38 78)" />,
    <circle key="g" cx={38} cy={78} r={4} stroke={P} {...S} strokeOpacity={0.18} />,
    <rect   key="h" x={50} y={90} width={8} height={8} stroke={M} {...S} strokeOpacity={0.6} />,
  ],

  /* Y trisection · 3-fold with mixed shapes */
  [
    <line key="d1" x1={60} y1={60} x2={60} y2={0} stroke={N} {...S} />,
    <line key="d2" x1={60} y1={60} x2={11.5} y2={88} stroke={N} {...S} />,
    <line key="d3" x1={60} y1={60} x2={108.5} y2={88} stroke={N} {...S} />,
    <circle key="a" cx={38} cy={30} r={12} stroke={P} {...S} />,
    <rect   key="b" x={34} y={26} width={8} height={8} stroke={P} {...S} strokeOpacity={0.4} />,
    <rect   key="c" x={76} y={24} width={12} height={12} stroke={M} {...S} transform="rotate(45 82 30)" />,
    <circle key="d" cx={82} cy={30} r={4} stroke={M} {...S} strokeOpacity={0.4} />,
    <circle key="e" cx={60} cy={92} r={15} stroke={P} {...S} strokeOpacity={0.8} />,
    <rect   key="f" x={55} y={87} width={10} height={10} stroke={P} {...S} strokeOpacity={0.4} />,
    <circle key="g" cx={60} cy={92} r={4} stroke={P} {...S} strokeOpacity={0.2} />,
  ],

  /* Three columns (||) · rects and circles stepping */
  [
    <line key="d1" x1={40} y1={0} x2={40} y2={120} stroke={N} {...S} />,
    <line key="d2" x1={80} y1={0} x2={80} y2={120} stroke={N} {...S} />,
    <circle key="a" cx={25} cy={36} r={8} stroke={P} {...S} />,
    <rect   key="b" x={21} y={64} width={8} height={8} stroke={P} {...S} strokeOpacity={0.5} />,
    <circle key="c" cx={25} cy={94} r={7} stroke={P} {...S} strokeOpacity={0.35} />,
    <rect   key="d" x={52} y={26} width={16} height={16} stroke={M} {...S} />,
    <circle key="e" cx={60} cy={60} r={13} stroke={M} {...S} strokeOpacity={0.55} />,
    <rect   key="f" x={55} y={86} width={10} height={10} stroke={M} {...S} strokeOpacity={0.3} />,
    <circle key="g" cx={95} cy={44} r={8} stroke={P} {...S} strokeOpacity={0.8} />,
    <rect   key="h" x={91} y={72} width={8} height={8} stroke={P} {...S} strokeOpacity={0.4} />,
    <circle key="i" cx={95} cy={100} r={6} stroke={P} {...S} strokeOpacity={0.55} />,
  ],
];

type HeroPattern =
  | "fourCircles"
  | "circleRow"
  | "circleColumn"
  | "circleDiamond"
  | "nineDots"
  | "squareTiles"
  | "squareRow"
  | "squareColumn"
  | "steppedSquares"
  | "cornerSquares"
  | "splitSquares"
  | "diamondStack"
  | "diamondCorners"
  | "meetingLines"
  | "chevron"
  | "parallelHatch"
  | "stairLines"
  | "nodePath"
  | "bracketBox";

const HERO_CONFIGS: HeroPattern[][] = [
  ["fourCircles", "squareTiles", "meetingLines", "diamondStack"],
  ["circleDiamond", "steppedSquares", "parallelHatch", "cornerSquares"],
  ["nineDots", "splitSquares", "chevron", "circleRow"],
  ["squareColumn", "circleColumn", "diamondCorners", "bracketBox"],
  ["nodePath", "bracketBox", "fourCircles", "stairLines"],
  ["parallelHatch", "circleDiamond", "squareRow", "meetingLines"],
  ["cornerSquares", "nineDots", "diamondStack", "splitSquares"],
  ["chevron", "squareTiles", "circleColumn", "nodePath"],
  ["squareRow", "meetingLines", "circleRow", "diamondCorners"],
  ["bracketBox", "steppedSquares", "nodePath", "fourCircles"],
  ["circleColumn", "parallelHatch", "cornerSquares", "squareTiles"],
  ["diamondStack", "circleRow", "parallelHatch", "squareColumn"],
  ["splitSquares", "nineDots", "meetingLines", "circleDiamond"],
  ["stairLines", "diamondCorners", "squareRow", "nodePath"],
  ["fourCircles", "bracketBox", "parallelHatch", "steppedSquares"],
  ["splitSquares", "cornerSquares", "circleColumn", "chevron"],
  ["squareTiles", "nodePath", "diamondStack", "nineDots"],
  ["circleRow", "splitSquares", "stairLines", "diamondCorners"],
  ["meetingLines", "squareColumn", "bracketBox", "circleDiamond"],
  ["parallelHatch", "fourCircles", "chevron", "squareRow"],
];

const HERO_CELLS = [
  { x: 18, y: 18, stroke: P, fill: "url(#hlf-hatch-pri)" },
  { x: 66, y: 18, stroke: P, fill: "url(#hlf-hatch-mid)" },
  { x: 18, y: 66, stroke: P, fill: "url(#hlf-hatch-mid-soft)" },
  { x: 66, y: 66, stroke: P, fill: "url(#hlf-hatch-pri-soft)" },
] as const;

// Real preset → primary color map. The values are the canonical accent
// colors taken from packages/presets and mirrored in apps/web/components/devbar.tsx.
// These are used by the PresetSwatches cell so each tile actually inherits
// its preset's brand color instead of all reading from --s-primary.
type PresetSwatch = { name: string; color: string };
const swatches = (names: string[]): PresetSwatch[] => names.map(name => {
  const preset = STUDIO_PRESETS.find(preset => preset.name === name)!;
  return { name, color: preset.colors[0] };
});
const PRESET_SWATCH_ROW_A = swatches(["sigil", "shard", "rivet", "flux", "vex"]);
const PRESET_SWATCH_ROW_B = swatches(["rune", "kova", "cobalt", "helix", "cipher"]);

const HERO_TOKEN_STEPS = [
  { token: "--s-primary", before: "primary: oklch(0.55 0.12 275)", line: "primary: oklch(0.66 0.18 275)", label: "primary geometry" },
  { token: "--s-border", before: "border: oklch(0.20 0.01 260)", line: "border: oklch(0.24 0.01 260)", label: "cell outline" },
  { token: "--s-radius-md", before: "radius-md: 8px", line: "radius-md: 16px", label: "component corners" },
  { token: "--s-duration-slow", before: "duration-slow: 600ms", line: "duration-slow: 300ms", label: "draw timing" },
  { token: "--s-font-display", before: 'font-display: "InterVariable"', line: 'font-display: "Outfit"', label: "heading typeface" },
  { token: "--s-success", before: "success: oklch(0.60 0.15 145)", line: "success: oklch(0.72 0.19 145)", label: "positive signal" },
  { token: "--s-radius-sm", before: "radius-sm: 0", line: "radius-sm: 9999px", label: "badge shape" },
  { token: "--s-shadow-md", before: "shadow-md: 0 4px 12px", line: "shadow-md: 0 0 24px", label: "card glow" },
  { token: "--s-accent", before: "accent: oklch(0.60 0.16 250)", line: "accent: oklch(0.70 0.22 190)", label: "chart highlight" },
  { token: "--s-control-icon-size", before: "control-icon-size: 20px", line: "control-icon-size: 24px", label: "logo size" },
  { token: "--s-border-style", before: "border-style: solid", line: "border-style: dashed", label: "outline style" },
  { token: "--s-surface", before: "surface: oklch(0.16 0 0)", line: "surface: oklch(0.22 0.03 275)", label: "card tint" },
  { token: "--s-font-body", before: 'font-body: "InterVariable"', line: 'font-body: "Sora"', label: "body typeface" },
] as const;

const HERO_CURSOR_STEPS = [
  { component: "UsageCard", ...HERO_TOKEN_STEPS[0] },
  { component: "PresetSwatches", ...HERO_TOKEN_STEPS[1] },
  { component: "DatePicker", ...HERO_TOKEN_STEPS[2] },
  { component: "TokenAction", ...HERO_TOKEN_STEPS[3] },
  { component: "KPI", ...HERO_TOKEN_STEPS[4] },
  { component: "CommitGrid", ...HERO_TOKEN_STEPS[5] },
  { component: "Badges", ...HERO_TOKEN_STEPS[6] },
  { component: "Coverage", ...HERO_TOKEN_STEPS[7] },
  { component: "SparkLine", ...HERO_TOKEN_STEPS[8] },
  { component: "Stack", ...HERO_TOKEN_STEPS[9] },
  { component: "Sliders", ...HERO_TOKEN_STEPS[10] },
  { component: "Switches", ...HERO_TOKEN_STEPS[11] },
  { component: "Buttons", ...HERO_TOKEN_STEPS[12] },
] as const;

const TOKEN_SECTIONS: { name: string; icon: React.ElementType; indices: number[] }[] = [
  { name: "Colors", icon: Palette, indices: [0, 5, 8, 11] },
  { name: "Borders", icon: RectangleHorizontal, indices: [1, 10] },
  { name: "Radius", icon: SquareSlash, indices: [2, 6] },
  { name: "Controls", icon: Box, indices: [9] },
  { name: "Motion", icon: Clock, indices: [3] },
  { name: "Typography", icon: Type, indices: [4, 12] },
  { name: "Shadows", icon: Layers, indices: [7] },
];

const HERO_VARIANTS: V[] = HERO_CONFIGS.map((config, variantIdx) =>
  config.flatMap((pattern, cellIdx) => {
    const cell = HERO_CELLS[cellIdx];
    const cx = cell.x + 18;
    const cy = cell.y + 18;
    return renderHeroPattern(pattern, cell, `${variantIdx}-${cellIdx}`).map((el, elementIdx) =>
      cloneElement(el as React.ReactElement<React.SVGProps<SVGElement>>, {
        key: `${variantIdx}-${cellIdx}-${elementIdx}`,
        transform: `translate(${cx} ${cy}) scale(1.34) translate(${-cx} ${-cy})`,
      }),
    );
  }),
);

const HERO_BLUEPRINT: V = [
  <line key="grid-v1" x1={24} y1={12} x2={24} y2={108} stroke={P} {...G} strokeOpacity={0.22} />,
  <line key="grid-v2" x1={60} y1={8} x2={60} y2={112} stroke={P} {...G} strokeOpacity={0.42} />,
  <line key="grid-v3" x1={96} y1={12} x2={96} y2={108} stroke={P} {...G} strokeOpacity={0.22} />,
  <line key="grid-h1" x1={12} y1={24} x2={108} y2={24} stroke={P} {...G} strokeOpacity={0.22} />,
  <line key="grid-h2" x1={8} y1={60} x2={112} y2={60} stroke={P} {...G} strokeOpacity={0.42} />,
  <line key="grid-h3" x1={12} y1={96} x2={108} y2={96} stroke={P} {...G} strokeOpacity={0.22} />,
  <rect key="guide-nw" x={15} y={15} width={42} height={42} stroke={P} {...G} fill="url(#hlf-hatch-neutral)" strokeOpacity={0.58} />,
  <rect key="guide-ne" x={63} y={15} width={42} height={42} stroke={P} {...G} fill="url(#hlf-hatch-neutral)" strokeOpacity={0.58} />,
  <rect key="guide-sw" x={15} y={63} width={42} height={42} stroke={P} {...G} fill="url(#hlf-hatch-neutral)" strokeOpacity={0.58} />,
  <rect key="guide-se" x={63} y={63} width={42} height={42} stroke={P} {...G} fill="url(#hlf-hatch-neutral)" strokeOpacity={0.58} />,
];

const HERO_COMPONENT_DRAWING: V = [
  <rect key="shell" x={38} y={14} width={74} height={92} rx={3} stroke={P} {...S} fill="url(#hlf-hatch-neutral)" strokeOpacity={0.78} />,
  <line key="shell-head" x1={38} y1={28} x2={112} y2={28} stroke={P} {...G} strokeOpacity={0.54} />,
  <line key="shell-side" x1={54} y1={28} x2={54} y2={106} stroke={P} {...G} strokeOpacity={0.42} />,
  <circle key="dot-a" cx={44} cy={21} r={1.8} stroke={P} {...S} strokeOpacity={0.7} />,
  <circle key="dot-b" cx={50} cy={21} r={1.8} stroke={P} {...S} strokeOpacity={0.5} />,
  <rect key="nav-1" x={43} y={36} width={6} height={6} stroke={P} {...S} fill="url(#hlf-hatch-pri)" strokeOpacity={0.6} />,
  <rect key="nav-2" x={43} y={49} width={6} height={6} stroke={P} {...S} strokeOpacity={0.46} />,
  <rect key="nav-3" x={43} y={62} width={6} height={6} stroke={P} {...S} strokeOpacity={0.46} />,
  <rect key="stat-1" x={60} y={36} width={18} height={18} rx={2} stroke={P} {...S} fill="url(#hlf-hatch-pri-soft)" strokeOpacity={0.72} />,
  <rect key="stat-2" x={84} y={36} width={20} height={18} rx={2} stroke={P} {...S} strokeOpacity={0.58} />,
  <line key="stat-line-1" x1={64} y1={43} x2={73} y2={43} stroke={P} {...G} strokeOpacity={0.55} />,
  <line key="stat-line-2" x1={88} y1={43} x2={99} y2={43} stroke={P} {...G} strokeOpacity={0.44} />,
  <rect key="calendar" x={60} y={61} width={44} height={34} rx={2} stroke={P} {...S} fill="url(#hlf-hatch-mid-soft)" strokeOpacity={0.72} />,
  <line key="cal-head" x1={60} y1={70} x2={104} y2={70} stroke={P} {...G} strokeOpacity={0.5} />,
  <line key="cal-v1" x1={71} y1={70} x2={71} y2={95} stroke={P} {...G} strokeOpacity={0.28} />,
  <line key="cal-v2" x1={82} y1={70} x2={82} y2={95} stroke={P} {...G} strokeOpacity={0.28} />,
  <line key="cal-v3" x1={93} y1={70} x2={93} y2={95} stroke={P} {...G} strokeOpacity={0.28} />,
  <line key="cal-h1" x1={60} y1={78} x2={104} y2={78} stroke={P} {...G} strokeOpacity={0.28} />,
  <line key="cal-h2" x1={60} y1={86} x2={104} y2={86} stroke={P} {...G} strokeOpacity={0.28} />,
  <circle key="cal-active" cx={87.5} cy={82} r={3.5} stroke={P} {...S} fill="url(#hlf-hatch-pri)" strokeOpacity={0.75} />,
  <path key="chart" d="M64 101 L74 94 L82 98 L92 89 L102 92" stroke={P} {...S} strokeOpacity={0.78} />,
  <circle key="chart-node" cx={92} cy={89} r={2.2} stroke={P} {...S} fill="var(--s-background)" strokeOpacity={0.78} />,
  <rect key="input" x={10} y={32} width={33} height={11} rx={2} stroke={P} {...S} fill="url(#hlf-hatch-pri-soft)" strokeOpacity={0.62} />,
  <rect key="button" x={10} y={48} width={26} height={10} rx={2} stroke={P} {...S} strokeOpacity={0.58} />,
  <line key="md-1" x1={12} y1={68} x2={39} y2={68} stroke={P} {...G} strokeOpacity={0.45} />,
  <line key="md-2" x1={12} y1={75} x2={33} y2={75} stroke={P} {...G} strokeOpacity={0.35} />,
  <line key="md-3" x1={12} y1={82} x2={40} y2={82} stroke={P} {...G} strokeOpacity={0.45} />,
];

const DIAGRAM_CODE = `const diagram = {
  grid: "2x2 blueprint cells",
  motion: "stroke-dash draw",
  cells: HERO_CONFIGS[variant],
  fills: ["diagonal", "soft-diagonal"],
};`;

const TOKEN_ROWS: {
  token: string;
  usage: string;
  preview: TokenPreviewKind;
}[] = [
  { token: "--s-primary", usage: "primary geometry + inspect frame", preview: "primary" },
  { token: "--hlf-mid", usage: "mixed secondary geometry", preview: "mid" },
  { token: "--s-text-muted", usage: "blueprint grid + guide strokes", preview: "muted" },
  { token: "--s-background", usage: "inspector surface + control fill", preview: "background" },
  { token: "--s-border", usage: "panel dividers + control outline", preview: "border" },
  { token: "--s-radius-sm", usage: "inspect button corner radius", preview: "radius-sm" },
  { token: "--s-radius-md", usage: "inspector panel corner radius", preview: "radius-md" },
  { token: "--s-duration-fast", usage: "control transition timing", preview: "duration" },
  { token: "--s-font-mono", usage: "code, labels, token names", preview: "mono" },
] as const;

function renderHeroPattern(
  pattern: HeroPattern,
  cell: (typeof HERO_CELLS)[number],
  key: string,
): V {
  const { x, y, stroke, fill } = cell;
  const c = { x: x + 18, y: y + 18 };
  const common = { stroke, ...S };
  const soft = { stroke, ...G };

  switch (pattern) {
    case "fourCircles":
      return [
        <circle key={`${key}-a`} cx={x + 11} cy={y + 11} r={4.6} {...common} strokeOpacity={0.72} />,
        <circle key={`${key}-b`} cx={x + 25} cy={y + 11} r={4.6} {...common} strokeOpacity={0.62} />,
        <circle key={`${key}-c`} cx={x + 11} cy={y + 25} r={4.6} {...common} strokeOpacity={0.62} />,
        <circle key={`${key}-d`} cx={x + 25} cy={y + 25} r={4.6} {...common} strokeOpacity={0.52} />,
      ];
    case "circleRow":
      return [9, 18, 27].map((dx, i) => (
        <circle key={`${key}-${i}`} cx={x + dx} cy={c.y} r={4.2} {...common} strokeOpacity={0.72 - i * 0.1} />
      ));
    case "circleColumn":
      return [9, 18, 27].map((dy, i) => (
        <circle key={`${key}-${i}`} cx={c.x} cy={y + dy} r={4.2} {...common} strokeOpacity={0.72 - i * 0.1} />
      ));
    case "circleDiamond":
      return [
        <circle key={`${key}-n`} cx={c.x} cy={y + 8} r={3.8} {...common} strokeOpacity={0.7} />,
        <circle key={`${key}-e`} cx={x + 28} cy={c.y} r={3.8} {...common} strokeOpacity={0.58} />,
        <circle key={`${key}-s`} cx={c.x} cy={y + 28} r={3.8} {...common} strokeOpacity={0.58} />,
        <circle key={`${key}-w`} cx={x + 8} cy={c.y} r={3.8} {...common} strokeOpacity={0.58} />,
      ];
    case "nineDots":
      return [10, 18, 26].flatMap((dx, col) =>
        [10, 18, 26].map((dy, row) => (
          <circle key={`${key}-${col}-${row}`} cx={x + dx} cy={y + dy} r={1.9} {...common} strokeOpacity={0.5} />
        )),
      );
    case "squareTiles":
      return [
        <rect key={`${key}-a`} x={x + 7} y={y + 7} width={9} height={9} {...common} fill={fill} strokeOpacity={0.62} />,
        <rect key={`${key}-b`} x={x + 20} y={y + 7} width={9} height={9} {...common} fill={fill} strokeOpacity={0.52} />,
        <rect key={`${key}-c`} x={x + 7} y={y + 20} width={9} height={9} {...common} fill={fill} strokeOpacity={0.52} />,
        <rect key={`${key}-d`} x={x + 20} y={y + 20} width={9} height={9} {...common} fill={fill} strokeOpacity={0.44} />,
      ];
    case "squareRow":
      return [7, 17, 27].map((dx, i) => (
        <rect key={`${key}-${i}`} x={x + dx - 4} y={c.y - 4} width={8} height={8} {...common} fill={i === 1 ? fill : "none"} strokeOpacity={0.64 - i * 0.08} />
      ));
    case "squareColumn":
      return [7, 17, 27].map((dy, i) => (
        <rect key={`${key}-${i}`} x={c.x - 4} y={y + dy - 4} width={8} height={8} {...common} fill={i === 1 ? fill : "none"} strokeOpacity={0.64 - i * 0.08} />
      ));
    case "steppedSquares":
      return [
        <rect key={`${key}-a`} x={x + 6} y={y + 6} width={8} height={8} {...common} strokeOpacity={0.6} />,
        <rect key={`${key}-b`} x={x + 14} y={y + 14} width={8} height={8} {...common} fill={fill} strokeOpacity={0.54} />,
        <rect key={`${key}-c`} x={x + 22} y={y + 22} width={8} height={8} {...common} strokeOpacity={0.48} />,
      ];
    case "cornerSquares":
      return [
        <rect key={`${key}-nw`} x={x + 5} y={y + 5} width={7} height={7} {...common} strokeOpacity={0.58} />,
        <rect key={`${key}-ne`} x={x + 24} y={y + 5} width={7} height={7} {...common} strokeOpacity={0.5} />,
        <rect key={`${key}-sw`} x={x + 5} y={y + 24} width={7} height={7} {...common} strokeOpacity={0.5} />,
        <rect key={`${key}-se`} x={x + 24} y={y + 24} width={7} height={7} {...common} fill={fill} strokeOpacity={0.44} />,
      ];
    case "splitSquares":
      return [
        <rect key={`${key}-l`} x={x + 6} y={y + 9} width={11} height={18} {...common} fill={fill} strokeOpacity={0.52} />,
        <rect key={`${key}-r`} x={x + 19} y={y + 9} width={11} height={18} {...common} strokeOpacity={0.52} />,
        <line key={`${key}-joint`} x1={x + 18} y1={y + 9} x2={x + 18} y2={y + 27} {...soft} strokeOpacity={0.34} />,
      ];
    case "diamondStack":
      return [9, 18, 27].map((dy, i) => (
        <polygon key={`${key}-${i}`} points={`${c.x},${y + dy - 5} ${c.x + 5},${y + dy} ${c.x},${y + dy + 5} ${c.x - 5},${y + dy}`} {...common} fill={i === 1 ? fill : "none"} strokeOpacity={0.62 - i * 0.08} />
      ));
    case "diamondCorners":
      return [
        <polygon key={`${key}-nw`} points={`${x + 10},${y + 5} ${x + 15},${y + 10} ${x + 10},${y + 15} ${x + 5},${y + 10}`} {...common} strokeOpacity={0.54} />,
        <polygon key={`${key}-ne`} points={`${x + 26},${y + 5} ${x + 31},${y + 10} ${x + 26},${y + 15} ${x + 21},${y + 10}`} {...common} fill={fill} strokeOpacity={0.46} />,
        <polygon key={`${key}-sw`} points={`${x + 10},${y + 21} ${x + 15},${y + 26} ${x + 10},${y + 31} ${x + 5},${y + 26}`} {...common} fill={fill} strokeOpacity={0.46} />,
        <polygon key={`${key}-se`} points={`${x + 26},${y + 21} ${x + 31},${y + 26} ${x + 26},${y + 31} ${x + 21},${y + 26}`} {...common} strokeOpacity={0.4} />,
      ];
    case "meetingLines":
      return [
        <line key={`${key}-a`} x1={x + 7} y1={y + 7} x2={c.x} y2={c.y} {...common} strokeOpacity={0.54} />,
        <line key={`${key}-b`} x1={x + 29} y1={y + 7} x2={c.x} y2={c.y} {...common} strokeOpacity={0.5} />,
        <line key={`${key}-c`} x1={c.x} y1={c.y} x2={x + 7} y2={y + 29} {...common} strokeOpacity={0.5} />,
        <line key={`${key}-d`} x1={c.x} y1={c.y} x2={x + 29} y2={y + 29} {...common} strokeOpacity={0.46} />,
        <circle key={`${key}-node`} cx={c.x} cy={c.y} r={2.4} {...common} strokeOpacity={0.44} />,
      ];
    case "chevron":
      return [
        <polyline key={`${key}-a`} points={`${x + 8},${y + 12} ${c.x},${y + 6} ${x + 28},${y + 12}`} {...common} strokeOpacity={0.54} />,
        <polyline key={`${key}-b`} points={`${x + 8},${y + 22} ${c.x},${y + 16} ${x + 28},${y + 22}`} {...common} strokeOpacity={0.46} />,
        <polyline key={`${key}-c`} points={`${x + 8},${y + 32} ${c.x},${y + 26} ${x + 28},${y + 32}`} {...common} strokeOpacity={0.38} />,
      ];
    case "parallelHatch":
      return [0, 1, 2, 3].map((i) => (
        <line key={`${key}-${i}`} x1={x + 7 + i * 6} y1={y + 29} x2={x + 17 + i * 6} y2={y + 7} {...common} strokeOpacity={0.46 - i * 0.04} />
      ));
    case "stairLines":
      return [
        <polyline key={`${key}-a`} points={`${x + 7},${y + 28} ${x + 15},${y + 28} ${x + 15},${y + 20} ${x + 23},${y + 20} ${x + 23},${y + 12} ${x + 31},${y + 12}`} {...common} strokeOpacity={0.54} />,
        <polyline key={`${key}-b`} points={`${x + 7},${y + 20} ${x + 15},${y + 20} ${x + 15},${y + 12} ${x + 23},${y + 12}`} {...soft} strokeOpacity={0.34} />,
      ];
    case "nodePath":
      return [
        <polyline key={`${key}-path`} points={`${x + 8},${y + 27} ${x + 16},${y + 15} ${x + 25},${y + 22} ${x + 29},${y + 8}`} {...common} strokeOpacity={0.48} />,
        <circle key={`${key}-a`} cx={x + 8} cy={y + 27} r={2.4} {...common} strokeOpacity={0.48} />,
        <circle key={`${key}-b`} cx={x + 16} cy={y + 15} r={2.4} {...common} strokeOpacity={0.48} />,
        <circle key={`${key}-c`} cx={x + 25} cy={y + 22} r={2.4} {...common} strokeOpacity={0.48} />,
        <circle key={`${key}-d`} cx={x + 29} cy={y + 8} r={2.4} {...common} strokeOpacity={0.48} />,
      ];
    case "bracketBox":
      return [
        <path key={`${key}-tl`} d={`M ${x + 8} ${y + 16} V ${y + 8} H ${x + 16}`} {...common} strokeOpacity={0.52} />,
        <path key={`${key}-tr`} d={`M ${x + 20} ${y + 8} H ${x + 28} V ${y + 16}`} {...common} strokeOpacity={0.46} />,
        <path key={`${key}-br`} d={`M ${x + 28} ${y + 20} V ${y + 28} H ${x + 20}`} {...common} strokeOpacity={0.46} />,
        <path key={`${key}-bl`} d={`M ${x + 16} ${y + 28} H ${x + 8} V ${y + 20}`} {...common} strokeOpacity={0.4} />,
        <rect key={`${key}-center`} x={x + 14} y={y + 14} width={8} height={8} {...common} fill={fill} strokeOpacity={0.34} />,
      ];
  }
}

/* ── CSS ─────────────────────────────────────────────────────── */

const STYLE_BLOCK = `
@keyframes hlf-draw {
  0%   { stroke-dashoffset: 1; opacity: 0; }
  4%   { opacity: 1; }
  32%  { stroke-dashoffset: 0; }
  68%  { stroke-dashoffset: 0; }
  96%  { opacity: 1; }
  100% { stroke-dashoffset: -1; opacity: 0; }
}
@keyframes hlf-frame-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes hlf-panel-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes hlf-token-rewrite {
  0% { opacity: 0; transform: translateY(3px); filter: blur(1px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes hlf-type-line {
  0% { clip-path: inset(0 100% 0 0); opacity: 0.4; }
  60% { opacity: 1; }
  100% { clip-path: inset(0 0 0 0); opacity: 1; }
}
@keyframes hlf-caret-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes hlf-apply-style {
  0% { box-shadow: none; filter: none; }
  40% { box-shadow: 0 0 0 1.5px var(--s-primary), 0 0 16px color-mix(in oklch, var(--s-primary) 16%, transparent); filter: brightness(1.03); }
  100% { box-shadow: 0 0 0 1px color-mix(in oklch, var(--s-primary) 28%, transparent); filter: none; }
}
@keyframes hlf-cursor-click {
  0% { transform: scale(1); }
  30% { transform: scale(0.72) translateY(2px); }
  55% { transform: scale(0.72) translateY(2px); }
  100% { transform: scale(1); }
}
.hero-logo-field {
  --hlf-pri: var(--s-primary, oklch(0.55 0.2 275));
  --hlf-mid: color-mix(
    in oklch,
    var(--s-primary, oklch(0.55 0.2 275)) 84%,
    var(--s-text-muted, oklch(0.55 0 0))
  );
  position: relative;
  width: 100%;
}
.hero-logo-field__grid {
  width: 100%;
}
.hero-logo-field__inspect-frame {
  stroke-dasharray: 432;
  stroke-dashoffset: 432;
  animation: hlf-frame-draw 720ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.hero-logo-field__inspector {
  animation: hlf-panel-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-logo-field__token-line {
  animation: hlf-token-rewrite 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-logo-field__typed {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: hlf-type-line 700ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both;
}
.hero-logo-field__caret {
  animation: hlf-caret-blink 530ms step-end infinite;
  color: var(--s-primary);
  margin-left: 1px;
  font-weight: 400;
}
.hero-logo-field__apply {
  animation: hlf-apply-style 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes hlf-duration-sweep {
  /* Continuously slides a soft accent stripe across the bar from left to
     right and loops without snap-back. The animation-duration is bound via
     --hlf-tick-duration so the sweep visibly speeds up / slows down with the
     demoed duration token. */
  0%   { transform: translate3d(-100%, 0, 0); }
  100% { transform: translate3d(100%, 0, 0); }
}
.hero-logo-field__duration-bar {
  --hlf-tick-color: var(--s-primary-strong, oklch(0.66 0.18 275));
  position: absolute;
  inset: auto 0 0 0;
  height: 3px;
  overflow: hidden;
  pointer-events: none;
  background: color-mix(in oklch, var(--hlf-tick-color) 22%, transparent);
}
.hero-logo-field__duration-bar::after {
  content: "";
  position: absolute;
  inset: 0;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in oklch, var(--hlf-tick-color) 60%, transparent) 20%,
    var(--hlf-tick-color) 50%,
    color-mix(in oklch, var(--hlf-tick-color) 60%, transparent) 80%,
    transparent 100%
  );
  will-change: transform;
  /* Linear timing keeps the sweep at constant velocity — the whole point of
     a duration demo is to show the speed faithfully. */
  animation: hlf-duration-sweep var(--hlf-tick-duration, 600ms) linear infinite;
}
/* Live "•" dot pulsing next to the p99 readout in the requests/min card —
   reads as "this stream is live", not "this is a static screenshot". */
@keyframes hlf-live-pulse {
  0%, 100% { opacity: 1;   transform: scale(1); }
  50%      { opacity: 0.35; transform: scale(0.7); }
}
.hero-logo-field__live-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  box-shadow: 0 0 6px currentColor;
  animation: hlf-live-pulse 1.4s ease-in-out infinite;
}

.hero-logo-field__line-active {
  /* Loading state — neutral white tint so it reads as "in flight" rather
     than "applied". Turns primary-blue once isDone via __line-done. */
  background: color-mix(in oklch, var(--s-text) 10%, transparent);
  border-left-color: color-mix(in oklch, var(--s-text) 70%, transparent);
  transition: background-color var(--s-duration-normal, 200ms), border-color var(--s-duration-normal, 200ms);
}
.hero-logo-field__line-done {
  border-left-color: color-mix(in oklch, oklch(0.66 0.18 275) 60%, transparent);
}
`;

/* ── Shared render helper ────────────────────────────────────── */

function renderVariant(elements: V) {
  return elements.map((el, i) =>
    cloneElement(el as React.ReactElement<React.SVGProps<SVGElement>>, {
      style: {
        strokeDasharray: 1,
        strokeDashoffset: 1,
        animation: `hlf-draw ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) ${i * STAGGER_MS}ms both`,
      },
    }),
  );
}

/* ── Components ──────────────────────────────────────────────── */

const STEP_KEYS = [
  "UsageCard", "PresetSwatches", "DatePicker", "TokenAction",
  "KPI", "CommitGrid", "Badges", "Coverage",
  "SparkLine", "Stack", "Sliders", "Switches", "Buttons",
] as const;

const TOTAL_STEPS = 13;

const ALL_STEP_INDICES = Array.from({ length: STEP_KEYS.length }, (_, i) => i);

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const COMMIT_DAYS = (() => {
  const days: { date: string; count: number }[] = [];
  const rand = seededRandom(42);
  const base = new Date(Date.UTC(2026, 2, 1));
  for (let i = 111; i >= 0; i--) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + (112 - i));
    days.push({ date: d.toISOString().split("T")[0], count: Math.floor(rand() * 7 * (1 + Math.sin(i / 4))) });
  }
  return days;
})();

export function HeroLogoField({ intro }: { intro?: React.ReactNode }) {
  const { setPreset, preloadPreset } = useSigilActions();
  const [demoVisible, setDemoVisible] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const [appliedSet, setAppliedSet] = useState<Set<string>>(new Set());
  const appliedQueue = useRef<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => new Date());
  const [formats, setFormats] = useState<string[]>(["bold"]);
  const [tokenFileName, setTokenFileName] = useState("DESIGN.md");
  const [spacingValue, setSpacingValue] = useState(16);
  const [radiusValue, setRadiusValue] = useState(8);
  const [switchState, setSwitchState] = useState<Record<string, boolean>>({
    sound: false,
    motion: true,
    live: true,
  });

  const wrapRef = useRef<HTMLDivElement>(null);
  const demoAnimating = demoVisible && motionAllowed && switchState.motion;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!media.matches && !document.hidden);
    update();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([entry]) => setDemoVisible(entry.isIntersecting));
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const mdScrollRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selRect, setSelRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [cursorTarget, setCursorTarget] = useState<{ left: number; top: number } | null>(null);
  const [clicking, setClicking] = useState(false);
  const [labelParts, setLabelParts] = useState<{ prefix: string; value: string; isNew: boolean } | null>(null);
  const activeStepIndices = ALL_STEP_INDICES;

  const setComponentRef = useCallback((key: string) => (el: HTMLDivElement | null) => {
    componentRefs.current[key] = el;
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);



  useEffect(() => {
    if (!mounted || !demoAnimating) return;
    const interval = setInterval(() => {
      if (isPresetSwitching()) return;
      setPhase((current) => {
        if (current >= 3) {
          const currentKey = STEP_KEYS[ALL_STEP_INDICES[idx % ALL_STEP_INDICES.length]];
          appliedQueue.current = [...appliedQueue.current.filter((k) => k !== currentKey), currentKey];
          setAppliedSet(new Set(appliedQueue.current));
          const nextIdx = idx + 1;
          if (nextIdx >= ALL_STEP_INDICES.length) {
            setTimeout(() => {
              appliedQueue.current = [];
              setAppliedSet(new Set());
              setIdx(0);
            }, 1200);
          } else {
            setIdx(nextIdx);
          }
          return 0;
        }
        return current + 1;
      });
    }, PHASE_MS);
    return () => clearInterval(interval);
  }, [mounted, idx, demoAnimating]);

  useEffect(() => {
    if (phase < 1) {
      setSelRect(null);
      return;
    }
    const target = componentRefs.current[STEP_KEYS[activeStepIndices[idx % activeStepIndices.length]]];
    if (!target) return;
    const pad = SELECTION_PAD;
    setSelRect({
      top: target.offsetTop - pad,
      left: target.offsetLeft - pad,
      width: target.offsetWidth + pad * 2,
      height: target.offsetHeight + pad * 2,
    });
  }, [idx, phase, activeStepIndices]);

  useEffect(() => {
    const target = componentRefs.current[STEP_KEYS[activeStepIndices[idx % activeStepIndices.length]]];
    if (!target) return;
    const pad = SELECTION_PAD;
    setCursorTarget({
      left: target.offsetLeft + target.offsetWidth + pad - 10,
      top: target.offsetTop + target.offsetHeight + pad - 10,
    });
  }, [idx, mounted, activeStepIndices]);

  useEffect(() => {
    if (phase === 1) {
      setClicking(true);
      const t = setTimeout(() => setClicking(false), 400);
      return () => clearTimeout(t);
    }
  }, [phase, idx]);

  useEffect(() => {
    if (phase !== 2 || !demoAnimating) {
      setLabelParts(null);
      return;
    }
    const token = HERO_CURSOR_STEPS[activeStepIndices[idx % activeStepIndices.length]];
    const ci = token.before.indexOf(": ");
    const prefix = ci >= 0 ? token.before.slice(0, ci + 2) : "";
    const oldVal = ci >= 0 ? token.before.slice(ci + 2) : token.before;
    const ni = token.line.indexOf(": ");
    const newVal = ni >= 0 ? token.line.slice(ni + 2) : token.line;

    let cancelled = false;
    let step = 0;
    const total = oldVal.length;

    setLabelParts({ prefix, value: oldVal, isNew: false });

    const tick = () => {
      if (cancelled) return;
      if (isPresetSwitching()) { setTimeout(tick, 50); return; }
      step++;
      if (step <= total) {
        setLabelParts({ prefix, value: oldVal.slice(0, total - step), isNew: false });
        setTimeout(tick, 25);
      } else {
        const t = step - total;
        if (t <= newVal.length) {
          setLabelParts({ prefix, value: newVal.slice(0, t), isNew: true });
          if (t < newVal.length) setTimeout(tick, 35);
        }
      }
    };
    const delay = setTimeout(tick, 80);
    return () => { cancelled = true; clearTimeout(delay); };
  }, [phase, idx, demoAnimating]);

  useEffect(() => {
    const container = mdScrollRef.current;
    if (!container) return;
    const activeLine = container.querySelector("[data-active-token]") as HTMLElement | null;
    if (activeLine) {
      const lineTop = activeLine.offsetTop - container.offsetTop;
      const lineBottom = lineTop + activeLine.offsetHeight;
      const viewTop = container.scrollTop;
      const viewBottom = viewTop + container.clientHeight;
      if (lineTop < viewTop) {
        container.scrollTop = lineTop - 4;
      } else if (lineBottom > viewBottom) {
        container.scrollTop = lineBottom - container.clientHeight + 4;
      }
    }
  }, [idx]);

  const lastSelRect = useRef(selRect);
  if (selRect) lastSelRect.current = selRect;
  const displayRect = selRect ?? lastSelRect.current;

  const activeStepIndex = activeStepIndices[idx % activeStepIndices.length];
  const activeToken = HERO_CURSOR_STEPS[activeStepIndex];
  const activeComponent = activeToken.component;
  const isSelecting = phase >= 1;
  const isTyping = phase >= 2;
  const isApplied = phase >= 3;

  const applied = (name: string) => appliedSet.has(name) || (activeComponent === name && isApplied);
  const radiusApplied = applied("DatePicker") || (activeComponent === "DatePicker" && isTyping);

  const containerHeight = containerRef.current?.clientHeight ?? 0;
  const containerWidth = containerRef.current?.clientWidth ?? 0;
  const flipLabel = selRect ? (selRect.top + selRect.height + 36) > containerHeight : false;

  const overlayCenterX = (displayRect?.left ?? 0) + (displayRect?.width ?? 0) / 2;
  const labelPlacement: React.CSSProperties = overlayCenterX < containerWidth * 0.3
    ? { left: SELECTION_PAD }
    : overlayCenterX > containerWidth * 0.7
      ? { right: SELECTION_PAD }
      : { left: "50%", transform: "translateX(-50%)" };
  const labelMaxWidth = containerWidth > 0 ? containerWidth - 16 : undefined;

  const mono9: React.CSSProperties = { fontFamily: "var(--s-font-mono)", fontSize: "var(--s-hero-demo-label)", letterSpacing: "0.08em", textTransform: "none" };
  const mono10: React.CSSProperties = { fontFamily: "var(--s-font-mono)", fontSize: "var(--s-hero-demo-label)", lineHeight: 1.62 };
  const cellBg = "var(--s-surface, var(--s-background))";

  return (
    <div
      ref={wrapRef}
      className="hero-logo-field"
      data-hero-intro={Boolean(intro)}
      style={{
        overflow: "visible",
        width: "100%",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLE_BLOCK }} />

      <div
        ref={containerRef}
        className="grid hero-logo-field__grid"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 400ms cubic-bezier(0.32, 0.72, 0, 1)",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gridTemplateRows: "auto auto auto",
          gap: "var(--s-hero-demo-gap)",
          width: "100%",
          position: "relative",
        }}
      >
        {intro && <div className="sigil-hero-intro">{intro}</div>}
        {/* Row 1: DESIGN.md (3 cols) + UsageCard (2) + PresetSwatches (2) */}
        <div
          className="sigil-hero-spec"
          style={{
            height: "100%",
            border: "var(--s-border-thin,1px) var(--s-border-style,solid) var(--s-border-strong, var(--s-border))",
            borderRadius: "var(--s-radius-md,8px)",
            background: "var(--s-surface, var(--s-background))",
            overflow: "hidden",
            boxShadow: "var(--s-shadow-md, 0 2px 8px rgb(0 0 0 / 0.08))",
            display: "flex",
            flexDirection: "column",
          } as React.CSSProperties}
        >
          <div style={{ ...mono9, fontSize: "var(--s-hero-demo-label)", borderBottom: "var(--s-border-thin,1px) var(--s-border-style,solid) var(--s-border)", padding: "calc(var(--s-grid-cell, 40px) / 10) calc(var(--s-grid-cell, 40px) / 5)", color: "var(--s-text)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--s-surface-elevated, var(--s-surface))", flexShrink: 0 }}>
            <span style={{ fontWeight: 700 }}>DESIGN.md</span>
            <span style={{ fontSize: "var(--s-hero-demo-label)", color: "var(--s-text-muted)" }}>{appliedSet.size}/{activeStepIndices.length}</span>
          </div>
          <div ref={mdScrollRef} style={{ ...mono10, padding: "calc(var(--s-grid-cell, 40px) / 10) calc(var(--s-grid-cell, 40px) / 5)", fontSize: "var(--s-hero-demo-label)", lineHeight: 1.5, flex: 1, minHeight: 0, overflow: "hidden" }}>
            {TOKEN_SECTIONS.map((section, si) => {
              const Icon = section.icon;
              return (
                <React.Fragment key={section.name}>
                  <div style={{ color: "var(--s-text)", fontWeight: 700, marginTop: si > 0 ? 2 : 0, fontSize: "var(--s-hero-demo-label)" }}>
                    {section.name}
                  </div>
                  {section.indices.map((stepIdx) => {
                    const t = HERO_TOKEN_STEPS[stepIdx];
                    const step = HERO_CURSOR_STEPS[stepIdx];
                    const isActive = activeToken.token === t.token;
                    const isDone = applied(step.component);
                    return (
                      <div
                        key={t.token}
                        {...(isActive ? { "data-active-token": true } : {})}
                        className={isActive ? "hero-logo-field__line-active" : isDone ? "hero-logo-field__line-done" : undefined}
                        // Loading (isActive, mid-typing) reads as plain white;
                        // turns the bright accent purple once the update has
                        // been applied. Uses an explicit literal because
                        // var(--s-primary) is light-gray in dark mode and
                        // wouldn't visually differentiate from the loading
                        // state.
                        style={{ color: isDone ? "oklch(0.66 0.18 275)" : isActive ? "var(--s-text)" : "var(--s-text-muted)", transition: "color 300ms", paddingLeft: 6, borderLeft: "2px solid transparent", display: "flex", alignItems: "center", gap: 3, minWidth: 0, overflow: "hidden" }}
                      >
                        <Icon size={7} style={{ opacity: 0.4, flexShrink: 0 }} />
                        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {isActive && isTyping && labelParts ? (
                            <>{labelParts.prefix}{labelParts.value}</>
                          ) : (
                            <OklchText>{isDone ? t.line : t.before}</OklchText>
                          )}
                        </span>
                        {isDone && !isActive ? <span style={{ flexShrink: 0 }}>✓</span> : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div
          className="sigil-hero-live"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gridTemplateRows: "auto minmax(0, 1fr) auto",
            gap: "var(--s-hero-demo-gap)",
            alignSelf: "stretch",
          }}
        >
        <div
          ref={setComponentRef("UsageCard")} data-demo-cell="UsageCard"
          style={{
            gridColumn: "1 / 5",
            ...(applied("UsageCard") ? { "--s-primary": "oklch(0.66 0.18 275)" } : {}),
          } as React.CSSProperties}
        >
          <Card
            className={`overflow-hidden h-full ${applied("UsageCard") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("UsageCard") ? "var(--s-primary)" : "var(--s-border)",
              background: applied("UsageCard") ? "color-mix(in oklch, var(--s-primary) 8%, var(--s-surface, var(--s-background)))" : cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="pt-1.5 pb-0.5 px-1.5">
              <div className="flex items-center justify-between">
                <span style={{ ...mono9, fontSize: "var(--s-hero-demo-label)", color: "var(--s-text-muted)" }}>Usage</span>
                <Badge size="sm" className="text-[length:var(--s-hero-demo-label)] px-1 py-0" style={applied("UsageCard") ? { background: "var(--s-primary)", borderColor: "var(--s-primary)" } : undefined}>Live</Badge>
              </div>
              <div className="font-[family-name:var(--s-font-mono)] text-[length:var(--s-size-xl)] font-bold tabular-nums leading-tight" style={{ color: applied("UsageCard") ? "var(--s-primary)" : "var(--s-text)", transition: "color 600ms" }}>12.4k</div>
              <Progress value={applied("UsageCard") ? 88 : 72} className="mt-1 h-[3px]" />
            </CardContent>
          </Card>
        </div>

        <div ref={setComponentRef("PresetSwatches")} data-demo-cell="PresetSwatches" style={{ gridColumn: "5 / 8" }}>
          <Card
            className={`overflow-hidden h-full ${applied("PresetSwatches") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("PresetSwatches") ? "var(--s-primary)" : "var(--s-border)",
              background: applied("PresetSwatches") ? "color-mix(in oklch, var(--s-primary) 8%, var(--s-surface, var(--s-background)))" : cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="p-1 px-1.5 flex flex-col justify-center h-full">
              <div className="mb-0.5" style={{ ...mono9, fontSize: "var(--s-hero-demo-label)", color: "var(--s-text-muted)" }}>Preset</div>
              {[PRESET_SWATCH_ROW_A, PRESET_SWATCH_ROW_B].map((row, rowIdx) => (
                <div key={rowIdx} className={rowIdx === 0 ? "flex gap-1" : "flex mt-1 gap-1"}>
                  {row.map((swatch, itemIdx) => {
                    const isActive = applied("PresetSwatches")
                      ? rowIdx === 0 && itemIdx === 0
                      : rowIdx === 0 && itemIdx === activeStepIndex % row.length;
                    return (
                      <button
                        key={swatch.name}
                        type="button"
                        aria-label={swatch.name}
                        title={swatch.name}
                        onPointerEnter={() => void preloadPreset(swatch.name)}
                        onFocus={() => void preloadPreset(swatch.name)}
                        onClick={() => void setPreset(swatch.name)}
                        className="shrink-0 cursor-pointer p-0 transition-transform duration-[var(--s-duration-fast,150ms)] hover:scale-110"
                        style={{
                          width: "var(--s-hero-demo-icon)",
                          height: "var(--s-hero-demo-icon)",
                          background: swatch.color,
                          borderRadius: "var(--s-radius-sm,3px)",
                          border: isActive
                            ? `1.5px solid var(--s-text)`
                            : `1px solid color-mix(in oklch, ${swatch.color} 60%, var(--s-border))`,
                          boxShadow: isActive
                            ? `0 0 0 1.5px var(--s-background), 0 0 0 2.5px ${swatch.color}`
                            : "none",
                          transform: isActive ? "scale(1.08)" : "scale(1)",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Row 2: DatePicker spans the right stack. The wrapper flexes vertically
            so the Calendar fills the leftover height in the column, which
            bottom-aligns the right side with the DESIGN.md panel. */}
        <div
          ref={setComponentRef("DatePicker")} data-demo-cell="DatePicker"
          className={`overflow-hidden ${radiusApplied ? "hero-logo-field__apply" : ""}`}
          style={{
            gridColumn: "1 / 8",
            // Wrapper fills row 2 so the calendar shrinks/grows to match the
            // height the panel makes available.
            height: "100%",
            display: "flex",
            flexDirection: "column",
            border: `var(--s-border-thin,1px) var(--s-border-style,solid) ${radiusApplied ? "var(--s-primary)" : "var(--s-border)"}`,
            // Literal pixel values — the demo is illustrating what
            // `radius-md: 8px → 16px` looks like, so the wrapper has to
            // render visible rounding regardless of the active preset's
            // (potentially 0px) radius tokens.
            borderRadius: radiusApplied ? "8px" : "0px",
            background: radiusApplied ? "color-mix(in oklch, var(--s-primary) 8%, var(--s-surface, var(--s-background)))" : cellBg,
            transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms), border-radius var(--s-duration-slow,600ms)",
          } as React.CSSProperties}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            fixedWeeks
            captionLayout="label"
            disableNavigation={false}
            className="border-0 rounded-none bg-transparent p-2 w-full h-full flex flex-col [--cell-size:1.25rem] [&_[data-slot=calendar-day]]:text-[length:var(--s-hero-demo-label)] [&_[data-slot=calendar-day]]:leading-none"
            // Override the Calendar component's internal class names directly
            // (the Calendar spreads user-provided classNames LAST, so these
            // fully replace the defaults rather than merge into them).
            classNames={{
              months: "relative flex flex-col flex-1 min-h-0",
              month: "flex w-full flex-col flex-1 min-h-0 gap-1",
              nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between pointer-events-none",
              button_previous: "pointer-events-auto z-[1] inline-flex h-[var(--s-space-24)] w-[var(--s-space-24)] items-center justify-center rounded-[var(--s-radius-sm,4px)] text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:bg-[var(--s-surface)] select-none",
              button_next: "pointer-events-auto z-[1] inline-flex h-[var(--s-space-24)] w-[var(--s-space-24)] items-center justify-center rounded-[var(--s-radius-sm,4px)] text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:bg-[var(--s-surface)] select-none",
              month_caption: "flex h-5 w-full items-center justify-center px-6",
              caption_label: "text-[length:var(--s-hero-demo-label)] font-medium text-[var(--s-text)] select-none",
              month_grid: "sigil-hero-calendar-grid",
              weeks: "sigil-hero-calendar-weeks",
              weekdays: "flex h-[var(--s-space-24)]",
              weekday: "flex-1 text-center font-[family-name:var(--s-font-mono,inherit)] text-[length:var(--s-hero-demo-label)] font-medium uppercase tracking-[0.08em] text-[var(--s-text-muted)] inline-flex items-center justify-center select-none",
              week: "sigil-hero-calendar-week",
              day: "group/day relative aspect-auto flex-1 p-0 text-center select-none",
              day_button: "sigil-hero-calendar-day",
              outside: "text-[var(--s-text-muted)] opacity-50",
              dropdowns: "hidden",
              dropdown: "hidden",
              dropdown_root: "hidden",
            }}
          />
        </div>

        {/* Row 3: TokenAction spans right 4 cols. Wrapped in a rounded box that
            mirrors the Calendar above so the right edge + corners line up
            visually. The bottom "duration tick" bar is the actual demo: its
            animation-duration is the value being demonstrated, so the bar
            visibly speeds up (300ms) → slows down (600ms) when applied. */}
        <div ref={setComponentRef("TokenAction")} data-demo-cell="TokenAction" style={{ gridColumn: "1 / 8" }}>
          <div
            className={`relative overflow-hidden ${applied("TokenAction") ? "hero-logo-field__apply" : ""}`}
            style={{
              border: `var(--s-border-thin,1px) var(--s-border-style,solid) ${applied("TokenAction") ? "var(--s-primary)" : "var(--s-border)"}`,
              // Use the active preset's radius-md so the box matches the
              // Literal 8px to match the Calendar's idle radius — the
              // calendar's animation goes 8px → 16px, this box stays at the
              // baseline.
              background: applied("TokenAction") ? "color-mix(in oklch, var(--s-primary) 8%, var(--s-surface, var(--s-background)))" : cellBg,
              height: "var(--s-grid-cell, 40px)",
              paddingInline: "calc(var(--s-grid-cell, 40px) / 5)",
              display: "flex",
              alignItems: "center",
              transition: "background-color 600ms, border-color 600ms",
              // Bind the duration-bar sweep to the demoed duration value.
              "--hlf-tick-duration": applied("TokenAction") ? "300ms" : "600ms",
            } as React.CSSProperties}
          >
            <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-1 items-center">
              <TokensFilePicker
                accept=".md,.toml,.css"
                hasFile={tokenFileName !== "DESIGN.md"}
                onFileSelected={(file) => setTokenFileName(file.name)}
              />
              <Input
                value={tokenFileName}
                readOnly
                className={`h-7 text-[length:var(--s-hero-demo-label)] ${applied("TokenAction") ? "hero-logo-field__typed" : ""}`}
                // Re-key whenever the typed-in animation should replay (apply
                // step lands or a new file is uploaded).
                key={`${tokenFileName}-${applied("TokenAction") ? "typed" : "idle"}`}
              />
              <Button size="sm" className="h-7 px-2.5 text-[length:var(--s-hero-demo-label)]">{applied("TokenAction") ? "Saved" : "Apply"}</Button>
            </div>
            <div aria-hidden="true" className="hero-logo-field__duration-bar" />
          </div>
        </div>
        </div>

        {/* Row 4: KPI + CommitGrid + Badges + Coverage/ToggleGroup */}
        <div ref={setComponentRef("KPI")} data-demo-cell="KPI" className="h-full">
          <Card className="h-full">
          <CardContent className="sigil-hero-cell-content sigil-hero-revenue">
          <KPI
            label="Annual revenue"
            value="$7.52M"
            change="+67% this year"
            trend="up"
            className={`sigil-hero-kpi ${applied("KPI") ? "hero-logo-field__apply" : ""}`}
            style={{ fontFamily: applied("KPI") ? '"Outfit", var(--s-font-display)' : undefined }}
          />
          <SparkLine data={[18, 22, 20, 30, 26, 34, 38, 35, 47, 52, 58, 67]} width={240} height={48} color="var(--s-success)" preserveAspectRatio="none" className="sigil-hero-revenue-chart" />
          </CardContent>
          </Card>
        </div>
        <div ref={setComponentRef("CommitGrid")} data-demo-cell="CommitGrid" className="h-full">
          <Card
            className={`h-full flex items-center justify-center ${applied("CommitGrid") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("CommitGrid") ? "var(--s-primary)" : "var(--s-border)",
              background: applied("CommitGrid") ? "color-mix(in oklch, var(--s-primary) 8%, var(--s-surface, var(--s-background)))" : cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="sigil-hero-cell-content sigil-hero-activity">
              <div className="sigil-hero-cell-label"><BarChart3 /> Activity</div>
              <HeroActivity data={COMMIT_DAYS} accent={applied("CommitGrid")} />
            </CardContent>
          </Card>
        </div>
        <div ref={setComponentRef("Badges")} data-demo-cell="Badges" className="h-full min-w-0">
          <Card
            className={`h-full ${applied("Badges") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("Badges") ? "var(--s-primary)" : "var(--s-border)",
              background: cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="sigil-hero-cell-content sigil-hero-options">
              <div className="grid min-w-0 grid-cols-2 gap-1">
                <Badge size="sm" variant={appliedSet.size >= 4 ? "default" : "outline"} className="min-w-0 justify-center overflow-hidden px-0.5 text-[length:var(--s-hero-demo-label)]" style={applied("Badges") ? { borderRadius: 9999 } : undefined}>
                  {appliedSet.size >= 4 ? "Staged" : "Staging"}
                </Badge>
                <Badge size="sm" variant="outline" className="min-w-0 justify-center px-0.5 text-[length:var(--s-hero-demo-label)]" style={applied("Badges") ? { borderRadius: 9999 } : undefined}>v2.4</Badge>
              </div>
              <div className="grid min-w-0 grid-cols-3 gap-0.5">
                {["US", "EU", "AP"].map((r) => (
                  <Badge key={r} size="sm" variant="outline" className="min-w-0 justify-center px-0 text-[length:var(--s-hero-demo-label)]" style={applied("Badges") ? { borderRadius: 9999 } : undefined}>{r}</Badge>
                ))}
              </div>
              <Checkbox label="Dark" defaultChecked className="min-w-0 gap-1 [&_label]:truncate [&_label]:text-[length:var(--s-hero-demo-label)]" />
              <Checkbox label="Animate" className="min-w-0 gap-1 [&_label]:truncate [&_label]:text-[length:var(--s-hero-demo-label)]" />
            </CardContent>
          </Card>
        </div>
        <div ref={setComponentRef("Coverage")} data-demo-cell="Coverage" className="h-full">
          <Card
            className={`h-full ${applied("Coverage") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("Coverage") ? "var(--s-primary)" : "var(--s-border)",
              background: applied("Coverage") ? "color-mix(in oklch, var(--s-primary) 10%, var(--s-surface, var(--s-background)))" : cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="sigil-hero-cell-content sigil-hero-editor">
              <p
                className="sigil-hero-type-preview"
                aria-label="Typography preview"
                style={{
                  width: "100%",
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: formats.includes("mono") ? "var(--s-font-mono)" : "var(--s-font-body, var(--s-font-mono))",
                  fontSize: "var(--s-hero-demo-body)",
                  lineHeight: "var(--s-leading-normal)",
                  whiteSpace: "pre-line",
                  margin: 0,
                  color: "var(--s-text)",
                  fontWeight: formats.includes("bold") ? 700 : 400,
                  fontStyle: formats.includes("italic") ? "italic" : "normal",
                  textDecoration: [formats.includes("underline") && "underline", formats.includes("strikethrough") && "line-through"].filter(Boolean).join(" ") || "none",
                  letterSpacing: formats.includes("tracking") ? "0.08em" : undefined,
                  textTransform: formats.includes("uppercase") ? "uppercase" : undefined,
                  padding: 0,
                }}
              >{"One file. Every detail.\nColor, type, spacing, and motion.\nEvery component follows."}</p>
              <div className="flex flex-col gap-1 mt-1" style={{ flexShrink: 0 }}>
                <ToggleGroup type="multiple" value={formats} onValueChange={(v) => setFormats(Array.isArray(v) ? v : [v])} className="w-full">
                  <ToggleGroupItem value="bold" size="sm" className="text-[length:var(--s-hero-demo-label)] min-h-[var(--s-space-24)] flex-1 font-bold" aria-label="Bold"><Bold /></ToggleGroupItem>
                  <ToggleGroupItem value="italic" size="sm" className="text-[length:var(--s-hero-demo-label)] min-h-[var(--s-space-24)] flex-1 italic" aria-label="Italic"><Italic /></ToggleGroupItem>
                  <ToggleGroupItem value="underline" size="sm" className="text-[length:var(--s-hero-demo-label)] min-h-[var(--s-space-24)] flex-1 underline" aria-label="Underline"><Underline /></ToggleGroupItem>
                  <ToggleGroupItem value="strikethrough" size="sm" className="text-[length:var(--s-hero-demo-label)] min-h-[var(--s-space-24)] flex-1 line-through" aria-label="Strikethrough"><Strikethrough /></ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup type="multiple" value={formats} onValueChange={(v) => setFormats(Array.isArray(v) ? v : [v])} className="w-full">
                  <ToggleGroupItem value="uppercase" size="sm" className="text-[length:var(--s-hero-demo-label)] min-h-[var(--s-space-24)] flex-1 uppercase">Aa</ToggleGroupItem>
                  <ToggleGroupItem value="tracking" size="sm" className="text-[length:var(--s-hero-demo-label)] min-h-[var(--s-space-24)] flex-1 tracking-widest">T↔</ToggleGroupItem>
                  <ToggleGroupItem value="mono" size="sm" className="text-[length:var(--s-hero-demo-label)] min-h-[var(--s-space-24)] flex-1 font-mono">{'</>'}</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 5: SparkLine + Team + Sliders + Switches + Buttons */}
        <div ref={setComponentRef("SparkLine")} data-demo-cell="SparkLine" className="h-full">
          <Card
            className={`h-full ${applied("SparkLine") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("SparkLine") ? "var(--s-primary)" : "var(--s-border)",
              background: applied("SparkLine") ? "color-mix(in oklch, var(--s-primary) 8%, var(--s-surface, var(--s-background)))" : cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="sigil-hero-cell-content sigil-hero-requests">
              <LiveRequestsCard accent={applied("SparkLine")} active={demoAnimating && switchState.live} />
            </CardContent>
          </Card>
        </div>
        <div ref={setComponentRef("Stack")} data-demo-cell="Stack" className="h-full min-w-0">
          <Card
            className={`h-full ${applied("Stack") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("Stack") ? "var(--s-primary)" : "var(--s-border)",
              background: cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="sigil-hero-cell-content"><HeroStack enlarged={applied("Stack")} /></CardContent>
          </Card>
        </div>
        <div ref={setComponentRef("Sliders")} data-demo-cell="Sliders" className="h-full">
          <Card
            className={`h-full ${applied("Sliders") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("Sliders") ? "var(--s-primary)" : "var(--s-border)",
              borderStyle: applied("Sliders") ? "dashed" : undefined,
              background: cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="sigil-hero-cell-content sigil-hero-sliders">
              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="sigil-hero-cell-label"><Ruler /> Spacing</span>
                  <span className="font-[family-name:var(--s-font-mono)] tabular-nums" style={{ fontSize: "var(--s-hero-demo-label)", color: "var(--s-text)" }}>{spacingValue}px</span>
                </div>
                <Slider value={[spacingValue]} onValueChange={(v: number[]) => setSpacingValue(v[0])} min={4} max={48} step={4} aria-label="Spacing" className="w-full" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="sigil-hero-cell-label"><SquareSlash /> Radius</span>
                  <span className="font-[family-name:var(--s-font-mono)] tabular-nums" style={{ fontSize: "var(--s-hero-demo-label)", color: "var(--s-text)" }}>{radiusValue}px</span>
                </div>
                <Slider value={[radiusValue]} onValueChange={(v: number[]) => setRadiusValue(v[0])} min={0} max={24} step={2} aria-label="Radius" className="w-full"  />
              </div>
            </CardContent>
          </Card>
        </div>
        <div ref={setComponentRef("Switches")} data-demo-cell="Switches" className="h-full">
          <Card
            className={`h-full ${applied("Switches") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("Switches") ? "var(--s-primary)" : "var(--s-border)",
              background: applied("Switches") ? "color-mix(in oklch, var(--s-primary) 28%, var(--s-surface, var(--s-background)))" : cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="sigil-hero-cell-content sigil-hero-switches">
              {[
                { id: "sound", icon: Volume2, label: "Sound" },
                { id: "motion", icon: Sparkles, label: "Motion" },
                { id: "live", icon: Radio, label: "Live" },
              ].map(({ id, icon: Icon, label }) => {
                const checked = switchState[id] ?? false;
                const toggle = () =>
                  setSwitchState((prev) => ({ ...prev, [id]: !prev[id] }));
                return (
                  <label
                    key={id}
                    htmlFor={`hlf-switch-${id}`}
                    className="flex items-center justify-between gap-2 cursor-pointer select-none"
                  >
                    <span className="inline-flex items-center gap-1 min-w-0">
                      <Icon className="shrink-0" style={{ color: checked ? "var(--s-text)" : "var(--s-text-muted)" }} />
                      <span
                        className="font-[family-name:var(--s-font-body)] truncate"
                        style={{ fontSize: "var(--s-hero-demo-label)", color: checked ? "var(--s-text)" : "var(--s-text-muted)" }}
                      >
                        {label}
                      </span>
                    </span>
                    {/* Switch radius is left to the active preset's
                        --s-radius-full (so it reads sharp in the default
                        preset, pill in rounded presets, etc.) */}
                    <Switch
                      id={`hlf-switch-${id}`}
                      size="sm"
                      checked={checked}
                      onCheckedChange={toggle}
                      className="shrink-0"
                    />
                  </label>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <div ref={setComponentRef("Buttons")} data-demo-cell="Buttons" className="h-full">
          <Card
            className={`h-full ${applied("Buttons") ? "hero-logo-field__apply" : ""}`}
            style={{
              borderColor: applied("Buttons") ? "var(--s-primary)" : "var(--s-border)",
              background: cellBg,
              transition: "background-color var(--s-duration-slow,600ms), border-color var(--s-duration-slow,600ms)",
            }}
          >
            <CardContent className="sigil-hero-cell-content sigil-hero-buttons">
              <div
                className="sigil-hero-action-grid"
                style={{ fontFamily: applied("Buttons") ? '"Sora", var(--s-font-body)' : undefined }}
              >
                <Button size="sm" className="w-full justify-center"><Rocket />Primary</Button>
                <Button size="sm" variant="outline" className="w-full justify-center"><Shield />Outline</Button>
                <Button size="sm" variant="secondary" className="w-full justify-center"><Heart />Secondary</Button>
                <Button size="sm" variant="ghost" className="w-full justify-center"><Code />Ghost</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Selection overlay (ref-measured, always rendered) ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: displayRect?.top ?? 0,
            left: displayRect?.left ?? 0,
            width: displayRect?.width ?? 0,
            height: displayRect?.height ?? 0,
            border: "var(--s-border-thin,1px) dashed color-mix(in oklch, var(--s-primary) 50%, transparent)",
            borderRadius: "var(--s-radius-md,8px)",
            background: "color-mix(in oklch, var(--s-primary) 6%, transparent)",
            opacity: selRect ? 1 : 0,
            transition: "opacity 300ms cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div
            key={`sel-${activeComponent}-${idx}`}
            style={{
              position: "absolute",
              ...labelPlacement,
              ...(flipLabel ? { top: -32 } : { bottom: -32 }),
              padding: "5px 10px",
              background: "var(--s-background)",
              border: "var(--s-border-thin,1px) var(--s-border-style,solid) var(--s-border-interactive, var(--s-primary))",
              borderRadius: "var(--s-radius-sm,4px)",
              boxShadow: "var(--s-shadow-md, 0 4px 12px rgb(0 0 0 / 0.1))",
              fontFamily: "var(--s-font-mono)",
              fontSize: "var(--s-hero-demo-label)",
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              width: "max-content",
              maxWidth: labelMaxWidth,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {!isTyping && (
              <span style={{ color: "var(--s-text-muted)" }}><OklchText>{activeToken.before}</OklchText></span>
            )}
            {isTyping && !isApplied && labelParts && (
              <>
                <span style={{ color: "var(--s-text-muted)" }}>{labelParts.prefix}</span>
                <span style={{ color: labelParts.isNew ? "var(--s-primary)" : "var(--s-text-muted)" }}>
                  {labelParts.value}
                </span>
                <span className="hero-logo-field__caret">│</span>
              </>
            )}
            {isApplied && (
              <>
                <span style={{ color: "var(--s-primary)" }}><OklchText>{activeToken.line}</OklchText></span>
                <span style={{ color: "var(--s-success, #10b981)" }}>✓</span>
              </>
            )}
          </div>
        </div>

        {/* ── Cursor (moves independently, clicks on select) ─── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: cursorTarget?.left ?? 0,
            top: cursorTarget?.top ?? 0,
            opacity: cursorTarget ? 1 : 0,
            color: "var(--s-primary)",
            transition: "left 600ms cubic-bezier(0.16,1,0.3,1), top 600ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease",
            pointerEvents: "none",
            zIndex: 11,
            filter: "drop-shadow(0 2px 6px color-mix(in oklch, var(--s-primary) 22%, transparent))",
          }}
        >
          <div
            key={`cursor-${idx}`}
            style={{
              transformOrigin: "3px 3px",
              animation: clicking ? "hlf-cursor-click 350ms cubic-bezier(0.16,1,0.3,1)" : undefined,
            }}
          >
            <svg width="20" height="26" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L18 15L11 16.5L8.5 24L3 3Z" fill="var(--s-background)" stroke="var(--s-primary)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FooterLogo() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPresetSwitching()) return;
      setIdx((i) => (i + 1) % VARIANTS.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  const variant = VARIANTS[idx];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE_BLOCK }} />
      <svg
        key={idx}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={32}
        className="hero-logo-field"
        style={{ color: "var(--s-text-muted)" }}
        aria-hidden="true"
      >
        {renderVariant(variant)}
      </svg>
    </>
  );
}

export function FooterQuadrantDiagram() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPresetSwitching()) return;
      setIdx((i) => (i + 1) % HERO_VARIANTS.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE_BLOCK }} />
      <svg
        key={idx}
        viewBox="-12 -12 144 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-logo-field"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          color: "var(--s-primary)",
        }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="hlf-hatch-pri" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
            <line x1="0" y1="0" x2="0" y2="3" stroke={P} strokeWidth="0.25" opacity="0.55" />
          </pattern>
          <pattern id="hlf-hatch-pri-soft" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
            <line x1="0" y1="0" x2="0" y2="3" stroke={P} strokeWidth="0.25" opacity="0.34" />
          </pattern>
          <pattern id="hlf-hatch-mid" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="3" stroke={P} strokeWidth="0.25" opacity="0.5" />
          </pattern>
          <pattern id="hlf-hatch-mid-soft" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="3" stroke={P} strokeWidth="0.25" opacity="0.32" />
          </pattern>
          <pattern id="hlf-hatch-neutral" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={P} strokeWidth="0.25" opacity="0.22" />
          </pattern>
        </defs>
        <g opacity={0.58}>{renderVariant(HERO_BLUEPRINT)}</g>
        <g opacity={0.95}>{renderVariant(HERO_VARIANTS[idx])}</g>
      </svg>
    </>
  );
}

export function FooterComponentDiagram() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE_BLOCK }} />
      <svg
        viewBox="-12 -12 144 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-logo-field"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          color: "var(--s-primary)",
        }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="hlf-footer-component-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={P} strokeWidth="0.25" opacity="0.28" />
          </pattern>
          <pattern id="hlf-hatch-neutral" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={P} strokeWidth="0.25" opacity="0.22" />
          </pattern>
          <pattern id="hlf-hatch-pri" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
            <line x1="0" y1="0" x2="0" y2="3" stroke={P} strokeWidth="0.25" opacity="0.55" />
          </pattern>
          <pattern id="hlf-hatch-pri-soft" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
            <line x1="0" y1="0" x2="0" y2="3" stroke={P} strokeWidth="0.25" opacity="0.34" />
          </pattern>
          <pattern id="hlf-hatch-mid-soft" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="3" stroke={P} strokeWidth="0.25" opacity="0.32" />
          </pattern>
        </defs>
        <rect x={2} y={2} width={116} height={116} stroke={P} {...G} fill="url(#hlf-footer-component-hatch)" strokeOpacity={0.46} />
        <g opacity={0.95}>{renderVariant(HERO_COMPONENT_DRAWING)}</g>
      </svg>
    </>
  );
}

export function NavbarLogo() {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
    >
      <polygon points="0,0 56,0 56,32 40,40 40,56 0,56" fill="currentColor" />
      <polygon points="120,0 120,56 88,56 80,40 64,40 64,0" fill="currentColor" />
      <polygon points="0,120 0,64 32,64 40,80 56,80 56,120" fill="currentColor" />
      <polygon points="120,120 64,120 64,88 80,80 80,64 120,64" fill="var(--s-primary, #6366f1)" />
    </svg>
  );
}
