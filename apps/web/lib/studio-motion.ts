/** Pure math shared by the Studio preview and the CSS easing it writes. */
export type BezierPoint = [number, number, number, number];
export type SpringParams = { stiffness: number; damping: number; mass: number };

export const EASING_PRESETS: Record<string, BezierPoint> = {
  "ease-out-expo": [0.16, 1, 0.3, 1],
  "ease-in-out": [0.45, 0, 0.55, 1],
  spring: [0.34, 1.56, 0.64, 1],
  bounce: [0.68, -0.55, 0.27, 1.55],
  "ease-out": [0, 0, 0.2, 1],
  "ease-in": [0.4, 0, 1, 1],
  snappy: [0.2, 0, 0, 1],
  linear: [0, 0, 1, 1],
};
const CSS_EASINGS: Record<string, BezierPoint> = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  linear: [0, 0, 1, 1],
};
export function parseBezier(css: string): BezierPoint | null {
  if (CSS_EASINGS[css.trim()]) return CSS_EASINGS[css.trim()];
  const match = css.match(/^cubic-bezier\(([^)]+)\)$/);
  if (!match) return null;
  const values = match[1].split(',').map(Number);
  if (values.length !== 4 || !values.every(Number.isFinite) || values[0] < 0 || values[0] > 1 || values[2] < 0 || values[2] > 1) return null;
  return values as BezierPoint;
}
export function sampleBezierY([x1, y1, x2, y2]: BezierPoint, steps = 120): number[] {
  const curve = (t: number, a: number, b: number) => 3 * (1-t) ** 2 * t * a + 3 * (1-t) * t*t * b + t**3;
  return Array.from({ length: steps + 1 }, (_, i) => {
    if (i === 0 || i === steps) return i / steps;
    const x = i / steps;
    let lo = 0, hi = 1;
    // CSS easing is y at a given elapsed time x, not y at parameter t.
    for (let n = 0; n < 18; n++) {
      const t = (lo + hi) / 2;
      if (curve(t, x1, x2) < x) lo = t; else hi = t;
    }
    return curve((lo + hi) / 2, y1, y2);
  });
}
export function springBounce(easing: string): number {
  const curve = parseBezier(easing);
  return curve ? Math.max(0, Math.min(1, (curve[1] - 1) / 0.56)) : 0;
}
export function springToCss(bounce: number): string {
  const b = Math.max(0, Math.min(1, bounce));
  return `cubic-bezier(${(0.34-b*0.16).toFixed(4)}, ${(1+b*0.56).toFixed(4)}, ${(0.64+b*0.08).toFixed(4)}, 1)`;
}
export function timeToPhysics(duration: number, bounce: number): SpringParams {
  const omega = 2 * Math.PI / Math.max(duration, 0.05);
  const zeta = 1 - Math.max(0, Math.min(1, bounce)) * 0.8;
  return { stiffness: omega**2, damping: 2*zeta*omega, mass: 1 };
}
export function physicsToTime({ stiffness, damping, mass }: SpringParams) {
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  return {
    duration: Math.round(Math.max(0.05, Math.min(2, 2*Math.PI/omega)) * 1000) / 1000,
    bounce: Math.max(0, Math.min(1, (1-zeta) / 0.8)),
  };
}
