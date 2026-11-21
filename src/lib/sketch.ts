/**
 * Procedural "hand-drawn" shapes for the puppy sketch cards.
 * Everything is seeded from the puppy slug, so a card always renders the
 * same wobble on the server and the client (no hydration mismatch).
 */

/** Small deterministic PRNG (mulberry32). */
export function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(2);

/**
 * A wobbly closed loop around (50,50) in a 100×100 box.
 * Radius is perturbed by a few low-frequency harmonics; the outline is
 * smoothed with Catmull-Rom splines converted to cubic Béziers.
 */
export function blob(rand: () => number, radius: number, wobble: number, opts: { from?: number; sweep?: number; steps?: number } = {}) {
  const { from = 0, sweep = Math.PI * 2, steps = 40 } = opts;
  const closed = sweep >= Math.PI * 2 - 1e-6;
  const harmonics = [2, 3, 5].map((k) => ({ k, amp: (rand() - 0.5) * wobble, phase: rand() * Math.PI * 2 }));
  const pts: [number, number][] = [];
  const n = closed ? steps : Math.max(4, Math.round((steps * sweep) / (Math.PI * 2)));
  for (let i = 0; i <= n; i++) {
    const a = from + (sweep * i) / n;
    const r = radius + harmonics.reduce((s, h) => s + h.amp * Math.sin(h.k * a + h.phase), 0);
    pts.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]);
  }
  if (closed) pts.pop();
  const at = (i: number) => (closed ? pts[(i + pts.length) % pts.length] : pts[Math.min(Math.max(i, 0), pts.length - 1)]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < segs; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

/** SVG path → CSS mask-image data URI (stretched to the element). */
export function maskUrl(d: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const WASHES = ["#f2be6b", "#bfddf5", "#fbe3b4", "#e8c39a", "#f9cdbf"];
export const INKS = ["#2a170e", "#a24a1a", "#c2622b", "#d4893f"];
export const DOODLES = ["motion", "spiral", "heart", "sparkle", "paw"] as const;
export type DoodleKind = (typeof DOODLES)[number];

export type SketchArt = {
  tilt: string;
  wash: string;
  washShift: string;
  washPath: string;
  maskPath: string;
  inkPath: string;
  retracePath: string;
  doodles: { kind: DoodleKind; x: number; y: number; rotate: number; scale: number; colour: string }[];
};

export function sketchArt(seed: string): SketchArt {
  const rand = rng(seed);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
  const retraceFrom = rand() * Math.PI * 2;
  const kinds = [...DOODLES].sort(() => rand() - 0.5).slice(0, 2);
  return {
    tilt: `${((rand() - 0.5) * 1.6).toFixed(2)}deg`,
    wash: pick(WASHES),
    washShift: `${((rand() - 0.5) * 9).toFixed(1)}% ${(3 + rand() * 4).toFixed(1)}%`,
    washPath: blob(rand, 46, 3),
    maskPath: blob(rand, 46.5, 2.6),
    inkPath: blob(rand, 48, 3.2),
    retracePath: blob(rand, 50, 3, { from: retraceFrom, sweep: Math.PI * (0.55 + rand() * 0.5), steps: 40 }),
    doodles: kinds.map((kind, i) => {
      // park doodles just outside the outline, on opposite sides
      const a = retraceFrom + Math.PI * (i === 0 ? 0.9 + rand() * 0.4 : -0.2 + rand() * 0.4);
      const r = 52 + rand() * 6;
      return {
        kind,
        x: 50 + r * Math.cos(a),
        y: 50 + r * Math.sin(a),
        rotate: Math.round((rand() - 0.5) * 36),
        scale: 0.8 + rand() * 0.2,
        colour: pick(INKS),
      };
    }),
  };
}
