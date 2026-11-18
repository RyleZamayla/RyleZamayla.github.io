import { useCallback, useEffect, useRef, useState } from "react";
import { graphEdges, graphNodes } from "../lib/skillGraph.ts";

/*
 * The skill web's secret. Explore every skill (or type the Konami code) and
 * the page dims out and a garage door appears. Scroll to raise it. Behind it
 * is a brain drawn in 3D as a cloud of light: thousands of points make up the
 * cortex, every skill is a hub, and each hub throws out a bundle of fibres.
 * Signals run along the real skill links and set off chain reactions. Drag to
 * orbit, scroll to zoom, click a hub to fire it and turn it to face you. The
 * two Garage skills are self-reported hobbies, so they sit in the cerebellum
 * as gold hubs and the page says so.
 */
const BRANCH_COLOR: Record<string, [number, number, number]> = {
  Backend: [150, 130, 255],
  Mobile: [90, 235, 180],
  Frontend: [255, 150, 90],
  Integrations: [255, 210, 90],
  Security: [255, 100, 130],
  Tooling: [120, 220, 255],
  Garage: [255, 241, 176],
};
const rgb = (c: [number, number, number], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/** Where each branch lives in the brain. x runs front (-) to back (+), y down, z across the hemispheres. */
const LOBE: Record<string, [number, number, number]> = {
  Frontend: [-0.62, -0.16, 0],
  Mobile: [-0.2, -0.62, 0],
  Backend: [0.28, -0.58, 0],
  Security: [0.64, -0.05, 0],
  Tooling: [0.15, 0.02, 0],
  Integrations: [-0.36, 0.18, 0],
  Garage: [0.52, 0.2, 0],
};

const rand = (() => {
  let s = 23;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
})();
const gauss = () => (rand() + rand() + rand() + rand() - 2) * 0.9;

/*
 * The cerebrum is built from a side profile: a domed top, a flatter underside
 * with the temporal lobe hanging low at the front, and a rounded back. Each
 * slice along its length is an ellipse, so it is wide in the middle and
 * narrow at the ends, like the real thing.
 */
const CEN = -0.14;
const env = (x: number) => Math.sqrt(Math.max(0, 1 - Math.abs(x) ** 2.2));
function profile(x: number): [number, number, number] {
  const e = env(x);
  // a little lumpy and lopsided: a fuller frontal lobe, a lower back, and the underside lifting at the front
  const lump = 1 + 0.035 * Math.sin(7 * x + 0.5) + 0.02 * Math.sin(15 * x + 2);
  const top = CEN - 0.74 * e ** 0.88 * lump - 0.06 * Math.exp(-(((x + 0.3) / 0.4) ** 2)) + 0.07 * Math.max(0, (x - 0.35) / 0.65) ** 1.5;
  const bot = CEN + 0.3 * e ** 0.8 - 0.07 * Math.exp(-(((x + 0.72) / 0.25) ** 2));
  return [(top + bot) / 2, (bot - top) / 2, 0.7 * e ** 0.55 * lump];
}
/** Gyri: ridges and valleys, so the surface reads as folded cortex. */
const ridge = (x: number, y: number, z: number) => Math.sin(9 * x + 3 * y) * Math.sin(8 * z + 2 * x) + 0.6 * Math.sin(13 * y + 5 * z) + 0.4 * Math.sin(17 * x - 7 * z);
/** Two hemispheres: each is its own rounded half, with a deep groove (the longitudinal fissure) between them. */
const HEMI = 0.505; // how far from the midline each hemisphere's centre sits, as a share of the half-width
function cerebrumSurface(x: number, phi: number, side = 1): [number, number, number] {
  const [ym, h, w] = profile(x);
  const c = w * HEMI;
  const a = w * (1 - HEMI) * 0.97;
  const y = ym + h * Math.sin(phi);
  // wider low down than up top, like a dome: narrow at the crown, full at the temples
  // the side facing the other hemisphere is flatter, so the two meet in a thin groove instead of a gap
  const cs = Math.cos(phi);
  const lz = a * (cs < 0 ? -((-cs) ** 0.5) : cs) * (1 + 0.16 * Math.max(0, Math.sin(phi)) - 0.1 * Math.max(0, -Math.sin(phi)));
  const g = 1 + 0.022 * ridge(x, y, side * (c + lz)) * 0.5;
  return [x, ym + (y - ym) * g, side * (c + lz * g)];
}
function insideCerebrum(x: number, y: number, z: number) {
  if (Math.abs(x) >= 1) return false;
  const [ym, h, w] = profile(x);
  if (h <= 0 || w <= 0) return false;
  const a = w * (1 - HEMI) * 0.97;
  return ((y - ym) / h) ** 2 + ((Math.abs(z) - w * HEMI) / a) ** 2 < 1;
}
const CB: [number, number, number] = [0.52, 0.2, 0]; // cerebellum centre
const CBA: [number, number, number] = [0.22, 0.11, 0.22]; // and its half-sizes
/** The temporal lobes hang below the front of each hemisphere, tilting up toward the back. */
const TL = { x: -0.14, y: 0.1, z: 0.34, ax: 0.58, ay: 0.1, az: 0.15 };
function temporalSurface(side: number, u: number, v: number): [number, number, number] {
  const th = u * Math.PI;
  const ph = v * Math.PI * 2;
  const r = Math.sin(th);
  const x = TL.x - TL.ax * Math.cos(th);
  return [x, TL.y + TL.ay * r * Math.sin(ph) - (x - TL.x) * 0.22, side * (TL.z + TL.az * r * Math.cos(ph))];
}

/*
 * Folds: where a random wave field crosses zero. Waves that all share one wavelength but
 * point every which way make a winding, branching maze, which is what gyri look like.
 * (Waves of mixed wavelengths make closed rings instead, like a contour map.)
 */
const fieldOf = (n: number, k: number) =>
  Array.from({ length: n }, () => {
    const a = rand() * 6.283;
    const b = Math.acos(rand() * 2 - 1);
    return { dx: Math.sin(b) * Math.cos(a) * k, dy: Math.sin(b) * Math.sin(a) * k, dz: Math.cos(b) * k, p: rand() * 6.283 };
  });
const FINE = fieldOf(26, 30);
const COARSE = fieldOf(18, 15);
const sumWaves = (w: typeof FINE, x: number, y: number, z: number) => {
  let t = 0;
  for (const f of w) t += Math.sin(x * f.dx + y * f.dy + z * f.dz + f.p);
  return t / Math.sqrt(w.length / 2);
};
const wave = (x: number, y: number, z: number) => sumWaves(FINE, x, y, z);
const wave2 = (x: number, y: number, z: number) => sumWaves(COARSE, x, y, z);
/** The cerebellum's folia: fine, nearly horizontal ridges. */
const folia = (x: number, y: number, z: number) => Math.sin(52 * y + 1.4 * Math.sin(9 * x + 2) + 1.2 * Math.sin(8 * z));
function cbSurface(u: number, v: number): [number, number, number] {
  const th = u * Math.PI;
  const ph = v * Math.PI * 2;
  return [CB[0] + CBA[0] * Math.sin(th) * Math.cos(ph), CB[1] + CBA[1] * Math.cos(th), CB[2] + CBA[2] * Math.sin(th) * Math.sin(ph)];
}
/** Marching squares over a surface: returns line segments (x1 y1 z1 x2 y2 z2 ...) where the pattern crosses each level. */
function contours(surf: (u: number, v: number) => [number, number, number], nu: number, nv: number, levels: number[], fn: (x: number, y: number, z: number) => number = wave) {
  const W1 = nv + 1;
  const P3 = new Float32Array((nu + 1) * W1 * 3);
  const F = new Float32Array((nu + 1) * W1);
  for (let i = 0; i <= nu; i++)
    for (let j = 0; j <= nv; j++) {
      const [x, y, z] = surf(i / nu, j / nv);
      const k = i * W1 + j;
      P3[k * 3] = x;
      P3[k * 3 + 1] = y;
      P3[k * 3 + 2] = z;
      F[k] = fn(x, y, z);
    }
  const out: number[] = [];
  for (const L of levels)
    for (let i = 0; i < nu; i++)
      for (let j = 0; j < nv; j++) {
        const c = [i * W1 + j, (i + 1) * W1 + j, (i + 1) * W1 + j + 1, i * W1 + j + 1];
        const cross: number[][] = [];
        for (let e = 0; e < 4; e++) {
          const a = c[e]!;
          const b = c[(e + 1) % 4]!;
          const fa = F[a]! - L;
          const fb = F[b]! - L;
          if (fa * fb < 0) {
            const t = fa / (fa - fb);
            cross.push([P3[a * 3]! + (P3[b * 3]! - P3[a * 3]!) * t, P3[a * 3 + 1]! + (P3[b * 3 + 1]! - P3[a * 3 + 1]!) * t, P3[a * 3 + 2]! + (P3[b * 3 + 2]! - P3[a * 3 + 2]!) * t]);
          }
        }
        if (cross.length === 2) out.push(...cross[0]!, ...cross[1]!);
        else if (cross.length === 4) out.push(...cross[0]!, ...cross[1]!, ...cross[2]!, ...cross[3]!);
      }
  return out;
}

interface Hub {
  name: string;
  branch: string;
  c: [number, number, number];
  x: number;
  y: number;
  z: number;
  nbr: number[];
  charge: number;
  cool: number;
  burst: number; // 0 = idle, then 0..1 as the fibres light up outward
  fibres: number[]; // indices into the fibre arrays
  hobby: boolean;
  thought: boolean; // a small chore or stray thought, not a skill
  text: string;
  sx: number;
  sy: number;
  sz: number;
  labelOn: boolean;
}
interface Signal {
  a: number;
  b: number;
  t: number;
  v: number;
  e: number;
  hop: number;
  c: [number, number, number];
}

/** The clutter: small thoughts and chores that keep the brain busy between the big ideas. */
const THOUGHTS = [
  "reply to that email", "rename that variable", "is the build green?", "one more commit", "check the logs", "back up the database",
  "update the changelog", "write the test first", "clear the cache", "did I push that?", "tabs or spaces?", "why is this centered?",
  "restart the server", "close 14 browser tabs", "read the error properly", "undo, redo, undo", "bump the version", "merge conflict, again",
  "drink water", "stretch", "what's for lunch?", "coffee", "charge the laptop", "sort the inbox", "update the docs", "fix that typo",
  "that edge case...", "ship it Friday?", "ask for a review", "name this function", "delete the dead code", "run the migration",
  "dark mode too?", "does it work offline?", "check the mobile layout", "optimise later", "TODO: do it now", "check the invoice",
  "torque the head bolts", "ride this weekend?", "tidy the cable runs", "check the chain tension", "e4 or d4?", "think three moves ahead",
  "loop the backhand", "serve short", "fresh thermal paste", "fan curves", "did I lock the door?", "what was that song?",
  "need a haircut", "weather today?", "ten more minutes", "where did I leave my keys?", "how is that still failing?", "save the file",
  "remember the milk", "is it Friday yet?", "label the cables", "take a break", "ping the client", "git status",
  "turn it off and on", "who wrote this? oh, me", "mute the notifications", "one small refactor", "just one more feature", "read the docs, again",
];
/** Two control points that bend a line into an S, so paths meander like axons instead of running straight. */
function sCurve(a: readonly [number, number, number], b: readonly [number, number, number], amount: number): number[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const uz = dz / len;
  let rx = rand() - 0.5;
  let ry = rand() - 0.5;
  let rz = rand() - 0.5;
  const dot = rx * ux + ry * uy + rz * uz;
  rx -= dot * ux;
  ry -= dot * uy;
  rz -= dot * uz;
  const rl = Math.hypot(rx, ry, rz) || 1;
  rx /= rl;
  ry /= rl;
  rz /= rl;
  const k1 = len * amount * (0.7 + rand() * 0.7);
  const k2 = len * amount * (0.6 + rand() * 0.8);
  return [a[0] + dx / 3 + rx * k1, a[1] + dy / 3 + ry * k1, a[2] + dz / 3 + rz * k1, a[0] + (2 * dx) / 3 - rx * k2, a[1] + (2 * dy) / 3 - ry * k2, a[2] + (2 * dz) / 3 - rz * k2];
}
const bez = (p0: number, p1: number, p2: number, p3: number, u: number) => {
  const v = 1 - u;
  return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3;
};
const D = 3.6; // camera distance
/** Once the door has been raised, coming back raises it for you. */
let seenOpen = false;

export function GarageVault({ onClose }: { onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const turnRef = useRef(0); // scroll distance so far
  const openRef = useRef(0); // eased 0..1
  const zoomRef = useRef(1);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [pct, setPct] = useState(0);
  const [touched, setTouched] = useState(false);
  const [stats, setStats] = useState({ fired: 0, ideas: 0, chain: 0, sync: 0, trail: [] as string[] });
  const TURN_TOTAL = 1100;

  // Lowering the door is the way out: it comes down, then the page comes back.
  const requestClose = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    turnRef.current = 0;
    setLeaving(true);
  }, []);

  // Dim the page and hold focus here until it is closed.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", key);
    // Been here before: the door lifts by itself once it has landed.
    const auto = seenOpen ? window.setTimeout(() => (turnRef.current = TURN_TOTAL), 1500) : 0;
    return () => {
      window.clearTimeout(auto);
      window.removeEventListener("keydown", key);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [requestClose]);

  const addTurn = useCallback((d: number) => {
    turnRef.current = Math.min(TURN_TOTAL, Math.max(0, turnRef.current + d));
  }, []);

  // Scrolling raises the door. Once it is up, scrolling zooms the brain instead.
  useEffect(() => {
    const v = root.current!;
    const wheel = (e: WheelEvent) => {
      if (leavingRef.current) return;
      // Keep scrolling while the door is still rising and the extra is simply absorbed; zoom only once it has settled.
      if (turnRef.current < TURN_TOTAL || openRef.current < 0.985) addTurn(e.deltaY);
      else zoomRef.current = Math.min(2.4, Math.max(0.7, zoomRef.current * Math.exp(-e.deltaY * 0.0012)));
    };
    let ty: number | null = null;
    const ts = (e: TouchEvent) => (ty = e.touches[0]?.clientY ?? null);
    const tm = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (ty === null || y === undefined || turnRef.current >= TURN_TOTAL || leavingRef.current) return;
      addTurn((ty - y) * 2.2);
      ty = y;
    };
    const keys = (e: KeyboardEvent) => {
      if (e.target !== v || leavingRef.current) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const up = e.key === "ArrowUp" || e.key === "PageUp";
      if (down || up) {
        e.preventDefault();
        addTurn(down ? 150 : -150);
      }
    };
    v.addEventListener("wheel", wheel, { passive: true });
    v.addEventListener("touchstart", ts, { passive: true });
    v.addEventListener("touchmove", tm, { passive: true });
    v.addEventListener("keydown", keys);
    return () => {
      v.removeEventListener("wheel", wheel);
      v.removeEventListener("touchstart", ts);
      v.removeEventListener("touchmove", tm);
      v.removeEventListener("keydown", keys);
    };
  }, [addTurn]);

  // The brain.
  useEffect(() => {
    const cv = canvas.current!;
    const frame = box.current!;
    const lab = labels.current!;
    const live = document.documentElement.classList.contains("motion-on");
    const ctx = cv.getContext("2d")!;

    /* ---------- build the brain: a cloud of points ---------- */
    const pts: number[] = [];
    const accent: number[] = [];
    const add = (x: number, y: number, z: number) => {
      if (pts.length / 3 % 11 === 0) accent.push(pts.length / 3);
      pts.push(x, y, z);
    };
    // cerebrum: points on and just under the folded surface, thinned in the valleys
    for (let i = 0, guard = 0; i < 6200 && guard < 90000; guard++) {
      const x = rand() * 2 - 1;
      const [ym, h, w] = profile(x);
      if (rand() > (h + w) / 1.0) continue;
      const phi = rand() * Math.PI * 2;
      const side = rand() < 0.5 ? -1 : 1;
      const [sx, sy, sz] = cerebrumSurface(x, phi, side);
      if (ridge(sx, sy, sz) < -0.2 && rand() < 0.55) continue;
      const k = rand() < 0.2 ? rand() ** 0.5 : 1 - Math.abs(gauss()) * 0.06;
      const zc = side * w * HEMI;
      add(sx, ym + (sy - ym) * k, zc + (sz - zc) * k);
      i++;
    }
    // temporal lobes
    for (let i = 0; i < 900; i++) {
      const [x, y, z] = temporalSurface(i % 2 ? 1 : -1, rand(), rand());
      if (insideCerebrum(x, y, z)) continue;
      add(x, y, z);
    }
    // cerebellum: a small rounded lobe tucked under the back of the brain
    for (let i = 0; i < 800; i++) {
      const [x, y, z] = cbSurface(Math.acos(rand() * 2 - 1) / Math.PI, rand());
      const k = rand() < 0.15 ? rand() ** 0.5 : 1;
      const px = CB[0] + (x - CB[0]) * k;
      const py = CB[1] + (y - CB[1]) * k;
      if (insideCerebrum(px, py, (z - CB[2]) * k)) continue;
      add(px, py, (z - CB[2]) * k);
    }
    // brain stem, tapering as it runs down
    for (let i = 0; i < 520; i++) {
      const t = rand();
      const a = rand() * Math.PI * 2;
      const rad = 0.06 * (1 - t * 0.5);
      add(0.14 + t * 0.06 + Math.cos(a) * rad, 0.12 + t * 0.3, Math.sin(a) * rad);
    }
    const P = new Float32Array(pts);
    const N = P.length / 3;

    /* ---------- hubs (skills), their fibre bundles and the links between them ---------- */
    const branchOf = graphNodes.map((n) => n.branch as string);
    const seen: Record<string, number> = {};
    const hubs: Hub[] = graphNodes.map((n, i) => {
      const br = branchOf[i]!;
      const k = (seen[br] = (seen[br] ?? 0) + 1) - 1;
      const [lx, ly, lz] = LOBE[br]!;
      const a = k * 2.4;
      let x = lx + Math.cos(a) * 0.2 * (0.5 + rand() * 0.6);
      let y = ly + Math.sin(a) * 0.15 * (0.5 + rand() * 0.6);
      let z = (rand() - 0.5) * 0.7;
      if (br === "Garage") {
        x = CB[0] + (k ? 0.08 : -0.08);
        y = CB[1] + (k ? 0.02 : 0);
        z = k ? 0.1 : -0.1;
      } else {
        // each skill sits inside one hemisphere, off the midline
        const sd = rand() < 0.5 ? -1 : 1;
        const zr = 0.7 + rand() * 0.6;
        for (let t = 0; t < 40; t++) {
          z = sd * profile(x)[2] * HEMI * zr;
          if (insideCerebrum(x, CEN + (y - CEN) * 1.12, z * 1.1)) break;
          x *= 0.95;
          y = CEN + (y - CEN) * 0.95;
        }
      }
      return { name: n.name, branch: br, c: BRANCH_COLOR[br] ?? [255, 255, 255], x, y, z, nbr: [], charge: 0, cool: 0, burst: 0, fibres: [], hobby: br === "Garage", thought: false, text: "", sx: 0, sy: 0, sz: 0, labelOn: false };
    });
    const index = new Map(graphNodes.map((n, i) => [n.id, i]));
    const edges: [number, number][] = graphEdges.map(([a, b]) => [index.get(a)!, index.get(b)!]);
    for (const [a, b] of edges) {
      hubs[a]!.nbr.push(b);
      hubs[b]!.nbr.push(a);
    }
    // The clutter: a few hundred small neurons scattered through the cortex, linked to their neighbours and to the skills nearby.
    const H0 = hubs.length;
    const order = THOUGHTS.map((t) => [rand(), t] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    for (let i = 0, guard = 0; i < 300 && guard < 20000; guard++) {
      const x = rand() * 1.8 - 0.9;
      const [ym, h, w] = profile(x);
      const y = ym + (rand() * 2 - 1) * h * 0.88;
      const z = (rand() * 2 - 1) * w * 0.88;
      if (!insideCerebrum(x, y, z) || Math.abs(z) < 0.04) continue;
      hubs.push({ name: "", branch: "Thought", c: [200, 215, 255], x, y, z, nbr: [], charge: 0, cool: 0, burst: 0, fibres: [], hobby: false, thought: true, text: order[i % order.length]!, sx: 0, sy: 0, sz: 0, labelOn: false });
      i++;
    }
    const tLinks: [number, number][] = [];
    const tC: number[] = []; // two 3D control points per link
    const tLinkOf = new Map<string, number>();
    const seenLink = new Set<string>();
    const link = (a: number, b: number) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (a === b || seenLink.has(k)) return;
      seenLink.add(k);
      tLinkOf.set(`${a}-${b}`, tLinks.length);
      tLinkOf.set(`${b}-${a}`, tLinks.length);
      tLinks.push([a, b]);
      tC.push(...sCurve([hubs[a]!.x, hubs[a]!.y, hubs[a]!.z], [hubs[b]!.x, hubs[b]!.y, hubs[b]!.z], 0.34));
      hubs[a]!.nbr.push(b);
      hubs[b]!.nbr.push(a);
    };
    const dist = (a: number, b: number) => Math.hypot(hubs[a]!.x - hubs[b]!.x, hubs[a]!.y - hubs[b]!.y, hubs[a]!.z - hubs[b]!.z);
    for (let a = H0; a < hubs.length; a++) {
      const near = [] as { b: number; d: number }[];
      for (let b = H0; b < hubs.length; b++) if (b !== a) near.push({ b, d: dist(a, b) });
      near.sort((m, n) => m.d - n.d);
      for (const n of near.slice(0, 3)) link(a, n.b);
      let best = -1;
      let bd = 0.3;
      for (let b = 0; b < H0; b++) {
        const d = dist(a, b);
        if (d < bd) {
          bd = d;
          best = b;
        }
      }
      if (best >= 0 && rand() < 0.7) link(a, best);
    }

    // Links between skills: S-shaped tracts.
    const edgeC = edges.map(([a, b]) => sCurve([hubs[a]!.x, hubs[a]!.y, hubs[a]!.z], [hubs[b]!.x, hubs[b]!.y, hubs[b]!.z], 0.3));
    const edgeOf = new Map(edges.map(([a, b], i) => [`${a}-${b}`, i] as const));
    edges.forEach(([a, b], i) => edgeOf.set(`${b}-${a}`, i));

    // fibres: hub -> a point on the cortex, with a slight bend
    const FH: number[] = []; // hub index
    const FC: number[] = []; // two control points (xyz each) per fibre
    const FE: number[] = []; // end xyz
    hubs.forEach((h, hi) => {
      if (h.thought) return; // only skills throw out fibre bundles
      const count = h.hobby ? 34 : 52;
      const cx = h.hobby ? CB[0] : 0;
      const cy = h.hobby ? CB[1] : CEN;
      const l = Math.hypot(h.x - cx, h.y - cy, h.z) || 1;
      for (let i = 0; i < count; i++) {
        let dx = (h.x - cx) / l + gauss() * 0.6;
        let dy = (h.y - cy) / l + gauss() * 0.6;
        let dz = h.z / l + gauss() * 0.8;
        const dl = Math.hypot(dx, dy, dz) || 1;
        dx /= dl;
        dy /= dl;
        dz /= dl;
        let ex: number;
        let ey: number;
        let ez: number;
        if (h.hobby) {
          ex = CB[0] + dx * CBA[0] * 0.97;
          ey = CB[1] + dy * CBA[1] * 0.97;
          ez = dz * CBA[2] * 0.97;
        } else {
          // walk outward from the hub until the cortex is reached
          let px = h.x;
          let py = h.y;
          let pz = h.z;
          for (let t = 0; t < 120 && insideCerebrum(px + dx * 0.02, py + dy * 0.02, pz + dz * 0.02); t++) {
            px += dx * 0.02;
            py += dy * 0.02;
            pz += dz * 0.02;
          }
          ex = px;
          ey = py;
          ez = pz;
        }
        h.fibres.push(FH.length);
        FH.push(hi);
        FC.push(...sCurve([h.x, h.y, h.z], [ex, ey, ez], 0.3));
        FE.push(ex, ey, ez);
      }
    });
    const FN = FH.length;
    // faint blue filaments that wrap the cortex
    const GA: number[] = [];
    for (let i = 0; i < 70; i++) {
      const dir = (): [number, number, number] => cerebrumSurface(rand() * 1.9 - 0.95, rand() * Math.PI * 2, rand() < 0.5 ? -1 : 1);
      const a = dir();
      let b = dir();
      for (let t = 0; t < 8 && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > 0.9; t++) b = dir();
      GA.push(a[0], a[1], a[2], ((a[0] + b[0]) / 2) * 1.04, ((a[1] + b[1]) / 2) * 1.12 - 0.06, ((a[2] + b[2]) / 2) * 1.15, b[0], b[1], b[2]);
    }

    // The folded surface, the cerebellum's layers and the stem, as light lines.
    const seg: number[] = [];
    const keep = (out: number[], dropInside: boolean) => {
      for (let i = 0; i < out.length; i += 6) {
        const mx = (out[i]! + out[i + 3]!) / 2;
        const my = (out[i + 1]! + out[i + 4]!) / 2;
        const mz = (out[i + 2]! + out[i + 5]!) / 2;
        if (dropInside && insideCerebrum(mx, my, mz)) continue;
        seg.push(out[i]!, out[i + 1]!, out[i + 2]!, out[i + 3]!, out[i + 4]!, out[i + 5]!);
      }
    };
    for (const side of [-1, 1]) keep(contours((u, v) => cerebrumSurface(-1 + u * 2, v * Math.PI * 2, side), 340, 100, [0, 0.45, -0.45]), false);
    for (const side of [-1, 1]) keep(contours((u, v) => temporalSurface(side, u, v), 90, 60, [0, 0.5, -0.5]), true);
    keep(contours(cbSurface, 70, 70, [0, 0.45, -0.45], folia), true);
    for (let q = 0; q < 3; q++) {
      // brain stem: a slim tube drawn with a few long lines
      const a = (q / 3) * Math.PI * 2 + 0.5;
      for (let t = 0; t < 12; t++) {
        const f = (tt: number) => [0.14 + tt * 0.06 + Math.cos(a) * 0.06 * (1 - tt * 0.5), 0.1 + tt * 0.32, Math.sin(a) * 0.06 * (1 - tt * 0.5)] as const;
        seg.push(...f(t / 12), ...f((t + 1) / 12));
      }
    }
    // the deeper folds: fewer, longer, and brighter
    const segC: number[] = [];
    {
      for (const side of [-1, 1]) {
        const out = contours((u, v) => cerebrumSurface(-1 + u * 2, v * Math.PI * 2, side), 280, 90, [0], wave2);
        for (let i = 0; i < out.length; i++) segC.push(out[i]!);
      }
    }
    for (const side of [-1, 1]) {
      const out = contours((u, v) => temporalSurface(side, u, v), 70, 50, [0, 0.5], wave2);
      for (let i = 0; i < out.length; i += 6) {
        const mx = (out[i]! + out[i + 3]!) / 2;
        const my = (out[i + 1]! + out[i + 4]!) / 2;
        const mz = (out[i + 2]! + out[i + 5]!) / 2;
        if (insideCerebrum(mx, my, mz)) continue;
        for (let k = 0; k < 6; k++) segC.push(out[i + k]!);
      }
    }
    // corpus callosum: a thick arch of fibres joining the two hemispheres
    const segW: number[] = [];
    for (let k = 0; k < 90; k++) {
      const x = -0.4 + (0.8 * k) / 90 + (rand() - 0.5) * 0.01;
      const yc = CEN + 0.04 + 0.16 * (x / 0.45) ** 2;
      for (let t = 0; t < 14; t++) {
        const f = (tt: number) => {
          const zz = (tt * 2 - 1) * 0.24;
          return [x, yc - 0.12 * (1 - (zz / 0.24) ** 2) ** 0.7, zz] as const;
        };
        segW.push(...f(t / 14), ...f((t + 1) / 14));
      }
    }
    // hippocampus: a curled glowing tube inside each temporal lobe
    const hip: number[][] = [];
    for (const side of [-1, 1]) {
      const path: number[] = [];
      for (let t = 0; t <= 24; t++) {
        const u = t / 24;
        path.push(-0.06 + u * 0.4, 0.11 - 0.14 * u + 0.05 * Math.sin(u * 3.2), side * (0.32 - 0.1 * u));
      }
      hip.push(path);
    }
    const SEG = new Float32Array(seg);
    const SEGC = new Float32Array(segC);
    const SEGW = new Float32Array(segW);
    const NC = SEGC.length / 6;
    const NW = SEGW.length / 6;
    const bufC = new Float32Array(NC * 5);
    const bufW = new Float32Array(NW * 5);
    const NS = SEG.length / 6;
    const segP = new Float32Array(NS * 5);

    const spans = hubs.slice(0, H0).map((h) => {
      const el = document.createElement("span");
      el.textContent = h.hobby ? `${h.name} · self-reported` : h.name;
      el.className = "is-skill";
      el.style.color = rgb(h.c);
      lab.appendChild(el);
      return el;
    });

    // a small pool of labels for the stray thoughts that flash by
    const pool = Array.from({ length: 3 }, () => {
      const el = document.createElement("span");
      el.className = "is-thought";
      lab.appendChild(el);
      return { el, node: -1, t: 0, dur: 3.6 };
    });
    let lastLabel = -9;
    const LABEL_S = 3.6;
    const labT = new Float32Array(H0); // seconds left on each skill's name tag
    const pending: number[] = []; // skills waiting for a free name tag
    const tagsBusy = (i: number) => {
      let n = 0;
      for (let k = 0; k < H0; k++) {
        if (labT[k]! <= 0) continue;
        n++;
        if (k !== i && Math.hypot(hubs[k]!.sx - hubs[i]!.sx, hubs[k]!.sy - hubs[i]!.sy) < 150) return true;
      }
      return n >= 3;
    };

    /* ---------- camera ---------- */
    let cw = 0;
    let ch = 0;
    let K = 1;
    let yaw = 0.5;
    let pitch = 0.36;
    let vYaw = 0;
    let vPitch = 0;
    let idleFor = 0;
    let focus: { yaw: number; pitch: number } | null = null;
    let cY = 1;
    let sY = 0;
    let cP = 1;
    let sP = 0;
    let PX = 0;
    let PY = 0;
    let PZ = 0;
    let PS = 1;
    const setCam = () => {
      cY = Math.cos(yaw);
      sY = Math.sin(yaw);
      cP = Math.cos(pitch);
      sP = Math.sin(pitch);
    };
    const project = (x: number, y0: number, z: number) => {
      const y = y0 + 0.14;
      const x1 = x * cY + z * sY;
      const z1 = -x * sY + z * cY;
      const y2 = y * cP - z1 * sP;
      const z2 = y * sP + z1 * cP;
      PS = D / (D - z2);
      PX = cw / 2 + x1 * PS * K;
      PY = ch / 2 + y2 * PS * K;
      PZ = z2;
    };
    const layout = () => {
      const r = frame.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cw = r.width;
      ch = r.height;
      cv.width = Math.round(cw * dpr);
      cv.height = Math.round(ch * dpr);
      K = Math.min(cw / 2.2, ch / 2.15) * zoomRef.current;
    };

    /* ---------- the thinking ---------- */
    const signals: Signal[] = [];
    const fires: number[] = [];
    let thoughtsFired = 0;
    let ideas = 0;
    let chain = 0;
    let sync = 0;
    let trail: string[] = [];
    let surge = 0; // 0 = none, else radius sweeping outward
    let surgeCool = 0;
    let pulse = 0;
    let t = 0;
    let idle = 0.5;
    let hover = -1;
    const fire = (i: number, e: number, hop: number, from = -1, force = false) => {
      const h = hubs[i]!;
      if (h.thought) {
        h.charge = 1;
        h.cool = 0.5;
        thoughtsFired++;
        // Only some thoughts get words, one at a time and unhurried, so each can be read.
        if (force || t - lastLabel > 1.1) {
          let slot = pool.find((sl) => sl.t <= 0);
          if (!slot && force) slot = pool.reduce((m, sl) => (sl.t < m.t ? sl : m));
          if (slot) {
            slot.node = i;
            slot.t = slot.dur = 3.6;
            slot.el.textContent = h.text;
            lastLabel = t;
          }
        }
        if (e > 0.12) {
          for (const j of h.nbr) {
            if (j === from) continue;
            if (rand() < 0.35 + e * 0.4) signals.push({ a: i, b: j, t: 0, v: 0.8 + rand() * 0.5, e, hop, c: hubs[j]!.thought ? h.c : [255, 255, 255] });
          }
        }
        return;
      }
      h.charge = 1;
      h.cool = 2.4;
      h.burst = 0.001;
      ideas++;
      if (labT[i]! <= 0 && !pending.includes(i)) {
        if (!tagsBusy(i)) labT[i] = LABEL_S;
        else if (pending.length < 4) pending.push(i);
      }
      chain = Math.max(chain, hop + 1);
      fires.push(t);
      trail = [...trail.slice(-3), h.name];
      if (e > 0.15) {
        for (const j of h.nbr) {
          if (j === from) continue;
          if (rand() < Math.min(1, 0.5 + e * 0.5)) signals.push({ a: i, b: j, t: 0, v: hubs[j]!.thought ? 0.8 + rand() * 0.45 : 0.45 + rand() * 0.4, e: hubs[j]!.thought ? 0.7 : e, hop, c: h.c });
        }
      }
    };
    const step = (dt: number) => {
      t += dt;
      for (const h of hubs) {
        h.charge = Math.max(0, h.charge - dt * (h.thought ? 1.25 : 0.42));
        h.cool -= dt;
        if (h.burst > 0) h.burst = h.burst + dt * 1.1 > 1 ? 0 : h.burst + dt * 1.1;
      }
      idle -= dt;
      if (idle <= 0) {
        // mostly stray thoughts; now and then a skill lights up on its own
        if (rand() < 0.1) fire(Math.floor(rand() * H0), 0.95, 0);
        else fire(H0 + Math.floor(rand() * (hubs.length - H0)), 0.62, 0);
        idle = 0.45 + rand() * 0.6;
      }
      for (const sl of pool) if (sl.t > 0) sl.t -= dt;
      for (let k = 0; k < H0; k++) if (labT[k]! > 0) labT[k] = labT[k]! - dt;
      for (let q = 0; q < pending.length; q++) {
        const k = pending[q]!;
        if (!tagsBusy(k)) {
          labT[k] = LABEL_S;
          pending.splice(q, 1);
          break;
        }
      }
      for (let k = signals.length - 1; k >= 0; k--) {
        const s = signals[k]!;
        s.t += dt * s.v;
        if (s.t >= 1) {
          signals.splice(k, 1);
          const target = hubs[s.b]!;
          const from = hubs[s.a]!;
          if (target.cool > 0) continue;
          if (from.thought && !target.thought) {
            // enough background thinking reaching a skill can turn into an idea
            if (rand() < 0.12) fire(s.b, 0.9, 0, s.a);
          } else if (target.thought) {
            if (rand() < Math.min(1, s.e + 0.25)) fire(s.b, s.e - 0.3, s.hop + 1, s.a);
          } else if (rand() < Math.min(1, s.e - 0.1)) fire(s.b, s.e - 0.45, s.hop + 1, s.a);
        }
      }
      while (fires.length && fires[0]! < t - 3) fires.shift();
      surgeCool -= dt;
      if (!surge && surgeCool <= 0 && fires.length >= 12) {
        surge = 0.001;
        surgeCool = 9;
        sync++;
        pulse = 1;
        hubs.forEach((h) => {
          h.charge = 1;
          h.burst = 0.001;
        });
      }
      pulse = Math.max(0, pulse - dt * 0.55);
      if (surge) surge = surge + dt * 1.6 > 1 ? 0 : surge + dt * 1.6;
      // orbit: inertia, then a slow drift while nobody is touching it
      idleFor += dt;
      if (focus) {
        let dy = focus.yaw - yaw;
        dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        yaw += dy * Math.min(1, dt * 3);
        pitch += (focus.pitch - pitch) * Math.min(1, dt * 3);
        if (Math.abs(dy) < 0.01) focus = null;
      } else {
        yaw += vYaw;
        pitch = Math.max(-1.1, Math.min(1.1, pitch + vPitch));
        vYaw *= 0.93;
        vPitch *= 0.93;
        if (idleFor > 2.5) yaw += dt * 0.12;
      }
    };

    /* ---------- drawing ---------- */
    const bucketX: Float32Array[] = [0, 1, 2, 3].map(() => new Float32Array(N));
    const bucketY: Float32Array[] = [0, 1, 2, 3].map(() => new Float32Array(N));
    const counts = [0, 0, 0, 0];
    const ALPHA = [0.12, 0.26, 0.45, 0.72];
    const fibreX = new Float32Array(FN * 6); // per fibre: end, control 1, control 2 (screen xy)
    const tP = new Float32Array(tLinks.length * 4);
    const draw = () => {
      K = Math.min(cw / 2.2, ch / 2.15) * zoomRef.current;
      setCam();
      const dpr = cv.width / cw;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = "source-over";
      const lift = 0.35 + pulse * 0.4;

      // cortex: bucketed by depth so near points are brighter
      counts.fill(0);
      for (let i = 0; i < N; i++) {
        project(P[i * 3]!, P[i * 3 + 1]!, P[i * 3 + 2]!);
        const b = Math.max(0, Math.min(3, ((PZ + 1.1) / 2.2) * 4)) | 0;
        const c = counts[b]!++;
        bucketX[b]![c] = PX;
        bucketY[b]![c] = PY;
      }
      for (let b = 0; b < 4; b++) {
        ctx.fillStyle = `rgba(120,195,235,${Math.min(1, ALPHA[b]! * (0.7 + lift))})`;
        const sz = 0.9 + b * 0.35;
        for (let i = 0; i < counts[b]!; i++) ctx.fillRect(bucketX[b]![i]!, bucketY[b]![i]!, sz, sz);
      }
      ctx.fillStyle = `rgba(250,238,160,${0.45 + pulse * 0.4})`;
      for (const i of accent) {
        project(P[i * 3]!, P[i * 3 + 1]!, P[i * 3 + 2]!);
        ctx.fillRect(PX, PY, 1.8, 1.8);
      }

      ctx.globalCompositeOperation = "lighter";
      // a soft glow at the centre of the brain, warmer at the core
      project(0.05, CEN + 0.05, 0);
      const bgGlow = ctx.createRadialGradient(PX, PY, 0, PX, PY, K * 1.1);
      bgGlow.addColorStop(0, `rgba(255,170,100,${0.1 + pulse * 0.12})`);
      bgGlow.addColorStop(0.35, `rgba(110,100,255,${0.13 + pulse * 0.1})`);
      bgGlow.addColorStop(1, "rgba(60,60,200,0)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(PX - K * 1.2, PY - K * 1.2, K * 2.4, K * 2.4);
      // the folded cortex: lines nearer the camera are brighter
      const lineSet = (S: Float32Array, buf: Float32Array, n: number, alphas: number[], w: number, col: string) => {
        for (let i = 0; i < n; i++) {
          project(S[i * 6]!, S[i * 6 + 1]!, S[i * 6 + 2]!);
          buf[i * 5] = PX;
          buf[i * 5 + 1] = PY;
          const z1 = PZ;
          project(S[i * 6 + 3]!, S[i * 6 + 4]!, S[i * 6 + 5]!);
          buf[i * 5 + 2] = PX;
          buf[i * 5 + 3] = PY;
          buf[i * 5 + 4] = (z1 + PZ) / 2;
        }
        for (let b = 0; b < 3; b++) {
          ctx.strokeStyle = `rgba(${col},${(alphas[b]! * (0.85 + pulse * 0.6)).toFixed(3)})`;
          ctx.lineWidth = w + b * 0.3;
          ctx.beginPath();
          for (let i = 0; i < n; i++) {
            // lines on the far side are dim, on the near side brighter, and along the silhouette brightest
            const z = buf[i * 5 + 4]!;
            const bz = Math.abs(z) < 0.28 ? 2 : z > 0 ? 1 : 0;
            if (bz !== b) continue;
            ctx.moveTo(buf[i * 5]!, buf[i * 5 + 1]!);
            ctx.lineTo(buf[i * 5 + 2]!, buf[i * 5 + 3]!);
          }
          ctx.stroke();
        }
      };
      lineSet(SEG, segP, NS, [0.05, 0.26, 0.75], 0.7, "150,215,255");
      lineSet(SEGC, bufC, NC, [0.1, 0.5, 1], 1.0, "190,235,255");
      lineSet(SEGW, bufW, NW, [0.07, 0.12, 0.2], 0.7, "255,205,150");
      // hippocampus: a warm glowing tube
      for (const path of hip) {
        ctx.beginPath();
        for (let i = 0; i < path.length; i += 3) {
          project(path[i]!, path[i + 1]!, path[i + 2]!);
          i ? ctx.lineTo(PX, PY) : ctx.moveTo(PX, PY);
        }
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(255,150,60,${0.2 + pulse * 0.3})`;
        ctx.lineWidth = 7;
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,205,140,${0.7 + pulse * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      // ghost filaments wrapping the surface
      ctx.strokeStyle = `rgba(110,185,230,${0.04 + pulse * 0.08})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let i = 0; i < GA.length; i += 9) {
        project(GA[i]!, GA[i + 1]!, GA[i + 2]!);
        ctx.moveTo(PX, PY);
        project(GA[i + 3]!, GA[i + 4]!, GA[i + 5]!);
        const qx = PX;
        const qy = PY;
        project(GA[i + 6]!, GA[i + 7]!, GA[i + 8]!);
        ctx.quadraticCurveTo(qx, qy, PX, PY);
      }
      ctx.stroke();

      // hubs: where they are on screen
      for (const h of hubs) {
        project(h.x, h.y, h.z);
        h.sx = PX;
        h.sy = PY;
        h.sz = PZ;
      }
      // the clutter: faint, curving links between stray thoughts, and the thoughts themselves
      for (let l = 0; l < tLinks.length; l++) {
        project(tC[l * 6]!, tC[l * 6 + 1]!, tC[l * 6 + 2]!);
        tP[l * 4] = PX;
        tP[l * 4 + 1] = PY;
        project(tC[l * 6 + 3]!, tC[l * 6 + 4]!, tC[l * 6 + 5]!);
        tP[l * 4 + 2] = PX;
        tP[l * 4 + 3] = PY;
      }
      for (const lit of [false, true]) {
        ctx.lineWidth = lit ? 1 : 0.6;
        ctx.strokeStyle = lit ? "rgba(225,235,255,0.45)" : `rgba(140,170,255,${0.08 + pulse * 0.12})`;
        ctx.beginPath();
        for (let l = 0; l < tLinks.length; l++) {
          const [a, b] = tLinks[l]!;
          const A = hubs[a]!;
          const B = hubs[b]!;
          if (lit && A.charge + B.charge < 0.1) continue;
          ctx.moveTo(A.sx, A.sy);
          ctx.bezierCurveTo(tP[l * 4]!, tP[l * 4 + 1]!, tP[l * 4 + 2]!, tP[l * 4 + 3]!, B.sx, B.sy);
        }
        ctx.stroke();
      }
      for (let i = H0; i < hubs.length; i++) {
        const h = hubs[i]!;
        const near = 0.3 + 0.7 * Math.max(0, Math.min(1, (h.sz + 1) / 2));
        const c = h.charge;
        ctx.fillStyle = `rgba(210,225,255,${(0.28 + c * 0.7) * near})`;
        const r = 1 + c * 1.8;
        ctx.fillRect(h.sx - r, h.sy - r, r * 2, r * 2);
        if (c > 0.05) {
          ctx.fillStyle = `rgba(190,210,255,${c * 0.22})`;
          ctx.fillRect(h.sx - 7, h.sy - 7, 14, 14);
        }
      }
      // fibre bundles, one stroke per branch colour
      for (const br of Object.keys(BRANCH_COLOR)) {
        const c = BRANCH_COLOR[br]!;
        ctx.strokeStyle = rgb(c, 0.16 + pulse * 0.12);
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        for (let hi = 0; hi < hubs.length; hi++) {
          const h = hubs[hi]!;
          if (h.branch !== br) continue;
          for (const f of h.fibres) {
            project(FC[f * 6]!, FC[f * 6 + 1]!, FC[f * 6 + 2]!);
            fibreX[f * 6 + 2] = PX;
            fibreX[f * 6 + 3] = PY;
            project(FC[f * 6 + 3]!, FC[f * 6 + 4]!, FC[f * 6 + 5]!);
            fibreX[f * 6 + 4] = PX;
            fibreX[f * 6 + 5] = PY;
            project(FE[f * 3]!, FE[f * 3 + 1]!, FE[f * 3 + 2]!);
            fibreX[f * 6] = PX;
            fibreX[f * 6 + 1] = PY;
            ctx.moveTo(h.sx, h.sy);
            ctx.bezierCurveTo(fibreX[f * 6 + 2]!, fibreX[f * 6 + 3]!, fibreX[f * 6 + 4]!, fibreX[f * 6 + 5]!, PX, PY);
          }
        }
        ctx.stroke();
        // the ends of the fibres, like sparks on the cortex
        ctx.fillStyle = rgb([Math.min(255, c[0] + 60), Math.min(255, c[1] + 60), Math.min(255, c[2] + 60)], 0.75);
        for (let hi = 0; hi < hubs.length; hi++) {
          const h = hubs[hi]!;
          if (h.branch !== br) continue;
          for (const f of h.fibres) ctx.fillRect(fibreX[f * 6]! - 0.8, fibreX[f * 6 + 1]! - 0.8, 1.7, 1.7);
        }
      }
      // links between hubs: the long tracts
      edges.forEach(([a, b], i) => {
        const A = hubs[a]!;
        const B = hubs[b]!;
        const e = edgeC[i]!;
        project(e[0]!, e[1]!, e[2]!);
        const q1x = PX;
        const q1y = PY;
        project(e[3]!, e[4]!, e[5]!);
        const glow = Math.max(A.charge, B.charge);
        ctx.strokeStyle = `rgba(255,232,170,${0.08 + glow * 0.45})`;
        ctx.lineWidth = 0.8 + glow * 1.2;
        ctx.beginPath();
        ctx.moveTo(A.sx, A.sy);
        ctx.bezierCurveTo(q1x, q1y, PX, PY, B.sx, B.sy);
        ctx.stroke();
      });
      // a firing hub lights its whole bundle and sends a wave out along it
      for (const h of hubs) {
        if (h.charge <= 0.02) continue;
        ctx.strokeStyle = rgb(h.c, h.charge * 0.55);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (const f of h.fibres) {
          ctx.moveTo(h.sx, h.sy);
          ctx.bezierCurveTo(fibreX[f * 6 + 2]!, fibreX[f * 6 + 3]!, fibreX[f * 6 + 4]!, fibreX[f * 6 + 5]!, fibreX[f * 6]!, fibreX[f * 6 + 1]!);
        }
        ctx.stroke();
        if (h.burst > 0) {
          const u = h.burst;
          ctx.fillStyle = rgb([255, 255, 255], 1 - u * 0.6);
          for (const f of h.fibres) {
            const x = bez(h.sx, fibreX[f * 6 + 2]!, fibreX[f * 6 + 4]!, fibreX[f * 6]!, u);
            const y = bez(h.sy, fibreX[f * 6 + 3]!, fibreX[f * 6 + 5]!, fibreX[f * 6 + 1]!, u);
            ctx.fillRect(x - 1.2, y - 1.2, 2.6, 2.6);
          }
        }
      }
      // signals riding the tracts
      for (const s of signals) {
        const ei = edgeOf.get(`${s.a}-${s.b}`);
        const A = hubs[s.a]!;
        const B = hubs[s.b]!;
        const forward = ei !== undefined ? edges[ei]![0] === s.a : (tLinks[tLinkOf.get(`${s.a}-${s.b}`)!]?.[0] ?? -1) === s.a;
        const cc = ei !== undefined ? edgeC[ei]! : (() => {
          const l = tLinkOf.get(`${s.a}-${s.b}`)!;
          return tC.slice(l * 6, l * 6 + 6);
        })();
        // controls are stored from the link's first end; flip them when the signal runs the other way
        const c1 = forward ? [cc[0]!, cc[1]!, cc[2]!] : [cc[3]!, cc[4]!, cc[5]!];
        const c2 = forward ? [cc[3]!, cc[4]!, cc[5]!] : [cc[0]!, cc[1]!, cc[2]!];
        const small = A.thought || B.thought;
        const at = (u: number) => project(bez(A.x, c1[0]!, c2[0]!, B.x, u), bez(A.y, c1[1]!, c2[1]!, B.y, u), bez(A.z, c1[2]!, c2[2]!, B.z, u));
        if (small) {
          at(s.t);
          ctx.fillStyle = rgb(s.c, 0.95);
          ctx.fillRect(PX - 1.2, PY - 1.2, 2.4, 2.4);
          at(Math.max(0, s.t - 0.08));
          ctx.fillStyle = rgb(s.c, 0.4);
          ctx.fillRect(PX - 0.9, PY - 0.9, 1.8, 1.8);
          continue;
        }
        for (let k = 0; k < 8; k++) {
          at(Math.max(0, s.t - k * 0.016));
          ctx.fillStyle = rgb(s.c, (1 - k / 8) * 0.9);
          ctx.beginPath();
          ctx.arc(PX, PY, (2.6 - k * 0.22) * PS, 0, 6.283);
          ctx.fill();
        }
        at(s.t);
        const gl = ctx.createRadialGradient(PX, PY, 0, PX, PY, 14);
        gl.addColorStop(0, rgb(s.c, 0.8));
        gl.addColorStop(1, rgb(s.c, 0));
        ctx.fillStyle = gl;
        ctx.fillRect(PX - 14, PY - 14, 28, 28);
      }
      // the hubs themselves
      hubs.forEach((h, i) => {
        if (h.thought) return;
        const near = 0.55 + 0.45 * Math.max(0, Math.min(1, (h.sz + 1) / 2));
        const c = h.charge;
        const r = (3 + c * 3 + (hover === i ? 2 : 0)) * near;
        const gl = ctx.createRadialGradient(h.sx, h.sy, 0, h.sx, h.sy, 22 + c * 20);
        gl.addColorStop(0, rgb(h.c, 0.35 + c * 0.5));
        gl.addColorStop(1, rgb(h.c, 0));
        ctx.fillStyle = gl;
        ctx.fillRect(h.sx - 44, h.sy - 44, 88, 88);
        ctx.fillStyle = rgb(h.hobby ? [255, 241, 176] : h.c, 1);
        ctx.beginPath();
        ctx.arc(h.sx, h.sy, r, 0, 6.283);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(h.sx, h.sy, r * 0.45, 0, 6.283);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";

      // skill names: shown a few at a time, each held long enough to read, plus whatever you point at
      hubs.forEach((h, i) => {
        const el = spans[i];
        if (!el) return;
        const lt = labT[i]!;
        const fade = lt > 0 ? Math.max(0, Math.min(1, (LABEL_S - lt) / 0.5, lt / 0.7)) : 0;
        const a = Math.max(fade, i === hover ? 1 : 0) * (h.sz > -0.1 ? 1 : 0.25);
        el.style.opacity = a.toFixed(2);
        el.style.transform = `translate(${h.sx.toFixed(1)}px, ${h.sy.toFixed(1)}px) translate(-50%, 16px)`;
        el.style.zIndex = a > 0.5 ? "3" : "1";
      });
      // stray thoughts flash up a short line of text, then fade
      for (const sl of pool) {
        if (sl.t > 0 && sl.node >= 0) {
          const h = hubs[sl.node]!;
          const fade = Math.max(0, Math.min(1, (sl.dur - sl.t) / 0.5, sl.t / 0.7));
          sl.el.style.opacity = String(fade * (h.sz > -0.25 ? 1 : 0.35));
          sl.el.style.transform = `translate(${h.sx.toFixed(1)}px, ${h.sy.toFixed(1)}px) translate(-50%, 10px)`;
        } else if (sl.el.style.opacity !== "0") sl.el.style.opacity = "0";
      }
    };

    /* ---------- pointer: orbit, hover, click ---------- */
    let down: { x: number; y: number; moved: boolean } | null = null;
    let dirty = true;
    const local = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const nearest = (x: number, y: number, max: number, thoughts = false) => {
      let best = -1;
      let bd = max;
      hubs.forEach((h, i) => {
        if (h.thought !== thoughts) return;
        const d = Math.hypot(h.sx - x, h.sy - y);
        if (d < bd && h.sz > -0.35) {
          bd = d;
          best = i;
        }
      });
      return best;
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      down = { x: p.x, y: p.y, moved: false };
      frame.setPointerCapture(e.pointerId);
      setTouched(true);
      idleFor = 0;
      focus = null;
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (down) {
        const dx = p.x - down.x;
        const dy = p.y - down.y;
        if (Math.hypot(dx, dy) > 3) down.moved = true;
        vYaw = dx * 0.0035;
        vPitch = dy * 0.0035;
        yaw += dx * 0.0065;
        pitch = Math.max(-1.1, Math.min(1.1, pitch + dy * 0.0065));
        down.x = p.x;
        down.y = p.y;
        idleFor = 0;
        dirty = true;
      } else {
        hover = nearest(p.x, p.y, 26);
        frame.style.cursor = hover >= 0 ? "pointer" : "grab";
        // brushing past a stray thought sets it off
        for (let i = H0; i < hubs.length; i++) {
          const h = hubs[i]!;
          if (h.cool <= 0 && h.sz > -0.2 && Math.hypot(h.sx - p.x, h.sy - p.y) < 9) fire(i, 0.7, 0, -1, true);
        }
        dirty = true;
      }
    };
    const onUp = (e: PointerEvent) => {
      if (down && !down.moved) {
        const p = local(e);
        const i = nearest(p.x, p.y, 40);
        if (i >= 0) {
          fire(i, 1.3, 0);
          labT[i] = LABEL_S;
          const h = hubs[i]!;
          focus = { yaw: Math.atan2(-h.x, h.z), pitch: 0.1 };
          idleFor = 0;
        } else {
          const j = nearest(p.x, p.y, 34, true);
          if (j >= 0) fire(j, 1.0, 0, -1, true);
        }
      }
      down = null;
      dirty = true;
    };
    const onLeave = () => {
      hover = -1;
    };

    layout();
    const ro = new ResizeObserver(() => {
      layout();
      dirty = true;
    });
    ro.observe(frame);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerup", onUp);
    frame.addEventListener("pointerleave", onLeave);

    // The door eases toward where the scroll has taken it: slow, and heavy.
    let raf = 0;
    let last = performance.now();
    let wasOpen = false;
    let gone = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = turnRef.current / TURN_TOTAL;
      openRef.current += (target - openRef.current) * Math.min(1, dt * (live ? 2.2 : 30));
      const o = openRef.current;
      root.current?.style.setProperty("--open", o.toFixed(4));
      const isOpen = o > 0.96;
      if (isOpen !== wasOpen) {
        wasOpen = isOpen;
        setOpen(isOpen);
        if (isOpen) seenOpen = true;
      }
      if (leavingRef.current && o < 0.02 && !gone) {
        gone = true;
        root.current?.classList.add("is-gone");
        window.setTimeout(() => onCloseRef.current(), 520);
      }
      if (o > 0.02) {
        if (live) {
          step(dt);
          draw();
        } else if (dirty) {
          draw();
          dirty = false;
        }
      }
    };
    raf = requestAnimationFrame(loop);
    const readout = window.setInterval(() => {
      setStats({ fired: thoughtsFired, ideas, chain, sync, trail });
      setPct(Math.round(openRef.current * 100));
    }, 200);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(readout);
      ro.disconnect();
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerup", onUp);
      frame.removeEventListener("pointerleave", onLeave);
      lab.replaceChildren();
    };
  }, []);

  return (
    <div className={`vault${leaving ? " is-leaving" : ""}`} ref={root} role="dialog" aria-modal="true" aria-label="The Garage" tabIndex={0} style={{ "--open": 0 } as React.CSSProperties}>
      <header className="vault__head">
        <div>
          <p className="vault__kicker">Secret quest complete</p>
          <h3>The Garage</h3>
        </div>
        <button type="button" className="vault__close" onClick={requestClose}>
          Leave the garage <span aria-hidden="true">×</span>
        </button>
      </header>

      <div className={`vault__frame${open ? " is-open" : ""}`} ref={box}>
        <canvas ref={canvas} aria-hidden="true" />
        <div className="vault__labels" ref={labels} aria-hidden="true" />
        <p className="vault__chain" aria-hidden="true">
          {stats.trail.join("  ›  ")}
        </p>
        {open && !touched && <p className="vault__hint">Drag to orbit · scroll to zoom · click a neuron</p>}
        <div className="vault__door" aria-hidden="true">
          <span className="vault__sign">Garage</span>
          <span className="vault__cue">
            Scroll
            <i />
          </span>
        </div>
        <span className="vault__rail" aria-hidden="true" />
      </div>

      <div className="vault__controls">
        <ul className="vault__stats" aria-label="Garage readout">
          <li>
            <b>{stats.fired}</b>
            <span>thoughts</span>
          </li>
          <li>
            <b>{stats.ideas}</b>
            <span>ideas</span>
          </li>
          <li>
            <b>{stats.chain}</b>
            <span>longest chain</span>
          </li>
          <li>
            <b>{stats.sync}</b>
            <span>synchronies</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
