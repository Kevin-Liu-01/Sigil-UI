"use client";

import {
  useState,
  useId,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

import { useSigilActions, useSigilTokenRevision } from "./sandbox/token-provider";
import { useStudioControlValue } from "./studio-control-value";
import { EASING_PRESETS, parseBezier, sampleBezierY, springBounce, springToCss, timeToPhysics, physicsToTime, type SpringParams } from "@/lib/studio-motion";

/* ================================================================== */
/*  Shared styling constants                                           */
/* ================================================================== */

const FONT = "var(--s-font-body)";
const FONT_MONO = '"PP Fraktion Mono", ui-monospace, monospace';
const FONT_DISPLAY = "var(--s-font-display)";

/* ================================================================== */
/*  Micro Controls (match devbar style)                                */
/* ================================================================== */

function MiniSlider({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue?: string;
  onChange: (v: number) => void;
}) {
  const [draft, update] = useStudioControlValue(value, onChange);
  const pct = Math.max(0, Math.min(100, ((draft - min) / (max - min)) * 100));
  return (
    <div data-studio-row={label} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 32 }}>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 500,
          color: "var(--db-muted)",
          width: 72,
          flexShrink: 0,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, position: "relative", height: 32 }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 3,
            transform: "translateY(-50%)",
            borderRadius: 1.5,
            background: "var(--db-border)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${pct}%`,
            height: 3,
            transform: "translateY(-50%)",
            borderRadius: 1.5,
            background: "var(--db-accent)",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pct}%`,
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--db-accent)",
            border: "1.5px solid var(--db-bg)",
            boxShadow: "0 0 0 0.5px var(--db-accent)",
            pointerEvents: "none",
          }}
        />
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={draft}
          onChange={(e) => update(parseFloat(e.target.value))}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            margin: 0,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          fontWeight: 500,
          color: "var(--db-text2)",
          width: 40,
          textAlign: "right",
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {displayValue ?? value.toFixed(step < 1 ? 2 : 0)}
      </span>
    </div>
  );
}

function MiniSegmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        borderRadius: 5,
        border: "1px solid var(--db-border)",
        overflow: "hidden",
        background: "var(--db-bg)",
      }}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            style={{
              padding: "3px 10px",
              border: "none",
              background: active ? "var(--db-accent-dim)" : "transparent",
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              color: active ? "var(--db-accent)" : "var(--db-muted)",
              cursor: "pointer",
              transition: "background-color 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out",
              borderRight:
                opt !== options[options.length - 1]
                  ? "1px solid var(--db-border)"
                  : "none",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  SVG Curve Component                                                */
/* ================================================================== */

function CurveCanvas({ points, label }: { points: number[]; label?: string }) {
  const W = 220;
  const H = 90;
  const PAD_X = 8;
  const PAD_TOP = 8;
  const PAD_BOT = 4;
  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_TOP - PAD_BOT;

  const yMin = Math.min(0, ...points) - 0.05;
  const yMax = Math.max(1.05, ...points) + 0.05;

  const toX = (i: number) => PAD_X + (i / (points.length - 1)) * plotW;
  const toY = (v: number) =>
    PAD_TOP + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const pathD = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  const targetY = toY(1);

  return (
    <div
      style={{
        borderRadius: 6,
        background: "var(--db-bg)",
        border: "1px solid var(--db-border)",
        padding: "6px 2px 2px",
        position: "relative",
      }}
    >
      {label && (
        <span
          style={{
            position: "absolute",
            top: 4,
            right: 8,
            fontFamily: FONT_MONO,
            fontSize: 7,
            color: "var(--db-muted)",
            opacity: 0.5,
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
      )}
      <svg
        role="img"
        aria-label={label ? `${label} curve` : "Easing curve"}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block", width: "100%" }}
      >
        {/* target line at y=1 */}
        <line
          x1={PAD_X}
          y1={targetY}
          x2={W - PAD_X}
          y2={targetY}
          stroke="var(--db-muted)"
          strokeWidth={0.5}
          strokeDasharray="3 2"
          opacity={0.4}
        />
        {/* zero line */}
        <line
          x1={PAD_X}
          y1={toY(0)}
          x2={W - PAD_X}
          y2={toY(0)}
          stroke="var(--db-muted)"
          strokeWidth={0.5}
          opacity={0.15}
        />
        {/* curve */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--db-accent)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* endpoint dot */}
        <circle
          cx={toX(points.length - 1)}
          cy={toY(points[points.length - 1])}
          r={2}
          fill="var(--db-accent)"
        />
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  Spring Curve Editor                                                */
/* ================================================================== */

type SpringMode = "Time" | "Physics";

export type SpringCurveEditorProps = {
  duration: number;
  easing: string;
  onChange: (value: { duration: number; easing: string }) => void;
};

export function SpringCurveEditor({ duration, easing, onChange }: SpringCurveEditorProps) {
  const bounce = springBounce(easing);
  const [mode, setMode] = useState<SpringMode>("Time");
  const [physics, setPhysics] = useState<SpringParams>(() => timeToPhysics(duration, bounce));
  const emitted = useRef("");
  const pendingRevision = useRef(0);
  const revision = useSigilTokenRevision();
  const { getSnapshot } = useSigilActions();
  useEffect(() => {
    if (revision < pendingRevision.current) return;
    const signature = `${duration}:${easing}`;
    if (signature !== emitted.current) setPhysics(timeToPhysics(duration, springBounce(easing)));
  }, [duration, easing, revision]);

  const apply = (d: number, b: number) => {
    const next = { duration: Math.round(d * 1000) / 1000, easing: springToCss(b) };
    emitted.current = `${next.duration}:${next.easing}`;
    onChange(next);
    pendingRevision.current = getSnapshot().revision;
  };
  const handleTimeChange = (d: number, b: number) => {
    setPhysics(timeToPhysics(d, b));
    apply(d, b);
  };
  const handlePhysicsChange = (p: SpringParams) => {
    setPhysics(p);
    const time = physicsToTime(p);
    apply(time.duration, time.bounce);
  };
  const curvePoints = useMemo(() => sampleBezierY(parseBezier(easing) ?? EASING_PRESETS.spring), [easing]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <CurveCanvas points={curvePoints} label="Applied spring" />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 26,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 500,
            color: "var(--db-muted)",
            width: 72,
            flexShrink: 0,
          }}
        >
          Type
        </span>
        <MiniSegmented
          options={["Time", "Physics"] as const}
          value={mode}
          onChange={setMode}
        />
      </div>

      {mode === "Time" ? (
        <>
          <MiniSlider
            label="Duration"
            value={duration}
            min={0.05}
            max={2.0}
            step={0.01}
            displayValue={`${duration.toFixed(2)}s`}
            onChange={(v) => handleTimeChange(v, bounce)}
          />
          <MiniSlider
            label="Bounce"
            value={bounce}
            min={0}
            max={1}
            step={0.01}
            displayValue={bounce.toFixed(2)}
            onChange={(v) => handleTimeChange(duration, v)}
          />
        </>
      ) : (
        <>
          <MiniSlider
            label="Stiffness"
            value={physics.stiffness}
            min={10}
            max={20000}
            step={5}
            displayValue={physics.stiffness.toFixed(0)}
            onChange={(v) =>
              handlePhysicsChange({ ...physics, stiffness: v })
            }
          />
          <MiniSlider
            label="Damping"
            value={physics.damping}
            min={1}
            max={2000}
            step={1}
            displayValue={physics.damping.toFixed(0)}
            onChange={(v) =>
              handlePhysicsChange({ ...physics, damping: v })
            }
          />
          <MiniSlider
            label="Mass"
            value={physics.mass}
            min={0.1}
            max={10}
            step={0.1}
            displayValue={physics.mass.toFixed(1)}
            onChange={(v) =>
              handlePhysicsChange({ ...physics, mass: v })
            }
          />
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Easing Curve Editor                                                */
/* ================================================================== */

export type EasingCurveEditorProps = {
  easing: string;
  onEasingChange: (css: string) => void;
};

export function EasingCurveEditor({
  easing,
  onEasingChange,
}: EasingCurveEditorProps) {
  const bezier = useMemo(() => parseBezier(easing), [easing]);
  const curvePoints = useMemo(
    () => sampleBezierY(bezier ?? [0.16, 1, 0.3, 1]),
    [bezier],
  );

  const activePreset = useMemo(() => {
    if (!bezier) return null;
    for (const [name, pts] of Object.entries(EASING_PRESETS)) {
      if (
        pts.every(
          (v, i) => Math.abs(v - bezier[i]) < 0.02,
        )
      )
        return name;
    }
    return null;
  }, [bezier]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <CurveCanvas points={curvePoints} label="easing" />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {Object.entries(EASING_PRESETS).map(([name, pts]) => {
          const active = activePreset === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onEasingChange(
                  `cubic-bezier(${pts[0]}, ${pts[1]}, ${pts[2]}, ${pts[3]})`,
                )
              }
              style={{
                padding: "3px 7px",
                borderRadius: 4,
                border: active
                  ? "1px solid var(--db-accent)"
                  : "1px solid var(--db-border)",
                background: active ? "var(--db-accent-dim)" : "transparent",
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: active ? "var(--db-accent)" : "var(--db-muted)",
                cursor: "pointer",
                transition: "background-color 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out",
                lineHeight: 1.4,
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 10,
          color: "var(--db-muted)",
          opacity: 0.6,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {easing}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  SubSection (nested folder)                                         */
/* ================================================================== */

export function SubSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg
          width={8}
          height={8}
          viewBox="0 0 8 8"
          fill="none"
          stroke="var(--db-muted)"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{
            transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <path d="M2 1l4 3-4 3" />
        </svg>
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 11,
            fontWeight: 500,
            color: "var(--db-text2)",
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </span>
      </button>
      {open && <div id={contentId} style={{ paddingLeft: 14 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            paddingBottom: 6,
            borderLeft: "1px solid var(--db-border)",
            paddingLeft: 10,
          }}
        >
          {children}
        </div>
      </div>}
    </div>
  );
}
